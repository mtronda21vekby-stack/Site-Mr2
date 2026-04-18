import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { getGlobalSettings, getHomeContent, getReviews } from "@/lib/content";
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
    title: `Reviews | ${settings.brandName}`,
    description: "Customer notes for Planetlocksmiths mobile automotive locksmith service in Philadelphia.",
    locale: localeParam,
    path: `/${localeParam}/reviews`,
    settings
  });
}

export default async function ReviewsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const home = getHomeContent(localeParam);
  const reviews = getReviews(localeParam);

  return (
    <div className="pt-8">
      <ReviewsSection title={home.reviewsTitle} items={reviews.items} />
    </div>
  );
}
