import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ACTIVE_LOCALES, isValidLocale } from '@/lib/locales'

export async function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }))
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
