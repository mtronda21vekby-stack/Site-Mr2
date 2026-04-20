import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { getGlobalSettings } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const copy = {
  en: {
    title: 'Terms of Service',
    metaTitle: 'Terms of Service | Planetlocksmiths',
    metaDescription:
      'Terms of service for Planetlocksmiths mobile automotive locksmith support in Philadelphia.',
    sections: [
      {
        heading: 'Service scope',
        body: 'Planetlocksmiths provides mobile automotive locksmith support. Service availability depends on location, request type, scheduling, and operational conditions.',
      },
      {
        heading: 'Estimates and pricing',
        body: 'Quotes and estimates may vary depending on vehicle type, key system, programming requirements, and on-site conditions.',
      },
      {
        heading: 'Appointment timing',
        body: 'Urgent and same-day service may be offered based on availability. No guaranteed arrival promise is made unless expressly confirmed.',
      },
      {
        heading: 'Customer responsibility',
        body: 'The customer is responsible for providing accurate contact information, service location, and vehicle details needed to review the request.',
      },
    ],
  },
  es: {
    title: 'Términos del servicio',
    metaTitle: 'Términos del Servicio | Planetlocksmiths',
    metaDescription:
      'Términos del servicio de Planetlocksmiths para soporte móvil de cerrajería automotriz en Filadelfia.',
    sections: [
      {
        heading: 'Alcance del servicio',
        body: 'Planetlocksmiths ofrece soporte móvil de cerrajería automotriz. La disponibilidad depende de ubicación, tipo de solicitud, agenda y condiciones operativas.',
      },
      {
        heading: 'Estimados y precios',
        body: 'Los estimados pueden variar según vehículo, sistema de llave, programación requerida y condiciones del lugar.',
      },
      {
        heading: 'Tiempo de atención',
        body: 'El servicio urgente o el mismo día puede ofrecerse según disponibilidad. No existe promesa garantizada de llegada salvo confirmación expresa.',
      },
      {
        heading: 'Responsabilidad del cliente',
        body: 'El cliente debe proporcionar información de contacto, ubicación y datos del vehículo correctos para revisar la solicitud.',
      },
    ],
  },
  ru: {
    title: 'Условия сервиса',
    metaTitle: 'Условия Сервиса | Planetlocksmiths',
    metaDescription:
      'Условия сервиса Planetlocksmiths для мобильной автомобильной ключной помощи в Филадельфии.',
    sections: [
      {
        heading: 'Объем сервиса',
        body: 'Planetlocksmiths оказывает мобильную автомобильную ключную помощь. Доступность зависит от локации, типа заявки, расписания и операционных условий.',
      },
      {
        heading: 'Оценка и стоимость',
        body: 'Стоимость может отличаться в зависимости от автомобиля, типа ключевой системы, необходимости программирования и условий на месте.',
      },
      {
        heading: 'Сроки приезда',
        body: 'Срочный и same-day сервис может быть доступен по возможности. Гарантированное время прибытия не обещается, если это отдельно не подтверждено.',
      },
      {
        heading: 'Ответственность клиента',
        body: 'Клиент обязан предоставить корректные контакты, точную локацию и данные автомобиля, необходимые для оценки заявки.',
      },
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
      canonical: `/${locale}/terms`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${locale}/terms`,
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

export default async function TermsPage({
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
          { name: page.title, url: `${siteUrl}/${locale}/terms` },
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
              <p className="premium-label mb-4">Legal</p>
              <h1 className="mb-8 text-3xl font-heading font-semibold text-text md:text-5xl">
                {page.title}
              </h1>
              <div className="grid gap-5">
                {page.sections.map((section) => (
                  <section key={section.heading} className="premium-card-soft p-5">
                    <h2 className="mb-2 text-lg font-semibold text-text">{section.heading}</h2>
                    <p className="text-sm leading-7 text-muted">{section.body}</p>
                  </section>
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
