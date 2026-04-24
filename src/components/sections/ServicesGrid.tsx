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
      return {
        eyebrow: 'Premium locksmith modules',
        title: 'Servicios de respuesta automotriz',
        cta: 'Ver más',
      }
    case 'ru':
      return {
        eyebrow: 'Premium locksmith modules',
        title: 'Автомобильные сервис-модули',
        cta: 'Подробнее',
      }
    case 'en':
    default:
      return {
        eyebrow: 'Premium locksmith modules',
        title: 'Automotive response services',
        cta: 'Learn more',
      }
  }
}

export default function ServicesGrid({
  services,
  locale,
}: {
  services: Service[]
  locale: Locale
}) {
  const copy = getCopy(locale)

  if (!services.length) return null

  return (
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(77,162,255,0.12),transparent_28rem),radial-gradient(circle_at_82%_40%,rgba(214,168,95,0.09),transparent_24rem)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan">
              {copy.eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">
              {copy.title}
            </h2>
          </div>

          <Link
            href={`/${locale}/services`}
            className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/[0.035] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-blue backdrop-blur-xl transition hover:border-accent-blue/50 hover:bg-accent-blue/10"
          >
            {copy.cta} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/${locale}/services/${service.slug}`}
              className="group relative flex min-h-[18rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-accent-blue/40 hover:bg-white/[0.06]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(77,162,255,0.18),transparent_18rem)] opacity-70 transition group-hover:opacity-100" />
              <div className="absolute right-[-3.5rem] top-[-3.5rem] h-36 w-36 rounded-full border border-accent-gold/20" />
              <div className="absolute bottom-[-4rem] right-[-2rem] h-36 w-36 rounded-full bg-accent-blue/10 blur-2xl transition group-hover:bg-accent-blue/20" />

              <div className="relative flex h-full flex-col">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted">
                    Module {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="h-10 w-10 rounded-full border border-accent-gold/30 bg-accent-gold/10 shadow-[0_0_30px_rgba(214,168,95,0.18)]" />
                </div>

                <h3 className="text-balance text-xl font-semibold tracking-[-0.02em] text-text sm:text-2xl">
                  {service.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-muted">
                  {service.excerpt}
                </p>

                <span className="mt-7 inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-accent-blue transition group-hover:text-accent-cyan">
                  {copy.cta}
                  <span className="ml-2 transition group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
