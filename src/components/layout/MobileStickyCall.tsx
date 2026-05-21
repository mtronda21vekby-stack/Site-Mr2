'use client'

import type { Locale } from './Header'

interface MobileStickyCallProps {
  locale: Locale
  phoneDisplay: string
  phonePrimary: string
}

const copy = {
  en: { request: 'Request service', callAria: 'Call now' },
  es: { request: 'Solicitar servicio', callAria: 'Llamar ahora' },
  ru: { request: 'Оставить заявку', callAria: 'Позвонить' },
} as const

export default function MobileStickyCall({
  locale,
  phoneDisplay,
  phonePrimary,
}: MobileStickyCallProps) {
  const t = copy[locale]

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#0B1F4D]/12 bg-white/92 p-3 shadow-[0_-18px_70px_rgba(11,31,77,0.14)] backdrop-blur-[30px] md:hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-[4rem_1fr] gap-3">
        <a
          href={`tel:${phonePrimary}`}
          className="notranslate group inline-flex min-h-12 items-center justify-center rounded-full border border-[#0B1F4D]/10 bg-[#0B1F4D] px-4 text-xl text-white shadow-[0_16px_42px_rgba(11,31,77,0.24)] transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(11,31,77,0.30)] active:translate-y-0 active:scale-[0.96]"
          aria-label={`${t.callAria} ${phoneDisplay}`}
          title={`${t.callAria} ${phoneDisplay}`}
        >
          <span aria-hidden="true" className="transition duration-300 group-hover:-rotate-12 group-hover:scale-110">📞</span>
          <span className="sr-only">{t.callAria} {phoneDisplay}</span>
        </a>
        <a
          href={`/${locale}/contact`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#0B1F4D]/18 bg-white px-4 text-center text-xs font-black uppercase tracking-[0.14em] text-[#0B1F4D] shadow-[0_14px_36px_rgba(11,31,77,0.08)] transition hover:-translate-y-1 hover:bg-[#F3F7FF] active:scale-[0.98]"
        >
          {t.request}
        </a>
      </div>
    </div>
  )
}
