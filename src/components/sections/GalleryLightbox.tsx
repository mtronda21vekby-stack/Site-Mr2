'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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

export default function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const visibleImages = useMemo(() => images.slice(0, 12), [images])
  const [active, setActive] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const current = active === null ? null : visibleImages[active]

  useEffect(() => {
    if (active === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive((value) => (value === null ? value : normalizeIndex(value + 1, visibleImages.length)))
      if (event.key === 'ArrowLeft') setActive((value) => (value === null ? value : normalizeIndex(value - 1, visibleImages.length)))
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [active, visibleImages.length])

  const next = () => setActive((value) => (value === null ? value : normalizeIndex(value + 1, visibleImages.length)))
  const prev = () => setActive((value) => (value === null ? value : normalizeIndex(value - 1, visibleImages.length)))

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(index)}
            className={`group relative overflow-hidden rounded-[1.5rem] border border-[#0B1F4D]/12 bg-white text-left shadow-[0_18px_54px_rgba(11,31,77,0.08)] outline-none transition duration-300 hover:-translate-y-1 hover:border-[#123A73]/30 hover:shadow-[0_24px_70px_rgba(11,31,77,0.12)] ${index === 0 ? 'sm:col-span-2' : ''}`}
          >
            <span className={`block overflow-hidden bg-[#EEF3FA] ${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
              <ResilientSupabaseImage
                src={image.image_url}
                widthHint={index === 0 ? 1100 : 680}
                quality={72}
                resize="contain"
                alt={image.alt || image.title || 'Planet Locksmiths service photo'}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
                decoding="async"
                className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.015]"
              />
            </span>
            {(image.title || image.alt) ? (
              <span className="block border-t border-[#0B1F4D]/10 px-4 py-3 text-sm font-semibold leading-6 text-[#0B1F4D]">
                {image.title || image.alt}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {current && active !== null ? (
        <div
          className="fixed inset-0 z-[100] bg-black/92 p-4 backdrop-blur-2xl md:p-8"
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
            onClick={() => setActive(null)}
            className="absolute right-5 top-5 z-10 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl"
          >
            Close
          </button>

          <div className="flex h-full items-center justify-center">
            <button
              type="button"
              onClick={prev}
              className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-white backdrop-blur-xl md:flex"
              aria-label="Previous photo"
            >
              ‹
            </button>

            <div className="mx-0 max-h-full max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] shadow-2xl md:mx-6">
              <ResilientSupabaseImage
                src={current.image_url}
                widthHint={1800}
                quality={82}
                resize="contain"
                alt={current.alt || current.title || 'Planet Locksmiths service photo'}
                className="max-h-[82vh] w-full bg-black object-contain"
                decoding="async"
              />
            </div>

            <button
              type="button"
              onClick={next}
              className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl text-white backdrop-blur-xl md:flex"
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
