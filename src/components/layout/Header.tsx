'use client'

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
    { label: 'Request', href: (locale) => `/${locale}/contact#request-service` },
  ],
  es: [
    { label: 'Inicio', href: (locale) => `/${locale}` },
    { label: 'Servicios', href: (locale) => `/${locale}/services` },
    { label: 'Áreas', href: (locale) => `/${locale}/areas` },
    { label: 'Solicitud', href: (locale) => `/${locale}/contact#request-service` },
  ],
  ru: [
    { label: 'Home', href: () => '/en' },
    { label: 'Services', href: () => '/en/services' },
    { label: 'Service Areas', href: () => '/en/areas' },
    { label: 'Request', href: () => '/en/contact#request-service' },
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
    <header className="sticky top-0 z-50 border-b border-white/14 bg-[#07101f]/48 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-[30px] supports-[backdrop-filter]:bg-[#07101f]/34">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.10),transparent_35%,rgba(77,162,255,0.08))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      <div className="relative mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={`/${activeLocale}`} className="group flex min-w-0 items-center gap-3" aria-label="Planetlocksmiths home">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_28px_rgba(77,162,255,0.16)] backdrop-blur-2xl">
            <span className="h-3 w-3 rounded-full bg-accent-blue shadow-[0_0_18px_rgba(77,162,255,0.72)]" />
            <span className="absolute inset-1 rounded-2xl border border-white/12" />
          </span>
          <span className="min-w-0">
            <span className="notranslate block truncate text-base font-black tracking-[-0.03em] text-text sm:text-lg" translate="no">Planetlocksmiths</span>
            <span className="hidden text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted sm:block">Mobile auto key response</span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-white/16 bg-white/[0.075] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href(activeLocale)} className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-muted transition duration-300 hover:bg-white/[0.10] hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher currentLocale={activeLocale} pathname={pathname} />
          <Link href={requestHref} className="rounded-full border border-white/18 bg-white/[0.075] px-4 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/45 hover:bg-accent-gold/12 hover:text-accent-gold">
            {labels.request}
          </Link>
          <CallButton phoneNumber={phonePrimary} phoneDisplay={phoneDisplay} label={labels.call} className="min-h-0 px-4 py-2.5 text-xs tracking-[0.15em] shadow-[0_0_24px_rgba(77,162,255,0.24)]" title={`${labels.call} ${phoneDisplay}`} />
        </div>

        <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/18 bg-white/[0.075] px-4 text-xs font-black uppercase tracking-[0.16em] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span>{labels.menu}</span>
          <span className="text-lg leading-none">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/12 bg-[#07101f]/72 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-[30px] md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            <div className="mb-3"><LanguageSwitcher currentLocale={activeLocale} pathname={pathname} isMobile /></div>
            {navItems.map((item) => (
              <Link key={item.label} href={item.href(activeLocale)} className="rounded-2xl px-4 py-3 text-base font-bold text-muted transition hover:bg-white/[0.08] hover:text-text" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href={requestHref} className="rounded-full border border-white/18 bg-white/[0.075] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-text" onClick={() => setOpen(false)}>{labels.request}</Link>
              <CallButton phoneNumber={phonePrimary} phoneDisplay={phoneDisplay} label={labels.call} className="px-4 py-3 text-xs tracking-[0.14em]" />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

function LanguageSwitcher({ currentLocale, pathname, isMobile = false }: { currentLocale: ActiveLocale; pathname: string | null; isMobile?: boolean }) {
  return (
    <div className={`notranslate inline-flex items-center rounded-full border border-white/16 bg-white/[0.07] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl ${isMobile ? 'w-full justify-between' : ''}`} aria-label="Language switcher" translate="no">
      {activeLocales.map((targetLocale) => {
        const isActive = targetLocale === currentLocale
        return (
          <Link key={targetLocale} href={buildLocalizedHref(pathname, targetLocale)} className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition duration-300 ${isActive ? 'bg-white/88 text-black shadow-[0_0_22px_rgba(255,255,255,0.16)]' : 'text-muted hover:bg-white/[0.10] hover:text-text'} ${isMobile ? 'flex-1 text-center' : ''}`}>
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
