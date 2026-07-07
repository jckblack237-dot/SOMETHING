import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '../data/catalog';
import { priceHistory, type Range } from '../lib/history';
import { areaPath, niceTicks, smoothPath } from '../lib/chart';
import { mvr, num } from '../lib/format';
import { CardHeader, Segmented, TableToggle } from './ui';

const SERIES = [
  { key: 'high', name: 'Highest', color: 'var(--color-s3)' },
  { key: 'avg', name: 'Average', color: 'var(--color-s1)' },
  { key: 'low', name: 'Lowest', color: 'var(--color-s2)' },
] as const;

const W = 680;
const H = 288;
const M = { l: 56, r: 16, t: 12, b: 30 };
const plotW = W - M.l - M.r;
const plotH = H - M.t - M.b;

export default function PriceTrendCard({
  product,
  range,
  onRangeChange,
}: {
  product: Product;
  range: Range;
  onRangeChange: (r: Range) => void;
}) {
  const [table, setTable] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const data = useMemo(() => priceHistory(product, range), [product, range]);
  const n = data.length;

  const { ticks, lo, hi } = useMemo(() => {
    const values = data.flatMap((d) => [d.low, d.high]);
    return niceTicks(Math.min(...values) * 0.985, Math.max(...values) * 1.015, 4);
  }, [data]);

  const x = (i: number) => M.l + (i / (n - 1)) * plotW;
  const y = (v: number) => M.t + (1 - (v - lo) / (hi - lo)) * plotH;

  const paths = useMemo(
    () =>
      SERIES.map((s) => {
        const pts = data.map((d, i) => [x(i), y(d[s.key])] as [number, number]);
        return { ...s, line: smoothPath(pts), area: areaPath(pts, M.t + plotH) };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, lo, hi],
  );

  const move = (clientX: number, el: SVGSVGElement) => {
    const rect = el.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * W;
    setHover(Math.max(0, Math.min(n - 1, Math.round(((px - M.l) / plotW) * (n - 1)))));
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? n - 1) - 1));
    else if (e.key === 'ArrowRight') setHover((h) => Math.min(n - 1, (h ?? -1) + 1));
    else if (e.key === 'Home') setHover(0);
    else if (e.key === 'End') setHover(n - 1);
    else if (e.key === 'Escape') setHover(null);
    else return;
    e.preventDefault();
  };

  const hovered = hover != null ? data[hover] : null;
  const tooltipLeft = hover != null ? (x(hover) / W) * 100 : 0;
  const flip = hover != null && hover > n / 2;

  return (
    <div className="card p-5">
      <CardHeader title="Price trend" subtitle={`${product.brand} ${product.name} — lowest, average and highest shelf price across stores`}>
        <div className="flex items-center gap-2">
          <Segmented
            id="range"
            value={range}
            onChange={onRangeChange}
            options={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
            ]}
          />
          <TableToggle table={table} onToggle={() => setTable((t) => !t)} />
        </div>
      </CardHeader>

      <div className="mb-3 flex items-center gap-4" aria-hidden>
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-[11px] text-ink-2">
            <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {table ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="slim-scroll max-h-72 overflow-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-ink-3">
                  <th className="py-2 font-medium">Date</th>
                  {SERIES.map((s) => (
                    <th key={s.key} className="py-2 text-right font-medium">
                      {s.name} (MVR)
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {data.map((d) => (
                  <tr key={d.label} className="border-t border-line text-ink-2">
                    <td className="py-2 text-ink">{d.label}</td>
                    <td className="py-2 text-right">{num(d.high)}</td>
                    <td className="py-2 text-right">{num(d.avg)}</td>
                    <td className="py-2 text-right">{num(d.low)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            key={`chart-${product.id}-${range}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full cursor-crosshair select-none"
              role="img"
              aria-label={`Price trend for ${product.brand} ${product.name}. Use arrow keys to inspect values.`}
              tabIndex={0}
              onKeyDown={onKey}
              onPointerMove={(e) => move(e.clientX, e.currentTarget)}
              onPointerLeave={() => setHover(null)}
              onBlur={() => setHover(null)}
            >
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeWidth="1" />
                  <text x={M.l - 10} y={y(t) + 3} textAnchor="end" fontSize="10" fill="var(--color-ink-3)" className="tabular-nums">
                    {num(t)}
                  </text>
                </g>
              ))}

              {data.map((d, i) => (
                <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-ink-3)">
                  {d.label}
                </text>
              ))}

              {paths.map((p) => (
                <g key={p.key}>
                  <path d={p.area} fill={p.color} opacity="0.1" />
                  <path d={p.line} fill="none" stroke={p.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              ))}

              {hover != null && (
                <g>
                  <line x1={x(hover)} x2={x(hover)} y1={M.t} y2={M.t + plotH} stroke="var(--color-ink-3)" strokeWidth="1" />
                  {SERIES.map((s) => (
                    <circle
                      key={s.key}
                      cx={x(hover)}
                      cy={y(data[hover][s.key])}
                      r="4"
                      fill={s.color}
                      stroke="var(--color-surface)"
                      strokeWidth="2"
                    />
                  ))}
                </g>
              )}
            </svg>

            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="pointer-events-none absolute top-2 z-20 min-w-36 rounded-xl border border-edge bg-raised p-3 shadow-xl shadow-black/50"
                  style={{
                    left: `${tooltipLeft}%`,
                    transform: flip ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
                  }}
                >
                  <p className="mb-1.5 text-[11px] text-ink-3">{hovered.label}</p>
                  {SERIES.map((s) => (
                    <p key={s.key} className="flex items-center gap-2 py-0.5 text-xs">
                      <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />
                      <span className="font-semibold text-ink">{mvr(hovered[s.key])}</span>
                      <span className="text-ink-3">{s.name}</span>
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
