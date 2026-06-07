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
    text: 'We use necessary cookies to run this site and remember your choice. Optional analytics help improve the website.',
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
    text: 'Usamos cookies necesarias para el sitio y para recordar tu elección. La analítica opcional ayuda a mejorar el sitio.',
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
    text: 'Мы используем необходимые cookies для работы сайта и сохранения выбора. Аналитика помогает улучшать сайт.',
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

function getSavedConsent() {
  const raw = getCookie(cookieName)
  if (!raw) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as { analytics?: boolean; level?: ConsentLevel }
    return {
      analytics: Boolean(parsed.analytics || parsed.level === 'all'),
    }
  } catch {
    return null
  }
}

function writeConsent(level: ConsentLevel) {
  const value = encodeURIComponent(JSON.stringify({
    level,
    analytics: level === 'all',
    savedAt: new Date().toISOString(),
  }))

  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${cookieName}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secureFlag}`
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
    function openPreferences() {
      const saved = getSavedConsent()
      setAnalytics(Boolean(saved?.analytics))
      setCustomizing(true)
      setVisible(true)
    }

    window.addEventListener('planetlocksmiths-open-cookie-preferences', openPreferences)
    return () => window.removeEventListener('planetlocksmiths-open-cookie-preferences', openPreferences)
  }, [])

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
    <div className="fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[70] px-3 sm:bottom-6 sm:px-4" role="dialog" aria-live="polite" aria-label={t.title}>
      <div className="mx-auto max-h-[calc(100dvh-7rem)] max-w-4xl overflow-y-auto rounded-[1.25rem] border border-[#0B1F4D]/16 bg-white/95 p-3 text-[#0B1F4D] shadow-[0_18px_58px_rgba(11,31,77,0.16)] backdrop-blur-[28px] sm:max-h-none sm:overflow-hidden sm:rounded-[1.75rem] sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(11,31,77,0.055),transparent_42%,rgba(18,58,115,0.04))]" />
        <div className="relative grid gap-3 sm:gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="font-heading text-base font-black tracking-[-0.025em] sm:text-lg">{t.title}</p>
            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#42526E] sm:mt-2 sm:text-sm sm:leading-6">{t.text}</p>
            <Link href={`/${activeLocale}/privacy`} className="mt-1.5 inline-flex text-[0.64rem] font-black uppercase tracking-[0.12em] text-[#123A73] transition hover:text-[#0B1F4D] sm:mt-2 sm:text-xs">
              {t.privacy}
            </Link>

            {customizing ? (
              <label className="mt-3 flex items-start gap-3 rounded-2xl border border-[#0B1F4D]/12 bg-[#F7FAFF] p-3 text-xs sm:mt-4 sm:text-sm">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#0B1F4D]"
                />
                <span>
                  <span className="block font-black">{t.analytics}</span>
                  <span className="mt-1 block leading-5 text-[#42526E] sm:leading-6">{t.analyticsText}</span>
                </span>
              </label>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-48 lg:grid-cols-1">
            {customizing ? (
              <>
                <button type="button" className="min-h-10 rounded-full bg-[#0B1F4D] px-4 text-[0.66rem] font-black uppercase tracking-[0.11em] text-white shadow-[0_14px_32px_rgba(11,31,77,0.18)] transition hover:-translate-y-0.5 hover:bg-[#123A73] sm:min-h-11 sm:px-5 sm:text-xs sm:tracking-[0.13em]" onClick={() => save(analytics ? 'all' : 'necessary')}>
                  {t.save}
                </button>
                <button type="button" className="min-h-10 rounded-full border border-[#0B1F4D]/14 bg-white px-4 text-[0.66rem] font-black uppercase tracking-[0.11em] text-[#0B1F4D] transition hover:-translate-y-0.5 hover:bg-[#F3F7FF] sm:min-h-11 sm:px-5 sm:text-xs sm:tracking-[0.13em]" onClick={() => setCustomizing(false)}>
                  {t.close}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="min-h-10 rounded-full bg-[#0B1F4D] px-4 text-[0.66rem] font-black uppercase tracking-[0.11em] text-white shadow-[0_14px_32px_rgba(11,31,77,0.18)] transition hover:-translate-y-0.5 hover:bg-[#123A73] sm:min-h-11 sm:px-5 sm:text-xs sm:tracking-[0.13em]" onClick={() => save('all')}>
                  {t.acceptAll}
                </button>
                <button type="button" className="min-h-10 rounded-full border border-[#0B1F4D]/14 bg-white px-4 text-[0.66rem] font-black uppercase tracking-[0.11em] text-[#0B1F4D] transition hover:-translate-y-0.5 hover:bg-[#F3F7FF] sm:min-h-11 sm:px-5 sm:text-xs sm:tracking-[0.13em]" onClick={() => save('necessary')}>
                  {t.necessaryOnly}
                </button>
                <button type="button" className="col-span-2 min-h-9 rounded-full px-4 text-[0.66rem] font-black uppercase tracking-[0.11em] text-[#42526E] transition hover:-translate-y-0.5 hover:bg-[#F3F7FF] hover:text-[#0B1F4D] sm:col-span-1 sm:min-h-11 sm:px-5 sm:text-xs sm:tracking-[0.13em]" onClick={() => setCustomizing(true)}>
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
