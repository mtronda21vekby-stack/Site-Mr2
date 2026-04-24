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
    <section className="relative overflow-hidden bg-transparent px-4 pb-20 pt-16 sm:px-6 md:pb-28 md:pt-24 lg:px-8 lg:pb-32 lg:pt-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-3xl" />
        <div className="absolute right-[-16rem] top-24 h-[34rem] w-[34rem] rounded-full bg-accent-gold/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <div className="relative z-10 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent-cyan shadow-[0_0_40px_rgba(77,162,255,0.12)] backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-accent-blue shadow-[0_0_18px_rgba(77,162,255,0.95)]" />
            Citywide mobile response system
          </div>

          <h1 className="max-w-5xl text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-muted sm:text-lg lg:mx-0">
            {subtitle}
          </p>

          {badges.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text/80 backdrop-blur-xl transition hover:border-accent-blue/40 hover:text-white"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a
              href={primaryCtaHref}
              className="group inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black shadow-[0_0_44px_rgba(77,162,255,0.36)] transition hover:scale-[1.015] hover:brightness-110 sm:w-auto"
            >
              <span className="mr-2 h-2 w-2 rounded-full bg-black/70 transition group-hover:scale-125" />
              {primaryCtaLabel}
            </a>

            <Link
              href={secondaryCtaHref}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-text backdrop-blur-xl transition hover:border-accent-gold/50 hover:bg-accent-gold/10 sm:w-auto"
            >
              {secondaryCtaLabel}
            </Link>
          </div>

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
            {[
              ['24/7', 'Emergency dispatch'],
              ['AUTO', 'Keys · locks · programming'],
              ['MOBILE', 'Philadelphia coverage'],
            ].map(([metric, label]) => (
              <div
                key={metric}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl"
              >
                <div className="text-lg font-semibold text-text">{metric}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-[34rem] items-center justify-center lg:max-w-[40rem]">
          <div className="absolute inset-0 rounded-full bg-accent-blue/10 blur-3xl" />
          <div className="absolute inset-[7%] rounded-full border border-accent-blue/15" style={{ animation: 'signal-pulse 5.6s ease-in-out infinite' }} />
          <div className="absolute inset-[14%] rounded-full border border-accent-cyan/15" style={{ animation: 'signal-pulse 6.8s ease-in-out infinite reverse' }} />
          <div className="absolute inset-[21%] rounded-full border border-accent-gold/20" />

          <div className="absolute h-[82%] w-[82%] rounded-full border border-white/10" style={{ animation: 'planet-rotate 34s linear infinite' }}>
            <span className="absolute left-1/2 top-[-0.65rem] h-5 w-14 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-gold via-yellow-200 to-accent-gold shadow-[0_0_28px_rgba(214,168,95,0.45)]" />
            <span className="absolute bottom-14 right-4 h-4 w-10 rotate-45 rounded-full bg-accent-blue/70 shadow-[0_0_24px_rgba(77,162,255,0.6)]" />
          </div>

          <div className="absolute h-[64%] w-[112%] rounded-full border border-accent-blue/30 opacity-70 [transform:rotateX(68deg)_rotateZ(-18deg)]" style={{ animation: 'planet-rotate-reverse 28s linear infinite' }} />
          <div className="absolute h-[52%] w-[104%] rounded-full border border-accent-gold/20 opacity-70 [transform:rotateX(70deg)_rotateZ(22deg)]" />

          <div className="relative h-[58%] w-[58%] overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.28),transparent_12%),radial-gradient(circle_at_68%_70%,rgba(45,226,230,0.3),transparent_18%),linear-gradient(145deg,#0d1730_0%,#05070b_46%,#010205_100%)] shadow-[inset_-38px_-44px_80px_rgba(0,0,0,0.88),0_0_90px_rgba(77,162,255,0.26)]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(77,162,255,0.14),transparent)]" />
            <div className="absolute left-[12%] top-[34%] h-20 w-[76%] rounded-full border border-accent-cyan/20" />
            <div className="absolute bottom-[18%] left-[18%] h-12 w-[64%] rounded-full border border-accent-gold/20" />
          </div>

          <div className="absolute bottom-6 left-1/2 w-[82%] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/35 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-accent-cyan">
                  Live response grid
                </p>
                <p className="mt-1 text-sm text-muted">
                  Automotive lockout · key replacement · programming
                </p>
              </div>
              <div className="h-10 w-10 rounded-full border border-accent-blue/40 bg-accent-blue/10 shadow-[0_0_28px_rgba(77,162,255,0.22)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
