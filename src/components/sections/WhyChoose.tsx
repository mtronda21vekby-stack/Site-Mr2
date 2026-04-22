interface WhyChooseProps {
  items: string[];
}

/**
 * Display a list of reasons why the customer should choose your service. Each
 * item is rendered with a simple coloured bullet. If you need to
 * internationalise the section heading, you can move the string into your
 * content JSON files later on.
 */
export default function WhyChoose({ items }: WhyChooseProps) {
  if (!items || items.length === 0) return null;
  return (
    <section className="bg-bg py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-heading font-semibold text-text">
          Why choose us
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((reason, idx) => (
            <li key={idx} className="flex space-x-3 rounded-md bg-surface-2 p-4">
              <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-accent-gold"></span>
              <span className="text-sm text-muted">{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}