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
  return (
    <section className="relative overflow-hidden bg-transparent px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[42rem] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-3xl" />
        <div className="absolute right-[-14rem] top-28 h-[28rem] w-[28rem] rounded-full bg-accent-gold/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_28rem] lg:items-center">
        <div className="relative z-10 text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-accent-blue/25 bg-accent-blue/10 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-accent-cyan backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-accent-blue shadow-[0_0_18px_rgba(77,162,255,0.95)]" />
            24/7 Mobile Automotive Locksmith
          </div>

          <h1 className="mx-auto max-w-5xl text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl md:text-6xl lg:mx-0 lg:text-7xl">
            {title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-muted sm:text-lg lg:mx-0">
            {subtitle}
          </p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
            {[
              ['Car lockouts', 'Fast door unlock support'],
              ['Keys + fobs', 'Replacement and programming'],
              ['Mobile service', 'We come to your location'],
            ].map(([metric, label]) => (
              <div
                key={metric}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl"
              >
                <div className="text-base font-semibold text-text">{metric}</div>
                <div className="mt-1 text-xs leading-5 text-muted">{label}</div>
              </div>
            ))}
          </div>

          {badges.length > 0 ? (
            <div className="mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-semibold text-text/80 backdrop-blur-xl"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href={primaryCtaHref}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black shadow-[0_0_36px_rgba(77,162,255,0.32)] transition hover:brightness-110 sm:w-auto"
            >
              {primaryCtaLabel}
            </a>

            <a
              href="#request-service"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-accent-gold transition hover:bg-accent-gold/15 sm:w-auto"
            >
              Get quote
            </a>

            <Link
              href={secondaryCtaHref}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-text backdrop-blur-xl transition hover:border-accent-blue/45 hover:bg-accent-blue/10 sm:w-auto"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>

        <aside className="relative rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
          <div className="absolute right-[-3rem] top-[-3rem] h-32 w-32 rounded-full border border-accent-blue/20" />
          <div className="absolute bottom-[-4rem] left-[-4rem] h-36 w-36 rounded-full bg-accent-gold/10 blur-2xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-accent-cyan">
              Emergency request
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-text">
              Locked out or need a car key?
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Call now or submit your vehicle details. Make, model, year, location, and urgency help us prepare the right tools before dispatch.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                'Auto lockout service',
                'Lost car key replacement',
                'Key fob / transponder programming',
                'Ignition and broken key help',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-blue" />
                  <span className="text-sm text-text/90">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#request-service"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black transition hover:brightness-110"
            >
              Start request
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
