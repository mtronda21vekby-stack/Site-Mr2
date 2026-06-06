import Link from 'next/link'
import type { Locale } from '@/components/layout/Header'

type ShowcaseCopy = {
  eyebrow: string
  title: string
  intro: string
  primaryCta: string
  secondaryCta: string
  panelTitle: string
  panelLead: string
  panelText: string
  items: Array<{
    label: string
    title: string
    text: string
  }>
  stats: Array<{
    value: string
    label: string
  }>
}

const copyByLocale: Record<Locale, ShowcaseCopy> = {
  en: {
    eyebrow: 'Service coverage',
    title: 'One mobile locksmith team for urgent access, keys, locks, and business security.',
    intro:
      'Planet Locksmiths covers the full locksmith scope: emergency lockouts, car keys and fobs, home rekeys, commercial locks, smart locks, access control, safes, and mailbox locks.',
    primaryCta: 'Call now',
    secondaryCta: 'Request service',
    panelTitle: '24/7 mobile response',
    panelLead: 'Emergency, residential, commercial, automotive, and access-control requests.',
    panelText:
      'Send the service type, location, urgency, and access details. Vehicle requests can include make, model, and year.',
    items: [
      {
        label: 'Emergency',
        title: 'Car, home, and business lockouts',
        text: 'Urgent locksmith help for lockouts, lost keys, broken keys, and access problems.',
      },
      {
        label: 'Keys',
        title: 'Programming, duplication, and fob support',
        text: 'Automotive keys, remotes, transponders, push-to-start keys, and practical duplication requests.',
      },
      {
        label: 'Locks',
        title: 'Rekey, repair, replacement, and install',
        text: 'Residential and commercial doors, mailbox locks, high-security locks, and hardware issues.',
      },
      {
        label: 'Access',
        title: 'Smart locks, master keys, safes, and access control',
        text: 'Security upgrades for homes, offices, storefronts, controlled doors, and specialty access needs.',
      },
    ],
    stats: [
      { value: '24/7', label: 'Emergency service' },
      { value: '30+', label: 'Locksmith services' },
      { value: '1', label: 'Clear request flow' },
    ],
  },
  es: {
    eyebrow: 'Cobertura de servicios',
    title: 'Un equipo móvil para acceso urgente, llaves, cerraduras y seguridad comercial.',
    intro:
      'Planet Locksmiths cubre emergencias, llaves y fobs de auto, rekey residencial, cerraduras comerciales, smart locks, access control, cajas fuertes y buzones.',
    primaryCta: 'Llamar ahora',
    secondaryCta: 'Solicitar servicio',
    panelTitle: 'Respuesta móvil 24/7',
    panelLead: 'Emergencias, residencial, comercial, automotriz y access control.',
    panelText:
      'Envía el tipo de servicio, ubicación, urgencia y detalles de acceso. Para vehículos, agrega marca, modelo y año.',
    items: [
      {
        label: 'Emergencia',
        title: 'Bloqueos de auto, casa y negocio',
        text: 'Ayuda urgente para bloqueos, llaves perdidas, llaves rotas y problemas de acceso.',
      },
      {
        label: 'Llaves',
        title: 'Programación, duplicación y soporte de fobs',
        text: 'Llaves automotrices, controles, transponders, push-to-start y copias prácticas.',
      },
      {
        label: 'Cerraduras',
        title: 'Rekey, reparación, reemplazo e instalación',
        text: 'Puertas residenciales y comerciales, buzones, cerraduras de alta seguridad y hardware.',
      },
      {
        label: 'Acceso',
        title: 'Smart locks, master keys, cajas fuertes y access control',
        text: 'Mejoras de seguridad para casas, oficinas, tiendas, puertas controladas y necesidades especiales.',
      },
    ],
    stats: [
      { value: '24/7', label: 'Servicio urgente' },
      { value: '30+', label: 'Servicios' },
      { value: '1', label: 'Flujo claro' },
    ],
  },
  ru: {
    eyebrow: 'Направления сервиса',
    title: 'Один мобильный locksmith-сервис для срочного доступа, ключей, замков и бизнеса.',
    intro:
      'Planet Locksmiths закрывает полный scope: emergency lockouts, car keys and fobs, residential rekey, commercial locks, smart locks, access control, safes и mailbox locks.',
    primaryCta: 'Позвонить',
    secondaryCta: 'Оставить заявку',
    panelTitle: 'Мобильный выезд 24/7',
    panelLead: 'Emergency, residential, commercial, automotive и access-control заявки.',
    panelText:
      'Укажите тип услуги, адрес, срочность и детали доступа. Для авто добавьте make, model и year.',
    items: [
      {
        label: 'Emergency',
        title: 'Lockout для авто, дома и бизнеса',
        text: 'Срочная помощь при lockout, потерянных ключах, сломанных ключах и проблемах доступа.',
      },
      {
        label: 'Keys',
        title: 'Programming, duplication и key fob support',
        text: 'Automotive keys, remotes, transponders, push-to-start keys и practical duplication requests.',
      },
      {
        label: 'Locks',
        title: 'Rekey, repair, replacement и installation',
        text: 'Residential и commercial doors, mailbox locks, high-security locks и hardware issues.',
      },
      {
        label: 'Access',
        title: 'Smart locks, master keys, safes и access control',
        text: 'Security upgrades для homes, offices, storefronts, controlled doors и specialty access needs.',
      },
    ],
    stats: [
      { value: '24/7', label: 'Emergency service' },
      { value: '30+', label: 'Locksmith services' },
      { value: '1', label: 'Понятная заявка' },
    ],
  },
}

