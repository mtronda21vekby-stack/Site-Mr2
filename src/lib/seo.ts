import type { Metadata } from "next";
import type { Locale } from "@/types/common";
import type { GlobalSettings } from "@/types/content";
import { absoluteUrl } from "./utils";

type SeoInput = {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  settings: GlobalSettings;
};

export function buildMetadata({ title, description, locale, path, settings }: SeoInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        settings.supportedLocales.map((supportedLocale) => [
          supportedLocale,
          absoluteUrl(path.replace(`/${locale}`, `/${supportedLocale}`))
        ])
      )
    },
    openGraph: {
      title,
      description,
      url,
      locale,
      siteName: settings.brandName,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
