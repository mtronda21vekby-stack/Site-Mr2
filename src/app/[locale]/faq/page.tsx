import FAQSection from '@/components/sections/FAQSection';
import FAQSchema from '@/components/seo/FAQSchema';
import { getFaq } from '@/lib/content';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); const faq = getFaq(locale); return <main><FAQSchema items={faq} /><FAQSection locale={locale} /></main>; }
