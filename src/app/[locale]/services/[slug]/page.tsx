import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getGlobalSettings, getHomeContent } from '@/lib/content';

export async function generateStaticParams() {
  const locales: Array<'en' | 'es' | 'ru'> = ['en', 'es', 'ru'];
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    const home = getHomeContent(locale);
    home.featuredServices.forEach((service) => {
      params.push({ locale, slug: service.slug });
    });
  }

  return params;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru'; slug: string }>;
}) {
  const { locale, slug } = await params;
  const global = getGlobalSettings();
  const home = getHomeContent(locale);
  const service = home.featuredServices.find((s) => s.slug === slug);

  return (
    <>
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-text">
        {service ? (
          <>
            <h1 className="text-3xl font-heading font-semibold mb-6">{service.title}</h1>
            <p className="mb-4">{service.excerpt}</p>
            <p>This is a placeholder page for the {service.title} service. In the future you can add more details and images here.</p>
          </>
        ) : (
          <p>Service not found.</p>
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}
