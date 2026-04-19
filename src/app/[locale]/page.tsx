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
  getGlobalSettings,
  getHomeContent,
  getReviews,
  getFaq,
} from '@/lib/content'

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
  const { locale } = await params
  const home = getHomeContent(locale)
  const global = getGlobalSettings()
  const reviews = getReviews(locale)
  const faqs = getFaq(locale)

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
          secondaryCtaHref={`/${locale}/contact`}
        />

        <ServicesGrid services={home.featuredServices} locale={locale} />

        <WhyChoose items={home.whyChoose} />

        <EmergencyStrip
          title={home.emergencyTitle}
          text={home.emergencyText}
          phoneNumber={global.phonePrimary}
          phoneDisplay={global.phoneDisplay}
          locale={locale}
        />

        <ReviewsSection title={home.reviewsTitle} items={reviews} />

        <FaqSection title={home.faqTitle} items={faqs} />

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
