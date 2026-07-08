import { AnimatePresence, motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import type { Product } from '../data/catalog';
import { CATEGORY_LABEL } from '../data/catalog';
import { mvr } from '../lib/format';
import { saving } from '../lib/stats';
import { CardHeader, CategoryDot } from './ui';
import CompareBars from './CompareBars';

export default function CompareCard({
  products,
  selected,
  onSelect,
  sellerIds,
}: {
  products: Product[];
  selected: Product | null;
  onSelect: (id: string) => void;
  sellerIds?: string[];
}) {
  return (
    <div className="card p-5">
      <CardHeader
        title="Compare prices"
        subtitle={`${products.length} item${products.length === 1 ? '' : 's'} in view — pick one to compare sellers`}
      />

      {products.length === 0 || !selected ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-ink-3">
          <SearchX size={28} />
          <p className="text-sm">No products match your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <ul className="slim-scroll -mx-1 max-h-80 space-y-1 overflow-y-auto px-1" aria-label="Products">
            {products.map((p) => {
              const active = p.id === selected.id;
              return (
                <li key={p.id} className="relative">
                  {active && (
                    <motion.span
                      layoutId="compare-active"
                      className="absolute inset-0 rounded-xl bg-raised ring-1 ring-edge"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <button
                    onClick={() => onSelect(p.id)}
                    aria-pressed={active}
                    className="relative z-10 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <CategoryDot category={p.category} />
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm ${active ? 'font-semibold text-ink' : 'text-ink-2'}`}>
                        {p.name}
                      </span>
                      <span className="block text-[11px] text-ink-3">{p.brand}</span>
                    </span>
                    <span className="shrink-0 text-xs font-medium tabular-nums text-ink-2">
                      {mvr(saving(p, sellerIds).best, true)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-ink">
                    {selected.brand} {selected.name}
                  </h4>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-3">
                    <CategoryDot category={selected.category} size={6} />
                    {CATEGORY_LABEL[selected.category]} · {selected.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold leading-none text-ink">{mvr(saving(selected, sellerIds).best)}</p>
                  <p className="mt-1 text-[11px] text-ink-3">best price today</p>
                </div>
              </div>
              <CompareBars product={selected} sellerIds={sellerIds} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
