import JsonLd from '@/components/seo/JsonLd'

interface Crumb {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: Crumb[]
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  if (!items || items.length === 0) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={data} />
}
