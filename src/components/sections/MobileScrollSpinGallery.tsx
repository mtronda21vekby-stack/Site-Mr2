'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

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
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [filter, setFilter] = useState('all')
  const [isPaused, setIsPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const categories = useMemo(() => ['all', ...Array.from(new Set(images.map((image) => image.category || 'gallery')))], [images])
  const filteredImages = useMemo(() => (filter === 'all' ? images : images.filter((image) => (image.category || 'gallery') === filter)), [filter, images])
  const visibleImages = filteredImages.slice(0, 10)
  const activeImage = visibleImages[activeIndex] ?? visibleImages[0]
  const current = lightboxIndex === null ? null : visibleImages[lightboxIndex]

  useEffect(() => {
    setActiveIndex(0)
    setLightboxIndex(null)
  }, [filter])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduceMotion || isPaused || lightboxIndex !== null || visibleImages.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex((value) => normalizeIndex(value + 1, visibleImages.length))
    }, 2300)

    return () => window.clearInterval(timer)
  }, [isPaused, lightboxIndex, reduceMotion, visibleImages.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxIndex])

  const next = () => setLightboxIndex((value) => (value === null ? value : normalizeIndex(value + 1, visibleImages.length)))
  const prev = () => setLightboxIndex((value) => (value === null ? value : normalizeIndex(value - 1, visibleImages.length)))

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

      <div
        className="relative h-[31rem] overflow-hidden rounded-[2.4rem] border border-[#0B1F4D]/10 bg-[radial-gradient(circle_at_50%_12%,rgba(18,58,115,0.16),transparent_16rem),linear-gradient(180deg,#FFFFFF_0%,#F3F7FF_100%)] shadow-[0_28px_90px_rgba(11,31,77,0.12)]"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(11,31,77,0.10),transparent_10rem)]" />
        <div className="pointer-events-none absolute left-1/2 top-[47%] h-[19.5rem] w-[19.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0B1F4D]/10" />
        <div className="pointer-events-none absolute left-1/2 top-[47%] h-[14rem] w-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0B1F4D]/8" />

        <div className="absolute left-5 right-5 top-5 z-20 flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.62rem] font-black uppercase tracking-[0.24em] text-[#123A73]">Loop orbit gallery</p>
            <h3 className="mt-1 text-xl font-black tracking-[-0.045em] text-[#0B1F4D]">Photos rotate in a loop</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            className="shrink-0 rounded-full border border-[#0B1F4D]/14 bg-white/82 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#0B1F4D] shadow-[0_12px_30px_rgba(11,31,77,0.10)] backdrop-blur-xl"
          >
            {isPaused ? 'Play' : 'Pause'}
          </button>
        </div>

        <div className="absolute inset-0 top-16 [perspective:1100px]">
          {visibleImages.map((image, index) => {
            const offset = shortestOffset(index, activeIndex, visibleImages.length)
            const abs = Math.abs(offset)
            const isActive = offset === 0
            const isHidden = abs > 3
            const x = offset * 4.35
            const y = abs === 0 ? 0 : abs === 1 ? 3.4 : abs === 2 ? 7.5 : 11.2
            const rotate = offset * -16
            const rotateY = offset * -18
            const scale = isActive ? 1 : abs === 1 ? 0.73 : abs === 2 ? 0.54 : 0.42
            const opacity = isHidden ? 0 : isActive ? 1 : abs === 1 ? 0.78 : abs === 2 ? 0.42 : 0.18
            const zIndex = 40 - abs

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  if (isActive) setLightboxIndex(index)
                  else setActiveIndex(index)
                }}
                className="absolute left-1/2 top-[46%] w-[16.5rem] origin-center overflow-hidden rounded-[2rem] border border-white/70 bg-white text-left outline-none transition-all duration-700 ease-[cubic-bezier(0.2,0.85,0.2,1)] active:scale-[0.98]"
                style={{
                  zIndex,
                  opacity,
                  transform: `translate(-50%, -50%) translate3d(${x}rem, ${y}rem, ${isActive ? 80 : -abs * 70}px) rotateY(${rotateY}deg) rotateZ(${rotate}deg) scale(${scale})`,
                  boxShadow: isActive ? '0 30px 80px rgba(11,31,77,0.28)' : '0 20px 50px rgba(11,31,77,0.14)',
                  pointerEvents: isHidden ? 'none' : 'auto',
                }}
              >
                <div className="relative h-[21rem] overflow-hidden bg-[#EEF4FF]">
                  <img
                    src={image.image_url}
                    alt={image.alt || image.title || 'Planetlocksmiths service photo'}
                    loading={index <= 2 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_36%,rgba(11,31,77,0.72))]" />
                  <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/70 bg-white/76 px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.18em] text-[#0B1F4D] shadow-[0_12px_32px_rgba(11,31,77,0.12)] backdrop-blur-xl">
                    {(image.category || 'gallery')} · {index + 1}/{visibleImages.length}
                  </div>
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.24em] text-white/72">Tap active photo</p>
                    <h3 className="mt-2 line-clamp-2 text-xl font-black tracking-[-0.035em]">
                      {image.title || 'Mobile locksmith service'}
                    </h3>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="absolute bottom-5 left-0 right-0 z-30 flex items-center justify-center gap-2">
          {visibleImages.map((image, index) => (
            <button
              key={`dot-${image.id}`}
              type="button"
              aria-label={`Show photo ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-[#0B1F4D]' : 'w-2.5 bg-[#0B1F4D]/22'}`}
            />
          ))}
        </div>
      </div>

      {activeImage ? (
        <div className="mt-5 rounded-[1.4rem] border border-[#0B1F4D]/10 bg-white/88 p-4 shadow-[0_18px_45px_rgba(11,31,77,0.08)] backdrop-blur-xl">
          <p className="text-[0.64rem] font-black uppercase tracking-[0.22em] text-[#123A73]">Now showing</p>
          <h3 className="mt-2 text-xl font-black tracking-[-0.035em] text-[#0B1F4D]">{activeImage.title || 'Mobile locksmith service'}</h3>
          <p className="mt-2 text-sm leading-6 text-[#42526E]">The gallery rotates one photo at a time in a continuous loop. Tap the centered photo to open it.</p>
        </div>
      ) : null}

      {current && lightboxIndex !== null ? (
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
            onClick={() => setLightboxIndex(null)}
            className="absolute right-5 top-5 z-10 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl"
          >
            Close
          </button>

          <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur-xl">
            {lightboxIndex + 1} / {visibleImages.length}
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
