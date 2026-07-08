import { motion } from 'framer-motion';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import { stores, type Product } from '../data/catalog';
import { mvr, num, pct } from '../lib/format';
import { saving } from '../lib/stats';
import { SourceBadge } from './ui';

/**
 * Horizontal price bars for one product across sellers, best price emphasized.
 * Every value is directly labeled, so this chart is its own table view.
 */
export default function CompareBars({ product, sellerIds }: { product: Product; sellerIds?: string[] }) {
  const inScope = stores.filter((s) => !sellerIds || sellerIds.includes(s.id));
  const rows = inScope
    .map((store) => ({ store, price: product.prices[store.id] }))
    .filter((r): r is { store: (typeof stores)[number]; price: number } => r.price != null)
    .sort((a, b) => a.price - b.price);
  if (rows.length === 0) return null;
  const skipped = inScope.filter((s) => product.prices[s.id] == null);
  const max = rows[rows.length - 1].price;
  const s = saving(product, sellerIds);

  return (
    <div>
      <ul className="space-y-2.5">
        {rows.map(({ store, price }, i) => {
          const best = i === 0;
          return (
            <li key={store.id} className="flex items-center gap-2.5">
              <span className="flex w-36 shrink-0 items-center gap-1.5">
                <SourceBadge source={store.source} iconOnly />
                {store.url ? (
                  <a
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex min-w-0 items-center gap-1 text-xs hover:underline ${best ? 'font-semibold text-ink' : 'text-ink-2'}`}
                  >
                    <span className="truncate">{store.name}</span>
                    <ExternalLink size={10} className="shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                ) : (
                  <span className={`truncate text-xs ${best ? 'font-semibold text-ink' : 'text-ink-2'}`}>{store.name}</span>
                )}
              </span>
              <div className="h-3.5 flex-1" role="presentation">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(price / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-r"
                  style={{ background: best ? 'var(--color-s1)' : 'var(--color-dim)' }}
                />
              </div>
              <span className="w-20 shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                {num(price)}
              </span>
              <span className="w-20 shrink-0">
                {best && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--color-good)' }}>
                    <BadgeCheck size={13} /> Best price
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-ink-3">
        {rows.length > 1 ? (
          <>
            Buy at <span className="font-semibold text-ink-2">{s.bestStore.name}</span> and save{' '}
            <span className="font-semibold" style={{ color: 'var(--color-good)' }}>
              {mvr(s.abs)} ({pct(s.pct)})
            </span>{' '}
            vs the highest listed price.
          </>
        ) : (
          <>
            Only <span className="font-semibold text-ink-2">{s.bestStore.name}</span> lists this item in the current
            seller filter.
          </>
        )}
        {skipped.length > 0 && (
          <span className="mt-1 block">Not listed at {skipped.map((st) => st.short).join(', ')}.</span>
        )}
      </p>
    </div>
  );
}
