import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ContactSection } from "@/components/sections/ContactSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { getArea, getAreas, getGlobalSettings, getHomeContent } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAreas(locale).map((area) => ({
      locale,
      slug: area.slug
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const settings = getGlobalSettings();
  const area = getArea(localeParam, slug);

  if (!area) {
    return {};
  }

  return buildMetadata({
    title: area.seoTitle,
    description: area.seoDescription,
    locale: localeParam,
    path: `/${localeParam}/areas/${slug}`,
    settings
  });
}

export default async function AreaPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const settings = getGlobalSettings();
  const home = getHomeContent(localeParam);
  const area = getArea(localeParam, slug);
  const copy = {
    en: {
      highlights: "Highlights",
      services: "Supported services"
    },
    es: {
      highlights: "Puntos clave",
      services: "Servicios disponibles"
    },
    ru: {
      highlights: "Ключевые детали",
      services: "Поддерживаемые сервисы"
    }
  }[localeParam];

  if (!area) {
    notFound();
  }

  return (
    <>
      <FAQSchema items={area.faq} />
      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase text-accent-gold">{area.state}</p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold text-text sm:text-5xl">
          {area.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{area.intro}</p>
      </section>
      <section className="border-t border-line py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-lg border border-line bg-surface/70 p-6">
            <h2 className="font-heading text-2xl font-semibold text-text">{copy.highlights}</h2>
            <ul className="mt-5 grid gap-3 text-sm text-muted">
              {area.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-surface/70 p-6">
            <h2 className="font-heading text-2xl font-semibold text-text">{copy.services}</h2>
            <ul className="mt-5 grid gap-3 text-sm text-muted">
              {area.supportedServices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <FAQSection title={home.faqTitle} items={area.faq} />
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
