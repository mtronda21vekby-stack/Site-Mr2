import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { getGlobalSettings, getHomeContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const settings = getGlobalSettings();

  return buildMetadata({
    title: `Automotive Locksmith Services in Philadelphia, PA | ${settings.brandName}`,
    description: "Mobile automotive locksmith services in Philadelphia for lockouts, key replacement, programming, fobs, and ignition key issues.",
    locale: localeParam,
    path: `/${localeParam}/services`,
    settings
  });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const home = getHomeContent(localeParam);

  return (
    <div className="pt-8">
      <ServicesGrid
        locale={localeParam}
        title={home.servicesTitle}
        intro={home.servicesIntro}
        services={home.featuredServices}
      />
    </div>
  );
}
