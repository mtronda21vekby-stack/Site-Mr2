'use client'

import { useEffect, useState } from 'react'

export default function PlanetKeyMark() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        setScrollProgress(Math.min(1, window.scrollY / scrollable))
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const rotate = scrollProgress * 54
  const drift = scrollProgress * -42

  return (
    <div className="planet-key-mark" style={{ '--planet-scroll-rotate': `${rotate}deg`, '--planet-scroll-drift': `${drift}px` } as React.CSSProperties} aria-hidden="true">
      <div className="planet-key-mark__stage">
        <div className="planet-key-mark__halo" />
        <svg className="planet-key-mark__svg" viewBox="0 0 620 620">
          <defs>
            <linearGradient id="pkmBrass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE0A1" />
              <stop offset="38%" stopColor="#A96E2D" />
              <stop offset="100%" stopColor="#F5C86D" />
            </linearGradient>
            <linearGradient id="pkmSteel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.24)" />
              <stop offset="48%" stopColor="rgba(77,162,255,0.52)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
            </linearGradient>
            <radialGradient id="pkmCore" cx="38%" cy="26%" r="74%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
              <stop offset="38%" stopColor="rgba(77,162,255,0.08)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
            </radialGradient>
            <filter id="pkmGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <g className="planet-key-mark__outer">
            <circle cx="310" cy="310" r="184" fill="url(#pkmCore)" stroke="rgba(255,255,255,0.11)" strokeWidth="1.2" />
            <circle cx="310" cy="310" r="188" fill="none" stroke="rgba(77,162,255,0.20)" strokeWidth="2" />
            <circle cx="310" cy="310" r="146" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </g>

          <g className="planet-key-mark__latitudes">
            <ellipse cx="310" cy="310" rx="184" ry="54" fill="none" stroke="url(#pkmSteel)" strokeWidth="1.4" />
            <ellipse cx="310" cy="310" rx="184" ry="102" fill="none" stroke="rgba(255,255,255,0.075)" strokeWidth="1" />
            <ellipse cx="310" cy="310" rx="184" ry="138" fill="none" stroke="rgba(77,162,255,0.12)" strokeWidth="1" />
          </g>

          <g className="planet-key-mark__longitudes">
            <ellipse cx="310" cy="310" rx="62" ry="184" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
            <ellipse cx="310" cy="310" rx="118" ry="184" fill="none" stroke="rgba(77,162,255,0.16)" strokeWidth="1" />
            <path d="M153 214C210 241 267 253 310 253C354 253 411 241 467 214" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <path d="M153 406C210 379 267 367 310 367C354 367 411 379 467 406" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          </g>

          <g className="planet-key-mark__orbit">
            <ellipse cx="310" cy="310" rx="252" ry="74" fill="none" stroke="rgba(77,162,255,0.18)" strokeWidth="1.2" />
            <ellipse cx="310" cy="310" rx="232" ry="52" fill="none" stroke="rgba(214,168,95,0.14)" strokeWidth="1" />
            <path d="M78 308C118 271 198 244 292 238" fill="none" stroke="rgba(77,162,255,0.54)" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M412 374C456 362 501 344 538 317" fill="none" stroke="rgba(214,168,95,0.44)" strokeWidth="2" strokeLinecap="round" />
          </g>

          <g className="planet-key-mark__key" filter="url(#pkmGlow)">
            <circle cx="356" cy="204" r="48" fill="none" stroke="url(#pkmBrass)" strokeWidth="24" />
            <path d="M340 248L246 410" fill="none" stroke="url(#pkmBrass)" strokeWidth="30" strokeLinecap="round" />
            <path d="M266 376L302 397" fill="none" stroke="url(#pkmBrass)" strokeWidth="19" strokeLinecap="round" />
            <path d="M244 415L282 438" fill="none" stroke="url(#pkmBrass)" strokeWidth="19" strokeLinecap="round" />
            <path d="M377 184C393 200 395 226 379 245" fill="none" stroke="rgba(255,244,220,0.62)" strokeWidth="3" strokeLinecap="round" />
            <path d="M335 260L257 396" fill="none" stroke="rgba(255,246,223,0.32)" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  )
}
