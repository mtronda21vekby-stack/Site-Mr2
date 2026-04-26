'use client'

import { useScroll, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const VIDEO_SRC = '/media/Premium_Automotive_Locksmith_Website_Background.mp4'

export default function CinematicVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [canScrub, setCanScrub] = useState(false)
  const [duration, setDuration] = useState(0)
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.35 })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()
    video.currentTime = 0.001

    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0)
      setCanScrub(true)
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    if (video.readyState >= 1) onLoadedMetadata()

    return () => video.removeEventListener('loadedmetadata', onLoadedMetadata)
  }, [])

  useEffect(() => {
    if (!canScrub || !duration) return

    return smoothProgress.on('change', (value) => {
      const video = videoRef.current
      if (!video) return
      const safeDuration = Math.max(0.1, duration - 0.08)
      const nextTime = Math.min(safeDuration, Math.max(0.001, value * safeDuration))
      if (Math.abs(video.currentTime - nextTime) > 0.035) {
        video.currentTime = nextTime
      }
    })
  }, [canScrub, duration, smoothProgress])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#02040A]">
      <video
        ref={videoRef}
        className="absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.06] object-cover opacity-78 saturate-[1.12] contrast-[1.12] brightness-[0.70]"
        muted
        playsInline
        preload="auto"
        src={VIDEO_SRC}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_32%,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.30)_42%,rgba(0,0,0,0.90)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[68%] bg-gradient-to-r from-[#02040A] via-[#02040A]/86 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#02040A]/82 via-[#02040A]/28 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-[#02040A] via-[#02040A]/76 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,10,0.72)_0%,rgba(2,4,10,0.45)_34%,rgba(2,4,10,0.16)_62%,rgba(2,4,10,0.54)_100%)]" />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-screen [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0.55px,transparent_0.9px)] [background-size:4px_4px]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:radial-gradient(circle_at_65%_34%,black_0%,transparent_62%)]" />
    </div>
  )
}
