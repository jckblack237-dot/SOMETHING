# Agu · Maldives Price Watch

A dark, dashboard-style **price comparison website** for the Maldives — compare
electronics, groceries and household items across local shops, Maldivian
shopping websites, and Facebook & Instagram shop pages, priced in Maldivian
Rufiyaa (MVR).

> *Agu* (އަގު) is Dhivehi for "price".

## Features

- **Shop-style experience** — storefront homepage (hero, category tiles,
  best-deals grid, reviews, FAQ), a product-card catalog with category
  chips, seller-type filter and sorting, and full product pages with
  breadcrumbs, sale badges and related products.
- **Every kind of seller** — physical shops, shopping websites, Facebook and
  Instagram pages compared side by side on every product page, with source
  badges and direct links to each seller.
- **Social cross-checking** — every comparison lists which Facebook and
  Instagram listings the price was verified against, with last-checked
  stamps and links.
- **Market insights** — KPI tiles with sparklines, a saving-headroom donut,
  lowest/average/highest price-trend charts with crosshair, keyboard
  navigation and table views, and a best-price-wins chart, all scoped by
  category and seller-type filters.
- **Warm boho design** — Catamaran + Montserrat typography, white cards on
  warm paper, black pill buttons, and a colorblind-validated terracotta /
  aqua-green / plum chart palette.

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
