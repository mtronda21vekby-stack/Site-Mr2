'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

type BackgroundState = {
  desktopUrl: string
  mobileUrl: string
  opacity: number
  desktopPosition: string
  mobilePosition: string
}

type DecorImage = {
  id: string
  imageUrl: string
  alt: string
}

type GeneratedSlot = {
  left: string
  top: string
  width: string
  height: string
  rotate: string
  opacity: number
}

type MotionStyle = {
  transform: string
  opacity: number
  filter?: string
}

const defaultBackground: BackgroundState = {
  desktopUrl: '',
  mobileUrl: '',
  opacity: 0.08,
  desktopPosition: 'center center',
  mobilePosition: 'center center',
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function smoothstep(value: number) {
  const x = clamp(value, 0, 1)
  return x * x * (3 - 2 * x)
}

function normalizeOpacity(value: unknown) {
  const number = Number(value)
  if (!Number.isFinite(number)) return defaultBackground.opacity
  return Math.min(0.2, Math.max(0.02, number))
}

function uniqueDecorImages(images: DecorImage[]) {
  const seen = new Set<string>()
  return images.filter((image) => {
    if (!image.imageUrl || seen.has(image.imageUrl)) return false
    seen.add(image.imageUrl)
    return true
  })
}

function imageForSlot(images: DecorImage[], index: number) {
  if (!images.length) return null
  return images[index % images.length]
}

function buildSlots(count: number, isMobile: boolean): GeneratedSlot[] {
  const cols = isMobile ? [-16, 20, 58, 88] : [-8, 10, 29, 49, 69, 89]
  const rows = isMobile ? [3, 17, 32, 48, 64, 80] : [3, 17, 31, 45, 59, 73, 87]
  const rotations = [-10, 7, -5, 9, -8, 6, -7, 10]

  return Array.from({ length: count }, (_, index) => {
    const col = cols[index % cols.length]
    const row = rows[Math.floor(index / cols.length) % rows.length]
    const driftX = ((index * 7) % 11) - 5
    const driftY = ((index * 5) % 9) - 4
    const wide = index % 3 === 0
    const width = isMobile ? (wide ? 8.1 : 7.05) : (wide ? 12.7 : 10.8)
    const height = isMobile ? (wide ? 5.55 : 4.85) : (wide ? 8.1 : 7.0)
    const baseOpacity = isMobile ? 0.46 : 0.42
    const edgeBoost = col < 0 || col > 78 ? 0.12 : 0
    const depth = (index % 4) * 0.025

    return {
      left: `${col + driftX}%`,
      top: `${row + driftY}%`,
      width: `${width}rem`,
      height: `${height}rem`,
      rotate: `${rotations[index % rotations.length]}deg`,
      opacity: Math.min(0.68, baseOpacity + edgeBoost - depth),
    }
  })
}

function getRevealProgress(index: number, scrollY: number, viewportHeight: number, isMobile: boolean) {
  const cycle = Math.max(520, viewportHeight * (isMobile ? 0.92 : 0.84))
  const offset = index * (isMobile ? 91 : 128)
  const raw = ((scrollY + offset) % cycle) / cycle
  const enter = smoothstep(raw / 0.3)
  const exit = 1 - smoothstep((raw - 0.8) / 0.2)
  return clamp(Math.min(enter, exit), 0, 1)
}

function getMotionStyle(
  index: number,
  slot: GeneratedSlot,
  scrollY: number,
  viewportHeight: number,
  reduceMotion: boolean,
  isMobile: boolean
): MotionStyle {
  if (reduceMotion) {
    return {
      transform: `rotate(${slot.rotate})`,
      opacity: slot.opacity,
    }
  }

  const reveal = getRevealProgress(index, scrollY, viewportHeight, isMobile)
  const direction = index % 2 === 0 ? 1 : -1
  const speed = isMobile ? 0.015 + (index % 5) * 0.003 : 0.011 + (index % 6) * 0.003
  const phase = index * 0.71
  const floatX = Math.sin(scrollY / 170 + phase) * (isMobile ? 9 : 15)
  const floatY = Math.cos(scrollY / 210 + phase) * (isMobile ? 8 : 12)
  const parallaxY = scrollY * speed * direction
  const parallaxX = scrollY * speed * 0.28 * -direction
  const revealLift = (1 - reveal) * (isMobile ? 46 : 58)
  const scale = 0.86 + reveal * 0.14
  const rotateDrift = Math.sin(scrollY / 250 + phase) * (isMobile ? 1.5 : 2)
  const opacity = slot.opacity * (0.25 + reveal * 0.75)
  const blur = (1 - reveal) * 0.38

  return {
    opacity,
    filter: `blur(${blur}px)`,
    transform: `translate3d(${floatX + parallaxX}px, ${floatY + parallaxY + revealLift}px, 0) scale(${scale}) rotate(calc(${slot.rotate} + ${rotateDrift}deg))`,
  }
}

export default function CinematicBackground() {
  const supabase = useMemo(() => getSupabaseClient() as any, [])
  const [background, setBackground] = useState<BackgroundState>(defaultBackground)
  const [decorImages, setDecorImages] = useState<DecorImage[]>([])
  const [scrollY, setScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(820)
  const [reduceMotion, setReduceMotion] = useState(false)
  const desktopSlots = useMemo(() => buildSlots(26, false), [])
  const mobileSlots = useMemo(() => buildSlots(18, true), [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    let raf = 0
    const onScrollOrResize = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        setScrollY(window.scrollY || window.pageYOffset || 0)
        setViewportHeight(window.innerHeight || 820)
      })
    }

    onScrollOrResize()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function loadBackground() {
      try {
        const [settingsResult, imagesResult] = await Promise.all([
          (supabase.from('site_settings') as any)
            .select('background_image_url, background_mobile_image_url, background_opacity, background_position, background_mobile_position')
            .limit(1)
            .maybeSingle(),
          (supabase.from('site_images') as any)
            .select('id,image_url,alt,category,sort_order,created_at')
            .eq('is_published', true)
            .in('category', ['background-decor', 'background-desktop', 'background-mobile'])
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false })
            .limit(36),
        ])

        if (!mounted) return

        if (!settingsResult.error && settingsResult.data) {
          setBackground({
            desktopUrl: String(settingsResult.data.background_image_url || '').trim(),
            mobileUrl: String(settingsResult.data.background_mobile_image_url || '').trim(),
            opacity: normalizeOpacity(settingsResult.data.background_opacity),
            desktopPosition: String(settingsResult.data.background_position || defaultBackground.desktopPosition).trim() || defaultBackground.desktopPosition,
            mobilePosition: String(settingsResult.data.background_mobile_position || defaultBackground.mobilePosition).trim() || defaultBackground.mobilePosition,
          })
        }

        if (!imagesResult.error && Array.isArray(imagesResult.data)) {
          setDecorImages(
            uniqueDecorImages(
              imagesResult.data.map((image: any) => ({
                id: String(image.id),
                imageUrl: String(image.image_url || '').trim(),
                alt: String(image.alt || 'Planetlocksmiths background photo'),
              })),
            ),
          )
        }
      } catch {
        // Keep safe generated background fallback.
      }
    }

    loadBackground()

    return () => {
      mounted = false
    }
  }, [supabase])

  const hasLargeBackground = Boolean(background.desktopUrl || background.mobileUrl)
  const mobileUrl = background.mobileUrl || background.desktopUrl

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(11,31,77,0.038),transparent_30rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.028),transparent_26rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />

      {hasLargeBackground ? (
        <>
          {background.desktopUrl ? (
            <div
              className="absolute inset-0 hidden bg-cover bg-fixed bg-no-repeat md:block"
              style={{
                backgroundImage: `url(${background.desktopUrl})`,
                backgroundPosition: background.desktopPosition,
                opacity: Math.min(0.024, background.opacity),
                transform: reduceMotion ? undefined : `translate3d(0, ${scrollY * -0.012}px, 0)`,
              }}
            />
          ) : null}

          {mobileUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-scroll bg-no-repeat md:hidden"
              style={{
                backgroundImage: `url(${mobileUrl})`,
                backgroundPosition: background.mobilePosition,
                opacity: Math.min(0.018, background.opacity),
                transform: reduceMotion ? undefined : `translate3d(0, ${scrollY * -0.008}px, 0)`,
              }}
            />
          ) : null}
        </>
      ) : null}

      {decorImages.length ? (
        <div className="absolute inset-0 hidden md:block">
          {desktopSlots.map((slot, index) => {
            const image = imageForSlot(decorImages, index)
            if (!image) return null
            const motion = getMotionStyle(index, slot, scrollY, viewportHeight, reduceMotion, false)

            return (
              <div
                key={`desktop-bg-${index}-${image.id}`}
                className="absolute overflow-hidden rounded-[1.05rem] border border-white/80 bg-white/48 p-1 shadow-[0_18px_42px_rgba(11,31,77,0.16)] backdrop-blur-[0.3px] transition-[transform,opacity,filter] duration-500 ease-out"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  opacity: motion.opacity,
                  filter: motion.filter,
                  transform: motion.transform,
                  willChange: reduceMotion ? undefined : 'transform, opacity, filter',
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.78rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
              </div>
            )
          })}
        </div>
      ) : null}

      {decorImages.length ? (
        <div className="absolute inset-0 md:hidden">
          {mobileSlots.map((slot, index) => {
            const image = imageForSlot(decorImages, index)
            if (!image) return null
            const motion = getMotionStyle(index, slot, scrollY, viewportHeight, reduceMotion, true)

            return (
              <div
                key={`mobile-bg-${index}-${image.id}`}
                className="absolute overflow-hidden rounded-[0.95rem] border border-white/80 bg-white/48 p-0.5 shadow-[0_14px_34px_rgba(11,31,77,0.16)] backdrop-blur-[0.3px] transition-[transform,opacity,filter] duration-500 ease-out"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  opacity: motion.opacity,
                  filter: motion.filter,
                  transform: motion.transform,
                  willChange: reduceMotion ? undefined : 'transform, opacity, filter',
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.7rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.052)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.04)_1px,transparent_1px)] bg-[size:96px_96px] opacity-16 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_74%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/46 via-white/18 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[12rem] bg-gradient-to-t from-white/50 via-white/16 to-transparent" />
    </div>
  )
}
