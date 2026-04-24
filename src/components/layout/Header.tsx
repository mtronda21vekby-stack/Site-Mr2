'use client'

import Link from 'next/link'
import { useState } from 'react'

export type Locale = 'en' | 'es' | 'ru'

interface HeaderProps {
  locale: Locale
  phoneDisplay: string
  phonePrimary: string
}

const navConfig: Record<
  Locale,
  Array<{ label: string; href: (locale: Locale) => string }>
> = {
  en: [
    { label: 'Home', href: (locale) => `/${locale}` },
    { label: 'Services', href: (locale) => `/${locale}/services` },
    { label: 'Service Areas', href: (locale) => `/${locale}/areas` },
    { label: 'Request', href: () => '#request-service' },
  ],
  es: [
    { label: 'Inicio', href: (locale) => `/${locale}` },
    { label: 'Servicios', href: (locale) => `/${locale}/services` },
    { label: 'Áreas', href: (locale) => `/${locale}/areas` },
    { label: 'Solicitud', href: () => '#request-service' },
  ],
  ru: [
    { label: 'Главная', href: (locale) => `/${locale}` },
    { label: 'Услуги', href: (locale) => `/${locale}/services` },
    { label: 'Районы', href: (locale) => `/${locale}/areas` },
    { label: 'Заявка', href: () => '#request-service' },
  ],
}

const ctaLabels: Record<Locale, { request: string; call: string }> = {
  en: { request: 'Request Service', call: 'Call' },
  es: { request: 'Solicitar servicio', call: 'Llamar' },
  ru: { request: 'Оставить заявку', call: 'Позвонить' },
}

export default function Header({ locale, phoneDisplay, phonePrimary }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const navItems = navConfig[locale]
  const labels = ctaLabels[locale]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="min-w-0 truncate text-lg font-bold text-text" aria-label="Planetlocksmiths home">
          Planetlocksmiths
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href(locale)} className="text-sm font-medium text-muted transition-colors hover:text-text">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#request-service" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-accent-blue/50 hover:bg-accent-blue/10">
            {labels.request}
          </a>
          <a href={`tel:${phonePrimary}`} className="rounded-full bg-accent-blue px-4 py-2 text-sm font-bold text-black transition-colors hover:brightness-110">
            {labels.call} {phoneDisplay}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-text md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-xl leading-none">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-bg md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href(locale)} className="py-3 text-base font-medium text-muted transition-colors hover:text-text" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a href="#request-service" className="rounded-full border border-white/15 px-4 py-3 text-center text-sm font-semibold text-text" onClick={() => setOpen(false)}>
                {labels.request}
              </a>
              <a href={`tel:${phonePrimary}`} className="rounded-full bg-accent-blue px-4 py-3 text-center text-sm font-bold text-black">
                {labels.call}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
