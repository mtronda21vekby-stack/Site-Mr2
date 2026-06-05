import type { Locale } from '@/components/layout/Header'

type InsuranceTrustSectionProps = {
  locale: Locale
}

const copy = {
  en: {
    eyebrow: 'Proof & readiness',
    title: 'Insured locksmith service with clear job details',
    intro: 'Proof of liability insurance is available for verification. Every request is routed by service type, location, urgency, and authorization details before work begins.',
    items: [
      ['Insurance proof', 'Certificate documentation can be provided for verification when needed.'],
      ['Full service list', 'Auto, residential, commercial, access control, safe, mailbox, rekey, and emergency locksmith requests.'],
      ['Direct business line', '+1 (267) 612-2555 is the primary phone number for urgent calls and callbacks.'],
      ['Clear authorization', 'Customers may be asked to confirm access rights before lock, key, safe, or vehicle work starts.'],
    ],
  },
  es: {
    eyebrow: 'Prueba y preparación',
    title: 'Servicio de cerrajería asegurado con detalles claros',
    intro: 'La prueba de seguro de responsabilidad está disponible para verificación. Cada solicitud se orienta por tipo de servicio, ubicación, urgencia y autorización antes de comenzar.',
    items: [
      ['Prueba de seguro', 'La documentación del certificado puede proporcionarse para verificación cuando sea necesario.'],
      ['Lista completa', 'Auto, residencial, comercial, access control, cajas fuertes, buzones, rekey y emergencias.'],
      ['Línea directa', '+1 (267) 612-2555 es el teléfono principal para urgencias y callbacks.'],
      ['Autorización clara', 'Puede pedirse confirmación de derecho de acceso antes de trabajar en cerraduras, llaves, cajas fuertes o vehículos.'],
    ],
  },
} as const

export default function InsuranceTrustSection({ locale }: InsuranceTrustSectionProps) {
  const activeLocale = locale === 'es' ? 'es' : 'en'
  const t = copy[activeLocale]

  return (
    <section className="relative bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#F7FAFF_0%,#FFFFFF_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-[#123A73]">{t.eyebrow}</p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-[#0B1F4D] sm:text-5xl">{t.title}</h2>
          <p className="mt-5 text-base leading-8 text-[#42526E]">{t.intro}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {t.items.map(([title, text]) => (
            <article key={title} className="rounded-[1.35rem] border border-[#0B1F4D]/14 bg-white p-5 shadow-[0_18px_52px_rgba(11,31,77,0.08)]">
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#0B1F4D]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#42526E]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
