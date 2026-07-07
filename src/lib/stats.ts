import { products, stores, CATEGORIES, type Category, type Product, type Store } from '../data/catalog';
import { currentStats, priceHistory } from './history';

export interface Saving {
  abs: number;
  pct: number;
  bestStore: Store;
  worst: number;
  best: number;
}

export function saving(product: Product): Saving {
  const { low, high } = currentStats(product);
  const bestId = Object.entries(product.prices).find(([, p]) => p === low)![0];
  return {
    abs: high - low,
    pct: ((high - low) / high) * 100,
    bestStore: stores.find((s) => s.id === bestId)!,
    worst: high,
    best: low,
  };
}

export function filterProducts(category: Category | 'all', query: string): Product[] {
  const q = query.trim().toLowerCase();
  return products.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (q === '' || `${p.brand} ${p.name}`.toLowerCase().includes(q)),
  );
}

/** Mean % saving across a product set, per year-history point (12 values). */
export function savingsTrend(set: Product[]): number[] {
  if (set.length === 0) return [];
  const per = set.map((p) => priceHistory(p, 'year').map((h) => ((h.high - h.low) / h.high) * 100));
  return per[0].map((_, i) => per.reduce((s, arr) => s + arr[i], 0) / per.length);
}

/** Market price index (first year-point = 100) across a product set. */
export function marketIndex(set: Product[]): number[] {
  if (set.length === 0) return [];
  const per = set.map((p) => {
    const h = priceHistory(p, 'year');
    return h.map((pt) => (pt.avg / h[0].avg) * 100);
  });
  return per[0].map((_, i) => per.reduce((s, arr) => s + arr[i], 0) / per.length);
}

export interface Drop {
  product: Product;
  changePct: number;
}

/** Products whose market average fell over the last month, steepest first. */
export function recentDrops(set: Product[]): Drop[] {
  return set
    .map((product) => {
      const h = priceHistory(product, 'month');
      return { product, changePct: ((h[h.length - 1].avg - h[0].avg) / h[0].avg) * 100 };
    })
    .filter((d) => d.changePct < 0)
    .sort((a, b) => a.changePct - b.changePct);
}

/** Per-point count of products cheaper than at the previous month point. */
export function dropsTrend(set: Product[]): number[] {
  const per = set.map((p) => priceHistory(p, 'month').map((h) => h.avg));
  if (per.length === 0) return [];
  return per[0].map((_, i) =>
    i === 0 ? 0 : per.reduce((s, arr) => s + (arr[i] < arr[i - 1] ? 1 : 0), 0),
  );
}

export function storesCarrying(set: Product[]): number {
  return stores.filter((s) => set.some((p) => p.prices[s.id] != null)).length;
}

export interface StoreWins {
  store: Store;
  wins: number;
}

export function bestPriceWins(set: Product[]): StoreWins[] {
  return stores.map((store) => ({
    store,
    wins: set.filter((p) => {
      const price = p.prices[store.id];
      return price != null && price === currentStats(p).low;
    }).length,
  }));
}

export interface CategorySlice {
  category: Category;
  label: string;
  total: number;
}

/** MVR of headroom (highest − lowest shelf price) available per category. */
export function savingsByCategory(): CategorySlice[] {
  return CATEGORIES.map(({ id, label }) => ({
    category: id,
    label,
    total: products
      .filter((p) => p.category === id)
      .reduce((s, p) => s + saving(p).abs, 0),
  }));
}

export interface StoreProfile {
  store: Store;
  carried: number;
  wins: number;
  /** Mean of (store price ÷ market average) × 100 across carried products. */
  index: number;
  cheapestFor: Product[];
}

export function storeProfiles(): StoreProfile[] {
  return stores.map((store) => {
    const carried = products.filter((p) => p.prices[store.id] != null);
    const ratios = carried.map((p) => (p.prices[store.id]! / currentStats(p).avg) * 100);
    const cheapestFor = carried.filter((p) => p.prices[store.id] === currentStats(p).low);
    return {
      store,
      carried: carried.length,
      wins: cheapestFor.length,
      index: ratios.reduce((s, r) => s + r, 0) / Math.max(ratios.length, 1),
      cheapestFor,
    };
  });
}
