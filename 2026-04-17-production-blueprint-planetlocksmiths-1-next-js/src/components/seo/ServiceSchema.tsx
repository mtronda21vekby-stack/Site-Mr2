import { JsonLd } from "./JsonLd";
import type { GlobalSettings, ServicePage } from "@/types/content";
import { absoluteUrl } from "@/lib/utils";

type ServiceSchemaProps = {
  service: ServicePage;
  settings: GlobalSettings;
  path: string;
};

export function ServiceSchema({ service, settings, path }: ServiceSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.seoDescription,
        url: absoluteUrl(path),
        provider: {
          "@type": "LocalBusiness",
          name: settings.brandName,
          telephone: settings.phonePrimary
        },
        areaServed: {
          "@type": "City",
          name: settings.primaryCity,
          addressRegion: settings.primaryState
        }
      }}
    />
  );
}
