'use client';

import { motion } from 'framer-motion';

export default function FloatingBadge({ label, className }: { label: string; className?: string }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
      className={`absolute rounded-full border border-white/10 bg-white/8 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text/90 backdrop-blur ${className ?? ''}`}
    >
      {label}
    </motion.div>
  );
}
