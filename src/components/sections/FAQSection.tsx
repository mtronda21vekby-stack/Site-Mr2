import { Section } from '@/components/ui/Section';
import { getFaq } from '@/lib/content';
import type { Locale } from '@/types/common';

export default function FAQSection({ locale }: { locale: Locale }) {
  const items = getFaq(locale);
  return (
    <Section id="faq" eyebrow="faq" title="Frequently asked questions" description="Useful, local-service answers without keyword stuffing.">
      <div className="grid gap-4">
        {items.map((item) => (
          <details key={item.question} className="rounded-3xl border border-line bg-surface/80 p-6">
            <summary className="cursor-pointer list-none font-sora text-lg font-bold text-text">{item.question}</summary>
            <p className="mt-4 text-sm leading-7 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
