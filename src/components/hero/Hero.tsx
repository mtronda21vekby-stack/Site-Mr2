import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle: string
  badges: string[]
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export default function Hero({
  title,
  subtitle,
  badges,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroProps) {
  const visibleBadges = badges.slice(0, 4)

  return (
    <section className="relative overflow-hidden bg-transparent px-4 pb-14 pt-10 sm:px-6 md:pb-20 md:pt-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center">
        <div className="relative z-10 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-accent-cyan backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-accent-blue shadow-[0_0_16px_rgba(77,162,255,0.72)]" />
            24/7 Mobile Automotive Locksmith
          </div>

          <h1 className="mx-auto max-w-6xl text-balance text-[clamp(2.85rem,8.6vw,6.9rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-text lg:mx-0">
            {title}
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-8 text-muted sm:text-lg lg:mx-0">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href={primaryCtaHref}
              className="group inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_34px_rgba(77,162,255,0.25)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
            >
              <span>{primaryCtaLabel}</span>
              <span className="ml-3 transition group-hover:translate-x-1">→</span>
            </a>

            <a
              href="#request-service"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-accent-gold transition duration-300 hover:-translate-y-0.5 hover:bg-accent-gold/15 sm:w-auto"
            >
              {secondaryCtaLabel || 'Request service'}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {visibleBadges.length ? visibleBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold text-text/78 backdrop-blur-xl"
              >
                {badge}
              </span>
            )) : (
              <>
                <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold text-text/78 backdrop-blur-xl">Car lockouts</span>
                <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold text-text/78 backdrop-blur-xl">Keys + fobs</span>
                <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold text-text/78 backdrop-blur-xl">Mobile response</span>
              </>
            )}
          </div>
        </div>

        <aside className="premium-panel premium-hairline relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
          <div className="absolute right-[-5rem] top-[-5rem] h-44 w-44 rounded-full bg-accent-blue/[0.08] blur-2xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/35 to-transparent" />

          <div className="relative">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-accent-cyan">Dispatch panel</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-text">Need help now?</h2>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent-blue/20 bg-accent-blue/10">
                <span className="h-3 w-3 rounded-full bg-accent-blue shadow-[0_0_22px_rgba(77,162,255,0.85)]" />
              </div>
            </div>

            <p className="text-sm leading-7 text-muted">
              Send the vehicle make, model, year, location, and urgency. Clear details help route the right automotive locksmith request faster.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                ['01', 'Select service'],
                ['02', 'Add vehicle details'],
                ['03', 'Confirm location'],
              ].map(([step, label]) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-gold/25 bg-accent-gold/10 text-[0.65rem] font-black text-accent-gold">{step}</span>
                  <span className="text-sm font-semibold text-text/88">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href={primaryCtaHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent-blue px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-black transition hover:brightness-110"
              >
                Call
              </a>
              <a
                href="#request-service"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-text transition hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold"
              >
                Form
              </a>
            </div>

            <Link href={secondaryCtaHref} className="mt-4 inline-flex text-xs font-black uppercase tracking-[0.18em] text-accent-blue transition hover:text-accent-cyan">
              View all services →
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
