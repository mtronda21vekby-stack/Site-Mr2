import { Section } from '@/components/ui/Section';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return <main><Section title="About Planetlocksmiths" description="A premium mobile automotive locksmith brand built around clarity, speed, and trust."><div className="max-w-3xl text-sm leading-8 text-muted">Planetlocksmiths is positioned as a mobile-only automotive locksmith service for Philadelphia with a premium dark interface, multilingual structure, and content architecture ready for service and city page expansion.</div></Section></main>;
}
