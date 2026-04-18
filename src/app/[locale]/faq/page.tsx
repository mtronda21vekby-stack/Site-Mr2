import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { FAQSection } from "@/components/sections/FAQSection";
import { getFaq, getGlobalSettings, getHomeContent } from "@/lib/content";
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
    title: `FAQ | ${settings.brandName}`,
    description: "Answers about Planetlocksmiths mobile automotive locksmith service, 24/7 availability, lost keys, and Philadelphia coverage.",
    locale: localeParam,
    path: `/${localeParam}/faq`,
    settings
  });
}

export default async function FAQPage({ params }: PageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const home = getHomeContent(localeParam);
  const faq = getFaq(localeParam);

  return (
    <>
      <FAQSchema items={faq.items} />
      <div className="pt-8">
        <FAQSection title={home.faqTitle} items={faq.items} />
      </div>
    </>
  );
}
