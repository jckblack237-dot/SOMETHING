import type { Product } from '../data/catalog';

export type Range = 'week' | 'month' | 'year';

export interface HistoryPoint {
  label: string;
  low: number;
  avg: number;
  high: number;
}

/** Small deterministic PRNG so every render (and every visitor) sees the same series. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic "hours since this social listing was last cross-checked" (1–23). */
export function checkedHoursAgo(key: string): number {
  return (hash(key) % 23) + 1;
}

const RANGE_SPEC: Record<Range, { points: number; jitter: number; drift: number }> = {
  week: { points: 7, jitter: 0.012, drift: 0.004 },
  month: { points: 10, jitter: 0.02, drift: 0.008 },
  year: { points: 12, jitter: 0.045, drift: 0.014 },
};

const DAY = 86_400_000;
const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const shortMonth = new Intl.DateTimeFormat('en-GB', { month: 'short' });

function labelsFor(range: Range, points: number): string[] {
  const now = new Date();
  const out: string[] = [];
  for (let i = points - 1; i >= 0; i--) {
    if (range === 'year') {
      out.push(shortMonth.format(new Date(now.getFullYear(), now.getMonth() - i, 1)));
    } else if (range === 'month') {
      out.push(shortDate.format(new Date(now.getTime() - i * 3 * DAY)));
    } else {
      out.push(shortDate.format(new Date(now.getTime() - i * DAY)));
    }
  }
  return out;
}

/** Current listed-price stats for a product, optionally scoped to a set of seller ids. */
export function currentStats(product: Product, sellerIds?: string[]) {
  const carried = Object.entries(product.prices)
    .filter(([id, p]) => p != null && (!sellerIds || sellerIds.includes(id)))
    .map(([, p]) => p as number);
  const low = Math.min(...carried);
  const high = Math.max(...carried);
  const avg = carried.reduce((s, p) => s + p, 0) / Math.max(carried.length, 1);
  return { low, avg, high, stores: carried.length };
}

const cache = new Map<string, HistoryPoint[]>();

/**
 * Deterministic price history ending at the product's current listed stats
 * (scoped to the given sellers): a backwards random walk on the market
 * average, with the low/high band kept proportional to today's spread.
 */
export function priceHistory(product: Product, range: Range, sellerIds?: string[]): HistoryPoint[] {
  const key = `${product.id}:${range}:${sellerIds ? sellerIds.join('.') : 'all'}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const { points, jitter, drift } = RANGE_SPEC[range];
  const { low, avg, high } = currentStats(product, sellerIds);
  const rand = mulberry32(hash(`${product.id}:${range}`));
  const labels = labelsFor(range, points);

  const avgs = [avg];
  for (let i = 1; i < points; i++) {
    const prev = avgs[0];
    // Mild inflation bias: earlier points sit slightly lower, with occasional spikes.
    const step = 1 + (rand() - 0.5) * 2 * jitter + drift * (rand() > 0.62 ? 1 : -0.8);
    avgs.unshift(prev * step);
  }

  const series = avgs.map((a, i) => {
    const isNow = i === points - 1;
    const lowRatio = (low / avg) * (isNow ? 1 : 1 + (rand() - 0.5) * 0.02);
    const highRatio = (high / avg) * (isNow ? 1 : 1 + (rand() - 0.5) * 0.02);
    return {
      label: labels[i],
      low: Math.min(a * lowRatio, a),
      avg: a,
      high: Math.max(a * highRatio, a),
    };
  });

  cache.set(key, series);
  return series;
}

/** Sparkline of the product's market average over the year. */
export function avgTrend(product: Product, sellerIds?: string[]): number[] {
  return priceHistory(product, 'year', sellerIds).map((p) => p.avg);
}
