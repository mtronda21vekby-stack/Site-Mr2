import type { Metadata } from 'next'

export type SeoLocale = 'en' | 'es'

export type PageSeoInput = {
  locale: SeoLocale
  path: string
  title: string
  description: string
  image?: string
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com').replace(/\/$/, '')
}

export function getLocalizedPath(locale: SeoLocale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
}

export function getCanonicalUrl(locale: SeoLocale, path: string): string {
  return `${getSiteUrl()}${getLocalizedPath(locale, path)}`
}

export function buildLocalizedAlternates(path: string): Metadata['alternates'] {
  return {
    canonical: getCanonicalUrl('en', path),
    languages: {
      en: getCanonicalUrl('en', path),
      es: getCanonicalUrl('es', path),
      'x-default': getCanonicalUrl('en', path),
    },
  }
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const url = getCanonicalUrl(input.locale, input.path)
  const image = input.image || '/og-image.png'

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url,
      languages: {
        en: getCanonicalUrl('en', input.path),
        es: getCanonicalUrl('es', input.path),
        'x-default': getCanonicalUrl('en', input.path),
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Planetlocksmiths',
      url,
      title: input.title,
      description: input.description,
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image],
    },
  }
}
