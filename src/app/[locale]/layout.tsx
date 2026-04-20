import MobileStickyCall from '@/components/layout/MobileStickyCall'
import { getGlobalSettings, type Locale } from '@/lib/content'

const allowedLocales: Locale[] = ['en', 'es', 'ru']

function normalizeLocale(value: string): Locale {
  return allowedLocales.includes(value as Locale) ? (value as Locale) : 'en'
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const safeLocale = normalizeLocale(locale)
  const global = getGlobalSettings()

  return (
    <>
      {children}
      <MobileStickyCall
        locale={safeLocale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
    </>
  )
}
