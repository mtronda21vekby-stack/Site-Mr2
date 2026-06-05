'use client'

import { useEffect, useRef, useState } from 'react'
import { getOptimizedSupabaseImageUrl } from '@/lib/images'

type GalleryImage = {
  id: string
  image_url: string
  title: string | null
  alt: string | null
  category: string | null
}

function normalizeIndex(index: number, length: number) {
  if (length <= 0) return 0
  return ((index % length) + length) % length
}

function shortestOffset(index: number, activeIndex: number, length: number) {
  if (length <= 0) return 0
  let offset = index - activeIndex
  if (offset > length / 2) offset -= length
  if (offset < -length / 2) offset += length
  return offset
}

export default function MobileScrollSpinGallery({ images }: { images: GalleryImage[] }) {
  const visibleImages = images.slice(0, 8)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const current = lightboxIndex === null ? null : visibleImages[lightboxIndex]

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduceMotion || isTouching || lightboxIndex !== null || visibleImages.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((value) => normalizeIndex(value + 1, visibleImages.length))
    }, 2200)

    return () => window.clearInterval(timer)
  }, [isTouching, lightboxIndex, reduceMotion, visibleImages.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxIndex])

  if (!visibleImages.length) return null

  const openActive = () => setLightboxIndex(activeIndex)
  const activateNext = () => setActiveIndex((value) => normalizeIndex(value + 1, visibleImages.length))
  const activatePrev = () => setActiveIndex((value) => normalizeIndex(value - 1, visibleImages.length))
  const next = () => setLightboxIndex((value) => (value === null ? value : normalizeIndex(value + 1, visibleImages.length)))
  const prev = () => setLightboxIndex((value) => (value === null ? value : normalizeIndex(value - 1, visibleImages.length)))

  function handleCarouselTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    setIsTouching(true)
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  function handleCarouselTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    setIsTouching(false)
    if (touchStartX.current === null) return

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current

    if (Math.abs(delta) > 42) {
      if (delta < 0) activateNext()
      else activatePrev()
    }

    touchStartX.current = null
  }

  return (
    <>
      <div
        translate="no"
        className="notranslate relative h-[24rem] touch-pan-y overflow-hidden rounded-[2.1rem] border border-[#0B1F4D]/10 bg-[radial-gradient(circle_at_50%_45%,rgba(11,31,77,0.10),transparent_13rem),linear-gradient(180deg,#FFFFFF_0%,#F3F7FF_100%)] shadow-[0_28px_90px_rgba(11,31,77,0.12)]"
        onTouchStart={handleCarouselTouchStart}
        onTouchEnd={handleCarouselTouchEnd}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(243,247,255,0.88)_0%,transparent_20%,transparent_80%,rgba(243,247,255,0.88)_100%)]" />

        <div className="absolute inset-0 [perspective:1000px]">
          {visibleImages.map((image, index) => {
            const offset = shortestOffset(index, activeIndex, visibleImages.length)
            const abs = Math.abs(offset)
            const isActive = offset === 0
            const isHidden = abs > 2
            const translateX = offset * 7.15
            const rotateY = offset * -19
            const rotateZ = offset * -2
            const scale = isActive ? 1 : abs === 1 ? 0.72 : 0.52
            const opacity = isHidden ? 0 : isActive ? 1 : abs === 1 ? 0.68 : 0.22
            const zIndex = 30 - abs

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  if (isActive) openActive()
                  else setActiveIndex(index)
                }}
                aria-label="Open photo"
                className="absolute left-1/2 top-1/2 h-[20.5rem] w-[16rem] origin-center overflow-hidden rounded-[1.85rem] border border-white/75 bg-white outline-none transition-all duration-700 ease-[cubic-bezier(0.2,0.85,0.2,1)] active:scale-[0.98]"
                style={{
                  zIndex,
                  opacity,
                  pointerEvents: isHidden ? 'none' : 'auto',
                  transform: `translate(-50%, -50%) translate3d(${translateX}rem, 0, ${isActive ? 90 : -abs * 90}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                  boxShadow: isActive ? '0 30px 80px rgba(11,31,77,0.26)' : '0 18px 45px rgba(11,31,77,0.12)',
                }}
              >
                <img
                  src={getOptimizedSupabaseImageUrl(image.image_url, { width: 760, quality: 66 })}
                  alt={image.alt || image.title || 'Service photo'}
                  loading={abs <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover"
                  draggable="false"
                />
              </button>
            )
          })}
        </div>

        <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-2">
          {visibleImages.map((image, index) => (
            <button
              key={`dot-${image.id}`}
              type="button"
              aria-label="Show photo"
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-7 bg-[#0B1F4D]' : 'w-2 bg-[#0B1F4D]/22'}`}
            />
          ))}
        </div>
      </div>

      {current && lightboxIndex !== null ? (
        <div
          translate="no"
          className="notranslate fixed inset-0 z-[100] bg-[#020814]/94 p-4 backdrop-blur-2xl"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return
            const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
            const delta = endX - touchStartX.current
            if (Math.abs(delta) > 48) {
              if (delta < 0) next()
              else prev()
            }
            touchStartX.current = null
          }}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close photo"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl leading-none text-white backdrop-blur-xl"
          >
            ×
          </button>

          <div className="flex h-full items-center justify-center">
            <div className="max-h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl">
              <img
                src={getOptimizedSupabaseImageUrl(current.image_url, { width: 1400, quality: 76, resize: 'contain' })}
                alt={current.alt || current.title || 'Service photo'}
                className="max-h-[82vh] w-full bg-black object-contain"
                decoding="async"
                draggable="false"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
