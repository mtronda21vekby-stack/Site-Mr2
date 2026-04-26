'use client'

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function SafeUnlockScene() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 62, damping: 22, mass: 0.42 })
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const px = useSpring(pointerX, { stiffness: 45, damping: 18, mass: 0.4 })
  const py = useSpring(pointerY, { stiffness: 45, damping: 18, mass: 0.4 })

  useEffect(() => {
    if (reduceMotion) return
    const onMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5)
      pointerY.set(event.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [pointerX, pointerY, reduceMotion])

  const parallaxX = useTransform(px, [-0.5, 0.5], [-30, 30])
  const parallaxY = useTransform(py, [-0.5, 0.5], [-18, 18])
  const foregroundX = useTransform(px, [-0.5, 0.5], [-70, 70])
  const foregroundY = useTransform(py, [-0.5, 0.5], [-34, 34])
  const lightX = useTransform(px, [-0.5, 0.5], ['38%', '74%'])
  const lightY = useTransform(py, [-0.5, 0.5], ['18%', '48%'])
  const sceneScale = useTransform(smooth, [0, 0.78], [1, 1.08])
  const sceneRotate = useTransform(smooth, [0.18, 0.88], [-3, 16])
  const sceneSkew = useTransform(px, [-0.5, 0.5], [-2, 2])
  const coreGlow = useTransform(smooth, [0.25, 0.62, 0.9], [0.16, 0.32, 0.22])
  const keyY = useTransform(smooth, [0, 0.18, 0.46, 0.66], [-155, -92, 18, 48])
  const keyX = useTransform(smooth, [0, 0.46], [-24, 0])
  const keyRotate = useTransform(smooth, [0, 0.46, 0.72], [-16, 0, 8])
  const keyScale = useTransform(smooth, [0, 0.46, 1], [1.12, 1, 0.92])
  const leftPanelX = useTransform(smooth, [0.5, 0.78, 1], [0, -70, -86])
  const rightPanelX = useTransform(smooth, [0.5, 0.78, 1], [0, 70, 86])
  const leftPanelRotate = useTransform(smooth, [0.5, 0.88], [0, -8])
  const rightPanelRotate = useTransform(smooth, [0.5, 0.88], [0, 8])
  const pulseScale = useTransform(smooth, [0.42, 0.62, 0.92], [0.54, 1.55, 2.6])
  const pulseOpacity = useTransform(smooth, [0.4, 0.54, 0.86], [0, 0.64, 0])
  const gridOpacity = useTransform(smooth, [0.52, 0.82], [0.08, 0.92])
  const gridY = useTransform(smooth, [0.52, 0.9], [34, -16])
  const routeOpacity = useTransform(smooth, [0.58, 0.92], [0, 1])
  const routeScale = useTransform(smooth, [0.58, 0.92], [0.82, 1.08])
  const afterGlowOpacity = useTransform(smooth, [0.54, 0.9], [0, 0.42])

  if (reduceMotion) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div className="absolute inset-0 opacity-80 blur-3xl" style={{ background: useTransform([lightX, lightY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(77,162,255,0.20), transparent 24rem), radial-gradient(circle at 74% 46%, rgba(214,168,95,0.13), transparent 22rem)`) }} />
      <motion.div className="absolute inset-[-6rem] opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.75)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px)] [background-size:120px_120px]" style={{ x: parallaxX, y: parallaxY }} />

      <motion.div className="absolute left-1/2 top-[-9rem] h-[52rem] w-[52rem] -translate-x-1/2 opacity-95 md:left-[67%] md:top-[-10rem] md:h-[66rem] md:w-[66rem]" style={{ scale: sceneScale, rotate: sceneRotate, skewX: sceneSkew, x: parallaxX, y: parallaxY }}>
        <motion.div className="absolute inset-[-2%] rounded-full bg-accent-blue/12 blur-3xl" style={{ opacity: afterGlowOpacity }} />
        <motion.div className="absolute inset-[2%] rounded-full border border-accent-blue/14 blur-[0.2px] shadow-[0_0_150px_rgba(77,162,255,0.15)]" />
        <div className="absolute inset-[8%] rounded-full border border-white/10 bg-[conic-gradient(from_220deg,rgba(77,162,255,0.14),rgba(255,255,255,0.04),rgba(214,168,95,0.12),rgba(77,162,255,0.08),rgba(255,255,255,0.03),rgba(77,162,255,0.14))] opacity-80" />
        <div className="absolute inset-[11%] rounded-full bg-[#02040A]" />

        <motion.div className="absolute inset-[14%] rounded-full border border-white/12 bg-[radial-gradient(circle_at_39%_30%,rgba(255,255,255,0.18),transparent_15%),radial-gradient(circle_at_50%_54%,#17243b_0%,#07101E_42%,#02040A_74%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.24),inset_0_-90px_150px_rgba(0,0,0,0.86),0_0_180px_rgba(77,162,255,0.20)]" style={{ opacity: useTransform(coreGlow, (v) => 0.86 + v) }} />
        <div className="absolute inset-[17%] rounded-full opacity-[0.28] mix-blend-screen [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0.5px,transparent_0.8px)] [background-size:5px_5px]" />

        <motion.div className="absolute inset-[14%] rounded-l-full border-y border-l border-accent-blue/24 bg-[linear-gradient(90deg,rgba(77,162,255,0.10),rgba(0,0,0,0.10))] shadow-[inset_20px_0_48px_rgba(77,162,255,0.10)]" style={{ x: leftPanelX, rotate: leftPanelRotate }} />
        <motion.div className="absolute inset-[14%] rounded-r-full border-y border-r border-accent-gold/22 bg-[linear-gradient(270deg,rgba(214,168,95,0.10),rgba(0,0,0,0.10))] shadow-[inset_-20px_0_48px_rgba(214,168,95,0.08)]" style={{ x: rightPanelX, rotate: rightPanelRotate }} />

        {[6, 12, 19, 27, 36].map((inset, index) => (
          <div key={inset} className={`absolute rounded-full border ${index % 2 ? 'border-accent-gold/18' : 'border-accent-blue/18'} ${index === 4 ? 'border-white/10' : ''}`} style={{ inset: `${inset}%` }} />
        ))}

        <div className="absolute left-1/2 top-1/2 h-36 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[2.25rem] border border-white/18 bg-black/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_76px_rgba(77,162,255,0.28)] backdrop-blur-xl">
          <div className="absolute left-1/2 top-6 h-14 w-8 -translate-x-1/2 rounded-full border border-accent-blue/45 bg-accent-blue/10 shadow-[0_0_38px_rgba(77,162,255,0.42)]" />
          <div className="absolute left-1/2 top-16 h-18 w-3 -translate-x-1/2 rounded-full bg-accent-gold/80 shadow-[0_0_30px_rgba(214,168,95,0.42)]" />
          <div className="absolute inset-x-4 bottom-4 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
        </div>

        <motion.div className="absolute left-1/2 top-[2.1rem] h-64 w-28 -translate-x-1/2 rounded-full drop-shadow-[0_34px_70px_rgba(0,0,0,0.62)]" style={{ y: keyY, x: keyX, rotate: keyRotate, scale: keyScale }}>
          <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rounded-full border-[7px] border-accent-gold/88 bg-black/18 shadow-[0_0_52px_rgba(214,168,95,0.38),inset_0_0_22px_rgba(255,255,255,0.14)]" />
          <div className="absolute left-1/2 top-[4.5rem] h-40 w-4 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#f2d49a] via-accent-gold to-[#a35f22] shadow-[0_0_44px_rgba(214,168,95,0.36)]" />
          <div className="absolute left-[calc(50%+0.45rem)] top-[10.2rem] h-4 w-14 rounded-r-sm bg-gradient-to-r from-accent-gold to-[#a35f22]" />
          <div className="absolute left-[calc(50%+0.45rem)] top-[12rem] h-4 w-10 rounded-r-sm bg-[#B87333]/95" />
          <div className="absolute left-[calc(50%-3.1rem)] top-[1rem] h-2 w-10 rotate-[-25deg] rounded-full bg-white/32 blur-[1px]" />
        </motion.div>

        <motion.div className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-blue/60 shadow-[0_0_140px_rgba(77,162,255,0.40)]" style={{ scale: pulseScale, opacity: pulseOpacity }} />
        <motion.div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue/22 blur-3xl" style={{ opacity: afterGlowOpacity }} />

        <motion.div className="absolute left-[12%] top-[58%] h-[16rem] w-[42rem] rotate-[-10deg] opacity-80 [background-image:linear-gradient(rgba(45,226,230,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(45,226,230,0.16)_1px,transparent_1px)] [background-size:30px_30px] [mask-image:linear-gradient(90deg,transparent_0%,black_16%,black_84%,transparent_100%)]" style={{ opacity: gridOpacity, y: gridY }} />

        <motion.svg className="absolute left-[17%] top-[59%] h-[15rem] w-[38rem] rotate-[-10deg] overflow-visible drop-shadow-[0_0_24px_rgba(77,162,255,0.35)]" viewBox="0 0 600 240" style={{ opacity: routeOpacity, scale: routeScale }}>
          <path d="M28 180 C120 90 210 210 310 92 S485 80 570 34" fill="none" stroke="rgba(77,162,255,0.82)" strokeWidth="2" strokeDasharray="10 12" />
          <path d="M74 52 C170 120 255 40 344 142 S505 178 560 112" fill="none" stroke="rgba(214,168,95,0.68)" strokeWidth="1.5" strokeDasharray="7 10" />
          {[28, 150, 310, 440, 570].map((x, index) => (
            <circle key={x} cx={x} cy={index % 2 ? 95 : 180 - index * 24} r="5" fill={index === 2 ? 'rgba(214,168,95,0.95)' : 'rgba(45,226,230,0.95)'} />
          ))}
        </motion.svg>

        <motion.div className="absolute left-[20%] top-[72%] rounded-full border border-accent-blue/24 bg-accent-blue/12 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-accent-cyan shadow-[0_0_40px_rgba(77,162,255,0.18)] backdrop-blur-xl" style={{ opacity: routeOpacity }}>Dispatch online</motion.div>
      </motion.div>

      <motion.div className="absolute left-[-5rem] top-[22%] h-[22rem] w-[22rem] rounded-full border border-accent-blue/10 opacity-40 blur-[0.2px]" style={{ x: foregroundX, y: foregroundY }} />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-screen [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0.55px,transparent_0.9px)] [background-size:4px_4px]" />
    </div>
  )
}
