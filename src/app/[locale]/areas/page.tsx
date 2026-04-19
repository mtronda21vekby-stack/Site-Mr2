import ServiceAreas from '@/components/sections/ServiceAreas';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function AreasPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <main><ServiceAreas locale={locale} /></main>; }
