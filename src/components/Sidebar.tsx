import { motion } from 'framer-motion';
import { LayoutGrid, PackageSearch, Store, Tag } from 'lucide-react';

export type View = 'overview' | 'products' | 'stores';

const NAV: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'products', label: 'Products', icon: PackageSearch },
  { id: 'stores', label: 'Sellers', icon: Store },
];

export default function Sidebar({ view, onNavigate }: { view: View; onNavigate: (v: View) => void }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col items-center border-r border-edge bg-page py-5">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('overview');
        }}
        aria-label="Agu home"
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: 'linear-gradient(135deg, var(--color-s1), var(--color-glow))' }}
      >
        <Tag size={18} className="text-page" strokeWidth={2.4} />
      </a>

      <nav aria-label="Main" className="flex flex-col gap-2">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              title={label}
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                active ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-raised ring-1 ring-edge"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <Icon size={19} className="relative z-10" />
            </button>
          );
        })}
      </nav>

      <div className="mt-auto text-[10px] font-semibold tracking-widest text-ink-3 [writing-mode:vertical-rl]">
        AGU · MV
      </div>
    </aside>
  );
}
