import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { CATEGORIES, type Category, type Product, type SourceType } from '../data/catalog';
import { saving } from '../lib/stats';
import { Dropdown, SOURCE_OPTIONS } from '../components/ui';
import ProductCard from '../components/ProductCard';

type Sort = 'saving' | 'price' | 'name';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'saving', label: 'Biggest saving' },
  { value: 'price', label: 'Lowest price' },
  { value: 'name', label: 'Name A–Z' },
];

export default function Shop({
  products,
  sellerIds,
  category,
  onCategory,
  source,
  onSource,
  onOpenProduct,
  onBasket,
  basketIds,
}: {
  products: Product[];
  sellerIds: string[];
  category: Category | 'all';
  onCategory: (c: Category | 'all') => void;
  source: SourceType | 'all';
  onSource: (s: SourceType | 'all') => void;
  onOpenProduct: (id: string) => void;
  onBasket: (id: string) => void;
  basketIds: string[];
}) {
  const [sort, setSort] = useState<Sort>('saving');

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === 'saving') list.sort((a, b) => saving(b, sellerIds).pct - saving(a, sellerIds).pct);
    else if (sort === 'price') list.sort((a, b) => saving(a, sellerIds).best - saving(b, sellerIds).best);
    else list.sort((a, b) => `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`));
    return list;
  }, [products, sort, sellerIds]);

  const chips: { value: Category | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-3">Compare & save</p>
          <h1 className="font-display text-3xl font-light tracking-tight text-ink">Shop</h1>
        </div>
        <p className="text-sm text-ink-3">
          {sorted.length} item{sorted.length === 1 ? '' : 's'} · prices in MVR
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="slim-scroll flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-inset p-1">
          {chips.map((c) => {
            const active = c.value === category;
            return (
              <button
                key={c.value}
                onClick={() => onCategory(c.value)}
                aria-pressed={active}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'text-page' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{c.label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Dropdown value={source} options={SOURCE_OPTIONS} onChange={onSource} label="Filter by seller type" />
          <Dropdown value={sort} options={SORTS} onChange={setSort} label="Sort products" />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-ink-3">
          <SearchX size={28} />
          <p className="text-sm">No products match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {sorted.map((p, i) => (
            <ProductCard key={p.id} product={p} sellerIds={sellerIds} onOpen={onOpenProduct} onBasket={onBasket} basketed={basketIds.includes(p.id)} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
