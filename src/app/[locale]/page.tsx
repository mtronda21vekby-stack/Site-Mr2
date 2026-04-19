import Hero from '@/components/hero/Hero';
import ServicesGrid from '@/components/sections/ServicesGrid';
import WhyChoose from '@/components/sections/WhyChoose';
import EmergencyStrip from '@/components/sections/EmergencyStrip';
import ServiceAreas from '@/components/sections/ServiceAreas';
import ReviewsSection from '@/components/sections/ReviewsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import { getFaq } from '@/lib/content';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const faq = getFaq(locale);
  return (
    <main>
      <LocalBusinessSchema />
      <FAQSchema items={faq} />
      <Hero locale={locale} />
      <ServicesGrid locale={locale} />
      <WhyChoose locale={locale} />
      <EmergencyStrip locale={locale} />
      <ServiceAreas locale={locale} />
      <ReviewsSection locale={locale} />
      <FAQSection locale={locale} />
      <ContactSection locale={locale} />
    </main>
  );
}
