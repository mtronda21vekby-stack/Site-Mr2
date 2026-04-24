import type { MetadataRoute } from 'next'
import { ACTIVE_LOCALES } from '@/lib/locales'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'

  const staticRoutes = [
    '',
    '/services',
    '/areas',
    '/contact',
    '/privacy',
    '/terms',
  ]

  const pages: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const locale of ACTIVE_LOCALES) {
    for (const route of staticRoutes) {
      pages.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.75,
      })
    }
  }

  return pages
}
