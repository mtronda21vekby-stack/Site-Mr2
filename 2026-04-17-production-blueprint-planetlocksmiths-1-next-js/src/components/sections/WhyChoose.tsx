import { Section } from "@/components/ui/Section";

type WhyChooseProps = {
  title: string;
  items: string[];
};

export function WhyChoose({ title, items }: WhyChooseProps) {
  return (
    <Section title={title} className="bg-surface/35">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={item} className="rounded-lg border border-line bg-bg/60 p-5">
            <span className="text-xs font-black text-accent-gold">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-4 text-base font-semibold text-text">{item}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
