import type { Locale } from '@/components/layout/Header'

type InsuranceTrustSectionProps = {
  locale: Locale
}

const copy = {
  en: {
    eyebrow: 'Verified business details',
    title: 'Planet Locksmiths credentials and contact information',
    intro: 'Customer reference details for insurance, service scope, and direct contact before booking locksmith service.',
    items: [
      ['Certificate of Liability Insurance', 'Certificate date: May 16, 2026. General liability coverage period: May 16, 2026 through May 16, 2027.'],
      ['Insurance carrier', 'Next Insurance US Company is listed as the insurance carrier on the certificate.'],
      ['Direct contact', 'Call +1 (267) 612-2555 or email planetlocksmits@gmail.com for locksmith service.'],
      ['Service scope', '24/7 emergency, automotive, residential, commercial, smart lock, access control, safe, mailbox, master key, panic bar, and high-security lock service.'],
    ],
  },
  es: {
    eyebrow: 'Datos verificados del negocio',
    title: 'Credenciales y contacto de Planet Locksmiths',
    intro: 'Información de referencia para clientes sobre seguro, servicios y contacto directo antes de solicitar cerrajería.',
    items: [
      ['Certificate of Liability Insurance', 'Fecha del certificado: 16 de mayo de 2026. Periodo de cobertura: 16 de mayo de 2026 a 16 de mayo de 2027.'],
      ['Compañía de seguro', 'Next Insurance US Company figura como compañía de seguro en el certificado.'],
      ['Contacto directo', 'Llama al +1 (267) 612-2555 o escribe a planetlocksmits@gmail.com para servicio de cerrajería.'],
      ['Servicios', 'Emergencia 24/7, automotriz, residencial, comercial, smart locks, access control, cajas fuertes, buzones, master key, panic bar y high-security locks.'],
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
