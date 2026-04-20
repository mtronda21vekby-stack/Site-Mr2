import JsonLd from '@/components/seo/JsonLd'

interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  areaServed: string
}

export default function ServiceSchema({
  name,
  description,
  url,
  areaServed,
}: ServiceSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    areaServed: {
      '@type': 'City',
      name: areaServed,
    },
    provider: {
      '@type': ['LocalBusiness', 'Locksmith'],
      name: 'Planetlocksmiths',
      url: siteUrl,
    },
  }

  return <JsonLd data={data} />
}
