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
  driftX: string
  driftY: string
  duration: string
  delay: string
}

const desktopSlots: CardSlot[] = [
  { left: '-9%', top: '2%', width: '21rem', height: '30rem', rotate: '-8deg', opacity: 0.48, zIndex: 1, driftX: '14px', driftY: '-10px', duration: '18s', delay: '0s' },
  { left: '70%', top: '3%', width: '21.5rem', height: '30.8rem', rotate: '8deg', opacity: 0.5, zIndex: 2, driftX: '-14px', driftY: '12px', duration: '21s', delay: '-5s' },
  { left: '-3%', top: '42%', width: '18.4rem', height: '26.4rem', rotate: '7deg', opacity: 0.34, zIndex: 1, driftX: '12px', driftY: '12px', duration: '23s', delay: '-9s' },
  { left: '74%', top: '45%', width: '19rem', height: '27.2rem', rotate: '-7deg', opacity: 0.36, zIndex: 1, driftX: '-12px', driftY: '-10px', duration: '20s', delay: '-12s' },
  { left: '38%', top: '21%', width: '15.8rem', height: '22.8rem', rotate: '3deg', opacity: 0.2, zIndex: 0, driftX: '9px', driftY: '10px', duration: '24s', delay: '-15s' },
]

const mobileSlots: CardSlot[] = [
  { left: '-34%', top: '2%', width: '13.2rem', height: '18.8rem', rotate: '-8deg', opacity: 0.48, zIndex: 1, driftX: '10px', driftY: '-8px', duration: '18s', delay: '0s' },
  { left: '58%', top: '3%', width: '13.6rem', height: '19.4rem', rotate: '8deg', opacity: 0.5, zIndex: 2, driftX: '-10px', driftY: '9px', duration: '21s', delay: '-5s' },
  { left: '-20%', top: '40%', width: '11.7rem', height: '16.8rem', rotate: '7deg', opacity: 0.34, zIndex: 1, driftX: '8px', driftY: '10px', duration: '23s', delay: '-9s' },
  { left: '66%', top: '44%', width: '12rem', height: '17.3rem', rotate: '-7deg', opacity: 0.36, zIndex: 1, driftX: '-9px', driftY: '-8px', duration: '20s', delay: '-12s' },
  { left: '20%', top: '24%', width: '10rem', height: '14.6rem', rotate: '3deg', opacity: 0.2, zIndex: 0, driftX: '7px', driftY: '8px', duration: '24s', delay: '-15s' },
]

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

export default function CinematicBackground() {
  const supabase = useMemo(() => getSupabaseClient() as any, [])
  const [decorImages, setDecorImages] = useState<DecorImage[]>([])
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
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
          .limit(16)

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
      <style jsx>{`
        @keyframes planet-work-float {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(var(--card-rotate));
          }
          50% {
            transform: translate3d(var(--card-drift-x), var(--card-drift-y), 0) rotate(calc(var(--card-rotate) * 0.86));
          }
        }

        .planet-work-card {
          transform: translate3d(0, 0, 0) rotate(var(--card-rotate));
          backface-visibility: hidden;
          contain: layout paint style;
        }

        .planet-work-card-animated {
          animation: planet-work-float var(--card-duration) ease-in-out infinite;
          animation-delay: var(--card-delay);
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(11,31,77,0.038),transparent_30rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.026),transparent_26rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />

      {decorImages.length ? (
        <div className="absolute inset-0 hidden md:block">
          {desktopSlots.map((slot, index) => {
            const image = imageForSlot(decorImages, index)
            if (!image) return null

            return (
              <div
                key={`desktop-floating-work-${index}-${image.id}`}
                className={`planet-work-card ${reduceMotion ? '' : 'planet-work-card-animated'} absolute overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/34 p-1.5 shadow-[0_24px_64px_rgba(11,31,77,0.18)]`}
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  zIndex: slot.zIndex,
                  opacity: slot.opacity,
                  ['--card-rotate' as string]: slot.rotate,
                  ['--card-drift-x' as string]: slot.driftX,
                  ['--card-drift-y' as string]: slot.driftY,
                  ['--card-duration' as string]: slot.duration,
                  ['--card-delay' as string]: slot.delay,
                  willChange: reduceMotion ? undefined : 'transform',
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[1.05rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" decoding="async" />
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

            return (
              <div
                key={`mobile-floating-work-${index}-${image.id}`}
                className={`planet-work-card ${reduceMotion ? '' : 'planet-work-card-animated'} absolute overflow-hidden rounded-[1.2rem] border border-white/70 bg-white/34 p-1 shadow-[0_18px_48px_rgba(11,31,77,0.18)]`}
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  zIndex: slot.zIndex,
                  opacity: slot.opacity,
                  ['--card-rotate' as string]: slot.rotate,
                  ['--card-drift-x' as string]: slot.driftX,
                  ['--card-drift-y' as string]: slot.driftY,
                  ['--card-duration' as string]: slot.duration,
                  ['--card-delay' as string]: slot.delay,
                  willChange: reduceMotion ? undefined : 'transform',
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.9rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" decoding="async" />
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.034)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.026)_1px,transparent_1px)] bg-[size:96px_96px] opacity-10 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_76%)]" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/24 via-white/8 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[8rem] bg-gradient-to-t from-white/28 via-white/8 to-transparent" />
    </div>
  )
}
