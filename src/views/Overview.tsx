import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import type { Category, Product } from '../data/catalog';
import type { Range } from '../lib/history';
import { dropsTrend, marketIndex, recentDrops, savingsTrend, storesCarrying } from '../lib/stats';
import { num, pct } from '../lib/format';
import StatTile, { type StatTileProps } from '../components/StatTile';
import CompareCard from '../components/CompareCard';
import DonutCard from '../components/DonutCard';
import PriceTrendCard from '../components/PriceTrendCard';
import StoreWinsCard from '../components/StoreWinsCard';

function dateChip(): string {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 6 * 86_400_000);
  const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt.format(weekAgo)} — ${fmt.format(now)}, ${now.getFullYear()}`;
}

/** Gentle deterministic ramp ending at `end` — context spark for count tiles. */
function rampSpark(end: number, floor: number): number[] {
  return Array.from({ length: 12 }, (_, i) => {
    const t = i / 11;
    return floor + (end - floor) * t + Math.sin(i * 2.1) * (end - floor) * 0.06;
  });
}

export default function Overview({
  products,
  sellerIds,
  selected,
  onSelect,
  range,
  onRange,
  category,
  onCategory,
}: {
  products: Product[];
  sellerIds: string[];
  selected: Product | null;
  onSelect: (id: string) => void;
  range: Range;
  onRange: (r: Range) => void;
  category: Category | 'all';
  onCategory: (c: Category | 'all') => void;
}) {
  const tiles = useMemo<StatTileProps[]>(() => {
    if (products.length === 0) return [];
    const savings = savingsTrend(products, sellerIds);
    const index = marketIndex(products, sellerIds);
    const drops = dropsTrend(products, sellerIds);
    const storeCount = storesCarrying(products, sellerIds);
    const int = (v: number) => num(v);
    return [
      {
        label: 'Products tracked',
        value: products.length,
        format: int,
        spark: rampSpark(products.length, Math.max(1, products.length * 0.6)),
      },
      {
        label: 'Sellers compared',
        value: storeCount,
        format: int,
        spark: rampSpark(storeCount, Math.max(1, storeCount - 2)),
      },
      {
        label: 'Avg saving vs highest price',
        value: savings[savings.length - 1],
        format: (v) => pct(v),
        delta: savings[savings.length - 1] - savings[savings.length - 2],
        deltaFormat: (v) => `${Math.abs(v).toFixed(1)}pp`,
        deltaLabel: 'vs last month',
        goodWhenUp: true,
        spark: savings,
      },
      {
        label: 'Price drops · 30 days',
        value: recentDrops(products, sellerIds).length,
        format: int,
        delta: drops[drops.length - 1] - drops[drops.length - 2],
        deltaFormat: (v) => `${num(Math.abs(v))}`,
        deltaLabel: 'falling vs previous check',
        goodWhenUp: true,
        spark: drops,
      },
      {
        label: 'Market price index',
        value: index[index.length - 1],
        format: (v) => v.toFixed(1),
        delta: index[index.length - 1] - index[index.length - 2],
        deltaFormat: (v) => `${Math.abs(v).toFixed(1)}pt`,
        deltaLabel: 'Jan = 100 · lower is cheaper',
        goodWhenUp: false,
        spark: index,
      },
    ];
  }, [products, sellerIds]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-light tracking-tight text-ink">Dashboard</h1>
        <span className="flex items-center gap-2 rounded-xl border border-edge bg-surface px-3.5 py-2 text-xs text-ink-2">
          <CalendarDays size={14} className="text-ink-3" />
          {dateChip()}
        </span>
      </div>

      {tiles.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {tiles.map((t, i) => (
            <StatTile key={t.label} {...t} index={i} />
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CompareCard products={products} sellerIds={sellerIds} selected={selected} onSelect={onSelect} />
        </div>
        <DonutCard activeCategory={category} onSelect={onCategory} sellerIds={sellerIds} />
      </div>

      {selected && (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <PriceTrendCard product={selected} range={range} onRangeChange={onRange} sellerIds={sellerIds} />
          </div>
          <StoreWinsCard products={products} sellerIds={sellerIds} />
        </div>
      )}
    </div>
  );
}
