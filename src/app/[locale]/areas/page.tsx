import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const copy = {
  en: {
    title: 'Service Areas',
    intro:
      'Planetlocksmiths provides mobile automotive locksmith support across Philadelphia. Additional service areas can be added as the operation expands.',
    cityTitle: 'Philadelphia, PA',
    cityText:
      'Primary service area for mobile lockout help, key replacement, programming, and urgent automotive locksmith support.',
    cta: 'View area page',
    metaTitle: 'Service Areas in Philadelphia | Planetlocksmiths',
    metaDescription:
      'Mobile automotive locksmith coverage in Philadelphia, PA. Lockout help, key replacement, programming, and urgent automotive service.',
  },
  es: {
    title: 'Zonas de servicio',
    intro:
      'Planetlocksmiths ofrece servicio móvil de cerrajería automotriz en Filadelfia. Se pueden añadir más zonas en el futuro.',
    cityTitle: 'Filadelfia, PA',
    cityText:
      'Zona principal de servicio para aperturas, reemplazo de llaves, programación y ayuda automotriz urgente.',
    cta: 'Ver zona',
    metaTitle: 'Zonas de servicio en Filadelfia | Planetlocksmiths',
    metaDescription:
      'Cobertura móvil de cerrajería automotriz en Filadelfia, PA. Aperturas, reemplazo de llaves, programación y ayuda urgente.',
  },
  ru: {
    title: 'Районы обслуживания',
    intro:
      'Planetlocksmiths оказывает мобильный автомобильный сервис по Филадельфии. В будущем можно добавить новые зоны.',
    cityTitle: 'Филадельфия, PA',
    cityText:
      'Основная зона обслуживания для вскрытия авто, замены ключей, программирования и срочной мобильной помощи.',
    cta: 'Открыть страницу района',
    metaTitle: 'Районы обслуживания в Филадельфии | Planetlocksmiths',
    metaDescription:
      'Покрытие мобильного автомобильного сервиса в Филадельфии, PA. Вскрытие авто, замена ключей, программирование и срочная помощь.',
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
      canonical: `/${locale}/areas`,
    },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url: `/${locale}/areas`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.metaTitle,
      description: meta.metaDescription,
    },
  }
}

export default async function ServiceAreasPage({
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
      <main className="mx-auto max-w-5xl px-4 py-16 text-text sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-heading font-semibold">{t.title}</h1>
        <p className="mb-8 max-w-3xl text-muted">{t.intro}</p>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-line bg-surface p-6">
            <h2 className="mb-3 text-xl font-semibold text-text">{t.cityTitle}</h2>
            <p className="mb-5 text-sm leading-6 text-muted">{t.cityText}</p>
            <Link
              href={`/${locale}/areas/philadelphia`}
              className="text-sm font-medium text-accent-blue underline"
            >
              {t.cta}
            </Link>
          </article>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
