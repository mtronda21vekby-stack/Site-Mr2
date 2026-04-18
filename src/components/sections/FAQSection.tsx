import { Section } from "@/components/ui/Section";

type FAQSectionProps = {
  title: string;
  items: {
    question: string;
    answer: string;
  }[];
};

export function FAQSection({ title, items }: FAQSectionProps) {
  return (
    <Section title={title} id="faq">
      <div className="grid gap-3">
        {items.map((item) => (
          <details key={item.question} className="group rounded-lg border border-line bg-surface/60 p-5">
            <summary className="cursor-pointer list-none font-heading text-lg font-semibold text-text">
              {item.question}
            </summary>
            <p className="mt-4 text-sm leading-6 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
