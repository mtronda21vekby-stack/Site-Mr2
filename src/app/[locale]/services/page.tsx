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
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-5xl px-4 py-16 text-text sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-heading font-semibold">Services</h1>
        <p className="mb-4">
          This services page lists the available automotive locksmith services. Content here is a
          placeholder.
        </p>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {home.featuredServices.map((service) => (
            <li key={service.slug} className="rounded border border-line p-4">
              <h2 className="mb-2 text-xl font-semibold">{service.title}</h2>
              <p className="mb-2 text-sm text-muted">{service.excerpt}</p>
              <a
                href={`/${locale}/services/${service.slug}`}
                className="text-sm text-accent-blue underline"
              >
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
