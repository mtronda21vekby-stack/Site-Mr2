import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CinematicBackground from '@/components/layout/CinematicBackground'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import {
  getAreasListFromSource,
  getGlobalSettingsFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const copy: Record<Locale, { eyebrow: string; title: string; intro: string; call: string; request: string; cardPrefix: string; open: string; empty: string; sideTitle: string; sideText: string }> = {
  en: {
    eyebrow: 'Planetlocksmiths / coverage',
    title: 'Service Areas',
    intro: 'Mobile automotive locksmith coverage pages help customers understand where service may be available, what support is offered, and what vehicle details are needed before requesting help.',
    call: 'Call',
    request: 'Request service',
    cardPrefix: 'Coverage',
    open: 'Open page',
    empty: 'No published areas yet.',
    sideTitle: 'Orbital coverage grid',
    sideText: 'Coverage depends on technician availability, location, distance, vehicle type, parts, timing, and job complexity.',
  },
  es: {
    eyebrow: 'Planetlocksmiths / cobertura',
    title: 'Áreas de servicio',
    intro: 'Las páginas de cobertura móvil ayudan a los clientes a entender dónde puede estar disponible el servicio, qué soporte se ofrece y qué datos del vehículo se necesitan antes de solicitar ayuda.',
    call: 'Llamar',
    request: 'Solicitar servicio',
    cardPrefix: 'Cobertura',
    open: 'Abrir página',
    empty: 'No hay áreas publicadas todavía.',
    sideTitle: 'Mapa de cobertura',
    sideText: 'La cobertura depende de disponibilidad, ubicación, distancia, tipo de vehículo, piezas, horario y complejidad.',
  },
  ru: {
    eyebrow: 'Planetlocksmiths / покрытие',
    title: 'Районы обслуживания',
    intro: 'Страницы мобильного покрытия помогают клиентам понять, где может быть доступен сервис, какие услуги возможны и какие данные автомобиля нужны перед заявкой.',
    call: 'Позвонить',
    request: 'Оставить заявку',
    cardPrefix: 'Покрытие',
    open: 'Открыть страницу',
    empty: 'Пока нет опубликованных районов.',
    sideTitle: 'Сетка покрытия',
    sideText: 'Покрытие зависит от доступности техника, локации, расстояния, типа автомобиля, деталей, времени и сложности.',
  },
}

export default async function AreasIndexPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const labels = copy[locale]

  const [global, areas] = await Promise.all([
    getGlobalSettingsFromSource(),
    getAreasListFromSource(locale),
  ])

  return (
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="relative overflow-hidden text-text">
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="premium-panel premium-hairline relative grid gap-8 overflow-hidden rounded-[2.25rem] p-6 sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div className="absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full border border-accent-cyan/15" />
            <div className="absolute bottom-[-8rem] left-[-6rem] h-80 w-80 rounded-full bg-accent-blue/10 blur-3xl" />

            <div className="relative">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-accent-cyan">{labels.eyebrow}</p>
              <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{labels.title}</h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{labels.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">{labels.call} {global.phoneDisplay}</a>
                <Link href={`/${locale}/contact#request-service`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-accent-gold transition duration-300 hover:-translate-y-0.5 hover:bg-accent-gold/15">{labels.request}</Link>
              </div>
            </div>

            <aside className="premium-panel relative rounded-[1.5rem] p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-accent-gold">{labels.sideTitle}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{labels.sideText}</p>
              <div className="mt-5 h-px bg-gradient-to-r from-transparent via-accent-blue/35 to-transparent" />
              <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-text">{areas.length}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-muted">Published zones</p>
            </aside>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {areas.map((area, index) => (
              <Link key={area.slug} href={`/${locale}/areas/${area.slug}`} className="group premium-panel premium-hairline relative flex min-h-[19rem] overflow-hidden rounded-[1.75rem] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-accent-blue/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(45,226,230,0.13),transparent_18rem)] opacity-85 transition group-hover:opacity-100" />
                <div className="absolute right-[-3.5rem] top-[-3.5rem] h-36 w-36 rounded-full border border-accent-blue/20 transition group-hover:scale-110 group-hover:border-accent-blue/35" />
                <div className="absolute bottom-[-5rem] left-[-4rem] h-40 w-40 rounded-full bg-accent-gold/10 blur-2xl transition group-hover:bg-accent-gold/16" />
                <div className="relative flex h-full flex-col">
                  <p className="mb-7 text-[0.65rem] font-black uppercase tracking-[0.22em] text-accent-gold">{labels.cardPrefix} {String(index + 1).padStart(2, '0')}</p>
                  <h2 className="text-balance text-2xl font-semibold tracking-[-0.035em] text-text">{area.title}</h2>
                  <p className="mt-2 text-sm font-semibold text-accent-cyan/80">{[area.city, area.state].filter(Boolean).join(', ')}</p>
                  <p className="mt-4 flex-1 text-sm leading-7 text-muted">{area.intro}</p>
                  <span className="mt-7 inline-flex text-xs font-black uppercase tracking-[0.18em] text-accent-blue transition group-hover:text-accent-cyan">{labels.open} <span className="ml-2 transition group-hover:translate-x-1">→</span></span>
                </div>
              </Link>
            ))}
          </div>

          {!areas.length ? <div className="premium-panel mt-8 rounded-[1.5rem] p-6 text-muted">{labels.empty}</div> : null}
        </section>
      </main>

      <Footer locale={locale} />
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
