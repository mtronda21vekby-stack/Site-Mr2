import Link from 'next/link'
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

function cleanHeroTitle(title: string) {
  const value = title?.trim()
  if (!value || value === '0') return 'Mobile auto locksmith service'
  return value
}

function cleanHeroSubtitle(subtitle: string) {
  const value = subtitle?.trim()
  if (!value || value.toLowerCase().includes('тут должно быть описание')) {
    return 'Fast mobile help for vehicle lockouts, replacement keys, key fobs, transponder programming, and ignition-related key issues.'
  }
  return value
}

export default function Hero(props: HeroProps) {
  const { title, subtitle, badges, secondaryCtaHref } = props
  const heroTitle = cleanHeroTitle(title)
  const heroSubtitle = cleanHeroSubtitle(subtitle)
  const visibleBadges = badges.slice(0, 3)

  return (
    <section className="relative overflow-hidden bg-transparent px-4 pb-10 pt-8 sm:px-6 md:pb-18 md:pt-14 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center">
        <PremiumReveal className="relative z-10 text-center lg:text-left">
          <div className="mb-5 inline-flex max-w-full items-center gap-3 rounded-full border border-[#0B1F4D]/16 bg-white px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#123A73] shadow-[0_12px_34px_rgba(11,31,77,0.08)] backdrop-blur-2xl sm:text-[0.68rem] sm:tracking-[0.24em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#0B1F4D] shadow-[0_0_16px_rgba(11,31,77,0.24)]" />
            <span className="truncate">24/7 Mobile Automotive Locksmith</span>
          </div>

          <h1 className="mx-auto max-w-6xl text-balance text-[clamp(2.65rem,13vw,6.9rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-[#0B1F4D] sm:text-[clamp(3.4rem,8.6vw,6.9rem)] lg:mx-0">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-[#42526E] sm:text-lg lg:mx-0">
            {heroSubtitle}
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href={secondaryCtaHref}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#0B1F4D]/12 bg-[#0B1F4D] px-7 py-3 text-xs font-black uppercase tracking-[0.17em] text-white shadow-[0_18px_44px_rgba(11,31,77,0.22)] transition duration-300 ease-out hover:-translate-y-1.5 hover:bg-[#123A73] hover:shadow-[0_24px_64px_rgba(11,31,77,0.28)] active:translate-y-0 active:scale-[0.985] sm:w-auto"
            >
              View services →
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {(visibleBadges.length ? visibleBadges : ['Car lockouts', 'Keys + fobs', 'Mobile response']).map((badge) => (
              <span key={badge} className="rounded-full border border-[#0B1F4D]/14 bg-white px-4 py-2 text-xs font-semibold text-[#0B1F4D]/82 shadow-[0_10px_28px_rgba(11,31,77,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0B1F4D]/28 hover:bg-[#F3F7FF]">
                {badge}
              </span>
            ))}
          </div>
        </PremiumReveal>

        <PremiumReveal delay={0.12} className="premium-panel premium-hairline relative rounded-[1.6rem] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#0B1F4D]/28 hover:shadow-[0_28px_90px_rgba(11,31,77,0.14)] sm:rounded-[2rem] sm:p-6">
          <div className="relative z-10">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#123A73] sm:text-xs sm:tracking-[0.24em]">Dispatch panel</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0B1F4D] sm:text-3xl">Need help now?</h2>
              </div>
              <span className="rounded-full border border-[#0B1F4D]/14 bg-[#F3F7FF] px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#0B1F4D] shadow-[0_10px_24px_rgba(11,31,77,0.07)]">Ready</span>
            </div>

            <p className="text-sm leading-7 text-[#42526E]">Send the vehicle make, model, year, location, and urgency. Clear details help route the right automotive locksmith request faster.</p>

            <div className="mt-6 grid gap-3">
              {[
                ['01', 'Select service'],
                ['02', 'Add vehicle details'],
                ['03', 'Confirm location'],
              ].map(([step, label]) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl border border-[#0B1F4D]/12 bg-white px-4 py-3 shadow-[0_12px_28px_rgba(11,31,77,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0B1F4D]/26 hover:bg-[#F3F7FF]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0B1F4D]/20 bg-[#F3F7FF] text-[0.65rem] font-black text-[#0B1F4D]">{step}</span>
                  <span className="text-sm font-semibold text-[#0B1F4D]/88">{label}</span>
                </div>
              ))}
            </div>

            <Link href={secondaryCtaHref} className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#0B1F4D]/12 bg-[#0B1F4D] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(11,31,77,0.20)] transition duration-300 hover:-translate-y-1.5 hover:bg-[#123A73] hover:shadow-[0_22px_58px_rgba(11,31,77,0.26)] active:scale-[0.985]">
              View all services →
            </Link>
          </div>
        </PremiumReveal>
      </div>
    </section>
  )
}
