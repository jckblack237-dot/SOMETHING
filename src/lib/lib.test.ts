import { describe, expect, it } from 'vitest';
import { products, stores } from '../data/catalog';
import { mvr, num, pct, signedPct } from './format';
import { donutArc, niceTicks, roundedColumn, smoothPath } from './chart';
import { avgTrend, currentStats, priceHistory } from './history';
import {
  bestPriceWins,
  filterProducts,
  marketIndex,
  recentDrops,
  saving,
  savingsByCategory,
  savingsTrend,
  sellersFor,
  storeProfiles,
  storesCarrying,
} from './stats';

const byId = (id: string) => products.find((p) => p.id === id)!;

describe('format', () => {
  it('formats rufiyaa with thousands separators', () => {
    expect(mvr(1240)).toBe('MVR 1,240');
    expect(mvr(18450.4)).toBe('MVR 18,450');
  });
  it('compacts large amounts only in compact mode', () => {
    expect(mvr(12400, true)).toBe('MVR 12.4K');
    expect(mvr(4138, true)).toBe('MVR 4,138');
  });
  it('formats counts and percentages', () => {
    expect(num(1234.6)).toBe('1,235');
    expect(pct(12.34)).toBe('12.3%');
    expect(signedPct(-3.21)).toBe('−3.2%');
    expect(signedPct(3.21)).toBe('+3.2%');
  });
});

describe('chart geometry', () => {
  it('produces clean ticks that cover the domain', () => {
    const { ticks, lo, hi } = niceTicks(0, 10, 4);
    expect(ticks[0]).toBe(lo);
    expect(lo).toBeLessThanOrEqual(0);
    expect(hi).toBeGreaterThanOrEqual(10);
    expect(ticks.length).toBeGreaterThanOrEqual(4);
  });
  it('survives a flat domain', () => {
    const { lo, hi } = niceTicks(5, 5, 4);
    expect(lo).toBeLessThan(5);
    expect(hi).toBeGreaterThan(5);
  });
  it('emits valid svg path commands', () => {
    expect(smoothPath([[0, 0], [10, 10]])).toBe('M0,0 L10,10');
    expect(smoothPath([[0, 0], [5, 8], [10, 2]])).toMatch(/^M0,0 C/);
    expect(roundedColumn(0, 0, 20, 40)).toMatch(/^M.*Z$/);
    expect(donutArc(100, 100, 76, 0, Math.PI / 2)).toMatch(/^M.*A76,76/);
  });
});

describe('history', () => {
  it('emits the right number of points per range', () => {
    const p = byId('basmathi-5kg');
    expect(priceHistory(p, 'week')).toHaveLength(7);
    expect(priceHistory(p, 'month')).toHaveLength(10);
    expect(priceHistory(p, 'year')).toHaveLength(12);
  });
  it('is deterministic and ends at the current market stats', () => {
    const p = byId('anker-20k');
    const a = priceHistory(p, 'year');
    const b = priceHistory(p, 'year');
    expect(a).toEqual(b);
    const now = a[a.length - 1];
    const stats = currentStats(p);
    expect(now.low).toBeCloseTo(stats.low, 6);
    expect(now.avg).toBeCloseTo(stats.avg, 6);
    expect(now.high).toBeCloseTo(stats.high, 6);
  });
  it('keeps low ≤ avg ≤ high at every point', () => {
    for (const p of products) {
      for (const pt of priceHistory(p, 'year')) {
        expect(pt.low).toBeLessThanOrEqual(pt.avg);
        expect(pt.avg).toBeLessThanOrEqual(pt.high);
      }
    }
  });
  it('scopes stats to a seller subset', () => {
    const p = byId('basmathi-5kg');
    const s = currentStats(p, ['sto', 'agora']);
    expect(s.low).toBe(142);
    expect(s.high).toBe(155);
    expect(s.stores).toBe(2);
    expect(avgTrend(p, ['sto', 'agora'])).toHaveLength(12);
  });
});

describe('stats', () => {
  it('finds the best price and seller', () => {
    const s = saving(byId('galaxy-a55'));
    expect(s.best).toBe(6390);
    expect(s.worst).toBe(6790);
    expect(s.bestStore.id).toBe('gadgethub');
    expect(s.pct).toBeCloseTo(((6790 - 6390) / 6790) * 100, 5);
  });
  it('respects a seller scope when picking the winner', () => {
    const s = saving(byId('galaxy-a55'), ['redwave', 'damas']);
    expect(s.best).toBe(6499);
    expect(s.bestStore.id).toBe('damas');
  });
  it('filters by category, query and seller scope', () => {
    expect(filterProducts('electronics', '')).toHaveLength(8);
    expect(filterProducts('all', 'rice').map((p) => p.id).sort()).toEqual(['basmathi-5kg', 'rice-cooker']);
    expect(filterProducts('all', '', sellersFor('facebook'))).toHaveLength(22);
    expect(filterProducts('all', 'zzz')).toHaveLength(0);
  });
  it('maps source filters to seller ids', () => {
    expect(sellersFor('facebook')).toEqual(['gadgethub', 'islandhome']);
    expect(sellersFor('instagram')).toEqual(['islegadgets', 'casamaldives']);
    expect(sellersFor('online')).toEqual(['esto', 'moolee']);
    expect(sellersFor('all')).toHaveLength(stores.length);
  });
  it('scopes the catalog to instagram sellers', () => {
    expect(filterProducts('all', '', sellersFor('instagram'))).toHaveLength(14);
    expect(storeProfiles('instagram')).toHaveLength(2);
  });
  it('counts best-price wins including ties', () => {
    const wins = bestPriceWins(products);
    const total = wins.reduce((s, w) => s + w.wins, 0);
    // 24 products, one two-way tie (white sugar at STO and eSTO)
    expect(total).toBe(25);
    expect(wins.find((w) => w.store.id === 'gadgethub')!.wins).toBe(8);
  });
  it('aggregates saving headroom per category', () => {
    const slices = savingsByCategory();
    const total = slices.reduce((s, d) => s + d.total, 0);
    const manual = products.reduce((s, p) => s + saving(p).abs, 0);
    expect(total).toBeCloseTo(manual, 6);
    expect(slices).toHaveLength(3);
  });
  it('produces sane trend aggregates', () => {
    const s = savingsTrend(products);
    const m = marketIndex(products);
    expect(s).toHaveLength(12);
    expect(m).toHaveLength(12);
    expect(m[0]).toBeCloseTo(100, 6);
    for (const v of s) expect(v).toBeGreaterThanOrEqual(0);
    expect(savingsTrend([])).toHaveLength(0);
  });
  it('reports drops and coverage', () => {
    for (const d of recentDrops(products)) expect(d.changePct).toBeLessThan(0);
    expect(storesCarrying(products)).toBe(stores.length);
    expect(storesCarrying(products, ['gadgethub'])).toBe(1);
  });
  it('profiles sellers with a price index around market par', () => {
    const profiles = storeProfiles();
    expect(profiles).toHaveLength(stores.length);
    for (const p of profiles) {
      expect(p.carried).toBeGreaterThan(0);
      expect(p.index).toBeGreaterThan(80);
      expect(p.index).toBeLessThan(120);
      expect(p.wins).toBe(p.cheapestFor.length);
    }
    expect(storeProfiles('facebook')).toHaveLength(2);
  });
});
