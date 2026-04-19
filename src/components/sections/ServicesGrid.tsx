import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { getHomeContent } from '@/lib/content';
import type { Locale } from '@/types/common';

export default function ServicesGrid({ locale }: { locale: Locale }) {
  const content = getHomeContent(locale);
  return (
    <Section id="services" eyebrow="featured services" title="Automotive locksmith services" description="Focused, mobile-first service pages built for clarity, search intent, and real customer action.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {content.featuredServices.map((service) => (
          <Card key={service.slug} className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-cyan">{service.slug.replace(/-/g, ' ')}</p>
            <h3 className="mt-4 font-sora text-2xl font-bold text-text">{service.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{service.excerpt}</p>
            <Link href={`/${locale}/services/${service.slug}`} className="mt-6 inline-flex text-sm font-semibold text-accent-blue">View service →</Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}
