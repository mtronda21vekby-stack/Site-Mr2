import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileStickyCall } from "@/components/layout/MobileStickyCall";
import { getGlobalSettings, getHomeContent } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const settings = getGlobalSettings();
  const home = getHomeContent(localeParam);

  return (
    <>
      <Header locale={localeParam} settings={settings} nav={home.nav} />
      <main>{children}</main>
      <Footer locale={localeParam} settings={settings} nav={home.nav} />
      <MobileStickyCall locale={localeParam} settings={settings} nav={home.nav} />
    </>
  );
}
