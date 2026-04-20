import JsonLd from '@/components/seo/JsonLd'
import { getGlobalSettings, type Locale } from '@/lib/content'

interface LocalBusinessSchemaProps {
  locale: Locale
}

const descriptions: Record<Locale, string> = {
  en: 'Mobile automotive locksmith service across Philadelphia, including lockout help, key replacement, programming, and urgent mobile response.',
  es: 'Servicio móvil de cerrajería automotriz en Filadelfia, incluyendo aperturas, reemplazo de llaves, programación y respuesta urgente.',
  ru: 'Мобильный автомобильный ключной сервис по Филадельфии: вскрытие авто, замена ключей, программирование и срочная выездная помощь.',
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
      'Automotive locksmith',
      'Car lockout service',
      'Car key replacement',
      'Key programming',
      'Key fob service',
      'Emergency mobile locksmith service',
    ],
    image: [`${siteUrl}/opengraph-image`],
  }

  return <JsonLd data={data} />
}
