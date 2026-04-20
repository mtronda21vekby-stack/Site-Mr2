import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings, getHomeContent } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const copy = {
  en: {
    title: 'Automotive Locksmith Services',
    intro:
      'Planetlocksmiths provides mobile automotive locksmith support across Philadelphia, including lockout help, key replacement, programming, and urgent mobile response.',
    cta: 'Learn more',
    metaTitle: 'Automotive Locksmith Services in Philadelphia | Planetlocksmiths',
    metaDescription:
      'Mobile automotive locksmith services in Philadelphia, including car lockout help, key replacement, key programming, and urgent mobile service.',
  },
  es: {
    title: 'Servicios de cerrajería automotriz',
    intro:
      'Planetlocksmiths ofrece servicio móvil de cerrajería automotriz en Filadelfia, incluyendo aperturas, reemplazo de llaves, programación y asistencia urgente.',
    cta: 'Ver más',
    metaTitle: 'Servicios de cerrajería automotriz en Filadelfia | Planetlocksmiths',
    metaDescription:
      'Servicios móviles de cerrajería automotriz en Filadelfia: aperturas, reemplazo de llaves, programación y asistencia urgente.',
  },
  ru: {
    title: 'Автомобильные ключные услуги',
    intro:
      'Planetlocksmiths оказывает мобильные автомобильные ключные услуги по Филадельфии: вскрытие авто, замена ключей, программирование и срочный выезд.',
    cta: 'Подробнее',
    metaTitle: 'Автомобильные ключные услуги в Филадельфии | Planetlocksmiths',
    metaDescription:
      'Мобильные автомобильные ключные услуги в Филадельфии: вскрытие авто, замена ключей, программирование и срочная помощь.',
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
      canonical: `/${locale}/services`,
    },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url: `/${locale}/services`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.metaTitle,
      description: meta.metaDescription,
    },
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const global = getGlobalSettings()
  const home = getHomeContent(locale)
  const t = copy[locale]

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-6xl px-4 py-16 text-text sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-heading font-semibold">{t.title}</h1>
        <p className="mb-8 max-w-3xl text-muted">{t.intro}</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {home.featuredServices.map((service) => (
            <article
              key={service.slug}
              className="rounded-xl border border-line bg-surface p-6"
            >
              <h2 className="mb-3 text-xl font-semibold text-text">{service.title}</h2>
              <p className="mb-5 text-sm leading-6 text-muted">{service.excerpt}</p>
              <Link
                href={`/${locale}/services/${service.slug}`}
                className="text-sm font-medium text-accent-blue underline"
              >
                {t.cta}
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
