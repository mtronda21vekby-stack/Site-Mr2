import ReviewsSection from '@/components/sections/ReviewsSection';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <main><ReviewsSection locale={locale} /></main>; }
