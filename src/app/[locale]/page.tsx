import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import JsonLd from '@/components/seo/JsonLd'
import Hero from '@/components/hero/Hero'
import ServicesGrid from '@/components/sections/ServicesGrid'
import InsuranceTrustSection from '@/components/sections/InsuranceTrustSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import FaqSection from '@/components/sections/FaqSection'
import ContactSection from '@/components/sections/ContactSection'
import AreasShowcase from '@/components/sections/AreasShowcase'
import SiteGallery from '@/components/sections/SiteGallery'
import {
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
  getReviewsFromSource,
  getFaqFromSource,
  getServicesListFromSource,
  getAreasListFromSource,
} from '@/lib/content.server'
import { ACTIVE_LOCALES } from '@/lib/locales'

export const revalidate = 60

export async function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }))
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru' }>
}) {

  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'

  const [global, home, reviews, faq, services, areas] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
    getReviewsFromSource(locale),
    getFaqFromSource(locale),
    getServicesListFromSource(locale),
    getAreasListFromSource(locale),
  ])

  const featuredAreas = areas.slice(0, 6)
  const pageUrl = `${siteUrl}/${locale}`
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Locksmith',
      '@id': `${pageUrl}#business`,
      name: global.brandName,
      url: pageUrl,
      telephone: global.phoneDisplay,
      description: home.heroSubtitle,
      priceRange: '$$-$$$',
      areaServed: areas.map((area) => [area.city, area.state].filter(Boolean).join(', ')).filter(Boolean),
      openingHours: global.serviceHours,
      makesOffer: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.excerpt,
          url: `${siteUrl}/${locale}/services/${service.slug}`,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ]

  return (
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <JsonLd data={jsonLd} />
      <CinematicBackground />
      <Header
        locale={locale}
        brandName={global.brandName}
        logoUrl={global.logoUrl}
        logoAlt={global.logoAlt}
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

        <SiteGallery />
        <ServicesGrid services={services} locale={locale} />
        <InsuranceTrustSection locale={locale} />

        <AreasShowcase
          locale={locale}
          areas={featuredAreas}
          fallbackEyebrow="Service areas"
          fallbackTitle="Mobile locksmith coverage"
          fallbackText="Fast mobile service for customers across the primary coverage area. Select a city to view local service details."
          fallbackCta="View service areas"
        />

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
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
