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
  ],
  es: [
    { label: 'Inicio', href: (locale) => `/${locale}` },
    { label: 'Servicios', href: (locale) => `/${locale}/services` },
    { label: 'Áreas', href: (locale) => `/${locale}/areas` },
  ],
  ru: [
    { label: 'Главная', href: (locale) => `/${locale}` },
    { label: 'Услуги', href: (locale) => `/${locale}/services` },
    { label: 'Районы', href: (locale) => `/${locale}/areas` },
  ],
}

const ctaLabels: Record<Locale, { request: string; call: string }> = {
  en: {
    request: 'Request Service',
    call: 'Call',
  },
  es: {
    request: 'Заказать сервис',
    call: 'Llamar',
  },
  ru: {
    request: 'Заказать услугу',
    call: 'Позвонить',
  },
}

export default function Header({
  locale,
  phoneDisplay,
  phonePrimary,
}: HeaderProps) {
  const [open, setOpen] = useState(false)

  const navItems = navConfig[locale]
  const labels = ctaLabels[locale]

  return (
    <header className="sticky top-0 z-50 border-b border-line/50 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="min-w-0 truncate text-lg font-bold text-text"
          aria-label="Planetlocksmiths home"
        >
          Planetlocksmiths
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href(locale)}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${phonePrimary}`}
            className="rounded-full border border-line px-4 py-2 text-sm text-text transition-colors hover:border-line/70 hover:bg-white/5"
          >
            {labels.request}
          </a>

          <a
            href={`tel:${phonePrimary}`}
            className="rounded-full bg-accent-blue px-4 py-2 text-sm font-medium text-black transition-colors hover:brightness-110"
          >
            {labels.call} {phoneDisplay}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded border border-line text-text md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-xl leading-none">{open ? '×' : '☰'}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href(locale)}
                className="py-3 text-base text-muted transition-colors hover:text-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              <a
                href={`tel:${phonePrimary}`}
                className="rounded-full border border-line px-4 py-3 text-center text-sm text-text"
              >
                {labels.request}
              </a>

              <a
                href={`tel:${phonePrimary}`}
                className="rounded-full bg-accent-blue px-4 py-3 text-center text-sm font-medium text-black"
              >
                {labels.call} {phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
