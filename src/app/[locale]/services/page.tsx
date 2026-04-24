import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CinematicBackground from '@/components/layout/CinematicBackground'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import {
  getGlobalSettingsFromSource,
  getServicesListFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const copy: Record<Locale, { eyebrow: string; title: string; intro: string; call: string; request: string; cardPrefix: string; open: string; empty: string; sideTitle: string; sideText: string }> = {
  en: {
    eyebrow: 'Planetlocksmiths / services',
    title: 'Automotive Locksmith Services',
    intro: 'Mobile automotive locksmith help for lockouts, replacement keys, key fob programming, transponder keys, ignition issues, and broken key situations. Each service page explains what information is needed before booking.',
    call: 'Call',
    request: 'Request service',
    cardPrefix: 'Service',
    open: 'Open page',
    empty: 'No published services yet.',
    sideTitle: 'Service request ready',
    sideText: 'Choose a service page, review what details are needed, then call or submit a request with vehicle make, model, year, location, and urgency.',
  },
  es: {
    eyebrow: 'Planetlocksmiths / servicios',
    title: 'Servicios de cerrajería automotriz',
    intro: 'Soporte móvil de cerrajería automotriz para autos cerrados, reemplazo de llaves, programación de controles, llaves transponder, ignición y llaves rotas. Cada página explica qué información se necesita antes de reservar.',
    call: 'Llamar',
    request: 'Solicitar servicio',
    cardPrefix: 'Servicio',
    open: 'Abrir página',
    empty: 'No hay servicios publicados todavía.',
    sideTitle: 'Solicitud lista',
    sideText: 'Elija un servicio, revise qué datos se necesitan y luego llame o envíe una solicitud con vehículo, ubicación y urgencia.',
  },
  ru: {
    eyebrow: 'Planetlocksmiths / услуги',
    title: 'Автомобильные locksmith-услуги',
    intro: 'Мобильная помощь по автомобильным замкам и ключам: открытие авто, замена ключей, программирование брелков, transponder-ключи, зажигание и сломанные ключи. Каждая страница объясняет, какие данные нужны перед заявкой.',
    call: 'Позвонить',
    request: 'Оставить заявку',
    cardPrefix: 'Услуга',
    open: 'Открыть страницу',
    empty: 'Пока нет опубликованных услуг.',
    sideTitle: 'Заявка готова',
    sideText: 'Выберите услугу, проверьте какие данные нужны, затем позвоните или отправьте заявку с маркой, моделью, годом, локацией и срочностью.',
  },
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const labels = copy[locale]

  const [global, services] = await Promise.all([
    getGlobalSettingsFromSource(),
    getServicesListFromSource(locale),
  ])

  return (
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="relative overflow-hidden text-text">
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="premium-panel premium-hairline relative grid gap-8 overflow-hidden rounded-[2.25rem] p-6 sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div className="absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full border border-accent-blue/15" />
            <div className="absolute bottom-[-8rem] left-[-6rem] h-80 w-80 rounded-full bg-accent-gold/10 blur-3xl" />

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
              <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-text">{services.length}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-muted">Published modules</p>
            </aside>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Link key={service.slug} href={`/${locale}/services/${service.slug}`} className="group premium-panel premium-hairline relative flex min-h-[19rem] overflow-hidden rounded-[1.75rem] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-accent-blue/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(77,162,255,0.16),transparent_18rem)] opacity-80 transition group-hover:opacity-100" />
                <div className="absolute right-[-3.5rem] top-[-3.5rem] h-36 w-36 rounded-full border border-accent-gold/20 transition group-hover:scale-110 group-hover:border-accent-gold/35" />
                <div className="absolute bottom-[-5rem] left-[-4rem] h-40 w-40 rounded-full bg-accent-blue/10 blur-2xl transition group-hover:bg-accent-blue/18" />
                <div className="relative flex h-full flex-col">
                  <p className="mb-7 text-[0.65rem] font-black uppercase tracking-[0.22em] text-accent-gold">{labels.cardPrefix} {String(index + 1).padStart(2, '0')}</p>
                  <h2 className="text-balance text-2xl font-semibold tracking-[-0.035em] text-text">{service.title}</h2>
                  <p className="mt-4 flex-1 text-sm leading-7 text-muted">{service.excerpt}</p>
                  <span className="mt-7 inline-flex text-xs font-black uppercase tracking-[0.18em] text-accent-blue transition group-hover:text-accent-cyan">{labels.open} <span className="ml-2 transition group-hover:translate-x-1">→</span></span>
                </div>
              </Link>
            ))}
          </div>

          {!services.length ? <div className="premium-panel mt-8 rounded-[1.5rem] p-6 text-muted">{labels.empty}</div> : null}
        </section>
      </main>

      <Footer locale={locale} />
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
