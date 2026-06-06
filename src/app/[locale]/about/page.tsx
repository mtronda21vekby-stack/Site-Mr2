import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import ContentBlockModule from '@/components/site/ContentBlockModule'
import { buildPageMetadata } from '@/lib/seo'
import {
  getContentBlocksFromSource,
  getGlobalSettingsFromSource,
  type SiteContentBlock,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const copy = fallbackCopy[activeLocale]
  return buildPageMetadata({ locale: activeLocale, path: '/about', title: copy.title, description: copy.body })
}

const fallbackCopy: Record<ActiveLocale, { eyebrow: string; title: string; body: string }> = {
  en: { eyebrow: 'About Planet Locksmiths', title: 'Mobile locksmith support built for clear, fast service requests.', body: 'Planet Locksmiths is structured around mobile locksmith requests for car lockouts, all keys lost, key programming, rekeys, lock repair, lock replacement, residential, commercial, access control, safe opening, and urgent key situations.' },
  es: { eyebrow: 'Sobre Planet Locksmiths', title: 'Soporte móvil de cerrajería para solicitudes claras y rápidas.', body: 'Planet Locksmiths está organizado para solicitudes móviles de cerrajería: bloqueos, llaves de auto, programación, rekeys, reparación, reemplazo, residencial, comercial, access control, cajas fuertes y urgencias.' },
}

function createFallbackBlock(input: Omit<SiteContentBlock, 'items'> & { items?: string[] }): SiteContentBlock {
  return { ...input, items: [...(input.items ?? [])] }
}

function getFallbackBlocks(locale: ActiveLocale): SiteContentBlock[] {
  if (locale === 'es') {
    return [
      createFallbackBlock({ id: 'about-fallback-1-es', locale: 'es', pageKey: 'about', slot: 'section-1', eyebrow: 'Sobre 01', title: 'Servicios completos', body: 'El sitio está diseñado para solicitudes de auto, hogar, negocio, rekey, instalación, safe opening, access control y emergencias.', ctaLabel: '', ctaHref: '', sortOrder: 1 }),
      createFallbackBlock({ id: 'about-fallback-2-es', locale: 'es', pageKey: 'about', slot: 'section-2', eyebrow: 'Sobre 02', title: 'Ruta móvil de servicio', body: 'Los clientes pueden llamar o enviar una solicitud desde cualquier página. La disponibilidad depende de ubicación, servicio, piezas, horario, autorización y complejidad.', ctaLabel: '', ctaHref: '', sortOrder: 2 }),
      createFallbackBlock({ id: 'about-fallback-3-es', locale: 'es', pageKey: 'about', slot: 'section-3', eyebrow: 'Sobre 03', title: 'Información importante', body: 'Datos claros ayudan a confirmar el siguiente paso antes del servicio.', items: ['Servicio requerido y ubicación', 'Datos del vehículo cuando aplique', 'Tipo de cerradura, puerta, caja fuerte o acceso', 'Teléfono y urgencia'], ctaLabel: '', ctaHref: '', sortOrder: 3 }),
    ]
  }

  return [
    createFallbackBlock({ id: 'about-fallback-1', locale: 'en', pageKey: 'about', slot: 'section-1', eyebrow: 'About 01', title: 'Full locksmith scope', body: 'The site is designed around auto, residential, commercial, rekey, installation, safe opening, access control, and emergency service requests.', ctaLabel: '', ctaHref: '', sortOrder: 1 }),
    createFallbackBlock({ id: 'about-fallback-2', locale: 'en', pageKey: 'about', slot: 'section-2', eyebrow: 'About 02', title: 'Mobile-first service path', body: 'Customers can call or submit a request from any page. Service availability depends on location, service type, parts, timing, authorization, and job complexity.', ctaLabel: '', ctaHref: '', sortOrder: 2 }),
    createFallbackBlock({ id: 'about-fallback-3', locale: 'en', pageKey: 'about', slot: 'section-3', eyebrow: 'About 03', title: 'Information that matters', body: 'Cleaner request details help confirm the right next step before service begins.', items: ['Service needed and current location', 'Vehicle details when relevant', 'Lock, door, safe, mailbox, or access-control details', 'Phone number and urgency'], ctaLabel: '', ctaHref: '', sortOrder: 3 }),
  ]
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const [global, blocks] = await Promise.all([getGlobalSettingsFromSource(), getContentBlocksFromSource(activeLocale, 'about')])
  const fallback = fallbackCopy[activeLocale]
  const hero = blocks.find((block) => block.slot === 'hero')
  const customSections = blocks.filter((block) => block.slot !== 'hero')
  const sections: SiteContentBlock[] = customSections.length ? customSections : getFallbackBlocks(activeLocale)

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <CinematicBackground />
      <Header
        locale={activeLocale}
        brandName={global.brandName}
        logoUrl={global.logoUrl}
        logoAlt={global.logoAlt}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
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
