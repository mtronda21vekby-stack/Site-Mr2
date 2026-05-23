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
  { left: '4%', top: '14%', width: '8.5rem', rotate: '-9deg', opacity: 0.17 },
  { left: '83%', top: '10%', width: '9.5rem', rotate: '8deg', opacity: 0.16 },
  { left: '10%', top: '38%', width: '7.4rem', rotate: '7deg', opacity: 0.13 },
  { left: '78%', top: '34%', width: '8.8rem', rotate: '-7deg', opacity: 0.15 },
  { left: '3%', top: '68%', width: '9rem', rotate: '10deg', opacity: 0.13 },
  { left: '88%', top: '66%', width: '7.8rem', rotate: '-10deg', opacity: 0.14 },
  { left: '18%', top: '82%', width: '6.9rem', rotate: '-6deg', opacity: 0.11 },
  { left: '68%', top: '84%', width: '8rem', rotate: '6deg', opacity: 0.12 },
]

const mobileSlots = [
  { left: '-7%', top: '9%', width: '5.6rem', rotate: '-10deg', opacity: 0.13 },
  { left: '78%', top: '15%', width: '5.9rem', rotate: '9deg', opacity: 0.13 },
  { left: '-6%', top: '39%', width: '5.3rem', rotate: '8deg', opacity: 0.11 },
  { left: '82%', top: '46%', width: '5.4rem', rotate: '-8deg', opacity: 0.12 },
  { left: '5%', top: '75%', width: '5.1rem', rotate: '-7deg', opacity: 0.10 },
  { left: '74%', top: '80%', width: '5.8rem', rotate: '7deg', opacity: 0.11 },
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
                opacity: Math.min(0.10, background.opacity),
              }}
            />
          ) : null}

          {mobileUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-scroll bg-no-repeat md:hidden"
              style={{
                backgroundImage: `url(${mobileUrl})`,
                backgroundPosition: background.mobilePosition,
                opacity: Math.min(0.08, background.opacity),
              }}
            />
          ) : null}
        </>
      ) : null}

      {desktopDecor.length ? (
        <div className="absolute inset-0 hidden md:block">
          {desktopDecor.map((image, index) => {
            const slot = desktopSlots[index % desktopSlots.length]
            return (
              <div
                key={`desktop-bg-${image.id}`}
                className="absolute overflow-hidden rounded-[1.15rem] border border-white/80 bg-white/70 p-1.5 shadow-[0_24px_70px_rgba(11,31,77,0.10)] backdrop-blur-sm"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  opacity: slot.opacity,
                  transform: `rotate(${slot.rotate})`,
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="h-24 w-full rounded-[0.8rem] object-cover" loading="lazy" draggable="false" />
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
                className="absolute overflow-hidden rounded-[0.95rem] border border-white/80 bg-white/70 p-1 shadow-[0_16px_44px_rgba(11,31,77,0.09)] backdrop-blur-sm"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  opacity: slot.opacity,
                  transform: `rotate(${slot.rotate})`,
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="h-20 w-full rounded-[0.7rem] object-cover" loading="lazy" draggable="false" />
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="absolute inset-0 bg-white/74 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.07)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.055)_1px,transparent_1px)] bg-[size:96px_96px] opacity-16 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-white via-white/78 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-white via-white/82 to-transparent" />
    </div>
  )
}