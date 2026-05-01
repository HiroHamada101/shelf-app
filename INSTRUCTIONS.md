# Shelf — Expiry Tracker App

## What is Shelf?
An app that tracks expiry dates on everything you own — food, medicine, beauty products, baby items, household items, pet supplies. Scan or manually add items, get reminders before they expire, and auto-build a shopping list when things expire or get tossed.

## Brand
- **Name:** Shelf.
- **Colour:** #F9A602 (golden amber)
- **Logo:** See shelf-logo.svg — stylised S made of shelf lines
- **Fonts:** DM Sans (UI body), Montserrat 700 (wordmark "Shelf."), Fraunces (display numbers/stats)
- **Tagline:** Track it. Use it. Waste less.

## Design Reference
See PROTOTYPE_REFERENCE.jsx for the exact working web prototype. This file contains:
- Complete light and dark theme colour tokens
- All SVG product icons (milk, bread, egg, chicken, cheese, veggie, carrot, banana, jar, fish, tomato, butter, meat, avocado, rice, pill, syrup, drops, bandaid, tube, cream, soap, bottle, battery, extinguisher, sponge, bone, paw)
- The Shelf logo SVG paths (exact from the original .svg file)
- All screen layouts, interactions, and state management
- Swipe gestures on item cards
- Camera scan simulation
- Auth flow (splash → phone → OTP)
- Empty state onboarding

Convert all React web code (div, style objects, onClick) to React Native equivalents (View, Text, Pressable, StyleSheet).

## Tech Stack
- **Framework:** Expo (React Native) with Expo Router (file-based navigation)
- **Database:** expo-sqlite (local, no server needed for v1)
- **Camera:** expo-camera + Google Cloud Vision API for OCR (mock for now)
- **Notifications:** expo-notifications (local push)
- **Animations:** react-native-reanimated + react-native-gesture-handler
- **Auth storage:** expo-secure-store
- **Theme persistence:** @react-native-async-storage/async-storage

## Project Structure
```
shelf-app/
├── app/
│   ├── _layout.jsx              ← root layout with ThemeProvider
│   ├── (auth)/
│   │   ├── _layout.jsx          ← auth stack layout
│   │   ├── splash.jsx           ← golden splash screen
│   │   ├── phone.jsx            ← phone number input
│   │   └── otp.jsx              ← 6-digit OTP verification
│   ├── (tabs)/
│   │   ├── _layout.jsx          ← tab navigator layout
│   │   ├── home.jsx             ← main item list
│   │   ├── buy.jsx              ← auto-populated shopping list
│   │   ├── stats.jsx            ← usage statistics
│   │   └── settings.jsx         ← preferences
│   ├── add.jsx                  ← camera scan + manual add (modal)
│   └── detail/[id].jsx          ← item detail page
├── components/
│   ├── ShelfLogo.jsx            ← SVG logo component with bg/fg props
│   ├── ProductIcon.jsx          ← all flat product SVG icons
│   ├── ItemRow.jsx              ← swipeable item card
│   └── Toggle.jsx               ← iOS-style toggle switch
├── constants/
│   ├── themes.js                ← light + dark theme objects
│   ├── categories.js            ← CATS, STORES, ICON_OPTIONS, PH arrays
│   └── colors.js                ← shared colour values
├── hooks/
│   ├── useTheme.js              ← ThemeContext hook
│   ├── useDatabase.js           ← SQLite CRUD operations
│   └── useNotifications.js      ← notification scheduling
├── utils/
│   ├── database.js              ← SQLite init + table creation
│   ├── notifications.js         ← scheduling helpers
│   └── dates.js                 ← daysFromNow, daysUntil, formatDate
├── assets/
│   └── shelf-logo.svg           ← original logo file
├── PROTOTYPE_REFERENCE.jsx      ← web prototype (design reference only)
└── INSTRUCTIONS.md              ← this file
```

## Database Schema

### items table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | |
| name | TEXT NOT NULL | e.g. "Amul Toned Milk" |
| sub | TEXT | e.g. "500 ml" |
| category | TEXT NOT NULL | food, medicine, beauty, baby, household, pet |
| storage | TEXT NOT NULL | fridge, freezer, pantry, bathroom, cabinet, other |
| expiry | TEXT NOT NULL | ISO date string YYYY-MM-DD |
| icon | TEXT NOT NULL | icon key from ProductIcon set |
| added | TEXT NOT NULL | ISO date string YYYY-MM-DD |

### buy_list table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | |
| name | TEXT NOT NULL | item name |
| sub | TEXT | quantity/size |
| icon | TEXT NOT NULL | icon key |
| reason | TEXT NOT NULL | "expired" or "tossed" |
| date | TEXT NOT NULL | ISO date when added to buy list |

## Screen Specifications

### Splash Screen
- Full background: #F9A602
- Center: ShelfLogo (72px, transparent bg, white fg)
- Below logo: "Shelf." in Montserrat 800, white, 36px
- Below wordmark: "Track it. Use it. Waste less." in 14px, white 60% opacity
- Logo scales up with spring animation (0.5s)
- Text fades in 0.4s after logo
- Entire screen fades out at 2.2s, navigates to phone screen at 2.8s
- Status bar: white text on golden background

### Phone Screen
- White/light background
- ShelfLogo (44px, golden bg, white fg) at top
- "Welcome to Shelf." — Montserrat 700, 24px
- "Enter your phone number..." — 14px, grey
- Input row: +91 country code box (64px wide) + phone input (10 digits, numeric keyboard)
- "Continue" button — golden when 10 digits entered, grey when not
- Golden shadow on active button
- Terms text at bottom, 12px grey
- Input border turns golden on focus

