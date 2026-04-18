"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type OrbitRingProps = {
  words: string[];
  radius: number;
  tilt: number;
  duration: number;
  reverse?: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  className?: string;
};

export function OrbitRing({
  words,
  radius,
  tilt,
  duration,
  reverse,
  mouseX,
  mouseY,
  className
}: OrbitRingProps) {
  const rotateX = useTransform(mouseY, [-1, 1], [tilt + 4, tilt - 4]);
  const rotateY = useTransform(mouseX, [-1, 1], [-3, 3]);

  return (
    <motion.div
      className={cn("absolute left-1/2 top-1/2 preserve-3d", className)}
      style={{
        width: radius * 2,
        height: radius * 1.02,
        marginLeft: -radius,
        marginTop: -(radius * 0.51),
        rotateX,
        rotateY
      }}
      animate={{ rotateZ: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 rounded-[50%] border border-accent-cyan/28 shadow-[0_0_28px_rgba(45,226,230,0.14)]" />
      {words.map((word, index) => {
        const angle = (360 / words.length) * index;

        return (
          <span
            key={`${word}-${index}`}
            className="absolute left-1/2 top-1/2 rounded-md border border-line bg-bg/72 px-2 py-1 text-[10px] font-black text-accent-gold backdrop-blur"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px) rotate(${-angle}deg)`
            }}
          >
            {word}
          </span>
        );
      })}
    </motion.div>
  );
}
