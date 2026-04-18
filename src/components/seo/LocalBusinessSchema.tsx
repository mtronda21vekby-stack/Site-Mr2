import { JsonLd } from "./JsonLd";
import type { GlobalSettings } from "@/types/content";
import { absoluteUrl } from "@/lib/utils";

type LocalBusinessSchemaProps = {
  settings: GlobalSettings;
};

export function LocalBusinessSchema({ settings }: LocalBusinessSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "AutomotiveBusiness"],
        name: settings.brandName,
        url: absoluteUrl("/"),
        telephone: settings.phonePrimary,
        areaServed: {
          "@type": "City",
          name: settings.primaryCity,
          addressRegion: settings.primaryState,
          addressCountry: settings.country
        },
        openingHours: "Mo-Su 00:00-23:59",
        priceRange: "$$"
      }}
    />
  );
}
