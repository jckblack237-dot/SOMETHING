import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '../data/catalog';
import { bestPriceWins } from '../lib/stats';
import { CardHeader, SourceBadge, TableToggle } from './ui';

export default function StoreWinsCard({ products, sellerIds }: { products: Product[]; sellerIds?: string[] }) {
  const [table, setTable] = useState(false);

  const wins = useMemo(
    () => bestPriceWins(products, sellerIds).sort((a, b) => b.wins - a.wins),
    [products, sellerIds],
  );
  const max = Math.max(...wins.map((w) => w.wins), 1);
  const leader = wins[0];

  return (
    <div className="card flex flex-col p-5">
      <CardHeader
        title="Best-price wins"
        subtitle={`Which seller is cheapest, across ${products.length} tracked item${products.length === 1 ? '' : 's'}`}
      >
        <TableToggle table={table} onToggle={() => setTable((t) => !t)} />
      </CardHeader>

      <AnimatePresence mode="wait" initial={false}>
        {table ? (
          <motion.table
            key="table"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full text-sm"
          >
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-ink-3">
                <th className="py-2 font-medium">Seller</th>
                <th className="py-2 text-right font-medium">Cheapest for</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {wins.map((w) => (
                <tr key={w.store.id} className="border-t border-line">
                  <td className="py-2 text-ink">{w.store.name}</td>
                  <td className="py-2 text-right text-ink-2">
                    {w.wins} item{w.wins === 1 ? '' : 's'}
                  </td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <motion.ul
            key={`chart-${wins.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2.5"
            aria-label="Best-price wins per seller"
          >
            {wins.map((w, i) => {
              const isLeader = w.store.id === leader.store.id && w.wins > 0;
              return (
                <li key={w.store.id} className="flex items-center gap-2.5">
                  <span className="flex w-28 shrink-0 items-center gap-1.5">
                    <SourceBadge source={w.store.source} iconOnly />
                    <span className={`truncate text-xs ${isLeader ? 'font-semibold text-ink' : 'text-ink-2'}`}>
                      {w.store.short}
                    </span>
                  </span>
                  <div className="h-3 flex-1" role="presentation">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(w.wins / max) * 100}%` }}
                      transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-r"
                      style={{ background: isLeader ? 'var(--color-s1)' : 'var(--color-dim)' }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-sm font-medium tabular-nums text-ink">
                    {w.wins}
                  </span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      <p className="mt-auto pt-4 text-xs text-ink-3">
        <span className="font-semibold text-ink-2">{leader.store.name}</span> is cheapest most often in this view.
      </p>
    </div>
  );
}
