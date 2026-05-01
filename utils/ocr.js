/**
 * Google Cloud Vision OCR + Indian DD/MM-first expiry parsing.
 *
 * Example cases that should parse (see parseExpiryFromText):
 * // "EXP 15/06/2026" → 2026-06-15
 * // "EXP: 15-06-26" → 2026-06-15
 * // "USE BY\n15/06/2026" → 2026-06-15
 * // "BEST BEFORE 06/2026" → 2026-06-30
 * // "EXP. JUN 2026" → 2026-06-30
 * // "BB: 15 JUN 26" → 2026-06-15
 * // "MFG 01/01/2025 EXP 01/01/2026" → 2026-01-01
 * // "EXP15/06/2026" → 2026-06-15
 * // "VALID UPTO 15.06.2026" → 2026-06-15
 * // "15/06/2026" (no keyword, fallback) → 2026-06-15
 * // "MFG: JAN 2025 SHELF LIFE: 18 MONTHS" → 2026-07-31
 */

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";

const VISION_URL = "https://vision.googleapis.com/v1/images:annotate";

const LB = "«LB»";

/** Expiry-related phrases — longest first for regex alternation. SHELF LIFE excluded (handled separately). */
const EXP_KEYWORD_PHRASES = [
  "DATE OF EXPIRY",
  "DATE OF EXP",
  "EXPIRY DATE:",
  "EXPIRY DATE",
  "EXPIRY:",
  "EXPIRY",
  "EXP DATE",
  "EXP.DATE",
  "EXPDATE",
  "EXP:",
  "EXP.",
  "EXP",
  "BEST BEFORE:",
  "BESTBEFORE",
  "BEST-BEFORE",
  "BEST BEFORE",
  "BEST BY:",
  "BEST BY",
  "B.B.",
  "BB:",
  "BB",
  "USE BEFORE:",
  "USE BEFORE",
  "USE BY:",
  "USE-BY",
  "USEBY",
  "USE BY",
  "VALID UPTO",
  "VALID UP TO",
  "VALID UNTIL",
  "VALID TILL",
  "CONSUME BEFORE",
  "CONSUME BY",
  "NOT AFTER",
  "SELL BY",
].sort((a, b) => b.length - a.length);

const MFG_KEYWORD_PHRASES = [
  "MANUFACTURING DATE",
  "MANUFACTURE",
  "MANUFACTURING",
  "MANUFACTURED",
  "MFG",
  "MFD",
].sort((a, b) => b.length - a.length);

