'use client'

import { useScroll, useSpring } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

const DESKTOP_VIDEO_SRC = '/media/Premium_Automotive_Locksmith_Website_Background.mp4'
const MOBILE_VIDEO_SRC = '/media/clideo_editor_de7f5321887f4e22af79a787f031062c.mp4'
const SNAP_POINTS = [0, 0.28, 0.52, 0.74, 1]

const SCENE_STATES = [
  { threshold: 0, label: 'System locked', detail: 'City core standing by' },
  { threshold: 0.26, label: 'Key aligned', detail: 'Vehicle access request detected' },
  { threshold: 0.5, label: 'Unlock sequence', detail: 'Emergency dispatch opening' },
  { threshold: 0.72, label: 'Network online', detail: 'Mobile locksmith route active' },
]

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function snapProgress(value: number) {
  let snapped = value
  for (const point of SNAP_POINTS) {
    if (Math.abs(value - point) < 0.035) {
      snapped = point
      break
    }
  }
  return snapped
}

function getSceneState(progress: number) {
  return SCENE_STATES.reduce((active, item) => (progress >= item.threshold ? item : active), SCENE_STATES[0])
}

export default function CinematicVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const lastUpdateRef = useRef(0)
  const latestProgressRef = useRef(0)
  const [canScrub, setCanScrub] = useState(false)
  const [duration, setDuration] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [sceneState, setSceneState] = useState(SCENE_STATES[0])
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 72, damping: 24, mass: 0.36 })
  const activeVideoSrc = useMemo(() => (isMobile ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC), [isMobile])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setCanScrub(false)
    setDuration(0)
    lastUpdateRef.current = 0
    latestProgressRef.current = 0

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.controls = false
    video.disablePictureInPicture = true
    video.loop = false
    video.autoplay = false
    video.pause()

    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0)
      setCanScrub(true)
      video.pause()
      video.currentTime = 0.001
    }

    const onError = () => {
      setCanScrub(false)
      setDuration(0)
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('error', onError)
    video.load()
    if (video.readyState >= 1) onLoadedMetadata()

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('error', onError)
    }
  }, [activeVideoSrc, isMobile])

  useEffect(() => {
    if (!canScrub || !duration) return

    const applyFrame = (timestamp: number) => {
      frameRef.current = null
      const video = videoRef.current
      if (!video) return

      const minFrameGap = isMobile ? 58 : 32
      if (timestamp - lastUpdateRef.current < minFrameGap) return
      lastUpdateRef.current = timestamp

      const safeDuration = Math.max(0.1, duration - 0.08)
      const rawProgress = clamp01(latestProgressRef.current)
      const desktopProgress = snapProgress(rawProgress)
      const mappedProgress = isMobile ? rawProgress : desktopProgress
      const nextTime = Math.min(safeDuration, Math.max(0.001, mappedProgress * safeDuration))
      const threshold = isMobile ? 0.095 : 0.035

      setSceneState(getSceneState(isMobile ? rawProgress : desktopProgress))

      if (Math.abs(video.currentTime - nextTime) > threshold) {
        video.currentTime = nextTime
      }
    }

    return smoothProgress.on('change', (value) => {
      latestProgressRef.current = value
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(applyFrame)
      }
    })
  }, [canScrub, duration, isMobile, smoothProgress])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#02040A]">
      <video
        ref={videoRef}
        className="absolute left-1/2 top-1/2 h-full w-full min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-78 saturate-[1.12] contrast-[1.12] brightness-[0.70] object-center scale-[1.06] md:scale-[1.06] max-md:object-[60%_50%] max-md:scale-100 max-md:opacity-96 max-md:saturate-[1.12] max-md:contrast-[1.08] max-md:brightness-[0.9]"
        muted
        playsInline
        preload="metadata"
        src={activeVideoSrc}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_32%,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.30)_42%,rgba(0,0,0,0.90)_100%)] max-md:bg-[radial-gradient(circle_at_60%_28%,rgba(0,0,0,0.00)_0%,rgba(0,0,0,0.08)_48%,rgba(0,0,0,0.66)_100%)]" />
      <div className="absolute inset-y-0 left-0 w-[68%] bg-gradient-to-r from-[#02040A] via-[#02040A]/86 to-transparent max-md:w-full max-md:bg-gradient-to-b max-md:from-[#02040A]/16 max-md:via-[#02040A]/6 max-md:to-[#02040A]/58" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#02040A]/82 via-[#02040A]/28 to-transparent max-md:h-52 max-md:from-[#02040A]/34" />
      <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-[#02040A] via-[#02040A]/76 to-transparent max-md:h-[28rem] max-md:via-[#02040A]/46" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,10,0.72)_0%,rgba(2,4,10,0.45)_34%,rgba(2,4,10,0.16)_62%,rgba(2,4,10,0.54)_100%)] max-md:bg-[linear-gradient(180deg,rgba(2,4,10,0.14)_0%,rgba(2,4,10,0.04)_42%,rgba(2,4,10,0.50)_100%)]" />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-screen [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0.55px,transparent_0.9px)] [background-size:4px_4px] max-md:hidden" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:radial-gradient(circle_at_65%_34%,black_0%,transparent_62%)] max-md:hidden" />

      <div className="absolute bottom-[18%] right-[12%] hidden rounded-full border border-accent-blue/24 bg-accent-blue/10 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] text-accent-cyan shadow-[0_0_40px_rgba(77,162,255,0.18)] backdrop-blur-xl md:block">
        <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_14px_rgba(45,226,230,0.95)]" />
        {sceneState.label}
        <span className="ml-3 text-white/45">{sceneState.detail}</span>
      </div>
    </div>
  )
}
