import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileStickyCall from '@/components/layout/MobileStickyCall';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
      <MobileStickyCall />
    </>
  );
}
