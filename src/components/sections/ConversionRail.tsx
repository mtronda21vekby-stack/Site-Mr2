import PremiumReveal from '@/components/motion/PremiumReveal'
import CallButton from '@/components/ui/CallButton'
import type { Locale } from '@/components/layout/Header'
import type { GlobalSettings, HomeContent } from '@/lib/content'

type ConversionRailProps = {
  locale: Locale
  global: GlobalSettings
  home: HomeContent
}

const labels: Record<Locale, { eyebrow: string; call: string; request: string; fallbackText: string }> = {
  en: {
    eyebrow: 'Fast service path',
    call: 'Call',
    request: 'Start request',
    fallbackText: 'For urgent lockouts, calling is usually fastest. For keys, fobs, rekeys, lock repair, safe opening, or scheduled help, send clear service details.',
  },
  es: {
    eyebrow: 'Ruta rápida de servicio',
    call: 'Llamar',
    request: 'Iniciar solicitud',
    fallbackText: 'Para bloqueos urgentes, llamar suele ser más rápido. Para llaves, controles, rekeys, cerraduras, cajas fuertes o citas, envíe detalles claros del servicio.',
  },
  ru: {
    eyebrow: 'Fast service path',
    call: 'Call',
    request: 'Start request',
    fallbackText: 'For urgent lockouts, calling is usually fastest. For keys, fobs, rekeys, lock repair, safe opening, or scheduled help, send clear service details.',
  },
}

export default function ConversionRail({ locale, global, home }: ConversionRailProps) {
  const copy = labels[locale]

  return (
    <section className="relative bg-transparent py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PremiumReveal className="premium-panel group relative overflow-hidden rounded-[1.75rem] p-5 transition duration-500 hover:-translate-y-1 hover:border-accent-blue/35 hover:shadow-[0_0_80px_rgba(77,162,255,0.10)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-accent-blue/0 blur-3xl transition duration-500 group-hover:bg-accent-blue/12" />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-accent-cyan">
                {copy.eyebrow}
              </p>
              <h2 className="max-w-3xl text-balance text-2xl font-semibold tracking-[-0.035em] text-text sm:text-3xl">
                {home.emergencyTitle}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                {home.emergencyText || home.contactText || copy.fallbackText}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[23rem]">
              <CallButton phoneNumber={global.phonePrimary} phoneDisplay={global.phoneDisplay} label={home.heroPrimaryCta || copy.call} className="shadow-[0_0_34px_rgba(77,162,255,0.26)] active:scale-[0.985]" />
              <a href="#request-service" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold active:scale-[0.985]">
                {home.heroSecondaryCta || copy.request}
              </a>
            </div>
          </div>
        </PremiumReveal>
      </div>
    </section>
  )
}