const MONTH_RE =
  "JAN(?:UARY)?|FEB(?:RUARY)?|MAR(?:CH)?|APR(?:IL)?|MAY|JUN(?:E)?|JUL(?:Y)?|AUG(?:UST)?|SEP(?:T)?(?:EMBER)?|OCT(?:OBER)?|NOV(?:EMBER)?|DEC(?:EMBER)?";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toIso(y, m, d) {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function daysInMonth(y, m1to12) {
  return new Date(y, m1to12, 0).getDate();
}

function validYmd(y, m, d) {
  if (m < 1 || m > 12 || d < 1) return false;
  return d <= daysInMonth(y, m);
}

function yyToYear(yyStr) {
  const n = parseInt(yyStr, 10);
  if (Number.isNaN(n)) return null;
  return n < 100 ? 2000 + n : n;
}

const MONTH_WORD = (() => {
  const m = {};
  const pairs = [
    ["JAN", 1],
    ["JANUARY", 1],
    ["FEB", 2],
    ["FEBRUARY", 2],
    ["MAR", 3],
    ["MARCH", 3],
    ["APR", 4],
    ["APRIL", 4],
    ["MAY", 5],
    ["JUN", 6],
    ["JUNE", 6],
    ["JUL", 7],
    ["JULY", 7],
    ["AUG", 8],
    ["AUGUST", 8],
    ["SEP", 9],
    ["SEPT", 9],
    ["SEPTEMBER", 9],
    ["OCT", 10],
    ["OCTOBER", 10],
    ["NOV", 11],
    ["NOVEMBER", 11],
    ["DEC", 12],
    ["DECEMBER", 12],
  ];
  for (const [k, v] of pairs) m[k] = v;
  return m;
})();

function monthFromToken(tok) {
  const k = String(tok).toUpperCase().replace(/\./g, "");
  return MONTH_WORD[k] ?? null;
}

/** @typedef {{ iso: string, pattern: string, index: number }} DateHit */

function pushHit(out, iso, pattern, index) {
  if (!iso || !validYmd(...iso.split("-").map(Number))) return;
  const [y, mo, d] = iso.split("-").map(Number);
  if (!validYmd(y, mo, d)) return;
  out.push({ iso: toIso(y, mo, d), pattern, index });
}

/**
 * Extract every plausible date from a segment (full scan).
 * @param {string} segment
 * @param {DateHit[]} out
 */
function extractDatesFromSegment(segment, out) {
  if (!segment) return;
  const s = segment.toUpperCase();

  const tryIso = (y, mo, d, pattern, idx) => {
    if (!validYmd(y, mo, d)) return;
    pushHit(out, toIso(y, mo, d), pattern, idx);
  };

  let m;

  const reIsoDash = /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/g;
  while ((m = reIsoDash.exec(s)) !== null) {
    tryIso(+m[1], +m[2], +m[3], "ISO-Y-M-D", m.index);
  }

  const reIsoSlash = /\b(\d{4})\/(\d{1,2})\/(\d{1,2})\b/g;
  while ((m = reIsoSlash.exec(s)) !== null) {
    tryIso(+m[1], +m[2], +m[3], "ISO-Y/M/D", m.index);
  }

  const reYmdDot = /\b(\d{4})\.(\d{1,2})\.(\d{1,2})\b/g;
  while ((m = reYmdDot.exec(s)) !== null) {
    tryIso(+m[1], +m[2], +m[3], "Y.M.D", m.index);
  }

  const reYmdMon = new RegExp(`\\b(\\d{4})\\s+(${MONTH_RE})\\s+(\\d{1,2})\\b`, "gi");
  while ((m = reYmdMon.exec(s)) !== null) {
    const mo = monthFromToken(m[2]);
    if (mo) tryIso(+m[1], mo, +m[3], "Y MON D", m.index);
  }

  const reDdMmYyyy = /\b(\d{1,2})[/.\s-](\d{1,2})[/.\s-](\d{4}|\d{2})\b/g;
  while ((m = reDdMmYyyy.exec(s)) !== null) {
    const d = +m[1];
    const mo = +m[2];
    const y = yyToYear(m[3]);
    if (y && validYmd(y, mo, d)) pushHit(out, toIso(y, mo, d), "DD/MM/(YY)YY", m.index);
  }

  const reDdMmYySpace = /\b(\d{1,2})\s+(\d{1,2})\s+(\d{4}|\d{2})\b/g;
  while ((m = reDdMmYySpace.exec(s)) !== null) {
    const d = +m[1];
    const mo = +m[2];
    const y = yyToYear(m[3]);
    if (y && validYmd(y, mo, d)) pushHit(out, toIso(y, mo, d), "DD MM YY", m.index);
  }

  const reGlue = new RegExp(`\\b(\\d{1,2})(${MONTH_RE})(\\d{4})\\b`, "gi");
  while ((m = reGlue.exec(s)) !== null) {
    const d = +m[1];
    const mo = monthFromToken(m[2]);
    if (mo) tryIso(+m[3], mo, d, "DDMONYYYY", m.index);
  }

  const reDdMonY = new RegExp(
    `\\b(\\d{1,2})[\\s/.-]*(${MONTH_RE})[\\s/.-]*(\\d{4}|\\d{2})\\b`,
    "gi"
  );
  while ((m = reDdMonY.exec(s)) !== null) {
    const d = +m[1];
    const mo = monthFromToken(m[2]);
    const y = yyToYear(m[3]);
    if (mo && y && validYmd(y, mo, d)) pushHit(out, toIso(y, mo, d), "DD MON YY", m.index);
  }

  const reMonY = new RegExp(`\\b(${MONTH_RE})[\\s/.-]*(\\d{4}|\\d{2})\\b`, "gi");
  while ((m = reMonY.exec(s)) !== null) {
    const mo = monthFromToken(m[1]);
    let y = yyToYear(m[2]);
    if (!mo || !y) continue;
    const dim = daysInMonth(y, mo);
    tryIso(y, mo, dim, "MON YYYY", m.index);
  }

  const reMmYyyy = /\b(\d{1,2})[/.\s-](\d{4}|\d{2})\b/g;
  while ((m = reMmYyyy.exec(s)) !== null) {
    const idx = m.index;
    if (idx > 0 && s[idx - 1] === "/") continue;
    const mo = +m[1];
    if (mo > 12) continue;
    let y = yyToYear(m[2]);
    if (!y) continue;
    const dim = daysInMonth(y, mo);
    const before = s.slice(Math.max(0, idx - 40), idx);
    if (/\d{1,2}\s+\d{1,2}\s+\d{2,4}\s*$/.test(before)) continue;
    if (/\d{1,2}\/\d{1,2}\/\s*$/.test(before)) continue;
    tryIso(y, mo, dim, "MM/YYYY", idx);
  }

  const reDdMonYyShort = new RegExp(
    `\\b(\\d{1,2})\\s+(${MONTH_RE})\\s+(\\d{2})\\b`,
    "gi"
  );
  while ((m = reDdMonYyShort.exec(s)) !== null) {
    const d = +m[1];
    const mo = monthFromToken(m[2]);
    const y = yyToYear(m[3]);
    if (mo && y && validYmd(y, mo, d)) pushHit(out, toIso(y, mo, d), "DD MON YY-short", m.index);
  }
}

function dedupeHits(hits) {
  const seen = new Set();
  const out = [];
  for (const h of hits) {
    const k = `${h.iso}@${h.index}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(h);
  }
  return out;
}

function maxFutureIso(hits) {
  if (!hits.length) return null;
  let best = hits[0];
  let bestTs = Date.parse(best.iso + "T12:00:00");
  for (let i = 1; i < hits.length; i++) {
    const ts = Date.parse(hits[i].iso + "T12:00:00");
    if (ts > bestTs) {
      bestTs = ts;
      best = hits[i];
    }
  }
  return best;
}

function buildKeywordRegex(phrases) {
  return new RegExp(phrases.map(escapeRe).join("|"), "gi");
}

/** Makes glued patterns like EXP15/06/2026 searchable by keyword regex. */
function loosenGluedKeywords(line) {
  let s = line;
  const pairs = [
    [/EXPDATE(?=\d)/gi, "EXPDATE "],
    [/EXP(?=\d)/gi, "EXP "],
    [/EXPIRY(?=\d)/gi, "EXPIRY "],
    [/BB(?=\d)/gi, "BB "],
    [/MFG(?=\d)/gi, "MFG "],
    [/MFD(?=\d)/gi, "MFD "],
  ];
  for (const [re, rep] of pairs) s = s.replace(re, rep);
  return s;
}

/**
 * Find keyword match end position in upper line; returns index after keyword in original line length space — use upper line same length as original for indices if only case differs.
 */
function findKeywordWindows(lines, phrases, regex) {
  const windows = [];
  const upperLines = lines.map((l) => l.toUpperCase());

  for (let i = 0; i < lines.length; i++) {
    const ul = upperLines[i];
    regex.lastIndex = 0;
    let m;
    while ((m = regex.exec(ul)) !== null) {
      const kw = m[0];
      const startInLine = m.index;
      const endInLine = startInLine + kw.length;
      const tail = lines[i].slice(endInLine);
      const head = tail.slice(0, 20).trim();
      const nextLine = lines[i + 1] != null ? lines[i + 1].trim() : "";
      const combined = `${head} ${nextLine}`.trim();
      windows.push({
        keyword: kw,
        combined,
        lineIndex: i,
      });
    }
  }
  return windows;
}

function parseShelfLifeMonths(textUpper) {
  const re =
    /SHELF\s*LIFE\s*[:\s]*(\d+)\s*(MONTHS?|MONTH|M|YEARS?|YEAR|Y|DAYS?|DAY|D|WEEKS?|WEEK|W)\b/gi;
  const m = re.exec(textUpper);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const u = m[2].toUpperCase();
  if (Number.isNaN(n) || n <= 0) return null;
  if (u.startsWith("MONTH") || u === "M") return { value: n, unit: "month" };
  if (u.startsWith("YEAR") || u === "Y") return { value: n * 12, unit: "month" };
  if (u.startsWith("WEEK") || u === "W") return { value: n * 7, unit: "day" };
  if (u.startsWith("DAY") || u === "D") return { value: n, unit: "day" };
  return null;
}

function addMonthsCalendar(y, m, d, monthsToAdd) {
  const dt = new Date(y, m - 1, d);
  dt.setMonth(dt.getMonth() + monthsToAdd);
  return {
    y: dt.getFullYear(),
    m: dt.getMonth() + 1,
    d: dt.getDate(),
  };
}

function addDaysCalendar(y, m, d, days) {
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return {
    y: dt.getFullYear(),
    m: dt.getMonth() + 1,
    d: dt.getDate(),
  };
}

/**
 * Parse manufacturing / generic date hit into Y-M-D (month-only MFG → last day of month).
 */
function hitToYmdParts(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

/**
 * Core parsing from raw OCR text.
 * @returns {{ found: boolean, date?: string, message?: string, rawText?: string }}
 */
export function parseExpiryFromText(rawText) {
  const raw = rawText ?? "";
  const trimmed = raw.trim();

  if (!trimmed) {
    return { found: false, message: "No text found in image. Try again with clearer photo." };
  }

  const lines = raw.split(/\r?\n/).map((ln) => loosenGluedKeywords(ln));

  const expRe = buildKeywordRegex(EXP_KEYWORD_PHRASES);
  const mfgRe = buildKeywordRegex(MFG_KEYWORD_PHRASES);

  const expWindows = findKeywordWindows(lines, EXP_KEYWORD_PHRASES, expRe);
  const mfgWindows = findKeywordWindows(lines, MFG_KEYWORD_PHRASES, mfgRe);

  let expHits = [];
  for (const w of expWindows) {
    const local = [];
    extractDatesFromSegment(w.combined, local);
    for (const h of local) {
      expHits.push({ ...h, keyword: w.keyword });
    }
  }
  expHits = dedupeHits(expHits);

  let mfgHits = [];
  for (const w of mfgWindows) {
    const local = [];
    extractDatesFromSegment(w.combined, local);
    for (const h of local) {
      mfgHits.push({ ...h, keyword: w.keyword });
    }
  }
  mfgHits = dedupeHits(mfgHits);

  const normalizedFull = trimmed.toUpperCase().replace(/\r\n/g, "\n").replace(/\n/g, ` ${LB} `);
  const fullUpper = normalizedFull.replace(/\s+/g, " ");

  let chosen = null;
  let chosenMeta = null;

  if (expHits.length) {
    chosen = maxFutureIso(expHits);
    chosenMeta = {
      keyword: expHits.find((h) => h.iso === chosen.iso)?.keyword ?? "?",
      pattern: chosen.pattern,
    };
  } else if (mfgHits.length) {
    const shelf = parseShelfLifeMonths(fullUpper);
    if (shelf) {
      const base = maxFutureIso(mfgHits);
      const { y, m, d } = hitToYmdParts(base.iso);
      let ny = y;
      let nm = m;
      let nd = d;
      if (shelf.unit === "month") {
        const r = addMonthsCalendar(y, m, d, shelf.value);
        ny = r.y;
        nm = r.m;
        nd = r.d;
      } else {
        const r = addDaysCalendar(y, m, d, shelf.value);
        ny = r.y;
        nm = r.m;
        nd = r.d;
      }
      if (validYmd(ny, nm, nd)) {
        chosen = { iso: toIso(ny, nm, nd), pattern: "MFG+SHELF_LIFE" };
        chosenMeta = { keyword: "MFG+SHELF_LIFE", pattern: chosen.pattern };
      }
    }
  }

  if (!chosen) {
    const fb = [];
    extractDatesFromSegment(fullUpper.replace(new RegExp(LB, "g"), " "), fb);
    extractDatesFromSegment(trimmed.toUpperCase(), fb);
    const deduped = dedupeHits(fb);
    if (deduped.length) {
      const now = Date.now();
      const future = deduped.filter((h) => Date.parse(h.iso + "T12:00:00") >= now - 86400000);
      const pool = future.length ? future : deduped;
      chosen = maxFutureIso(pool);
      chosenMeta = { keyword: "(fallback)", pattern: chosen.pattern };
    }
  }

  if (chosen) {
    return { found: true, date: chosen.iso, rawText: trimmed };
  }

  return {
    found: false,
    message: "Found text but couldn't identify a date. Please enter manually.",
    rawText: trimmed,
  };
}

function extractDetectedText(data) {
  const r0 = data?.responses?.[0];
  const ann = r0?.fullTextAnnotation;
  if (ann?.text) return { text: ann.text };

  const ta = r0?.textAnnotations;
  if (ta?.[0]?.description) return { text: ta[0].description };

  const topErr = data?.error?.message;
  const respErr = r0?.error?.message;
  if (topErr || respErr) return { text: "", apiError: topErr || respErr };

  return { text: "" };
}

/** Images larger than this (bytes) are resized before Vision API (faster, avoids timeouts). */
const OCR_MAX_BYTES_BEFORE_RESIZE = 4 * 1024 * 1024;

/**
 * @returns {Promise<{ found: boolean, date?: string, message?: string, rawText?: string, error?: string }>}
 */
export async function readExpiryDate(photoUri) {
  let rawText = "";

  const HARDCODED_GOOGLE_VISION_API_KEY =
    "AIzaSyCj9GjWsvyO711fsbedFRDPnJD_M-WRZS4";

  try {
    const fileInfo = await FileSystem.getInfoAsync(photoUri);

    let uriForRead = photoUri;
    const size = fileInfo.size ?? 0;

    if (fileInfo.exists && size > OCR_MAX_BYTES_BEFORE_RESIZE) {
      const manipulated = await manipulateAsync(
        photoUri,
        [{ resize: { width: 1600 } }],
        { compress: 0.85, format: SaveFormat.JPEG }
      );
      uriForRead = manipulated.uri;
    }

    let base64 = await FileSystem.readAsStringAsync(uriForRead, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (base64.includes(",")) {
      base64 = base64.split(",").pop() ?? base64;
    }

    const apiKey = HARDCODED_GOOGLE_VISION_API_KEY;

    let res;
    let data = {};

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);

      try {
        res = await fetch(`${VISION_URL}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requests: [
              {
                image: { content: base64 },
                features: [{ type: "TEXT_DETECTION" }],
              },
            ],
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      try {
        data = await res.json();
      } catch {
        data = {};
      }
    } catch (error) {
      return {
        found: false,
        message: "Could not connect. Please enter date manually.",
        error: "network",
      };
    }

    if (!res.ok) {
      return {
        found: false,
        message: "Could not connect. Please enter date manually.",
        error: "network",
      };
    }

    const extracted = extractDetectedText(data);
    rawText = extracted.text || "";

    if (extracted.apiError && !rawText) {
      return {
        found: false,
        message: "Could not connect. Please enter date manually.",
        error: "api",
      };
    }

    const parsed = parseExpiryFromText(rawText);
    if (parsed.found) {
      return { ...parsed, rawText: parsed.rawText ?? rawText };
    }
    if (!rawText.trim()) {
      return {
        found: false,
        message: "No text found in image. Try again with clearer photo.",
      };
    }
    return {
      found: false,
      message:
        parsed.message ??
        "Found text but couldn't identify a date. Please enter manually.",
      rawText: parsed.rawText ?? rawText,
    };
  } catch (e) {
    const isAbort = e?.name === "AbortError" || e?.message?.includes("aborted");
    return {
      found: false,
      message: "Could not connect. Please enter date manually.",
      error: isAbort ? "timeout" : "network",
    };
  }
}
