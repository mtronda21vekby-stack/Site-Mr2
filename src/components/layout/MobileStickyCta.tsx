import Link from 'next/link'
import type { Locale } from './Header'

const labels: Record<Locale, { request: string; callAria: string }> = {
  en: { request: 'Request', callAria: 'Call Planetlocksmiths now' },
  es: { request: 'Solicitud', callAria: 'Llamar a Planetlocksmiths ahora' },
  ru: { request: 'Request', callAria: 'Call Planetlocksmiths now' },
}

export default function MobileStickyCta({
  locale,
  phoneNumber,
}: {
  locale: Locale
  phoneNumber: string
}) {
  const activeLocale = locale === 'es' ? 'es' : 'en'
  const copy = labels[activeLocale]
  const requestHref = `/${activeLocale}/contact#request-service`

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#0B1F4D]/12 bg-white/90 p-3 shadow-[0_-18px_70px_rgba(11,31,77,0.14)] backdrop-blur-[30px] md:hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(11,31,77,0.045),transparent_44%,rgba(18,58,115,0.035))]" />
      <div className="relative mx-auto grid max-w-md grid-cols-[4rem_1fr] gap-3">
        <a
          href={`tel:${phoneNumber}`}
          className="notranslate group inline-flex min-h-12 items-center justify-center rounded-full border border-[#0B1F4D]/10 bg-[#0B1F4D] px-4 text-xl text-white shadow-[0_16px_42px_rgba(11,31,77,0.24)] transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(11,31,77,0.30)] active:translate-y-0 active:scale-[0.96]"
          translate="no"
          aria-label={copy.callAria}
          title={copy.callAria}
        >
          <span aria-hidden="true" className="transition duration-300 group-hover:-rotate-12 group-hover:scale-110">📞</span>
          <span className="sr-only">{copy.callAria}</span>
        </a>
        <Link
          href={requestHref}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#0B1F4D]/18 bg-white px-4 text-xs font-black uppercase tracking-[0.14em] text-[#0B1F4D] shadow-[0_14px_36px_rgba(11,31,77,0.08)] transition hover:-translate-y-1 hover:bg-[#F3F7FF] active:scale-[0.98]"
        >
          {copy.request}
        </Link>
      </div>
    </div>
  )
}
