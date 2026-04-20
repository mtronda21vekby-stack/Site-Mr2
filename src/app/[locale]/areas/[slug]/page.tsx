import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import ServiceSchema from '@/components/seo/ServiceSchema'
import { getGlobalSettings } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const areaCopy: Record<
  Locale,
  Record<
    string,
    {
      title: string
      intro: string
      highlights: string[]
      closing: string
      highlightsLabel: string
    }
  >
> = {
  en: {
    philadelphia: {
      title: 'Automotive Locksmith Service in Philadelphia',
      intro:
        'Philadelphia is the primary service area for Planetlocksmiths mobile automotive locksmith support.',
      highlights: [
        'Mobile lockout help across Philadelphia.',
        'Support for lost keys, damaged keys, programming, and key fob issues.',
        'Urgent and same-day requests may be available based on workload.',
      ],
      closing:
        'When requesting service, include your location, vehicle make and model, and the issue you need help with.',
      highlightsLabel: 'Area coverage highlights',
    },
  },
  es: {
    philadelphia: {
      title: 'Cerrajería automotriz en Filadelfia',
      intro:
        'Filadelfia es la principal zona de servicio para Planetlocksmiths y su soporte móvil automotriz.',
      highlights: [
        'Apertura móvil de autos en Filadelfia.',
        'Soporte para llaves perdidas, llaves dañadas, programación y problemas con key fobs.',
        'Las solicitudes urgentes y el mismo día dependen de disponibilidad.',
      ],
      closing:
        'Al solicitar servicio, incluye ubicación, marca y modelo del vehículo y el problema principal.',
      highlightsLabel: 'Cobertura del área',
    },
  },
  ru: {
    philadelphia: {
      title: 'Автомобильный ключной сервис по Филадельфии',
      intro:
        'Филадельфия — основная зона работы Planetlocksmiths и мобильной автомобильной помощи.',
      highlights: [
        'Выездное открытие автомобилей по Филадельфии.',
        'Помощь с утерянными ключами, поврежденными ключами, программированием и брелоками.',
        'Срочные и same-day заявки зависят от текущей загрузки.',
      ],
      closing:
        'При обращении укажи локацию, марку и модель автомобиля и опиши основную проблему.',
      highlightsLabel: 'Покрытие и преимущества',
    },
  },
}

export async function generateStaticParams() {
  const locales: Array<Locale> = ['en', 'es', 'ru']
  return locales.map((locale) => ({ locale, slug: 'philadelphia' }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const area = areaCopy[locale]?.[slug]

  const title = area?.title || 'Service Area'
  const description =
    area?.intro || 'Mobile automotive locksmith coverage information for Philadelphia.'

  return {
    title: `${title} | Planetlocksmiths`,
    description,
    alternates: {
      canonical: `/${locale}/areas/${slug}`,
    },
    openGraph: {
      title: `${title} | Planetlocksmiths`,
      description,
      url: `/${locale}/areas/${slug}`,
      type: 'article',
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
      title: `${title} | Planetlocksmiths`,
      description,
      images: ['/opengraph-image'],
    },
  }
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const global = getGlobalSettings()
  const area = areaCopy[locale]?.[slug]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const areaUrl = `${siteUrl}/${locale}/areas/${slug}`

  return (
    <>
      {area ? (
        <>
          <BreadcrumbSchema
            items={[
              { name: 'Home', url: `${siteUrl}/${locale}` },
              { name: 'Areas', url: `${siteUrl}/${locale}/areas` },
              { name: area.title, url: areaUrl },
            ]}
          />
          <ServiceSchema
            name={area.title}
            description={area.intro}
            url={areaUrl}
            areaServed="Philadelphia"
          />
        </>
      ) : null}

      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />

      <main className="bg-bg py-16 md:py-20">
        <div className="section-frame">
          <div className="premium-shell px-6 py-8 md:px-8 md:py-10">
            {area ? (
              <div className="max-w-4xl">
                <p className="premium-label mb-4">Service area</p>
                <h1 className="mb-4 text-3xl font-heading font-semibold text-text md:text-5xl">
                  {area.title}
                </h1>
                <p className="mb-8 max-w-3xl text-sm leading-7 text-muted md:text-base">
                  {area.intro}
                </p>

                <div className="premium-card-soft mb-8 p-6">
                  <h2 className="mb-4 text-xl font-semibold text-text">
                    {area.highlightsLabel}
                  </h2>
                  <ul className="space-y-3 text-sm leading-7 text-muted">
                    {area.highlights.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-accent-blue" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="premium-card-soft p-5">
                  <p className="text-sm leading-7 text-muted">{area.closing}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted">Area not found.</p>
            )}
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
