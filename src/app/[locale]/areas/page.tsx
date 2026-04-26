import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CinematicBackground from '@/components/layout/CinematicBackground'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import ContentBlockModule from '@/components/site/ContentBlockModule'
import { buildPageMetadata } from '@/lib/seo'
import {
  getAreasListFromSource,
  getContentBlocksFromSource,
  getGlobalSettingsFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const copy = fallbackCopy[activeLocale]
  return buildPageMetadata({ locale: activeLocale, path: '/areas', title: copy.title, description: copy.intro })
}

const fallbackCopy: Record<ActiveLocale, { eyebrow: string; title: string; intro: string; call: string; request: string; cardPrefix: string; open: string; empty: string; sideTitle: string; sideText: string; countLabel: string }> = {
  en: { eyebrow: 'Planetlocksmiths / coverage', title: 'Service Areas', intro: 'Mobile automotive locksmith coverage pages help customers understand where service may be available, what support is offered, and what vehicle details are needed before requesting help.', call: 'Call', request: 'Request service', cardPrefix: 'Area', open: 'Open area', empty: 'No published areas yet.', sideTitle: 'Coverage ready', sideText: 'Coverage depends on technician availability, location, distance, vehicle type, parts, timing, and job complexity.', countLabel: 'Published areas' },
  es: { eyebrow: 'Planetlocksmiths / cobertura', title: 'Áreas de servicio', intro: 'Las páginas de cobertura móvil ayudan a los clientes a entender dónde puede estar disponible el servicio, qué soporte se ofrece y qué datos del vehículo se necesitan antes de solicitar ayuda.', call: 'Llamar', request: 'Solicitar servicio', cardPrefix: 'Área', open: 'Abrir área', empty: 'No hay áreas publicadas todavía.', sideTitle: 'Cobertura lista', sideText: 'La cobertura depende de disponibilidad, ubicación, distancia, tipo de vehículo, piezas, horario y complejidad.', countLabel: 'Áreas publicadas' },
}

export default async function AreasIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const fallback = fallbackCopy[activeLocale]
  const [global, areas, blocks] = await Promise.all([getGlobalSettingsFromSource(), getAreasListFromSource(activeLocale), getContentBlocksFromSource(activeLocale, 'areas')])
  const blockBySlot = new Map(blocks.map((block) => [block.slot, block]))
  const heroBlock = blockBySlot.get('hero')
  const sideBlock = blockBySlot.get('side')
  const cardsBlock = blockBySlot.get('cards')
  const emptyBlock = blockBySlot.get('empty')
  const extraBlocks = blocks.filter((block) => !['hero', 'side', 'cards', 'empty'].includes(block.slot))
  const heroEyebrow = heroBlock?.eyebrow || fallback.eyebrow
  const heroTitle = heroBlock?.title || fallback.title
  const heroIntro = heroBlock?.body || fallback.intro
  const callLabel = heroBlock?.items[0] || fallback.call
  const requestLabel = heroBlock?.ctaLabel || fallback.request
  const requestHref = heroBlock?.ctaHref || `/${activeLocale}/contact#request-service`
  const cardPrefix = cardsBlock?.eyebrow || fallback.cardPrefix
  const openLabel = cardsBlock?.ctaLabel || fallback.open
  const countLabel = sideBlock?.items[0] || fallback.countLabel

  return (
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <CinematicBackground />
      <Header locale={activeLocale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />
      <main className="relative text-text">
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="premium-panel premium-hairline grid gap-8 rounded-[2.25rem] p-6 sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div className="relative z-10"><p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-accent-cyan">{heroEyebrow}</p><h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{heroTitle}</h1><p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{heroIntro}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={`tel:${global.phonePrimary}`} className="notranslate inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110" translate="no">{callLabel} {global.phoneDisplay}</a><Link href={requestHref} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/[0.075] px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/45 hover:bg-accent-gold/12 hover:text-accent-gold">{requestLabel}</Link></div></div>
            <aside className="premium-panel relative z-10 rounded-[1.5rem] p-5"><div className="relative z-10"><p className="text-xs font-black uppercase tracking-[0.24em] text-accent-gold">{sideBlock?.title || fallback.sideTitle}</p><p className="mt-3 text-sm leading-7 text-muted">{sideBlock?.body || fallback.sideText}</p><div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" /><p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-text">{areas.length}</p><p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-muted">{countLabel}</p></div></aside>
          </div>
          {extraBlocks.length ? <div className="mt-8 grid gap-5 lg:grid-cols-2">{extraBlocks.map((block) => <ContentBlockModule key={block.id} block={block} variant={block.items.length > 1 ? 'checklist' : 'section'} />)}</div> : null}
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{areas.map((area, index) => (<Link key={area.slug} href={`/${activeLocale}/areas/${area.slug}`} className="group premium-panel premium-hairline flex min-h-[19rem] rounded-[1.75rem] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-accent-blue/40"><div className="relative z-10 flex h-full flex-col"><p className="mb-7 text-[0.65rem] font-black uppercase tracking-[0.22em] text-accent-gold">{cardPrefix} {String(index + 1).padStart(2, '0')}</p><h2 className="text-balance text-2xl font-semibold tracking-[-0.035em] text-text">{area.title}</h2><p className="mt-2 text-sm font-semibold text-accent-cyan/80">{[area.city, area.state].filter(Boolean).join(', ')}</p><p className="mt-4 flex-1 text-sm leading-7 text-muted">{area.intro}</p><span className="mt-7 inline-flex text-xs font-black uppercase tracking-[0.18em] text-accent-blue transition group-hover:text-accent-cyan">{openLabel} <span className="ml-2 transition group-hover:translate-x-1">→</span></span></div></Link>))}</div>
          {!areas.length ? <div className="premium-panel mt-8 rounded-[1.5rem] p-6 text-muted"><div className="relative z-10">{emptyBlock?.body || fallback.empty}</div></div> : null}
        </section>
      </main>
      <Footer locale={activeLocale} />
      <MobileStickyCta locale={activeLocale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
