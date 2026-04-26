import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import ContentBlockModule from '@/components/site/ContentBlockModule'
import {
  getContentBlocksFromSource,
  getGlobalSettingsFromSource,
  type SiteContentBlock,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const fallbackCopy: Record<ActiveLocale, { eyebrow: string; title: string; body: string }> = {
  en: { eyebrow: 'About Planetlocksmiths', title: 'Mobile automotive locksmith support built for clear, fast service requests.', body: 'Planetlocksmiths is structured around mobile automotive locksmith requests for car lockouts, replacement keys, key fob programming, transponder support, ignition-related help, and broken key situations.' },
  es: { eyebrow: 'Sobre Planetlocksmiths', title: 'Soporte móvil de cerrajería automotriz para solicitudes claras y rápidas.', body: 'Planetlocksmiths está organizado para solicitudes móviles automotrices: autos cerrados, reemplazo de llaves, programación de controles, transponder, ignición y llaves rotas.' },
}

const fallbackBlocks: Record<ActiveLocale, SiteContentBlock[]> = {
  en: [
    { id: 'about-fallback-1', locale: 'en', pageKey: 'about', slot: 'section-1', eyebrow: 'About 01', title: 'Automotive focus', body: 'The site is designed around vehicle-specific requests so customers can provide service type, vehicle details, location, urgency, and contact information clearly.', items: [], ctaLabel: '', ctaHref: '', sortOrder: 1 },
    { id: 'about-fallback-2', locale: 'en', pageKey: 'about', slot: 'section-2', eyebrow: 'About 02', title: 'Mobile-first service path', body: 'Customers can call or submit a request from any page. Service availability depends on location, vehicle details, parts, timing, and job complexity.', items: [], ctaLabel: '', ctaHref: '', sortOrder: 2 },
    { id: 'about-fallback-3', locale: 'en', pageKey: 'about', slot: 'section-3', eyebrow: 'About 03', title: 'Information that matters', body: 'Cleaner request details help confirm the right next step before service begins.', items: ['Vehicle make, model, and year', 'Current location or ZIP code', 'Lockout, lost key, fob, transponder, ignition, or broken key situation', 'Phone number and urgency'], ctaLabel: '', ctaHref: '', sortOrder: 3 },
  ],
  es: [
    { id: 'about-fallback-1-es', locale: 'es', pageKey: 'about', slot: 'section-1', eyebrow: 'Sobre 01', title: 'Enfoque automotriz', body: 'El sitio está diseñado para solicitudes específicas del vehículo: servicio, datos del auto, ubicación, urgencia y contacto.', items: [], ctaLabel: '', ctaHref: '', sortOrder: 1 },
    { id: 'about-fallback-2-es', locale: 'es', pageKey: 'about', slot: 'section-2', eyebrow: 'Sobre 02', title: 'Ruta móvil de servicio', body: 'Los clientes pueden llamar o enviar una solicitud desde cualquier página. La disponibilidad depende de ubicación, vehículo, piezas, horario y complejidad.', items: [], ctaLabel: '', ctaHref: '', sortOrder: 2 },
    { id: 'about-fallback-3-es', locale: 'es', pageKey: 'about', slot: 'section-3', eyebrow: 'Sobre 03', title: 'Información importante', body: 'Datos claros ayudan a confirmar el siguiente paso antes del servicio.', items: ['Marca, modelo y año', 'Ubicación actual o ZIP', 'Auto cerrado, llave perdida, control, transponder, ignición o llave rota', 'Teléfono y urgencia'], ctaLabel: '', ctaHref: '', sortOrder: 3 },
  ],
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const [global, blocks] = await Promise.all([getGlobalSettingsFromSource(), getContentBlocksFromSource(activeLocale, 'about')])
  const fallback = fallbackCopy[activeLocale]
  const hero = blocks.find((block) => block.slot === 'hero')
  const customSections = blocks.filter((block) => block.slot !== 'hero')
  const sections: SiteContentBlock[] = customSections.length ? customSections : fallbackBlocks[activeLocale]

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <CinematicBackground />
      <Header locale={activeLocale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="premium-panel premium-hairline rounded-[2.25rem] p-6 sm:p-8 lg:p-10">
          <div className="relative z-10">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">{hero?.eyebrow || fallback.eyebrow}</p>
            <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{hero?.title || fallback.title}</h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{hero?.body || fallback.body}</p>
          </div>
        </section>
        <section className="mt-8 grid gap-5 md:grid-cols-3">{sections.map((block) => <ContentBlockModule key={block.id} block={block} variant={block.items.length > 1 ? 'checklist' : 'compact'} />)}</section>
      </main>
      <Footer locale={activeLocale} />
      <MobileStickyCta locale={activeLocale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
