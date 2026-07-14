import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { CATEGORIES, CATEGORY_LABEL, type Category, type Product } from '../data/catalog';
import { avgTrend } from '../lib/history';
import { saving } from '../lib/stats';
import { mvr, pct } from '../lib/format';
import { CategoryDot, Dropdown, Sparkline } from '../components/ui';
import CompareBars from '../components/CompareBars';

type Sort = 'saving' | 'price' | 'name';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'saving', label: 'Biggest saving' },
  { value: 'price', label: 'Lowest price' },
  { value: 'name', label: 'Name A–Z' },
];

export default function ProductsView({
  products,
  sellerIds,
  category,
  onCategory,
  onViewTrend,
}: {
  products: Product[];
  sellerIds: string[];
  category: Category | 'all';
  onCategory: (c: Category | 'all') => void;
  onViewTrend: (id: string) => void;
}) {
  const [sort, setSort] = useState<Sort>('saving');
  const [open, setOpen] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === 'saving') list.sort((a, b) => saving(b, sellerIds).pct - saving(a, sellerIds).pct);
    else if (sort === 'price') list.sort((a, b) => saving(a, sellerIds).best - saving(b, sellerIds).best);
    else list.sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`));
    return list;
  }, [products, sort, sellerIds]);

  const chips: { value: Category | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-light tracking-tight text-ink">Products</h1>
        <p className="text-sm text-ink-3">
          {sorted.length} item{sorted.length === 1 ? '' : 's'} · prices in MVR
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full bg-inset p-1">
          {chips.map((c) => {
            const active = c.value === category;
            return (
              <button
                key={c.value}
                onClick={() => onCategory(c.value)}
                aria-pressed={active}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'text-page' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{c.label}</span>
              </button>
            );
          })}
        </div>
        <Dropdown value={sort} options={SORTS} onChange={setSort} label="Sort products" />
      </div>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[1fr_110px_130px_110px_110px_36px] gap-3 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-ink-3 md:grid">
          <span>Product</span>
          <span>Category</span>
          <span className="text-right">Best price</span>
          <span className="text-right">Saving</span>
          <span className="text-right">12-mo trend</span>
          <span />
        </div>

        {sorted.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink-3">No products match your search.</p>
        )}

        <AnimatePresence initial={false}>
          {sorted.map((p) => {
            const s = saving(p, sellerIds);
            const expanded = open === p.id;
            return (
              <motion.div
                key={p.id}
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-line last:border-b-0"
              >
                <button
                  onClick={() => setOpen(expanded ? null : p.id)}
                  aria-expanded={expanded}
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-ink/[0.03] md:grid-cols-[1fr_110px_130px_110px_110px_36px]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">
                      {p.brand} {p.name}
                    </span>
                    <span className="text-xs text-ink-3">{p.unit}</span>
                  </span>
                  <span className="hidden items-center gap-1.5 text-xs text-ink-2 md:flex">
                    <CategoryDot category={p.category} size={6} />
                    {CATEGORY_LABEL[p.category]}
                  </span>
                  <span className="hidden text-right md:block">
                    <span className="block text-sm font-semibold tabular-nums text-ink">{mvr(s.best)}</span>
                    <span className="text-[11px] text-ink-3">at {s.bestStore.short}</span>
                  </span>
                  <span className="hidden text-right text-sm font-semibold md:block" style={{ color: 'var(--color-good)' }}>
                    {pct(s.pct)}
                  </span>
                  <span className="hidden justify-end md:flex">
                    <Sparkline data={avgTrend(p, sellerIds)} width={84} height={30} />
                  </span>
                  <span className="flex justify-end">
                    <ChevronDown
                      size={16}
                      className={`text-ink-3 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-line bg-inset/50 px-5 py-5">
                        <div className="mx-auto max-w-2xl">
                          <CompareBars product={p} sellerIds={sellerIds} />
                          <button
                            onClick={() => onViewTrend(p.id)}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-page transition-transform hover:scale-[1.03] active:scale-95"
                          >
                            <TrendingUp size={14} />
                            View price trend
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
