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
  getFaqFromSource,
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
  getServicePageFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const labels: Record<Locale, {
  serviceEyebrow: string
  overview: string
  details: string
  readiness: string
  price: string
  authorization: string
  process: string
  processItems: string[]
}> = {
  en: {
    serviceEyebrow: 'Automotive locksmith service',
    overview: 'Service overview',
    details: 'Service details from admin',
    readiness: 'Information customers should prepare',
    price: 'What affects price and timing',
    authorization: 'Authorization and safety',
    process: 'How the request works',
    processItems: ['Submit service and vehicle details', 'Confirm location, urgency, and phone number', 'Review availability, parts, and programming needs', 'Confirm next step before service begins'],
  },
  es: {
    serviceEyebrow: 'Servicio de cerrajería automotriz',
    overview: 'Resumen del servicio',
    details: 'Detalles desde la administración',
    readiness: 'Información que el cliente debe preparar',
    price: 'Qué afecta precio y tiempo',
    authorization: 'Autorización y seguridad',
    process: 'Cómo funciona la solicitud',
    processItems: ['Enviar servicio y datos del vehículo', 'Confirmar ubicación, urgencia y teléfono', 'Revisar disponibilidad, piezas y programación', 'Confirmar el siguiente paso antes del servicio'],
  },
  ru: {
    serviceEyebrow: 'Автомобильная locksmith-услуга',
    overview: 'Описание услуги',
    details: 'Детали из админки',
    readiness: 'Что клиенту подготовить',
    price: 'Что влияет на цену и сроки',
    authorization: 'Авторизация и безопасность',
    process: 'Как проходит заявка',
    processItems: ['Отправить услугу и данные авто', 'Подтвердить локацию, срочность и телефон', 'Проверить доступность, детали и программирование', 'Подтвердить следующий шаг до начала услуги'],
  },
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  noStore()

  const { locale, slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'

  const [global, home, service, faq] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
    getServicePageFromSource(locale, slug),
    getFaqFromSource(locale),
  ])

  if (!service) notFound()

  const copy = labels[locale]
  const paragraphs = service.intro?.split('\n').filter(Boolean) ?? []
  const pageUrl = `${siteUrl}/${locale}/services/${service.slug}`
  const primaryCta = home.heroPrimaryCta || global.phoneDisplay
  const secondaryCta = home.heroSecondaryCta || home.contactTitle || 'Request service'

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: service.title,
      description: service.seoDescription || service.excerpt,
      url: pageUrl,
      provider: {
        '@type': 'AutomotiveBusiness',
        name: global.brandName,
        telephone: global.phoneDisplay,
        url: `${siteUrl}/${locale}`,
      },
      areaServed: 'Philadelphia, Pennsylvania and nearby coverage areas',
      serviceType: service.title,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${locale}` },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/${locale}/services` },
        { '@type': 'ListItem', position: 3, name: service.title, item: pageUrl },
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
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-accent-cyan">{copy.serviceEyebrow}</p>
              <h1 className="max-w-5xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-7xl">{service.title}</h1>
              {service.excerpt ? <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">{service.excerpt}</p> : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition hover:brightness-110">{primaryCta}</a>
                <a href="#request-service" className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-accent-gold transition hover:bg-accent-gold/15">{secondaryCta}</a>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-accent-blue/20 bg-black/25 p-5 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">{home.emergencyTitle || global.serviceHours}</p>
              <p className="mt-3 text-2xl font-semibold text-text">{global.phoneDisplay}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{home.emergencyText || home.contactText || service.excerpt}</p>
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_23rem]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-accent-gold">{service.seoTitle || copy.overview}</p>
              {paragraphs.length ? (
                <div className="space-y-5 text-base leading-8 text-muted">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              ) : (
                <p className="text-base leading-8 text-muted">{service.seoDescription || service.excerpt}</p>
              )}
            </div>

            <aside className="grid gap-4">
              <InfoCard title={copy.readiness} text="Vehicle make, model, year, current location, urgency, and whether all keys are lost help make the request actionable." />
              <InfoCard title={copy.price} text="Final pricing can depend on vehicle security system, key type, programming requirements, parts availability, distance, timing, and job complexity." />
              <InfoCard title={copy.authorization} text="Customers may be asked to confirm authorization to access or service the vehicle before work begins." />
            </aside>
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.26em] text-accent-cyan">{copy.process}</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {copy.processItems.map((item, index) => (
                <div key={item} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-blue text-sm font-bold text-black">{index + 1}</span>
                  <p className="mt-4 text-sm leading-7 text-muted">{item}</p>
                </div>
              ))}
            </div>
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

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-muted">{text}</p>
    </div>
  )
}
