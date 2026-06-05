'use client'

import { useState } from 'react'
import { getOptimizedSupabaseImageUrl } from '@/lib/images'

type BeforeAfterSliderProps = {
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
  title?: string
  category?: string
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = 'Before locksmith service',
  afterAlt = 'After locksmith service',
  title = 'Before / After service proof',
  category = 'proof',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(52)

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl">
      <div className="relative h-[28rem] overflow-hidden bg-black md:h-[34rem]">
        <img src={getOptimizedSupabaseImageUrl(beforeImage, { width: 1200, quality: 70 })} alt={beforeAlt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={getOptimizedSupabaseImageUrl(afterImage, { width: 1200, quality: 70 })} alt={afterAlt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </div>

        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
          After
        </div>
        <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white backdrop-blur-xl">
          Before
        </div>

        <div className="absolute bottom-0 top-0 w-px bg-white shadow-[0_0_28px_rgba(45,226,230,0.8)]" style={{ left: `${position}%` }} />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-cyan/40 bg-black/70 px-4 py-3 text-xs font-black text-white shadow-[0_0_34px_rgba(45,226,230,0.35)] backdrop-blur-xl" style={{ left: `${position}%` }}>
          ↔
        </div>

        <input
          aria-label="Before after slider"
          type="range"
          min="8"
          max="92"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="absolute inset-x-6 bottom-6 z-10 accent-cyan-300"
        />
      </div>

      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-accent-cyan/80">{category}</p>
        <h3 className="mt-2 text-xl font-black text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/50">Slide to compare the job state before and after service.</p>
      </div>
    </article>
  )
}
