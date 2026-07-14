import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { products, type Category, type SourceType } from './data/catalog';
import type { Range } from './lib/history';
import { filterProducts, sellersFor } from './lib/stats';
import Preloader from './components/Preloader';
import Header, { type View } from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Shop from './views/Shop';
import ProductDetail from './views/ProductDetail';
import Overview from './views/Overview';
import StoresView from './views/StoresView';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('home');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [source, setSource] = useState<SourceType | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>('philips-led4');
  const [range, setRange] = useState<Range>('month');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const sellerIds = useMemo(() => sellersFor(source), [source]);
  const filtered = filterProducts(category, query, sellerIds);
  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? null;
  const pdp = products.find((p) => p.id === selectedId) ?? null;

  const navigate = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };
  const openProduct = (id: string) => {
    setSelectedId(id);
    navigate('product');
  };
  const openShop = (c: Category | 'all') => {
    setCategory(c);
    navigate('shop');
  };
  const onQuery = (q: string) => {
    setQuery(q);
    if (q.trim() !== '' && view !== 'shop' && view !== 'insights') setView('shop');
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>

      <Header view={view} onNavigate={navigate} query={query} onQuery={onQuery} />

      <motion.main
        key={view === 'product' ? `product-${selectedId}` : view}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-[70vh]"
      >
        {view === 'home' && <Home onShop={openShop} onOpenProduct={openProduct} />}
        {view === 'shop' && (
          <Shop
            products={filtered}
            sellerIds={sellerIds}
            category={category}
            onCategory={setCategory}
            source={source}
            onSource={setSource}
            onOpenProduct={openProduct}
          />
        )}
        {view === 'product' && pdp && (
          <ProductDetail
            product={pdp}
            range={range}
            onRange={setRange}
            onHome={() => navigate('home')}
            onShop={() => navigate('shop')}
            onOpenProduct={openProduct}
          />
        )}
        {view === 'sellers' && (
          <div className="mx-auto max-w-6xl px-5 py-10">
            <StoresView source={source} />
          </div>
        )}
        {view === 'insights' && (
          <div className="mx-auto max-w-6xl px-5 py-10">
            <Overview
              products={filtered}
              sellerIds={sellerIds}
              selected={selected}
              onSelect={setSelectedId}
              range={range}
              onRange={setRange}
              category={category}
              onCategory={setCategory}
              source={source}
              onSource={setSource}
            />
          </div>
        )}
      </motion.main>

      <Footer onNavigate={navigate} onCategory={setCategory} />
    </MotionConfig>
  );
}
