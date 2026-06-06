import PremiumReveal from '@/components/motion/PremiumReveal'
import CallButton from '@/components/ui/CallButton'
import type { Locale } from '@/components/layout/Header'

interface EmergencyStripProps {
  title: string
  text: string
  phoneNumber: string
  phoneDisplay: string
  locale: Locale
}

const requestLabels: Record<Locale, { eyebrow: string; request: string; callPrefix: string }> = {
  en: { eyebrow: 'Emergency locksmith service', request: 'Request service', callPrefix: 'Call' },
  es: { eyebrow: 'Servicio de emergencia', request: 'Solicitar servicio', callPrefix: 'Llamar' },
  ru: { eyebrow: 'Emergency locksmith service', request: 'Request service', callPrefix: 'Call' },
}

export default function EmergencyStrip({ title, text, phoneNumber, phoneDisplay, locale }: EmergencyStripProps) {
  const labels = requestLabels[locale === 'es' ? 'es' : 'en']
  const activeLocale = locale === 'es' ? 'es' : 'en'

  return (
    <section className="relative bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <PremiumReveal className="premium-panel group relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] p-6 transition duration-500 hover:-translate-y-1 hover:border-accent-blue/35 hover:shadow-[0_0_84px_rgba(77,162,255,0.12)] sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent-blue/0 blur-3xl transition duration-500 group-hover:bg-accent-blue/14" />
        <div className="pointer-events-none absolute -bottom-24 left-12 h-44 w-44 rounded-full bg-accent-gold/0 blur-3xl transition duration-500 group-hover:bg-accent-gold/10" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-accent-cyan">{labels.eyebrow}</p>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.045em] text-text sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base sm:leading-8">{text}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <CallButton phoneNumber={phoneNumber} phoneDisplay={phoneDisplay} label={labels.callPrefix} className="shadow-[0_0_34px_rgba(77,162,255,0.28)] active:scale-[0.985]" />
            <a href={`/${activeLocale}/contact#request-service`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/[0.075] px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/45 hover:bg-accent-gold/12 hover:text-accent-gold active:scale-[0.985]">
              {labels.request}
            </a>
          </div>
        </div>
      </PremiumReveal>
    </section>
  )
}
