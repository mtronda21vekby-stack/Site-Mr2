import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { ContactSection } from "@/components/sections/ContactSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { getGlobalSettings, getHomeContent, getService, getServices } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getServices(locale).map((service) => ({
      locale,
      slug: service.slug
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const settings = getGlobalSettings();
  const service = getService(localeParam, slug);

  if (!service) {
    return {};
  }

  return buildMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    locale: localeParam,
    path: `/${localeParam}/services/${slug}`,
    settings
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const settings = getGlobalSettings();
  const home = getHomeContent(localeParam);
  const service = getService(localeParam, slug);
  const eyebrow = {
    en: "Service",
    es: "Servicio",
    ru: "Сервис"
  }[localeParam];

  if (!service) {
    notFound();
  }

  return (
    <>
      <ServiceSchema service={service} settings={settings} path={`/${localeParam}/services/${slug}`} />
      <FAQSchema items={service.faq} />
      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase text-accent-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold text-text sm:text-5xl">
          {service.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{service.intro}</p>
      </section>
      <section className="border-t border-line py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-5 sm:px-6 md:grid-cols-2 lg:px-8">
          {service.sections.map((section) => (
            <article key={section.heading} className="rounded-lg border border-line bg-surface/70 p-6">
              <h2 className="font-heading text-2xl font-semibold text-text">{section.heading}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
      <FAQSection title={home.faqTitle} items={service.faq} />
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
