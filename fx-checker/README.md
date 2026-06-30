# FX Checker — Foreign Exchange Currency Converter

A real-time currency converter and market tracker built with React, TypeScript, and Vite. Submitted for the Frontend Mentor hackathon.

---

## Features

- **Live Markets Ticker** — scrolling ticker with 18 currency pairs, real-time rates, and directional change indicators
- **Currency Converter** — send/receive fields with comma-formatted input, live exchange rate display, and swap functionality
- **Compare Tab** — compare the active base currency against all supported currencies with a sticky header and scrollable list
- **History Tab** — area chart of historical rate data with Open, Last, Change, and % Change stat cards; supports 1d / 1w / 1m / 3m / 1y / 5y ranges
- **Favourites Tab** — pinned currency pairs with live rates and quick-load into the converter
- **Flag Icons** — 159 country flag images with an initials fallback component for unmapped currencies (commodities, special drawing rights)
- **Log Conversion** — persist conversion records to localStorage via the Log context

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build tool | Vite 8 |
| Styling | CSS Modules |
| Charts | Recharts |
| API | Frankfurter API v2 (`api.frankfurter.dev/v2`) |
| State | React Context API + localStorage |

---

## Project Structure

```
fx-checker/
├── public/
│   └── assets/
│       ├── fonts/          # JetBrains Mono variable font
│       └── images/
│           ├── flags/      # 159 .webp flag images from flagcdn.com
│           └── icons/      # SVG UI icons
├── src/
│   ├── components/
│   │   ├── Converter/      # Send/receive cards, swap button, rate row, action buttons
│   │   ├── CurrencyFlag/   # Flag image with initials fallback
│   │   ├── CurrencyPicker/ # Modal currency selector
│   │   ├── Compare/        # Sticky header + scrollable currency list card
│   │   ├── Favourites/     # Pinned pairs card
│   │   ├── History/        # Rate chart + stat cards
│   │   ├── LiveRates/      # Scrolling ticker with loading skeleton
│   │   ├── Header/         # App header
│   │   ├── Log/            # Conversion log
│   │   └── Tabs/           # Tab navigation (Compare, History, Favourites, Log)
│   ├── context/
│   │   ├── CurrencyContext.tsx   # Base/quote, rates, ticker, swap
│   │   ├── PinnedContext.tsx     # Pinned pairs (localStorage: fx-pinned)
│   │   └── LogContext.tsx        # Conversion log (localStorage: fx-log)
│   ├── lib/
│   │   ├── api.ts                # Frankfurter API calls
│   │   └── currencyFlags.ts      # ISO 4217 → ISO 3166-1 alpha-2 mapping (~160 currencies)
│   └── types.ts
├── vercel.json
└── vite.config.ts
```

---

## Key Learnings

### Flag coverage
The Frankfurter API returns ~160 currencies. Most flag CDNs only cover ~60. We downloaded 99 additional flags from `flagcdn.com` and built a `CurrencyFlag` component with a React `useState` fallback — if the `.webp` fails to load, it renders a colored circle with the currency's initials. Commodities like XAU (gold) and XAG (silver) intentionally hit this fallback.

### Comma-formatted number input
Browser `<input type="number">` does not support comma formatting. We switched to `type="text" inputMode="decimal"`, managed a local `displaySend` state, and used a `useRef` flag (`isTyping`) to prevent the external-sync `useEffect` from overriding the user's in-progress input on every keystroke.

### Recharts Tooltip type mismatch
Recharts' `Tooltip` formatter prop types `value` as `ValueType | undefined`, not `number`. Casting via `Number(value)` resolved the TypeScript 6 strict-mode error that was blocking the production build.

### Scrollable section without global layout changes
Making only the Compare list scrollable (not the whole page) required: `overflow: hidden` + `max-height: calc(100svh - 420px)` on the container, `flex-shrink: 0` on the sticky header, and `flex: 1; overflow-y: auto; min-height: 0` on the list. No changes to global layout were needed.

### Vercel deployment
Vercel auto-detected this Vite project as Next.js (looking for `pages/` or `app/` directories). Fix: set `"framework": "vite"` in `vercel.json` and change the Framework Preset to **Vite** in the Vercel project settings under **Settings → General → Build & Development Settings**.

---

## Running Locally

```bash
cd fx-checker
npm install
npm run dev
```

Open `http://localhost:5173`.

## Building for Production

```bash
npm run build
```

Output is in `dist/`. Deploy by dragging `dist/` to [app.netlify.com/drop](https://app.netlify.com/drop) or via the Vercel dashboard.
