import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgePercent,
  ChevronDown,
  Home as HomeIcon,
  ShieldCheck,
  ShoppingBasket,
  Smartphone,
  Star,
  Store,
  Wallet,
} from 'lucide-react';
import { CATEGORIES, products, stores, type Category } from '../data/catalog';
import { saving, savingsTrend } from '../lib/stats';
import { pct } from '../lib/format';
import { CATEGORY_COLOR } from '../components/ui';
import ProductCard from '../components/ProductCard';
import ProductTile from '../components/ProductTile';

const CATEGORY_ICON: Record<Category, typeof HomeIcon> = {
  electronics: Smartphone,
  groceries: ShoppingBasket,
  household: HomeIcon,
};

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
} as const;

const STEPS = [
  { n: '01', title: 'Search', copy: 'Type any product — a phone, a bag of rice, a rice cooker. Agu finds every seller that lists it.' },
  { n: '02', title: 'Compare', copy: 'Every listed price side by side — shops, websites, Facebook and Instagram pages — cross-checked, best deal called out.' },
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
  { q: 'Is Agu free to use?', a: 'Completely. Agu is a price watch, not a shop — we point you to the seller with the best price and you buy from them directly.' },
  { q: 'Which sellers do you compare?', a: 'Twelve sellers across four channels: supermarkets and hardware shops in Malé and Hulhumalé, Maldivian shopping websites like eSTO and Moolee, and Facebook and Instagram shop pages that sell via DM.' },
  { q: 'Are Facebook and Instagram prices really included?', a: 'Yes — social shops are a huge part of shopping in the Maldives, so Facebook and Instagram listings sit side by side with the big chains, and every comparison shows when each social listing was last cross-checked.' },
  { q: 'Do prices include delivery fees?', a: 'Not yet. We compare listed shelf prices; delivery and pickup costs vary by island and seller, so always check before ordering.' },
  { q: 'How current are the prices?', a: 'Prices shown today are indicative demo data, hand-curated to reflect the market. Live feeds from sellers are the roadmap — the comparison engine is already built for it.' },
  { q: 'How do I list my shop or page on Agu?', a: 'We would love that. Send us your price list or a link to your page and we will add you next to the twelve sellers already tracked.' },
];

