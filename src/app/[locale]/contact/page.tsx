import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getGlobalSettings, getHomeContent } from '@/lib/content';
import ContactSection from '@/components/sections/ContactSection';

export default function ContactPage({ params }: { params: { locale: 'en' | 'es' | 'ru' } }) {
  const global = getGlobalSettings();
  const home = getHomeContent(params.locale);
  return (
    <>
      <Header
        locale={params.locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="flex flex-col">
        <ContactSection
          title={home.contactTitle}
          text={home.contactText}
          phoneNumber={global.phonePrimary}
          phoneDisplay={global.phoneDisplay}
          locale={params.locale}
        />
      </main>
      <Footer locale={params.locale} />
    </>
  );
}