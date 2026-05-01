/**
 * Friendly expiry notification copy. Title is always "Shelf." (see utils/notifications.js).
 * Placeholders: [name], [X] (days until expiry for category lines).
 */

const GENERAL = {
  7: [
    "[name] expires in a week. Plan to use it soon!",
    "Heads up — [name] has 7 days left",
  ],
  5: [
    "[name] expires in 5 days. Time to use it up!",
    "5 days left for [name] — maybe tonight's dinner?",
  ],
  3: [
    "[name] expires in 3 days — don't let it go to waste!",
    "Quick reminder — [name] needs to be used in 3 days",
    "3 days left for [name]. Got plans for it?",
  ],
  2: [
    "[name] expires in 2 days. Use it or lose it!",
    "Just 2 days left for [name] — time to use it",
  ],
  1: [
    "[name] expires tomorrow! Use it today.",
    "Last day for [name] — don't forget!",
    "Tomorrow's the last day for [name]. Use it tonight?",
  ],
  0: [
    "[name] expires today. Use it now before it's too late!",
    "Today's the day — [name] expires. Use it or toss it.",
    "[name] is expiring today. Don't let it go to waste!",
  ],
  [-1]: [
    "[name] expired yesterday. Check if it's still good.",
    "[name] has expired. Time to toss it and restock?",
  ],
};

/** Extra lines merged into the pool when `item.category` matches (keys = daysLeft). */
const CATEGORY_EXTRA = {
  medicine: {
    7: ["[name] expires in [XD]. Check if you need a refill."],
    5: ["[name] expires in [XD]. Check if you need a refill."],
    3: ["[name] expires in [XD]. Check if you need a refill."],
    2: ["[name] expires in [XD]. Check if you need a refill."],
    1: [
      "[name] expires in [XD]. Check if you need a refill.",
      "[name] expires tomorrow. Time to get a replacement from the pharmacy.",
    ],
  },
  beauty: {
    7: ["[name] expires in [XD]. Finish it up!"],
    5: ["[name] expires in [XD]. Finish it up!"],
    3: [
      "[name] expires in [XD]. Finish it up!",
      "Your [name] is expiring soon. Expired skincare can irritate your skin.",
    ],
    2: [
      "[name] expires in [XD]. Finish it up!",
      "Your [name] is expiring soon. Expired skincare can irritate your skin.",
    ],
    1: [
      "[name] expires in [XD]. Finish it up!",
      "Your [name] is expiring soon. Expired skincare can irritate your skin.",
    ],
  },
  baby: {
    7: ["[name] expires in [XD]. Baby products should always be fresh!"],
    5: ["[name] expires in [XD]. Baby products should always be fresh!"],
    3: ["[name] expires in [XD]. Baby products should always be fresh!"],
    2: ["[name] expires in [XD]. Baby products should always be fresh!"],
    1: [
      "[name] expires in [XD]. Baby products should always be fresh!",
      "[name] expires tomorrow. Don't use expired baby products — restock now.",
    ],
  },
  pet: {
    7: ["[name] expires in [XD]. Keep your pet's supplies fresh!"],
    5: ["[name] expires in [XD]. Keep your pet's supplies fresh!"],
    3: ["[name] expires in [XD]. Keep your pet's supplies fresh!"],
    2: ["[name] expires in [XD]. Keep your pet's supplies fresh!"],
    1: ["[name] expires in [XD]. Keep your pet's supplies fresh!"],
  },
};

function pickRandom(strings) {
  if (!strings?.length) return "";
  return strings[Math.floor(Math.random() * strings.length)];
}

/** "1 day" vs "5 days" */
function daysPhrase(daysLeft) {
  const n = Math.abs(daysLeft);
  return n === 1 ? "1 day" : `${n} days`;
}

function applyPlaceholders(template, name, daysLeft) {
  return template
    .replace(/\[name\]/g, name)
    .replace(/\[XD\]/g, daysPhrase(daysLeft))
    .replace(/\[X\]/g, String(Math.abs(daysLeft)));
}

/**
 * Body text for a scheduled local notification.
 * @param {{ name?: string, category?: string }} item
 * @param {number} daysLeft Calendar sense: 7 = week before expiry … 1 = day before, 0 = expiry day, -1 = day after expiry (post-expiry reminder).
 */
export function getNotificationMessage(item, daysLeft) {
  const name = (item?.name ?? "").trim() || "Item";
  const cat = String(item?.category ?? "other").toLowerCase();

  const generalList = GENERAL[daysLeft] ?? GENERAL[String(daysLeft)] ?? [];
  const pool = generalList.map((t) => applyPlaceholders(t, name, daysLeft));

  const extras = CATEGORY_EXTRA[cat]?.[daysLeft];
  if (extras?.length) {
    for (const t of extras) {
      pool.push(applyPlaceholders(t, name, daysLeft));
    }
  }

  return pickRandom(pool.length ? pool : [`Reminder: ${name} — check your shelf.`]);
}
