import Link from 'next/link'
import type { Locale } from './Header'

const labels: Record<Locale, { call: string; request: string }> = {
  en: { call: 'Call now', request: 'Request' },
  es: { call: 'Llamar', request: 'Solicitud' },
  ru: { call: 'Call now', request: 'Request' },
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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/14 bg-[#07101f]/58 p-3 shadow-[0_-18px_70px_rgba(0,0,0,0.34)] backdrop-blur-[30px] md:hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.10),transparent_44%,rgba(77,162,255,0.08))]" />
      <div className="relative mx-auto grid max-w-md grid-cols-2 gap-3">
        <a
          href={`tel:${phoneNumber}`}
          className="notranslate inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-4 text-sm font-black text-black shadow-[0_0_28px_rgba(77,162,255,0.28)] transition active:scale-[0.98]"
          translate="no"
        >
          {copy.call}
        </a>
        <Link
          href={requestHref}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/[0.075] px-4 text-sm font-black text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl transition active:scale-[0.98]"
        >
          {copy.request}
        </Link>
      </div>
    </div>
  )
}
