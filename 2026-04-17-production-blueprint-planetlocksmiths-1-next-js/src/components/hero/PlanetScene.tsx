"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { FloatingBadge } from "./FloatingBadge";
import { OrbitRing } from "./OrbitRing";

type PlanetSceneProps = {
  words: string[];
  badges: string[];
};

export function PlanetScene({ words, badges }: PlanetSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const mouseX = useSpring(pointerX, { stiffness: 120, damping: 24, mass: 0.5 });
  const mouseY = useSpring(pointerY, { stiffness: 120, damping: 24, mass: 0.5 });
  const planetX = useTransform(mouseX, [-1, 1], [-8, 8]);
  const planetY = useTransform(mouseY, [-1, 1], [-6, 6]);
  const glowX = useTransform(mouseX, [-1, 1], ["40%", "62%"]);
  const glowY = useTransform(mouseY, [-1, 1], ["36%", "58%"]);
  const sceneGlow = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(45,226,230,0.22), transparent 34%), radial-gradient(circle at 68% 42%, rgba(214,168,95,0.12), transparent 26%)`;

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = sceneRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    pointerX.set((x - 0.5) * 2);
    pointerY.set((y - 0.5) * 2);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      ref={sceneRef}
      className="relative min-h-[440px] overflow-hidden rounded-none md:min-h-[560px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPointer}
    >
      <motion.div
        className="absolute inset-0 opacity-80"
        style={{ background: sceneGlow }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12)_1px,transparent_1px),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:72px_72px,96px_96px] opacity-30" />

      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          className="relative h-[260px] w-[260px] rounded-full sm:h-[360px] sm:w-[360px]"
          style={{ x: planetX, y: planetY }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.95),rgba(77,162,255,0.42)_15%,rgba(17,25,46,0.92)_44%,rgba(5,7,11,1)_80%)] shadow-[inset_-34px_-24px_90px_rgba(0,0,0,0.64),0_0_72px_rgba(77,162,255,0.26)]" />
          <motion.div
            className="absolute inset-6 rounded-full opacity-45 mix-blend-screen"
            animate={{ rotate: 360 }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "linear-gradient(130deg, transparent 5%, rgba(45,226,230,0.28) 12%, transparent 22%, rgba(214,168,95,0.16) 36%, transparent 46%, rgba(77,162,255,0.24) 58%, transparent 72%)"
            }}
          />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_66%_68%,rgba(45,226,230,0.16),transparent_24%)]" />
        </motion.div>
      </div>

      <OrbitRing words={words} radius={196} tilt={64} duration={22} mouseX={mouseX} mouseY={mouseY} />
      <OrbitRing
        words={[...words].reverse()}
        radius={150}
        tilt={72}
        duration={34}
        reverse
        mouseX={mouseX}
        mouseY={mouseY}
        className="opacity-70"
      />

      {badges[0] && <FloatingBadge className="absolute left-5 top-10">{badges[0]}</FloatingBadge>}
      {badges[1] && <FloatingBadge className="absolute bottom-16 right-4">{badges[1]}</FloatingBadge>}
    </div>
  );
}
