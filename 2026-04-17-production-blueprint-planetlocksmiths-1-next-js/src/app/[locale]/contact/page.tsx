import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/sections/ContactSection";
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
    title: `Contact | ${settings.brandName}`,
    description: "Request mobile automotive locksmith service in Philadelphia or call Planetlocksmiths for urgent 24/7 help.",
    locale: localeParam,
    path: `/${localeParam}/contact`,
    settings
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const settings = getGlobalSettings();
  const home = getHomeContent(localeParam);

  return (
    <div className="pt-8">
      <ContactSection
        title={home.contactTitle}
        text={home.contactText}
        settings={settings}
        locale={localeParam}
        primaryCta={home.heroSecondaryCta}
        callCta={home.heroPrimaryCta}
      />
    </div>
  );
}
