# Agu · Maldives Price Watch

A dark, dashboard-style **price comparison website** for the Maldives — compare
electronics, groceries and household items across local shops, Maldivian
shopping websites, and Facebook & Instagram shop pages, priced in Maldivian
Rufiyaa (MVR).

> *Agu* (އަގު) is Dhivehi for "price".

## Features

- **Landing page** — dark, editorial front door in the style of premium
  Framer templates: full-height hero with a live comparison preview,
  numbered sections, seller showcase, animated stats, reviews and an FAQ
  accordion, all with scroll-triggered reveals.
- **Overview dashboard** — KPI stat tiles with sparklines (products tracked,
  average saving, price drops, market price index), per-store price comparison
  bars with the best price highlighted, a saving-headroom donut (click a slice
  to filter by category), and a lowest/average/highest price trend chart with a
  hover crosshair, keyboard navigation and Week/Month/Year ranges.
- **Products** — sortable catalog (biggest saving / lowest price / name) with
  category chips; every row expands into a full store-by-store comparison.
- **Stores** — profiles for each store with a price index meter (vs. market
  average), best-price wins and what it's cheapest for.
- **Every kind of seller** — physical shops, shopping websites, Facebook and
  Instagram pages are compared side by side, each tagged with a source badge
  and a direct link to the seller's website or page.
- **Social cross-checking** — every comparison lists which Facebook and
  Instagram listings the price was verified against, with last-checked
  stamps and links to each listing.
- **Live filtering** — global search plus category and seller-type filters
  (in-store / online shops / Facebook pages / Instagram pages) re-scope every
  chart, stat and list on the page.
- **Seamless transitions** — preloader splash, animated view switches, sliding
  nav and toggle pills, spring-animated numbers, bars and expanding rows, with
  `prefers-reduced-motion` support.
- **Accessible charts** — colorblind-validated palette, table view for every
  chart, keyboard-navigable trend chart, values never gated behind tooltips.

## Sellers tracked

**Shops:** STO Supermart · Agora Central · Redwave Mega · VillaMart ·
Sonee Hardware · Damas Electronics
**Websites:** eSTO.mv · Moolee.mv
**Facebook pages:** Gadget Hub MV · Island Home MV
**Instagram pages:** Isle Gadgets · Casa Maldives

## Tech stack

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 6](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) for transitions
- [Lucide](https://lucide.dev) icons
- Hand-rolled SVG charts (no chart library)

## Getting started

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build      # type-check and build for production (dist/)
npm run preview    # serve the production build locally
npm run lint       # run ESLint
npm test           # run the vitest unit suite
```

## Project structure

```
src/
├── data/catalog.ts        # sellers (shops, websites, FB pages) + products with per-seller MVR prices
├── lib/
│   ├── history.ts         # deterministic price-history generation
│   ├── stats.ts           # savings, wins, index and trend aggregates
│   ├── chart.ts           # SVG chart geometry helpers
│   └── format.ts          # MVR / percentage formatting
├── components/            # charts, cards, sidebar, top bar, UI primitives
├── views/                 # Landing, Overview, Products, Sellers
└── App.tsx                # state + layout
```

## Data

All prices are **hand-curated demo data** — realistic for the Maldivian market
but indicative only. Price histories are generated deterministically (seeded)
so every visitor sees the same series.

Live scraping of every Maldivian website and Facebook page is not possible
from a static site (Facebook restricts automated access), so the app ships as
the full comparison framework across all three seller channels: swap
`src/data/catalog.ts` for a real price feed (API, community submissions, or
per-seller integrations) to go live.
