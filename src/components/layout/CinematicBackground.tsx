'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

type BackgroundState = {
  desktopUrl: string
  mobileUrl: string
  opacity: number
  desktopPosition: string
  mobilePosition: string
}

const defaultBackground: BackgroundState = {
  desktopUrl: '',
  mobileUrl: '',
  opacity: 0.16,
  desktopPosition: 'center center',
  mobilePosition: 'center center',
}

function normalizeOpacity(value: unknown) {
  const number = Number(value)
  if (!Number.isFinite(number)) return defaultBackground.opacity
  return Math.min(0.55, Math.max(0.02, number))
}

export default function CinematicBackground() {
  const supabase = useMemo(() => getSupabaseClient() as any, [])
  const [background, setBackground] = useState<BackgroundState>(defaultBackground)

  useEffect(() => {
    let mounted = true

    async function loadBackground() {
      try {
        const result = await (supabase.from('site_settings') as any)
          .select('background_image_url, background_mobile_image_url, background_opacity, background_position, background_mobile_position')
          .limit(1)
          .maybeSingle()

        if (!mounted || result.error || !result.data) return

        setBackground({
          desktopUrl: String(result.data.background_image_url || '').trim(),
          mobileUrl: String(result.data.background_mobile_image_url || '').trim(),
          opacity: normalizeOpacity(result.data.background_opacity),
          desktopPosition: String(result.data.background_position || defaultBackground.desktopPosition).trim() || defaultBackground.desktopPosition,
          mobilePosition: String(result.data.background_mobile_position || defaultBackground.mobilePosition).trim() || defaultBackground.mobilePosition,
        })
      } catch {
        // Keep safe generated background fallback.
      }
    }

    loadBackground()

    return () => {
      mounted = false
    }
  }, [supabase])

  const hasBackground = Boolean(background.desktopUrl || background.mobileUrl)
  const mobileUrl = background.mobileUrl || background.desktopUrl

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(11,31,77,0.055),transparent_34rem),radial-gradient(circle_at_86%_12%,rgba(18,58,115,0.04),transparent_28rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_48%,#FFFFFF_100%)]" />

      {hasBackground ? (
        <>
          {background.desktopUrl ? (
            <div
              className="absolute inset-0 hidden bg-cover bg-fixed bg-no-repeat md:block"
              style={{
                backgroundImage: `url(${background.desktopUrl})`,
                backgroundPosition: background.desktopPosition,
                opacity: background.opacity,
              }}
            />
          ) : null}

          {mobileUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-scroll bg-no-repeat md:hidden"
              style={{
                backgroundImage: `url(${mobileUrl})`,
                backgroundPosition: background.mobilePosition,
                opacity: Math.min(0.42, background.opacity + 0.04),
              }}
            />
          ) : null}

          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] md:bg-white/74" />
        </>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,77,0.07)_1px,transparent_1px),linear-gradient(rgba(11,31,77,0.055)_1px,transparent_1px)] bg-[size:96px_96px] opacity-16 [mask-image:radial-gradient(circle_at_50%_0%,black_0%,transparent_72%)]" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-white via-white/78 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34rem] bg-gradient-to-t from-white via-white/82 to-transparent" />
    </div>
  )
}