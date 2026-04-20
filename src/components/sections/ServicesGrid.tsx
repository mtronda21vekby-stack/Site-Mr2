import Link from 'next/link'
import type { Locale } from '@/components/layout/Header'

interface Service {
  title: string
  excerpt: string
  slug: string
}

export default function ServicesGrid({
  services,
  locale,
}: {
  services: Service[]
  locale: Locale
}) {
  return (
    <section className="py-18 bg-surface/40 md:py-24">
      <div className="section-frame">
        <div className="mb-10 max-w-3xl">
          <p className="premium-label mb-4">Service scope</p>
          <h2 className="section-title mb-4">Automotive locksmith services</h2>
          <p className="section-copy">
            Structured for real-world request flow: lockouts, replacement, programming,
            fobs, ignition-related issues, and urgent mobile response.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/${locale}/services/${service.slug}`}
              className="premium-card group flex min-h-[260px] flex-col justify-between p-6 md:p-7"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-accent-cyan">
                  <span className="text-sm font-semibold">
                    {service.title
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-semibold text-text">{service.title}</h3>
                <p className="text-sm leading-7 text-muted">{service.excerpt}</p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm font-medium text-accent-blue">Open service page</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-text transition group-hover:border-accent-blue/40 group-hover:text-accent-cyan">
                  View
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
