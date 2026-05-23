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
  return Math.min(0.18, Math.max(0.02, number))
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
  const cols = isMobile ? [-42, 3, 50, 88] : [-16, 8, 36, 64, 91]
  const rows = isMobile ? [4, 22, 40, 58, 76, 94] : [3, 20, 37, 54, 71, 88]
  const rotations = [-11, 7, -6, 10, -8, 6, -9, 8]

  return Array.from({ length: count }, (_, index) => {
    const col = cols[index % cols.length]
    const row = rows[Math.floor(index / cols.length) % rows.length]
    const driftX = ((index * 7) % 13) - 6
    const driftY = ((index * 5) % 11) - 5
    const hero = index % 4 === 0
    const width = isMobile ? (hero ? 14.4 : 11.6) : (hero ? 20.5 : 16.2)
    const height = isMobile ? (hero ? 9.8 : 7.9) : (hero ? 13.1 : 10.4)
    const baseOpacity = isMobile ? 0.58 : 0.52
    const edgeBoost = col < 0 || col > 78 ? 0.1 : 0
    const depth = (index % 4) * 0.026

    return {
      left: `${col + driftX}%`,
      top: `${row + driftY}%`,
      width: `${width}rem`,
      height: `${height}rem`,
      rotate: `${rotations[index % rotations.length]}deg`,
      opacity: Math.min(0.78, baseOpacity + edgeBoost - depth),
    }
  })
}

function getRevealProgress(index: number, scrollY: number, viewportHeight: number, isMobile: boolean) {
  const cycle = Math.max(560, viewportHeight * (isMobile ? 0.95 : 0.86))
  const offset = index * (isMobile ? 112 : 144)
  const raw = ((scrollY + offset) % cycle) / cycle
  const enter = smoothstep(raw / 0.28)
  const exit = 1 - smoothstep((raw - 0.82) / 0.18)
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
  const speed = isMobile ? 0.012 + (index % 4) * 0.0024 : 0.009 + (index % 5) * 0.0024
  const phase = index * 0.71
  const floatX = Math.sin(scrollY / 180 + phase) * (isMobile ? 13 : 20)
  const floatY = Math.cos(scrollY / 230 + phase) * (isMobile ? 11 : 16)
  const parallaxY = scrollY * speed * direction
  const parallaxX = scrollY * speed * 0.25 * -direction
  const revealLift = (1 - reveal) * (isMobile ? 38 : 50)
  const scale = 0.9 + reveal * 0.1
  const rotateDrift = Math.sin(scrollY / 270 + phase) * (isMobile ? 1.4 : 1.8)
  const opacity = slot.opacity * (0.34 + reveal * 0.66)
  const blur = (1 - reveal) * 0.24

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
  const desktopSlots = useMemo(() => buildSlots(24, false), [])
  const mobileSlots = useMemo(() => buildSlots(14, true), [])

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(11,31,77,0.032),transparent_30rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.024),transparent_26rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />

      {hasLargeBackground ? (
        <>
          {background.desktopUrl ? (
            <div
              className="absolute inset-0 hidden bg-cover bg-fixed bg-no-repeat md:block"
              style={{
                backgroundImage: `url(${background.desktopUrl})`,
                backgroundPosition: background.desktopPosition,
                opacity: Math.min(0.018, background.opacity),
                transform: reduceMotion ? undefined : `translate3d(0, ${scrollY * -0.01}px, 0)`,
              }}
            />
          ) : null}

          {mobileUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-scroll bg-no-repeat md:hidden"
              style={{
                backgroundImage: `url(${mobileUrl})`,
                backgroundPosition: background.mobilePosition,
                opacity: Math.min(0.012, background.opacity),
                transform: reduceMotion ? undefined : `translate3d(0, ${scrollY * -0.006}px, 0)`,
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
                className="absolute overflow-hidden rounded-[1.25rem] border border-white/70 bg-white/32 p-1.5 shadow-[0_26px_70px_rgba(11,31,77,0.22)] backdrop-blur-[0.2px] transition-[transform,opacity,filter] duration-500 ease-out"
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
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.92rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
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
                className="absolute overflow-hidden rounded-[1.1rem] border border-white/70 bg-white/32 p-1 shadow-[0_22px_58px_rgba(11,31,77,0.22)] backdrop-blur-[0.2px] transition-[transform,opacity,filter] duration-500 ease-out"
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
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.82rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.046)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.034)_1px,transparent_1px)] bg-[size:96px_96px] opacity-14 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_76%)]" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/34 via-white/12 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[10rem] bg-gradient-to-t from-white/40 via-white/12 to-transparent" />
    </div>
  )
}
