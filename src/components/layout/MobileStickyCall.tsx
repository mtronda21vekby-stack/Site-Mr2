'use client'

import type { Locale } from './Header'

interface MobileStickyCallProps {
  locale: Locale
  phoneDisplay: string
  phonePrimary: string
}

const copy = {
  en: {
    call: 'Call now',
    request: 'Request service',
  },
  es: {
    call: 'Llamar ahora',
    request: 'Solicitar servicio',
  },
  ru: {
    call: 'Позвонить',
    request: 'Оставить заявку',
  },
} as const

export default function MobileStickyCall({
  locale,
  phoneDisplay,
  phonePrimary,
}: MobileStickyCallProps) {
  const t = copy[locale]

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-7xl gap-3">
        <a
          href={`tel:${phonePrimary}`}
          className="flex-1 rounded-full bg-accent-blue px-4 py-3 text-center text-sm font-semibold text-black transition hover:brightness-110"
        >
          {t.call} {phoneDisplay}
        </a>
        <a
          href={`/${locale}/contact`}
          className="flex-1 rounded-full border border-line px-4 py-3 text-center text-sm font-medium text-text transition hover:bg-white/5"
        >
          {t.request}
        </a>
      </div>
    </div>
  )
}
