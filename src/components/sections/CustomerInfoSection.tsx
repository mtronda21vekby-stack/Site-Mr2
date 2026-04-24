import type { Locale } from '@/components/layout/Header'

type InfoBlock = {
  title: string
  text: string
  items?: string[]
}

const copy: Record<Locale, { eyebrow: string; title: string; intro: string; blocks: InfoBlock[] }> = {
  en: {
    eyebrow: 'Clear service information',
    title: 'Mobile automotive locksmith help, explained before you call.',
    intro:
      'Planetlocksmiths is built for customers who need fast, understandable automotive locksmith help. The information below explains what we do, what details we need, and how a typical request works.',
    blocks: [
      {
        title: 'What we can help with',
        text: 'We focus on mobile automotive locksmith service. Common requests include vehicle lockouts, lost keys, replacement car keys, key fob programming, transponder keys, broken key extraction, trunk lockouts, and ignition-related issues.',
        items: ['Car lockout service', 'Car key replacement', 'Key fob and transponder programming', 'Ignition and broken key support'],
      },
      {
        title: 'What to prepare',
        text: 'To respond faster, send your vehicle make, model, year, service location, phone number, and what happened. Some vehicles require specific key blanks, programming tools, or verification before service.',
        items: ['Vehicle make, model, year', 'Current location or ZIP code', 'Whether all keys are lost', 'Whether the vehicle is locked/running'],
      },
      {
        title: 'Pricing transparency',
        text: 'Final pricing depends on vehicle year, key type, parts availability, distance, time, and service complexity. A technician or dispatcher should confirm the service details before work begins.',
        items: ['No one-size-fits-all vehicle key price', 'Emergency and after-hours work may vary', 'Parts and programming needs affect total cost'],
      },
      {
        title: 'How service works',
        text: 'Submit a request or call. We collect vehicle details, confirm the situation, provide next-step information, and route the request for mobile service when available.',
        items: ['Request received', 'Vehicle details reviewed', 'Availability confirmed', 'Mobile service dispatched when possible'],
      },
    ],
  },
  es: {
    eyebrow: 'Información clara del servicio',
    title: 'Servicio móvil de cerrajería automotriz explicado antes de llamar.',
    intro:
      'Planetlocksmiths ayuda con solicitudes automotrices urgentes y programadas. La información explica qué hacemos, qué datos necesitamos y cómo funciona una solicitud típica.',
    blocks: [
      {
        title: 'Servicios comunes',
        text: 'Ayudamos con autos cerrados, llaves perdidas, reemplazo de llaves, programación de controles, llaves transponder, extracción de llave rota, baúl cerrado e ignición.',
        items: ['Auto cerrado', 'Reemplazo de llave', 'Programación de control', 'Problemas de ignición'],
      },
      {
        title: 'Qué preparar',
        text: 'Envíe marca, modelo, año, ubicación, teléfono y qué ocurrió. Algunos vehículos requieren herramientas o llaves específicas.',
        items: ['Marca, modelo y año', 'Ubicación o ZIP', 'Si perdió todas las llaves', 'Si el auto está cerrado o encendido'],
      },
      {
        title: 'Precios',
        text: 'El precio final depende del vehículo, tipo de llave, piezas, distancia, horario y complejidad del trabajo. Los detalles deben confirmarse antes del servicio.',
        items: ['El precio depende del vehículo', 'Emergencias pueden variar', 'Piezas y programación afectan el total'],
      },
      {
        title: 'Proceso',
        text: 'Llame o envíe una solicitud. Revisamos los datos, confirmamos disponibilidad y enviamos servicio móvil cuando sea posible.',
        items: ['Solicitud recibida', 'Datos revisados', 'Disponibilidad confirmada', 'Servicio móvil cuando sea posible'],
      },
    ],
  },
  ru: {
    eyebrow: 'Понятная информация об услуге',
    title: 'Мобильная авто-слесарная помощь: понятно до звонка.',
    intro:
      'Planetlocksmiths помогает с автомобильными ключами, замками и срочными ситуациями. Ниже объяснено, что мы делаем, какие данные нужны и как обычно проходит заявка.',
    blocks: [
      {
        title: 'С чем помогаем',
        text: 'Основной фокус — автомобильные услуги: заблокированная машина, потерянные ключи, замена ключей, программирование брелков и transponder-ключей, сломанный ключ, багажник, зажигание.',
        items: ['Открытие авто', 'Замена ключа', 'Программирование брелка', 'Проблемы с зажиганием'],
      },
      {
        title: 'Что подготовить',
        text: 'Для быстрой обработки нужны марка, модель, год машины, локация, телефон и описание проблемы. Для некоторых авто нужны специальные заготовки или оборудование.',
        items: ['Марка, модель, год', 'Адрес или ZIP', 'Все ключи потеряны или нет', 'Машина закрыта/заведена или нет'],
      },
      {
        title: 'Прозрачность цены',
        text: 'Финальная цена зависит от машины, типа ключа, деталей, расстояния, времени и сложности работы. Детали должны подтверждаться до начала услуги.',
        items: ['Цена зависит от автомобиля', 'Срочные вызовы могут отличаться', 'Детали и программирование влияют на стоимость'],
      },
      {
        title: 'Как проходит заявка',
        text: 'Вы звоните или отправляете форму. Мы смотрим детали машины, уточняем ситуацию, подтверждаем доступность и направляем мобильный сервис, если возможно.',
        items: ['Заявка получена', 'Данные проверены', 'Доступность подтверждена', 'Мобильный выезд при возможности'],
      },
    ],
  },
}

export default function CustomerInfoSection({ locale }: { locale: Locale }) {
  const content = copy[locale]

  return (
    <section className="relative overflow-hidden bg-transparent py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(77,162,255,0.08),transparent_28rem)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">
            {content.eyebrow}
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-muted">{content.intro}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {content.blocks.map((block, index) => (
            <article key={block.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-blue text-sm font-bold text-black">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-text">{block.title}</h3>
              </div>
              <p className="text-sm leading-7 text-muted">{block.text}</p>
              {block.items?.length ? (
                <ul className="mt-5 grid gap-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-text/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
