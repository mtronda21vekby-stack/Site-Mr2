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

const defaultBackground: BackgroundState = {
  desktopUrl: '',
  mobileUrl: '',
  opacity: 0.12,
  desktopPosition: 'center center',
  mobilePosition: 'center center',
}

const desktopSlots = [
  { left: '3%', top: '10%', width: '10.5rem', height: '7.1rem', rotate: '-9deg', opacity: 0.46 },
  { left: '80%', top: '8%', width: '11rem', height: '7.4rem', rotate: '8deg', opacity: 0.44 },
  { left: '8%', top: '31%', width: '9.4rem', height: '6.5rem', rotate: '7deg', opacity: 0.38 },
  { left: '76%', top: '30%', width: '10.8rem', height: '7rem', rotate: '-7deg', opacity: 0.42 },
  { left: '2%', top: '56%', width: '10rem', height: '6.8rem', rotate: '10deg', opacity: 0.36 },
  { left: '86%', top: '55%', width: '9.6rem', height: '6.5rem', rotate: '-10deg', opacity: 0.38 },
  { left: '15%', top: '76%', width: '8.8rem', height: '6rem', rotate: '-6deg', opacity: 0.32 },
  { left: '66%', top: '78%', width: '9.8rem', height: '6.4rem', rotate: '6deg', opacity: 0.34 },
]

const mobileSlots = [
  { left: '-8%', top: '10%', width: '7.2rem', height: '5rem', rotate: '-10deg', opacity: 0.34 },
  { left: '69%', top: '11%', width: '7.8rem', height: '5.3rem', rotate: '9deg', opacity: 0.36 },
  { left: '-8%', top: '28%', width: '7rem', height: '4.9rem', rotate: '8deg', opacity: 0.30 },
  { left: '71%', top: '31%', width: '7.4rem', height: '5rem', rotate: '-8deg', opacity: 0.32 },
  { left: '5%', top: '50%', width: '6.8rem', height: '4.8rem', rotate: '-7deg', opacity: 0.26 },
  { left: '70%', top: '54%', width: '7.6rem', height: '5.1rem', rotate: '7deg', opacity: 0.30 },
  { left: '-4%', top: '73%', width: '7.2rem', height: '5rem', rotate: '9deg', opacity: 0.24 },
  { left: '68%', top: '77%', width: '7.8rem', height: '5.2rem', rotate: '-9deg', opacity: 0.26 },
]

function normalizeOpacity(value: unknown) {
  const number = Number(value)
  if (!Number.isFinite(number)) return defaultBackground.opacity
  return Math.min(0.35, Math.max(0.04, number))
}

function uniqueDecorImages(images: DecorImage[]) {
  const seen = new Set<string>()
  return images.filter((image) => {
    if (!image.imageUrl || seen.has(image.imageUrl)) return false
    seen.add(image.imageUrl)
    return true
  })
}

export default function CinematicBackground() {
  const supabase = useMemo(() => getSupabaseClient() as any, [])
  const [background, setBackground] = useState<BackgroundState>(defaultBackground)
  const [decorImages, setDecorImages] = useState<DecorImage[]>([])

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
            .limit(18),
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
  const desktopDecor = decorImages.length ? decorImages.slice(0, desktopSlots.length) : []
  const mobileDecor = decorImages.length ? decorImages.slice(0, mobileSlots.length) : []

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(11,31,77,0.055),transparent_34rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.04),transparent_28rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />

      {hasLargeBackground ? (
        <>
          {background.desktopUrl ? (
            <div
              className="absolute inset-0 hidden bg-cover bg-fixed bg-no-repeat md:block"
              style={{
                backgroundImage: `url(${background.desktopUrl})`,
                backgroundPosition: background.desktopPosition,
                opacity: Math.min(0.08, background.opacity),
              }}
            />
          ) : null}

          {mobileUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-scroll bg-no-repeat md:hidden"
              style={{
                backgroundImage: `url(${mobileUrl})`,
                backgroundPosition: background.mobilePosition,
                opacity: Math.min(0.06, background.opacity),
              }}
            />
          ) : null}
        </>
      ) : null}

      <div className="absolute inset-0 bg-white/42 backdrop-blur-[0.5px]" />

      {desktopDecor.length ? (
        <div className="absolute inset-0 hidden md:block">
          {desktopDecor.map((image, index) => {
            const slot = desktopSlots[index % desktopSlots.length]
            return (
              <div
                key={`desktop-bg-${image.id}`}
                className="absolute overflow-hidden rounded-[1.2rem] border border-white/90 bg-white/78 p-1.5 shadow-[0_24px_70px_rgba(11,31,77,0.16)] backdrop-blur-sm"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  opacity: slot.opacity,
                  transform: `rotate(${slot.rotate})`,
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.85rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
              </div>
            )
          })}
        </div>
      ) : null}

      {mobileDecor.length ? (
        <div className="absolute inset-0 md:hidden">
          {mobileDecor.map((image, index) => {
            const slot = mobileSlots[index % mobileSlots.length]
            return (
              <div
                key={`mobile-bg-${image.id}`}
                className="absolute overflow-hidden rounded-[1rem] border border-white/90 bg-white/78 p-1 shadow-[0_16px_44px_rgba(11,31,77,0.14)] backdrop-blur-sm"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  opacity: slot.opacity,
                  transform: `rotate(${slot.rotate})`,
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.72rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.07)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.055)_1px,transparent_1px)] bg-[size:96px_96px] opacity-16 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-white/86 via-white/44 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[24rem] bg-gradient-to-t from-white/88 via-white/46 to-transparent" />
    </div>
  )
}