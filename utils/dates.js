export function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function daysUntil(isoDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const then = new Date(`${isoDate}T00:00:00`);
  then.setHours(0, 0, 0, 0);
  return Math.round((then - now) / 86400000);
}

export function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

/** e.g. "15 Jun 2026" for expiry button label */
export function formatExpiryLong(isoDate) {
  if (!isoDate) return "";
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
