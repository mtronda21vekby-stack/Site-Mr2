import type { Locale } from '@/components/layout/Header'

interface EmergencyStripProps {
  title: string
  text: string
  phoneNumber: string
  phoneDisplay: string
  locale: Locale
}

export default function EmergencyStrip({
  title,
  text,
  phoneNumber,
  phoneDisplay,
  locale,
}: EmergencyStripProps) {
  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-accent-blue/20 bg-[linear-gradient(135deg,rgba(77,162,255,0.18),rgba(255,255,255,0.035)_38%,rgba(214,168,95,0.12))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.36),0_0_70px_rgba(77,162,255,0.14)] backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="absolute left-[-6rem] top-[-6rem] h-72 w-72 rounded-full bg-accent-blue/20 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-[-5rem] h-72 w-72 rounded-full bg-accent-gold/15 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-accent-cyan">
              Emergency channel open
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-[-0.035em] text-text sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              {text}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <a
              href={`tel:${phoneNumber}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black shadow-[0_0_44px_rgba(77,162,255,0.34)] transition hover:scale-[1.015] hover:brightness-110"
            >
              Call {phoneDisplay}
            </a>
            <a
              href={`/${locale}/contact`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-black/25 px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-text transition hover:border-accent-gold/50 hover:bg-accent-gold/10"
            >
              Request service
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
