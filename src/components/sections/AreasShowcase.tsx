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
    <section className="relative bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-accent-cyan">{eyebrow}</p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl lg:text-6xl">{title}</h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted sm:text-base sm:leading-8">{body}</p>
          </div>

          <Link href={ctaHref} className="inline-flex w-fit items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent-blue/45 hover:bg-accent-blue/10 hover:text-accent-blue">
            {ctaLabel} →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map((area, index) => {
            const location = [area.city, area.state].filter(Boolean).join(', ')

            return (
              <Link key={area.slug} href={`/${locale}/areas/${area.slug}`} className="group premium-panel relative block min-h-[15rem] overflow-hidden rounded-[1.5rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/35">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <div className="relative flex h-full flex-col">
                  <p className="mb-5 text-[0.65rem] font-black uppercase tracking-[0.22em] text-accent-gold">Area {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="text-balance text-2xl font-semibold tracking-[-0.035em] text-text">{area.title}</h3>
                  {location ? <p className="mt-2 text-sm font-semibold text-accent-cyan/80">{location}</p> : null}
                  <p className="mt-4 flex-1 text-sm leading-7 text-muted">{area.intro}</p>
                  <span className="mt-6 inline-flex items-center text-xs font-black uppercase tracking-[0.18em] text-accent-blue transition group-hover:text-accent-cyan">{ctaLabel}<span className="ml-2 transition duration-300 group-hover:translate-x-1">→</span></span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
