import type { MetadataRoute } from 'next'
import { ACTIVE_LOCALES } from '@/lib/locales'
import type { Locale } from '@/lib/content'
import { getSiteUrl } from '@/lib/seo'
import {
  getAreasListFromSource,
  getServicesListFromSource,
} from '@/lib/content.server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()
  const now = new Date()
  const pages: MetadataRoute.Sitemap = []

  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'daily' as const },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/areas', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/reviews', priority: 0.68, changeFrequency: 'weekly' as const },
    { path: '/privacy', priority: 0.45, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.45, changeFrequency: 'monthly' as const },
  ]

  for (const locale of ACTIVE_LOCALES) {
    const typedLocale = locale as Locale

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
        getServicesListFromSource(typedLocale),
        getAreasListFromSource(typedLocale),
      ])

      for (const service of services) {
        if (!service.slug) continue

        pages.push({
          url: `${baseUrl}/${locale}/services/${service.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.82,
        })
      }

      for (const area of areas) {
        if (!area.slug) continue

        pages.push({
          url: `${baseUrl}/${locale}/areas/${area.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    } catch (error) {
      console.error(`sitemap dynamic routes failed for ${locale}:`, error)
    }
  }

  return pages
}
