interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title: string;
  items: FaqItem[];
}

/**
 * Renders a FAQ section using native HTML `details` and `summary` elements.
 * This provides built-in accessibility and a straightforward way to toggle
 * answers. The heading is localised via the props.
 */
export default function FaqSection({ title, items }: FaqSectionProps) {
  if (!items || items.length === 0) return null;
  return (
    <section className="bg-bg py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-heading font-semibold text-text">
          {title}
        </h2>
        <div className="space-y-4">
          {items.map((faq, idx) => (
            <details
              key={idx}
              className="overflow-hidden rounded-lg border border-line bg-surface-2 p-4"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-text marker:none">
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