import type { MetadataRoute } from 'next';
import { getHomeContent } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://planetlocksmiths.pages.dev';
  const locales: Array<'en' | 'es' | 'ru'> = ['en', 'es', 'ru'];
  const staticRoutes = ['', '/services', '/contact', '/areas', '/reviews', '/faq', '/about', '/privacy', '/terms'];
  const pages: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      pages.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    }

    const home = getHomeContent(locale);
    for (const service of home.featuredServices) {
      pages.push({
        url: `${baseUrl}/${locale}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    pages.push({
      url: `${baseUrl}/${locale}/areas/philadelphia`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return pages;
}
