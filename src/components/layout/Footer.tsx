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
    services: 'Services',
    areas: 'Service Areas',
    contact: 'Contact',
    about: 'About',
    reviews: 'Reviews',
    faq: 'FAQ',
    legal: 'Legal',
    brandLine: 'Automotive locksmith support with a mobile-first service model.',
    cta: 'Need help now?',
    ctaText: 'Call directly for urgent requests or open the service request form.',
    call: 'Call now',
  },
  es: {
    rights: 'Todos los derechos reservados.',
    privacy: 'Política de privacidad',
    terms: 'Términos del servicio',
    mobile: 'Servicio móvil de cerrajería automotriz en Filadelfia.',
    services: 'Servicios',
    areas: 'Zonas',
    contact: 'Contacto',
    about: 'Nosotros',
    reviews: 'Reseñas',
    faq: 'FAQ',
    legal: 'Legal',
    brandLine: 'Soporte automotriz con un modelo de servicio completamente móvil.',
    cta: '¿Necesitas ayuda ahora?',
    ctaText: 'Llama directamente para solicitudes urgentes o abre el formulario.',
    call: 'Llamar ahora',
  },
  ru: {
    rights: 'Все права защищены.',
    privacy: 'Политика конфиденциальности',
    terms: 'Условия сервиса',
    mobile: 'Мобильный автомобильный ключной сервис по Филадельфии.',
    services: 'Услуги',
    areas: 'Районы',
    contact: 'Контакты',
    about: 'О нас',
    reviews: 'Отзывы',
    faq: 'FAQ',
    legal: 'Документы',
    brandLine: 'Автомобильная помощь с полностью выездной моделью сервиса.',
    cta: 'Нужна помощь прямо сейчас?',
    ctaText: 'Для срочных заявок звони напрямую или открой форму запроса сервиса.',
    call: 'Позвонить',
  },
} as const

export default function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear()
  const t = copy[locale]

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-surface-2 py-14 text-muted">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(77,162,255,0.08),transparent_26%),radial-gradient(circle_at_85%_20%,rgba(45,226,230,0.08),transparent_24%)]" />
      <div className="section-frame relative">
        <div className="premium-shell overflow-hidden px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div>
                <p className="premium-label mb-4">Planetlocksmiths</p>
                <h2 className="text-2xl font-heading font-semibold text-text md:text-3xl">
                  {t.cta}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                  {t.ctaText}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/contact`}
                  className="premium-button-secondary"
                >
                  {t.contact}
                </Link>
              </div>

              <div className="premium-card-soft p-5">
                <p className="text-sm leading-7 text-muted">{t.brandLine}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{t.mobile}</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="premium-card-soft p-5">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-accent-cyan">
                  Navigation
                </p>
                <nav className="flex flex-col gap-3">
                  <Link href={`/${locale}/services`} className="text-sm hover:text-text">
                    {t.services}
                  </Link>
                  <Link href={`/${locale}/areas`} className="text-sm hover:text-text">
                    {t.areas}
                  </Link>
                  <Link href={`/${locale}/about`} className="text-sm hover:text-text">
                    {t.about}
                  </Link>
                  <Link href={`/${locale}/reviews`} className="text-sm hover:text-text">
                    {t.reviews}
                  </Link>
                  <Link href={`/${locale}/faq`} className="text-sm hover:text-text">
                    {t.faq}
                  </Link>
                  <Link href={`/${locale}/contact`} className="text-sm hover:text-text">
                    {t.contact}
                  </Link>
                </nav>
              </div>

              <div className="premium-card-soft p-5">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-accent-cyan">
                  {t.legal}
                </p>
                <nav className="flex flex-col gap-3">
                  <Link href={`/${locale}/privacy`} className="text-sm hover:text-text">
                    {t.privacy}
                  </Link>
                  <Link href={`/${locale}/terms`} className="text-sm hover:text-text">
                    {t.terms}
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          <div className="mt-8 h-px w-full bg-white/10" />

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-text">
              © {year} Planetlocksmiths. {t.rights}
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Philadelphia • Mobile automotive locksmith
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
