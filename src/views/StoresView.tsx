import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { storeProfiles } from '../lib/stats';
import { pct } from '../lib/format';

/** Map a price index (lower = cheaper) onto a 90–110 meter scale. */
function meterWidth(index: number): number {
  return Math.max(4, Math.min(100, ((index - 90) / 20) * 100));
}

export default function StoresView() {
  const profiles = storeProfiles();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Stores</h1>
        <p className="text-sm text-ink-3">{profiles.length} local stores tracked</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {profiles.map((p, i) => {
          const below = p.index < 100;
          const diff = Math.abs(p.index - 100);
          return (
            <motion.article
              key={p.store.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="card flex flex-col gap-4 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-ink">{p.store.name}</h2>
                  <p className="mt-0.5 text-xs text-ink-3">{p.store.tagline}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-lg border border-edge px-2 py-1 text-[11px] text-ink-2">
                  <MapPin size={11} className="text-ink-3" />
                  {p.store.area}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-inset p-3">
                  <p className="text-xl font-semibold text-ink">{p.carried}</p>
                  <p className="text-[11px] text-ink-3">products carried</p>
                </div>
                <div className="rounded-xl bg-inset p-3">
                  <p className="text-xl font-semibold text-ink">{p.wins}</p>
                  <p className="text-[11px] text-ink-3">best-price wins</p>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <p className="text-xs text-ink-2">Price index</p>
                  <p className="text-xs font-semibold tabular-nums" style={{ color: below ? 'var(--color-good)' : 'var(--color-bad)' }}>
                    {p.index.toFixed(1)} · {pct(diff)} {below ? 'below' : 'above'} market
                  </p>
                </div>
                <div
                  className="relative h-2 overflow-hidden rounded-full"
                  style={{ background: '#2b2745' }}
                  role="meter"
                  aria-valuemin={90}
                  aria-valuemax={110}
                  aria-valuenow={Number(p.index.toFixed(1))}
                  aria-label={`${p.store.name} price index (market average = 100)`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${meterWidth(p.index)}%` }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--color-s1)' }}
                  />
                  {/* market par marker at 100 */}
                  <span className="absolute inset-y-0 left-1/2 w-px bg-ink-3/70" aria-hidden />
                </div>
                <p className="mt-1 text-[10px] text-ink-3">scale 90–110 · tick = market average (100)</p>
              </div>

              {p.cheapestFor.length > 0 && (
                <p className="text-xs text-ink-3">
                  Cheapest for{' '}
                  <span className="text-ink-2">
                    {p.cheapestFor.slice(0, 3).map((x) => x.name).join(', ')}
                  </span>
                  {p.cheapestFor.length > 3 && ` +${p.cheapestFor.length - 3} more`}
                </p>
              )}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
