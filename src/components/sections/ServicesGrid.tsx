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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(77,162,255,0.14),transparent_30rem),radial-gradient(circle_at_88%_34%,rgba(214,168,95,0.10),transparent_26rem)]" />
      <div className="absolute left-1/2 top-8 -z-10 h-px w-[min(64rem,90vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent-blue/35 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">
              {copy.eyebrow}
            </p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl lg:text-6xl">
              {copy.title}
            </h2>
          </div>

          <Link
            href={`/${locale}/services`}
            className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-accent-blue backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-blue/50 hover:bg-accent-blue/10"
          >
            {copy.cta} →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/${locale}/services/${service.slug}`}
              className="group premium-panel premium-hairline relative flex min-h-[19rem] overflow-hidden rounded-[2rem] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-accent-blue/40"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(77,162,255,0.20),transparent_18rem)] opacity-65 transition duration-500 group-hover:opacity-100" />
              <div className="absolute right-[-4.25rem] top-[-4.25rem] h-44 w-44 rounded-full border border-accent-gold/20 transition duration-500 group-hover:scale-110 group-hover:border-accent-gold/35" />
              <div className="absolute bottom-[-5rem] right-[-2rem] h-40 w-40 rounded-full bg-accent-blue/10 blur-2xl transition duration-500 group-hover:bg-accent-blue/22" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/45 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted">
                    Module {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="relative h-11 w-11 rounded-full border border-accent-gold/30 bg-accent-gold/10 shadow-[0_0_32px_rgba(214,168,95,0.18)]">
                    <span className="absolute inset-3 rounded-full bg-accent-gold/70 shadow-[0_0_20px_rgba(214,168,95,0.45)]" />
                  </span>
                </div>

                <h3 className="text-balance text-2xl font-semibold tracking-[-0.035em] text-text">
                  {service.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-muted">
                  {service.excerpt}
                </p>

                <span className="mt-7 inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-accent-blue transition group-hover:text-accent-cyan">
                  {copy.cta}
                  <span className="ml-2 transition duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
