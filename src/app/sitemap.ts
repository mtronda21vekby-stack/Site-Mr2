import { getHomeContent } from '@/lib/content';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const locales: ('en' | 'es' | 'ru')[] = ['en', 'es', 'ru'];
  const urls: string[] = [];
  // Add home, services index and contact for each locale
  locales.forEach((locale) => {
    urls.push(`${baseUrl}/${locale}`);
    urls.push(`${baseUrl}/${locale}/services`);
    urls.push(`${baseUrl}/${locale}/contact`);
    urls.push(`${baseUrl}/${locale}/areas`);
    urls.push(`${baseUrl}/${locale}/reviews`);
    urls.push(`${baseUrl}/${locale}/faq`);
  });
  // Add service detail pages
  locales.forEach((locale) => {
    const home = getHomeContent(locale);
    home.featuredServices.forEach((service) => {
      urls.push(`${baseUrl}/${locale}/services/${service.slug}`);
    });
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `<url><loc>${u}</loc></url>`) 
    .join('\n')}\n</urlset>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}