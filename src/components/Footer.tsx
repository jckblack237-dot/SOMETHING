import { Tag } from 'lucide-react';
import { CATEGORIES, type Category } from '../data/catalog';
import type { View } from './Header';

export default function Footer({
  onNavigate,
  onCategory,
}: {
  onNavigate: (v: View) => void;
  onCategory: (c: Category | 'all') => void;
}) {
  const go = (v: View, c?: Category | 'all') => {
    if (c) onCategory(c);
    onNavigate(v);
    window.scrollTo({ top: 0 });
  };
  return (
    <footer className="border-t border-edge bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg, var(--color-s1), var(--color-glow))' }}
            >
              <Tag size={15} className="text-page" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold tracking-[0.2em] text-ink">AGU</span>
          </span>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-ink-3">
            The Maldives price watch — comparing shops, shopping websites, Facebook and Instagram pages so you always
            pay the fair price.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">Shop</p>
          <ul className="space-y-2 text-sm text-ink-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button onClick={() => go('shop', c.id)} className="transition-colors hover:text-ink">
                  {c.label}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => go('shop', 'all')} className="transition-colors hover:text-ink">
                All products
              </button>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">Explore</p>
          <ul className="space-y-2 text-sm text-ink-2">
            <li><button onClick={() => go('sellers')} className="transition-colors hover:text-ink">Sellers</button></li>
            <li><button onClick={() => go('insights')} className="transition-colors hover:text-ink">Market insights</button></li>
            <li><button onClick={() => go('home')} className="transition-colors hover:text-ink">How it works</button></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">Good to know</p>
          <p className="text-xs leading-relaxed text-ink-3">
            Prices are indicative demo data in MVR. Social listings show when they were last cross-checked. Agu links
            you to the seller — we never sell anything ourselves.
          </p>
        </div>
      </div>
      <div className="border-t border-edge">
        <p className="mx-auto max-w-6xl px-5 py-5 text-center text-[11px] text-ink-3">
          Agu · Maldives price watch — demo data, prices indicative in MVR
        </p>
      </div>
    </footer>
  );
}
