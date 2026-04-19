import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getGlobalSettings, getHomeContent } from '@/lib/content';
import ContactSection from '@/components/sections/ContactSection';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'ru' },
  ];
}

export default async function ContactPage({
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
      <main className="flex flex-col">
        <ContactSection
          title={home.contactTitle}
          text={home.contactText}
          phoneNumber={global.phonePrimary}
          phoneDisplay={global.phoneDisplay}
          locale={locale}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
