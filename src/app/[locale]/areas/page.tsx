import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getGlobalSettings } from '@/lib/content';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'ru' },
  ];
}

export default async function AreasPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru' }>;
}) {
  const { locale } = await params;
  const global = getGlobalSettings();

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-3xl px-4 py-16 text-text sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-heading font-semibold">Service Areas</h1>
        <p>
          This page lists areas where we provide service. At launch, service is available across
          Philadelphia. More locations can be added here in the future.
        </p>
      </main>
      <Footer locale={locale} />
    </>
  );
}
