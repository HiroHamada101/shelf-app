import * as SQLite from "expo-sqlite";

const DB_NAME = "shelf.db";

let dbPromise;

async function getDatabase() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

async function ensureBuyListCategoryColumn(db) {
  const rows = await db.getAllAsync("PRAGMA table_info(buy_list)");
  const hasCategory = rows.some((r) => r.name === "category");
  if (!hasCategory) {
    await db.execAsync("ALTER TABLE buy_list ADD COLUMN category TEXT");
  }
}

async function ensureItemsNotificationIdsColumn(db) {
  const rows = await db.getAllAsync("PRAGMA table_info(items)");
  const hasCol = rows.some((r) => r.name === "notification_ids");
  if (!hasCol) {
    await db.execAsync("ALTER TABLE items ADD COLUMN notification_ids TEXT");
  }
}

async function ensureAppStatsTable(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_stats (
      id INTEGER PRIMARY KEY,
      consumed INTEGER NOT NULL DEFAULT 0,
      tossed INTEGER NOT NULL DEFAULT 0
    );
    INSERT OR IGNORE INTO app_stats (id, consumed, tossed) VALUES (1, 0, 0);
  `);
}

/** Opens persistent `shelf.db` (WAL): items, buy_list, swipe stats — survives app restarts. */
export async function initDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    DROP TABLE IF EXISTS item_notifications;
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY,
      name TEXT,
      sub TEXT,
      category TEXT,
      storage TEXT,
      expiry TEXT,
      icon TEXT,
      added TEXT
    );
    CREATE TABLE IF NOT EXISTS buy_list (
      id INTEGER PRIMARY KEY,
      name TEXT,
      sub TEXT,
      icon TEXT,
      reason TEXT,
      date TEXT
    );
  `);

  await ensureBuyListCategoryColumn(db);
  await ensureItemsNotificationIdsColumn(db);
  await ensureAppStatsTable(db);

  return db;
}
