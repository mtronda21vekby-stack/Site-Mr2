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
import { buildPageMetadata, getSiteUrl } from '@/lib/seo'
import {
  getAreaPageFromSource,
  getContentBlocksFromSource,
  getFaqFromSource,
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
  type SiteContentBlock,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const labels: Record<ActiveLocale, { eyebrow: string; overview: string; customerPrep: string; localInfo: string; serviceReady: string; coverageNotes: string; prepItems: string[]; localItems: string[]; defaultServices: string[] }> = {
  en: { eyebrow: 'Local automotive locksmith coverage', overview: 'Area overview', customerPrep: 'What to prepare before service', localInfo: 'Local service information', serviceReady: 'Services commonly requested here', coverageNotes: 'Coverage notes', prepItems: ['Vehicle make, model, and year', 'Exact address, parking lot, or nearby landmark', 'Whether all keys are lost', 'Whether the vehicle is locked, running, or in a garage', 'Phone number for fast confirmation'], localItems: ['Mobile service depends on technician availability and location', 'Response times may vary by traffic, distance, weather, and urgency', 'Final price depends on vehicle details, parts, and job complexity'], defaultServices: ['Car lockout help', 'Replacement car keys', 'Key fob and transponder programming', 'Broken key extraction', 'Ignition-related support'] },
  es: { eyebrow: 'Cobertura local automotriz', overview: 'Resumen del área', customerPrep: 'Qué preparar antes del servicio', localInfo: 'Información local', serviceReady: 'Servicios comunes aquí', coverageNotes: 'Notas de cobertura', prepItems: ['Marca, modelo y año', 'Dirección, estacionamiento o referencia', 'Si perdió todas las llaves', 'Si el vehículo está cerrado, encendido o en garaje', 'Teléfono para confirmación'], localItems: ['Servicio móvil depende de disponibilidad y ubicación', 'El tiempo varía por tráfico, distancia, clima y urgencia', 'El precio depende del vehículo, piezas y complejidad'], defaultServices: ['Auto cerrado', 'Reemplazo de llaves', 'Programación de control y transponder', 'Extracción de llave rota', 'Soporte de ignición'] },
}

function toActiveLocale(locale: Locale): ActiveLocale {
  return locale === 'es' ? 'es' : 'en'
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const activeLocale = toActiveLocale(locale)
  const area = await getAreaPageFromSource(activeLocale, slug)

  if (!area) return { title: 'Service Area Not Found | Planetlocksmiths', robots: { index: false, follow: false } }

  return buildPageMetadata({ locale: activeLocale, path: `/areas/${area.slug}`, title: area.seoTitle || area.title, description: area.seoDescription || area.intro })
}

export default async function AreaDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  noStore()

  const { locale, slug } = await params
  const activeLocale = toActiveLocale(locale)
  const siteUrl = getSiteUrl()
  const [global, home, area, faq, commonBlocks, areaBlocks] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(activeLocale),
    getAreaPageFromSource(activeLocale, slug),
    getFaqFromSource(activeLocale),
    getContentBlocksFromSource(activeLocale, 'area-detail'),
    getContentBlocksFromSource(activeLocale, `area:${slug}`),
  ])

  if (!area) notFound()

  const copy = labels[activeLocale]
  const paragraphs = area.intro?.split('\n').filter(Boolean) ?? []
  const location = [area.city, area.state].filter(Boolean).join(', ') || area.title
  const pageUrl = `${siteUrl}/${activeLocale}/areas/${area.slug}`
  const primaryCta = home.heroPrimaryCta || copy.eyebrow
  const secondaryCta = home.heroSecondaryCta || home.contactTitle || 'Request service'
  const supportedServices = area.supportedServices.length ? area.supportedServices : copy.defaultServices
  const localInfo = area.highlights.length ? area.highlights : copy.localItems
  const blockBySlot = new Map([...commonBlocks, ...areaBlocks].map((block) => [block.slot, block]))
  const heroBlock = blockBySlot.get('hero')
  const overviewBlock = blockBySlot.get('overview')
  const prepBlock = blockBySlot.get('prep')
  const servicesBlock = blockBySlot.get('supported-services')
  const localInfoBlock = blockBySlot.get('local-info')
  const coverageBlock = blockBySlot.get('coverage-notes')

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'AutomotiveBusiness', '@id': `${pageUrl}#business`, name: global.brandName, url: pageUrl, telephone: global.phoneDisplay, description: area.seoDescription || area.intro, areaServed: { '@type': 'City', name: location }, openingHours: global.serviceHours, makesOffer: supportedServices.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service, areaServed: location } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/${activeLocale}` }, { '@type': 'ListItem', position: 2, name: 'Service Areas', item: `${siteUrl}/${activeLocale}/areas` }, { '@type': 'ListItem', position: 3, name: area.title, item: pageUrl }] },
  ]

  return (
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <JsonLd data={jsonLd} />
      <CinematicBackground />
      <Header locale={activeLocale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="relative text-text">
        <article className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <section className="premium-panel premium-hairline grid gap-8 rounded-[2.25rem] p-6 sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div className="relative z-10">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">{heroBlock?.eyebrow || `${copy.eyebrow} / ${area.city || slug}`}</p>
              <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{heroBlock?.title || area.title}</h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{heroBlock?.body || area.seoDescription || `Mobile automotive locksmith coverage for ${location}.`}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${global.phonePrimary}`} className="notranslate inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110" translate="no" aria-label={`${heroBlock?.ctaLabel || primaryCta} ${global.phoneDisplay}`}>{heroBlock?.ctaLabel || primaryCta}</a>
                <a href={heroBlock?.ctaHref || '#request-service'} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/[0.075] px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/45 hover:bg-accent-gold/12 hover:text-accent-gold">{secondaryCta}</a>
              </div>
            </div>

            <aside className="premium-panel relative z-10 rounded-[1.5rem] p-5">
              <div className="relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-accent-cyan">{home.emergencyTitle || global.serviceHours}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{home.emergencyText || home.contactText}</p>
              </div>
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_23rem]">
            <div className="premium-panel rounded-[2rem] p-6 sm:p-8">
              <div className="relative z-10">
                <p className="mb-5 text-xs font-black uppercase tracking-[0.26em] text-accent-gold">{overviewBlock?.eyebrow || area.seoTitle || copy.overview}</p>
                {overviewBlock?.title ? <h2 className="mb-5 text-3xl font-semibold tracking-[-0.035em] text-text">{overviewBlock.title}</h2> : null}
                {overviewBlock?.body ? <p className="text-base leading-8 text-muted">{overviewBlock.body}</p> : paragraphs.length ? <div className="space-y-5 text-base leading-8 text-muted">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> : <p className="text-base leading-8 text-muted">{area.seoDescription}</p>}
              </div>
            </div>

            <aside className="grid gap-4">
              <InfoBox block={prepBlock} title={copy.customerPrep} items={copy.prepItems} />
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <InfoBox block={servicesBlock} title={copy.serviceReady} items={supportedServices} />
            <InfoBox block={localInfoBlock} title={copy.localInfo} items={localInfo} />
            <InfoBox block={coverageBlock} title={copy.coverageNotes} items={copy.localItems} />
          </section>
        </article>

        {faq.length ? <FaqSection title={home.faqTitle} items={faq} /> : null}
        <ContactSection title={home.contactTitle} text={home.contactText} phoneNumber={global.phonePrimary} phoneDisplay={global.phoneDisplay} locale={activeLocale} />
      </main>

      <Footer locale={activeLocale} />
      <MobileStickyCta locale={activeLocale} phoneNumber={global.phonePrimary} />
    </div>
  )
}

function InfoBox({ block, title, items }: { block?: SiteContentBlock; title: string; items: string[] }) {
  const finalItems = block?.items.length ? block.items : items
  return (
    <div className="premium-panel rounded-[1.5rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/30">
      <div className="relative z-10">
        <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-accent-cyan">{block?.eyebrow || block?.title || title}</p>
        {block?.body ? <p className="mb-5 text-sm leading-7 text-muted">{block.body}</p> : null}
        <ul className="grid gap-3">
          {finalItems.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-6 text-text/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
