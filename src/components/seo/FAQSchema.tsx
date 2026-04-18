import { JsonLd } from "./JsonLd";

type FAQSchemaProps = {
  items: {
    question: string;
    answer: string;
  }[];
};

export function FAQSchema({ items }: FAQSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }}
    />
  );
}
