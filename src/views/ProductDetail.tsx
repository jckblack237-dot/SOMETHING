import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { CATEGORY_LABEL, products, type Product } from '../data/catalog';
import type { Range } from '../lib/history';
import { mvr, pct } from '../lib/format';
import { saving } from '../lib/stats';
import CompareBars from '../components/CompareBars';
import PriceTrendCard from '../components/PriceTrendCard';
import ProductCard from '../components/ProductCard';
import ProductTile from '../components/ProductTile';

export default function ProductDetail({
  product,
  sellerIds,
  range,
  onRange,
  onHome,
  onShop,
  onOpenProduct,
}: {
  product: Product;
  /** Omitted on purpose in the app: a product page always compares every seller. */
  sellerIds?: string[];
  range: Range;
  onRange: (r: Range) => void;
  onHome: () => void;
  onShop: () => void;
  onOpenProduct: (id: string) => void;
}) {
  const s = saving(product, sellerIds);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => saving(b).pct - saving(a).pct)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-ink-3">
        <button onClick={onHome} className="transition-colors hover:text-ink">Home</button>
        <ChevronRight size={12} />
        <button onClick={onShop} className="transition-colors hover:text-ink">Shop</button>
        <ChevronRight size={12} />
        <span className="text-ink-2">{product.brand} {product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductTile
            product={product}
            iconSize={96}
            badge={s.pct >= 1 ? `−${Math.round(s.pct)}%` : undefined}
            className="aspect-square w-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-3">
            {CATEGORY_LABEL[product.category]} · {product.unit}
          </p>
          <h1 className="font-display mt-2 text-3xl font-light tracking-tight text-ink sm:text-4xl">
            {product.brand} {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-ink">{mvr(s.best)}</span>
            {s.worst > s.best && (
              <>
                <span className="text-lg text-ink-3 line-through">{mvr(s.worst)}</span>
                <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-page">
                  save {pct(s.pct)}
                </span>
              </>
            )}
          </div>
          <p className="mt-1.5 text-sm text-ink-3">
            best price at <span className="font-medium text-ink-2">{s.bestStore.name}</span>
          </p>

          <div className="mt-8 rounded-xl border border-edge bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold text-ink">Compare sellers</h2>
            <CompareBars product={product} sellerIds={sellerIds} />
          </div>
        </motion.div>
      </div>

      <div className="mt-8">
        <PriceTrendCard product={product} range={range} onRangeChange={onRange} sellerIds={sellerIds} />
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display mb-6 text-2xl font-light tracking-tight text-ink">
            More in {CATEGORY_LABEL[product.category]}
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} sellerIds={sellerIds} onOpen={onOpenProduct} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
