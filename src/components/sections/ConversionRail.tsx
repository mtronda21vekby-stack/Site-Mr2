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
    call: 'Call now',
    request: 'Start request',
    fallbackText: 'For urgent vehicle lockouts, calling is usually fastest. For keys, fobs, or scheduled help, submit the request form with vehicle details.',
  },
  es: {
    eyebrow: 'Ruta rápida de servicio',
    call: 'Llamar ahora',
    request: 'Iniciar solicitud',
    fallbackText: 'Para autos cerrados urgentes, llamar suele ser más rápido. Para llaves, controles o citas, envíe el formulario con datos del vehículo.',
  },
  ru: {
    eyebrow: 'Fast service path',
    call: 'Call now',
    request: 'Start request',
    fallbackText: 'For urgent vehicle lockouts, calling is usually fastest. For keys, fobs, or scheduled help, submit the request form with vehicle details.',
  },
}

export default function ConversionRail({ locale, global, home }: ConversionRailProps) {
  const copy = labels[locale]

  return (
    <section className="relative bg-transparent py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="premium-panel relative overflow-hidden rounded-[1.75rem] p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />

          <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
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
              <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-black shadow-[0_0_28px_rgba(77,162,255,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
                {home.heroPrimaryCta || copy.call}
              </a>
              <a href="#request-service" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold">
                {home.heroSecondaryCta || copy.request}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
