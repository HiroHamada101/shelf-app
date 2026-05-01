export const CATS = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "medicine", label: "Medicine" },
  { id: "beauty", label: "Beauty" },
  { id: "baby", label: "Baby" },
  { id: "household", label: "Household" },
  { id: "pet", label: "Pet" },
  { id: "other", label: "Other" },
];

export const STORES = [
  { id: "fridge", label: "Fridge" },
  { id: "freezer", label: "Freezer" },
  { id: "pantry", label: "Pantry" },
  { id: "bathroom", label: "Bathroom" },
  { id: "cabinet", label: "Cabinet" },
  { id: "other", label: "Other" },
];

/** Six icon ids per category — add screen shows these in one row (see `ICON_EMOJI`). */
export const ICON_OPTIONS = {
  food: ["milk", "bread", "egg", "chicken", "veggie", "jar"],
  medicine: ["pill", "syrup", "syringe", "bandaid", "thermometer", "eye_drops"],
  beauty: ["beauty_lotion", "beauty_soap", "lipstick", "comb", "toothbrush", "flower"],
  baby: ["bottle", "baby_face", "child", "teddy", "diaper", "baby_lotion"],
  household: ["battery", "extinguisher", "sponge", "detergent_bubbles", "bulb", "plant"],
  pet: ["pet_dog", "pet_cat", "bone", "paw", "fish", "pet_shampoo"],
  other: ["milk", "bread", "egg", "chicken", "veggie", "jar"],
};

/** Guess category from saved icon id when `category` is missing (e.g. legacy buy_list rows). */
export function inferCategoryFromIcon(iconId) {
  if (!iconId || typeof iconId !== "string") return "other";
  const order = ["food", "medicine", "beauty", "baby", "household", "pet", "other"];
  for (const cat of order) {
    if (ICON_OPTIONS[cat]?.includes(iconId)) return cat;
  }
  return "other";
}

/** Emoji shown for each icon id (ProductIcon + add picker). */
export const ICON_EMOJI = {
  milk: "🥛",
  bread: "🍞",
  egg: "🥚",
  chicken: "🍗",
  veggie: "🥬",
  jar: "🫙",
  pill: "💊",
  syrup: "🧴",
  syringe: "💉",
  bandaid: "🩹",
  thermometer: "🌡️",
  eye_drops: "👁️",
  beauty_lotion: "🧴",
  beauty_soap: "🧼",
  lipstick: "💄",
  comb: "🪮",
  toothbrush: "🪥",
  flower: "🌺",
  bottle: "🍼",
  baby_face: "👶",
  child: "🧒",
  teddy: "🧸",
  diaper: "🧷",
  baby_lotion: "🧴",
  battery: "🔋",
  extinguisher: "🧯",
  sponge: "🧽",
  detergent_bubbles: "🫧",
  bulb: "💡",
  plant: "🪴",
  pet_dog: "🐕",
  pet_cat: "🐈",
  bone: "🦴",
  paw: "🐾",
  fish: "🐟",
  pet_shampoo: "🧴",
};

/** Human-readable category labels for detail / stats */
export const CAT_LABELS = {
  food: "Food & Drink",
  medicine: "Medicine",
  beauty: "Beauty & Care",
  baby: "Baby & Kids",
  household: "Household",
  pet: "Pet Supplies",
  other: "Other",
};

export const PH = {
  other: "Product name",
  food: "e.g. Amul Toned Milk, 500ml",
  medicine: "e.g. Crocin 650mg",
  beauty: "e.g. Lakme Sunscreen SPF 50",
  baby: "e.g. Cerelac Stage 1",
  household: "e.g. Duracell AA Batteries",
  pet: "e.g. Pedigree Chicken",
};
