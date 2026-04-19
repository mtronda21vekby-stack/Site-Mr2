import { Section } from '@/components/ui/Section';
import { getHomeContent } from '@/lib/content';
import type { Locale } from '@/types/common';

export default function WhyChoose({ locale }: { locale: Locale }) {
  const content = getHomeContent(locale);
  return (
    <Section id="why" eyebrow="why planetlocksmiths" title="Specific value, not marketing sludge" description="Everything here should read like a trustworthy local service brand, not generic AI website copy.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {content.whyChoose.map((item) => (
          <div key={item} className="rounded-3xl border border-line bg-surface-2/80 p-5 text-sm leading-7 text-text">
            <span className="mr-2 text-accent-gold">•</span>{item}
          </div>
        ))}
      </div>
    </Section>
  );
}
