'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import CallButton from '@/components/ui/CallButton'

export type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

type HeaderBrandState = {
  brandName: string
  logoUrl: string
  logoAlt: string
}

interface HeaderProps {
  locale: Locale
  phoneDisplay: string
  phonePrimary: string
  brandName?: string
  logoUrl?: string
  logoAlt?: string
}

const activeLocales: ActiveLocale[] = ['en', 'es']

const navConfig: Record<Locale, Array<{ label: string; href: (locale: Locale) => string }>> = {
  en: [
    { label: 'Home', href: (locale) => `/${locale}` },
    { label: 'Services', href: (locale) => `/${locale}/services` },
    { label: 'Service Areas', href: (locale) => `/${locale}/areas` },
  ],
  es: [
    { label: 'Home', href: (locale) => `/${locale}` },
    { label: 'Services', href: (locale) => `/${locale}/services` },
    { label: 'Service Areas', href: (locale) => `/${locale}/areas` },
  ],
  ru: [
    { label: 'Home', href: () => '/en' },
    { label: 'Services', href: () => '/en/services' },
    { label: 'Service Areas', href: () => '/en/areas' },
  ],
}

const ctaLabels: Record<Locale, { request: string; call: string; menu: string }> = {
  en: { request: 'Request', call: 'Call', menu: 'Menu' },
  es: { request: 'Request', call: 'Call', menu: 'Menu' },
  ru: { request: 'Request', call: 'Call', menu: 'Menu' },
}

function normalizeLogoUrl(value: string) {
  const url = value.trim()
  if (!url) return ''
  if (url.startsWith('http://')) return url.replace('http://', 'https://')
  return url
}

