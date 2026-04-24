import Link from 'next/link'
import type { Locale } from '@/components/layout/Header'
import type { AreaContent, SiteContentBlock } from '@/lib/content.server'

interface AreasShowcaseProps {
  locale: Locale
  areas: AreaContent[]
  block?: SiteContentBlock
  fallbackEyebrow: string
  fallbackTitle: string
  fallbackText: string
  fallbackCta: string
}

export default function AreasShowcase({
  locale,
  areas,
  block,
  fallbackEyebrow,
  fallbackTitle,
  fallbackText,
  fallbackCta,
}: AreasShowcaseProps) {
  if (!areas.length) return null

  const eyebrow = block?.eyebrow || fallbackEyebrow
  const title = block?.title || fallbackTitle
  const body = block?.body || fallbackText
  const ctaLabel = block?.ctaLabel || fallbackCta
  const ctaHref = block?.ctaHref || `/${locale}/areas`

  return (
    <section className="relative overflow-hidden bg-transparent py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_24%,rgba(45,226,230,0.10),transparent_28rem),radial-gradient(circle_at_86%_40%,rgba(77,162,255,0.12),transparent_30rem)]" />
      <div className="absolute left-1/2 top-20 -z-10 hidden h-[32rem] w-[70rem] -translate-x-1/2 rounded-full border border-accent-blue/10 opacity-70 [transform:rotateX(74deg)_rotateZ(-7deg)] md:block" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">{eyebrow}</p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl lg:text-6xl">{title}</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted sm:text-base sm:leading-8">{body}</p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex w-fit items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-accent-blue backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-blue/50 hover:bg-accent-blue/10"
          >
            {ctaLabel} →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map((area, index) => {
            const location = [area.city, area.state].filter(Boolean).join(', ')

            return (
              <Link
                key={area.slug}
                href={`/${locale}/areas/${area.slug}`}
                className="group premium-panel premium-hairline relative block min-h-[17rem] overflow-hidden rounded-[1.75rem] p-5 transition duration-500 hover:-translate-y-1.5 hover:border-accent-blue/40"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(45,226,230,0.14),transparent_18rem)] opacity-75 transition group-hover:opacity-100" />
                <div className="absolute right-[-4rem] top-[-4rem] h-36 w-36 rounded-full border border-accent-blue/20" />
                <div className="absolute bottom-[-4.5rem] left-[-3rem] h-40 w-40 rounded-full bg-accent-gold/10 blur-2xl transition group-hover:bg-accent-gold/16" />

                <div className="relative flex h-full flex-col">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-accent-gold">Orbit {String(index + 1).padStart(2, '0')}</p>
                    <span className="h-9 w-9 rounded-full border border-accent-blue/25 bg-accent-blue/10 shadow-[0_0_30px_rgba(77,162,255,0.16)]" />
                  </div>

                  <h3 className="text-balance text-2xl font-semibold tracking-[-0.035em] text-text">{area.title}</h3>
                  {location ? <p className="mt-2 text-sm font-semibold text-accent-cyan/80">{location}</p> : null}
                  <p className="mt-4 line-clamp-4 flex-1 text-sm leading-7 text-muted">{area.intro}</p>

                  <span className="mt-6 inline-flex items-center text-xs font-black uppercase tracking-[0.18em] text-accent-blue transition group-hover:text-accent-cyan">
                    {ctaLabel}
                    <span className="ml-2 transition duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
