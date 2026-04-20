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
    <section className="relative overflow-hidden bg-bg pb-12 pt-8 md:pb-20 md:pt-14 lg:pb-24">
      <div className="section-frame">
        <div className="premium-shell relative overflow-hidden px-6 py-10 sm:px-8 md:px-10 md:py-14 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,162,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(45,226,230,0.09),transparent_24%)]" />
          <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.02))] lg:block" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span key={badge} className="premium-label">
                    {badge}
                  </span>
                ))}
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-text sm:text-5xl md:text-6xl xl:text-7xl">
                {title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
                {subtitle}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={primaryCtaHref} className="premium-button-primary">
                  {primaryCtaLabel}
                </a>
                <Link href={secondaryCtaHref} className="premium-button-secondary">
                  {secondaryCtaLabel}
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="premium-card-soft p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-accent-cyan">
                    Response
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Mobile-first request intake with clear next steps.
                  </p>
                </div>
                <div className="premium-card-soft p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-accent-cyan">
                    Coverage
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Automotive locksmith support across Philadelphia.
                  </p>
                </div>
                <div className="premium-card-soft p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-accent-cyan">
                    Service
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Lockout help, replacement, programming, and urgent dispatch.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-[360px] items-center justify-center lg:min-h-[560px]">
              <div className="absolute h-[20rem] w-[20rem] rounded-full bg-accent-blue/10 blur-3xl md:h-[26rem] md:w-[26rem]" />
              <div className="absolute h-[16rem] w-[16rem] rounded-full bg-accent-cyan/10 blur-3xl md:h-[22rem] md:w-[22rem]" />

              <div className="premium-glow relative h-[300px] w-[300px] md:h-[420px] md:w-[420px]">
                <div className="absolute inset-0 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_70%_68%,rgba(77,162,255,0.14),transparent_30%),linear-gradient(145deg,rgba(17,25,46,0.95),rgba(5,7,11,0.98))] shadow-[inset_0_2px_30px_rgba(255,255,255,0.04),0_30px_100px_rgba(0,0,0,0.55)]" />

                <div className="absolute inset-[-16px] rounded-full border border-accent-blue/30 opacity-70 [transform:rotateX(70deg)]" />
                <div className="absolute inset-[8px] rounded-full border border-accent-cyan/20 opacity-50 [transform:rotateX(70deg)_rotateZ(18deg)]" />

                <div className="absolute left-1/2 top-1/2 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8" />
                <div className="absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6" />

                <div className="absolute left-[8%] top-[18%] rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-text backdrop-blur-md">
                  24/7 mobile
                </div>
                <div className="absolute bottom-[14%] right-[2%] rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-text backdrop-blur-md">
                  Philadelphia
                </div>
                <div className="absolute left-[4%] top-1/2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-text backdrop-blur-md">
                  Key systems
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
