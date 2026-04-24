import Link from 'next/link'
import type { Locale } from './Header'

interface FooterProps {
  locale: Locale
}

const footerLabels: Record<
  Locale,
  {
    home: string
    services: string
    areas: string
    rights: string
  }
> = {
  en: {
    home: 'Home',
    services: 'Services',
    areas: 'Service Areas',
    rights: 'All rights reserved.',
  },
  es: {
    home: 'Inicio',
    services: 'Servicios',
    areas: 'Áreas',
    rights: 'Todos los derechos reservados.',
  },
  ru: {
    home: 'Главная',
    services: 'Услуги',
    areas: 'Районы',
    rights: 'Все права защищены.',
  },
}

export default function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear()
  const labels = footerLabels[locale]

  return (
    <footer className="border-t border-line bg-surface-2 py-8 text-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm">
            © {year} Planetlocksmiths. {labels.rights}
          </p>

          <nav className="flex flex-wrap items-center gap-4">
            <Link href={`/${locale}`} className="text-sm hover:text-text">
              {labels.home}
            </Link>

            <Link
              href={`/${locale}/services`}
              className="text-sm hover:text-text"
            >
              {labels.services}
            </Link>

            <Link
              href={`/${locale}/areas`}
              className="text-sm hover:text-text"
            >
              {labels.areas}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
