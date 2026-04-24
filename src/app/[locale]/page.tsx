import { unstable_noStore as noStore } from 'next/cache'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import JsonLd from '@/components/seo/JsonLd'
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
import AreasShowcase from '@/components/sections/AreasShowcase'
import {
  getContentBlocksFromSource,
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'

  const [global, home, reviews, faq, services, areas, blocks] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
    getReviewsFromSource(locale),
    getFaqFromSource(locale),
    getServicesListFromSource(locale),
    getAreasListFromSource(locale),
    getContentBlocksFromSource(locale, 'home'),
  ])

  const blockBySlot = new Map(blocks.map((block) => [block.slot, block]))
  const serviceDepthBlock = blockBySlot.get('service-depth')
  const customerInfoBlock = blockBySlot.get('customer-info')
  const areaSectionBlock = blockBySlot.get('area-section')
  const featuredAreas = areas.slice(0, 6)
  const pageUrl = `${siteUrl}/${locale}`
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'AutomotiveBusiness',
      '@id': `${pageUrl}#business`,
      name: global.brandName,
      url: pageUrl,
      telephone: global.phoneDisplay,
      description: home.heroSubtitle,
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
        <ServiceDepthSection
          locale={locale}
          services={services}
          eyebrow={serviceDepthBlock?.eyebrow || home.faqTitle}
          title={serviceDepthBlock?.title || home.emergencyTitle}
          intro={serviceDepthBlock?.body || home.emergencyText}
        />
        <CustomerInfoSection
          eyebrow={customerInfoBlock?.eyebrow || home.contactTitle}
          title={customerInfoBlock?.title || home.contactTitle}
          intro={customerInfoBlock?.body || home.contactText}
          services={services}
          faq={faq}
        />
        <WhyChoose items={home.whyChoose} />

        <EmergencyStrip
          title={home.emergencyTitle}
          text={home.emergencyText}
          phoneNumber={global.phonePrimary}
          phoneDisplay={global.phoneDisplay}
          locale={locale}
        />

        <AreasShowcase
          locale={locale}
          areas={featuredAreas}
          block={areaSectionBlock}
          fallbackEyebrow={home.contactTitle}
          fallbackTitle={home.heroSecondaryCta}
          fallbackText={home.contactText}
          fallbackCta={home.heroSecondaryCta}
        />

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
