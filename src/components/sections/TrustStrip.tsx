import type { Locale } from '@/lib/content'

interface TrustStripProps {
  locale: Locale
}

const copy = {
  en: {
    title: 'Clear mobile locksmith support',
    items: [
      {
        title: '24/7 request intake',
        text: 'Urgent requests can be submitted any time. Same-day help depends on availability.',
      },
      {
        title: 'Full locksmith scope',
        text: 'Service pages cover auto, residential, commercial, access control, safe opening, rekeys, lock repair, and emergency help.',
      },
      {
        title: 'Philadelphia coverage',
        text: 'Primary service area is Philadelphia with a mobile dispatch model.',
      },
      {
        title: 'Straight intake flow',
        text: 'Call directly or send service, location, access, and issue details through the request form.',
      },
    ],
  },
  es: {
    title: 'Soporte móvil de cerrajería claro',
    items: [
      {
        title: 'Solicitudes 24/7',
        text: 'Las solicitudes urgentes pueden enviarse en cualquier momento. La ayuda el mismo día depende de disponibilidad.',
      },
      {
        title: 'Servicios completos',
        text: 'Las páginas cubren auto, residencial, comercial, access control, cajas fuertes, rekey, reparación y emergencias.',
      },
      {
        title: 'Cobertura en Filadelfia',
        text: 'La principal zona de servicio es Filadelfia con modelo de despacho móvil.',
      },
      {
        title: 'Proceso simple',
        text: 'Llama directamente o envía servicio, ubicación, acceso y detalles del problema mediante el formulario.',
      },
    ],
  },
  ru: {
    title: 'Понятный мобильный locksmith-сервис',
    items: [
      {
        title: 'Прием заявок 24/7',
        text: 'Срочные обращения можно отправлять в любое время. Same-day помощь зависит от загрузки.',
      },
      {
        title: 'Полный список услуг',
        text: 'На сайте есть авто, residential, commercial, access control, safe opening, rekey, ремонт замков и срочные заявки.',
      },
      {
        title: 'Покрытие по Филадельфии',
        text: 'Основная зона обслуживания — Филадельфия с мобильным форматом выезда.',
      },
      {
        title: 'Простой intake flow',
        text: 'Можно позвонить сразу или отправить услугу, локацию, доступ и проблему через форму.',
      },
    ],
  },
} as const

export default function TrustStrip({ locale }: TrustStripProps) {
  const t = copy[locale]

  return (
    <section className="border-y border-line bg-surface/60 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-accent-cyan">
            Trust layer
          </p>
          <h2 className="mt-2 text-2xl font-heading font-semibold text-text">
            {t.title}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-line bg-bg/80 p-5"
            >
              <h3 className="mb-2 text-base font-semibold text-text">{item.title}</h3>
              <p className="text-sm leading-6 text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
