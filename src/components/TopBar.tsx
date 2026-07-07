import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';
import { products, type Category } from '../data/catalog';
import { recentDrops } from '../lib/stats';
import { signedPct } from '../lib/format';
import { Delta, Dropdown } from './ui';

const CATEGORY_OPTIONS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'household', label: 'Household' },
];

export default function TopBar({
  query,
  onQuery,
  category,
  onCategory,
}: {
  query: string;
  onQuery: (q: string) => void;
  category: Category | 'all';
  onCategory: (c: Category | 'all') => void;
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
    <header className="flex items-center gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:max-w-md">
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search products or brands…"
            aria-label="Search products"
            className="w-full rounded-xl border border-edge bg-surface py-2 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-3 focus:border-s1/60 focus:outline-none"
          />
        </div>
        <Dropdown value={category} options={CATEGORY_OPTIONS} onChange={onCategory} label="Filter by category" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div ref={bellRef} className="relative">
          <button
            onClick={() => setBellOpen((v) => !v)}
            aria-label={`Price drop alerts (${drops.length})`}
            aria-expanded={bellOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-edge bg-surface text-ink-2 transition-colors hover:text-ink"
          >
            <Bell size={16} />
            {drops.length > 0 && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-s1" aria-hidden />
            )}
          </button>
          <AnimatePresence>
            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 z-30 mt-2 w-72 origin-top-right rounded-xl border border-edge bg-raised p-2 shadow-2xl shadow-black/50"
              >
                <p className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                  Price drops · last 30 days
                </p>
                {drops.length === 0 ? (
                  <p className="px-2.5 py-2 text-sm text-ink-3">No price drops right now.</p>
                ) : (
                  drops.map(({ product, changePct }) => (
                    <div key={product.id} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/[0.04]">
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

        <div
          aria-hidden
          className="h-9 w-9 rounded-full ring-2 ring-edge"
          style={{ background: 'linear-gradient(135deg, var(--color-s1), var(--color-s3))' }}
        />
      </div>
    </header>
  );
}
