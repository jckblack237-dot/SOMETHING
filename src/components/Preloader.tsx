import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

export default function Preloader() {
  return (
    <motion.div
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-page"
      aria-hidden
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: 'linear-gradient(135deg, var(--color-s1), var(--color-glow))' }}
      >
        <Tag size={26} className="text-page" strokeWidth={2.4} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-lg font-semibold tracking-tight text-ink"
      >
        Agu<span className="text-ink-3"> · Maldives price watch</span>
      </motion.p>
    </motion.div>
  );
}
