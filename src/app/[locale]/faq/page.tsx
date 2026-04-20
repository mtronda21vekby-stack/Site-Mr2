import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import FAQSchema from '@/components/seo/FAQSchema'
import { getGlobalSettings } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const copy = {
  en: {
    title: 'Frequently Asked Questions',
    metaTitle: 'FAQ | Planetlocksmiths Philadelphia Automotive Locksmith',
    metaDescription:
      'Common questions about Planetlocksmiths mobile automotive locksmith service in Philadelphia, including 24/7 requests, service area, and key support.',
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
    metaTitle: 'FAQ | Planetlocksmiths Cerrajería Automotriz en Filadelfia',
    metaDescription:
      'Preguntas frecuentes sobre Planetlocksmiths, servicio móvil de cerrajería automotriz en Filadelfia.',
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
    metaTitle: 'FAQ | Planetlocksmiths Автомобильный Сервис в Филадельфии',
    metaDescription:
      'Частые вопросы о Planetlocksmiths — мобильном автомобильном ключном сервисе в Филадельфии.',
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
      canonical: `/${locale}/faq`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${locale}/faq`,
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

export default async function FaqPage({
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
          { name: page.title, url: `${siteUrl}/${locale}/faq` },
        ]}
      />
      <FAQSchema
        items={page.items.map((item) => ({
          question: item.q,
          answer: item.a,
        }))}
      />

      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />

      <main className="bg-bg py-16 md:py-20">
        <div className="section-frame">
          <div className="max-w-4xl">
            <p className="premium-label mb-4">FAQ</p>
            <h1 className="mb-6 text-3xl font-heading font-semibold text-text md:text-5xl">
              {page.title}
            </h1>

            <div className="grid gap-4">
              {page.items.map((item, idx) => (
                <details
                  key={`${item.q}-${idx}`}
                  className="premium-card-soft group overflow-hidden p-5 md:p-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                    <span className="text-base font-semibold text-text md:text-lg">
                      {item.q}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-text transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="mt-4 h-px w-full bg-white/10" />
                  <p className="pt-4 text-sm leading-7 text-muted md:text-[15px]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
