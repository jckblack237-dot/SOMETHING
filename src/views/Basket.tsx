import { motion } from 'framer-motion';
import { ExternalLink, ShoppingBag, Trash2 } from 'lucide-react';
import { products, stores, type Product } from '../data/catalog';
import { mvr } from '../lib/format';
import { saving } from '../lib/stats';
import { SourceBadge } from '../components/ui';
import ProductTile from '../components/ProductTile';

interface SellerTotal {
  store: (typeof stores)[number];
  covered: number;
  total: number;
}

export default function Basket({
  basket,
  onRemove,
  onOpenProduct,
  onShop,
}: {
  basket: string[];
  onRemove: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onShop: () => void;
}) {
  const items = basket
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const totals: SellerTotal[] = stores
    .map((store) => {
      const carried = items.filter((p) => p.prices[store.id] != null);
      return {
        store,
        covered: carried.length,
        total: carried.reduce((s, p) => s + (p.prices[store.id] ?? 0), 0),
      };
    })
    .filter((t) => t.covered > 0)
    .sort((a, b) => (b.covered - a.covered) || (a.total - b.total));

  const winner = totals[0];
  const bestSum = items.reduce((s, p) => s + saving(p).best, 0);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-3">Your shopping list</p>
          <h1 className="font-display text-3xl font-light tracking-tight text-ink">Basket</h1>
        </div>
        <p className="text-sm text-ink-3">
          {items.length} item{items.length === 1 ? '' : 's'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-raised">
            <ShoppingBag size={22} className="text-ink-3" />
          </span>
          <p className="text-sm text-ink-2">Your basket is empty.</p>
          <p className="max-w-sm text-xs text-ink-3">
            Add products and Agu will work out which seller is cheapest for your whole shopping list.
          </p>
          <button
            onClick={onShop}
            className="mt-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-page transition-transform hover:scale-[1.03] active:scale-95"
          >
            Shop the catalog
          </button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <ul className="divide-y divide-line rounded-xl border border-edge bg-surface">
              {items.map((p) => {
                const s = saving(p);
                return (
                  <li key={p.id} className="flex items-center gap-4 p-4">
                    <button onClick={() => onOpenProduct(p.id)} aria-label={`${p.brand} ${p.name}`}>
                      <ProductTile product={p} iconSize={22} className="h-16 w-16 shrink-0" />
                    </button>
                    <button onClick={() => onOpenProduct(p.id)} className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-medium text-ink">
                        {p.brand} {p.name}
                      </span>
                      <span className="block text-xs text-ink-3">{p.unit}</span>
                      <span className="mt-1 block text-xs text-ink-2">
                        best <span className="font-semibold text-ink">{mvr(s.best)}</span> at {s.bestStore.short}
                      </span>
                    </button>
                    <button
                      onClick={() => onRemove(p.id)}
                      aria-label={`Remove ${p.brand} ${p.name} from basket`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-edge text-ink-3 transition-colors hover:border-ink/30 hover:text-ink"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-ink-3">
              Cherry-picking the best seller per item would cost{' '}
              <span className="font-semibold text-ink">{mvr(bestSum)}</span> across{' '}
              {new Set(items.map((p) => saving(p).bestStore.id)).size} sellers.
            </p>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card p-5"
            >
              <h2 className="text-sm font-semibold text-ink">One-stop basket</h2>
              <p className="mt-1 text-xs text-ink-3">
                The cheapest single seller for as much of your list as possible.
              </p>

              {winner && (
                <div className="mt-4 rounded-xl bg-raised p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{winner.store.name}</p>
                      <p className="text-xs text-ink-3">
                        {winner.covered} of {items.length} item{items.length === 1 ? '' : 's'} ·{' '}
                        <span className="font-semibold text-ink">{mvr(winner.total)}</span>
                      </p>
                    </div>
                    {winner.store.url && (
                      <a
                        href={winner.store.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[11px] font-semibold text-page transition-transform hover:scale-[1.04] active:scale-95"
                      >
                        Shop here
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-ink-3">
                    <th className="py-2 font-medium">Seller</th>
                    <th className="py-2 text-right font-medium">Items</th>
                    <th className="py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {totals.map((t) => (
                    <tr key={t.store.id} className="border-t border-line">
                      <td className="flex items-center gap-1.5 py-2 text-ink-2">
                        <SourceBadge source={t.store.source} iconOnly />
                        <span className={t.store.id === winner?.store.id ? 'font-semibold text-ink' : ''}>
                          {t.store.short}
                        </span>
                      </td>
                      <td className="py-2 text-right text-ink-3">
                        {t.covered}/{items.length}
                      </td>
                      <td className="py-2 text-right text-ink">{mvr(t.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-3">
                Totals only count the items each seller lists — a lower total with fewer items may mean a second stop.
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