### OTP Screen
- Back arrow at top left
- "Verify your number" — Montserrat 700, 22px
- "We sent a 6-digit code to +91 XXXXXXXXXX"
- 6 individual digit inputs, 46x56px each, rounded 14px
- Inputs auto-advance on digit entry, backspace goes to previous
- Filled inputs get golden border + light golden background (#FFF8E8)
- After all 6 entered: "Verifying..." pulse animation (1.2s)
- Then "Verified" green checkmark
- Auto-navigate to home after 0.6s
- "Didn't receive? Resend" link at bottom
- For v1: mock verification, any 6 digits works

### Home Screen — Empty State (new user)
- Header: ShelfLogo (30px) + "Shelf." wordmark in Montserrat 700, #F9A602
- Center content:
  - ShelfLogo (40px) in a light accent circle (80px)
  - "Your shelf is empty" — 18px, 600 weight
  - "Start by adding your first item." — 14px, grey
  - Golden "Add your first item" button with + icon
  - 3 category hint tiles below: Food 🍚, Medicine 💊, Beauty 🧴

### Home Screen — With Items
- Header: same logo + wordmark
- Stats row: [N] expired (red), [N] expiring (yellow), [N] fresh (green), [N] total (golden) — using Fraunces for numbers
- Category filter pills: All, Food, Medicine, Beauty, Baby, Household, Pet — active pill is golden with white text
- Items grouped into sections:
  - Section header: coloured dot (4px) + "EXPIRED" / "USE SOON" / "FRESH" uppercase label + count
  - Items in rounded card group with subtle shadow
- Each item row: ProductIcon (36px) | name + "sub · date" | status dot + "Xd" / "today" / "Xd ago"
- Swipe right → green "Used" background → remove item, increment consumed count
- Swipe left → red "Tossed" background → remove item, add to buy list, increment tossed count
- "swipe right = used · swipe left = tossed" hint text at bottom
- Tab bar at bottom: Home, Buy (with badge count), + FAB (golden, 56px, elevated), Stats, Settings

### Add Screen
- Choose mode: "Scan expiry date" (golden card) or "Add manually" (white card)
- Camera mode: full-screen camera with viewfinder rectangle, corner brackets in golden, "Reading..." text, mock OCR returns test data after 2s, then shows confirm form
- Manual/confirm form:
  - Category pills (golden active state)
  - Icon grid (changes per category, selected icon gets golden ring)
  - Product name input (placeholder changes per category)
  - Quantity/size input
  - Date picker for expiry
  - Storage pills: Fridge, Freezer, Pantry, Bathroom, Cabinet, Other
  - "Add to shelf" golden button (disabled state when form incomplete)
  - All inputs get golden border on focus

### Item Detail
- Back arrow + "Remove" button (red) at top
- Large ProductIcon (56px) centered
- Item name in Fraunces 22px
- Subtitle (quantity) in 13px grey
- "Category · Storage" in 12px muted
- Days remaining in Fraunces 32px with status colour (red/yellow/green)
- "Use by [date]" in 13px grey
- Progress bar (4px, 200px max width, status colour)
- Info card: Added, Expires, Category, Storage rows

### Buy Again
- "Buy again" header + "Clear all" golden link
- "Auto-added when items expire or get tossed" subtitle
- Empty state: cart icon, "Nothing to buy yet", explanation text
- List: checkbox (golden when checked) + ProductIcon (30px) + name (strikethrough when checked) + reason/date + delete icon
- "X checked off" confirmation banner in accent light bg

### Stats
- "Stats" header in Fraunces
- Golden card: large Fraunces percentage, "used before expiry", consumed/tossed boxes
- Savings card: "EST. SAVINGS" label, dollar amount in Fraunces
- Category breakdown card: rows with label + count
- Premium upsell: golden card, "Shelf Premium", "$2.99/mo" white button

### Settings
- Back arrow + "Settings" header
- Appearance: Dark mode toggle (sun/moon icon, golden toggle)
- Notifications: Before expiry (3 days), Daily summary (9 AM), Expired alert (On)
- Account: Plan (Free), Export (CSV), Version (1.0.0)
- Persist dark mode choice in AsyncStorage

## Categories
| ID | Label | Icon Options (for add screen) |
|----|-------|------------------------------|
| food | Food | milk, bread, egg, chicken, cheese, veggie, carrot, banana, jar, fish, tomato, butter, meat, avocado, rice |
| medicine | Medicine | pill, syrup, drops, bandaid |
| beauty | Beauty | tube, cream, soap |
| baby | Baby | bottle, milk |
| household | Household | battery, extinguisher, sponge |
| pet | Pet | bone, paw |

## Storage Locations
fridge, freezer, pantry, bathroom, cabinet, other

## Notification Rules
When an item is added, schedule 3 local notifications:
1. 3 days before expiry at 9:00 AM → "Shelf. — [name] expires in 3 days"
2. 1 day before expiry at 9:00 AM → "Shelf. — [name] expires tomorrow"
3. On expiry day at 9:00 AM → "Shelf. — [name] expires today — use it now!"

When an item is deleted or consumed, cancel its scheduled notifications.

## Monetisation (v2, not for v1)
- Free tier: 15 items max
- Premium ($2.99/month): unlimited items, custom notification timing, household sharing, detailed waste reports
- For v1: show the premium upsell UI on stats page but don't gate any features

## Build Targets
- Android APK for testing: `eas build --platform android --profile preview`
- Android AAB for Play Store: `eas build --platform android --profile production`
- iOS for TestFlight: `eas build --platform ios --profile preview`
