import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings } from '@/lib/content'

const copy = {
  en: {
    title: 'About Planetlocksmiths',
    paragraphs: [
      'Planetlocksmiths is a mobile automotive locksmith service focused on fast, clear, and professional help across Philadelphia.',
      'We handle vehicle lockouts, lost key replacement, key programming, key fob support, and ignition-related key issues.',
      'Service is mobile-only. We come to your location and support urgent and same-day requests based on availability.',
    ],
  },
  es: {
    title: 'Sobre Planetlocksmiths',
    paragraphs: [
      'Planetlocksmiths es un servicio móvil de cerrajería automotriz enfocado en ayuda rápida, clara y profesional en Filadelfia.',
      'Atendemos aperturas de auto, reemplazo de llaves perdidas, programación, soporte para key fobs y problemas de encendido relacionados con llaves.',
      'El servicio es solo móvil. Vamos a tu ubicación y atendemos solicitudes urgentes y el mismo día según disponibilidad.',
    ],
  },
  ru: {
    title: 'О Planetlocksmiths',
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

export default async function AboutPage({
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
        <h1 className="mb-6 text-3xl font-heading font-semibold">{t.title}</h1>
        <div className="space-y-4 text-muted">
          {t.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
