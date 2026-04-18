import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { getAreas, getGlobalSettings, getHomeContent } from "@/lib/content";
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
    title: `Service Areas | ${settings.brandName}`,
    description: "Mobile automotive locksmith service areas for Planetlocksmiths, starting with Philadelphia, PA.",
    locale: localeParam,
    path: `/${localeParam}/areas`,
    settings
  });
}

export default async function AreasPage({ params }: PageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const home = getHomeContent(localeParam);
  const areas = getAreas(localeParam);

  return (
    <div className="pt-8">
      <ServiceAreas locale={localeParam} title={home.areasTitle} intro={home.areasText} areas={areas} />
    </div>
  );
}
