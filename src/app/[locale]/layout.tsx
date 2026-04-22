import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'

const locales = ['en', 'es', 'ru'] as const
type Locale = (typeof locales)[number]

function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  return <>{children}</>
}
