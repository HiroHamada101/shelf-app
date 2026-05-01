import { useCallback } from "react";
import { cancelNotifications, scheduleExpiryNotifications } from "../utils/notifications";

export function useNotifications() {
  const scheduleForItem = useCallback(async (item) => {
    return scheduleExpiryNotifications(item);
  }, []);

  const cancelForItem = useCallback(async (item) => {
    return cancelNotifications(item);
  }, []);

  return {
    scheduleForItem,
    cancelForItem,
  };
}
