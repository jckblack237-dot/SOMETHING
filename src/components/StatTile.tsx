import { motion } from 'framer-motion';
import { AnimatedNumber, Delta, Sparkline } from './ui';

export interface StatTileProps {
  label: string;
  value: number;
  format: (v: number) => string;
  delta?: number;
  deltaFormat?: (v: number) => string;
  deltaLabel?: string;
  goodWhenUp?: boolean;
  spark: number[];
  index?: number;
}

export default function StatTile({
  label,
  value,
  format,
  delta,
  deltaFormat,
  deltaLabel,
  goodWhenUp = true,
  spark,
  index = 0,
}: StatTileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="card p-4"
    >
      <p className="text-xs font-medium text-ink-3">{label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <p className="text-[26px] font-semibold leading-none tracking-tight text-ink">
          <AnimatedNumber value={value} format={format} />
        </p>
        <div className="flex flex-col items-end gap-0.5">
          {delta !== undefined && (
            <Delta value={delta} format={deltaFormat} goodWhenUp={goodWhenUp} />
          )}
          <Sparkline data={spark} />
        </div>
      </div>
      {deltaLabel && <p className="mt-1 text-[11px] text-ink-3">{deltaLabel}</p>}
    </motion.div>
  );
}
