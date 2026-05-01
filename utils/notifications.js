import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getNotificationMessage } from "../constants/messages";
import { initDatabase } from "./database";
import { getNotificationPrefs, parseNotifyTimeToHm } from "./notificationPrefs";

const ANDROID_CHANNEL_ID = "expiry-reminders";
/** Legacy per-item ids before SQLite `notification_ids` column */
const STORAGE_IDS_PREFIX = "shelf.notify.scheduled.";

const NOTIFICATION_TITLE = "Shelf.";

/** Call once at app startup (see app/_layout.jsx). */
export function registerNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export async function ensureAndroidExpiryChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Expiry reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
  });
}

/** Request notification permission (call after successful OTP verification). */
export async function requestPermission() {
  if (Platform.OS === "web") {
    return { status: "denied", canAskAgain: false, granted: false, expires: "never" };
  }
  await ensureAndroidExpiryChannel();
  return Notifications.requestPermissionsAsync();
}

function scheduledIdsStorageKey(itemId) {
  return `${STORAGE_IDS_PREFIX}${itemId}`;
}

function parseExpiryYmd(expiryIso) {
  const parts = String(expiryIso).split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return null;
  }
  const [y, m, d] = parts;
  return { y, m, d };
}

/**
 * Local wall-clock time on the calendar date that is `deltaDaysFromExpiry` relative to expiry day.
 * Hour/minute come from saved notification prefs (`notify_time`).
 */
function fireDateAtChosenLocalTime(y, m, d, deltaDaysFromExpiry, hour, minute) {
  const dt = new Date(y, m - 1, d, hour, minute, 0, 0);
  dt.setDate(dt.getDate() + deltaDaysFromExpiry);
  return dt;
}

function parseIdsJson(raw) {
  if (!raw || typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

async function clearLegacyScheduledIdsStorage(itemId) {
  try {
    await AsyncStorage.removeItem(scheduledIdsStorageKey(itemId));
  } catch {
    // ignore
  }
}

async function loadLegacyScheduledIds(itemId) {
  try {
    const raw = await AsyncStorage.getItem(scheduledIdsStorageKey(itemId));
    return parseIdsJson(raw);
  } catch {
    return [];
  }
}

async function persistNotificationIds(itemId, ids) {
  const db = await initDatabase();
  await db.runAsync("UPDATE items SET notification_ids = ? WHERE id = ?", [
    JSON.stringify(ids),
    itemId,
  ]);
}

/**
 * Cancel scheduled notifications for an item (SQLite `notification_ids` + legacy AsyncStorage).
 * Call before delete / swipe remove.
 * @param {object} item Row from `items` (must include `id`, optional `notification_ids`)
 */
export async function cancelNotifications(item) {
  if (Platform.OS === "web" || item == null || item.id == null) return;

  let ids = parseIdsJson(item.notification_ids);
  if (ids.length === 0) {
    ids = await loadLegacyScheduledIds(item.id);
  }

  for (const nid of ids) {
    try {
      await Notifications.cancelScheduledNotificationAsync(nid);
    } catch {
      // ignore per-id failures
    }
  }

  await clearLegacyScheduledIdsStorage(item.id);

  try {
    const db = await initDatabase();
    await db.runAsync("UPDATE items SET notification_ids = NULL WHERE id = ?", [item.id]);
  } catch {
    // ignore
  }
}

/** Fire times relative to expiry calendar day; paired with daysLeft for message copy. */
const SCHEDULE_MILESTONES = [
  { delta: -7, daysLeft: 7 },
  { delta: -5, daysLeft: 5 },
  { delta: -3, daysLeft: 3 },
  { delta: -2, daysLeft: 2 },
  { delta: -1, daysLeft: 1 },
  { delta: 0, daysLeft: 0 },
  /** Morning after expiry — “expired yesterday” style reminders */
  { delta: 1, daysLeft: -1 },
];

/**
 * Schedule local expiry reminders at the user's chosen local time on each reminder day
 * (milestones + post-expiry). Time comes from AsyncStorage `notify_time` via prefs.
 * Persists notification identifier strings in `items.notification_ids`.
 * @param {{ id: number, name?: string, expiry: string, category?: string }} item
 */
export async function scheduleExpiryNotifications(item) {
  if (Platform.OS === "web" || !item?.id || !item?.expiry) return;

  await ensureAndroidExpiryChannel();

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;

  const prefs = await getNotificationPrefs();
  if (!prefs.beforeExpiry) {
    await cancelNotifications(item);
    return;
  }

  await cancelNotifications(item);

  const ymd = parseExpiryYmd(item.expiry);
  if (!ymd) return;

  const { hour, minute } = parseNotifyTimeToHm(prefs.notifyTime);

  const { y, m, d } = ymd;
  const now = Date.now();

  const ids = [];

  for (const { delta, daysLeft } of SCHEDULE_MILESTONES) {
    const date = fireDateAtChosenLocalTime(y, m, d, delta, hour, minute);
    if (date.getTime() <= now) continue;

    const body = getNotificationMessage(item, daysLeft);

    const content = {
      title: NOTIFICATION_TITLE,
      body,
      data: { itemId: String(item.id), kind: "expiry", daysLeft },
    };
    if (Platform.OS === "android") {
      content.channelId = ANDROID_CHANNEL_ID;
    }

    const trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    };
    if (Platform.OS === "android") {
      trigger.channelId = ANDROID_CHANNEL_ID;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content,
        trigger,
      });
      ids.push(notificationId);
    } catch {
      /* ignore */
    }
  }

  if (ids.length > 0) {
    try {
      await persistNotificationIds(item.id, ids);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Reload all item notifications (e.g. after changing "Before expiry" days in Settings).
 */
export async function rescheduleAllNotifications() {
  if (Platform.OS === "web") return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") return;

  const db = await initDatabase();
  const items = await db.getAllAsync("SELECT * FROM items");
  for (const row of items) {
    await scheduleExpiryNotifications(row);
  }
}

/** @deprecated Use scheduleExpiryNotifications */
export async function scheduleItemExpiryNotifications(itemId, itemName, expiryIso) {
  await scheduleExpiryNotifications({ id: itemId, name: itemName, expiry: expiryIso });
}

/** @deprecated Use cancelNotifications — pass `{ id }` at minimum */
export async function cancelItemExpiryNotifications(itemId) {
  await cancelNotifications({ id: itemId });
}
