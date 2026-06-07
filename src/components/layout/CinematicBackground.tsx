'use client'

import { useEffect, useState } from 'react'
import { getOptimizedSupabaseImageUrl, isBrowserSupportedImageUrl } from '@/lib/images'
import { getSupabaseClient } from '@/lib/supabase/client'

type ViewportMode = 'desktop' | 'mobile'

type DecorImage = {
  id: string
  imageUrl: string
  alt: string
}

type BackgroundState = {
  desktopUrl: string
  mobileUrl: string
  opacity: number
  desktopPosition: string
  mobilePosition: string
}

type CachedBackgroundAssets = {
  timestamp: number
  background: BackgroundState
  decorImages: DecorImage[]
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

const defaultBackground: BackgroundState = {
  desktopUrl: '',
  mobileUrl: '',
  opacity: 0.14,
  desktopPosition: 'center center',
  mobilePosition: 'center center',
}

const backgroundCacheKey = 'planet-locksmiths-background-assets-v1'
const backgroundCacheTtl = 1000 * 60 * 2

const desktopSlots: CardSlot[] = [
  { left: '-8%', top: '5%', width: '19rem', height: '27rem', rotate: '-8deg', opacity: 0.34, zIndex: 1, driftX: '14px', driftY: '-10px', duration: '20s', delay: '0s' },
  { left: '73%', top: '4%', width: '20rem', height: '28rem', rotate: '7deg', opacity: 0.36, zIndex: 2, driftX: '-14px', driftY: '12px', duration: '23s', delay: '-5s' },
  { left: '6%', top: '48%', width: '16rem', height: '23rem', rotate: '6deg', opacity: 0.24, zIndex: 1, driftX: '11px', driftY: '12px', duration: '25s', delay: '-9s' },
  { left: '61%', top: '51%', width: '17.5rem', height: '25rem', rotate: '-6deg', opacity: 0.25, zIndex: 1, driftX: '-12px', driftY: '-10px', duration: '22s', delay: '-12s' },
  { left: '36%', top: '21%', width: '14.5rem', height: '21rem', rotate: '3deg', opacity: 0.15, zIndex: 0, driftX: '8px', driftY: '10px', duration: '26s', delay: '-15s' },
]

const mobileSlots: CardSlot[] = [
  { left: '-31%', top: '10%', width: '9.8rem', height: '13.8rem', rotate: '-7deg', opacity: 0.11, zIndex: 1, driftX: '0px', driftY: '0px', duration: '1s', delay: '0s' },
  { left: '70%', top: '14%', width: '9.9rem', height: '14rem', rotate: '7deg', opacity: 0.10, zIndex: 2, driftX: '0px', driftY: '0px', duration: '1s', delay: '0s' },
  { left: '24%', top: '54%', width: '8.4rem', height: '12rem', rotate: '3deg', opacity: 0.06, zIndex: 0, driftX: '0px', driftY: '0px', duration: '1s', delay: '0s' },
]

function normalizeOpacity(value: unknown) {
  const number = Number(value)
  if (!Number.isFinite(number)) return defaultBackground.opacity
  return Math.min(0.42, Math.max(0.03, number))
}

function normalizePosition(value: unknown, fallback: string) {
  const position = String(value || '').trim()
  return position || fallback
}

function uniqueDecorImages(images: DecorImage[]) {
  const seen = new Set<string>()
  return images.filter((image) => {
    if (!image.imageUrl || !isBrowserSupportedImageUrl(image.imageUrl) || seen.has(image.imageUrl)) return false
    seen.add(image.imageUrl)
    return true
  })
}

function isLegacyBrandText(value: string | null | undefined) {
  const compact = String(value || '').trim().replace(/[^a-z0-9]/gi, '').toLowerCase()
  return compact === 'planetlocksmith' || compact === 'planetlocksmiths'
}

function normalizeDecorAlt(value: string | null | undefined) {
  const text = String(value || '').trim()
  if (!text || isLegacyBrandText(text)) return 'Planet Locksmiths service photo'
  return text
}

function imageForSlot(images: DecorImage[], index: number) {
  if (!images.length) return null
  return images[index % images.length]
}

function readCachedBackgroundAssets(viewport: ViewportMode): CachedBackgroundAssets | null {
  try {
    const raw = window.sessionStorage.getItem(`${backgroundCacheKey}-${viewport}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedBackgroundAssets
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > backgroundCacheTtl) return null
    if (!parsed.background || !Array.isArray(parsed.decorImages)) return null
    return parsed
  } catch {
    return null
  }
}

function writeCachedBackgroundAssets(viewport: ViewportMode, background: BackgroundState, decorImages: DecorImage[]) {
  try {
    window.sessionStorage.setItem(
      `${backgroundCacheKey}-${viewport}`,
      JSON.stringify({ timestamp: Date.now(), background, decorImages }),
    )
  } catch {
    // Session storage is optional; rendering should not depend on it.
  }
}

function optimizeImageUrl(value: string, viewport: ViewportMode, purpose: 'background' | 'decor') {
  const rawUrl = value.trim()
  if (!rawUrl || !isBrowserSupportedImageUrl(rawUrl)) return ''

  const width = purpose === 'background'
    ? viewport === 'mobile' ? 560 : 1600
    : viewport === 'mobile' ? 220 : 640
  const quality = purpose === 'background'
    ? viewport === 'mobile' ? 36 : 58
    : viewport === 'mobile' ? 34 : 54

  return getOptimizedSupabaseImageUrl(rawUrl, { width, quality, resize: 'cover' })
}

export default function CinematicBackground() {
  const [viewport, setViewport] = useState<ViewportMode | null>(null)
  const [background, setBackground] = useState<BackgroundState>(defaultBackground)
  const [decorImages, setDecorImages] = useState<DecorImage[]>([])
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReduceMotion(motionMedia.matches)
    updateMotion()
    motionMedia.addEventListener('change', updateMotion)
    return () => motionMedia.removeEventListener('change', updateMotion)
  }, [])

  useEffect(() => {
    const viewportMedia = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const updateViewport = () => setViewport(viewportMedia.matches ? 'mobile' : 'desktop')
    updateViewport()
    viewportMedia.addEventListener('change', updateViewport)
    return () => viewportMedia.removeEventListener('change', updateViewport)
  }, [])

  useEffect(() => {
    if (!viewport) return

    let mounted = true
    const activeViewport = viewport

    async function loadBackgroundAssets() {
      const cachedAssets = readCachedBackgroundAssets(activeViewport)
      if (cachedAssets) {
        setBackground(cachedAssets.background)
        setDecorImages(cachedAssets.decorImages)
        return
      }

      setDecorImages([])

      try {
        const supabase = getSupabaseClient() as any
        const imageLimit = activeViewport === 'mobile' ? 2 : desktopSlots.length

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
            .limit(imageLimit),
        ])

        if (!mounted) return

        let nextBackground = defaultBackground
        let nextDecorImages: DecorImage[] = []

        if (!settingsResult.error && settingsResult.data) {
          const desktopUrl = String(settingsResult.data.background_image_url || '')
          const mobileUrl = String(settingsResult.data.background_mobile_image_url || '')

          nextBackground = {
            desktopUrl: optimizeImageUrl(desktopUrl, 'desktop', 'background'),
            mobileUrl: optimizeImageUrl(mobileUrl, 'mobile', 'background'),
            opacity: normalizeOpacity(settingsResult.data.background_opacity),
            desktopPosition: normalizePosition(settingsResult.data.background_position, defaultBackground.desktopPosition),
            mobilePosition: normalizePosition(settingsResult.data.background_mobile_position, defaultBackground.mobilePosition),
          }
        }

        if (!imagesResult.error && Array.isArray(imagesResult.data)) {
          nextDecorImages = uniqueDecorImages(
            imagesResult.data.map((image: any) => ({
              id: String(image.id),
              imageUrl: optimizeImageUrl(String(image.image_url || ''), activeViewport, 'decor'),
              alt: normalizeDecorAlt(image.alt),
            })),
          )
        }

        setBackground(nextBackground)
        setDecorImages(nextDecorImages)
        writeCachedBackgroundAssets(activeViewport, nextBackground, nextDecorImages)
      } catch {
        if (!mounted) return
        setBackground(defaultBackground)
        setDecorImages([])
      }
    }

    loadBackgroundAssets()

    return () => {
      mounted = false
    }
  }, [viewport])

  const mobileBackgroundUrl = background.mobileUrl || background.desktopUrl
  const hasBackground = Boolean(background.desktopUrl || mobileBackgroundUrl)
  const animateDesktopCards = !reduceMotion

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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(11,31,77,0.048),transparent_30rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.034),transparent_26rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />

      {hasBackground ? (
        <>
          {viewport === 'desktop' && background.desktopUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${background.desktopUrl})`,
                backgroundPosition: background.desktopPosition,
                opacity: background.opacity,
              }}
            />
          ) : null}

          {viewport === 'mobile' && mobileBackgroundUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-scroll bg-no-repeat"
              style={{
                backgroundImage: `url(${mobileBackgroundUrl})`,
                backgroundPosition: background.mobilePosition,
                opacity: Math.min(0.16, background.opacity),
              }}
            />
          ) : null}

          <div className="absolute inset-0 bg-white/72 backdrop-blur-[1px] max-md:bg-white/86 max-md:backdrop-blur-0" />
        </>
      ) : null}

      {viewport === 'desktop' && decorImages.length ? (
        <div className="absolute inset-0">
          {desktopSlots.map((slot, index) => {
            const image = imageForSlot(decorImages, index)
            if (!image) return null

            return (
              <div
                key={`desktop-floating-work-${index}-${image.id}`}
                className={`planet-work-card ${animateDesktopCards ? 'planet-work-card-animated' : ''} absolute overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/34 p-1.5 shadow-[0_24px_64px_rgba(11,31,77,0.18)]`}
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
                  willChange: animateDesktopCards ? 'transform' : undefined,
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[1.05rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" decoding="async" fetchPriority="low" />
              </div>
            )
          })}
        </div>
      ) : null}

      {viewport === 'mobile' && decorImages.length ? (
        <div className="absolute inset-0">
          {mobileSlots.map((slot, index) => {
            const image = imageForSlot(decorImages, index)
            if (!image) return null

            return (
              <div
                key={`mobile-floating-work-${index}-${image.id}`}
                className="planet-work-card absolute overflow-hidden rounded-[1.1rem] border border-white/70 bg-white/34 p-1 shadow-[0_18px_48px_rgba(11,31,77,0.16)]"
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
                }}
              >
                <img src={image.imageUrl} alt={image.alt} className="w-full rounded-[0.85rem] object-cover" style={{ height: slot.height }} loading="lazy" draggable="false" decoding="async" fetchPriority="low" />
              </div>
            )
          })}
        </div>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.04)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.032)_1px,transparent_1px)] bg-[size:96px_96px] opacity-[0.14] [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_76%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/42 via-white/16 to-transparent max-md:h-20 max-md:from-white/64" />
      <div className="absolute inset-x-0 bottom-0 h-[10rem] bg-gradient-to-t from-white/46 via-white/14 to-transparent max-md:h-[7rem] max-md:from-white/68" />
    </div>
  )
}
