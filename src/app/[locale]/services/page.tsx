import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getGlobalSettings, getHomeContent } from '@/lib/content';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'ru' },
  ];
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru' }>;
}) {
  const { locale } = await params;
  const global = getGlobalSettings();
  const home = getHomeContent(locale);

  return (
    <>
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 text-text">
        <h1 className="text-3xl font-heading font-semibold mb-6">Services</h1>
        <p className="mb-4">This services page lists the available automotive locksmith services. Content here is a placeholder.</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {home.featuredServices.map((service) => (
            <li key={service.slug} className="rounded border border-line p-4">
              <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
              <p className="text-sm text-muted mb-2">{service.excerpt}</p>
              <a href={`/${locale}/services/${service.slug}`} className="text-accent-blue underline text-sm">
                Learn more
              </a>
            </li>
          ))}
        </ul>
      </main>
      <Footer locale={locale} />
    </>
  );
}
