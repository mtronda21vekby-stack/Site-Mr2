import type { Locale } from '@/components/layout/Header'

type InsuranceTrustSectionProps = {
  locale: Locale
}

const copy = {
  en: {
    eyebrow: 'Insurance & business details',
    title: 'Planet Locksmiths business information',
    intro: 'Business details from the provided screenshots are shown as text on the site instead of using screenshots as public images.',
    items: [
      ['Certificate of Liability Insurance', 'Certificate date shown: 05/16/2026. General liability coverage period shown: 05/16/2026 to 05/16/2027.'],
      ['Insurance carrier', 'Next Insurance US Company is listed on the certificate documentation provided for verification.'],
      ['Primary contact', 'Business phone: +1 (267) 612-2555. Email: planetlocksmits@gmail.com.'],
      ['Service scope', 'Automotive, residential, commercial, emergency 24/7, safe, access control, master key, panic bar, and high-security lock services.'],
    ],
  },
  es: {
    eyebrow: 'Seguro y datos del negocio',
    title: 'Información comercial de Planet Locksmiths',
    intro: 'Los datos de los screenshots proporcionados se muestran como texto en el sitio en lugar de usar screenshots como imágenes públicas.',
    items: [
      ['Certificate of Liability Insurance', 'Fecha mostrada del certificado: 05/16/2026. Periodo de cobertura mostrado: 05/16/2026 a 05/16/2027.'],
      ['Compañía de seguro', 'Next Insurance US Company aparece en la documentación del certificado proporcionada para verificación.'],
      ['Contacto principal', 'Teléfono: +1 (267) 612-2555. Email: planetlocksmits@gmail.com.'],
      ['Servicios', 'Automotriz, residencial, comercial, emergencia 24/7, cajas fuertes, access control, master key, panic bar y high-security locks.'],
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
