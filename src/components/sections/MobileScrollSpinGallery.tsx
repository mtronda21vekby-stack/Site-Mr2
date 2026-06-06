'use client'

import { useEffect, useRef, useState } from 'react'
import ResilientSupabaseImage from '@/components/sections/ResilientSupabaseImage'

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

export default function MobileScrollSpinGallery({ images }: { images: GalleryImage[] }) {
  const visibleImages = images.slice(0, 10)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)

  const current = lightboxIndex === null ? null : visibleImages[lightboxIndex]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      const cardWidth = track.clientWidth
      if (!cardWidth) return
      setActiveIndex(normalizeIndex(Math.round(track.scrollLeft / cardWidth), visibleImages.length))
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [visibleImages.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxIndex])

  if (!visibleImages.length) return null

  function goTo(index: number) {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: normalizeIndex(index, visibleImages.length) * track.clientWidth, behavior: 'smooth' })
  }

  const next = () => setLightboxIndex((value) => (value === null ? value : normalizeIndex(value + 1, visibleImages.length)))
  const prev = () => setLightboxIndex((value) => (value === null ? value : normalizeIndex(value - 1, visibleImages.length)))

  return (
    <>
      <div className="overflow-hidden rounded-[1.75rem] border border-[#0B1F4D]/12 bg-white shadow-[0_28px_90px_rgba(11,31,77,0.12)]">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {visibleImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label="Open service photo"
              className="w-full min-w-full snap-center bg-[#F3F7FF] p-3 text-left outline-none"
            >
              <span className="block overflow-hidden rounded-[1.25rem] border border-[#0B1F4D]/10 bg-white">
                <ResilientSupabaseImage
                  src={image.image_url}
                  widthHint={900}
                  quality={74}
                  resize="contain"
                  alt={image.alt || image.title || 'Planet Locksmiths service photo'}
                  loading={index <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-[21rem] w-full bg-[#EEF3FA] object-contain"
                  draggable="false"
                />
              </span>
              {(image.title || image.alt) ? (
                <span className="block px-2 pb-1 pt-3 text-sm font-semibold leading-6 text-[#0B1F4D]">
                  {image.title || image.alt}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#0B1F4D]/10 px-4 py-3">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0B1F4D]/14 bg-white text-xl text-[#0B1F4D]"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <div className="flex min-w-0 items-center justify-center gap-2">
            {visibleImages.map((image, index) => (
              <button
                key={`dot-${image.id}`}
                type="button"
                aria-label="Show service photo"
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-7 bg-[#0B1F4D]' : 'w-2 bg-[#0B1F4D]/22'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0B1F4D]/14 bg-white text-xl text-[#0B1F4D]"
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      </div>

      {current && lightboxIndex !== null ? (
        <div className="notranslate fixed inset-0 z-[100] bg-[#020814]/94 p-4 backdrop-blur-2xl" translate="no">
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close photo"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl leading-none text-white backdrop-blur-xl"
          >
            ×
          </button>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-white backdrop-blur-xl"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-white backdrop-blur-xl"
          >
            ›
          </button>

          <div className="flex h-full items-center justify-center">
            <div className="max-h-full w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-2xl">
              <ResilientSupabaseImage
                src={current.image_url}
                widthHint={1400}
                quality={80}
                resize="contain"
                alt={current.alt || current.title || 'Planet Locksmiths service photo'}
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
