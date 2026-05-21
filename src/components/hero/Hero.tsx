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

export default function Hero({ title, subtitle, badges, primaryCtaLabel, primaryCtaHref, secondaryCtaLabel, secondaryCtaHref }: HeroProps) {
  const visibleBadges = badges.slice(0, 4)

  return (
    <section className="relative overflow-hidden bg-transparent px-4 pb-14 pt-10 sm:px-6 md:pb-20 md:pt-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-center">
        <PremiumReveal className="relative z-10 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#0B1F4D]/16 bg-white px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.24em] text-[#123A73] shadow-[0_12px_34px_rgba(11,31,77,0.08)] backdrop-blur-2xl">
            <span className="h-2 w-2 rounded-full bg-[#0B1F4D] shadow-[0_0_16px_rgba(11,31,77,0.24)]" />
            24/7 Mobile Automotive Locksmith
          </div>

          <h1 className="mx-auto max-w-6xl text-balance text-[clamp(2.85rem,8.6vw,6.9rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-[#0B1F4D] lg:mx-0">{title}</h1>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-8 text-[#42526E] sm:text-lg lg:mx-0">{subtitle}</p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <a href={primaryCtaHref} className="group inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#0B1F4D]/10 bg-[#0B1F4D] px-7 py-3 text-xl text-white shadow-[0_16px_42px_rgba(11,31,77,0.24)] transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(11,31,77,0.30)] active:translate-y-0 active:scale-[0.96] sm:w-auto" aria-label={primaryCtaLabel || 'Call'} title={primaryCtaLabel || 'Call'}>
              <span aria-hidden="true" className="transition duration-300 group-hover:-rotate-12 group-hover:scale-110">📞</span>
              <span className="sr-only">{primaryCtaLabel || 'Call'}</span>
            </a>
            <a href="#request-service" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#0B1F4D]/22 bg-white px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#0B1F4D] shadow-[0_14px_36px_rgba(11,31,77,0.10)] transition duration-300 hover:-translate-y-1 hover:bg-[#F3F7FF] active:scale-[0.985] sm:w-auto">{secondaryCtaLabel || 'Request service'}</a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start">
            {(visibleBadges.length ? visibleBadges : ['Car lockouts', 'Keys + fobs', 'Mobile response']).map((badge) => (
              <span key={badge} className="rounded-full border border-[#0B1F4D]/14 bg-white px-4 py-2 text-xs font-semibold text-[#0B1F4D]/82 shadow-[0_10px_28px_rgba(11,31,77,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0B1F4D]/28 hover:bg-[#F3F7FF]">{badge}</span>
            ))}
          </div>
        </PremiumReveal>

        <PremiumReveal delay={0.12} className="premium-panel premium-hairline relative rounded-[2rem] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#0B1F4D]/28 hover:shadow-[0_28px_90px_rgba(11,31,77,0.14)] sm:p-6">
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#123A73]">Dispatch panel</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#0B1F4D]">Need help now?</h2>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#0B1F4D]/14 bg-white shadow-[0_14px_34px_rgba(11,31,77,0.08)]">
                <span className="h-3 w-3 rounded-full bg-[#0B1F4D] shadow-[0_0_22px_rgba(11,31,77,0.22)]" />
              </div>
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

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href={primaryCtaHref} className="group inline-flex min-h-11 items-center justify-center rounded-full border border-[#0B1F4D]/10 bg-[#0B1F4D] px-4 py-3 text-xl text-white shadow-[0_14px_36px_rgba(11,31,77,0.20)] transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_52px_rgba(11,31,77,0.26)] active:translate-y-0 active:scale-[0.96]" aria-label="Call" title="Call">
                <span aria-hidden="true" className="transition duration-300 group-hover:-rotate-12 group-hover:scale-110">📞</span>
                <span className="sr-only">Call</span>
              </a>
              <a href="#request-service" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#0B1F4D]/22 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#0B1F4D] shadow-[0_14px_36px_rgba(11,31,77,0.08)] transition hover:-translate-y-1 hover:bg-[#F3F7FF] active:scale-[0.985]">Form</a>
            </div>

            <Link href={secondaryCtaHref} className="mt-4 inline-flex text-xs font-black uppercase tracking-[0.18em] text-[#0B1F4D] transition hover:text-[#123A73]">View all services →</Link>
          </div>
        </PremiumReveal>
      </div>
    </section>
  )
}
