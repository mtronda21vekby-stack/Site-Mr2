import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import type { Locale } from '@/types/common';

export default function ServiceAreas({ locale }: { locale: Locale }) {
  return (
    <Section id="areas" eyebrow="service areas" title="Philadelphia first, scalable for future city pages" description="The site is structured to expand beyond Philadelphia without rebuilding the design system.">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-surface/80 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-cyan">Primary area</p>
          <h3 className="mt-4 font-sora text-3xl font-bold text-text">Philadelphia, PA</h3>
          <p className="mt-3 text-sm leading-7 text-muted">Mobile automotive locksmith coverage across Philadelphia with room for future service area expansion.</p>
          <Link href={`/${locale}/areas/philadelphia`} className="mt-5 inline-flex text-sm font-semibold text-accent-blue">Open area page →</Link>
        </div>
      </div>
    </Section>
  );
}
