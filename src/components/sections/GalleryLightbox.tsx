'use client'

import { useEffect, useState } from 'react'

type GalleryImage = {
  id: string
  image_url: string
  title: string | null
  alt: string | null
  category: string | null
}

export default function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (active === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') setActive((value) => (value === null ? value : (value + 1) % images.length))
      if (event.key === 'ArrowLeft') setActive((value) => (value === null ? value : (value - 1 + images.length) % images.length))
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [active, images.length])

  const current = active === null ? null : images[active]

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(index)}
            className={`group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] text-left shadow-2xl outline-none backdrop-blur-xl transition duration-500 hover:border-accent-cyan/35 hover:bg-white/[0.055] ${index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
          >
            <div className={`${index === 0 ? 'h-[24rem]' : 'h-72'} overflow-hidden bg-black/50`}>
              <img
                src={image.image_url}
                alt={image.alt || image.title || 'Planet Locksmiths service photo'}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="truncate text-xs font-black uppercase tracking-[0.22em] text-accent-cyan/80">
                  {image.category || 'gallery'}
                </p>
                <h3 className="mt-1 truncate text-sm font-bold text-white/82">
                  {image.title || 'Mobile locksmith service'}
                </h3>
              </div>
              <div className="h-2 w-2 shrink-0 rounded-full bg-accent-cyan shadow-[0_0_18px_rgba(45,226,230,0.8)]" />
            </div>
          </button>
        ))}
      </div>

      {current && active !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 p-4 backdrop-blur-2xl md:p-8">
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
              onClick={() => setActive((active - 1 + images.length) % images.length)}
              className="hidden rounded-full border border-white/15 bg-white/10 px-5 py-4 text-white backdrop-blur-xl md:block"
            >
              ←
            </button>

            <div className="mx-0 flex max-h-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl md:mx-6">
              <img
                src={current.image_url}
                alt={current.alt || current.title || 'Planet Locksmiths service photo'}
                className="max-h-[72vh] w-full object-contain bg-black"
              />
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-accent-cyan/80">{current.category || 'gallery'}</p>
                <h3 className="mt-2 text-xl font-black text-white">{current.title || 'Mobile locksmith service'}</h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActive((active + 1) % images.length)}
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
