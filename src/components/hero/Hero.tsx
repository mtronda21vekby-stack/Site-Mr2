import PremiumReveal from '@/components/motion/PremiumReveal'

interface HeroProps {
  title: string
  subtitle: string
  badges: string[]
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

function isInvalidContent(value: string) {
  const normalized = value?.trim().toLowerCase()
  return !normalized || normalized === '0' || normalized.includes('тут должно быть описание')
}

export default function Hero(props: HeroProps) {
  const { title, subtitle, badges } = props
  const hasTitle = !isInvalidContent(title)
  const hasSubtitle = !isInvalidContent(subtitle)
  const visibleBadges = badges.slice(0, 3)
  const fallbackBadges = ['24/7 Mobile Service', 'Philadelphia Coverage', 'Car Keys & Programming']

  return (
    <section className="relative overflow-hidden bg-transparent px-4 pb-10 pt-8 sm:px-6 md:pb-14 md:pt-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
        <PremiumReveal className="relative z-10 flex min-h-[15rem] flex-col justify-center text-center lg:min-h-[22rem] lg:text-left">
          <div className="mb-5 inline-flex max-w-full items-center self-center gap-3 rounded-full border border-[#0B1F4D]/16 bg-white px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#123A73] shadow-[0_12px_34px_rgba(11,31,77,0.08)] backdrop-blur-2xl sm:text-[0.68rem] sm:tracking-[0.24em] lg:self-start">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#0B1F4D] shadow-[0_0_16px_rgba(11,31,77,0.24)]" />
            <span className="truncate">24/7 Mobile Automotive Locksmith</span>
          </div>

          {hasTitle ? (
            <h1 className="mx-auto max-w-6xl text-balance text-[clamp(2.65rem,13vw,6.9rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-[#0B1F4D] sm:text-[clamp(3.4rem,8.6vw,6.9rem)] lg:mx-0">
              {title}
            </h1>
          ) : null}

          {hasSubtitle ? (
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-[#42526E] sm:text-lg lg:mx-0">
              {subtitle}
            </p>
          ) : null}

          <div className={`${hasTitle || hasSubtitle ? 'mt-7' : 'mt-2'} flex flex-wrap justify-center gap-2.5 lg:justify-start`}>
            {(visibleBadges.length ? visibleBadges : fallbackBadges).map((badge) => (
              <span key={badge} className="rounded-full border border-[#0B1F4D]/14 bg-white px-4 py-2 text-xs font-semibold text-[#0B1F4D]/82 shadow-[0_10px_28px_rgba(11,31,77,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0B1F4D]/28 hover:bg-[#F3F7FF]">
                {badge}
              </span>
            ))}
          </div>
        </PremiumReveal>

        <PremiumReveal delay={0.12} className="premium-panel premium-hairline relative rounded-[1.6rem] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#0B1F4D]/28 hover:shadow-[0_28px_90px_rgba(11,31,77,0.14)] sm:rounded-[2rem] sm:p-6">
          <div className="relative z-10">
            <div className="mb-5">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#123A73] sm:text-xs sm:tracking-[0.24em]">Dispatch panel</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0B1F4D] sm:text-3xl">Need help now?</h2>
            </div>

            <p className="text-sm leading-7 text-[#42526E]">Send the vehicle make, model, year, location, and urgency. Clear details help route the right automotive locksmith request faster.</p>

            <div className="mt-6 divide-y divide-[#0B1F4D]/10 border-y border-[#0B1F4D]/10">
              {['Select service', 'Add vehicle details', 'Confirm location'].map((label) => (
                <div key={label} className="flex items-center justify-between gap-4 py-4 text-sm font-semibold text-[#0B1F4D]">
                  <span>{label}</span>
                  <span aria-hidden="true" className="text-[#123A73]">→</span>
                </div>
              ))}
            </div>
          </div>
        </PremiumReveal>
      </div>
    </section>
  )
}
