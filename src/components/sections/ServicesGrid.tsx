import Link from 'next/link'
import PremiumReveal from '@/components/motion/PremiumReveal'
import type { Locale } from '@/components/layout/Header'

interface Service {
  title: string
  excerpt: string
  intro?: string
  slug: string
}

function getCopy(locale: Locale) {
  switch (locale) {
    case 'es':
      return {
        eyebrow: 'Servicios de cerrajería',
        title: 'Servicios móviles de cerrajería organizados por necesidad',
        intro: 'Servicio para bloqueos, llaves, rekeys, reparación de cerraduras, negocios, hogares, cajas fuertes y acceso comercial.',
        cta: 'Ver detalle',
        all: 'Todos los servicios',
      }
    case 'ru':
      return {
        eyebrow: 'Услуги',
        title: 'Мобильные locksmith-услуги для авто, дома и бизнеса',
        intro: 'Помощь при lockout, потерянных ключах, rekey, ремонте замков, коммерческом доступе, сейфах и срочных ситуациях.',
        cta: 'Подробнее',
        all: 'Все услуги',
      }
    case 'en':
    default:
      return {
        eyebrow: 'Locksmith services',
        title: 'Mobile locksmith service for cars, homes, and businesses',
        intro: 'Help for lockouts, lost keys, rekeys, lock repair, commercial access, safe opening, smart locks, and urgent service calls.',
        cta: 'View details',
        all: 'All services',
      }
  }
}

export default function ServicesGrid({ services, locale }: { services: Service[]; locale: Locale }) {
  const copy = getCopy(locale)
  if (!services.length) return null

  return (
    <section className="relative border-y border-[#0B1F4D]/10 bg-white py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(11,31,77,0.055),transparent_34rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PremiumReveal className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-[#123A73]">{copy.eyebrow}</p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-[#0B1F4D] sm:text-5xl lg:text-6xl">{copy.title}</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#42526E]">{copy.intro}</p>
          </div>
          <Link href={`/${locale}/services`} className="inline-flex w-fit items-center rounded-full border border-[#0B1F4D]/25 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-[#0B1F4D] shadow-[0_16px_42px_rgba(11,31,77,0.10)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0B1F4D]/45 hover:bg-[#F3F7FF] active:scale-[0.985]">
            {copy.all} →
          </Link>
        </PremiumReveal>

        <div className="overflow-hidden rounded-[2rem] border border-[#0B1F4D]/16 bg-white/95 shadow-[0_28px_90px_rgba(11,31,77,0.10),inset_0_1px_0_rgba(255,255,255,0.88)]">
          {services.map((service, index) => {
            const description = service.intro || service.excerpt

            return (
              <PremiumReveal key={service.slug} delay={Math.min(index * 0.035, 0.16)}>
                <Link
                  href={`/${locale}/services/${service.slug}`}
                  className="group relative isolate grid gap-4 border-b border-[#0B1F4D]/10 px-5 py-5 transition duration-300 before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-r-full before:bg-[#0B1F4D] before:opacity-0 before:transition-opacity last:border-b-0 hover:bg-[#F3F7FF] hover:before:opacity-100 focus-visible:bg-[#F3F7FF] focus-visible:outline-none focus-visible:before:opacity-100 sm:px-7 sm:py-6 lg:grid-cols-[7rem_1fr_9rem] lg:items-start"
                >
                  <span className="inline-flex h-9 w-14 items-center justify-center rounded-full border border-[#0B1F4D]/12 bg-white text-xs font-black uppercase tracking-[0.18em] text-[#123A73]/80 shadow-[0_10px_24px_rgba(11,31,77,0.05)]">{String(index + 1).padStart(2, '0')}</span>

                  <span className="min-w-0">
                    <span className="block text-balance text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#0B1F4D] transition duration-300 group-hover:text-[#123A73] sm:text-3xl">
                      {service.title}
                    </span>
                    <span className="mt-0 block max-h-0 overflow-hidden text-sm leading-7 text-[#42526E] opacity-0 transition-all duration-500 group-hover:mt-4 group-hover:max-h-48 group-hover:opacity-100 group-focus-visible:mt-4 group-focus-visible:max-h-48 group-focus-visible:opacity-100 max-md:mt-4 max-md:max-h-64 max-md:opacity-100">
                      {description}
                    </span>
                  </span>

                  <span className="inline-flex h-10 items-center text-xs font-black uppercase tracking-[0.16em] text-[#0B1F4D] transition group-hover:text-[#123A73] lg:justify-end">
                    {copy.cta}<span className="ml-2 transition duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </PremiumReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
