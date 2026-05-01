import { useCallback } from "react";
import { initDatabase } from "../utils/database";
import { cancelNotifications, scheduleExpiryNotifications } from "../utils/notifications";
import {
  getSwipeStats,
  incrementSwipeConsumed,
  incrementSwipeTossed,
} from "../utils/swipeStats";

export function useDatabase() {
  const getItems = useCallback(async () => {
    const db = await initDatabase();
    return db.getAllAsync(
      "SELECT * FROM items ORDER BY DATE(expiry) ASC, id DESC"
    );
  }, []);

  const getItem = useCallback(async (id) => {
    const db = await initDatabase();
    return db.getFirstAsync("SELECT * FROM items WHERE id = ?", [id]);
  }, []);

  const addItem = useCallback(async (item) => {
    const db = await initDatabase();
    const now = new Date().toISOString().split("T")[0];
    const result = await db.runAsync(
      "INSERT INTO items (name, sub, category, storage, expiry, icon, added) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        item.name,
        item.sub || "",
        item.category,
        item.storage,
        item.expiry,
        item.icon,
        now,
      ]
    );
    const newId = Number(result.lastInsertRowId);
    await scheduleExpiryNotifications({
      id: newId,
      name: item.name,
      expiry: item.expiry,
    });
    return newId;
  }, []);

  const deleteItem = useCallback(async (id) => {
    const db = await initDatabase();
    const row = await db.getFirstAsync("SELECT * FROM items WHERE id = ?", [id]);
    if (row) await cancelNotifications(row);
    await db.runAsync("DELETE FROM items WHERE id = ?", [id]);
  }, []);

  const addToBuyList = useCallback(async (entry) => {
    const db = await initDatabase();
    const date =
      entry.date ?? new Date().toISOString().split("T")[0];
    await db.runAsync(
      "INSERT INTO buy_list (name, sub, icon, reason, date, category) VALUES (?, ?, ?, ?, ?, ?)",
      [
        entry.name,
        entry.sub || "",
        entry.icon,
        entry.reason,
        date,
        entry.category ?? null,
      ]
    );
  }, []);

  const getBuyList = useCallback(async () => {
    const db = await initDatabase();
    return db.getAllAsync("SELECT * FROM buy_list ORDER BY id DESC");
  }, []);

  const removeBuyItem = useCallback(async (id) => {
    const db = await initDatabase();
    await db.runAsync("DELETE FROM buy_list WHERE id = ?", [id]);
  }, []);

  const clearBuyList = useCallback(async () => {
    const db = await initDatabase();
    await db.runAsync("DELETE FROM buy_list");
  }, []);

  const consumeItem = useCallback(
    async (item) => {
      await deleteItem(item.id);
      await incrementSwipeConsumed();
      await addToBuyList({ ...item, reason: "used" });
    },
    [addToBuyList, deleteItem]
  );

  const tossItem = useCallback(
    async (item) => {
      await deleteItem(item.id);
      await incrementSwipeTossed();
      await addToBuyList({ ...item, reason: "tossed" });
    },
    [addToBuyList, deleteItem]
  );

  const getStats = useCallback(async () => getSwipeStats(), []);

  const getCategoryBreakdown = useCallback(async () => {
    const db = await initDatabase();
    return db.getAllAsync(
      "SELECT category, COUNT(*) as count FROM items GROUP BY category ORDER BY count DESC"
    );
  }, []);

  return {
    getItems,
    addItem,
    deleteItem,
    addToBuyList,
    getBuyList,
    removeBuyItem,
    clearBuyList,
    getItem,
    consumeItem,
    tossItem,
    getCategoryBreakdown,
    getStats,
  };
}
