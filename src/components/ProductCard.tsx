import { motion } from 'framer-motion';
import { CATEGORY_LABEL, type Product } from '../data/catalog';
import { mvr } from '../lib/format';
import { saving } from '../lib/stats';
import ProductTile from './ProductTile';

/** Shop-style product card: image tile, name, best price with the highest struck through. */
export default function ProductCard({
  product,
  sellerIds,
  onOpen,
  index = 0,
}: {
  product: Product;
  sellerIds?: string[];
  onOpen: (id: string) => void;
  index?: number;
}) {
  const s = saving(product, sellerIds);
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(product.id)}
      className="card group flex flex-col p-3 text-left"
    >
      <ProductTile
        product={product}
        badge={s.pct >= 1 ? `−${Math.round(s.pct)}%` : undefined}
        className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
        <p className="text-[10px] uppercase tracking-[0.15em] text-ink-3">{CATEGORY_LABEL[product.category]}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-ink">
          {product.brand} {product.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-ink-3">{product.unit}</p>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-ink">{mvr(s.best)}</span>
          {s.worst > s.best && <span className="text-xs text-ink-3 line-through">{mvr(s.worst)}</span>}
        </div>
        <p className="mt-0.5 text-[11px] text-ink-3">
          best at <span className="font-medium text-ink-2">{s.bestStore.short}</span>
        </p>
      </div>
    </motion.button>
  );
}
