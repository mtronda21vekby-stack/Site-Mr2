import { getCanonicalUrl, getSiteUrl, type SeoLocale } from '@/lib/seo'
import type { AreaContent, ServiceContent } from '@/lib/content.server'
import type { FaqItem, GlobalSettings } from '@/lib/content'

type SchemaNode = Record<string, unknown>

export function buildAutomotiveBusinessSchema({ locale, global, services, areas, description }: { locale: SeoLocale; global: GlobalSettings; services?: ServiceContent[]; areas?: AreaContent[]; description?: string }): SchemaNode {
  const siteUrl = getSiteUrl()
  const pageUrl = getCanonicalUrl(locale, '/')

  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': `${siteUrl}/${locale}#business`,
    name: global.brandName,
    url: pageUrl,
    telephone: global.phoneDisplay,
    description: description || 'Mobile automotive locksmith service for car lockouts, replacement keys, key fobs, transponder support, ignition-related help, and broken key situations.',
    areaServed: areas?.map((area) => [area.city, area.state].filter(Boolean).join(', ')).filter(Boolean) || ['Philadelphia, Pennsylvania'],
    openingHours: global.serviceHours,
    makesOffer: services?.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.excerpt,
        url: `${siteUrl}/${locale}/services/${service.slug}`,
      },
    })) || undefined,
  }
}

export function buildServiceCollectionSchema({ locale, services }: { locale: SeoLocale; services: ServiceContent[] }): SchemaNode {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${getCanonicalUrl(locale, '/services')}#services`,
    name: 'Automotive locksmith services',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/${locale}/services/${service.slug}`,
      name: service.title,
      description: service.excerpt,
    })),
  }
}

export function buildAreaCollectionSchema({ locale, areas }: { locale: SeoLocale; areas: AreaContent[] }): SchemaNode {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${getCanonicalUrl(locale, '/areas')}#areas`,
    name: 'Automotive locksmith service areas',
    itemListElement: areas.map((area, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/${locale}/areas/${area.slug}`,
      name: area.title,
      description: area.intro,
    })),
  }
}

export function buildServiceDetailSchema({ locale, global, service }: { locale: SeoLocale; global: GlobalSettings; service: ServiceContent }): SchemaNode {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/${locale}/services/${service.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    description: service.seoDescription || service.excerpt,
    url,
    provider: {
      '@type': 'AutomotiveBusiness',
      name: global.brandName,
      telephone: global.phoneDisplay,
      url: `${siteUrl}/${locale}`,
    },
    areaServed: 'Philadelphia, Pennsylvania and nearby coverage areas',
    serviceType: service.title,
  }
}

export function buildAreaDetailBusinessSchema({ locale, global, area, supportedServices, location }: { locale: SeoLocale; global: GlobalSettings; area: AreaContent; supportedServices: string[]; location: string }): SchemaNode {
  const siteUrl = getSiteUrl()
  const url = `${siteUrl}/${locale}/areas/${area.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': `${url}#business`,
    name: global.brandName,
    url,
    telephone: global.phoneDisplay,
    description: area.seoDescription || area.intro,
    areaServed: { '@type': 'City', name: location },
    openingHours: global.serviceHours,
    makesOffer: supportedServices.map((service) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service, areaServed: location },
    })),
  }
}

export function buildBreadcrumbSchema({ locale, items }: { locale: SeoLocale; items: Array<{ name: string; path: string }> }): SchemaNode {
  const siteUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}/${locale}${item.path}`,
    })),
  }
}

export function buildContactPageSchema({ locale, global, description }: { locale: SeoLocale; global: GlobalSettings; description: string }): SchemaNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${getCanonicalUrl(locale, '/contact')}#contact`,
    url: getCanonicalUrl(locale, '/contact'),
    name: 'Contact Planetlocksmiths',
    description,
    mainEntity: {
      '@type': 'AutomotiveBusiness',
      name: global.brandName,
      telephone: global.phoneDisplay,
      url: getCanonicalUrl(locale, '/'),
    },
  }
}

export function buildFAQPageSchema({ locale, faq }: { locale: SeoLocale; faq: FaqItem[] }): SchemaNode | null {
  if (!faq.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${getCanonicalUrl(locale, '/faq')}#faq`,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function compactSchema(nodes: Array<SchemaNode | null | undefined>): SchemaNode[] {
  return nodes.filter(Boolean) as SchemaNode[]
}
