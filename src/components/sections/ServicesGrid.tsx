import Link from 'next/link';
import type { Locale } from '@/components/layout/Header';

interface Service {
  title: string;
  excerpt: string;
  slug: string;
}

export default function ServicesGrid({
  services,
  locale,
}: {
  services: Service[];
  locale: Locale;
}) {
  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-heading font-semibold text-text">
          {/* It’s okay to hardcode this heading for now. In the future this could be localised via JSON. */}
          Our Services
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/${locale}/services/${service.slug}`}
              className="flex h-full flex-col rounded-lg bg-surface-2 p-6 transition-colors hover:bg-surface/70"
            >
              <h3 className="text-lg font-semibold text-text">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted">
                {service.excerpt}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-accent-blue underline">
                Learn more
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}