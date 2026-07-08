import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChevronDown,
  Home,
  Search,
  ShoppingBasket,
  Smartphone,
  Star,
  Tag,
} from 'lucide-react';
import { CATEGORIES, products, stores, type Category } from '../data/catalog';
import { saving, savingsByCategory, savingsTrend } from '../lib/stats';
import { mvr, num, pct } from '../lib/format';
import { AnimatedNumber, CATEGORY_COLOR, SourceBadge } from '../components/ui';
import CompareBars from '../components/CompareBars';

const CATEGORY_ICON: Record<Category, typeof Home> = {
  electronics: Smartphone,
  groceries: ShoppingBasket,
  household: Home,
};

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
} as const;

function SectionTag({ n, label }: { n: string; label: string }) {
  return (
    <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-ink-3">
      /{n}/ — {label}
    </p>
  );
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} size={12} className="fill-s1 text-s1" />
      ))}
    </span>
  );
}

const STEPS = [
  { n: '01', title: 'Search', copy: 'Type any product — a phone, a bag of rice, a rice cooker. Agu finds every seller that lists it.' },
  { n: '02', title: 'Compare', copy: 'See every listed price side by side — shops, websites, Facebook and Instagram pages — cross-checked and the best deal called out.' },
  { n: '03', title: 'Save', copy: 'Jump straight to the seller, or watch the trend and buy when the price dips. The saving is yours.' },
];

const REVIEWS = [
  {
    quote: 'Found my rice cooker MVR 120 cheaper on a Facebook page I had never heard of. That covered a week of groceries.',
    name: 'Aishath R.',
    place: 'Malé',
  },
  {
    quote: 'I check Agu before every big purchase now. Seeing the price trend before buying the TV saved us from a bad week to shop.',
    name: 'Hassan M.',
    place: 'Hulhumalé',
  },
  {
    quote: 'We run a small online page — being listed next to the big chains brought us customers we could never reach before.',
    name: 'Mariyam S.',
    place: 'Addu City',
  },
];

const FAQS = [
  {
    q: 'Is Agu free to use?',
    a: 'Completely. Agu is a price watch, not a shop — we point you to the seller with the best price and you buy from them directly.',
  },
  {
    q: 'Which sellers do you compare?',
    a: 'Twelve sellers across four channels: supermarkets and hardware shops in Malé and Hulhumalé, Maldivian shopping websites like eSTO and Moolee, and Facebook and Instagram shop pages that sell via DM.',
  },
  {
    q: 'Are Facebook and Instagram prices really included?',
    a: 'Yes — social shops are a huge part of shopping in the Maldives, so Facebook and Instagram listings sit side by side with the big chains, and every comparison shows when each social listing was last cross-checked.',
  },
  {
    q: 'Do prices include delivery fees?',
    a: 'Not yet. We compare listed shelf prices; delivery and pickup costs vary by island and seller, so always check before ordering.',
  },
  {
    q: 'How current are the prices?',
    a: 'Prices shown today are indicative demo data, hand-curated to reflect the market. Live feeds from sellers are the roadmap — the comparison engine is already built for it.',
  },
  {
    q: 'How do I list my shop or page on Agu?',
    a: 'We would love that. Send us your price list or a link to your page and we will add you next to the twelve sellers already tracked.',
  },
];

