import type { Locale } from '@/lib/content'

interface TrustStripProps {
  locale: Locale
}

const copy = {
  en: {
    title: 'Reliable mobile locksmith service',
    items: [
      {
        title: '24/7 emergency service',
        text: 'Call any time for urgent lockouts, lost keys, broken keys, and access problems.',
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
        title: 'Straight service flow',
        text: 'Call directly or send service, location, access, and issue details through the contact form.',
      },
    ],
  },
  es: {
    title: 'Soporte móvil de cerrajería claro',
    items: [
      {
        title: 'Servicio de emergencia 24/7',
        text: 'Llama en cualquier momento para bloqueos urgentes, llaves perdidas, llaves rotas y problemas de acceso.',
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
        title: 'Простой сервисный процесс',
        text: 'Можно позвонить сразу или отправить услугу, локацию, доступ и проблему через форму.',
      },
    ],
  },
} as const

export default function TrustStrip({ locale }: TrustStripProps) {
  const t = copy[locale]

  return (
    <section className="relative border-y border-line bg-white py-12 sm:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(11,31,77,0.05),transparent_30rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_100%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-7 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-accent-cyan">
            Why customers call
          </p>
          <h2 className="mt-3 text-balance text-3xl font-heading font-semibold tracking-[-0.04em] text-text sm:text-4xl">
            {t.title}
          </h2>
        </div>

        <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.items.map((item, index) => (
            <article
              key={item.title}
              className="premium-panel premium-hairline rounded-[1.35rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#0B1F4D]/28"
            >
              <div className="relative z-10 mb-4 flex items-center justify-between gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-xs font-black text-accent-cyan">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="relative z-10 mb-2 text-base font-semibold text-text">{item.title}</h3>
              <p className="relative z-10 text-sm leading-6 text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
