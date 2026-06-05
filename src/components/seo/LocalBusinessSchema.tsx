import JsonLd from '@/components/seo/JsonLd'
import { getGlobalSettings, type Locale } from '@/lib/content'

interface LocalBusinessSchemaProps {
  locale: Locale
}

const descriptions: Record<Locale, string> = {
  en: 'Mobile locksmith service across Philadelphia, including emergency lockouts, car keys, rekeys, lock repair, commercial locks, residential locks, access control, safe opening, and urgent mobile response.',
  es: 'Servicio móvil de cerrajería en Filadelfia, incluyendo bloqueos, llaves de auto, rekeys, reparación, comercial, residencial, access control, cajas fuertes y respuesta urgente.',
  ru: 'Мобильный locksmith-сервис по Филадельфии: lockout, авто-ключи, rekey, ремонт замков, commercial/residential, access control, safe opening и срочная выездная помощь.',
}

const languageMap: Record<Locale, string> = {
  en: 'English',
  es: 'Spanish',
  ru: 'Russian',
}

export default function LocalBusinessSchema({
  locale,
}: LocalBusinessSchemaProps) {
  const global = getGlobalSettings()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const data = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Locksmith'],
    name: global.brandName,
    url: siteUrl,
    telephone: global.phonePrimary,
    email: global.email || undefined,
    description: descriptions[locale],
    areaServed: [
      {
        '@type': 'City',
        name: global.primaryCity,
      },
      {
        '@type': 'State',
        name: global.primaryState,
      },
    ],
    availableLanguage: global.supportedLocales.map((item) => languageMap[item]),
    serviceType: [
      'Emergency locksmith service',
      'Automotive locksmith',
      'Car lockout service',
      'Residential locksmith',
      'Commercial locksmith',
      'Rekey service',
      'Lock repair',
      'Lock replacement',
      'Access control service',
      'Safe opening',
      'Key programming',
      'Key fob service',
    ],
    image: [`${siteUrl}/opengraph-image`],
  }

  return <JsonLd data={data} />
}
