'use client';

import { motion } from 'framer-motion';

export type OrbitRingProps = {
  words: string[];
  radius: number;
  tilt: number;
  duration: number;
  reverse?: boolean;
  mouseX: number;
  mouseY: number;
};

export default function OrbitRing({ words, radius, tilt, duration, reverse = false, mouseX, mouseY }: OrbitRingProps) {
  return (
    <motion.div
      animate={{ rotate: reverse ? -360 : 360, x: mouseX, y: mouseY }}
      transition={{ rotate: { repeat: Infinity, duration, ease: 'linear' }, x: { type: 'spring', stiffness: 40, damping: 18 }, y: { type: 'spring', stiffness: 40, damping: 18 } }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform: `rotateX(${tilt}deg)` }}
    >
      <div className="relative rounded-full border border-white/10" style={{ width: radius, height: radius }}>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-muted">
          {words.join(' • ')}
        </div>
      </div>
    </motion.div>
  );
}
