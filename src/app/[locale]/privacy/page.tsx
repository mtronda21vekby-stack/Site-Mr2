import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings } from '@/lib/content'

const copy = {
  en: {
    title: 'Privacy Policy',
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

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru' }>
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
        <h1 className="mb-8 text-3xl font-heading font-semibold">{t.title}</h1>
        <div className="space-y-8">
          {t.sections.map((section) => (
            <section key={section.heading}>
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
