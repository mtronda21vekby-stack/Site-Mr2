import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { ContactSection } from "@/components/sections/ContactSection";
import { EmergencyStrip } from "@/components/sections/EmergencyStrip";
import { FAQSection } from "@/components/sections/FAQSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Hero } from "@/components/hero/Hero";
import { getAreas, getFaq, getGlobalSettings, getHomeContent, getReviews } from "@/lib/content";
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
  const title = `Automotive Locksmith in Philadelphia, PA | ${settings.brandName}`;
  const description =
    "Mobile automotive locksmith service in Philadelphia. Car lockout help, key replacement, and key programming available 24/7.";

  return buildMetadata({
    title,
    description,
    locale: localeParam,
    path: `/${localeParam}`,
    settings
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const settings = getGlobalSettings();
  const home = getHomeContent(localeParam);
  const reviews = getReviews(localeParam);
  const faq = getFaq(localeParam);
  const areas = getAreas(localeParam);

  return (
    <>
      <LocalBusinessSchema settings={settings} />
      <FAQSchema items={faq.items} />
      <Hero content={home} settings={settings} />
      <ServicesGrid
        locale={localeParam}
        title={home.servicesTitle}
        intro={home.servicesIntro}
        services={home.featuredServices}
      />
      <WhyChoose title={home.whyTitle} items={home.whyChoose} />
      <EmergencyStrip content={home} settings={settings} />
      <ServiceAreas locale={localeParam} title={home.areasTitle} intro={home.areasText} areas={areas} />
      <ReviewsSection title={home.reviewsTitle} items={reviews.items} />
      <FAQSection title={home.faqTitle} items={faq.items} />
      <ContactSection
        title={home.contactTitle}
        text={home.contactText}
        settings={settings}
        locale={localeParam}
        primaryCta={home.heroSecondaryCta}
        callCta={home.heroPrimaryCta}
      />
    </>
  );
}
