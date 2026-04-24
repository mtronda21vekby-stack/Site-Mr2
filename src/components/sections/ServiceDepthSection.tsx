import type { Locale } from '@/components/layout/Header'
import type { ServiceContent } from '@/lib/content.server'

type ServiceDepthSectionProps = {
  locale: Locale
  services: ServiceContent[]
  eyebrow: string
  title: string
  intro: string
}

export default function ServiceDepthSection({
  services,
  eyebrow,
  title,
  intro,
}: ServiceDepthSectionProps) {
  if (!services.length) return null

  return (
    <section className="relative overflow-hidden bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-gold">{eyebrow}</p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-5 text-base leading-8 text-muted">{intro}</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {services.slice(0, 6).map((service, index) => {
            const detailText = service.intro || service.seoDescription || service.excerpt
            const details = detailText
              .split('\n')
              .map((item) => item.trim())
              .filter(Boolean)
              .slice(0, 3)

            return (
              <article key={service.slug || service.title} className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl sm:p-6">
                <div className="absolute right-[-2.5rem] top-[-2.5rem] h-28 w-28 rounded-full border border-accent-blue/20" />
                <div className="relative">
                  <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent-cyan">Service {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-text">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{service.excerpt || service.seoDescription}</p>
                  {details.length ? (
                    <ul className="mt-5 grid gap-2">
                      {details.map((detail) => (
                        <li key={detail} className="flex gap-3 text-sm leading-6 text-text/85">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
