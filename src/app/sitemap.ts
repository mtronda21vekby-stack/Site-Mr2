import type { MetadataRoute } from "next";
import { getAreas, getGlobalSettings, getServices } from "@/lib/content";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://planetlocksmiths.com";
  const settings = getGlobalSettings();
  const staticPaths = ["", "/services", "/areas", "/about", "/reviews", "/faq", "/contact"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const staticPath of staticPaths) {
      entries.push({
        url: `${siteUrl}/${locale}${staticPath}`,
        lastModified: new Date(),
        changeFrequency: staticPath === "" ? "weekly" : "monthly",
        priority: staticPath === "" ? 1 : 0.7
      });
    }

    for (const service of getServices(locale)) {
      entries.push({
        url: `${siteUrl}/${locale}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8
      });
    }

    for (const area of getAreas(locale)) {
      entries.push({
        url: `${siteUrl}/${locale}/areas/${area.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8
      });
    }
  }

  return entries.filter((entry) => entry.url.includes(settings.defaultLocale) || entry.url.includes("/es") || entry.url.includes("/ru"));
}
