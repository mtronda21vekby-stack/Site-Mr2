import Link from 'next/link'
import type { Locale } from './Header'

interface FooterProps {
  locale: Locale
}

const copy = {
  en: {
    rights: 'All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    mobile: 'Mobile automotive locksmith service across Philadelphia.',
  },
  es: {
    rights: 'Todos los derechos reservados.',
    privacy: 'Política de privacidad',
    terms: 'Términos del servicio',
    mobile: 'Servicio móvil de cerrajería automotriz en Filadelfia.',
  },
  ru: {
    rights: 'Все права защищены.',
    privacy: 'Политика конфиденциальности',
    terms: 'Условия сервиса',
    mobile: 'Мобильный автомобильный ключной сервис по Филадельфии.',
  },
} as const

export default function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear()
  const t = copy[locale]

  return (
    <footer className="border-t border-line bg-surface-2 py-8 text-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-text">© {year} Planetlocksmiths. {t.rights}</p>
            <p className="text-sm">{t.mobile}</p>
          </div>

          <nav className="flex flex-wrap items-center gap-4">
            <Link href={`/${locale}/privacy`} className="text-sm hover:text-text">
              {t.privacy}
            </Link>
            <Link href={`/${locale}/terms`} className="text-sm hover:text-text">
              {t.terms}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
