import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import type { FeaturedService } from "@/types/content";
import type { Locale } from "@/types/common";
import { localizedPath } from "@/lib/i18n";

type ServicesGridProps = {
  locale: Locale;
  title: string;
  intro: string;
  services: FeaturedService[];
};

export function ServicesGrid({ locale, title, intro, services }: ServicesGridProps) {
  return (
    <Section title={title} intro={intro} id="services">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={localizedPath(locale, `/services/${service.slug}`)}
            className="group overflow-hidden rounded-lg border border-line bg-surface/70 transition hover:border-accent-cyan/60"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
              />
            </div>
            <div className="p-5">
              <h3 className="font-heading text-xl font-semibold text-text">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{service.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
