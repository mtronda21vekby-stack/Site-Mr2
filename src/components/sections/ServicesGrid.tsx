import Link from 'next/link'
import type { Locale } from '@/components/layout/Header'

interface Service {
  title: string
  excerpt: string
  slug: string
}

function getCopy(locale: Locale) {
  switch (locale) {
    case 'es':
      return { eyebrow: 'Servicios principales', title: 'Servicios automotrices claros', cta: 'Ver servicio', all: 'Todos los servicios' }
    case 'ru':
      return { eyebrow: 'Core services', title: 'Clear automotive services', cta: 'View service', all: 'All services' }
    case 'en':
    default:
      return { eyebrow: 'Core services', title: 'Clear automotive locksmith services', cta: 'View service', all: 'All services' }
  }
}

export default function ServicesGrid({ services, locale }: { services: Service[]; locale: Locale }) {
  const copy = getCopy(locale)
  if (!services.length) return null

  return (
    <section className="relative bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-accent-cyan">{copy.eyebrow}</p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl lg:text-6xl">{copy.title}</h2>
          </div>
          <Link href={`/${locale}/services`} className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/[0.035] px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent-blue/45 hover:bg-accent-blue/10 hover:text-accent-blue">
            {copy.all} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link key={service.slug} href={`/${locale}/services/${service.slug}`} className="group premium-panel relative flex min-h-[17rem] overflow-hidden rounded-[1.5rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/35">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="relative flex h-full flex-col">
                <p className="mb-6 text-[0.65rem] font-black uppercase tracking-[0.22em] text-accent-gold">Service {String(index + 1).padStart(2, '0')}</p>
                <h3 className="text-balance text-2xl font-semibold tracking-[-0.035em] text-text">{service.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-muted">{service.excerpt}</p>
                <span className="mt-7 inline-flex items-center text-xs font-black uppercase tracking-[0.18em] text-accent-blue transition group-hover:text-accent-cyan">{copy.cta}<span className="ml-2 transition duration-300 group-hover:translate-x-1">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
