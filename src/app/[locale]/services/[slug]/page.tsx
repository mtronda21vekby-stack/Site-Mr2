import type { Metadata } from 'next'
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
  getContentBlocksFromSource,
  getFaqFromSource,
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
  getServicePageFromSource,
  type SiteContentBlock,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'
  const service = await getServicePageFromSource(locale, slug)

  if (!service) return { title: 'Service Not Found | Planetlocksmiths', robots: { index: false, follow: false } }

  const url = `${siteUrl}/${locale}/services/${service.slug}`
  const title = service.seoTitle || service.title
  const description = service.seoDescription || service.excerpt

  return { title, description, alternates: { canonical: url }, openGraph: { type: 'website', url, title, description, siteName: 'Planetlocksmiths' } }
}

const labels: Record<Locale, { serviceEyebrow: string; overview: string; readiness: string; price: string; authorization: string; process: string; processItems: string[] }> = {
  en: { serviceEyebrow: 'Automotive locksmith service', overview: 'Service overview', readiness: 'Information customers should prepare', price: 'What affects price and timing', authorization: 'Authorization and safety', process: 'How the request works', processItems: ['Submit service and vehicle details', 'Confirm location, urgency, and phone number', 'Review availability, parts, and programming needs', 'Confirm next step before service begins'] },
  es: { serviceEyebrow: 'Servicio de cerrajería automotriz', overview: 'Resumen del servicio', readiness: 'Información que el cliente debe preparar', price: 'Qué afecta precio y tiempo', authorization: 'Autorización y seguridad', process: 'Cómo funciona la solicitud', processItems: ['Enviar servicio y datos del vehículo', 'Confirmar ubicación, urgencia y teléfono', 'Revisar disponibilidad, piezas y programación', 'Confirmar el siguiente paso antes del servicio'] },
  ru: { serviceEyebrow: 'Автомобильная locksmith-услуга', overview: 'Описание услуги', readiness: 'Что клиенту подготовить', price: 'Что влияет на цену и сроки', authorization: 'Авторизация и безопасность', process: 'Как проходит заявка', processItems: ['Отправить услугу и данные авто', 'Подтвердить локацию, срочность и телефон', 'Проверить доступность, детали и программирование', 'Подтвердить следующий шаг до начала услуги'] },
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  noStore()

  const { locale, slug } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'

  const [global, home, service, faq, commonBlocks, serviceBlocks] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
    getServicePageFromSource(locale, slug),
    getFaqFromSource(locale),
    getContentBlocksFromSource(locale, 'service-detail'),
    getContentBlocksFromSource(locale, `service:${slug}`),
  ])

  if (!service) notFound()

  const copy = labels[locale]
  const paragraphs = service.intro?.split('\n').filter(Boolean) ?? []
  const pageUrl = `${siteUrl}/${locale}/services/${service.slug}`
  const primaryCta = home.heroPrimaryCta || global.phoneDisplay
  const secondaryCta = home.heroSecondaryCta || home.contactTitle || 'Request service'
  const blockBySlot = new Map([...commonBlocks, ...serviceBlocks].map((block) => [block.slot, block]))
  const heroBlock = blockBySlot.get('hero')
  const overviewBlock = blockBySlot.get('overview')
  const readinessBlock = blockBySlot.get('readiness')
  const pricingBlock = blockBySlot.get('pricing')
  const authorizationBlock = blockBySlot.get('authorization')
  const processBlock = blockBySlot.get('process')
  const processItems = processBlock?.items.length ? processBlock.items : copy.processItems

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'Service', '@id': `${pageUrl}#service`, name: service.title, description: service.seoDescription || service.excerpt, url: pageUrl, provider: { '@type': 'AutomotiveBusiness', name: global.brandName, telephone: global.phoneDisplay, url: `${siteUrl}/${locale}` }, areaServed: 'Philadelphia, Pennsylvania and nearby coverage areas', serviceType: service.title },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${locale}` }, { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/${locale}/services` }, { '@type': 'ListItem', position: 3, name: service.title, item: pageUrl }] },
  ]

  return (
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <JsonLd data={jsonLd} />
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="relative overflow-hidden text-text">
        <article className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <section className="premium-panel premium-hairline relative grid gap-8 overflow-hidden rounded-[2.25rem] p-6 sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div className="absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full border border-accent-blue/15" />
            <div className="absolute bottom-[-8rem] left-[-6rem] h-80 w-80 rounded-full bg-accent-gold/10 blur-3xl" />
            <div className="relative">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">{heroBlock?.eyebrow || copy.serviceEyebrow}</p>
              <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{heroBlock?.title || service.title}</h1>
              {heroBlock?.body || service.excerpt ? <p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{heroBlock?.body || service.excerpt}</p> : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">{heroBlock?.ctaLabel || primaryCta}</a>
                <a href={heroBlock?.ctaHref || '#request-service'} className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-accent-gold transition duration-300 hover:-translate-y-0.5 hover:bg-accent-gold/15">{secondaryCta}</a>
              </div>
            </div>

            <aside className="premium-panel relative rounded-[1.5rem] p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-accent-cyan">{home.emergencyTitle || global.serviceHours}</p>
              <p className="mt-3 text-2xl font-semibold text-text">{global.phoneDisplay}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{home.emergencyText || home.contactText || service.excerpt}</p>
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_23rem]">
            <div className="premium-panel rounded-[2rem] p-6 sm:p-8">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.26em] text-accent-gold">{overviewBlock?.eyebrow || service.seoTitle || copy.overview}</p>
              {overviewBlock?.title ? <h2 className="mb-5 text-3xl font-semibold tracking-[-0.035em] text-text">{overviewBlock.title}</h2> : null}
              {overviewBlock?.body ? <p className="text-base leading-8 text-muted">{overviewBlock.body}</p> : paragraphs.length ? <div className="space-y-5 text-base leading-8 text-muted">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> : <p className="text-base leading-8 text-muted">{service.seoDescription || service.excerpt}</p>}
            </div>

            <aside className="grid gap-4">
              <InfoCard block={readinessBlock} title={copy.readiness} text="Vehicle make, model, year, current location, urgency, and whether all keys are lost help make the request actionable." />
              <InfoCard block={pricingBlock} title={copy.price} text="Final pricing can depend on vehicle security system, key type, programming requirements, parts availability, distance, timing, and job complexity." />
              <InfoCard block={authorizationBlock} title={copy.authorization} text="Customers may be asked to confirm authorization to access or service the vehicle before work begins." />
            </aside>
          </section>

          <section className="premium-panel mt-8 rounded-[2rem] p-6 sm:p-8">
            <p className="mb-6 text-xs font-black uppercase tracking-[0.26em] text-accent-cyan">{processBlock?.eyebrow || copy.process}</p>
            {processBlock?.title ? <h2 className="mb-6 text-3xl font-semibold tracking-[-0.035em] text-text">{processBlock.title}</h2> : null}
            {processBlock?.body ? <p className="mb-6 max-w-3xl text-sm leading-7 text-muted">{processBlock.body}</p> : null}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {processItems.map((item, index) => (
                <div key={item} className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/30 hover:bg-accent-blue/10">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-blue text-sm font-black text-black shadow-[0_0_22px_rgba(77,162,255,0.28)]">{index + 1}</span>
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

function InfoCard({ block, title, text }: { block?: SiteContentBlock; title: string; text: string }) {
  const items = block?.items ?? []
  return (
    <div className="premium-panel rounded-[1.5rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/30">
      <h2 className="text-lg font-semibold text-text">{block?.title || title}</h2>
      <p className="mt-2 text-sm leading-7 text-muted">{block?.body || text}</p>
      {items.length ? <ul className="mt-4 grid gap-2">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-text/85"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" /><span>{item}</span></li>)}</ul> : null}
    </div>
  )
}
