import ServicesGrid from '@/components/sections/ServicesGrid';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <main><ServicesGrid locale={locale} /></main>; }
