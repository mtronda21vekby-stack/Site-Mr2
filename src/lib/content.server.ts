import { createClient } from '@supabase/supabase-js'
import { getHomeContent as getFileHomeContent, type Locale } from '@/lib/content'
import { getDefaultAreaBySlug, getDefaultAreas, type DefaultAreaContent } from '@/lib/site-defaults'
import {
  getCatalogServiceBySlug,
  getCatalogServices,
  isHiddenLegacyServiceSlug,
  type CatalogService,
} from '@/lib/services-catalog'
import type { AreaContent, ServiceContent } from './content.server.base'

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

type AreaRow = {
  id: string
  locale: string
  slug: string
  city: string | null
  state: string | null
  title: string | null
  intro: string | null
  highlights: string[] | null
  supported_services: string[] | null
  seo_title: string | null
  seo_description: string | null
  sort_order: number | null
  is_published: boolean | null
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
    .replace(/Planet\s*Lock\s*Smiths/gi, 'Planet Locksmiths')
    .replace(/Planet\s+locksmiths/gi, 'Planet Locksmiths')
    .replace(/Planetlocksmiths/gi, 'Planet Locksmiths')
    .replace(/Planetlocksmith\b/gi, 'Planet Locksmiths')
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

function normalizeItems(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => normalizeLegacyPublicText(String(item))).filter(Boolean)
}

function mapDefaultArea(item: DefaultAreaContent): AreaContent {
  return {
    slug: item.slug,
    city: item.city,
    state: item.state,
    title: item.title,
    intro: item.intro,
    highlights: [...item.highlights],
    supportedServices: [...item.supportedServices],
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
  }
}

function buildGenericAreaFallback(row: AreaRow): DefaultAreaContent {
  const city = normalizeLegacyPublicText(row.city) || normalizeLegacyPublicText(row.title) || 'Philadelphia'
  const state = normalizeLegacyPublicText(row.state) || 'PA'
  const location = [city, state].filter(Boolean).join(', ')

  return {
    slug: normalizeText(row.slug),
    city,
    state,
    title: `Mobile Locksmith Service in ${city}`,
    intro: `Planet Locksmiths provides mobile locksmith service in ${location} for emergency lockouts, automotive keys, residential locks, commercial doors, rekeying, smart locks, safes, mailbox locks, and access-control needs.`,
    highlights: [
      'Mobile locksmith service for cars, homes, offices, storefronts, and managed properties',
      'Emergency lockout, lost key, broken key, rekey, lock repair, and lock replacement support',
      'Service timing depends on technician availability, traffic, authorization, parts, and job complexity',
    ],
    supportedServices: [
      'Emergency Locksmith Service 24/7',
      'Car Lockout Service',
      'House Lockout Service',
      'Rekey Service',
      'Lock Repair',
      'Lock Replacement',
      'Commercial Locksmith Service',
      'Residential Locksmith Service',
      'Smart Lock Installation',
      'Access Control Service',
      'Safe Opening',
      'Mailbox Lock Service',
    ],
    seoTitle: `${city} Locksmith Service`,
    seoDescription: `Mobile locksmith service in ${location} for emergency, automotive, residential, commercial, rekey, smart lock, safe, mailbox, and access-control needs.`,
  }
}

function usesLegacyAreaCopy(row: AreaRow): boolean {
  const text = [
    row.title,
    row.intro,
    row.seo_title,
    row.seo_description,
    ...(Array.isArray(row.highlights) ? row.highlights : []),
    ...(Array.isArray(row.supported_services) ? row.supported_services : []),
  ].map((item) => normalizeLegacyPublicText(item)).join(' ').toLowerCase()

  const hasOldScope = /automotive|vehicle|driver|car lockout|key fob|ignition|replacement keys/.test(text)
  const hasFullScope = /residential|commercial|house|home|business|rekey|smart lock|access control|safe|mailbox|master key|panic bar/.test(text)

  return text.includes('planetlocksmith') || (hasOldScope && !hasFullScope)
}

