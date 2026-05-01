import AsyncStorage from "@react-native-async-storage/async-storage";

/** Primary key for "remind X days before expiry" (see utils/notifications.js). */
export const NOTIFY_BEFORE_DAYS_KEY = "notify_before_days";

/** Local time for expiry reminders (24h `HH:MM`, e.g. `"09:00"`). */
export const NOTIFY_TIME_KEY = "notify_time";

/** UI options — value stored in AsyncStorage under {@link NOTIFY_TIME_KEY}. */
export const NOTIFY_TIME_OPTIONS = [
  { label: "7 AM", value: "07:00" },
  { label: "9 AM", value: "09:00" },
  { label: "12 PM", value: "12:00" },
  { label: "6 PM", value: "18:00" },
  { label: "9 PM", value: "21:00" },
];

const DEFAULT_NOTIFY_TIME = "09:00";

const K = {
  beforeExpiry: "shelf.notify.beforeExpiry",
  dailySummary: "shelf.notify.dailySummary",
  expiredAlert: "shelf.notify.expiredAlert",
  beforeExpiryLeadDays: "shelf.notify.beforeExpiryLeadDays",
};

const LEAD_OPTIONS = [1, 2, 3, 5, 7];

const defaults = {
  beforeExpiry: true,
  dailySummary: false,
  expiredAlert: true,
  beforeExpiryLeadDays: 3,
};

async function readBool(key, fallback) {
  try {
    const v = await AsyncStorage.getItem(key);
    if (v === "0") return false;
    if (v === "1") return true;
    return fallback;
  } catch {
    return fallback;
  }
}

export async function getBeforeExpiryLeadDays() {
  try {
    const primary = await AsyncStorage.getItem(NOTIFY_BEFORE_DAYS_KEY);
    const n = parseInt(primary, 10);
    if (LEAD_OPTIONS.includes(n)) return n;
    const legacy = await AsyncStorage.getItem(K.beforeExpiryLeadDays);
    const ln = parseInt(legacy, 10);
    if (LEAD_OPTIONS.includes(ln)) {
      await AsyncStorage.setItem(NOTIFY_BEFORE_DAYS_KEY, String(ln));
      return ln;
    }
  } catch {
    // ignore
  }
  return defaults.beforeExpiryLeadDays;
}

export async function setBeforeExpiryLeadDays(days) {
  if (!LEAD_OPTIONS.includes(days)) return;
  await AsyncStorage.setItem(NOTIFY_BEFORE_DAYS_KEY, String(days));
  await AsyncStorage.setItem(K.beforeExpiryLeadDays, String(days));
}

export async function getNotifyTime() {
  try {
    const v = await AsyncStorage.getItem(NOTIFY_TIME_KEY);
    if (v && NOTIFY_TIME_OPTIONS.some((o) => o.value === v)) {
      return v;
    }
  } catch {
    // ignore
  }
  return DEFAULT_NOTIFY_TIME;
}

export async function setNotifyTime(value) {
  if (!NOTIFY_TIME_OPTIONS.some((o) => o.value === value)) {
    return;
  }
  await AsyncStorage.setItem(NOTIFY_TIME_KEY, value);
}

/** @param {string} value — `"HH:MM"` from {@link NOTIFY_TIME_OPTIONS} */
export function parseNotifyTimeToHm(value) {
  const raw = value || DEFAULT_NOTIFY_TIME;
  const parts = String(raw).split(":");
  const hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return { hour: 9, minute: 0 };
  }
  return { hour, minute };
}

export async function getNotificationPrefs() {
  const [beforeExpiry, dailySummary, expiredAlert, beforeExpiryLeadDays, notifyTime] =
    await Promise.all([
      readBool(K.beforeExpiry, defaults.beforeExpiry),
      readBool(K.dailySummary, defaults.dailySummary),
      readBool(K.expiredAlert, defaults.expiredAlert),
      getBeforeExpiryLeadDays(),
      getNotifyTime(),
    ]);
  return {
    beforeExpiry,
    dailySummary,
    expiredAlert,
    beforeExpiryLeadDays,
    notifyTime,
  };
}

export async function setNotificationPref(key, value) {
  const map = {
    beforeExpiry: K.beforeExpiry,
    dailySummary: K.dailySummary,
    expiredAlert: K.expiredAlert,
  };
  const storageKey = map[key];
  if (!storageKey) return;
  await AsyncStorage.setItem(storageKey, value ? "1" : "0");
}

export const BEFORE_EXPIRY_LEAD_OPTIONS = LEAD_OPTIONS;
