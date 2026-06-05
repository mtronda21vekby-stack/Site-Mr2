'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Locale } from './Header'

type ConsentLevel = 'necessary' | 'all'
type ActiveLocale = 'en' | 'es'

const cookieName = 'planetlocksmiths_cookie_consent'
const maxAge = 60 * 60 * 24 * 180

const copy: Record<Locale, {
  title: string
  text: string
  acceptAll: string
  necessaryOnly: string
  customize: string
  save: string
  close: string
  analytics: string
  analyticsText: string
  privacy: string
}> = {
  en: {
    title: 'Cookie preferences',
    text: 'We use necessary cookies to keep this site working and remember your choice. Optional analytics cookies help us understand traffic and improve the website.',
    acceptAll: 'Accept all',
    necessaryOnly: 'Necessary only',
    customize: 'Customize',
    save: 'Save choice',
    close: 'Close',
    analytics: 'Analytics cookies',
    analyticsText: 'Anonymous traffic measurement for improving the site.',
    privacy: 'Privacy Policy',
  },
  es: {
    title: 'Preferencias de cookies',
    text: 'Usamos cookies necesarias para que el sitio funcione y para recordar tu elección. Las cookies opcionales de analítica nos ayudan a entender el tráfico y mejorar el sitio.',
    acceptAll: 'Aceptar todo',
    necessaryOnly: 'Solo necesarias',
    customize: 'Personalizar',
    save: 'Guardar',
    close: 'Cerrar',
    analytics: 'Cookies de analítica',
    analyticsText: 'Medición anónima del tráfico para mejorar el sitio.',
    privacy: 'Política de privacidad',
  },
  ru: {
    title: 'Настройки cookies',
    text: 'Мы используем необходимые cookies для работы сайта и сохранения вашего выбора. Необязательные аналитические cookies помогают улучшать сайт.',
    acceptAll: 'Принять все',
    necessaryOnly: 'Только необходимые',
    customize: 'Настроить',
    save: 'Сохранить',
    close: 'Закрыть',
    analytics: 'Аналитические cookies',
    analyticsText: 'Анонимная оценка посещаемости для улучшения сайта.',
    privacy: 'Privacy Policy',
  },
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return ''
  return document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1) || ''
}

function writeConsent(level: ConsentLevel) {
  const value = encodeURIComponent(JSON.stringify({
    level,
    analytics: level === 'all',
    savedAt: new Date().toISOString(),
  }))

  document.cookie = `${cookieName}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`
  window.dispatchEvent(new CustomEvent('planetlocksmiths-cookie-consent', {
    detail: { level, analytics: level === 'all' },
  }))
}

function getLocaleFromPath(pathname: string | null): Locale {
  const segment = pathname?.split('/').filter(Boolean)[0]
  if (segment === 'es' || segment === 'ru') return segment
  return 'en'
}

export default function CookieConsent() {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const t = useMemo(() => copy[locale], [locale])
  const [visible, setVisible] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    const isAdmin = pathname?.startsWith('/admin')
    setVisible(!isAdmin && !getCookie(cookieName))
  }, [pathname])

  function save(level: ConsentLevel) {
    writeConsent(level)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-[5.75rem] z-[70] px-4 sm:bottom-6" role="dialog" aria-live="polite" aria-label={t.title}>
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] border border-[#0B1F4D]/16 bg-white/94 p-4 text-[#0B1F4D] shadow-[0_26px_90px_rgba(11,31,77,0.18)] backdrop-blur-[30px] sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(11,31,77,0.055),transparent_42%,rgba(18,58,115,0.04))]" />
        <div className="relative grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="font-heading text-lg font-black tracking-[-0.025em]">{t.title}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#42526E]">{t.text}</p>
            <Link href={`/${activeLocale}/privacy`} className="mt-2 inline-flex text-xs font-black uppercase tracking-[0.13em] text-[#123A73] transition hover:text-[#0B1F4D]">
              {t.privacy}
            </Link>

            {customizing ? (
              <label className="mt-4 flex items-start gap-3 rounded-2xl border border-[#0B1F4D]/12 bg-[#F7FAFF] p-3 text-sm">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#0B1F4D]"
                />
                <span>
                  <span className="block font-black">{t.analytics}</span>
                  <span className="mt-1 block leading-6 text-[#42526E]">{t.analyticsText}</span>
                </span>
              </label>
            ) : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-48 lg:grid-cols-1">
            {customizing ? (
              <>
                <button type="button" className="min-h-11 rounded-full bg-[#0B1F4D] px-5 text-xs font-black uppercase tracking-[0.13em] text-white shadow-[0_16px_38px_rgba(11,31,77,0.20)] transition hover:-translate-y-0.5 hover:bg-[#123A73]" onClick={() => save(analytics ? 'all' : 'necessary')}>
                  {t.save}
                </button>
                <button type="button" className="min-h-11 rounded-full border border-[#0B1F4D]/14 bg-white px-5 text-xs font-black uppercase tracking-[0.13em] text-[#0B1F4D] transition hover:-translate-y-0.5 hover:bg-[#F3F7FF]" onClick={() => setCustomizing(false)}>
                  {t.close}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="min-h-11 rounded-full bg-[#0B1F4D] px-5 text-xs font-black uppercase tracking-[0.13em] text-white shadow-[0_16px_38px_rgba(11,31,77,0.20)] transition hover:-translate-y-0.5 hover:bg-[#123A73]" onClick={() => save('all')}>
                  {t.acceptAll}
                </button>
                <button type="button" className="min-h-11 rounded-full border border-[#0B1F4D]/14 bg-white px-5 text-xs font-black uppercase tracking-[0.13em] text-[#0B1F4D] transition hover:-translate-y-0.5 hover:bg-[#F3F7FF]" onClick={() => save('necessary')}>
                  {t.necessaryOnly}
                </button>
                <button type="button" className="min-h-11 rounded-full px-5 text-xs font-black uppercase tracking-[0.13em] text-[#42526E] transition hover:-translate-y-0.5 hover:bg-[#F3F7FF] hover:text-[#0B1F4D]" onClick={() => setCustomizing(true)}>
                  {t.customize}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
