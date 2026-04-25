import type { Locale } from '@/components/layout/Header'

interface EmergencyStripProps {
  title: string
  text: string
  phoneNumber: string
  phoneDisplay: string
  locale: Locale
}

const requestLabels: Record<Locale, { eyebrow: string; request: string; callPrefix: string }> = {
  en: { eyebrow: 'Emergency service request', request: 'Request service', callPrefix: 'Call' },
  es: { eyebrow: 'Solicitud de emergencia', request: 'Solicitar servicio', callPrefix: 'Llamar' },
  ru: { eyebrow: 'Emergency service request', request: 'Request service', callPrefix: 'Call' },
}

export default function EmergencyStrip({ title, text, phoneNumber, phoneDisplay, locale }: EmergencyStripProps) {
  const labels = requestLabels[locale]
  const activeLocale = locale === 'es' ? 'es' : 'en'

  return (
    <section className="relative bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="premium-panel mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] p-6 sm:p-8">
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-accent-cyan">{labels.eyebrow}</p>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.045em] text-text sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base sm:leading-8">{text}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <a href={`tel:${phoneNumber}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_28px_rgba(77,162,255,0.24)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
              {labels.callPrefix} {phoneDisplay}
            </a>
            <a href={`/${activeLocale}/contact#request-service`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/45 hover:bg-accent-gold/10 hover:text-accent-gold">
              {labels.request}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
