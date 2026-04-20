import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/hero/Hero'
import ServicesGrid from '@/components/sections/ServicesGrid'
import WhyChoose from '@/components/sections/WhyChoose'
import EmergencyStrip from '@/components/sections/EmergencyStrip'
import ReviewsSection from '@/components/sections/ReviewsSection'
import FaqSection from '@/components/sections/FaqSection'
import ContactSection from '@/components/sections/ContactSection'
import TrustStrip from '@/components/sections/TrustStrip'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
import FAQSchema from '@/components/seo/FAQSchema'
import { getGlobalSettings, getHomeContent, getReviews, getFaq } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const metaCopy: Record<
  Locale,
  {
    title: string
    description: string
  }
> = {
  en: {
    title: 'Automotive Locksmith in Philadelphia, PA | Planetlocksmiths',
    description:
      'Mobile automotive locksmith service in Philadelphia. Car lockout help, key replacement, and key programming available 24/7.',
  },
  es: {
    title: 'Cerrajería Automotriz en Filadelfia, PA | Planetlocksmiths',
    description:
      'Servicio móvil de cerrajería automotriz en Filadelfia. Aperturas, reemplazo de llaves y programación disponibles 24/7.',
  },
  ru: {
    title: 'Автомобильный ключной сервис в Филадельфии, PA | Planetlocksmiths',
    description:
      'Мобильный автомобильный ключной сервис в Филадельфии. Открытие авто, замена ключей и программирование доступны 24/7.',
  },
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'ru' },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = metaCopy[locale] || metaCopy.en

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${locale}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${locale}`,
      type: 'website',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'Planetlocksmiths',
        },
      ],
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      card: 'summary_large_image',
      images: ['/opengraph-image'],
    },
  }
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const home = getHomeContent(locale)
  const global = getGlobalSettings()
  const reviews = getReviews(locale)
  const faqs = getFaq(locale)

  return (
    <>
      <LocalBusinessSchema locale={locale} />
      <FAQSchema items={faqs} />

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

        <TrustStrip locale={locale} />

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
