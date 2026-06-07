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
  phoneDisplay?: string
}

function isInvalidContent(value: string) {
  const normalized = value?.trim().toLowerCase()
  return !normalized || normalized === '0' || normalized.includes('тут должно быть описание')
}

export default function Hero(props: HeroProps) {
  const { title, subtitle, badges, primaryCtaHref, secondaryCtaHref } = props
  const hasTitle = !isInvalidContent(title)
  const hasSubtitle = !isInvalidContent(subtitle)
  const visibleBadges = badges.slice(0, 3)
  const fallbackBadges = ['24/7 Emergency Locksmith', 'Philadelphia Coverage', 'Auto, Residential & Commercial']
  const primaryCtaLabel = isInvalidContent(props.primaryCtaLabel) ? 'Call Now' : props.primaryCtaLabel
  const secondaryCtaLabel = isInvalidContent(props.secondaryCtaLabel) ? 'Request Service' : props.secondaryCtaLabel
  const primaryHref = primaryCtaHref || '#request-service'
  const secondaryHref = secondaryCtaHref || '#request-service'
  const phoneDisplay = String(props.phoneDisplay || '').trim()
  const primaryLooksLikePhone = /\+?\d[\d\s().-]{6,}/.test(primaryCtaLabel)
  const visiblePrimaryCtaLabel = primaryLooksLikePhone ? 'Call Now' : primaryCtaLabel

  return (
    <section className="relative overflow-hidden bg-transparent px-4 pb-12 pt-10 sm:px-6 md:pb-16 md:pt-12 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_50%_0%,rgba(11,31,77,0.075),transparent_30rem)]" />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_25.5rem] lg:items-center">
        <PremiumReveal className="relative z-10 flex min-h-[16rem] flex-col justify-center text-center lg:min-h-[23rem] lg:text-left">
          <div className="mb-5 inline-flex max-w-full items-center self-center gap-3 rounded-full border border-[#0B1F4D]/16 bg-white/95 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.17em] text-[#123A73] shadow-[0_12px_34px_rgba(11,31,77,0.08)] backdrop-blur-2xl sm:text-[0.68rem] sm:tracking-[0.24em] lg:self-start">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#0B1F4D] shadow-[0_0_16px_rgba(11,31,77,0.24)]" />
            <span className="truncate">24/7 Emergency Locksmith Service</span>
          </div>

          {hasTitle ? (
            <h1 className="mx-auto max-w-6xl text-balance text-[3.05rem] font-semibold leading-[0.94] tracking-normal text-[#0B1F4D] sm:text-6xl sm:leading-[0.92] md:text-7xl lg:mx-0 lg:text-[4.85rem] xl:text-[5rem]">
              {title}
            </h1>
          ) : null}

          {phoneDisplay ? (
            <a
              href={primaryHref}
              className="notranslate mt-5 inline-flex min-h-12 max-w-full items-center justify-center self-center rounded-full border border-[#0B1F4D]/12 bg-[#0B1F4D] px-6 py-3 text-base font-black text-white shadow-[0_18px_46px_rgba(11,31,77,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#123A73] active:scale-[0.985] sm:text-lg lg:self-start"
              translate="no"
              aria-label={`Call Planet Locksmiths at ${phoneDisplay}`}
            >
              <span className="truncate">{phoneDisplay}</span>
            </a>
          ) : null}

          {hasSubtitle ? (
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-[#42526E] sm:text-lg lg:mx-0 lg:max-w-3xl">
              {subtitle}
            </p>
          ) : null}

          <div className={`${hasTitle || hasSubtitle ? 'mt-7' : 'mt-2'} flex flex-wrap justify-center gap-2.5 lg:justify-start`}>
            {(visibleBadges.length ? visibleBadges : fallbackBadges).map((badge) => (
              <span key={badge} className="inline-flex min-h-9 items-center rounded-full border border-[#0B1F4D]/14 bg-white/95 px-4 py-2 text-xs font-semibold text-[#0B1F4D]/82 shadow-[0_10px_28px_rgba(11,31,77,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0B1F4D]/28 hover:bg-[#F3F7FF]">
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row lg:justify-start">
            <a
              href={primaryHref}
              className="notranslate inline-flex min-h-12 w-full min-w-0 items-center justify-center rounded-full bg-[#0B1F4D] px-7 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_42px_rgba(11,31,77,0.20)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#123A73] active:scale-[0.985] sm:w-auto"
              translate="no"
            >
              <span className="break-words">{visiblePrimaryCtaLabel}</span>
            </a>
            <Link
              href={secondaryHref}
              className="inline-flex min-h-12 w-full min-w-0 items-center justify-center rounded-full border border-[#0B1F4D]/22 bg-white px-7 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-[#0B1F4D] shadow-[0_16px_42px_rgba(11,31,77,0.10)] transition duration-300 hover:-translate-y-0.5 hover:border-[#0B1F4D]/42 hover:bg-[#F3F7FF] active:scale-[0.985] sm:w-auto"
            >
              <span className="break-words">{secondaryCtaLabel}</span>
            </Link>
          </div>
        </PremiumReveal>

        <PremiumReveal delay={0.12} className="premium-panel premium-hairline relative rounded-[1.6rem] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#0B1F4D]/28 hover:shadow-[0_28px_90px_rgba(11,31,77,0.14)] sm:rounded-[2rem] sm:p-6 lg:min-h-[22rem]">
          <div className="relative z-10">
            <div className="mb-5">
              <p className="text-[0.66rem] font-black uppercase tracking-[0.22em] text-[#123A73] sm:text-xs sm:tracking-[0.24em]">Dispatch panel</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal text-[#0B1F4D] sm:text-3xl">Need help now?</h2>
            </div>

            <p className="text-sm leading-7 text-[#42526E]">Send the service type, location, urgency, and access details. For vehicle jobs, add make, model, and year so the request can be routed faster.</p>

            <div className="mt-6 grid gap-2.5">
              {['Select service', 'Add job details', 'Confirm location'].map((label, index) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-[#0B1F4D]/10 bg-white/70 px-4 py-3 text-sm font-semibold text-[#0B1F4D] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3F7FF] text-[0.65rem] font-black text-[#123A73]">{String(index + 1).padStart(2, '0')}</span>
                    {label}
                  </span>
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
