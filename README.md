# Shelf.

**Track it. Use it. Waste less.**

Shelf is a mobile app that helps you stay on top of everything you own — food, medicine, beauty products, baby items, household supplies, and pet care. Scan expiry dates with your camera, get smart reminders before things expire, and automatically build a restock list when items are used or tossed.

Brand accent: **#F9A602** (Shelf gold).

---

## Features

- **Camera OCR scanning** — Capture expiry text from labels without typing.
- **Smart notifications** — Reminders before items expire, tuned to how you use Shelf.
- **Category organization** — Keep pantry, medicine cabinet, and more sorted.
- **Restock list** — Items flow into a buy-again list when you finish or discard them.
- **Dark mode** — Easy on the eyes, respects your preference.
- **Usage stats** — See how you interact with your shelf over time.
- **Waste savings tracker** — Understand what you’re rescuing from the bin.

---

## Screenshots

Put image files in **`assets/screenshots/`** (PNG or JPG). Name them however you like, then reference them with **relative paths** from this README.

**Markdown (simple):**

```markdown
![Shelf home screen](./assets/screenshots/home.png)
```

**Side‑by‑side row (HTML, works well on GitHub):**

```html
<p align="center">
  <img src="./assets/screenshots/home.png" width="260" alt="Home" />
  <img src="./assets/screenshots/restock.png" width="260" alt="Restock" />
  <img src="./assets/screenshots/settings.png" width="260" alt="Settings" />
</p>
```

Replace the filenames above with your real files, save them under **`assets/screenshots/`**, commit them with the repo (or use hosted URLs instead of `./assets/...`).

---

## Tech stack

| Layer | Technology |
|--------|------------|
| App | **React Native** + **Expo** |
| Auth | **Firebase Auth** (`@react-native-firebase/auth`) |
| OCR | **Google Cloud Vision API** |
| Local data | **expo-sqlite** |
| Reminders | **expo-notifications** |

---

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) (comes with Node)
- For device builds: Xcode (iOS) / Android Studio (Android); Expo Go or a dev client per your workflow

### Steps

1. **Clone the repo**

   ```bash
   git clone <your-repo-url>
   cd shelf-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Copy the example env file and add your keys:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in values (e.g. Google Vision / any keys your team documents in `.env.example`).

4. **Firebase (Android native config)**

   Copy the example Firebase config and replace placeholders with your Firebase project values:

   ```bash
   cp google-services.example.json google-services.json
   ```

   `app.json` references `./google-services.json` for Android. Rebuild native apps after changing this file.

5. **Start the dev server**

   ```bash
   npx expo start
   ```

   Then open in Expo Go, a simulator, or your development build as usual.

---

## Architecture

High-level layout:

| Path | Purpose |
|------|---------|
| `app/` | Expo Router screens — `(auth)`, `(tabs)`, modals, detail routes |
| `components/` | Reusable UI (buttons, cards, tab bar, etc.) |
| `config/` | App configuration (e.g. Firebase auth export) |
| `constants/` | Themes, colors (**#F9A602** accent), typography, categories |
| `contexts/` | React context (e.g. theme) |
| `hooks/` | Auth, database, notifications, theme |
| `utils/` | SQLite, OCR, notifications, dates, stats helpers |
| `assets/` | Icons, splash, logos |

Routing is file-based under `app/`; shared logic lives in `hooks/` and `utils/` so screens stay thin.

---

## Roadmap

- **Shelf Premium** *(coming soon)* — Expanded capabilities for power users.
- **Household sharing** — Collaborate on one shelf across family or roommates.
- **Recipe suggestions** — Ideas that use food nearing expiry.
- **Barcode scanning** — Faster add flows from packaged goods.

---

## License

**MIT** — use and modify freely; include the license text in distributions as usual for MIT projects.

---

*Shelf. Track it. Use it. Waste less.*
