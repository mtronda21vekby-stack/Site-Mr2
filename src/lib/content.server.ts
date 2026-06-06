import { createClient } from '@supabase/supabase-js'
import { getHomeContent as getFileHomeContent, type Locale } from '@/lib/content'
import {
  getCatalogServiceBySlug,
  getCatalogServices,
  isHiddenLegacyServiceSlug,
  type CatalogService,
} from '@/lib/services-catalog'
import type { ServiceContent } from './content.server.base'

export * from './content.server.base'

type ServiceRow = {
  id: string
  locale: string
  slug: string
  title: string | null
  excerpt: string | null
  intro: string | null
  seo_title: string | null
  seo_description: string | null
  sort_order: number | null
  is_published: boolean | null
}

type ServiceFallback = {
  title: string
  excerpt: string
  intro?: string
  seoTitle?: string
  seoDescription?: string
}

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return null
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  })
}

function normalizeText(value: string | null | undefined): string {
  return String(value || '').trim()
}

function normalizeLegacyPublicText(value: string | null | undefined): string {
  return normalizeText(value)
    .replace(/\bstarter copy\b/gi, 'service information')
    .replace(/\bbeta\b/gi, '')
    .replace(/No published services yet\./gi, 'Call for the current service list.')
    .replace(/Mobile Automotive Locksmith/g, 'Mobile Locksmith')
    .replace(/Automotive Locksmith Services/g, 'Locksmith Services')
    .replace(/Automotive locksmith service areas/g, 'Locksmith service areas')
    .replace(/automotive locksmith coverage/gi, 'locksmith coverage')
    .replace(/mobile automotive locksmith/gi, 'mobile locksmith')
    .replace(/automotive locksmith/gi, 'locksmith')
    .replace(/vehicle-specific requests/gi, 'locksmith service requests')
    .replace(/vehicle details/gi, 'service details')
    .replace(/vehicle information/gi, 'service information')
    .replace(/vehicle requirements/gi, 'service requirements')
    .replace(/vehicle make, model, and year/gi, 'service type, lock details, and vehicle info when relevant')
    .replace(/vehicle security system/gi, 'lock, key, or security system')
}

function mapFileServiceFallback(item: { slug: string; title: string; excerpt: string }): ServiceContent {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    intro: item.excerpt,
    seoTitle: item.title,
    seoDescription: item.excerpt,
  }
}

function mapCatalogService(item: CatalogService): ServiceContent {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    intro: item.intro,
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
  }
}

function mapServiceRow(row: ServiceRow, fallback?: ServiceFallback): ServiceContent {
  const title = normalizeLegacyPublicText(row.title) || fallback?.title || ''
  const excerpt = normalizeLegacyPublicText(row.excerpt) || fallback?.excerpt || ''
  const intro = normalizeLegacyPublicText(row.intro) || excerpt || fallback?.intro || fallback?.excerpt || ''
  const seoTitle = normalizeLegacyPublicText(row.seo_title) || title || fallback?.seoTitle || fallback?.title || ''
  const seoDescription = normalizeLegacyPublicText(row.seo_description) || excerpt || fallback?.seoDescription || fallback?.excerpt || ''

  return {
    slug: row.slug,
    title,
    excerpt,
    intro,
    seoTitle,
    seoDescription,
  }
}

function isPublishedServiceRow(row: ServiceRow): boolean {
  return Boolean(row.is_published ?? true)
}

function getServiceSortOrder(row: ServiceRow | undefined, fallback: number): number {
  const value = Number(row?.sort_order)
  return Number.isFinite(value) ? value : fallback
}

