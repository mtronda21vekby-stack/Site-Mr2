'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function UnlockCityCoreScene() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 72, damping: 24, mass: 0.32 })

  const keyY = useTransform(smooth, [0, 0.16, 0.36, 0.56], [-170, -118, -34, 0])
  const keyRotate = useTransform(smooth, [0, 0.26, 0.56], [-8, -2, 0])
  const keyScale = useTransform(smooth, [0, 0.56, 0.9], [1, 0.94, 0.88])
  const coreRotate = useTransform(smooth, [0.28, 0.62, 1], [0, 16, 26])
  const ringOpen = useTransform(smooth, [0.42, 0.7, 1], [1, 1.075, 1.14])
  const ringOpacity = useTransform(smooth, [0.18, 0.52, 1], [0.34, 0.72, 0.44])
  const pulseScale = useTransform(smooth, [0.38, 0.62, 0.86], [0.72, 1.28, 1.88])
  const pulseOpacity = useTransform(smooth, [0.34, 0.5, 0.78], [0, 0.68, 0])
  const cityOpacity = useTransform(smooth, [0.48, 0.72, 1], [0.18, 0.82, 0.98])
  const cityY = useTransform(smooth, [0.48, 1], [24, -10])
  const seamGap = useTransform(smooth, [0.48, 0.78, 1], [0, 18, 34])

  const staticStyle = reduceMotion ? { transform: 'none' } : undefined

  return (
    <div className="absolute left-1/2 top-[-7rem] h-[44rem] w-[44rem] -translate-x-1/2 opacity-90 sm:top-[-9rem] md:left-[67%] md:top-[-8rem] md:h-[56rem] md:w-[56rem] md:opacity-100" style={{ perspective: 1200 }}>
      <motion.div className="absolute inset-[10%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_42%_34%,rgba(255,255,255,0.10),transparent_17%),radial-gradient(circle_at_57%_52%,#172135_0%,#07101E_45%,#02040A_74%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.20),inset_0_-58px_120px_rgba(0,0,0,0.78),0_0_140px_rgba(77,162,255,0.16)]" style={reduceMotion ? staticStyle : { rotateZ: coreRotate }} />

      <motion.div className="absolute inset-[5%] rounded-full border border-accent-blue/20 shadow-[0_0_80px_rgba(77,162,255,0.10)]" style={reduceMotion ? staticStyle : { scale: ringOpen, opacity: ringOpacity }} />
      <motion.div className="absolute inset-[12%] rounded-full border border-accent-gold/20 shadow-[0_0_70px_rgba(214,168,95,0.08)]" style={reduceMotion ? staticStyle : { scale: ringOpen, rotateZ: coreRotate }} />
      <motion.div className="absolute inset-[20%] rounded-full border border-white/10" style={reduceMotion ? staticStyle : { scale: ringOpen }} />

      <motion.div className="absolute left-1/2 top-1/2 h-[62%] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-accent-blue/24 to-transparent" style={reduceMotion ? undefined : { x: seamGap }} />
      <motion.div className="absolute left-1/2 top-1/2 h-[62%] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-accent-gold/20 to-transparent" style={reduceMotion ? undefined : { x: useTransform(seamGap, (v) => -v) }} />

      <div className="absolute left-1/2 top-1/2 h-32 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[2.1rem] border border-white/16 bg-black/32 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_52px_rgba(77,162,255,0.22)] backdrop-blur-xl">
        <div className="absolute left-1/2 top-5 h-14 w-8 -translate-x-1/2 rounded-full border border-accent-blue/40 bg-accent-blue/10 shadow-[0_0_28px_rgba(77,162,255,0.34)]" />
        <div className="absolute left-1/2 top-16 h-16 w-3 -translate-x-1/2 rounded-full bg-accent-gold/75 shadow-[0_0_22px_rgba(214,168,95,0.34)]" />
      </div>

      <motion.div className="absolute left-1/2 top-[3rem] h-48 w-20 -translate-x-1/2 rounded-full will-change-transform" style={reduceMotion ? undefined : { y: keyY, rotateZ: keyRotate, scale: keyScale }}>
        <div className="absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2 rounded-full border-[5px] border-accent-gold/80 bg-black/18 shadow-[0_0_34px_rgba(214,168,95,0.28)]" />
        <div className="absolute left-1/2 top-12 h-32 w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent-gold via-[#B87333] to-accent-gold shadow-[0_0_34px_rgba(214,168,95,0.26)]" />
        <div className="absolute left-[calc(50%+0.35rem)] top-[7.2rem] h-3 w-10 rounded-r-sm bg-accent-gold/85" />
        <div className="absolute left-[calc(50%+0.35rem)] top-[8.8rem] h-3 w-7 rounded-r-sm bg-[#B87333]/90" />
        <div className="absolute left-1/2 top-[-1rem] h-20 w-20 -translate-x-1/2 rounded-full bg-accent-gold/10 blur-2xl" />
      </motion.div>

      <motion.div className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-blue/45 shadow-[0_0_90px_rgba(77,162,255,0.24)]" style={reduceMotion ? { opacity: 0.25 } : { scale: pulseScale, opacity: pulseOpacity }} />

      <motion.div className="absolute left-[12%] top-[56%] h-[15rem] w-[36rem] rotate-[-10deg] [background-image:linear-gradient(rgba(45,226,230,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(45,226,230,0.16)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(90deg,transparent_0%,black_16%,black_82%,transparent_100%)]" style={reduceMotion ? { opacity: 0.72 } : { opacity: cityOpacity, y: cityY }} />
      <motion.div className="absolute left-[29%] top-[66%] h-2.5 w-2.5 rounded-full bg-accent-blue shadow-[0_0_22px_rgba(77,162,255,0.86)]" style={reduceMotion ? undefined : { opacity: cityOpacity }} />
      <motion.div className="absolute left-[44%] top-[59%] h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_22px_rgba(45,226,230,0.86)]" style={reduceMotion ? undefined : { opacity: cityOpacity }} />
      <motion.div className="absolute left-[59%] top-[70%] h-2.5 w-2.5 rounded-full bg-accent-gold shadow-[0_0_22px_rgba(214,168,95,0.78)]" style={reduceMotion ? undefined : { opacity: cityOpacity }} />
    </div>
  )
}