export default function Home({
  onShop,
  onOpenProduct,
}: {
  onShop: (c: Category | 'all') => void;
  onOpenProduct: (id: string) => void;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const avgSaving = savingsTrend(products).at(-1) ?? 0;
  const deals = [...products].sort((a, b) => saving(b).pct - saving(a).pct).slice(0, 8);
  const heroTiles = ['rice-cooker', 'sony-ch720n', 'basmathi-5kg', 'philips-led4']
    .map((id) => products.find((p) => p.id === id)!)
    .filter(Boolean);

  const usps = [
    { icon: Store, title: `${stores.length} sellers`, copy: 'shops, websites & social pages' },
    { icon: ShieldCheck, title: 'Cross-checked', copy: 'Facebook & Instagram verified' },
    { icon: BadgePercent, title: `${pct(avgSaving)} avg saving`, copy: 'vs the highest listed price' },
    { icon: Wallet, title: '100% free', copy: 'we link you to the seller' },
  ];

  return (
    <div>
      {/* ——— Hero ——— */}
      <section className="border-b border-edge bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-edge bg-page px-4 py-2 text-xs text-ink-2"
            >
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={11} className="fill-s1 text-s1" />
                ))}
              </span>
              <span className="font-semibold text-ink">4.9</span> loved by island shoppers
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-balance text-4xl font-light leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
            >
              Pay the fair price. Every time.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-ink-2 sm:text-base"
            >
              Agu compares electronics, groceries and household prices across every kind of seller in the Maldives —
              local shops, shopping websites, Facebook and Instagram pages.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.44 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => onShop('all')}
                className="group flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-page transition-transform hover:scale-[1.03] active:scale-95"
              >
                Shop the catalog
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#how"
                className="rounded-full border border-edge px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-ink-2 transition-colors hover:border-ink/30 hover:text-ink"
              >
                How it works
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {heroTiles.map((p, i) => (
              <button key={p.id} onClick={() => onOpenProduct(p.id)} aria-label={`${p.brand} ${p.name}`}>
                <ProductTile
                  product={p}
                  arch={i === 0}
                  iconSize={52}
                  className={`w-full transition-transform duration-300 hover:scale-[1.02] ${i === 0 ? 'aspect-[4/5]' : 'aspect-square'} ${i === 3 ? '-mt-8' : ''}`}
                  badge={i === 0 ? undefined : `−${Math.round(saving(p).pct)}%`}
                />
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ——— USP strip ——— */}
      <section className="border-b border-edge">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((u) => (
            <div key={u.title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-raised">
                <u.icon size={17} className="text-s1" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">{u.title}</span>
                <span className="block text-xs text-ink-3">{u.copy}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5">
        {/* ——— Shop by category ——— */}
        <section className="py-16">
          <motion.div {...reveal} className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-light tracking-tight text-ink">Shop by category</h2>
            <button
              onClick={() => onShop('all')}
              className="text-xs font-medium uppercase tracking-[0.15em] text-ink-3 transition-colors hover:text-ink"
            >
              View all →
            </button>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {CATEGORIES.map(({ id, label }, i) => {
              const Icon = CATEGORY_ICON[id];
              const inCat = products.filter((p) => p.category === id);
              const catSaving = inCat.reduce((s, p) => s + saving(p).pct, 0) / Math.max(inCat.length, 1);
              return (
                <motion.button
                  key={id}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.08 }}
                  onClick={() => onShop(id)}
                  className="card group flex items-center gap-5 p-6 text-left"
                >
                  <span
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
                    style={{ background: `color-mix(in srgb, ${CATEGORY_COLOR[id]} 12%, transparent)` }}
                  >
                    <Icon size={26} strokeWidth={1.6} style={{ color: CATEGORY_COLOR[id] }} />
                  </span>
                  <span>
                    <span className="font-display block text-xl font-light text-ink">{label}</span>
                    <span className="mt-1 block text-xs text-ink-3">
                      {inCat.length} products · save up to{' '}
                      <span className="font-semibold" style={{ color: 'var(--color-good)' }}>
                        {pct(Math.max(...inCat.map((p) => saving(p).pct)))}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[11px] text-ink-3">avg saving {pct(catSaving)}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ——— Today's best deals ——— */}
        <section className="border-t border-edge py-16">
          <motion.div {...reveal} className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-3">Biggest savings</p>
              <h2 className="font-display text-3xl font-light tracking-tight text-ink">Today’s best deals</h2>
            </div>
            <button
              onClick={() => onShop('all')}
              className="text-xs font-medium uppercase tracking-[0.15em] text-ink-3 transition-colors hover:text-ink"
            >
              Shop all →
            </button>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {deals.map((p, i) => (
              <ProductCard key={p.id} product={p} onOpen={onOpenProduct} index={i} />
            ))}
          </div>
        </section>

        {/* ——— How it works ——— */}
        <section id="how" className="border-t border-edge py-16">
          <motion.h2 {...reveal} className="font-display mb-8 text-3xl font-light tracking-tight text-ink">
            How it works
          </motion.h2>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                className="rounded-xl border border-edge p-6"
              >
                <p className="font-display text-4xl font-light text-ink-3/50">{s.n}</p>
                <h3 className="mt-3 text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ——— Reviews ——— */}
        <section className="border-t border-edge py-16">
          <motion.h2 {...reveal} className="font-display mb-8 text-3xl font-light tracking-tight text-ink">
            Shoppers keep the receipts
          </motion.h2>
          <div className="grid gap-5 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <motion.figure
                key={r.name}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                className="card flex flex-col gap-4 p-6"
              >
                <span className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star key={j} size={12} className="fill-s1 text-s1" />
                  ))}
                </span>
                <blockquote className="text-sm leading-relaxed text-ink-2">“{r.quote}”</blockquote>
                <figcaption className="mt-auto text-xs text-ink-3">
                  <span className="font-semibold text-ink-2">{r.name}</span> · {r.place}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        {/* ——— FAQ ——— */}
        <section id="faq" className="border-t border-edge py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <motion.div {...reveal}>
              <h2 className="font-display text-3xl font-light tracking-tight text-ink">Questions, answered</h2>
              <p className="mt-3 text-sm text-ink-2">Everything shoppers and sellers ask us.</p>
            </motion.div>
            <motion.div {...reveal} className="divide-y divide-line rounded-xl border border-edge bg-surface">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-ink transition-colors hover:bg-ink/[0.02]"
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

        {/* ——— CTA band ——— */}
        <section className="py-16">
          <motion.div {...reveal} className="card flex flex-col items-center gap-5 px-6 py-14 text-center">
            <h2 className="font-display max-w-xl text-balance text-3xl font-light tracking-tight text-ink sm:text-4xl">
              Stop guessing. Start comparing.
            </h2>
            <p className="text-sm text-ink-2">The best price in the Maldives is one search away.</p>
            <button
              onClick={() => onShop('all')}
              className="group flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-page transition-transform hover:scale-[1.03] active:scale-95"
            >
              Shop the catalog
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