function mergeCatalogServices(locale: Locale, rows: ServiceRow[]): ServiceContent[] {
  const catalog = getCatalogServices(locale)
  const catalogBySlug = new Map(catalog.map((service) => [service.slug, service]))
  const rowsBySlug = new Map<string, ServiceRow>()

  for (const row of rows) {
    const slug = normalizeText(row.slug)
    if (!slug || rowsBySlug.has(slug)) continue
    rowsBySlug.set(slug, { ...row, slug })
  }

  const merged: Array<{ service: ServiceContent; sortOrder: number; fallbackOrder: number }> = []

  catalog.forEach((catalogService, index) => {
    const row = rowsBySlug.get(catalogService.slug)
    if (row && !isPublishedServiceRow(row)) return

    merged.push({
      service: row ? mapServiceRow(row, catalogService) : mapCatalogService(catalogService),
      sortOrder: getServiceSortOrder(row, index),
      fallbackOrder: index,
    })
  })

  let customIndex = catalog.length
  for (const row of rows) {
    const slug = normalizeText(row.slug)
    if (!slug || catalogBySlug.has(slug) || isHiddenLegacyServiceSlug(slug) || !isPublishedServiceRow(row)) continue

    const service = mapServiceRow({ ...row, slug })
    if (!service.title && !service.excerpt) continue

    merged.push({
      service,
      sortOrder: getServiceSortOrder(row, customIndex),
      fallbackOrder: customIndex,
    })
    customIndex += 1
  }

  return merged
    .sort((a, b) => a.sortOrder - b.sortOrder || a.fallbackOrder - b.fallbackOrder)
    .map((item) => item.service)
}

export async function getServicesListFromSource(locale: Locale): Promise<ServiceContent[]> {
  const fileFallback = getFileHomeContent(locale).featuredServices.map(mapFileServiceFallback)
  const catalogFallback = getCatalogServices(locale).map(mapCatalogService)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return catalogFallback.length ? catalogFallback : fileFallback
  }

  try {
    const result = await (supabase.from('services') as any)
      .select('id, locale, slug, title, excerpt, intro, seo_title, seo_description, sort_order, is_published')
      .eq('locale', locale)
      .order('sort_order', { ascending: true })

    if (result.error) {
      console.error('services list select error:', result.error)
      return catalogFallback.length ? catalogFallback : fileFallback
    }

    const rows = Array.isArray(result.data) ? (result.data as ServiceRow[]) : []

    if (!rows.length) {
      return catalogFallback.length ? catalogFallback : fileFallback
    }

    return mergeCatalogServices(locale, rows)
  } catch (error) {
    console.error('getServicesListFromSource failed:', error)
    return catalogFallback.length ? catalogFallback : fileFallback
  }
}

export async function getServicePageFromSource(
  locale: Locale,
  slug: string
): Promise<ServiceContent | null> {
  const fileHome = getFileHomeContent(locale)
  const fileFallback = fileHome.featuredServices.find((item) => item.slug === slug)
  const catalogFallback = getCatalogServiceBySlug(locale, slug)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return catalogFallback ? mapCatalogService(catalogFallback) : fileFallback ? mapFileServiceFallback(fileFallback) : null
  }

  try {
    const result = await (supabase.from('services') as any)
      .select('id, locale, slug, title, excerpt, intro, seo_title, seo_description, sort_order, is_published')
      .eq('locale', locale)
      .eq('slug', slug)
      .limit(1)

    if (result.error) {
      console.error('services select error:', result.error)
      return catalogFallback ? mapCatalogService(catalogFallback) : fileFallback ? mapFileServiceFallback(fileFallback) : null
    }

    const row = (result.data?.[0] ?? null) as ServiceRow | null

    if (!row) {
      return catalogFallback ? mapCatalogService(catalogFallback) : fileFallback ? mapFileServiceFallback(fileFallback) : null
    }

    if (!isPublishedServiceRow(row)) {
      return null
    }

    const service = mapServiceRow(row, catalogFallback ?? fileFallback)
    return service.title || service.excerpt ? service : null
  } catch (error) {
    console.error('getServicePageFromSource failed:', error)
    return catalogFallback ? mapCatalogService(catalogFallback) : fileFallback ? mapFileServiceFallback(fileFallback) : null
  }
}