export default function Landing({ onOpen }: { onOpen: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const slices = savingsByCategory();
  const headroom = slices.reduce((s, d) => s + d.total, 0);
  const avgSaving = savingsTrend(products).at(-1) ?? 0;
  const preview = products.find((p) => p.id === 'philips-led4') ?? products[0];

  const stats = [
    { label: 'products tracked', value: products.length, format: (v: number) => num(v) },
    { label: 'sellers compared', value: stores.length, format: (v: number) => num(v) },
    { label: 'avg saving vs highest price', value: avgSaving, format: (v: number) => pct(v) },
    { label: 'saving headroom on the shelf', value: headroom, format: (v: number) => mvr(v, true) },
  ];

  return (
    <div className="overflow-x-clip bg-page">
      {/* ——— Nav ——— */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-edge bg-page/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg, var(--color-s1), var(--color-glow))' }}
            >
              <Tag size={15} className="text-page" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold tracking-[0.2em] text-ink">AGU</span>
          </a>
          <div className="hidden items-center gap-7 text-sm text-ink-2 md:flex">
            <a href="#compare" className="transition-colors hover:text-ink">What we compare</a>
            <a href="#how" className="transition-colors hover:text-ink">How it works</a>
            <a href="#sellers" className="transition-colors hover:text-ink">Sellers</a>
            <a href="#faq" className="transition-colors hover:text-ink">FAQ</a>
          </div>
          <button
            onClick={onOpen}
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-page transition-transform hover:scale-[1.04] active:scale-95"
          >
            Open the dashboard
          </button>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-5">
        {/* ——— Hero ——— */}
        <section className="relative flex min-h-screen flex-col items-center justify-center pb-16 pt-28 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
            style={{ background: 'radial-gradient(closest-side, var(--color-s1), transparent)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-7 flex items-center gap-2 rounded-full border border-edge bg-surface px-4 py-2 text-xs text-ink-2"
          >
            <Stars />
            <span className="font-semibold text-ink">4.9</span> loved by island shoppers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl"
          >
            Every price in the Maldives. One place.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-6 max-w-xl text-pretty text-base text-ink-2 sm:text-lg"
          >
            Agu compares electronics, groceries and household prices across local shops,
            shopping websites, Facebook and Instagram pages — so you never overpay again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={onOpen}
              className="group flex items-center gap-2 rounded-full bg-s1 px-6 py-3 text-sm font-semibold text-page transition-transform hover:scale-[1.04] active:scale-95"
            >
              Compare prices
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href="#how"
              className="rounded-full border border-edge px-6 py-3 text-sm font-medium text-ink-2 transition-colors hover:border-white/25 hover:text-ink"
            >
              How it works
            </a>
          </motion.div>

          {/* live preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-16 w-full max-w-2xl rounded-2xl border border-edge bg-surface p-6 text-left shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">Live comparison</p>
                <p className="mt-1 text-sm font-semibold text-ink">
                  {preview.brand} {preview.name} · {preview.unit}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--color-good)' }}>
                <BadgeCheck size={13} /> best price found
              </span>
            </div>
            <CompareBars product={preview} />
          </motion.div>
        </section>

        {/* ——— /001/ What we compare ——— */}
        <section id="compare" className="border-t border-edge py-24">
          <motion.div {...reveal}>
            <SectionTag n="001" label="What we compare" />
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Three aisles. Twelve sellers. Zero guesswork.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {CATEGORIES.map(({ id, label }, i) => {
              const Icon = CATEGORY_ICON[id];
              const inCat = products.filter((p) => p.category === id);
              const catSaving = inCat.reduce((s, p) => s + saving(p).pct, 0) / Math.max(inCat.length, 1);
              return (
                <motion.div
                  key={id}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.1 }}
                  className="card p-6"
                >
                  <span
                    className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `color-mix(in srgb, ${CATEGORY_COLOR[id]} 18%, transparent)` }}
                  >
                    <Icon size={18} style={{ color: CATEGORY_COLOR[id] }} />
                  </span>
                  <h3 className="text-lg font-semibold text-ink">{label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">
                    {inCat.length} tracked products, from daily staples to big-ticket buys, compared across every
                    seller that lists them.
                  </p>
                  <p className="mt-4 text-xs text-ink-3">
                    avg saving in this aisle{' '}
                    <span className="font-semibold" style={{ color: 'var(--color-good)' }}>
                      {pct(catSaving)}
                    </span>
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ——— /002/ How it works ——— */}
        <section id="how" className="border-t border-edge py-24">
          <motion.div {...reveal}>
            <SectionTag n="002" label="How it works" />
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              From “how much?” to “done” in three steps.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.1 }}
                className="rounded-2xl border border-edge p-6"
              >
                <p className="text-4xl font-semibold tracking-tight text-ink-3/60">{s.n}</p>
                <h3 className="mt-4 flex items-center gap-2 text-lg font-semibold text-ink">
                  {i === 0 && <Search size={16} className="text-s1" />}
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ——— /003/ Sellers ——— */}
        <section id="sellers" className="border-t border-edge py-24">
          <motion.div {...reveal} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionTag n="003" label="Sellers" />
              <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Shops, websites, Facebook & Instagram — side by side.
              </h2>
            </div>
            <button
              onClick={onOpen}
              className="group flex items-center gap-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink"
            >
              See all sellers
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stores.map((s, i) => (
              <motion.a
                key={s.id}
                {...reveal}
                transition={{ ...reveal.transition, delay: (i % 4) * 0.06 }}
                href={s.url ?? '#sellers'}
                target={s.url ? '_blank' : undefined}
                rel={s.url ? 'noopener noreferrer' : undefined}
                className="card group flex flex-col gap-3 p-5"
              >
                <div className="flex items-center justify-between">
                  <SourceBadge source={s.source} iconOnly />
                  {s.url && (
                    <ArrowUpRight size={13} className="text-ink-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{s.name}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-ink-3">{s.tagline}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* ——— /004/ The numbers ——— */}
        <section className="border-t border-edge py-24">
          <motion.div {...reveal}>
            <SectionTag n="004" label="The numbers" />
          </motion.div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
                <p className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  <AnimatedNumber value={s.value} format={s.format} />
                </p>
                <p className="mt-2 text-sm text-ink-3">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ——— /005/ Reviews ——— */}
        <section className="border-t border-edge py-24">
          <motion.div {...reveal}>
            <SectionTag n="005" label="Reviews" />
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Shoppers keep the receipts.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <motion.figure
                key={r.name}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.1 }}
                className="card flex flex-col gap-4 p-6"
              >
                <Stars />
                <blockquote className="text-sm leading-relaxed text-ink-2">“{r.quote}”</blockquote>
                <figcaption className="mt-auto text-xs text-ink-3">
                  <span className="font-semibold text-ink-2">{r.name}</span> · {r.place}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        {/* ——— /006/ FAQ ——— */}
        <section id="faq" className="border-t border-edge py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <motion.div {...reveal}>
              <SectionTag n="006" label="FAQ" />
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Questions, answered.
              </h2>
              <p className="mt-3 text-sm text-ink-2">Everything shoppers and sellers ask us.</p>
            </motion.div>

            <motion.div {...reveal} className="divide-y divide-line rounded-2xl border border-edge">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-ink transition-colors hover:bg-white/[0.02]"
                    >
                      {f.q}
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-ink-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm leading-relaxed text-ink-2">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ——— CTA ——— */}
        <section className="border-t border-edge py-28 text-center">
          <motion.div {...reveal} className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[100px]"
              style={{ background: 'radial-gradient(closest-side, var(--color-s1), transparent)' }}
            />
            <h2 className="relative mx-auto max-w-2xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Stop guessing. Start comparing.
            </h2>
            <p className="relative mt-4 text-sm text-ink-2 sm:text-base">
              The best price in the Maldives is one search away.
            </p>
            <button
              onClick={onOpen}
              className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-s1 px-7 py-3.5 text-sm font-semibold text-page transition-transform hover:scale-[1.04] active:scale-95"
            >
              Open the dashboard
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        </section>
      </main>

      {/* ——— Footer ——— */}
      <footer className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-ink-3">
          <span className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md"
              style={{ background: 'linear-gradient(135deg, var(--color-s1), var(--color-glow))' }}
            >
              <Tag size={11} className="text-page" strokeWidth={2.5} />
            </span>
            Agu · Maldives price watch
          </span>
          <span>Demo data — prices indicative, in MVR</span>
          <div className="flex items-center gap-5">
            <a href="#compare" className="transition-colors hover:text-ink-2">Compare</a>
            <a href="#sellers" className="transition-colors hover:text-ink-2">Sellers</a>
            <a href="#faq" className="transition-colors hover:text-ink-2">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
