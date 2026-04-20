import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { getGlobalSettings } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const copy = {
  en: {
    title: 'About Planetlocksmiths',
    metaTitle: 'About Planetlocksmiths | Mobile Automotive Locksmith in Philadelphia',
    metaDescription:
      'Learn about Planetlocksmiths, a mobile automotive locksmith service focused on Philadelphia lockouts, key replacement, programming, and urgent response.',
    paragraphs: [
      'Planetlocksmiths is a mobile automotive locksmith service focused on fast, clear, and professional help across Philadelphia.',
      'We handle vehicle lockouts, lost key replacement, key programming, key fob support, and ignition-related key issues.',
      'Service is mobile-only. We come to your location and support urgent and same-day requests based on availability.',
    ],
  },
  es: {
    title: 'Sobre Planetlocksmiths',
    metaTitle: 'Sobre Planetlocksmiths | Cerrajería Automotriz Móvil en Filadelfia',
    metaDescription:
      'Conoce Planetlocksmiths, un servicio móvil de cerrajería automotriz en Filadelfia enfocado en aperturas, reemplazo de llaves, programación y respuesta urgente.',
    paragraphs: [
      'Planetlocksmiths es un servicio móvil de cerrajería automotriz enfocado en ayuda rápida, clara y profesional en Filadelfia.',
      'Atendemos aperturas de auto, reemplazo de llaves perdidas, programación, soporte para key fobs y problemas de encendido relacionados con llaves.',
      'El servicio es solo móvil. Vamos a tu ubicación y atendemos solicitudes urgentes y el mismo día según disponibilidad.',
    ],
  },
  ru: {
    title: 'О Planetlocksmiths',
    metaTitle: 'О Planetlocksmiths | Мобильный Автомобильный Сервис в Филадельфии',
    metaDescription:
      'Узнайте о Planetlocksmiths — мобильном автомобильном ключном сервисе в Филадельфии: вскрытие авто, замена ключей, программирование и срочная помощь.',
    paragraphs: [
      'Planetlocksmiths — мобильный автомобильный ключной сервис с фокусом на быструю, понятную и профессиональную помощь по Филадельфии.',
      'Мы занимаемся открытием автомобилей, заменой утерянных ключей, программированием, работой с брелоками и проблемами ключей зажигания.',
      'Сервис работает только на выезд. Мы приезжаем к клиенту и берем срочные и same-day заявки по возможности.',
    ],
  },
} as const

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }, { locale: 'ru' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const page = copy[locale]

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/${locale}/about`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${locale}/about`,
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
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: ['/opengraph-image'],
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const global = getGlobalSettings()
  const page = copy[locale]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: `${siteUrl}/${locale}` },
          { name: page.title, url: `${siteUrl}/${locale}/about` },
        ]}
      />

      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />

      <main className="bg-bg py-16 md:py-20">
        <div className="section-frame">
          <div className="premium-shell px-6 py-8 md:px-8 md:py-10">
            <div className="max-w-4xl">
              <p className="premium-label mb-4">About the brand</p>
              <h1 className="mb-6 text-3xl font-heading font-semibold text-text md:text-5xl">
                {page.title}
              </h1>

              <div className="grid gap-4">
                {page.paragraphs.map((paragraph) => (
                  <div key={paragraph} className="premium-card-soft p-5">
                    <p className="text-sm leading-7 text-muted md:text-[15px]">
                      {paragraph}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
