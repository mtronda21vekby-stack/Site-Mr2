'use client'

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function UnlockCityCoreScene() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 72, damping: 24, mass: 0.32 })
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const pointerSpringX = useSpring(pointerX, { stiffness: 60, damping: 22, mass: 0.32 })
  const pointerSpringY = useSpring(pointerY, { stiffness: 60, damping: 22, mass: 0.32 })

  useEffect(() => {
    if (reduceMotion) return
    function handlePointerMove(event: PointerEvent) {
      const x = event.clientX / window.innerWidth - 0.5
      const y = event.clientY / window.innerHeight - 0.5
      pointerX.set(x)
      pointerY.set(y)
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [pointerX, pointerY, reduceMotion])

  const sceneRotateY = useTransform(pointerSpringX, [-0.5, 0.5], [-8, 8])
  const sceneRotateX = useTransform(pointerSpringY, [-0.5, 0.5], [7, -7])
  const lightX = useTransform(pointerSpringX, [-0.5, 0.5], ['34%', '70%'])
  const lightY = useTransform(pointerSpringY, [-0.5, 0.5], ['22%', '52%'])
  const gridX = useTransform(pointerSpringX, [-0.5, 0.5], [-18, 18])
  const gridY = useTransform(pointerSpringY, [-0.5, 0.5], [-10, 10])
  const keyY = useTransform(smooth, [0, 0.16, 0.36, 0.56], [-180, -124, -34, 0])
  const keyRotate = useTransform(smooth, [0, 0.26, 0.56], [-10, -2, 0])
  const keyScale = useTransform(smooth, [0, 0.56, 0.9], [1, 0.94, 0.88])
  const coreRotate = useTransform(smooth, [0.28, 0.62, 1], [0, 16, 28])
  const coreDepth = useTransform(smooth, [0, 0.7, 1], [0, 18, 30])
  const ringOpen = useTransform(smooth, [0.42, 0.7, 1], [1, 1.08, 1.16])
  const ringOpacity = useTransform(smooth, [0.18, 0.52, 1], [0.34, 0.78, 0.48])
  const pulseScale = useTransform(smooth, [0.38, 0.62, 0.86], [0.72, 1.35, 2.0])
  const pulseOpacity = useTransform(smooth, [0.34, 0.5, 0.78], [0, 0.72, 0])
  const cityOpacity = useTransform(smooth, [0.48, 0.72, 1], [0.18, 0.86, 1])
  const cityY = useTransform(smooth, [0.48, 1], [28, -12])
  const seamGap = useTransform(smooth, [0.48, 0.78, 1], [0, 20, 38])
  const seamGapNegative = useTransform(seamGap, (v) => -v)

  return (
    <motion.div className="absolute left-1/2 top-[-7rem] h-[44rem] w-[44rem] -translate-x-1/2 opacity-90 sm:top-[-9rem] md:left-[67%] md:top-[-8rem] md:h-[58rem] md:w-[58rem] md:opacity-100" style={{ perspective: 1400, rotateX: reduceMotion ? 0 : sceneRotateX, rotateY: reduceMotion ? 0 : sceneRotateY, transformStyle: 'preserve-3d' }}>
      <motion.div className="absolute inset-[-10%] rounded-full blur-3xl" style={{ background: reduceMotion ? 'radial-gradient(circle at 58% 34%, rgba(77,162,255,0.14), transparent 38%)' : useTransform([lightX, lightY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(77,162,255,0.22), transparent 36%)`) }} />

      <motion.div className="absolute inset-[10%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_42%_34%,rgba(255,255,255,0.12),transparent_17%),radial-gradient(circle_at_57%_52%,#1A263E_0%,#07101E_45%,#02040A_74%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-64px_130px_rgba(0,0,0,0.80),0_0_160px_rgba(77,162,255,0.18)]" style={{ rotateZ: reduceMotion ? 0 : coreRotate, z: reduceMotion ? 0 : coreDepth, transformStyle: 'preserve-3d' }} />

      <motion.div className="absolute inset-[5%] rounded-full border border-accent-blue/22 shadow-[0_0_90px_rgba(77,162,255,0.12)]" style={{ scale: reduceMotion ? 1 : ringOpen, opacity: reduceMotion ? 0.46 : ringOpacity, z: 46 }} />
      <motion.div className="absolute inset-[12%] rounded-full border border-accent-gold/22 shadow-[0_0_80px_rgba(214,168,95,0.09)]" style={{ scale: reduceMotion ? 1 : ringOpen, rotateZ: reduceMotion ? 0 : coreRotate, z: 72 }} />
      <motion.div className="absolute inset-[20%] rounded-full border border-white/12" style={{ scale: reduceMotion ? 1 : ringOpen, z: 96 }} />
      <motion.div className="absolute inset-[28%] rounded-full border border-accent-blue/12 shadow-[inset_0_0_38px_rgba(77,162,255,0.10)]" style={{ scale: reduceMotion ? 1 : ringOpen, z: 120 }} />

      <motion.div className="absolute left-1/2 top-1/2 h-[62%] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-accent-blue/26 to-transparent" style={{ x: reduceMotion ? 0 : seamGap, z: 142 }} />
      <motion.div className="absolute left-1/2 top-1/2 h-[62%] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-accent-gold/22 to-transparent" style={{ x: reduceMotion ? 0 : seamGapNegative, z: 142 }} />

      <motion.div className="absolute left-1/2 top-1/2 h-32 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[2.1rem] border border-white/16 bg-black/34 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_60px_rgba(77,162,255,0.24)] backdrop-blur-xl" style={{ z: 170 }}>
        <div className="absolute left-1/2 top-5 h-14 w-8 -translate-x-1/2 rounded-full border border-accent-blue/42 bg-accent-blue/10 shadow-[0_0_30px_rgba(77,162,255,0.36)]" />
        <div className="absolute left-1/2 top-16 h-16 w-3 -translate-x-1/2 rounded-full bg-accent-gold/78 shadow-[0_0_24px_rgba(214,168,95,0.36)]" />
      </motion.div>

      <motion.div className="absolute left-1/2 top-[3rem] h-48 w-20 -translate-x-1/2 rounded-full will-change-transform" style={{ y: reduceMotion ? 0 : keyY, rotateZ: reduceMotion ? 0 : keyRotate, scale: reduceMotion ? 0.94 : keyScale, z: 240 }}>
        <div className="absolute left-1/2 top-0 h-14 w-14 -translate-x-1/2 rounded-full border-[5px] border-accent-gold/85 bg-black/18 shadow-[0_0_38px_rgba(214,168,95,0.30)]" />
        <div className="absolute left-1/2 top-12 h-32 w-3 -translate-x-1/2 rounded-full bg-gradient-to-b from-accent-gold via-[#B87333] to-accent-gold shadow-[0_0_38px_rgba(214,168,95,0.28)]" />
        <div className="absolute left-[calc(50%+0.35rem)] top-[7.2rem] h-3 w-10 rounded-r-sm bg-accent-gold/88" />
        <div className="absolute left-[calc(50%+0.35rem)] top-[8.8rem] h-3 w-7 rounded-r-sm bg-[#B87333]/92" />
        <div className="absolute left-1/2 top-[-1rem] h-24 w-24 -translate-x-1/2 rounded-full bg-accent-gold/12 blur-2xl" />
      </motion.div>

      <motion.div className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-blue/45 shadow-[0_0_100px_rgba(77,162,255,0.26)]" style={{ scale: reduceMotion ? 1.2 : pulseScale, opacity: reduceMotion ? 0.22 : pulseOpacity, z: 210 }} />

      <motion.div className="absolute left-[12%] top-[56%] h-[15rem] w-[38rem] rotate-[-10deg] [background-image:linear-gradient(rgba(45,226,230,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(45,226,230,0.17)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:linear-gradient(90deg,transparent_0%,black_16%,black_82%,transparent_100%)]" style={{ opacity: reduceMotion ? 0.74 : cityOpacity, y: reduceMotion ? 0 : cityY, x: reduceMotion ? 0 : gridX, z: 80 }} />
      <motion.div className="absolute left-[29%] top-[66%] h-2.5 w-2.5 rounded-full bg-accent-blue shadow-[0_0_24px_rgba(77,162,255,0.88)]" style={{ opacity: reduceMotion ? 1 : cityOpacity, x: reduceMotion ? 0 : gridX, y: reduceMotion ? 0 : gridY, z: 116 }} />
      <motion.div className="absolute left-[44%] top-[59%] h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_24px_rgba(45,226,230,0.88)]" style={{ opacity: reduceMotion ? 1 : cityOpacity, x: reduceMotion ? 0 : gridX, y: reduceMotion ? 0 : gridY, z: 116 }} />
      <motion.div className="absolute left-[59%] top-[70%] h-2.5 w-2.5 rounded-full bg-accent-gold shadow-[0_0_24px_rgba(214,168,95,0.80)]" style={{ opacity: reduceMotion ? 1 : cityOpacity, x: reduceMotion ? 0 : gridX, y: reduceMotion ? 0 : gridY, z: 116 }} />
    </motion.div>
  )
}
