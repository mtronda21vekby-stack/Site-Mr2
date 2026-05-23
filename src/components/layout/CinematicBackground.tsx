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

const defaultBackground: BackgroundState = {
  desktopUrl: '',
  mobileUrl: '',
  opacity: 0.08,
  desktopPosition: 'center center',
  mobilePosition: 'center center',
}

function normalizeOpacity(value: unknown) {
  const number = Number(value)
  if (!Number.isFinite(number)) return defaultBackground.opacity
  return Math.min(0.22, Math.max(0.02, number))
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
  const cols = isMobile ? [-10, 18, 48, 78] : [-4, 9, 23, 38, 54, 70, 86]
  const rows = isMobile ? [4, 17, 30, 43, 56, 69, 82] : [4, 16, 28, 40, 52, 64, 76, 88]
  const rotations = [-9, 6, -4, 8, -7, 5, -6, 9]

  return Array.from({ length: count }, (_, index) => {
    const col = cols[index % cols.length]
    const row = rows[Math.floor(index / cols.length) % rows.length]
    const driftX = ((index * 7) % 9) - 4
    const driftY = ((index * 5) % 7) - 3
    const wide = index % 3 === 0
    const width = isMobile ? (wide ? 5.9 : 5.15) : (wide ? 8.1 : 6.9)
    const height = isMobile ? (wide ? 4.05 : 3.55) : (wide ? 5.25 : 4.55)
    const baseOpacity = isMobile ? 0.21 : 0.20
    const edgeBoost = col < 0 || col > 74 ? 0.08 : 0
    const depth = (index % 4) * 0.025

    return {
      left: `${col + driftX}%`,
      top: `${row + driftY}%`,
      width: `${width}rem`,
      height: `${height}rem`,
      rotate: `${rotations[index % rotations.length]}deg`,
      opacity: Math.min(0.34, baseOpacity + edgeBoost - depth),
    }
  })
}

export default function CinematicBackground() {
  const supabase = useMemo(() => getSupabaseClient() as any, [])
  const [background, setBackground] = useState<BackgroundState>(defaultBackground)
  const [decorImages, setDecorImages] = useState<DecorImage[]>([])
  const desktopSlots = useMemo(() => buildSlots(34, false), [])
  const mobileSlots = useMemo(() => buildSlots(22, true), [])

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(11,31,77,0.045),transparent_30rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.035),transparent_26rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />

      {hasLargeBackground ? (
        <>
          {background.desktopUrl ? (
            <div
              className="absolute inset-0 hidden bg-cover bg-fixed bg-no-repeat md:block"
              style={{
                backgroundImage: `url(${background.desktopUrl})`,
                backgroundPosition: background.desktopPosition,
                opacity: Math.min(0.045, background.opacity),
              }}
            />
          ) : null}

          {mobileUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-scroll bg-no-repeat md:hidden"
              style={{
                backgroundImage: `url(${mobileUrl})`,
                backgroundPosition: background.mobilePosition,
                opacity: Math.min(0.03, background.opacity),
              }}
            />
          ) : null}
        </>
      ) : null}

      <div className="absolute inset-0 bg-white/18" />

      {decorImages.length ? (
        <div className="absolute inset-0 hidden md:block">
          {desktopSlots.map((slot, index) => {
            const image = imageForSlot(decorImages, index)
            if (!image) return null

            return (
              <div
                key={`desktop-bg-${index}-${image.id}`}
                className="absolute overflow-hidden rounded-[0.85rem] border border-white/90 bg-white/68 p-0.5 shadow-[0_14px_36px_rgba(11,31,77,0.10)] backdrop-blur-[0.5px]"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  opacity: slot.opacity,
                  transform: `rotate(${slot.rotate})`,
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.62rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
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
                key={`mobile-bg-${index}-${image.id}`}
                className="absolute overflow-hidden rounded-[0.72rem] border border-white/90 bg-white/68 p-0.5 shadow-[0_10px_26px_rgba(11,31,77,0.10)] backdrop-blur-[0.5px]"
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  opacity: slot.opacity,
                  transform: `rotate(${slot.rotate})`,
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.54rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" />
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="absolute inset-0 bg-white/12" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.06)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.045)_1px,transparent_1px)] bg-[size:96px_96px] opacity-18 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/62 via-white/24 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[16rem] bg-gradient-to-t from-white/70 via-white/28 to-transparent" />
    </div>
  )
}
