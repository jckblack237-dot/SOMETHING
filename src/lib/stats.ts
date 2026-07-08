import { products, stores, CATEGORIES, type Category, type Product, type SourceType, type Store } from '../data/catalog';
import { currentStats, priceHistory } from './history';

/** Seller ids matching a source filter ('all' = every seller). */
export function sellersFor(source: SourceType | 'all'): string[] {
  return stores.filter((s) => source === 'all' || s.source === source).map((s) => s.id);
}

export function sellerCount(product: Product, sellerIds: string[]): number {
  return sellerIds.filter((id) => product.prices[id] != null).length;
}

export interface Saving {
  abs: number;
  pct: number;
  bestStore: Store;
  worst: number;
  best: number;
}

export function saving(product: Product, sellerIds?: string[]): Saving {
  const ids = sellerIds ?? stores.map((s) => s.id);
  const { low, high } = currentStats(product, ids);
  const bestId = ids.find((id) => product.prices[id] === low)!;
  return {
    abs: high - low,
    pct: high > 0 ? ((high - low) / high) * 100 : 0,
    bestStore: stores.find((s) => s.id === bestId)!,
    worst: high,
    best: low,
  };
}

export function filterProducts(category: Category | 'all', query: string, sellerIds?: string[]): Product[] {
  const q = query.trim().toLowerCase();
  return products.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (q === '' || `${p.brand} ${p.name}`.toLowerCase().includes(q)) &&
      (!sellerIds || sellerCount(p, sellerIds) > 0),
  );
}

/** Mean % saving across a product set, per year-history point (12 values). */
export function savingsTrend(set: Product[], sellerIds?: string[]): number[] {
  if (set.length === 0) return [];
  const per = set.map((p) =>
    priceHistory(p, 'year', sellerIds).map((h) => (h.high > 0 ? ((h.high - h.low) / h.high) * 100 : 0)),
  );
  return per[0].map((_, i) => per.reduce((s, arr) => s + arr[i], 0) / per.length);
}

/** Market price index (first year-point = 100) across a product set. */
export function marketIndex(set: Product[], sellerIds?: string[]): number[] {
  if (set.length === 0) return [];
  const per = set.map((p) => {
    const h = priceHistory(p, 'year', sellerIds);
    return h.map((pt) => (pt.avg / h[0].avg) * 100);
  });
  return per[0].map((_, i) => per.reduce((s, arr) => s + arr[i], 0) / per.length);
}

export interface Drop {
  product: Product;
  changePct: number;
}

/** Products whose market average fell over the last month, steepest first. */
export function recentDrops(set: Product[], sellerIds?: string[]): Drop[] {
  return set
    .map((product) => {
      const h = priceHistory(product, 'month', sellerIds);
      return { product, changePct: ((h[h.length - 1].avg - h[0].avg) / h[0].avg) * 100 };
    })
    .filter((d) => d.changePct < 0)
    .sort((a, b) => a.changePct - b.changePct);
}

/** Per-point count of products cheaper than at the previous month point. */
export function dropsTrend(set: Product[], sellerIds?: string[]): number[] {
  const per = set.map((p) => priceHistory(p, 'month', sellerIds).map((h) => h.avg));
  if (per.length === 0) return [];
  return per[0].map((_, i) =>
    i === 0 ? 0 : per.reduce((s, arr) => s + (arr[i] < arr[i - 1] ? 1 : 0), 0),
  );
}

export function storesCarrying(set: Product[], sellerIds?: string[]): number {
  const ids = sellerIds ?? stores.map((s) => s.id);
  return ids.filter((id) => set.some((p) => p.prices[id] != null)).length;
}

export interface StoreWins {
  store: Store;
  wins: number;
}

export function bestPriceWins(set: Product[], sellerIds?: string[]): StoreWins[] {
  const ids = sellerIds ?? stores.map((s) => s.id);
  return stores
    .filter((s) => ids.includes(s.id))
    .map((store) => ({
      store,
      wins: set.filter((p) => {
        const price = p.prices[store.id];
        return price != null && price === currentStats(p, ids).low;
      }).length,
    }));
}

export interface CategorySlice {
  category: Category;
  label: string;
  total: number;
}

/** MVR of headroom (highest − lowest listed price) available per category. */
export function savingsByCategory(sellerIds?: string[]): CategorySlice[] {
  return CATEGORIES.map(({ id, label }) => ({
    category: id,
    label,
    total: products
      .filter((p) => p.category === id && (!sellerIds || sellerCount(p, sellerIds) > 0))
      .reduce((s, p) => s + saving(p, sellerIds).abs, 0),
  }));
}

export interface StoreProfile {
  store: Store;
  carried: number;
  wins: number;
  /** Mean of (seller price ÷ market average) × 100 across carried products. */
  index: number;
  cheapestFor: Product[];
}

export function storeProfiles(source: SourceType | 'all' = 'all'): StoreProfile[] {
  return stores
    .filter((s) => source === 'all' || s.source === source)
    .map((store) => {
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
