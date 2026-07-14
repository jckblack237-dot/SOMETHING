import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Search, ShoppingBag, Tag } from 'lucide-react';
import { products } from '../data/catalog';
import { recentDrops } from '../lib/stats';
import { signedPct } from '../lib/format';
import { Delta } from './ui';

export type View = 'home' | 'shop' | 'product' | 'sellers' | 'insights' | 'basket';

const NAV: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'sellers', label: 'Sellers' },
  { id: 'insights', label: 'Insights' },
];

export default function Header({
  view,
  onNavigate,
  query,
  onQuery,
  basketCount,
}: {
  view: View;
  onNavigate: (v: View) => void;
  query: string;
  onQuery: (q: string) => void;
  basketCount: number;
}) {
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const drops = recentDrops(products).slice(0, 3);

  useEffect(() => {
    if (!bellOpen) return;
    const onDown = (e: PointerEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setBellOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [bellOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-page/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3">
        <button onClick={() => onNavigate('home')} aria-label="Agu home" className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'linear-gradient(135deg, var(--color-s1), var(--color-glow))' }}
          >
            <Tag size={15} className="text-page" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold tracking-[0.2em] text-ink">AGU</span>
        </button>

        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          {NAV.map((n) => {
            const active = view === n.id || (n.id === 'shop' && view === 'product');
            return (
              <button
                key={n.id}
                onClick={() => onNavigate(n.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative px-2.5 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
                  active ? 'text-ink' : 'text-ink-3 hover:text-ink'
                }`}
              >
                {n.label}
                {active && (
                  <motion.span layoutId="hdr-nav" className="absolute inset-x-2.5 -bottom-px h-0.5 bg-s1" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="relative order-last w-full min-w-0 basis-full sm:order-none sm:ml-auto sm:w-auto sm:basis-64">
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search products or brands…"
            aria-label="Search products"
            className="w-full rounded-full border border-edge bg-surface py-2 pl-9 pr-3.5 text-sm text-ink placeholder:text-ink-3 focus:border-s1/60 focus:outline-none"
          />
        </div>

        <div ref={bellRef} className="relative sm:ml-0">
          <button
            onClick={() => setBellOpen((v) => !v)}
            aria-label={`Price drop alerts (${drops.length})`}
            aria-expanded={bellOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-surface text-ink-2 transition-colors hover:text-ink"
          >
            <Bell size={15} />
            {drops.length > 0 && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-s1" aria-hidden />}
          </button>
          <AnimatePresence>
            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 z-30 mt-2 w-72 origin-top-right rounded-xl border border-edge bg-surface p-2 shadow-2xl shadow-black/15"
              >
                <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                  Price drops · last 30 days
                </p>
                {drops.length === 0 ? (
                  <p className="px-2.5 py-2 text-sm text-ink-3">No price drops right now.</p>
                ) : (
                  drops.map(({ product, changePct }) => (
                    <div key={product.id} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-ink/[0.04]">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink">
                          {product.brand} {product.name}
                        </p>
                        <p className="text-[11px] text-ink-3">market average</p>
                      </div>
                      <Delta value={changePct} goodWhenUp={false} format={(v) => signedPct(v)} />
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => onNavigate('basket')}
          aria-label={`Basket (${basketCount} item${basketCount === 1 ? '' : 's'})`}
          aria-current={view === 'basket' ? 'page' : undefined}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-surface text-ink-2 transition-colors hover:text-ink"
        >
          <ShoppingBag size={15} />
          {basketCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-s1 px-1 text-[9px] font-bold text-white">
              {basketCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
