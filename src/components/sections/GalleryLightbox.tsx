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

export default function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null)
  const [filter, setFilter] = useState('all')
  const touchStartX = useRef<number | null>(null)
  const categories = useMemo(() => ['all', ...Array.from(new Set(images.map((image) => image.category || 'gallery')))], [images])
  const filteredImages = useMemo(() => (filter === 'all' ? images : images.filter((image) => (image.category || 'gallery') === filter)), [filter, images])

  useEffect(() => {
    setActive(null)
  }, [filter])

  useEffect(() => {
    if (active === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive((value) => (value === null ? value : (value + 1) % filteredImages.length))
      if (event.key === 'ArrowLeft') setActive((value) => (value === null ? value : (value - 1 + filteredImages.length) % filteredImages.length))
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [active, filteredImages.length])

  const current = active === null ? null : filteredImages[active]

  const next = () => setActive((value) => (value === null ? value : (value + 1) % filteredImages.length))
  const prev = () => setActive((value) => (value === null ? value : (value - 1 + filteredImages.length) % filteredImages.length))

  return (
    <>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${filter === category ? 'border-accent-cyan/60 bg-accent-cyan/15 text-white' : 'border-white/10 bg-white/[0.035] text-white/55 hover:border-white/25 hover:text-white'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(index)}
            className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] text-left shadow-2xl outline-none backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-accent-cyan/35 hover:bg-white/[0.055] ${index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
          >
            <div className={`${index === 0 ? 'h-[24rem]' : 'h-72'} overflow-hidden bg-black/50`}>
              <ResilientSupabaseImage
                src={image.image_url}
                widthHint={index === 0 ? 1200 : 760}
                quality={68}
                alt={image.alt || image.title || 'Planet Locksmiths service photo'}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>

      {current && active !== null && (
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
              className="hidden rounded-full border border-white/15 bg-white/10 px-5 py-4 text-white backdrop-blur-xl md:block"
            >
              ←
            </button>

            <div className="mx-0 max-h-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl md:mx-6">
              <ResilientSupabaseImage
                src={current.image_url}
                widthHint={1800}
                quality={78}
                resize="contain"
                alt={current.alt || current.title || 'Planet Locksmiths service photo'}
                className="max-h-[82vh] w-full object-contain bg-black"
                decoding="async"
              />
            </div>

            <button
              type="button"
              onClick={next}
              className="hidden rounded-full border border-white/15 bg-white/10 px-5 py-4 text-white backdrop-blur-xl md:block"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
