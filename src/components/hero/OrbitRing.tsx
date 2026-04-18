"use client";
import { motion } from 'framer-motion';

interface OrbitRingProps {
  radius: string;
  text: string;
  speed?: number;
}

export default function OrbitRing({
  radius,
  text,
  speed = 30,
}: OrbitRingProps) {
  const animationDuration = Math.abs(speed);
  const animationDirection = speed < 0 ? 'reverse' : 'normal';

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 flex items-center justify-center"
      style={{
        width: radius,
        height: radius,
        marginLeft: `calc(${radius} / -2)`,
        marginTop: `calc(${radius} / -2)`,
        animation: `spin ${animationDuration}s linear infinite`,
        animationDirection,
      }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <p className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[0.625rem] font-medium uppercase tracking-wide text-muted">
          {Array.from({ length: 6 })
            .fill(text)
            .join('')}
        </p>
      </div>
    </motion.div>
  );
}
