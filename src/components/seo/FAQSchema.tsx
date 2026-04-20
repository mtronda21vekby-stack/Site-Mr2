import JsonLd from '@/components/seo/JsonLd'

interface FaqItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  items: FaqItem[]
}

export default function FAQSchema({ items }: FAQSchemaProps) {
  if (!items || items.length === 0) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return <JsonLd data={data} />
}
