import type { Locale } from '@/components/layout/Header'
import type { GlobalSettings, HomeContent } from '@/lib/content'

type ConversionRailProps = {
  locale: Locale
  global: GlobalSettings
  home: HomeContent
}

const labels: Record<Locale, { eyebrow: string; title: string; call: string; request: string; live: string }> = {
  en: {
    eyebrow: 'Fast decision panel',
    title: 'Call, request service, or review the details before booking.',
    call: 'Call now',
    request: 'Start request',
    live: 'Mobile service request system online',
  },
  es: {
    eyebrow: 'Panel rápido',
    title: 'Llame, solicite servicio o revise los detalles antes de reservar.',
    call: 'Llamar ahora',
    request: 'Iniciar solicitud',
    live: 'Sistema de solicitud móvil activo',
  },
  ru: {
    eyebrow: 'Быстрая панель выбора',
    title: 'Позвоните, оставьте заявку или проверьте детали перед заказом.',
    call: 'Позвонить',
    request: 'Начать заявку',
    live: 'Система мобильных заявок активна',
  },
}

export default function ConversionRail({ locale, global, home }: ConversionRailProps) {
  const copy = labels[locale]

  return (
    <section className="relative overflow-hidden bg-transparent py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="premium-panel premium-hairline relative overflow-hidden rounded-[2rem] p-5 sm:p-7">
          <div className="absolute right-[-5rem] top-[-5rem] h-52 w-52 rounded-full border border-accent-blue/20" />
          <div className="absolute bottom-[-5rem] left-[-5rem] h-52 w-52 rounded-full bg-accent-gold/10 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/45 to-transparent" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.22em] text-accent-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_16px_rgba(45,226,230,0.85)]" />
                {copy.eyebrow}
              </div>
              <h2 className="max-w-3xl text-balance text-2xl font-semibold tracking-[-0.04em] text-text sm:text-3xl lg:text-4xl">
                {home.emergencyTitle || copy.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                {home.emergencyText || home.contactText || copy.live}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[25rem]">
              <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_36px_rgba(77,162,255,0.30)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
                {home.heroPrimaryCta || copy.call}
              </a>
              <a href="#request-service" className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-accent-gold transition duration-300 hover:-translate-y-0.5 hover:bg-accent-gold/15">
                {home.heroSecondaryCta || copy.request}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
