'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type GalleryImage = {
  id: string
  image_url: string
  title: string | null
  alt: string | null
  category: string | null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function MobileScrollSpinGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null)
  const [filter, setFilter] = useState('all')
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const rafRef = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const categories = useMemo(() => ['all', ...Array.from(new Set(images.map((image) => image.category || 'gallery')))], [images])
  const filteredImages = useMemo(() => (filter === 'all' ? images : images.filter((image) => (image.category || 'gallery') === filter)), [filter, images])
  const current = active === null ? null : filteredImages[active]

  useEffect(() => {
    setActive(null)
    cardRefs.current = []
  }, [filter])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const updateCards = () => {
      rafRef.current = null
      const viewportHeight = window.innerHeight || 1
      const center = viewportHeight * 0.52

      cardRefs.current.forEach((card, index) => {
        if (!card) return

        const rect = card.getBoundingClientRect()
        const cardCenter = rect.top + rect.height / 2
        const progress = clamp((cardCenter - center) / (viewportHeight * 0.62), -1, 1)
        const strength = 1 - Math.abs(progress)
        const baseTilt = index % 2 === 0 ? -4 : 4
        const rotateZ = baseTilt - progress * 18
        const rotateY = -progress * 16
        const translateY = -strength * 10
        const scale = 0.94 + strength * 0.06
        const glow = 0.08 + strength * 0.18

        card.style.transform = `perspective(900px) translate3d(0, ${translateY}px, 0) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`
        card.style.opacity = String(0.72 + strength * 0.28)
        card.style.boxShadow = `0 26px 70px rgba(11,31,77,${glow})`
      })
    }

    const requestUpdate = () => {
      if (rafRef.current !== null) return
      rafRef.current = window.requestAnimationFrame(updateCards)
    }

    updateCards()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [filteredImages])

  useEffect(() => {
    if (active === null) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [active])

  const next = () => setActive((value) => (value === null ? value : (value + 1) % filteredImages.length))
  const prev = () => setActive((value) => (value === null ? value : (value - 1 + filteredImages.length) % filteredImages.length))

  return (
    <>
      <div className="mb-7 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[0.66rem] font-black uppercase tracking-[0.18em] transition ${filter === category ? 'border-[#0B1F4D] bg-[#0B1F4D] text-white shadow-[0_16px_36px_rgba(11,31,77,0.22)]' : 'border-[#0B1F4D]/16 bg-white text-[#0B1F4D] shadow-[0_10px_24px_rgba(11,31,77,0.07)]'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="relative space-y-7 pb-3 [perspective:1000px]">
        <div className="pointer-events-none absolute inset-x-8 top-5 bottom-5 rounded-full bg-[linear-gradient(180deg,rgba(11,31,77,0.08),rgba(18,58,115,0.02),rgba(11,31,77,0.08))] blur-2xl" />

        {filteredImages.map((image, index) => (
          <button
            key={image.id}
            ref={(node) => {
              cardRefs.current[index] = node
            }}
            type="button"
            onClick={() => setActive(index)}
            className="group relative block w-full origin-center overflow-hidden rounded-[2rem] border border-[#0B1F4D]/12 bg-white text-left shadow-[0_22px_60px_rgba(11,31,77,0.10)] outline-none transition-[border-color,background-color] duration-300 active:scale-[0.985]"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity, box-shadow' }}
          >
            <div className="relative h-[22rem] overflow-hidden bg-[#EEF4FF]">
              <img
                src={image.image_url}
                alt={image.alt || image.title || 'Planetlocksmiths service photo'}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-active:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_35%,rgba(11,31,77,0.74))]" />
              <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/70 bg-white/72 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#0B1F4D] shadow-[0_12px_32px_rgba(11,31,77,0.12)] backdrop-blur-xl">
                {(image.category || 'gallery')} · {index + 1}/{filteredImages.length}
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-[0.64rem] font-black uppercase tracking-[0.24em] text-white/72">Scroll spin proof</p>
                <h3 className="mt-2 line-clamp-2 text-xl font-black tracking-[-0.035em]">
                  {image.title || 'Mobile locksmith service'}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      {current && active !== null ? (
        <div
          className="fixed inset-0 z-[100] bg-[#020814]/94 p-4 backdrop-blur-2xl"
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

          <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur-xl">
            {active + 1} / {filteredImages.length}
          </div>

          <div className="flex h-full items-center justify-center">
            <div className="max-h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl">
              <img
                src={current.image_url}
                alt={current.alt || current.title || 'Planetlocksmiths service photo'}
                className="max-h-[74vh] w-full bg-black object-contain"
              />
              <div className="p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/50">{current.category || 'gallery'}</p>
                <h3 className="mt-2 text-xl font-black text-white">{current.title || 'Mobile locksmith service'}</h3>
                <p className="mt-2 text-sm text-white/45">Swipe left or right to browse.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
