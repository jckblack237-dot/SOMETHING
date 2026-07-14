import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { products, type Category, type SourceType } from './data/catalog';
import type { Range } from './lib/history';
import { filterProducts, sellersFor } from './lib/stats';
import Preloader from './components/Preloader';
import Header, { type View } from './components/Header';
import Footer from './components/Footer';
import Basket from './views/Basket';
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
  const [basket, setBasket] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('agu-basket') ?? '[]');
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    localStorage.setItem('agu-basket', JSON.stringify(basket));
  }, [basket]);

  const notify = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  const toggleBasket = (id: string) => {
    setBasket((b) => {
      const had = b.includes(id);
      notify(had ? 'Removed from basket' : 'Added to basket ✓');
      return had ? b.filter((x) => x !== id) : [...b, id];
    });
  };

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

      <Header view={view} onNavigate={navigate} query={query} onQuery={onQuery} basketCount={basket.length} />

      <motion.main
        key={view === 'product' ? `product-${selectedId}` : view}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-[70vh]"
      >
        {view === 'home' && <Home onShop={openShop} onOpenProduct={openProduct} onBasket={toggleBasket} basketIds={basket} />}
        {view === 'shop' && (
          <Shop
            products={filtered}
            sellerIds={sellerIds}
            category={category}
            onCategory={setCategory}
            source={source}
            onSource={setSource}
            onOpenProduct={openProduct}
            onBasket={toggleBasket}
            basketIds={basket}
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
            onBasket={toggleBasket}
            basketIds={basket}
          />
        )}
        {view === 'basket' && (
          <Basket basket={basket} onRemove={toggleBasket} onOpenProduct={openProduct} onShop={() => navigate('shop')} />
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

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="status"
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-page shadow-xl shadow-black/25"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
