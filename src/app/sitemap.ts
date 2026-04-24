import type { MetadataRoute } from 'next'
import { getHomeContent } from '@/lib/content'
import { ACTIVE_LOCALES } from '@/lib/locales'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.pages.dev'

  const staticRoutes = [
    '',
    '/services',
    '/contact',
    '/areas',
    '/reviews',
    '/faq',
    '/about',
    '/privacy',
    '/terms',
  ]

  const pages: MetadataRoute.Sitemap = []

  for (const locale of ACTIVE_LOCALES) {
    for (const route of staticRoutes) {
      pages.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    }

    const home = getHomeContent(locale)

    for (const service of home.featuredServices) {
      pages.push({
        url: `${baseUrl}/${locale}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  return pages
}
