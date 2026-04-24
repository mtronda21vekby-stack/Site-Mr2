import type { MetadataRoute } from 'next'
import { ACTIVE_LOCALES, type Locale } from '@/lib/locales'
import {
  getAreasListFromSource,
  getServicesListFromSource,
} from '@/lib/content.server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.com'
  const now = new Date()
  const pages: MetadataRoute.Sitemap = []

  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'daily' as const },
    { path: '/services', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/areas', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/privacy', priority: 0.45, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.45, changeFrequency: 'monthly' as const },
  ]

  for (const locale of ACTIVE_LOCALES) {
    for (const route of staticRoutes) {
      pages.push({
        url: `${baseUrl}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      })
    }

    try {
      const [services, areas] = await Promise.all([
        getServicesListFromSource(locale as Locale),
        getAreasListFromSource(locale as Locale),
      ])

      for (const service of services) {
        if (!service.slug) continue

        pages.push({
          url: `${baseUrl}/${locale}/services/${service.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.78,
        })
      }

      for (const area of areas) {
        if (!area.slug) continue

        pages.push({
          url: `${baseUrl}/${locale}/areas/${area.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.76,
        })
      }
    } catch (error) {
      console.error(`sitemap dynamic routes failed for ${locale}:`, error)
    }
  }

  return pages
}
