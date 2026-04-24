import Link from 'next/link'
import type { Locale } from './Header'

const labels: Record<Locale, { call: string; request: string }> = {
  en: { call: 'Call now', request: 'Request' },
  es: { call: 'Llamar', request: 'Solicitud' },
  ru: { call: 'Позвонить', request: 'Заявка' },
}

export default function MobileStickyCta({
  locale,
  phoneNumber,
}: {
  locale: Locale
  phoneNumber: string
}) {
  const copy = labels[locale]
  const requestHref = `/${locale}/contact#request-service`

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-bg/95 p-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <a
          href={`tel:${phoneNumber}`}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-4 text-sm font-bold text-black shadow-[0_0_28px_rgba(77,162,255,0.25)]"
        >
          {copy.call}
        </a>
        <Link
          href={requestHref}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-bold text-text"
        >
          {copy.request}
        </Link>
      </div>
    </div>
  )
}
