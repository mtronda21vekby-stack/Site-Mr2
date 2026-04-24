import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import ContactSection from '@/components/sections/ContactSection'
import {
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
  getServicePageFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const pageCopy: Record<Locale, {
  eyebrow: string
  emergencyLine: string
  callNow: string
  requestService: string
  overview: string
  whatWeDo: string
  whatWeNeed: string
  priceFactors: string
  process: string
  authorization: string
  beforeCalling: string
  faq: string
  processItems: Array<[string, string]>
  neededItems: string[]
  factorItems: string[]
  trustItems: Array<[string, string]>
  faqItems: Array<[string, string]>
}> = {
  en: {
    eyebrow: 'Automotive locksmith service',
    emergencyLine: 'Emergency line',
    callNow: 'Call now',
    requestService: 'Request service',
    overview: 'Service overview',
    whatWeDo: 'What this service includes',
    whatWeNeed: 'Information we need',
    priceFactors: 'What affects price and timing',
    process: 'How the request works',
    authorization: 'Authorization notice',
    beforeCalling: 'Before you call or submit the form',
    faq: 'Common questions',
    processItems: [
      ['Send details', 'Provide the service needed, vehicle make, model, year, location, phone number, and urgency.'],
      ['Review request', 'The details help determine what tools, key type, parts, or programming steps may be needed.'],
      ['Confirm next step', 'Availability, timing, and service details should be confirmed before work begins.'],
      ['Mobile service', 'When available, mobile automotive locksmith service can be routed to the requested location.'],
    ],
    neededItems: ['Vehicle make, model, and year', 'Current location or ZIP code', 'Whether all keys are lost', 'Whether the vehicle is locked, running, or in a garage', 'Phone number for fast confirmation'],
    factorItems: ['Vehicle security system and key type', 'Key blank or fob availability', 'Programming requirements', 'Distance and service area', 'Emergency, after-hours, or same-day timing', 'Lock, ignition, or key damage condition'],
    trustItems: [
      ['Mobile automotive focus', 'Built around car lockouts, keys, fobs, transponders, and ignition-related requests.'],
      ['Clear request flow', 'The form collects the details needed to avoid vague callbacks and slow dispatch.'],
      ['Customer-safe language', 'The page explains limitations, authorization, pricing variables, and service availability.'],
    ],
    faqItems: [
      ['Can every vehicle key be made immediately?', 'Not always. Availability depends on make, model, year, key type, programming system, and parts availability.'],
      ['Why do you need the year, make, and model?', 'Automotive keys and fobs are vehicle-specific. The correct information helps identify the right blank, fob, and programming process.'],
      ['Is the price fixed online?', 'No. Final pricing depends on vehicle details, service complexity, distance, timing, and parts or programming needs.'],
      ['Do I need to prove I can access the vehicle?', 'You may be asked to confirm authorization before service. Service can be declined if authorization is unclear.'],
    ],
  },
  es: {
    eyebrow: 'Servicio de cerrajería automotriz',
    emergencyLine: 'Línea de emergencia',
    callNow: 'Llamar ahora',
    requestService: 'Solicitar servicio',
    overview: 'Resumen del servicio',
    whatWeDo: 'Qué incluye este servicio',
    whatWeNeed: 'Información necesaria',
    priceFactors: 'Qué afecta precio y tiempo',
    process: 'Cómo funciona la solicitud',
    authorization: 'Aviso de autorización',
    beforeCalling: 'Antes de llamar o enviar el formulario',
    faq: 'Preguntas comunes',
    processItems: [
      ['Enviar detalles', 'Indique servicio, marca, modelo, año, ubicación, teléfono y urgencia.'],
      ['Revisar solicitud', 'Los detalles ayudan a identificar herramientas, tipo de llave, piezas o programación.'],
      ['Confirmar siguiente paso', 'Disponibilidad, horario y detalles deben confirmarse antes del trabajo.'],
      ['Servicio móvil', 'Cuando esté disponible, el servicio móvil puede enviarse a la ubicación.'],
    ],
    neededItems: ['Marca, modelo y año', 'Ubicación o ZIP', 'Si perdió todas las llaves', 'Si el vehículo está cerrado, encendido o en garaje', 'Teléfono para confirmación rápida'],
    factorItems: ['Sistema de seguridad y tipo de llave', 'Disponibilidad de llave o control', 'Programación requerida', 'Distancia y área', 'Emergencia o horario especial', 'Condición de cerradura, ignición o llave'],
    trustItems: [
      ['Enfoque automotriz móvil', 'Para autos cerrados, llaves, controles, transponders e ignición.'],
      ['Flujo claro', 'El formulario recoge datos importantes para evitar retrasos.'],
      ['Información transparente', 'Explica limitaciones, autorización, precio variable y disponibilidad.'],
    ],
    faqItems: [
      ['¿Toda llave se puede hacer inmediatamente?', 'No siempre. Depende de marca, modelo, año, tipo de llave, programación y piezas.'],
      ['¿Por qué necesitan año, marca y modelo?', 'Las llaves y controles son específicos del vehículo.'],
      ['¿El precio está fijo online?', 'No. Depende del vehículo, complejidad, distancia, horario y piezas.'],
      ['¿Necesito probar autorización?', 'Puede solicitarse confirmación de autorización antes del servicio.'],
    ],
  },
  ru: {
    eyebrow: 'Автомобильная locksmith-услуга',
    emergencyLine: 'Срочная линия',
    callNow: 'Позвонить',
    requestService: 'Оставить заявку',
    overview: 'Описание услуги',
    whatWeDo: 'Что входит в услугу',
    whatWeNeed: 'Какая информация нужна',
    priceFactors: 'Что влияет на цену и сроки',
    process: 'Как проходит заявка',
    authorization: 'Подтверждение доступа',
    beforeCalling: 'Перед звонком или заявкой',
    faq: 'Частые вопросы',
    processItems: [
      ['Отправьте детали', 'Укажите услугу, марку, модель, год, локацию, телефон и срочность.'],
      ['Проверка заявки', 'Данные помогают понять инструменты, тип ключа, детали или программирование.'],
      ['Подтверждение шага', 'Доступность, время и детали должны подтверждаться до начала работы.'],
      ['Мобильный сервис', 'Если доступно, мобильный специалист может быть направлен к локации.'],
    ],
    neededItems: ['Марка, модель и год автомобиля', 'Адрес или ZIP', 'Потеряны ли все ключи', 'Машина закрыта, заведена или в гараже', 'Телефон для быстрого подтверждения'],
    factorItems: ['Система безопасности и тип ключа', 'Наличие заготовки или брелка', 'Требования программирования', 'Расстояние и зона покрытия', 'Срочность или нерабочее время', 'Состояние замка, зажигания или ключа'],
    trustItems: [
      ['Автомобильный фокус', 'Сайт построен вокруг авто-замков, ключей, брелков, transponder и зажигания.'],
      ['Понятная заявка', 'Форма собирает нужные данные, чтобы избежать лишних уточнений.'],
      ['Прозрачная информация', 'Объясняет ограничения, авторизацию, переменную цену и доступность.'],
    ],
    faqItems: [
      ['Можно ли сделать любой ключ сразу?', 'Не всегда. Это зависит от марки, модели, года, типа ключа, системы и наличия деталей.'],
      ['Зачем нужен год, марка и модель?', 'Ключи и брелки зависят от конкретного автомобиля.'],
      ['Цена фиксирована на сайте?', 'Нет. Итог зависит от автомобиля, сложности, расстояния, времени и деталей.'],
      ['Нужно подтверждать доступ к машине?', 'Да, может потребоваться подтверждение авторизации перед услугой.'],
    ],
  },
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  noStore()

  const { locale, slug } = await params
  const [global, home, service] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
    getServicePageFromSource(locale, slug),
  ])

  if (!service) notFound()

  const copy = pageCopy[locale]
  const paragraphs = service.intro?.split('\n').filter(Boolean) ?? []

  return (
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="relative overflow-hidden px-4 py-14 text-text sm:px-6 lg:px-8">
        <article className="mx-auto max-w-7xl">
          <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-accent-cyan">{copy.eyebrow}</p>
              <h1 className="max-w-5xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-7xl">{service.title}</h1>
              {service.excerpt ? <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">{service.excerpt}</p> : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition hover:brightness-110">{copy.callNow}</a>
                <a href="#request-service" className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-accent-gold transition hover:bg-accent-gold/15">{copy.requestService}</a>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-accent-blue/20 bg-black/25 p-5 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">{copy.emergencyLine}</p>
              <p className="mt-3 text-2xl font-semibold text-text">{global.phoneDisplay}</p>
              <p className="mt-3 text-sm leading-7 text-muted">Mobile automotive locksmith requests are handled faster when vehicle details and location are clear.</p>
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_23rem]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-accent-gold">{copy.overview}</p>
              {paragraphs.length ? (
                <div className="space-y-5 text-base leading-8 text-muted">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
              ) : (
                <p className="text-base leading-8 text-muted">This service page is connected to the admin content system. Add more localized service copy in the admin panel to expand this section.</p>
              )}
            </div>

            <aside className="grid gap-4">
              {copy.trustItems.map(([title, text]) => (
                <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                  <h2 className="text-lg font-semibold text-text">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">{text}</p>
                </div>
              ))}
            </aside>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <InfoPanel title={copy.whatWeNeed} items={copy.neededItems} accent="blue" />
            <InfoPanel title={copy.priceFactors} items={copy.factorItems} accent="gold" />
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-accent-cyan">{copy.authorization}</p>
              <p className="text-sm leading-7 text-muted">Customers may be asked to confirm authorization to access or service the vehicle. Service may be declined if ownership, authorization, safety, or legal concerns cannot be reasonably resolved.</p>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.26em] text-accent-cyan">{copy.process}</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {copy.processItems.map(([title, text], index) => (
                <div key={title} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-blue text-sm font-bold text-black">{index + 1}</span>
                  <h3 className="mt-4 font-semibold text-text">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.26em] text-accent-gold">{copy.faq}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {copy.faqItems.map(([question, answer]) => (
                <div key={question} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-5">
                  <h3 className="font-semibold text-text">{question}</h3>
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

function InfoPanel({ title, items, accent }: { title: string; items: string[]; accent: 'blue' | 'gold' }) {
  const colorClass = accent === 'blue' ? 'text-accent-cyan' : 'text-accent-gold'
  const dotClass = accent === 'blue' ? 'bg-accent-blue' : 'bg-accent-gold'

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
      <p className={`mb-5 text-xs font-bold uppercase tracking-[0.22em] ${colorClass}`}>{title}</p>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-text/85">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