function mapAreaRow(row: AreaRow, fallback?: DefaultAreaContent): AreaContent {
  const genericFallback = fallback ?? buildGenericAreaFallback(row)
  const shouldUseFallback = usesLegacyAreaCopy(row)
  const title = shouldUseFallback ? genericFallback.title : normalizeLegacyPublicText(row.title) || genericFallback.title
  const intro = shouldUseFallback ? genericFallback.intro : normalizeLegacyPublicText(row.intro) || genericFallback.intro
  const seoTitle = shouldUseFallback ? genericFallback.seoTitle : normalizeLegacyPublicText(row.seo_title) || title || genericFallback.seoTitle
  const seoDescription = shouldUseFallback ? genericFallback.seoDescription : normalizeLegacyPublicText(row.seo_description) || intro || genericFallback.seoDescription
  const highlights = normalizeItems(row.highlights)
  const supportedServices = normalizeItems(row.supported_services)

  return {
    slug: row.slug,
    city: normalizeLegacyPublicText(row.city) || genericFallback.city,
    state: normalizeLegacyPublicText(row.state) || genericFallback.state,
    title,
    intro,
    highlights: shouldUseFallback || !highlights.length ? [...genericFallback.highlights] : highlights,
    supportedServices: shouldUseFallback || !supportedServices.length ? [...genericFallback.supportedServices] : supportedServices,
    seoTitle,
    seoDescription,
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

function isPublishedAreaRow(row: AreaRow): boolean {
  return Boolean(row.is_published ?? true)
}

function getServiceSortOrder(row: ServiceRow | undefined, fallback: number): number {
  const value = Number(row?.sort_order)
  return Number.isFinite(value) ? value : fallback
}

function getAreaSortOrder(row: AreaRow | undefined, fallback: number): number {
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

function mergeDefaultAreas(locale: Locale, rows: AreaRow[]): AreaContent[] {
  const defaults = getDefaultAreas(locale)
  const defaultSlugs = new Set(defaults.map((area) => area.slug))
  const rowsBySlug = new Map<string, AreaRow>()

  for (const row of rows) {
    const slug = normalizeText(row.slug)
    if (!slug || rowsBySlug.has(slug)) continue
    rowsBySlug.set(slug, { ...row, slug })
  }

  const merged: Array<{ area: AreaContent; sortOrder: number; fallbackOrder: number }> = []

  defaults.forEach((defaultArea, index) => {
    const row = rowsBySlug.get(defaultArea.slug)
    if (row && !isPublishedAreaRow(row)) return

    merged.push({
      area: row ? mapAreaRow(row, defaultArea) : mapDefaultArea(defaultArea),
      sortOrder: getAreaSortOrder(row, index),
      fallbackOrder: index,
    })
  })

  let customIndex = defaults.length
  for (const row of rows) {
    const slug = normalizeText(row.slug)
    if (!slug || defaultSlugs.has(slug) || !isPublishedAreaRow(row)) continue

    const area = mapAreaRow({ ...row, slug })
    if (!area.title && !area.city) continue

    merged.push({
      area,
      sortOrder: getAreaSortOrder(row, customIndex),
      fallbackOrder: customIndex,
    })
    customIndex += 1
  }

  return merged
    .sort((a, b) => a.sortOrder - b.sortOrder || a.fallbackOrder - b.fallbackOrder)
    .map((item) => item.area)
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

export async function getAreasListFromSource(locale: Locale): Promise<AreaContent[]> {
  const defaultAreas = getDefaultAreas(locale).map(mapDefaultArea)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return defaultAreas
  }

  try {
    const result = await (supabase.from('areas') as any)
      .select('id, locale, slug, city, state, title, intro, highlights, supported_services, seo_title, seo_description, sort_order, is_published')
      .eq('locale', locale)
      .order('sort_order', { ascending: true })

    if (result.error) {
      console.error('areas list select error:', result.error)
      return defaultAreas
    }

    const rows = Array.isArray(result.data) ? (result.data as AreaRow[]) : []

    if (!rows.length) {
      return defaultAreas
    }

    return mergeDefaultAreas(locale, rows)
  } catch (error) {
    console.error('getAreasListFromSource failed:', error)
    return defaultAreas
  }
}

export async function getAreaPageFromSource(
  locale: Locale,
  slug: string
): Promise<AreaContent | null> {
  const defaultArea = getDefaultAreaBySlug(locale, slug)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return defaultArea ? mapDefaultArea(defaultArea) : null
  }

  try {
    const result = await (supabase.from('areas') as any)
      .select('id, locale, slug, city, state, title, intro, highlights, supported_services, seo_title, seo_description, sort_order, is_published')
      .eq('locale', locale)
      .eq('slug', slug)
      .limit(1)

    if (result.error) {
      console.error('areas select error:', result.error)
      return defaultArea ? mapDefaultArea(defaultArea) : null
    }

    const row = (result.data?.[0] ?? null) as AreaRow | null

    if (!row) {
      return defaultArea ? mapDefaultArea(defaultArea) : null
    }

    if (!isPublishedAreaRow(row)) {
      return null
    }

    const area = mapAreaRow(row, defaultArea)
    return area.title || area.city ? area : null
  } catch (error) {
    console.error('getAreaPageFromSource failed:', error)
    return defaultArea ? mapDefaultArea(defaultArea) : null
  }
}
