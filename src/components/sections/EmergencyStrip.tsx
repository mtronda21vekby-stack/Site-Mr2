import type { Locale } from '@/components/layout/Header'

interface EmergencyStripProps {
  title: string
  text: string
  phoneNumber: string
  phoneDisplay: string
  locale: Locale
}

const copy = {
  en: {
    call: 'Call now',
    request: 'Request service',
    note: 'Urgent request intake is available 24/7.',
  },
  es: {
    call: 'Llamar ahora',
    request: 'Solicitar servicio',
    note: 'Las solicitudes urgentes se aceptan 24/7.',
  },
  ru: {
    call: 'Позвонить',
    request: 'Оставить заявку',
    note: 'Срочные заявки принимаются 24/7.',
  },
} as const

export default function EmergencyStrip({
  title,
  text,
  phoneNumber,
  phoneDisplay,
  locale,
}: EmergencyStripProps) {
  const t = copy[locale]

  return (
    <section className="bg-bg py-10 md:py-14">
      <div className="section-frame">
        <div className="premium-shell premium-glow overflow-hidden px-6 py-7 md:px-8 md:py-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="premium-label mb-4">Urgent mobile response</p>
              <h2 className="text-2xl font-heading font-semibold text-text md:text-3xl">
                {title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                {text}
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <a
                  href={`tel:${phoneNumber}`}
                  className="premium-button-primary"
                >
                  {t.call} {phoneDisplay}
                </a>
                <a
                  href={`/${locale}/contact`}
                  className="premium-button-secondary"
                >
                  {t.request}
                </a>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.16em] text-accent-cyan">
                {t.note}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
