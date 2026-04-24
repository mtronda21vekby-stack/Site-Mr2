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
        <div className="relative overflow-hidden rounded-[2rem] border border-accent-blue/20 bg-[linear-gradient(135deg,rgba(77,162,255,0.16),rgba(255,255,255,0.045)_42%,rgba(214,168,95,0.12))] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-7">
          <div className="absolute right-[-5rem] top-[-5rem] h-48 w-48 rounded-full border border-accent-blue/20" />
          <div className="absolute bottom-[-5rem] left-[-5rem] h-48 w-48 rounded-full bg-accent-gold/10 blur-3xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">{copy.eyebrow}</p>
              <h2 className="max-w-3xl text-balance text-2xl font-semibold tracking-[-0.035em] text-text sm:text-3xl">
                {home.emergencyTitle || copy.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
                {home.emergencyText || home.contactText || copy.live}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[24rem]">
              <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black shadow-[0_0_36px_rgba(77,162,255,0.28)] transition hover:brightness-110">
                {home.heroPrimaryCta || copy.call}
              </a>
              <a href="#request-service" className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-accent-gold transition hover:bg-accent-gold/15">
                {home.heroSecondaryCta || copy.request}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
