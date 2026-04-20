import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { getGlobalSettings } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const copy = {
  en: {
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy | Planetlocksmiths',
    metaDescription:
      'Privacy policy for Planetlocksmiths, including how contact form and service request information may be used.',
    sections: [
      {
        heading: 'Information you submit',
        body: 'When you use the contact form, we may collect your name, phone number, requested service, vehicle details, location, and message.',
      },
      {
        heading: 'How information is used',
        body: 'Submitted information is used to respond to your request, provide service, and communicate about automotive locksmith support.',
      },
      {
        heading: 'No unnecessary collection',
        body: 'We only collect information reasonably needed to review and respond to your service request.',
      },
      {
        heading: 'Third-party tools',
        body: 'If the site later connects to email, messaging, analytics, or CRM tools, those tools may process submitted data strictly for communication and service operations.',
      },
    ],
  },
  es: {
    title: 'Política de privacidad',
    metaTitle: 'Política de Privacidad | Planetlocksmiths',
    metaDescription:
      'Política de privacidad de Planetlocksmiths para solicitudes de servicio y datos enviados por formulario.',
    sections: [
      {
        heading: 'Información enviada',
        body: 'Cuando usas el formulario, podemos recibir tu nombre, teléfono, servicio solicitado, datos del vehículo, ubicación y mensaje.',
      },
      {
        heading: 'Uso de la información',
        body: 'La información enviada se usa para responder a tu solicitud, coordinar servicio y comunicarnos sobre ayuda automotriz.',
      },
      {
        heading: 'Sin recopilación innecesaria',
        body: 'Solo recopilamos la información razonablemente necesaria para revisar y responder a tu solicitud.',
      },
      {
        heading: 'Herramientas de terceros',
        body: 'Si el sitio más adelante conecta correo, mensajería, analítica o CRM, esos servicios podrán procesar la información solo para comunicación y operación del servicio.',
      },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности',
    metaTitle: 'Политика Конфиденциальности | Planetlocksmiths',
    metaDescription:
      'Политика конфиденциальности Planetlocksmiths для заявок на сервис и данных, отправленных через форму.',
    sections: [
      {
        heading: 'Какие данные вы отправляете',
        body: 'При использовании формы мы можем получать имя, телефон, нужную услугу, данные автомобиля, локацию и сообщение.',
      },
      {
        heading: 'Как используются данные',
        body: 'Отправленные данные используются для ответа на заявку, согласования сервиса и коммуникации по автомобильной ключной помощи.',
      },
      {
        heading: 'Без лишнего сбора',
        body: 'Мы собираем только ту информацию, которая разумно нужна для обработки и ответа на заявку.',
      },
      {
        heading: 'Сторонние сервисы',
        body: 'Если сайт позже будет подключен к email, мессенджерам, аналитике или CRM, такие сервисы смогут обрабатывать данные только для связи и обслуживания заявки.',
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
      canonical: `/${locale}/privacy`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${locale}/privacy`,
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

export default async function PrivacyPage({
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
          { name: page.title, url: `${siteUrl}/${locale}/privacy` },
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
