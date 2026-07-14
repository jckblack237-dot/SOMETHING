import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useSpring } from 'framer-motion';
import { Check, ChevronDown, Facebook, Globe, Instagram, Store as StoreIcon } from 'lucide-react';
import type { Category, SourceType } from '../data/catalog';
import { SOURCE_LABEL } from '../data/catalog';

export const CATEGORY_COLOR: Record<Category, string> = {
  electronics: 'var(--color-s1)',
  groceries: 'var(--color-s2)',
  household: 'var(--color-s3)',
};

export const CATEGORY_OPTIONS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'household', label: 'Household' },
];

export const SOURCE_OPTIONS: { value: SourceType | 'all'; label: string }[] = [
  { value: 'all', label: 'All sellers' },
  { value: 'store', label: 'In-store' },
  { value: 'online', label: 'Online shops' },
  { value: 'facebook', label: 'Facebook pages' },
  { value: 'instagram', label: 'Instagram pages' },
];

const SOURCE_ICON: Record<SourceType, typeof Globe> = {
  store: StoreIcon,
  online: Globe,
  facebook: Facebook,
  instagram: Instagram,
};

/** Small chip identifying where a seller lists prices: shop, website or Facebook page. */
export function SourceBadge({ source, iconOnly = false }: { source: SourceType; iconOnly?: boolean }) {
  const Icon = SOURCE_ICON[source];
  if (iconOnly) {
    return <Icon size={12} className="shrink-0 text-ink-3" aria-label={SOURCE_LABEL[source]} />;
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-edge px-2 py-1 text-[11px] text-ink-2">
      <Icon size={11} className="text-ink-3" />
      {SOURCE_LABEL[source]}
    </span>
  );
}

export function CategoryDot({ category, size = 8 }: { category: Category; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: CATEGORY_COLOR[category] }}
    />
  );
}

/** Signed change chip: triangle + value; colored by direction × whether up is good. */
export function Delta({
  value,
  format = (v: number) => `${Math.abs(v).toFixed(1)}%`,
  goodWhenUp = true,
  label,
}: {
  value: number;
  format?: (v: number) => string;
  goodWhenUp?: boolean;
  label?: string;
}) {
  const up = value >= 0;
  const good = up === goodWhenUp;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: good ? 'var(--color-good)' : 'var(--color-bad)' }}>
      <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden className={up ? '' : 'rotate-180'}>
        <path d="M4 1 7.5 7h-7Z" fill="currentColor" />
      </svg>
      <span className="sr-only">{up ? 'up' : 'down'} </span>
      {format(value)}
      {label && <span className="font-normal text-ink-3"> {label}</span>}
    </span>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  id,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  id: string;
}) {
  return (
    <div role="tablist" aria-label={id} className="flex items-center gap-1 rounded-full bg-inset p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`relative rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${active ? 'text-page' : 'text-ink-2 hover:text-ink'}`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-edge bg-surface px-3.5 py-2 text-sm text-ink-2 transition-colors hover:text-ink"
      >
        {current?.label}
        <ChevronDown size={14} className={`text-ink-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-30 mt-2 w-48 origin-top rounded-xl border border-edge bg-raised p-1.5 shadow-2xl shadow-black/15"
          >
            {options.map((o) => (
              <li key={o.value}>
                <button
                  role="option"
                  aria-selected={o.value === value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  {o.label}
                  {o.value === value && <Check size={16} strokeWidth={3} className="text-s1" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AnimatedNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const spring = useSpring(value, { stiffness: 110, damping: 24 });
  const [text, setText] = useState(() => format(value));
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  useMotionValueEvent(spring, 'change', (v) => setText(format(v)));
  return <span>{text}</span>;
}

/** 12-point sparkline: de-emphasis stroke, current period marked in the accent. */
export function Sparkline({
  data,
  width = 92,
  height = 34,
  accent = 'var(--color-s1)',
}: {
  data: number[];
  width?: number;
  height?: number;
  accent?: string;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = 5;
  const x = (i: number) => pad + (i / (data.length - 1)) * (width - pad * 2);
  const y = (v: number) =>
    max === min ? height / 2 : pad + (1 - (v - min) / (max - min)) * (height - pad * 2);
  const d = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = data.length - 1;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="shrink-0">
      <path d={d} fill="none" stroke="var(--color-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(last)} cy={y(data[last])} r="4" fill={accent} stroke="var(--color-surface)" strokeWidth="2" />
    </svg>
  );
}

export function CardHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-ink-3">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function TableToggle({ table, onToggle }: { table: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={table}
      aria-label={table ? 'Show chart view' : 'Show table view'}
      className="rounded-lg border border-edge px-2.5 py-1.5 text-xs font-medium text-ink-3 transition-colors hover:bg-ink/5 hover:text-ink"
    >
      {table ? 'Chart' : 'Table'}
    </button>
  );
}
