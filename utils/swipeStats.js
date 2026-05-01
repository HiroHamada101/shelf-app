import AsyncStorage from "@react-native-async-storage/async-storage";
import { initDatabase } from "./database";

const LEGACY_KEY_CONSUMED = "shelf.swipe.consumed";
const LEGACY_KEY_TOSSED = "shelf.swipe.tossed";

let legacyMigrated = false;

async function migrateLegacyStatsOnce(db) {
  if (legacyMigrated) {
    return;
  }
  legacyMigrated = true;
  try {
    const [cRaw, tRaw] = await Promise.all([
      AsyncStorage.getItem(LEGACY_KEY_CONSUMED),
      AsyncStorage.getItem(LEGACY_KEY_TOSSED),
    ]);
    const c = Number(cRaw || 0);
    const t = Number(tRaw || 0);
    if (c === 0 && t === 0) {
      return;
    }
    const row = await db.getFirstAsync(
      "SELECT consumed, tossed FROM app_stats WHERE id = 1"
    );
    const curC = Number(row?.consumed ?? 0);
    const curT = Number(row?.tossed ?? 0);
    if (curC === 0 && curT === 0) {
      await db.runAsync("UPDATE app_stats SET consumed = ?, tossed = ? WHERE id = 1", [
        c,
        t,
      ]);
    }
    await AsyncStorage.multiRemove([LEGACY_KEY_CONSUMED, LEGACY_KEY_TOSSED]);
  } catch {
    /* ignore */
  }
}

export async function getSwipeStats() {
  try {
    const db = await initDatabase();
    await migrateLegacyStatsOnce(db);
    const row = await db.getFirstAsync(
      "SELECT consumed, tossed FROM app_stats WHERE id = 1"
    );
    return {
      consumed: Number(row?.consumed ?? 0),
      tossed: Number(row?.tossed ?? 0),
    };
  } catch {
    return { consumed: 0, tossed: 0 };
  }
}

export async function incrementSwipeConsumed() {
  const db = await initDatabase();
  await migrateLegacyStatsOnce(db);
  await db.runAsync("UPDATE app_stats SET consumed = consumed + 1 WHERE id = 1");
  return getSwipeStats();
}

export async function incrementSwipeTossed() {
  const db = await initDatabase();
  await migrateLegacyStatsOnce(db);
  await db.runAsync("UPDATE app_stats SET tossed = tossed + 1 WHERE id = 1");
  return getSwipeStats();
}
