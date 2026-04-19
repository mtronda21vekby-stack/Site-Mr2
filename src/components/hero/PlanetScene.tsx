'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMemo } from 'react';
import OrbitRing from './OrbitRing';
import FloatingBadge from './FloatingBadge';

export default function PlanetScene({ words }: { words: string[] }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const mouseX = useSpring(mx, { stiffness: 60, damping: 16 });
  const mouseY = useSpring(my, { stiffness: 60, damping: 16 });

  const orbitA = useMemo(() => words.slice(0, 3), [words]);
  const orbitB = useMemo(() => words.slice(2), [words]);

  return (
    <div
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
        mx.set(x);
        my.set(y);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative mx-auto aspect-square w-full max-w-[520px]"
    >
      <motion.div style={{ x: mouseX, y: mouseY }} className="absolute inset-16 rounded-full bg-accent-blue/20 blur-[120px]" />
      <motion.div style={{ x: mouseX, y: mouseY, rotate: 6 }} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-[18%] rounded-full bg-planet-core shadow-glow">
        <div className="absolute inset-[8%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),transparent_25%),radial-gradient(circle_at_75%_70%,rgba(214,168,95,0.15),transparent_20%)]" />
      </motion.div>
      <OrbitRing words={orbitA} radius={360} tilt={64} duration={22} mouseX={8} mouseY={-4} />
      <OrbitRing words={orbitB} radius={430} tilt={76} duration={28} reverse mouseX={4} mouseY={-2} />
      <FloatingBadge label="24/7" className="left-8 top-16" />
      <FloatingBadge label="mobile service" className="right-8 top-24" />
      <FloatingBadge label="philadelphia" className="bottom-16 left-12" />
    </div>
  );
}
