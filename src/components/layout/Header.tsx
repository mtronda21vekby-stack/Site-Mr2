'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import CallButton from '@/components/ui/CallButton'

export type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

interface HeaderProps {
  locale: Locale
  phoneDisplay: string
  phonePrimary: string
}

const activeLocales: ActiveLocale[] = ['en', 'es']

const navConfig: Record<Locale, Array<{ label: string; href: (locale: Locale) => string }>> = {
  en: [
    { label: 'Home', href: (locale) => `/${locale}` },
    { label: 'Services', href: (locale) => `/${locale}/services` },
    { label: 'Service Areas', href: (locale) => `/${locale}/areas` },
  ],
  es: [
    { label: 'Inicio', href: (locale) => `/${locale}` },
    { label: 'Servicios', href: (locale) => `/${locale}/services` },
    { label: 'Áreas', href: (locale) => `/${locale}/areas` },
  ],
  ru: [
    { label: 'Home', href: () => '/en' },
    { label: 'Services', href: () => '/en/services' },
    { label: 'Service Areas', href: () => '/en/areas' },
  ],
}

const ctaLabels: Record<Locale, { request: string; call: string; menu: string }> = {
  en: { request: 'Request', call: 'Call', menu: 'Menu' },
  es: { request: 'Solicitud', call: 'Llamar', menu: 'Menú' },
  ru: { request: 'Request', call: 'Call', menu: 'Menu' },
}

export default function Header({ locale, phoneDisplay, phonePrimary }: HeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const navItems = navConfig[locale]
  const labels = ctaLabels[locale]
  const requestHref = `/${activeLocale}/contact#request-service`

  return (
    <header className="sticky top-0 z-50 border-b border-[#0B1F4D]/10 bg-white/88 shadow-[0_14px_54px_rgba(11,31,77,0.08)] backdrop-blur-[30px] supports-[backdrop-filter]:bg-white/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0B1F4D]/18 to-transparent" />
      <div className="relative mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={`/${activeLocale}`} className="group flex min-w-0 items-center gap-3" aria-label="Planetlocksmiths home">
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-visible rounded-full transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 sm:h-14 sm:w-14">
            <Image src="/Изображение HEIF.heic" alt="Planetlocksmiths" width={56} height={56} priority unoptimized className="h-full w-full object-contain drop-shadow-[0_10px_22px_rgba(11,31,77,0.16)]" />
          </span>
          <span className="min-w-0">
            <span className="notranslate block truncate text-base font-black tracking-[-0.03em] text-[#0B1F4D] sm:text-lg" translate="no">Planetlocksmiths</span>
            <span className="hidden text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#42526E] sm:block">Mobile auto key response</span>
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

        <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#0B1F4D]/18 bg-white px-4 text-xs font-black uppercase tracking-[0.16em] text-[#0B1F4D] shadow-[0_12px_32px_rgba(11,31,77,0.08)] backdrop-blur-2xl md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span>{labels.menu}</span>
          <span className="text-lg leading-none">{open ? '×' : '☰'}</span>
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

function LanguageSwitcher({ currentLocale, pathname, isMobile = false }: { currentLocale: ActiveLocale; pathname: string | null; isMobile?: boolean }) {
  return (
    <div className={`notranslate inline-flex items-center rounded-full border border-[#0B1F4D]/14 bg-white p-1 shadow-[0_12px_32px_rgba(11,31,77,0.07)] backdrop-blur-2xl ${isMobile ? 'w-full justify-between' : ''}`} aria-label="Language switcher" translate="no">
      {activeLocales.map((targetLocale) => {
        const isActive = targetLocale === currentLocale
        return (
          <Link key={targetLocale} href={buildLocalizedHref(pathname, targetLocale)} className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition duration-300 ${isActive ? 'bg-[#0B1F4D] text-white shadow-[0_10px_26px_rgba(11,31,77,0.18)]' : 'text-[#0B1F4D] hover:bg-[#F3F7FF]'} ${isMobile ? 'flex-1 text-center' : ''}`}>
            {targetLocale}
          </Link>
        )
      })}
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
