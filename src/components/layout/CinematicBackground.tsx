'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

type DecorImage = {
  id: string
  imageUrl: string
  alt: string
}

type CardSlot = {
  left: string
  top: string
  width: string
  height: string
  rotate: string
  opacity: number
  zIndex: number
}

type MotionStyle = {
  transform: string
  opacity: number
  filter?: string
}

const desktopSlots: CardSlot[] = [
  { left: '-7%', top: '5%', width: '19rem', height: '27rem', rotate: '-8deg', opacity: 0.5, zIndex: 1 },
  { left: '74%', top: '4%', width: '20rem', height: '28rem', rotate: '7deg', opacity: 0.52, zIndex: 2 },
  { left: '7%', top: '48%', width: '16rem', height: '23rem', rotate: '6deg', opacity: 0.36, zIndex: 1 },
  { left: '60%', top: '50%', width: '17.5rem', height: '25rem', rotate: '-6deg', opacity: 0.38, zIndex: 1 },
  { left: '36%', top: '20%', width: '14.5rem', height: '21rem', rotate: '3deg', opacity: 0.24, zIndex: 0 },
  { left: '88%', top: '54%', width: '14rem', height: '20rem', rotate: '-9deg', opacity: 0.34, zIndex: 0 },
]

const mobileSlots: CardSlot[] = [
  { left: '-32%', top: '3%', width: '13.4rem', height: '19.2rem', rotate: '-8deg', opacity: 0.52, zIndex: 1 },
  { left: '58%', top: '4%', width: '13.8rem', height: '19.8rem', rotate: '8deg', opacity: 0.54, zIndex: 2 },
  { left: '-18%', top: '40%', width: '12rem', height: '17.2rem', rotate: '7deg', opacity: 0.38, zIndex: 1 },
  { left: '64%', top: '44%', width: '12.4rem', height: '17.8rem', rotate: '-7deg', opacity: 0.4, zIndex: 1 },
  { left: '22%', top: '24%', width: '10.4rem', height: '15.2rem', rotate: '3deg', opacity: 0.24, zIndex: 0 },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function smoothstep(value: number) {
  const x = clamp(value, 0, 1)
  return x * x * (3 - 2 * x)
}

function uniqueDecorImages(images: DecorImage[]) {
  const seen = new Set<string>()
  return images.filter((image) => {
    if (!image.imageUrl || seen.has(image.imageUrl)) return false
    seen.add(image.imageUrl)
    return true
  })
}

function imageForSlot(images: DecorImage[], index: number, scrollY: number, viewportHeight: number) {
  if (!images.length) return null
  const sectionIndex = Math.floor(scrollY / Math.max(520, viewportHeight * 0.82))
  return images[(index + sectionIndex) % images.length]
}

function getRevealProgress(index: number, scrollY: number, viewportHeight: number) {
  const cycle = Math.max(620, viewportHeight * 0.9)
  const offset = index * 132
  const raw = ((scrollY + offset) % cycle) / cycle
  const enter = smoothstep(raw / 0.28)
  const exit = 1 - smoothstep((raw - 0.84) / 0.16)
  return clamp(Math.min(enter, exit), 0, 1)
}

function getMotionStyle(index: number, slot: CardSlot, scrollY: number, viewportHeight: number, reduceMotion: boolean, isMobile: boolean): MotionStyle {
  if (reduceMotion) {
    return {
      transform: `rotate(${slot.rotate})`,
      opacity: slot.opacity,
    }
  }

  const reveal = getRevealProgress(index, scrollY, viewportHeight)
  const direction = index % 2 === 0 ? 1 : -1
  const phase = index * 0.82
  const floatX = Math.sin(scrollY / 320 + phase) * (isMobile ? 7 : 12)
  const floatY = Math.cos(scrollY / 380 + phase) * (isMobile ? 9 : 14)
  const parallaxY = scrollY * (isMobile ? 0.006 : 0.005) * direction
  const parallaxX = scrollY * (isMobile ? 0.002 : 0.0018) * -direction
  const lift = (1 - reveal) * (isMobile ? 30 : 42)
  const scale = 0.96 + reveal * 0.04
  const rotateDrift = Math.sin(scrollY / 420 + phase) * (isMobile ? 1 : 1.25)
  const opacity = slot.opacity * (0.48 + reveal * 0.52)
  const blur = (1 - reveal) * 0.18

  return {
    opacity,
    filter: `blur(${blur}px)`,
    transform: `translate3d(${floatX + parallaxX}px, ${floatY + parallaxY + lift}px, 0) scale(${scale}) rotate(calc(${slot.rotate} + ${rotateDrift}deg))`,
  }
}

export default function CinematicBackground() {
  const supabase = useMemo(() => getSupabaseClient() as any, [])
  const [decorImages, setDecorImages] = useState<DecorImage[]>([])
  const [scrollY, setScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(820)
  const [reduceMotion, setReduceMotion] = useState(false)

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

    async function loadBackgroundPhotos() {
      try {
        const result = await (supabase.from('site_images') as any)
          .select('id,image_url,alt,category,sort_order,created_at')
          .eq('is_published', true)
          .in('category', ['background-decor', 'background-desktop', 'background-mobile'])
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(40)

        if (!mounted || result.error || !Array.isArray(result.data)) return

        setDecorImages(
          uniqueDecorImages(
            result.data.map((image: any) => ({
              id: String(image.id),
              imageUrl: String(image.image_url || '').trim(),
              alt: String(image.alt || 'Planetlocksmiths work photo'),
            })),
          ),
        )
      } catch {
        // Keep safe generated background fallback.
      }
    }

    loadBackgroundPhotos()

    return () => {
      mounted = false
    }
  }, [supabase])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(11,31,77,0.038),transparent_30rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.026),transparent_26rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />

      {decorImages.length ? (
        <div className="absolute inset-0 hidden md:block">
          {desktopSlots.map((slot, index) => {
            const image = imageForSlot(decorImages, index, scrollY, viewportHeight)
            if (!image) return null
            const motion = getMotionStyle(index, slot, scrollY, viewportHeight, reduceMotion, false)

            return (
              <div
                key={`desktop-floating-work-${index}-${image.id}`}
                className="absolute overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/34 p-1.5 shadow-[0_30px_90px_rgba(11,31,77,0.22)] backdrop-blur-[0.2px] transition-[transform,opacity,filter] duration-700 ease-out"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  zIndex: slot.zIndex,
                  opacity: motion.opacity,
                  filter: motion.filter,
                  transform: motion.transform,
                  willChange: reduceMotion ? undefined : 'transform, opacity, filter',
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[1.05rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
              </div>
            )
          })}
        </div>
      ) : null}

      {decorImages.length ? (
        <div className="absolute inset-0 md:hidden">
          {mobileSlots.map((slot, index) => {
            const image = imageForSlot(decorImages, index, scrollY, viewportHeight)
            if (!image) return null
            const motion = getMotionStyle(index, slot, scrollY, viewportHeight, reduceMotion, true)

            return (
              <div
                key={`mobile-floating-work-${index}-${image.id}`}
                className="absolute overflow-hidden rounded-[1.2rem] border border-white/70 bg-white/34 p-1 shadow-[0_26px_76px_rgba(11,31,77,0.24)] backdrop-blur-[0.2px] transition-[transform,opacity,filter] duration-700 ease-out"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  zIndex: slot.zIndex,
                  opacity: motion.opacity,
                  filter: motion.filter,
                  transform: motion.transform,
                  willChange: reduceMotion ? undefined : 'transform, opacity, filter',
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.9rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.04)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.03)_1px,transparent_1px)] bg-[size:96px_96px] opacity-12 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_76%)]" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[10rem] bg-gradient-to-t from-white/34 via-white/10 to-transparent" />
    </div>
  )
}
