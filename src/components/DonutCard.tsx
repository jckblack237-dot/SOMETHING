import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Category } from '../data/catalog';
import { savingsByCategory } from '../lib/stats';
import { donutArc } from '../lib/chart';
import { mvr, pct } from '../lib/format';
import { CATEGORY_COLOR, CardHeader } from './ui';

const SIZE = 216;
const R = 76;
const STROKE = 26;
const GAP = 2.4 / R; // ≈2px surface gap at radius R, in radians

export default function DonutCard({
  activeCategory,
  onSelect,
  sellerIds,
}: {
  activeCategory: Category | 'all';
  onSelect: (c: Category | 'all') => void;
  sellerIds?: string[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; i: number } | null>(null);

  const slices = useMemo(() => {
    const data = savingsByCategory(sellerIds);
    const total = data.reduce((s, d) => s + d.total, 0);
    let angle = 0;
    return {
      total,
      // Empty categories stay in the legend but draw no arc (a zero sweep would
      // render as a stray hairline once the pad gap is subtracted).
      arcs: data
        .filter((d) => d.total > 0)
        .map((d) => {
          const sweep = (d.total / total) * Math.PI * 2;
          const arc = { ...d, share: (d.total / total) * 100, a0: angle + GAP / 2, a1: angle + sweep - GAP / 2 };
          angle += sweep;
          return arc;
        }),
      legend: data.map((d) => ({ ...d, share: total > 0 ? (d.total / total) * 100 : 0 })),
    };
  }, [sellerIds]);

  return (
    <div className="card flex flex-col p-5">
      <CardHeader
        title="Saving headroom"
        subtitle="Highest minus lowest listed price, by category — tap a slice to filter"
      />

      <div ref={wrapRef} className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} role="img" aria-label="Saving headroom by category">
          <motion.g
            initial={{ opacity: 0, rotate: -24 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: '50%', originY: '50%' }}
          >
            {slices.arcs.map((s, i) => {
              const dimmed = activeCategory !== 'all' && activeCategory !== s.category;
              return (
                <path
                  key={s.category}
                  d={donutArc(SIZE / 2, SIZE / 2, R, s.a0, s.a1)}
                  fill="none"
                  stroke={CATEGORY_COLOR[s.category]}
                  strokeWidth={tip?.i === i ? STROKE + 4 : STROKE}
                  opacity={dimmed ? 0.28 : 1}
                  className="cursor-pointer transition-all duration-200"
                  role="button"
                  aria-label={`${s.label}: ${mvr(s.total)}, ${pct(s.share)} of headroom. Activate to filter.`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(activeCategory === s.category ? 'all' : s.category);
                    }
                  }}
                  onClick={() => onSelect(activeCategory === s.category ? 'all' : s.category)}
                  onPointerMove={(e) => {
                    const rect = wrapRef.current!.getBoundingClientRect();
                    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top, i });
                  }}
                  onPointerLeave={() => setTip(null)}
                />
              );
            })}
          </motion.g>
        </svg>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[22px] font-semibold leading-none text-ink">{mvr(slices.total, true)}</p>
          <p className="mt-1 text-[11px] text-ink-3">across all items</p>
        </div>

        <AnimatePresence>
          {tip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="pointer-events-none absolute z-20 rounded-lg border border-edge bg-raised px-2.5 py-1.5 text-xs shadow-lg shadow-black/15"
              style={{ left: tip.x + 10, top: tip.y - 10 }}
            >
              <span className="font-semibold text-ink">{mvr(slices.arcs[tip.i].total)}</span>{' '}
              <span className="text-ink-3">
                {slices.arcs[tip.i].label} · {pct(slices.arcs[tip.i].share)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ul className="mt-5 space-y-2.5">
        {slices.legend.map((s) => (
          <li key={s.category} className="flex items-center gap-2.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CATEGORY_COLOR[s.category] }} aria-hidden />
            <span className="text-ink-2">{s.label}</span>
            <span className="ml-auto font-semibold text-ink">{mvr(s.total, true)}</span>
            <span className="w-12 text-right text-xs tabular-nums text-ink-3">{pct(s.share)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
