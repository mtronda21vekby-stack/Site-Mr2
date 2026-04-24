'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

interface HeaderProps {
  locale: Locale
  phoneDisplay: string
  phonePrimary: string
}

const activeLocales: ActiveLocale[] = ['en', 'es']

const navConfig: Record<
  Locale,
  Array<{ label: string; href: (locale: Locale) => string }>
> = {
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
  en: { request: 'Request Service', call: 'Call', menu: 'Menu' },
  es: { request: 'Solicitar servicio', call: 'Llamar', menu: 'Menú' },
  ru: { request: 'Request Service', call: 'Call', menu: 'Menu' },
}

export default function Header({ locale, phoneDisplay, phonePrimary }: HeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const navItems = navConfig[locale]
  const labels = ctaLabels[locale]
  const requestHref = `/${activeLocale}/contact#request-service`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/76 shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl supports-[backdrop-filter]:bg-bg/62">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/38 to-transparent" />
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={`/${activeLocale}`} className="group flex min-w-0 items-center gap-3" aria-label="Planetlocksmiths home">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-accent-blue/20 bg-accent-blue/10 shadow-[0_0_28px_rgba(77,162,255,0.14)]">
            <span className="h-3 w-3 rounded-full bg-accent-blue shadow-[0_0_18px_rgba(77,162,255,0.72)]" />
            <span className="absolute inset-1 rounded-2xl border border-white/10" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-black tracking-[-0.03em] text-text sm:text-lg">Planetlocksmiths</span>
            <span className="hidden text-[0.62rem] font-bold uppercase tracking-[0.22em] text-muted sm:block">Mobile auto key response</span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-white/10 bg-white/[0.032] px-2 py-1.5 backdrop-blur-xl md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href(activeLocale)} className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-muted transition duration-300 hover:bg-accent-blue/10 hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher currentLocale={activeLocale} pathname={pathname} />
          <Link href={requestHref} className="rounded-full border border-white/15 bg-white/[0.035] px-4 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-text backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold">
            {labels.request}
          </Link>
          <a href={`tel:${phonePrimary}`} className="rounded-full bg-accent-blue px-4 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-black shadow-[0_0_30px_rgba(77,162,255,0.24)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
            {labels.call} {phoneDisplay}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.035] px-4 text-xs font-black uppercase tracking-[0.16em] text-text backdrop-blur-xl md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{labels.menu}</span>
          <span className="text-lg leading-none">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-bg/96 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            <div className="mb-3">
              <LanguageSwitcher currentLocale={activeLocale} pathname={pathname} isMobile />
            </div>
            {navItems.map((item) => (
              <Link key={item.label} href={item.href(activeLocale)} className="rounded-2xl px-4 py-3 text-base font-bold text-muted transition hover:bg-white/[0.04] hover:text-text" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href={requestHref} className="rounded-full border border-white/15 bg-white/[0.035] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-text" onClick={() => setOpen(false)}>
                {labels.request}
              </Link>
              <a href={`tel:${phonePrimary}`} className="rounded-full bg-accent-blue px-4 py-3 text-center text-xs font-black uppercase tracking-[0.14em] text-black">
                {labels.call}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

function LanguageSwitcher({ currentLocale, pathname, isMobile = false }: { currentLocale: ActiveLocale; pathname: string | null; isMobile?: boolean }) {
  return (
    <div className={`inline-flex items-center rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-xl ${isMobile ? 'w-full justify-between' : ''}`} aria-label="Language switcher">
      {activeLocales.map((targetLocale) => {
        const isActive = targetLocale === currentLocale
        return (
          <Link
            key={targetLocale}
            href={buildLocalizedHref(pathname, targetLocale)}
            className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition duration-300 ${isActive ? 'bg-accent-blue text-black shadow-[0_0_22px_rgba(77,162,255,0.22)]' : 'text-muted hover:bg-white/[0.06] hover:text-text'} ${isMobile ? 'flex-1 text-center' : ''}`}
          >
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
  if (parts[0] === 'en' || parts[0] === 'es' || parts[0] === 'ru') {
    return `/${[targetLocale, ...parts.slice(1)].join('/')}`
  }
  return `/${targetLocale}`
}
