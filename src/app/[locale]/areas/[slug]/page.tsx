import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import ContactSection from '@/components/sections/ContactSection'
import {
  getAreaPageFromSource,
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const copy: Record<Locale, {
  eyebrow: string
  dispatch: string
  callNow: string
  request: string
  overview: string
  localInfo: string
  serviceReady: string
  customerPrep: string
  nearby: string
  faq: string
  prepItems: string[]
  serviceItems: string[]
  localItems: string[]
  faqItems: Array<[string, string]>
}> = {
  en: {
    eyebrow: 'Local automotive locksmith coverage',
    dispatch: 'Dispatch line',
    callNow: 'Call now',
    request: 'Request service',
    overview: 'Area overview',
    localInfo: 'Local service information',
    serviceReady: 'Services commonly requested here',
    customerPrep: 'What to prepare before service',
    nearby: 'Coverage notes',
    faq: 'Local questions',
    prepItems: ['Vehicle make, model, and year', 'Exact address, parking lot, or nearby landmark', 'Whether all keys are lost', 'Whether the vehicle is locked, running, or in a garage', 'Phone number for fast confirmation'],
    serviceItems: ['Car lockout help', 'Replacement car keys', 'Key fob and transponder programming', 'Broken key extraction', 'Ignition-related support'],
    localItems: ['Mobile service depends on technician availability and location', 'Response times may vary by traffic, distance, weather, and urgency', 'Final price depends on vehicle details, parts, and job complexity'],
    faqItems: [
      ['Do you come to this area?', 'This page represents a local coverage area. Availability should be confirmed when you call or submit a request.'],
      ['Can I request service without an exact address?', 'A ZIP code or nearby landmark helps, but exact location is usually needed before dispatch.'],
      ['Does the price change by area?', 'Distance, timing, vehicle, parts, and complexity can affect final pricing.'],
      ['What if my car is in a garage?', 'Tell us before service. Garages can affect access, tools, and vehicle movement.'],
    ],
  },
  es: {
    eyebrow: 'Cobertura local automotriz',
    dispatch: 'Línea de despacho',
    callNow: 'Llamar ahora',
    request: 'Solicitar servicio',
    overview: 'Resumen del área',
    localInfo: 'Información local',
    serviceReady: 'Servicios comunes aquí',
    customerPrep: 'Qué preparar',
    nearby: 'Notas de cobertura',
    faq: 'Preguntas locales',
    prepItems: ['Marca, modelo y año', 'Dirección, estacionamiento o referencia', 'Si perdió todas las llaves', 'Si el vehículo está cerrado, encendido o en garaje', 'Teléfono para confirmación'],
    serviceItems: ['Auto cerrado', 'Reemplazo de llaves', 'Programación de control y transponder', 'Extracción de llave rota', 'Soporte de ignición'],
    localItems: ['Servicio móvil depende de disponibilidad y ubicación', 'El tiempo varía por tráfico, distancia, clima y urgencia', 'El precio depende del vehículo, piezas y complejidad'],
    faqItems: [
      ['¿Llegan a esta área?', 'Esta página representa un área de cobertura. La disponibilidad debe confirmarse.'],
      ['¿Puedo pedir servicio sin dirección exacta?', 'ZIP o referencia ayuda, pero normalmente se necesita ubicación exacta.'],
      ['¿El precio cambia por área?', 'Distancia, horario, vehículo, piezas y complejidad pueden afectar el precio.'],
      ['¿Qué pasa si mi auto está en garaje?', 'Avísenos antes. Puede afectar acceso y herramientas.'],
    ],
  },
  ru: {
    eyebrow: 'Локальная зона авто-сервиса',
    dispatch: 'Линия диспетчера',
    callNow: 'Позвонить',
    request: 'Оставить заявку',
    overview: 'Описание района',
    localInfo: 'Локальная информация',
    serviceReady: 'Частые услуги здесь',
    customerPrep: 'Что подготовить',
    nearby: 'Заметки по покрытию',
    faq: 'Локальные вопросы',
    prepItems: ['Марка, модель и год автомобиля', 'Точный адрес, парковка или ориентир', 'Потеряны ли все ключи', 'Машина закрыта, заведена или в гараже', 'Телефон для подтверждения'],
    serviceItems: ['Открытие авто', 'Замена автомобильных ключей', 'Программирование брелков и transponder', 'Извлечение сломанного ключа', 'Помощь с зажиганием'],
    localItems: ['Мобильный сервис зависит от доступности и локации', 'Сроки зависят от трафика, расстояния, погоды и срочности', 'Цена зависит от авто, деталей и сложности'],
    faqItems: [
      ['Вы приезжаете в этот район?', 'Страница представляет зону покрытия. Доступность нужно подтвердить при звонке или заявке.'],
      ['Можно без точного адреса?', 'ZIP или ориентир помогает, но для выезда обычно нужен точный адрес.'],
      ['Цена зависит от района?', 'Расстояние, время, авто, детали и сложность могут влиять на цену.'],
      ['Если машина в гараже?', 'Сообщите заранее. Это влияет на доступ и инструменты.'],
    ],
  },
}

export default async function AreaDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  noStore()

  const { locale, slug } = await params
  const [global, home, area] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
    getAreaPageFromSource(locale, slug),
  ])

  if (!area) notFound()

  const page = copy[locale]
  const paragraphs = area.intro?.split('\n').filter(Boolean) ?? []
  const location = [area.city, area.state].filter(Boolean).join(', ') || area.title

  return (
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="relative overflow-hidden px-4 py-14 text-text sm:px-6 lg:px-8">
        <article className="mx-auto max-w-7xl">
          <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-accent-cyan">{page.eyebrow} / {area.city || slug}</p>
              <h1 className="max-w-5xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-7xl">{area.title}</h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">Mobile automotive locksmith coverage for {location}. Request help for lockouts, car keys, programming, broken keys, and ignition-related issues when service is available.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition hover:brightness-110">{page.callNow}</a>
                <a href="#request-service" className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-accent-gold transition hover:bg-accent-gold/15">{page.request}</a>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-accent-blue/20 bg-black/25 p-5 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">{page.dispatch}</p>
              <p className="mt-3 text-2xl font-semibold text-text">{global.phoneDisplay}</p>
              <p className="mt-3 text-sm leading-7 text-muted">Clear vehicle and location details help confirm availability and route the request faster.</p>
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_23rem]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-accent-gold">{page.overview}</p>
              {paragraphs.length ? <div className="space-y-5 text-base leading-8 text-muted">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> : <p className="text-base leading-8 text-muted">This area page is connected to the admin content system. Add localized area copy in the admin panel to expand this section.</p>}
            </div>

            <aside className="grid gap-4">
              <InfoBox title={page.customerPrep} items={page.prepItems} />
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <InfoBox title={page.serviceReady} items={area.supportedServices.length ? area.supportedServices : page.serviceItems} />
            <InfoBox title={page.localInfo} items={area.highlights.length ? area.highlights : page.localItems} />
            <InfoBox title={page.nearby} items={page.localItems} />
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.26em] text-accent-cyan">{page.faq}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {page.faqItems.map(([question, answer]) => (
                <div key={question} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-5">
                  <h2 className="font-semibold text-text">{question}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">{answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

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
