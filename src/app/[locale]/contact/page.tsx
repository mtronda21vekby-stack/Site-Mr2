import ContactSection from '@/components/sections/ContactSection';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <main><ContactSection locale={locale} /></main>; }
