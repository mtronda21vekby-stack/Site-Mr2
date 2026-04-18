import type { Metadata } from 'next'
import Link from 'next/link'

const content = {
  en: {
    heroTitle: 'Automotive Locksmith Service Across Philadelphia — 24/7',
    heroSubtitle:
      'Locked out, dealing with a lost key, or need a replacement programmed? Planetlocksmiths provides mobile automotive locksmith service across Philadelphia with urgent and same-day availability.',
    primaryCta: 'Call Now',
    secondaryCta: 'Request Service'
  },
  es: {
    heroTitle: 'Servicio de Cerrajería Automotriz en Filadelfia — 24/7',
    heroSubtitle:
      'Si no puedes abrir tu auto, perdiste la llave o necesitas una llave nueva con programación, Planetlocksmiths ofrece servicio móvil automotriz en toda Filadelfia con atención urgente y el mismo día.',
    primaryCta: 'Llamar ahora',
    secondaryCta: 'Solicitar servicio'
  },
  ru: {
    heroTitle: 'Автомобильный ключной сервис по Филадельфии — 24/7',
    heroSubtitle:
      'Если машина закрыта, ключ потерян или нужен новый ключ с программированием, Planetlocksmiths выезжает по Филадельфии и помогает с автомобильными ключами и замками в срочном и same-day формате.',
    primaryCta: 'Позвонить',
    secondaryCta: 'Заказать услугу'
  }
} as const

type Params = {
  locale: keyof typeof content
}

export function generateStaticParams() {
  return Object.keys(content).map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Planetlocksmiths',
  description: 'Mobile automotive locksmith service in Philadelphia'
}

export default function LocalePage({ params }: { params: Params }) {
  const { locale } = params
  const data = content[locale] || content.en
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-bg">
      <h1 className="text-4xl md:text-5xl font-heading mb-4 text-white">
        {data.heroTitle}
      </h1>
      <p className="max-w-3xl text-lg md:text-xl text-muted mb-8">
        {data.heroSubtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="tel:+12155555555"
          className="inline-block px-6 py-3 rounded-full bg-accent-blue text-black font-medium"
        >
          {data.primaryCta}
        </a>
        <Link
          href={`/${locale}/contact`}
          className="inline-block px-6 py-3 rounded-full border border-accent-blue text-accent-blue"
        >
          {data.secondaryCta}
        </Link>
      </div>
    </main>
  )
}