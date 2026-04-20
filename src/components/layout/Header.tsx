'use client'

import Link from 'next/link'
import { useState } from 'react'

export type Locale = 'en' | 'es' | 'ru'

interface HeaderProps {
  locale: Locale
  phoneDisplay: string
  phonePrimary: string
}

const copy = {
  en: {
    brand: 'Planetlocksmiths',
    request: 'Request Service',
    call: 'Call',
    nav: [
      { label: 'Home', slug: '' },
      { label: 'Services', slug: 'services' },
      { label: 'Service Areas', slug: 'areas' },
      { label: 'Reviews', slug: 'reviews' },
      { label: 'FAQ', slug: 'faq' },
      { label: 'About', slug: 'about' },
      { label: 'Contact', slug: 'contact' },
    ],
  },
  es: {
    brand: 'Planetlocksmiths',
    request: 'Solicitar servicio',
    call: 'Llamar',
    nav: [
      { label: 'Inicio', slug: '' },
      { label: 'Servicios', slug: 'services' },
      { label: 'Zonas', slug: 'areas' },
      { label: 'Reseñas', slug: 'reviews' },
      { label: 'FAQ', slug: 'faq' },
      { label: 'Nosotros', slug: 'about' },
      { label: 'Contacto', slug: 'contact' },
    ],
  },
  ru: {
    brand: 'Planetlocksmiths',
    request: 'Оставить заявку',
    call: 'Позвонить',
    nav: [
      { label: 'Главная', slug: '' },
      { label: 'Услуги', slug: 'services' },
      { label: 'Районы', slug: 'areas' },
      { label: 'Отзывы', slug: 'reviews' },
      { label: 'FAQ', slug: 'faq' },
      { label: 'О нас', slug: 'about' },
      { label: 'Контакты', slug: 'contact' },
    ],
  },
} as const

export default function Header({
  locale,
  phoneDisplay,
  phonePrimary,
}: HeaderProps) {
  const [open, setOpen] = useState(false)
  const t = copy[locale]

  const getHref = (slug: string) => {
    return slug ? `/${locale}/${slug}` : `/${locale}`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/50 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={getHref('')}
          className="text-lg font-bold tracking-tight text-text"
          aria-label="Planetlocksmiths home"
        >
          {t.brand}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {t.nav.map((item) => (
            <Link
              key={item.slug || item.label}
              href={getHref(item.slug)}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={getHref('contact')}
            className="rounded-full border border-line px-4 py-2 text-sm text-text transition-colors hover:border-line/70 hover:bg-white/5"
          >
            {t.request}
          </Link>
          <a
            href={`tel:${phonePrimary}`}
            className="rounded-full bg-accent-blue px-4 py-2 text-sm font-medium text-black transition-colors hover:brightness-110"
          >
            {t.call} {phoneDisplay}
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
            {t.nav.map((item) => (
              <Link
                key={item.slug || item.label}
                href={getHref(item.slug)}
                className="py-3 text-base text-muted transition-colors hover:text-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href={getHref('contact')}
                className="rounded-full border border-line px-4 py-3 text-center text-sm text-text"
                onClick={() => setOpen(false)}
              >
                {t.request}
              </Link>
              <a
                href={`tel:${phonePrimary}`}
                className="rounded-full bg-accent-blue px-4 py-3 text-center text-sm font-medium text-black"
              >
                {t.call} {phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