function getCopy(locale: Locale) {
  return copyByLocale[locale] || copyByLocale.en
}

export default function ServiceScopeShowcase({
  locale,
  phoneNumber,
}: {
  locale: Locale
  phoneNumber: string
}) {
  const copy = getCopy(locale)

  return (
    <section className="relative border-y border-[#0B1F4D]/10 bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(18,58,115,0.06),transparent_30rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
        <div className="min-w-0">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[#123A73]">{copy.eyebrow}</p>
          <h2 className="max-w-4xl text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#0B1F4D] sm:text-5xl lg:text-6xl">
            {copy.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#42526E]">{copy.intro}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${phoneNumber}`}
              className="notranslate inline-flex min-h-12 items-center justify-center rounded-full bg-[#0B1F4D] px-7 py-3 text-sm font-black uppercase tracking-[0.13em] text-white shadow-[0_18px_42px_rgba(11,31,77,0.20)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#123A73] active:scale-[0.985]"
              translate="no"
            >
              {copy.primaryCta}
            </a>
            <Link
              href={`/${locale}/contact#request-service`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#0B1F4D]/22 bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.13em] text-[#0B1F4D] shadow-[0_16px_42px_rgba(11,31,77,0.10)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0B1F4D]/42 hover:bg-[#F3F7FF] active:scale-[0.985]"
            >
              {copy.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="grid min-w-0 gap-4">
          <div className="overflow-hidden rounded-2xl border border-[#0B1F4D]/14 bg-white shadow-[0_28px_90px_rgba(11,31,77,0.11)]">
            <div className="relative min-h-[17rem] overflow-hidden bg-[#0B1F4D] p-6 text-white sm:min-h-[20rem] sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(45,226,230,0.28),transparent_15rem),radial-gradient(circle_at_18%_86%,rgba(255,255,255,0.16),transparent_18rem)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.38)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.26)_1px,transparent_1px)] [background-size:44px_44px]" />

              <div className="relative z-10 flex h-full min-h-[14rem] flex-col justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-white/62">{copy.panelTitle}</p>
                  <p className="mt-4 max-w-md text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
                    {copy.panelLead}
                  </p>
                </div>
                <p className="mt-8 max-w-lg text-sm leading-7 text-white/72">{copy.panelText}</p>
              </div>
            </div>

            <div className="grid divide-y divide-[#0B1F4D]/10 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {copy.stats.map((stat) => (
                <div key={stat.label} className="p-5">
                  <p className="text-2xl font-black tracking-[-0.04em] text-[#0B1F4D]">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#42526E]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {copy.items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[#0B1F4D]/12 bg-white p-5 shadow-[0_18px_50px_rgba(11,31,77,0.07)]">
                <p className="text-[0.66rem] font-black uppercase tracking-[0.2em] text-[#123A73]">{item.label}</p>
                <h3 className="mt-3 text-xl font-semibold leading-6 tracking-[-0.03em] text-[#0B1F4D]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#42526E]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
