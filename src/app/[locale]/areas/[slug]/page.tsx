import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import JsonLd from '@/components/seo/JsonLd'
import ContactSection from '@/components/sections/ContactSection'
import FaqSection from '@/components/sections/FaqSection'
import {
  getAreaPageFromSource,
  getFaqFromSource,
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const labels: Record<Locale, {
  eyebrow: string
  overview: string
  customerPrep: string
  localInfo: string
  serviceReady: string
  coverageNotes: string
  prepItems: string[]
  localItems: string[]
  defaultServices: string[]
}> = {
  en: {
    eyebrow: 'Local automotive locksmith coverage',
    overview: 'Area overview',
    customerPrep: 'What to prepare before service',
    localInfo: 'Local service information',
    serviceReady: 'Services commonly requested here',
    coverageNotes: 'Coverage notes',
    prepItems: ['Vehicle make, model, and year', 'Exact address, parking lot, or nearby landmark', 'Whether all keys are lost', 'Whether the vehicle is locked, running, or in a garage', 'Phone number for fast confirmation'],
    localItems: ['Mobile service depends on technician availability and location', 'Response times may vary by traffic, distance, weather, and urgency', 'Final price depends on vehicle details, parts, and job complexity'],
    defaultServices: ['Car lockout help', 'Replacement car keys', 'Key fob and transponder programming', 'Broken key extraction', 'Ignition-related support'],
  },
  es: {
    eyebrow: 'Cobertura local automotriz',
    overview: 'Resumen del área',
    customerPrep: 'Qué preparar antes del servicio',
    localInfo: 'Información local',
    serviceReady: 'Servicios comunes aquí',
    coverageNotes: 'Notas de cobertura',
    prepItems: ['Marca, modelo y año', 'Dirección, estacionamiento o referencia', 'Si perdió todas las llaves', 'Si el vehículo está cerrado, encendido o en garaje', 'Teléfono para confirmación'],
    localItems: ['Servicio móvil depende de disponibilidad y ubicación', 'El tiempo varía por tráfico, distancia, clima y urgencia', 'El precio depende del vehículo, piezas y complejidad'],
    defaultServices: ['Auto cerrado', 'Reemplazo de llaves', 'Programación de control y transponder', 'Extracción de llave rota', 'Soporte de ignición'],
  },
  ru: {
    eyebrow: 'Локальная зона авто-сервиса',
    overview: 'Описание района',
    customerPrep: 'Что подготовить перед услугой',
    localInfo: 'Локальная информация',
    serviceReady: 'Частые услуги здесь',
    coverageNotes: 'Заметки по покрытию',
    prepItems: ['Марка, модель и год автомобиля', 'Точный адрес, парковка или ориентир', 'Потеряны ли все ключи', 'Машина закрыта, заведена или в гараже', 'Телефон для подтверждения'],
    localItems: ['Мобильный сервис зависит от доступности и локации', 'Сроки зависят от трафика, расстояния, погоды и срочности', 'Цена зависит от авто, деталей и сложности'],
    defaultServices: ['Открытие авто', 'Замена автомобильных ключей', 'Программирование брелков и transponder', 'Извлечение сломанного ключа', 'Помощь с зажиганием'],
  },
}

export default async function AreaDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  noStore()

  const { locale, slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'
  const [global, home, area, faq] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
    getAreaPageFromSource(locale, slug),
    getFaqFromSource(locale),
  ])

  if (!area) notFound()

  const copy = labels[locale]
  const paragraphs = area.intro?.split('\n').filter(Boolean) ?? []
  const location = [area.city, area.state].filter(Boolean).join(', ') || area.title
  const pageUrl = `${siteUrl}/${locale}/areas/${area.slug}`
  const primaryCta = home.heroPrimaryCta || global.phoneDisplay
  const secondaryCta = home.heroSecondaryCta || home.contactTitle || 'Request service'
  const supportedServices = area.supportedServices.length ? area.supportedServices : copy.defaultServices
  const localInfo = area.highlights.length ? area.highlights : copy.localItems

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'AutomotiveBusiness',
      '@id': `${pageUrl}#business`,
      name: global.brandName,
      url: pageUrl,
      telephone: global.phoneDisplay,
      description: area.seoDescription || area.intro,
      areaServed: {
        '@type': 'City',
        name: location,
      },
      openingHours: global.serviceHours,
      makesOffer: supportedServices.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
          areaServed: location,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${locale}` },
        { '@type': 'ListItem', position: 2, name: 'Service Areas', item: `${siteUrl}/${locale}/areas` },
        { '@type': 'ListItem', position: 3, name: area.title, item: pageUrl },
      ],
    },
  ]

  return (
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <JsonLd data={jsonLd} />
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="relative overflow-hidden px-4 py-14 text-text sm:px-6 lg:px-8">
        <article className="mx-auto max-w-7xl">
          <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-accent-cyan">{copy.eyebrow} / {area.city || slug}</p>
              <h1 className="max-w-5xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-7xl">{area.title}</h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">{area.seoDescription || `Mobile automotive locksmith coverage for ${location}.`}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition hover:brightness-110">{primaryCta}</a>
                <a href="#request-service" className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-accent-gold transition hover:bg-accent-gold/15">{secondaryCta}</a>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-accent-blue/20 bg-black/25 p-5 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">{home.emergencyTitle || global.serviceHours}</p>
              <p className="mt-3 text-2xl font-semibold text-text">{global.phoneDisplay}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{home.emergencyText || home.contactText}</p>
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_23rem]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-accent-gold">{area.seoTitle || copy.overview}</p>
              {paragraphs.length ? <div className="space-y-5 text-base leading-8 text-muted">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> : <p className="text-base leading-8 text-muted">{area.seoDescription}</p>}
            </div>

            <aside className="grid gap-4">
              <InfoBox title={copy.customerPrep} items={copy.prepItems} />
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <InfoBox title={copy.serviceReady} items={supportedServices} />
            <InfoBox title={copy.localInfo} items={localInfo} />
            <InfoBox title={copy.coverageNotes} items={copy.localItems} />
          </section>
        </article>

        {faq.length ? <FaqSection title={home.faqTitle} items={faq} /> : null}

        <ContactSection title={home.contactTitle} text={home.contactText} phoneNumber={global.phonePrimary} phoneDisplay={global.phoneDisplay} locale={locale} />
      </main>

      <Footer locale={locale} />
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
    </div>
  )
}

function InfoBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-accent-cyan">{title}</p>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-text/85">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
