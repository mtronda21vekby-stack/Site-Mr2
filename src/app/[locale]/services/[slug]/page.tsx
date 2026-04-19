import { Section } from '@/components/ui/Section';
import FAQSchema from '@/components/seo/FAQSchema';
import ServiceSchema from '@/components/seo/ServiceSchema';
import { getService, serviceSlugs } from '@/lib/content';
import { isLocale, locales } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.flatMap((locale) => serviceSlugs.map((slug) => ({ locale, slug })));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !serviceSlugs.includes(slug)) notFound();
  const item = await getService(locale, slug);
  return (
    <main>
      <ServiceSchema title={item.title} description={item.seoDescription} />
      <FAQSchema items={item.faq} />
      <Section title={item.title} description={item.intro}>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            {item.sections.map((section) => (
              <div key={section.heading} className="rounded-3xl border border-line bg-surface/80 p-6">
                <h2 className="font-sora text-2xl font-bold text-text">{section.heading}</h2>
                <p className="mt-4 text-sm leading-8 text-muted">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-line bg-surface-2/80 p-6">
            <h3 className="font-sora text-2xl font-bold text-text">FAQ</h3>
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
