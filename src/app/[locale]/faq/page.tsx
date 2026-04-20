import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings } from '@/lib/content'

const copy = {
  en: {
    title: 'Frequently Asked Questions',
    items: [
      {
        q: 'Do you provide service 24/7?',
        a: 'Yes. Planetlocksmiths operates as a mobile automotive locksmith service available 24/7.',
      },
      {
        q: 'Do you have a shop location?',
        a: 'At this time, service is mobile only.',
      },
      {
        q: 'Can you help with lost car keys?',
        a: 'Yes. We handle automotive key replacement and related programming services.',
      },
      {
        q: 'Do you work across Philadelphia?',
        a: 'Yes. Philadelphia is the primary service area.',
      },
      {
        q: 'Can I request urgent help?',
        a: 'Yes. Urgent and same-day requests are supported based on availability.',
      },
      {
        q: 'Do you work with modern car keys and fobs?',
        a: 'Yes. Automotive key and programming support is part of the service offering.',
      },
    ],
  },
  es: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Trabajan 24/7?',
        a: 'Sí. Planetlocksmiths ofrece servicio móvil de cerrajería automotriz las 24 horas.',
      },
      {
        q: '¿Tienen local físico?',
        a: 'Por ahora, el servicio es solo móvil.',
      },
      {
        q: '¿Pueden ayudar con llaves perdidas?',
        a: 'Sí. Hacemos reemplazo y programación de llaves automotrices.',
      },
      {
        q: '¿Atienden toda Filadelfia?',
        a: 'Sí. Filadelfia es la principal zona de servicio.',
      },
      {
        q: '¿Puedo pedir ayuda urgente?',
        a: 'Sí. Las solicitudes urgentes y el mismo día dependen de disponibilidad.',
      },
      {
        q: '¿Trabajan con llaves modernas y fobs?',
        a: 'Sí. La programación y soporte de llaves modernas forma parte del servicio.',
      },
    ],
  },
  ru: {
    title: 'Частые вопросы',
    items: [
      {
        q: 'Вы работаете 24/7?',
        a: 'Да. Planetlocksmiths — это мобильный автомобильный сервис, доступный 24/7.',
      },
      {
        q: 'У вас есть физическая точка?',
        a: 'Сейчас сервис работает только на выезд.',
      },
      {
        q: 'Вы можете помочь с утерянным ключом?',
        a: 'Да. Мы занимаемся заменой автомобильных ключей и программированием.',
      },
      {
        q: 'Вы работаете по всей Филадельфии?',
        a: 'Да. Филадельфия — основная зона обслуживания.',
      },
      {
        q: 'Можно оставить срочную заявку?',
        a: 'Да. Срочные и same-day заявки принимаются по возможности.',
      },
      {
        q: 'Вы работаете с современными ключами и брелоками?',
        a: 'Да. Поддержка современных ключей и брелоков входит в спектр услуг.',
      },
    ],
  },
} as const

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }, { locale: 'ru' }]
}

export default async function FaqPage({
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
        <div className="space-y-4">
          {t.items.map((item) => (
            <details
              key={item.q}
              className="rounded-lg border border-line bg-surface p-5"
            >
              <summary className="cursor-pointer list-none text-base font-medium text-text">
                {item.q}
              </summary>
              <p className="mt-3 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
