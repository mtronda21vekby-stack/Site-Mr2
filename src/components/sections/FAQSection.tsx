import type { FaqItem } from '@/lib/site-data';

export default function FAQSection({ items }: { items: FaqItem[] }) {
  return (
    <section id="faq" className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="font-sora text-2xl font-bold text-text">FAQ</h2>
        <p className="mt-2 text-sm text-muted">
          Answers to some of the most common questions we receive.
        </p>
        <div className="mt-8 space-y-4">
          {items.map((faq) => (
            <details
              key={faq.question}
              className="rounded-lg border border-line bg-surface-2 p-4"
            >
              <summary className="cursor-pointer select-none text-sm font-medium text-text">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
