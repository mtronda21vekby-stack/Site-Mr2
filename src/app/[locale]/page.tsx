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
import { ACTIVE_LOCALES } from '@/lib/locales'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }))
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
    <div className="cinematic-shell min-h-screen">
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
          <section className="relative overflow-hidden bg-transparent py-20 sm:py-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_50%,rgba(77,162,255,0.1),transparent_26rem),radial-gradient(circle_at_84%_8%,rgba(214,168,95,0.08),transparent_22rem)]" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan">
                    Orbital coverage grid
                  </p>
                  <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">
                    Service Areas
                  </h2>
                </div>

                <a
                  href={`/${locale}/areas`}
                  className="inline-flex w-fit rounded-full border border-white/15 bg-white/[0.035] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-blue backdrop-blur-xl transition hover:border-accent-blue/50 hover:bg-accent-blue/10"
                >
                  View all →
                </a>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {featuredAreas.map((area, index) => (
                  <a
                    key={area.slug}
                    href={`/${locale}/areas/${area.slug}`}
                    className="group relative block overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-accent-blue/40 hover:bg-white/[0.06]"
                  >
                    <div className="absolute right-[-3rem] top-[-3rem] h-32 w-32 rounded-full border border-accent-blue/20 transition group-hover:border-accent-cyan/35" />
                    <div className="absolute bottom-[-4rem] left-[-4rem] h-32 w-32 rounded-full bg-accent-gold/10 blur-2xl" />

                    <div className="relative">
                      <p className="mb-5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent-gold">
                        Sector {String(index + 1).padStart(2, '0')}
                      </p>

                      <h3 className="text-xl font-semibold tracking-[-0.02em] text-text">
                        {area.title}
                      </h3>

                      <p className="mt-2 text-sm text-muted">
                        {[area.city, area.state].filter(Boolean).join(', ')}
                      </p>

                      <p className="mt-4 text-sm leading-7 text-muted">
                        {area.intro}
                      </p>

                      <span className="mt-6 inline-flex text-xs font-bold uppercase tracking-[0.18em] text-accent-blue transition group-hover:text-accent-cyan">
                        Open area page →
                      </span>
                    </div>
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
    </div>
  )
}
