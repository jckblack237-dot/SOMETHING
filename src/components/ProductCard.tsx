import { motion } from 'framer-motion';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { CATEGORY_LABEL, type Product } from '../data/catalog';
import { mvr } from '../lib/format';
import { listingUrl, saving } from '../lib/stats';
import ProductTile from './ProductTile';

/**
 * Shop-style product card. The card body opens the product page; the action
 * row adds to the basket or jumps straight to the best seller's website.
 */
export default function ProductCard({
  product,
  sellerIds,
  onOpen,
  onBasket,
  basketed = false,
  index = 0,
}: {
  product: Product;
  sellerIds?: string[];
  onOpen: (id: string) => void;
  onBasket?: (id: string) => void;
  basketed?: boolean;
  index?: number;
}) {
  const s = saving(product, sellerIds);
  const buy = listingUrl(s.bestStore, product);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="card group flex flex-col p-3"
    >
      <button onClick={() => onOpen(product.id)} className="flex flex-1 flex-col text-left" aria-label={`${product.brand} ${product.name} — compare prices`}>
        <ProductTile
          product={product}
          badge={s.pct >= 1 ? `−${Math.round(s.pct)}%` : undefined}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <span className="block px-1.5 pt-3">
          <span className="block text-[10px] uppercase tracking-[0.15em] text-ink-3">{CATEGORY_LABEL[product.category]}</span>
          <span className="mt-1 line-clamp-2 block text-sm font-medium leading-snug text-ink">
            {product.brand} {product.name}
          </span>
          <span className="mt-0.5 block text-[11px] text-ink-3">{product.unit}</span>
          <span className="mt-2.5 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-ink">{mvr(s.best)}</span>
            {s.worst > s.best && <span className="text-xs text-ink-3 line-through">{mvr(s.worst)}</span>}
          </span>
          <span className="mt-0.5 block text-[11px] text-ink-3">
            best at <span className="font-medium text-ink-2">{s.bestStore.short}</span>
          </span>
        </span>
      </button>

      <div className="mt-3 flex items-center gap-2 px-1.5 pb-1">
        {onBasket && (
          <button
            onClick={() => onBasket(product.id)}
            aria-pressed={basketed}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold transition-colors ${
              basketed ? 'bg-ink text-page' : 'border border-edge text-ink-2 hover:border-ink/30 hover:text-ink'
            }`}
          >
            <ShoppingBag size={12} />
            {basketed ? 'In basket' : 'Add to basket'}
          </button>
        )}
        {buy && (
          <a
            href={buy}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Buy at ${s.bestStore.name}`}
            className="flex items-center justify-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[11px] font-semibold text-page transition-transform hover:scale-[1.04] active:scale-95"
          >
            Buy
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </motion.div>
  );
}
