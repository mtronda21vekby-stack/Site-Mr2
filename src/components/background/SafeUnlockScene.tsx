'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function SafeUnlockScene() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.35 })

  const keyY = useTransform(smooth, [0, 0.18, 0.48], [-96, -42, 44])
  const keyRotate = useTransform(smooth, [0, 0.48], [-10, 0])
  const coreRotate = useTransform(smooth, [0.28, 0.7], [0, 18])
  const leftPanelX = useTransform(smooth, [0.5, 0.82], [0, -34])
  const rightPanelX = useTransform(smooth, [0.5, 0.82], [0, 34])
  const pulseScale = useTransform(smooth, [0.42, 0.68, 0.9], [0.72, 1.35, 1.9])
  const pulseOpacity = useTransform(smooth, [0.42, 0.55, 0.85], [0, 0.45, 0])
  const gridOpacity = useTransform(smooth, [0.52, 0.82], [0.22, 0.88])
  const gridY = useTransform(smooth, [0.52, 0.9], [18, -8])

  if (reduceMotion) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute left-1/2 top-[-7rem] h-[44rem] w-[44rem] -translate-x-1/2 opacity-90 md:left-[67%] md:top-[-8rem] md:h-[54rem] md:w-[54rem]" style={{ rotate: coreRotate }}>
        <motion.div className="absolute inset-[10%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_42%_34%,rgba(255,255,255,0.10),transparent_18%),radial-gradient(circle_at_52%_52%,#101827_0%,#060B13_48%,#02040A_72%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-50px_100px_rgba(0,0,0,0.74),0_0_130px_rgba(77,162,255,0.16)]" />
        <motion.div className="absolute inset-[10%] rounded-l-full border-y border-l border-accent-blue/16 bg-black/10" style={{ x: leftPanelX }} />
        <motion.div className="absolute inset-[10%] rounded-r-full border-y border-r border-accent-gold/14 bg-black/10" style={{ x: rightPanelX }} />
        <div className="absolute inset-[7%] rounded-full border border-accent-blue/18" />
        <div className="absolute inset-[15%] rounded-full border border-accent-gold/18" />
        <div className="absolute inset-[23%] rounded-full border border-white/10" />

        <div className="absolute left-1/2 top-1/2 h-28 w-20 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/16 bg-black/32 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_50px_rgba(77,162,255,0.22)] backdrop-blur-xl">
          <div className="absolute left-1/2 top-5 h-12 w-7 -translate-x-1/2 rounded-full border border-accent-blue/35 bg-accent-blue/10 shadow-[0_0_24px_rgba(77,162,255,0.32)]" />
          <div className="absolute left-1/2 top-14 h-14 w-3 -translate-x-1/2 rounded-full bg-accent-gold/75 shadow-[0_0_20px_rgba(214,168,95,0.32)]" />
        </div>

        <motion.div className="absolute left-1/2 top-[2.5rem] h-44 w-16 -translate-x-1/2 rounded-full" style={{ y: keyY, rotate: keyRotate }}>
          <div className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full border-[5px] border-accent-gold/80 shadow-[0_0_28px_rgba(214,168,95,0.26)]" />
          <div className="absolute left-1/2 top-10 h-28 w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent-gold via-[#B87333] to-accent-gold shadow-[0_0_32px_rgba(214,168,95,0.26)]" />
          <div className="absolute left-[calc(50%+0.35rem)] top-[6.5rem] h-3 w-9 rounded-r-sm bg-accent-gold/85" />
          <div className="absolute left-[calc(50%+0.35rem)] top-[8rem] h-3 w-6 rounded-r-sm bg-[#B87333]/90" />
        </motion.div>

        <motion.div className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-blue/45 shadow-[0_0_100px_rgba(77,162,255,0.24)]" style={{ scale: pulseScale, opacity: pulseOpacity }} />

        <motion.div className="absolute left-[18%] top-[58%] h-[13rem] w-[32rem] rotate-[-10deg] [background-image:linear-gradient(rgba(45,226,230,0.20)_1px,transparent_1px),linear-gradient(90deg,rgba(45,226,230,0.15)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(90deg,transparent_0%,black_18%,black_78%,transparent_100%)]" style={{ opacity: gridOpacity, y: gridY }} />
      </motion.div>
    </div>
  )
}
