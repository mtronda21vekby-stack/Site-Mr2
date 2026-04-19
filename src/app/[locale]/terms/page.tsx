import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getGlobalSettings } from '@/lib/content';

export default function TermsPage({ params }: { params: { locale: 'en' | 'es' | 'ru' } }) {
  const global = getGlobalSettings();
  return (
    <>
      <Header
        locale={params.locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-text">
        <h1 className="text-3xl font-heading font-semibold mb-6">Terms of Service</h1>
        <p>This page should contain your terms of service. It is provided as a placeholder in this scaffold.</p>
      </main>
      <Footer locale={params.locale} />
    </>
  );
}