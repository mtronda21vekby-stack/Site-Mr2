import type { Locale } from '@/components/layout/Header'
import type { ServiceContent } from '@/lib/content.server'

type ServiceDepthSectionProps = {
  locale: Locale
  services: ServiceContent[]
  eyebrow: string
  title: string
  intro: string
}

export default function ServiceDepthSection({ services, eyebrow, title, intro }: ServiceDepthSectionProps) {
  if (!services.length) return null

  return (
    <section className="relative bg-transparent py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-accent-gold">{eyebrow}</p>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="mt-5 text-base leading-8 text-muted">{intro}</p>
          </div>

          <div className="grid gap-4">
            {services.slice(0, 5).map((service, index) => {
              const detailText = service.intro || service.seoDescription || service.excerpt
              const details = detailText.split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 2)

              return (
                <article key={service.slug || service.title} className="premium-panel rounded-[1.35rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/30">
                  <div className="flex gap-4">
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-blue/25 bg-accent-blue/10 text-xs font-black text-accent-blue">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.025em] text-text">{service.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted">{service.excerpt || service.seoDescription}</p>
                      {details.length ? (
                        <ul className="mt-4 grid gap-2">
                          {details.map((detail) => (
                            <li key={detail} className="flex gap-3 text-sm leading-6 text-text/82">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
