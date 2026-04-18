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
    title: `About ${settings.brandName} | Automotive Locksmith Philadelphia`,
    description: "Planetlocksmiths is a mobile automotive locksmith service focused on Philadelphia vehicle key and access needs.",
    locale: localeParam,
    path: `/${localeParam}/about`,
    settings
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const settings = getGlobalSettings();
  const home = getHomeContent(localeParam);
  const copy = {
    en: {
      eyebrow: "About",
      title: "Mobile automotive locksmith work, kept focused.",
      body: `${settings.brandName} is built around vehicle access and key problems in ${settings.primaryCity}, ${settings.primaryState}. The service is mobile only, available 24/7, and structured around clear vehicle details before dispatch.`
    },
    es: {
      eyebrow: "Acerca de",
      title: "Cerrajería automotriz móvil con enfoque claro.",
      body: `${settings.brandName} está pensado para problemas de acceso y llaves de vehículos en Filadelfia, ${settings.primaryState}. El servicio es solo móvil, disponible 24/7 y organizado alrededor de datos claros del vehículo antes del envío.`
    },
    ru: {
      eyebrow: "О нас",
      title: "Мобильный automotive locksmith сервис без лишнего шума.",
      body: `${settings.brandName} построен вокруг доступа к автомобилю и проблем с ключами в Филадельфии, ${settings.primaryState}. Сервис только мобильный, доступен 24/7 и начинается с понятных деталей по автомобилю перед выездом.`
    }
  }[localeParam];

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase text-accent-gold">{copy.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold text-text sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
          {copy.body}
        </p>
      </section>
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
