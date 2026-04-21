import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const copy = {
  en: {
    title: 'About Planetlocksmiths',
    paragraphs: [
      'Planetlocksmiths is a mobile automotive locksmith service focused on fast, clear, and professional help across Philadelphia.',
      'We handle vehicle lockouts, lost key replacement, key programming, key fob support, and ignition-related key issues.',
      'Service is mobile-only. We come to your location and support urgent and same-day requests based on availability.',
    ],
    metaTitle: 'About Planetlocksmiths | Automotive Locksmith in Philadelphia',
    metaDescription:
      'Learn more about Planetlocksmiths, a mobile automotive locksmith service focused on Philadelphia lockouts, key replacement, programming, and urgent support.',
  },
  es: {
    title: 'Sobre Planetlocksmiths',
    paragraphs: [
      'Planetlocksmiths es un servicio móvil de cerrajería automotriz enfocado en ayuda rápida, clara y profesional en Filadelfia.',
      'Atendemos aperturas de auto, reemplazo de llaves perdidas, programación, soporte para key fobs y problemas de encendido relacionados con llaves.',
      'El servicio es solo móvil. Vamos a tu ubicación y atendemos solicitudes urgentes y el mismo día según disponibilidad.',
    ],
    metaTitle: 'Sobre Planetlocksmiths | Cerrajería automotriz en Filadelfia',
    metaDescription:
      'Conoce Planetlocksmiths, servicio móvil de cerrajería automotriz en Filadelfia para aperturas, reemplazo de llaves, programación y soporte urgente.',
  },
  ru: {
    title: 'О Planetlocksmiths',
    paragraphs: [
      'Planetlocksmiths — мобильный автомобильный ключной сервис с фокусом на быструю, понятную и профессиональную помощь по Филадельфии.',
      'Мы занимаемся открытием автомобилей, заменой утерянных ключей, программированием, работой с брелоками и проблемами ключей зажигания.',
      'Сервис работает только на выезд. Мы приезжаем к клиенту и берем срочные и same-day заявки по возможности.',
    ],
    metaTitle: 'О Planetlocksmiths | Автомобильный сервис в Филадельфии',
    metaDescription:
      'Узнайте больше о Planetlocksmiths — мобильном автомобильном ключном сервисе по Филадельфии: вскрытие авто, замена ключей, программирование и срочная помощь.',
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
      canonical: `/${locale}/about`,
    },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url: `/${locale}/about`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.metaTitle,
      description: meta.metaDescription,
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
          Brand overview
        </p>
        <h1 className="mb-6 text-3xl font-heading font-semibold md:text-5xl">
          {t.title}
        </h1>
        <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 md:p-8">
          {t.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-7 text-muted md:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
