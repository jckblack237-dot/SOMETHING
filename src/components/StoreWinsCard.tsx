import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '../data/catalog';
import { bestPriceWins } from '../lib/stats';
import { niceTicks, roundedColumn } from '../lib/chart';
import { CardHeader, TableToggle } from './ui';

const W = 320;
const H = 224;
const M = { l: 30, r: 8, t: 14, b: 26 };
const plotW = W - M.l - M.r;
const plotH = H - M.t - M.b;
const COL_W = 22;

export default function StoreWinsCard({ products }: { products: Product[] }) {
  const [table, setTable] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const wins = useMemo(() => bestPriceWins(products), [products]);
  const max = Math.max(...wins.map((w) => w.wins), 1);
  const leader = wins.reduce((a, b) => (b.wins > a.wins ? b : a), wins[0]);
  const { ticks, hi } = niceTicks(0, max, 3);

  const x = (i: number) => M.l + ((i + 0.5) / wins.length) * plotW - COL_W / 2;
  const y = (v: number) => M.t + (1 - v / hi) * plotH;

  return (
    <div className="card flex flex-col p-5">
      <CardHeader
        title="Best-price wins"
        subtitle={`Which store is cheapest, across ${products.length} tracked item${products.length === 1 ? '' : 's'}`}
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
                <th className="py-2 font-medium">Store</th>
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
          <motion.div
            key="chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative my-auto"
          >
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Best-price wins per store">
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeWidth="1" />
                  <text x={M.l - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill="var(--color-ink-3)" className="tabular-nums">
                    {t}
                  </text>
                </g>
              ))}

              {wins.map((w, i) => {
                const isLeader = w.store.id === leader.store.id;
                const h = Math.max(plotH * (w.wins / hi), w.wins === 0 ? 0 : 3);
                return (
                  <g key={w.store.id}>
                    {w.wins > 0 && (
                      <motion.path
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformBox: 'fill-box', originY: 1 }}
                        d={roundedColumn(x(i), M.t + plotH - h, COL_W, h)}
                        fill={isLeader ? 'var(--color-s1)' : 'var(--color-dim)'}
                        opacity={hover === null || hover === i ? 1 : 0.55}
                        className="transition-opacity duration-150"
                      />
                    )}
                    {isLeader && (
                      <text
                        x={x(i) + COL_W / 2}
                        y={M.t + plotH - h - 6}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="600"
                        fill="var(--color-ink)"
                      >
                        {w.wins}
                      </text>
                    )}
                    <text
                      x={x(i) + COL_W / 2}
                      y={H - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fill={hover === i ? 'var(--color-ink)' : 'var(--color-ink-3)'}
                    >
                      {w.store.short}
                    </text>
                    {/* generous invisible hit target per column */}
                    <rect
                      x={x(i) - 6}
                      y={M.t}
                      width={COL_W + 12}
                      height={plotH}
                      fill="transparent"
                      onPointerEnter={() => setHover(i)}
                      onPointerLeave={() => setHover(null)}
                    />
                  </g>
                );
              })}
            </svg>

            <AnimatePresence>
              {hover != null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="pointer-events-none absolute z-20 rounded-lg border border-edge bg-raised px-2.5 py-1.5 text-xs shadow-lg shadow-black/50"
                  style={{
                    left: `${((x(hover) + COL_W / 2) / W) * 100}%`,
                    top: 0,
                    transform: hover > wins.length / 2 ? 'translateX(calc(-100% - 8px))' : 'translateX(8px)',
                  }}
                >
                  <span className="font-semibold text-ink">{wins[hover].wins}</span>{' '}
                  <span className="text-ink-3">
                    win{wins[hover].wins === 1 ? '' : 's'} · {wins[hover].store.name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-auto pt-3 text-xs text-ink-3">
        <span className="font-semibold text-ink-2">{leader.store.name}</span> is cheapest most often in this view.
      </p>
    </div>
  );
}
