import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import ContactSection from '@/components/sections/ContactSection'
import JsonLd from '@/components/seo/JsonLd'
import ContentBlockModule from '@/components/site/ContentBlockModule'
import { buildPageMetadata } from '@/lib/seo'
import { buildAutomotiveBusinessSchema, buildContactPageSchema, compactSchema } from '@/lib/schema'
import {
  getContentBlocksFromSource,
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const copy = fallbackCopy[activeLocale]
  return buildPageMetadata({ locale: activeLocale, path: '/contact', title: copy.title, description: copy.intro })
}

const fallbackCopy: Record<ActiveLocale, { eyebrow: string; title: string; intro: string; phone: string; serviceType: string; serviceValue: string; area: string; areaValue: string; sideTitle: string; sideText: string; call: string; request: string }> = {
  en: { eyebrow: 'Contact Planetlocksmiths', title: 'Request mobile automotive locksmith service', intro: 'Use the form below to send vehicle details, location, urgency, and the service needed. For urgent lockouts or active roadside situations, calling may be faster.', phone: 'Phone', serviceType: 'Service type', serviceValue: 'Mobile automotive locksmith', area: 'Common area', areaValue: 'Philadelphia, Pennsylvania and nearby coverage areas', sideTitle: 'What makes the request faster', sideText: 'Vehicle make, model, year, exact location, phone number, and key situation help create a cleaner callback and service path.', call: 'Call', request: 'Request service' },
  es: { eyebrow: 'Contacto Planetlocksmiths', title: 'Solicitar servicio móvil de cerrajería automotriz', intro: 'Use el formulario para enviar datos del vehículo, ubicación, urgencia y servicio requerido. Para autos cerrados o situaciones de carretera, llamar puede ser más rápido.', phone: 'Teléfono', serviceType: 'Tipo de servicio', serviceValue: 'Cerrajería automotriz móvil', area: 'Área común', areaValue: 'Philadelphia, Pennsylvania y áreas cercanas', sideTitle: 'Qué acelera la solicitud', sideText: 'Marca, modelo, año, ubicación exacta, teléfono y situación de la llave ayudan a una respuesta más clara.', call: 'Llamar', request: 'Solicitar servicio' },
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const fallback = fallbackCopy[activeLocale]
  const [global, home, blocks] = await Promise.all([getGlobalSettingsFromSource(), getHomeContentFromSource(activeLocale), getContentBlocksFromSource(activeLocale, 'contact')])
  const schema = compactSchema([buildAutomotiveBusinessSchema({ locale: activeLocale, global, description: fallback.intro }), buildContactPageSchema({ locale: activeLocale, global, description: fallback.intro })])
  const blockBySlot = new Map(blocks.map((block) => [block.slot, block]))
  const heroBlock = blockBySlot.get('hero')
  const sideBlock = blockBySlot.get('side')
  const phoneBlock = blockBySlot.get('info-phone')
  const serviceBlock = blockBySlot.get('info-service')
  const areaBlock = blockBySlot.get('info-area')
  const helperBlock = blockBySlot.get('helper')
  const extraBlocks = blocks.filter((block) => !['hero', 'side', 'info-phone', 'info-service', 'info-area', 'helper'].includes(block.slot))
  const heroEyebrow = heroBlock?.eyebrow || fallback.eyebrow
  const heroTitle = heroBlock?.title || home.contactTitle || fallback.title
  const heroIntro = heroBlock?.body || home.contactText || fallback.intro
  const callLabel = heroBlock?.items[0] || fallback.call
  const requestLabel = heroBlock?.ctaLabel || home.heroSecondaryCta || fallback.request
  const requestHref = heroBlock?.ctaHref || '#request-service'

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <JsonLd data={schema} />
      <CinematicBackground />
      <Header locale={activeLocale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />
      <main className="flex flex-col">
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="premium-panel premium-hairline mx-auto grid max-w-7xl gap-8 rounded-[2.25rem] p-6 sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div className="relative z-10"><p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-accent-cyan">{heroEyebrow}</p><h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{heroTitle}</h1><p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{heroIntro}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={`tel:${global.phonePrimary}`} className="notranslate inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110" translate="no">{callLabel} {global.phoneDisplay}</a><a href={requestHref} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/[0.075] px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/45 hover:bg-accent-gold/12 hover:text-accent-gold">{requestLabel}</a></div></div>
            <aside className="premium-panel relative z-10 rounded-[1.5rem] p-5"><div className="relative z-10"><p className="text-xs font-black uppercase tracking-[0.24em] text-accent-gold">{sideBlock?.title || fallback.sideTitle}</p><p className="mt-3 text-sm leading-7 text-muted">{sideBlock?.body || helperBlock?.body || fallback.sideText}</p></div></aside>
          </div>
          <div className="mx-auto mt-6 grid max-w-7xl gap-3 sm:grid-cols-3"><InfoTile title={phoneBlock?.title || fallback.phone} value={phoneBlock?.body || global.phoneDisplay} noTranslate /><InfoTile title={serviceBlock?.title || fallback.serviceType} value={serviceBlock?.body || fallback.serviceValue} /><InfoTile title={areaBlock?.title || fallback.area} value={areaBlock?.body || fallback.areaValue} /></div>
          {extraBlocks.length ? <div className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-2">{extraBlocks.map((block) => <ContentBlockModule key={block.id} block={block} variant={block.items.length > 1 ? 'checklist' : 'section'} />)}</div> : null}
        </section>
        <ContactSection title={home.contactTitle} text={home.contactText} phoneNumber={global.phonePrimary} phoneDisplay={global.phoneDisplay} locale={activeLocale} />
      </main>
      <Footer locale={activeLocale} />
      <MobileStickyCta locale={activeLocale} phoneNumber={global.phonePrimary} />
    </div>
  )
}

function InfoTile({ title, value, noTranslate = false }: { title: string; value: string; noTranslate?: boolean }) {
  return <div className="premium-panel rounded-2xl p-4"><div className="relative z-10"><h2 className="text-sm font-semibold text-text">{title}</h2><p className={`mt-2 text-sm text-muted ${noTranslate ? 'notranslate' : ''}`} translate={noTranslate ? 'no' : undefined}>{value}</p></div></div>
}
