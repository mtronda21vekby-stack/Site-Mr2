import { unstable_noStore as noStore } from 'next/cache'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/hero/Hero'
import ServicesGrid from '@/components/sections/ServicesGrid'
import WhyChoose from '@/components/sections/WhyChoose'
import EmergencyStrip from '@/components/sections/EmergencyStrip'
import ReviewsSection from '@/components/sections/ReviewsSection'
import FaqSection from '@/components/sections/FaqSection'
import ContactSection from '@/components/sections/ContactSection'
import {
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
  getReviewsFromSource,
  getFaqFromSource,
  getServicesListFromSource,
  getAreasListFromSource,
} from '@/lib/content.server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'ru' },
  ]
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru' }>
}) {
  noStore()

  const { locale } = await params

  const [global, home, reviews, faq, services, areas] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
    getReviewsFromSource(locale),
    getFaqFromSource(locale),
    getServicesListFromSource(locale),
    getAreasListFromSource(locale),
  ])

  const featuredAreas = areas.slice(0, 6)

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />

      <main className="flex flex-col">
        <Hero
          title={home.heroTitle}
          subtitle={home.heroSubtitle}
          badges={home.heroBadges}
          primaryCtaLabel={home.heroPrimaryCta}
          primaryCtaHref={`tel:${global.phonePrimary}`}
          secondaryCtaLabel={home.heroSecondaryCta}
          secondaryCtaHref={`/${locale}/services`}
        />

        <ServicesGrid services={services} locale={locale} />

        <WhyChoose items={home.whyChoose} />

        <EmergencyStrip
          title={home.emergencyTitle}
          text={home.emergencyText}
          phoneNumber={global.phonePrimary}
          phoneDisplay={global.phoneDisplay}
          locale={locale}
        />

        {featuredAreas.length ? (
          <section className="bg-surface py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.24em] text-muted">
                    Coverage
                  </p>
                  <h2 className="text-2xl font-heading font-semibold text-text sm:text-3xl">
                    Service Areas
                  </h2>
                </div>

                <a
                  href={`/${locale}/areas`}
                  className="text-sm font-semibold text-[var(--accent-blue)]"
                >
                  View all →
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {featuredAreas.map((area) => (
                  <a
                    key={area.slug}
                    href={`/${locale}/areas/${area.slug}`}
                    className="block rounded-2xl border border-white/10 bg-bg/60 p-5 transition hover:border-white/20 hover:bg-white/5"
                  >
                    <h3 className="text-xl font-heading font-semibold text-text">
                      {area.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted">
                      {[area.city, area.state].filter(Boolean).join(', ')}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-muted">
                      {area.intro}
                    </p>

                    <span className="mt-4 inline-flex text-sm font-semibold text-[var(--accent-blue)]">
                      Open area page →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <ReviewsSection title={home.reviewsTitle} items={reviews} />

        <FaqSection title={home.faqTitle} items={faq} />

        <ContactSection
          title={home.contactTitle}
          text={home.contactText}
          phoneNumber={global.phonePrimary}
          phoneDisplay={global.phoneDisplay}
          locale={locale}
        />
      </main>

      <Footer locale={locale} />
    </>
  )
}
