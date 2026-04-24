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
    <section className="relative overflow-hidden bg-transparent px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-6rem] h-[42rem] w-[54rem] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-3xl" />
        <div className="absolute right-[-16rem] top-24 h-[32rem] w-[32rem] rounded-full bg-accent-gold/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center">
        <div className="relative z-10 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-accent-blue/25 bg-accent-blue/10 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-accent-cyan shadow-[0_0_40px_rgba(77,162,255,0.12)] backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-accent-blue shadow-[0_0_18px_rgba(77,162,255,0.95)]" />
            24/7 Mobile Automotive Locksmith
          </div>

          <h1 className="mx-auto max-w-6xl text-balance text-[clamp(2.9rem,10vw,7.4rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-text lg:mx-0">
            {title}
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-8 text-muted sm:text-lg lg:mx-0">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href={primaryCtaHref}
              className="group inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.34)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
            >
              <span>{primaryCtaLabel}</span>
              <span className="ml-3 transition group-hover:translate-x-1">→</span>
            </a>

            <a
              href="#request-service"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-accent-gold transition duration-300 hover:-translate-y-0.5 hover:bg-accent-gold/15 sm:w-auto"
            >
              Get quote
            </a>

            <Link
              href={secondaryCtaHref}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-text backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-blue/45 hover:bg-accent-blue/10 sm:w-auto"
            >
              {secondaryCtaLabel}
            </Link>
          </div>

          <div className="mt-9 grid gap-3 text-left sm:grid-cols-3">
            {[
              ['Car lockouts', 'Fast door unlock support'],
              ['Keys + fobs', 'Replacement and programming'],
              ['Mobile service', 'We come to your location'],
            ].map(([metric, label]) => (
              <div
                key={metric}
                className="premium-panel rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/30"
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
                  className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-semibold text-text/80 backdrop-blur-xl transition hover:border-accent-blue/35 hover:text-text"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="premium-panel premium-hairline relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
          <div className="absolute right-[-4rem] top-[-4rem] h-40 w-40 rounded-full border border-accent-blue/20" />
          <div className="absolute bottom-[-5rem] left-[-5rem] h-44 w-44 rounded-full bg-accent-gold/10 blur-2xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />

          <div className="relative">
            <div className="relative mx-auto mb-6 flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
              <div className="absolute inset-0 rounded-full border border-accent-blue/20" />
              <div className="absolute inset-5 rounded-full border border-accent-gold/20" />
              <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.22),transparent_15%),linear-gradient(145deg,rgba(77,162,255,0.24),rgba(2,4,10,0.94))] shadow-[inset_-24px_-34px_70px_rgba(0,0,0,0.7),0_0_80px_rgba(77,162,255,0.22)]" />
              <div className="absolute h-[5.5rem] w-[18rem] rounded-full border border-accent-blue/25 [transform:rotateX(72deg)_rotateZ(-13deg)]" />
              <div className="absolute h-[4rem] w-[15rem] rounded-full border border-accent-gold/25 [transform:rotateX(72deg)_rotateZ(18deg)]" />
              <div className="absolute left-11 top-11 h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_24px_rgba(45,226,230,0.9)]" />
              <div className="absolute bottom-12 right-10 h-2 w-2 rounded-full bg-accent-gold shadow-[0_0_22px_rgba(214,168,95,0.85)]" />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.26em] text-accent-cyan">
              Emergency request
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-text">
              Locked out or need a car key?
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Call now or submit your vehicle details. Make, model, year, location, and urgency help prepare the right service path before dispatch.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                'Auto lockout service',
                'Lost car key replacement',
                'Key fob / transponder programming',
                'Ignition and broken key help',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 transition hover:border-accent-blue/30 hover:bg-accent-blue/10">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-blue shadow-[0_0_16px_rgba(77,162,255,0.7)]" />
                  <span className="text-sm text-text/90">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#request-service"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_34px_rgba(77,162,255,0.3)] transition hover:brightness-110"
            >
              Start request
            </a>
          </div>
        </aside>
      </div>
    </section>
  )
}
