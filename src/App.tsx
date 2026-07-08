import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import type { Category, SourceType } from './data/catalog';
import type { Range } from './lib/history';
import { filterProducts, sellersFor } from './lib/stats';
import Preloader from './components/Preloader';
import Sidebar, { type View } from './components/Sidebar';
import TopBar from './components/TopBar';
import Landing from './views/Landing';
import Overview from './views/Overview';
import ProductsView from './views/ProductsView';
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

  const viewTrend = (id: string) => {
    setSelectedId(id);
    setView('overview');
    window.scrollTo({ top: 0 });
  };

  if (view === 'home') {
    return (
      <MotionConfig reducedMotion="user">
        <AnimatePresence>{loading && <Preloader />}</AnimatePresence>
        <Landing onOpen={() => setView('overview')} />
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>

      <Sidebar view={view} onNavigate={setView} />

      <main className="ml-16 min-h-screen">
        <div className="mx-auto max-w-[1320px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <TopBar
            query={query}
            onQuery={setQuery}
            category={category}
            onCategory={setCategory}
            source={source}
            onSource={setSource}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === 'overview' && (
                <Overview
                  products={filtered}
                  sellerIds={sellerIds}
                  selected={selected}
                  onSelect={setSelectedId}
                  range={range}
                  onRange={setRange}
                  category={category}
                  onCategory={setCategory}
                />
              )}
              {view === 'products' && (
                <ProductsView
                  products={filtered}
                  sellerIds={sellerIds}
                  category={category}
                  onCategory={setCategory}
                  onViewTrend={viewTrend}
                />
              )}
              {view === 'stores' && <StoresView source={source} />}
            </motion.div>
          </AnimatePresence>

          <footer className="pb-4 pt-6 text-center text-xs text-ink-3">
            Agu · Maldives price watch — comparing shops, shopping websites & Facebook pages · demo data, prices indicative in MVR
          </footer>
        </div>
      </main>
    </MotionConfig>
  );
}
