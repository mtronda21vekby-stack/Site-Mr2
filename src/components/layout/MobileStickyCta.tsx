import Link from 'next/link'
import type { Locale } from './Header'

const labels: Record<Locale, { request: string; callAria: string }> = {
  en: { request: 'Request', callAria: 'Call Planet Locksmiths now' },
  es: { request: 'Solicitud', callAria: 'Llamar a Planet Locksmiths ahora' },
  ru: { request: 'Request', callAria: 'Call Planet Locksmiths now' },
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
    <div translate="no" className="notranslate fixed inset-x-0 bottom-0 z-50 border-t border-[#0B1F4D]/12 bg-white/90 p-3 shadow-[0_-18px_70px_rgba(11,31,77,0.14)] backdrop-blur-[30px] md:hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(11,31,77,0.045),transparent_44%,rgba(18,58,115,0.035))]" />
      <div className="relative mx-auto grid max-w-md grid-cols-[4rem_1fr] gap-3">
        <a
          href={`tel:${phoneNumber}`}
          className="group inline-flex min-h-12 items-center justify-center rounded-full border border-[#0B1F4D]/10 bg-[#0B1F4D] px-4 text-xl text-white shadow-[0_16px_42px_rgba(11,31,77,0.24)] transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(11,31,77,0.30)] active:translate-y-0 active:scale-[0.96]"
          aria-label={copy.callAria}
          title={copy.callAria}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 transition duration-300 group-hover:-rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.8.62 2.65a2 2 0 0 1-.45 2.11L8.01 9.75a16 16 0 0 0 6.24 6.24l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.74.5 2.65.62A2 2 0 0 1 22 16.92z" />
          </svg>
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
