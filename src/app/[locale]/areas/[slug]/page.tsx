import { Section } from '@/components/ui/Section';
import FAQSchema from '@/components/seo/FAQSchema';
import { areaSlugs, getArea } from '@/lib/content';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.flatMap((locale) => areaSlugs.map((slug) => ({ locale, slug })));
}

export default async function AreaDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !areaSlugs.includes(slug)) notFound();
  const item = await getArea(locale, slug);
  return (
    <main>
      <FAQSchema items={item.faq} />
      <Section title={item.title} description={item.intro}>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-line bg-surface/80 p-6">
            <h2 className="font-sora text-2xl font-bold text-text">Highlights</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              {item.highlights.map((highlight) => <li key={highlight}>• {highlight}</li>)}
            </ul>
            <h3 className="mt-8 font-sora text-xl font-bold text-text">Supported services</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              {item.supportedServices.map((service) => <li key={service}>• {service}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-surface-2/80 p-6">
            <h3 className="font-sora text-2xl font-bold text-text">Area FAQ</h3>
            <div className="mt-4 space-y-4">
              {item.faq.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-line bg-bg/30 p-4">
                  <summary className="cursor-pointer list-none font-semibold text-text">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
