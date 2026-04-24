import { unstable_noStore as noStore } from 'next/cache'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import Hero from '@/components/hero/Hero'
import ServicesGrid from '@/components/sections/ServicesGrid'
import WhyChoose from '@/components/sections/WhyChoose'
import EmergencyStrip from '@/components/sections/EmergencyStrip'
import ReviewsSection from '@/components/sections/ReviewsSection'
import FaqSection from '@/components/sections/FaqSection'
import ContactSection from '@/components/sections/ContactSection'
import CustomerInfoSection from '@/components/sections/CustomerInfoSection'
import ServiceDepthSection from '@/components/sections/ServiceDepthSection'
import ConversionRail from '@/components/sections/ConversionRail'
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
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

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

        <ConversionRail locale={locale} global={global} home={home} />
        <ServicesGrid services={services} locale={locale} />
        <ServiceDepthSection locale={locale} />
        <CustomerInfoSection locale={locale} />
        <WhyChoose items={home.whyChoose} />

        <EmergencyStrip
          title={home.emergencyTitle}
          text={home.emergencyText}
          phoneNumber={global.phonePrimary}
          phoneDisplay={global.phoneDisplay}
          locale={locale}
        />

        {featuredAreas.length ? (
          <section className="relative overflow-hidden bg-transparent py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent-cyan">Local service coverage</p>
                  <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">Service Areas</h2>
                  <p className="mt-4 text-sm leading-7 text-muted">Mobile automotive locksmith service is organized by local coverage pages so customers can understand where service is available and what support is offered.</p>
                </div>
                <a href={`/${locale}/areas`} className="inline-flex w-fit rounded-full border border-white/15 bg-white/[0.035] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-accent-blue backdrop-blur-xl transition hover:border-accent-blue/50 hover:bg-accent-blue/10">View all →</a>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {featuredAreas.map((area, index) => (
                  <a key={area.slug} href={`/${locale}/areas/${area.slug}`} className="group relative block overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-accent-blue/40 hover:bg-white/[0.06]">
                    <div className="absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full border border-accent-blue/20" />
                    <div className="relative">
                      <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent-gold">Area {String(index + 1).padStart(2, '0')}</p>
                      <h3 className="text-xl font-semibold tracking-[-0.02em] text-text">{area.title}</h3>
                      <p className="mt-2 text-sm text-muted">{[area.city, area.state].filter(Boolean).join(', ')}</p>
                      <p className="mt-4 text-sm leading-7 text-muted">{area.intro}</p>
                      <span className="mt-5 inline-flex text-xs font-bold uppercase tracking-[0.16em] text-accent-blue transition group-hover:text-accent-cyan">Open area page →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <ReviewsSection title={home.reviewsTitle} items={reviews} />
        <FaqSection title={home.faqTitle} items={faq} />

        <ConversionRail locale={locale} global={global} home={home} />

        <ContactSection
          title={home.contactTitle}
          text={home.contactText}
          phoneNumber={global.phonePrimary}
          phoneDisplay={global.phoneDisplay}
          locale={locale}
        />
      </main>

      <Footer locale={locale} />
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
