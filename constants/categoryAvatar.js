/** Background + letter colours for product letter avatars (by category id). */
export const CATEGORY_AVATAR = {
  food: { backgroundColor: "#FFF3E0", color: "#E65100" },
  medicine: { backgroundColor: "#E8EAF6", color: "#283593" },
  beauty: { backgroundColor: "#FCE4EC", color: "#AD1457" },
  baby: { backgroundColor: "#E3F2FD", color: "#1565C0" },
  household: { backgroundColor: "#ECEFF1", color: "#37474F" },
  pet: { backgroundColor: "#EFEBE9", color: "#4E342E" },
  other: { backgroundColor: "#F5F5F5", color: "#616161" },
};

export function getCategoryAvatarStyle(category) {
  const key = typeof category === "string" ? category.toLowerCase().trim() : "";
  return CATEGORY_AVATAR[key] ?? CATEGORY_AVATAR.other;
}
