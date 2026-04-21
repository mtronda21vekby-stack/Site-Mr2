import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const copy = {
  en: {
    title: 'Terms of Service',
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
    metaTitle: 'Terms of Service | Planetlocksmiths',
    metaDescription:
      'Terms of service for Planetlocksmiths mobile automotive locksmith website and service request intake.',
  },
  es: {
    title: 'Términos del servicio',
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
    metaTitle: 'Términos del servicio | Planetlocksmiths',
    metaDescription:
      'Términos del servicio para el sitio y las solicitudes de Planetlocksmiths.',
  },
  ru: {
    title: 'Условия сервиса',
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
    metaTitle: 'Условия сервиса | Planetlocksmiths',
    metaDescription:
      'Условия сервиса для сайта и приема заявок Planetlocksmiths.',
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
  const meta = copy[locale]

  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    alternates: {
      canonical: `/${locale}/terms`,
    },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url: `/${locale}/terms`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.metaTitle,
      description: meta.metaDescription,
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
  const t = copy[locale]

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-4xl px-4 py-16 text-text sm:px-6 lg:px-8">
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-accent-cyan">
          Legal
        </p>
        <h1 className="mb-8 text-3xl font-heading font-semibold md:text-5xl">
          {t.title}
        </h1>
        <div className="space-y-8">
          {t.sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-2xl border border-line bg-surface p-6"
            >
              <h2 className="mb-2 text-xl font-semibold text-text">{section.heading}</h2>
              <p className="text-sm leading-7 text-muted">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
