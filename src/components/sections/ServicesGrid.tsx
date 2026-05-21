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
        eyebrow: 'Servicios automotrices',
        title: 'Servicios de cerrajería automotriz claros y directos',
        intro: 'Pasa el cursor sobre un servicio para ver qué incluye. En móvil, la descripción se muestra directamente.',
        cta: 'Ver detalle',
        all: 'Todos los servicios',
      }
    case 'ru':
      return {
        eyebrow: 'Услуги',
        title: 'Автомобильные locksmith-услуги без лишних карточек',
        intro: 'Наведи на название услуги, чтобы раскрыть описание. На телефоне описание видно сразу.',
        cta: 'Подробнее',
        all: 'Все услуги',
      }
    case 'en':
    default:
      return {
        eyebrow: 'Automotive locksmith services',
        title: 'Fast mobile auto locksmith help, organized by need',
        intro: 'Hover a service to see what is included. On mobile, each description stays visible for quick scanning.',
        cta: 'View details',
        all: 'All services',
      }
  }
}

export default function ServicesGrid({ services, locale }: { services: Service[]; locale: Locale }) {
  const copy = getCopy(locale)
  if (!services.length) return null

  return (
    <section className="relative border-y border-white/8 bg-[#02040A] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PremiumReveal className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-accent-cyan">{copy.eyebrow}</p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl lg:text-6xl">{copy.title}</h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted">{copy.intro}</p>
          </div>
          <Link href={`/${locale}/services`} className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/[0.035] px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent-blue/45 hover:bg-accent-blue/10 hover:text-accent-blue active:scale-[0.985]">
            {copy.all} →
          </Link>
        </PremiumReveal>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025]">
          {services.map((service, index) => {
            const description = service.intro || service.excerpt

            return (
              <PremiumReveal key={service.slug} delay={Math.min(index * 0.035, 0.16)}>
                <Link
                  href={`/${locale}/services/${service.slug}`}
                  className="group relative grid gap-4 border-b border-white/8 px-5 py-5 transition duration-300 last:border-b-0 hover:bg-white/[0.055] focus-visible:bg-white/[0.055] focus-visible:outline-none sm:px-7 sm:py-6 lg:grid-cols-[7rem_1fr_9rem] lg:items-start"
                >
                  <span className="text-xs font-black uppercase tracking-[0.24em] text-accent-gold/90">{String(index + 1).padStart(2, '0')}</span>

                  <span className="min-w-0">
                    <span className="block text-balance text-2xl font-semibold tracking-[-0.04em] text-text transition duration-300 group-hover:text-accent-cyan sm:text-3xl">
                      {service.title}
                    </span>
                    <span className="mt-0 block max-h-0 overflow-hidden text-sm leading-7 text-muted opacity-0 transition-all duration-500 group-hover:mt-4 group-hover:max-h-48 group-hover:opacity-100 group-focus-visible:mt-4 group-focus-visible:max-h-48 group-focus-visible:opacity-100 max-md:mt-4 max-md:max-h-64 max-md:opacity-100">
                      {description}
                    </span>
                  </span>

                  <span className="inline-flex items-center text-xs font-black uppercase tracking-[0.18em] text-accent-blue transition group-hover:text-accent-cyan lg:justify-end">
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
