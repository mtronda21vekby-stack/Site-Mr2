import type { MetadataRoute } from 'next';
import { areaSlugs, serviceSlugs } from '@/lib/content';
import { locales } from '@/lib/i18n';
import { siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/about', '/contact', '/reviews', '/faq', '/services', '/areas'];
  const items: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const route of staticRoutes) items.push({ url: `${siteUrl}/${locale}${route}/` });
    for (const slug of serviceSlugs) items.push({ url: `${siteUrl}/${locale}/services/${slug}/` });
    for (const slug of areaSlugs) items.push({ url: `${siteUrl}/${locale}/areas/${slug}/` });
  }
  return items;
}
