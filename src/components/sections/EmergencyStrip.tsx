import type { Locale } from '@/components/layout/Header'

interface EmergencyStripProps {
  title: string
  text: string
  phoneNumber: string
  phoneDisplay: string
  locale: Locale
}

const requestLabels: Record<Locale, { eyebrow: string; request: string; callPrefix: string }> = {
  en: { eyebrow: 'Emergency channel open', request: 'Request service', callPrefix: 'Call' },
  es: { eyebrow: 'Canal de emergencia activo', request: 'Solicitar servicio', callPrefix: 'Llamar' },
  ru: { eyebrow: 'Экстренный канал активен', request: 'Оставить заявку', callPrefix: 'Позвонить' },
}

export default function EmergencyStrip({
  title,
  text,
  phoneNumber,
  phoneDisplay,
  locale,
}: EmergencyStripProps) {
  const labels = requestLabels[locale]

  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-12 sm:px-6 lg:px-8">
      <div className="premium-panel premium-hairline mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="absolute left-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-accent-blue/18 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-[-5rem] h-72 w-72 rounded-full bg-accent-gold/14 blur-3xl" />
        <div className="absolute right-8 top-8 hidden h-32 w-32 rounded-full border border-accent-blue/15 md:block" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">
              {labels.eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.045em] text-text sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
              {text}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <a
              href={`tel:${phoneNumber}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.18em] text-black shadow-[0_0_44px_rgba(77,162,255,0.34)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              {labels.callPrefix} {phoneDisplay}
            </a>
            <a
              href={`/${locale}/contact#request-service`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-black/25 px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/50 hover:bg-accent-gold/10 hover:text-accent-gold"
            >
              {labels.request}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