export default function Header({ locale, phoneDisplay, phonePrimary, brandName = 'Planetlocksmiths', logoUrl = '', logoAlt }: HeaderProps) {
  const pathname = usePathname()
  const supabase = useMemo(() => getSupabaseClient() as any, [])
  const [open, setOpen] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [brand, setBrand] = useState<HeaderBrandState>({
    brandName,
    logoUrl: normalizeLogoUrl(logoUrl),
    logoAlt: logoAlt || brandName,
  })
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const navItems = navConfig[locale]
  const labels = ctaLabels[locale]
  const requestHref = `/${activeLocale}/contact#request-service`
  const visibleLogoUrl = normalizeLogoUrl(brand.logoUrl)
  const visibleBrandName = brand.brandName || brandName
  const visibleLogoAlt = brand.logoAlt || visibleBrandName
  const shouldShowImageLogo = Boolean(visibleLogoUrl) && !logoFailed

  useEffect(() => {
    setLogoFailed(false)
    setBrand({
      brandName,
      logoUrl: normalizeLogoUrl(logoUrl),
      logoAlt: logoAlt || brandName,
    })
  }, [brandName, logoUrl, logoAlt])

  useEffect(() => {
    setLogoFailed(false)
  }, [visibleLogoUrl])

  useEffect(() => {
    let mounted = true

    async function loadHeaderBrand() {
      if (logoUrl.trim()) return

      try {
        const result = await (supabase.from('site_settings') as any)
          .select('brand_name, logo_url, logo_alt')
          .limit(1)
          .maybeSingle()

        if (!mounted || result.error || !result.data) return

        const row = result.data
        setBrand((current) => ({
          brandName: String(row.brand_name || current.brandName || brandName).trim() || brandName,
          logoUrl: normalizeLogoUrl(String(row.logo_url || current.logoUrl || '').trim()),
          logoAlt: String(row.logo_alt || row.brand_name || current.logoAlt || brandName).trim() || brandName,
        }))
      } catch {
        // Keep safe text + generated mark fallback.
      }
    }

    loadHeaderBrand()

    return () => {
      mounted = false
    }
  }, [brandName, logoUrl, supabase])

  return (
    <header translate="no" className="notranslate sticky top-0 z-50 border-b border-[#0B1F4D]/10 bg-white/88 shadow-[0_14px_54px_rgba(11,31,77,0.08)] backdrop-blur-[30px] supports-[backdrop-filter]:bg-white/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0B1F4D]/18 to-transparent" />
      <div className="relative mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-2.5 px-4 py-3 sm:h-[4.5rem] sm:gap-3 sm:px-6 lg:px-8">
        <Link href={`/${activeLocale}`} className="group flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={`${visibleBrandName} home`}>
          <span className="relative flex h-[3.45rem] w-[4.7rem] shrink-0 items-center justify-center overflow-visible transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 sm:h-16 sm:w-24">
            {shouldShowImageLogo ? (
              <img
                src={visibleLogoUrl}
                alt={visibleLogoAlt}
                width="160"
                height="117"
                decoding="async"
                fetchPriority="high"
                referrerPolicy="no-referrer"
                onError={() => setLogoFailed(true)}
                className="block h-full w-full object-contain drop-shadow-[0_10px_22px_rgba(11,31,77,0.16)]"
              />
            ) : (
              <FallbackLogoMark />
            )}
          </span>
          <span className="min-w-0 leading-none">
            <span className="block truncate text-[0.95rem] font-black tracking-[-0.035em] text-[#0B1F4D] sm:text-lg">{visibleBrandName}</span>
            <span className="mt-0.5 block truncate text-[0.48rem] font-black uppercase tracking-[0.16em] text-[#42526E] sm:text-[0.62rem] sm:tracking-[0.22em]">Mobile auto key response</span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-[#0B1F4D]/14 bg-white p-1.5 shadow-[0_12px_32px_rgba(11,31,77,0.07)] backdrop-blur-2xl md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href(activeLocale)} className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.13em] text-[#0B1F4D] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F3F7FF] active:scale-[0.985]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher currentLocale={activeLocale} pathname={pathname} />
          <Link href={requestHref} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#0B1F4D]/10 bg-[#0B1F4D] px-5 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-white shadow-[0_16px_38px_rgba(11,31,77,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#123A73] hover:shadow-[0_22px_54px_rgba(11,31,77,0.28)] active:scale-[0.985]">
            {labels.request}
          </Link>
          <CallButton phoneNumber={phonePrimary} phoneDisplay={phoneDisplay} label={labels.call} className="min-h-11 min-w-11 px-0 py-0 text-lg shadow-[0_16px_38px_rgba(11,31,77,0.22)]" title={`${labels.call} ${phoneDisplay}`} />
        </div>

        <button type="button" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[#0B1F4D]/18 bg-white px-4 text-xs font-black uppercase tracking-[0.16em] text-[#0B1F4D] shadow-[0_12px_32px_rgba(11,31,77,0.08)] backdrop-blur-2xl sm:px-5 md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span>{open ? 'Close' : labels.menu}</span>
          <span aria-hidden="true" className="relative h-3.5 w-4">
            <span className={`absolute left-0 top-0 h-0.5 w-4 rounded-full bg-current transition duration-300 ${open ? 'translate-y-[0.38rem] rotate-45' : ''}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-4 rounded-full bg-current transition duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute bottom-0 left-0 h-0.5 w-4 rounded-full bg-current transition duration-300 ${open ? '-translate-y-[0.38rem] -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#0B1F4D]/12 bg-white/96 shadow-[0_30px_90px_rgba(11,31,77,0.16)] backdrop-blur-[30px] md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            <div className="mb-3"><LanguageSwitcher currentLocale={activeLocale} pathname={pathname} isMobile /></div>
            {navItems.map((item) => (
              <Link key={item.label} href={item.href(activeLocale)} className="rounded-2xl px-4 py-3 text-base font-bold text-[#42526E] transition hover:bg-[#F3F7FF] hover:text-[#0B1F4D]" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="mt-4 grid grid-cols-[1fr_3.25rem] gap-3">
              <Link href={requestHref} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#0B1F4D]/10 bg-[#0B1F4D] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_16px_38px_rgba(11,31,77,0.22)]" onClick={() => setOpen(false)}>{labels.request}</Link>
              <CallButton phoneNumber={phonePrimary} phoneDisplay={phoneDisplay} label={labels.call} className="min-h-12 min-w-12 px-0 py-0 text-lg" />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

function FallbackLogoMark() {
  return (
    <span className="relative flex h-full w-full items-center justify-center" aria-hidden="true">
      <span className="absolute h-[86%] w-[86%] rounded-full bg-[radial-gradient(circle_at_32%_22%,#DDEBFF_0%,#2D6FA8_38%,#071C3D_100%)] shadow-[0_10px_24px_rgba(11,31,77,0.18)]" />
      <span className="absolute h-[34%] w-[108%] rotate-[-22deg] rounded-full border-[3px] border-[#7D8897] opacity-90 shadow-[0_5px_10px_rgba(11,31,77,0.15)]" />
      <span className="relative flex h-[54%] w-[42%] items-center justify-center rounded-b-[0.7rem] rounded-t-[0.25rem] border border-[#C9D3E2] bg-gradient-to-b from-white to-[#D8E0EA] shadow-[0_7px_16px_rgba(11,31,77,0.22)]">
        <span className="absolute -top-[38%] h-[52%] w-[58%] rounded-t-full border-[4px] border-[#D8E0EA] border-b-0" />
        <span className="h-[30%] w-[20%] rounded-full bg-[#0B1F4D] shadow-[0_0_0_5px_rgba(11,31,77,0.10)]" />
      </span>
    </span>
  )
}

function LanguageSwitcher({ currentLocale, pathname, isMobile = false }: { currentLocale: ActiveLocale; pathname: string | null; isMobile?: boolean }) {
  const labels: Record<ActiveLocale, string> = isMobile ? { en: 'English', es: 'Spanish' } : { en: 'EN', es: 'ES' }

  return (
    <div className={`rounded-full border border-[#0B1F4D]/14 bg-white shadow-[0_12px_32px_rgba(11,31,77,0.07)] backdrop-blur-2xl ${isMobile ? 'w-full p-1.5' : 'p-1'}`} aria-label="Language switcher">
      {isMobile ? <p className="px-3 pb-2 pt-1 text-[0.64rem] font-black uppercase tracking-[0.18em] text-[#42526E]">Language</p> : null}
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-1.5' : 'grid-cols-2 gap-1'}`}>
        {activeLocales.map((targetLocale) => {
          const isActive = targetLocale === currentLocale
          return (
            <Link
              key={targetLocale}
              href={buildLocalizedHref(pathname, targetLocale)}
              aria-current={isActive ? 'page' : undefined}
              data-language-option="true"
              className={`inline-flex min-h-9 items-center justify-center rounded-[999px] px-3 text-xs font-black uppercase tracking-[0.13em] transition duration-300 ${isActive ? 'bg-[#0B1F4D] text-white shadow-[0_10px_26px_rgba(11,31,77,0.18)] hover:bg-[#123A73]' : 'bg-[#F7FAFF] text-[#0B1F4D] hover:-translate-y-0.5 hover:bg-[#EEF4FF]'} ${isMobile ? 'min-h-11' : 'min-w-11'}`}
              title={targetLocale === 'en' ? 'English' : 'Spanish'}
            >
              {labels[targetLocale]}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function buildLocalizedHref(pathname: string | null, targetLocale: ActiveLocale) {
  if (!pathname || pathname === '/') return `/${targetLocale}`
  const parts = pathname.split('/').filter(Boolean)
  if (!parts.length) return `/${targetLocale}`
  if (parts[0] === 'en' || parts[0] === 'es' || parts[0] === 'ru') return `/${[targetLocale, ...parts.slice(1)].join('/')}`
  return `/${targetLocale}`
}
