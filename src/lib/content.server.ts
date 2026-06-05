import { createClient } from '@supabase/supabase-js'
import {
  getGlobalSettings as getFileGlobalSettings,
  getHomeContent as getFileHomeContent,
  getReviews as getFileReviews,
  getFaq as getFileFaq,
  type Locale,
  type GlobalSettings,
  type HomeContent,
  type ReviewItem,
  type FaqItem,
} from '@/lib/content'
import {
  getCatalogServiceBySlug,
  getCatalogServices,
  type CatalogService,
} from '@/lib/services-catalog'

type SiteSettingsRow = {
  id: string
  brand_name: string | null
  logo_url: string | null
  logo_alt: string | null
  phone_primary: string | null
  phone_display: string | null
  email: string | null
  service_hours: string | null
  updated_at: string | null
}

type HomePageRow = {
  id: string
  locale: string
  hero_title: string | null
  hero_subtitle: string | null
  hero_primary_cta: string | null
  hero_secondary_cta: string | null
  emergency_title: string | null
  emergency_text: string | null
  reviews_title: string | null
  faq_title: string | null
  contact_title: string | null
  contact_text: string | null
}

type ReviewRow = {
  id: string
  locale: string
  name: string | null
  rating: number | null
  quote: string | null
  date: string | null
  city: string | null
  sort_order: number | null
  is_published: boolean | null
}

type FaqRow = {
  id: string
  locale: string
  question: string | null
  answer: string | null
  sort_order: number | null
  is_published: boolean | null
}

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

type SiteContentBlockRow = {
  id: string
  locale: string
  page_key: string
  slot: string
  eyebrow: string | null
  title: string | null
  body: string | null
  items: unknown
  cta_label: string | null
  cta_href: string | null
  sort_order: number | null
  is_published: boolean | null
}

export type ServiceContent = {
  slug: string
  title: string
  excerpt: string
  intro: string
  seoTitle: string
  seoDescription: string
}

export type AreaContent = {
  slug: string
  city: string
  state: string
  title: string
  intro: string
  highlights: string[]
  supportedServices: string[]
  seoTitle: string
  seoDescription: string
}

export type SiteContentBlock = {
  id: string
  locale: Locale
  pageKey: string
  slot: string
  eyebrow: string
  title: string
  body: string
  items: string[]
  ctaLabel: string
  ctaHref: string
  sortOrder: number
}

const DEMO_PHONE_PATTERN = /(555[-\s)]?0?\d{3}|000[-\s)]?0{3})/i

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

function normalizeItems(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => String(item).trim()).filter(Boolean)
}

function normalizeText(value: string | null | undefined): string {
  return String(value || '').trim()
}

function normalizePhonePrimary(value: string | null | undefined, fallback: string): string {
  const raw = String(value || '').trim()
  const digits = raw.replace(/[^0-9+]/g, '')

  if (!digits || DEMO_PHONE_PATTERN.test(raw)) {
    return fallback
  }

  if (digits.startsWith('+')) {
    return digits
  }

  if (digits.length === 10) {
    return `+1${digits}`
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`
  }

  return fallback
}

function normalizePhoneDisplay(
  value: string | null | undefined,
  fallback: string,
  normalizedPrimary: string
): string {
  const raw = String(value || '').trim()

  if (!raw || DEMO_PHONE_PATTERN.test(raw)) {
    return fallback
  }

  const digits = normalizedPrimary.replace(/\D/g, '')

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }

  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  return raw
}

async function getLatestPublishedLogo(supabase: any) {
  try {
    const result = await (supabase.from('site_images') as any)
      .select('image_url,alt,title,created_at')
      .eq('is_published', true)
      .eq('category', 'logo')
      .order('created_at', { ascending: false })
      .limit(1)

    if (result.error || !result.data?.[0]) {
      return { logoUrl: '', logoAlt: '', createdAt: '' }
    }

    const row = result.data[0]
    return {
      logoUrl: normalizeText(row.image_url),
      logoAlt: normalizeText(row.alt) || normalizeText(row.title),
      createdAt: normalizeText(row.created_at),
    }
  } catch {
    return { logoUrl: '', logoAlt: '', createdAt: '' }
  }
}

function isAfterIsoDate(value: string | null | undefined, compareTo: string | null | undefined) {
  const timestamp = Date.parse(String(value || ''))
  const compareTimestamp = Date.parse(String(compareTo || ''))

  if (!Number.isFinite(timestamp)) return false
  if (!Number.isFinite(compareTimestamp)) return true

  return timestamp > compareTimestamp
}

function mapServiceRow(row: ServiceRow, fallback?: { title: string; excerpt: string }): ServiceContent {
  return {
    slug: row.slug,
    title: row.title ?? fallback?.title ?? '',
    excerpt: row.excerpt ?? fallback?.excerpt ?? '',
    intro: row.intro ?? row.excerpt ?? fallback?.excerpt ?? '',
    seoTitle: row.seo_title ?? row.title ?? fallback?.title ?? '',
    seoDescription: row.seo_description ?? row.excerpt ?? fallback?.excerpt ?? '',
  }
}

function mapAreaRow(row: AreaRow): AreaContent {
  const broadText = (value: string | null | undefined) =>
    normalizeText(value)
      .replace(/Mobile Automotive Locksmith/g, 'Mobile Locksmith')
      .replace(/Automotive Locksmith/g, 'Locksmith')
      .replace(/mobile automotive locksmith/gi, 'mobile locksmith')
      .replace(/automotive locksmith/gi, 'locksmith')
      .replace(/Mobile car locksmith/gi, 'Mobile locksmith')
      .replace(/vehicle access/gi, 'access')
  const highlights = Array.isArray(row.highlights) ? row.highlights.map(broadText).filter(Boolean) : []
  const supported = Array.isArray(row.supported_services) ? row.supported_services.map(broadText).filter(Boolean) : []
  const hasBroadService = supported.some((item) => /rekey|commercial|residential|safe|access control/i.test(item))
  const supportedServices = hasBroadService
    ? supported
    : row.locale === 'es'
      ? ['Cerrajero de emergencia 24/7', 'Auto cerrado', 'Rekey', 'Cerrajero comercial', 'Cerrajero residencial']
      : ['Emergency locksmith 24/7', 'Car lockout help', 'Rekey service', 'Commercial locksmith', 'Residential locksmith']

  return {
    slug: row.slug,
    city: row.city ?? '',
    state: row.state ?? '',
    title: broadText(row.title),
    intro: broadText(row.intro),
    highlights,
    supportedServices,
    seoTitle: broadText(row.seo_title ?? row.title),
    seoDescription: broadText(row.seo_description ?? row.intro),
  }
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

function looksLikeOldAutomotiveOnlyCopy(value: string | null | undefined) {
  const text = normalizeText(value).toLowerCase()
  if (!text) return false
  if (text.includes('residential') || text.includes('commercial') || text.includes('access control') || text.includes('safe opening')) {
    return false
  }

  return text.includes('automotive locksmith') || text.includes('vehicle-specific') || text.includes('car lockouts')
}

function normalizeHomeCopy(locale: Locale, content: HomeContent): HomeContent {
  const fallback = getFileHomeContent(locale)

  if (!looksLikeOldAutomotiveOnlyCopy(content.heroTitle) && !looksLikeOldAutomotiveOnlyCopy(content.heroSubtitle)) {
    return content
  }

  return {
    ...content,
    heroTitle: fallback.heroTitle,
    heroSubtitle: fallback.heroSubtitle,
    heroBadges: fallback.heroBadges,
    heroOrbitWords: fallback.heroOrbitWords,
    emergencyTitle: fallback.emergencyTitle,
    emergencyText: fallback.emergencyText,
    contactTitle: fallback.contactTitle,
    contactText: fallback.contactText,
  }
}

function mergeCatalogServices(locale: Locale, _rows: ServiceRow[]): ServiceContent[] {
  return getCatalogServices(locale).map(mapCatalogService)
}

export async function getContentBlocksFromSource(
  locale: Locale,
  pageKey: string,
  slot?: string
): Promise<SiteContentBlock[]> {

  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return []
  }

  try {
    let query = (supabase.from('site_content_blocks') as any)
      .select('id, locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, sort_order, is_published')
      .eq('locale', locale)
      .eq('page_key', pageKey)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (slot) {
      query = query.eq('slot', slot)
    }

    const result = await query

    if (result.error) {
      console.error('site_content_blocks select error:', result.error)
      return []
    }

    const rows = Array.isArray(result.data) ? (result.data as SiteContentBlockRow[]) : []

    return rows.map((row) => ({
      id: row.id,
      locale: row.locale as Locale,
      pageKey: row.page_key,
      slot: row.slot,
      eyebrow: row.eyebrow ?? '',
      title: row.title ?? '',
      body: row.body ?? '',
      items: normalizeItems(row.items),
      ctaLabel: row.cta_label ?? '',
      ctaHref: row.cta_href ?? '',
      sortOrder: Number(row.sort_order ?? 0),
    }))
  } catch (error) {
    console.error('getContentBlocksFromSource failed:', error)
    return []
  }
}

export async function getGlobalSettingsFromSource(): Promise<GlobalSettings> {

  const fileFallback = getFileGlobalSettings()
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return fileFallback
  }

  try {
    const result = await (supabase.from('site_settings') as any)
      .select('id, brand_name, logo_url, logo_alt, phone_primary, phone_display, email, service_hours, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (result.error || !result.data?.[0]) {
      const logoFallback = await getLatestPublishedLogo(supabase)
      return {
        ...fileFallback,
        logoUrl: logoFallback.logoUrl || fileFallback.logoUrl,
        logoAlt: logoFallback.logoAlt || fileFallback.logoAlt,
      }
    }

    const row = result.data[0] as SiteSettingsRow
    const phonePrimary = normalizePhonePrimary(row.phone_primary, fileFallback.phonePrimary)
    const phoneDisplay = normalizePhoneDisplay(row.phone_display, fileFallback.phoneDisplay, phonePrimary)
    const brandName = row.brand_name ?? fileFallback.brandName
    const settingsLogoUrl = normalizeText(row.logo_url)
    const logoFallback = await getLatestPublishedLogo(supabase)
    const shouldUsePublishedLogo =
      Boolean(logoFallback.logoUrl) &&
      (!settingsLogoUrl || isAfterIsoDate(logoFallback.createdAt, row.updated_at))
    const logoUrl = shouldUsePublishedLogo ? logoFallback.logoUrl : settingsLogoUrl
    const logoAlt = normalizeText(row.logo_alt) || (shouldUsePublishedLogo ? logoFallback.logoAlt : '') || brandName

    return {
      ...fileFallback,
      brandName,
      logoUrl,
      logoAlt,
      phonePrimary,
      phoneDisplay,
      email: row.email ?? fileFallback.email,
      serviceHours: row.service_hours ?? fileFallback.serviceHours,
    }
  } catch (error) {
    console.error('getGlobalSettingsFromSource failed:', error)
    return fileFallback
  }
}

export async function getHomeContentFromSource(locale: Locale): Promise<HomeContent> {

  const fileFallback = getFileHomeContent(locale)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return normalizeHomeCopy(locale, fileFallback)
  }

  try {
    const result = await (supabase.from('home_pages') as any)
      .select('id, locale, hero_title, hero_subtitle, hero_primary_cta, hero_secondary_cta, emergency_title, emergency_text, reviews_title, faq_title, contact_title, contact_text')
      .eq('locale', locale)
      .limit(1)

    if (result.error) {
      console.error('home_pages select error:', result.error)
      return fileFallback
    }

    const row = (result.data?.[0] ?? null) as HomePageRow | null

    if (!row) {
      return normalizeHomeCopy(locale, fileFallback)
    }

    return normalizeHomeCopy(locale, {
      ...fileFallback,
      heroTitle: row.hero_title ?? fileFallback.heroTitle,
      heroSubtitle: row.hero_subtitle ?? fileFallback.heroSubtitle,
      heroPrimaryCta: row.hero_primary_cta ?? fileFallback.heroPrimaryCta,
      heroSecondaryCta: row.hero_secondary_cta ?? fileFallback.heroSecondaryCta,
      emergencyTitle: row.emergency_title ?? fileFallback.emergencyTitle,
      emergencyText: row.emergency_text ?? fileFallback.emergencyText,
      reviewsTitle: row.reviews_title ?? fileFallback.reviewsTitle,
      faqTitle: row.faq_title ?? fileFallback.faqTitle,
      contactTitle: row.contact_title ?? fileFallback.contactTitle,
      contactText: row.contact_text ?? fileFallback.contactText,
    })
  } catch (error) {
    console.error('getHomeContentFromSource failed:', error)
    return normalizeHomeCopy(locale, fileFallback)
  }
}

export async function getReviewsFromSource(locale: Locale): Promise<ReviewItem[]> {

  const fileFallback = getFileReviews(locale)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return fileFallback
  }

  try {
    const result = await (supabase.from('reviews') as any)
      .select('id, locale, name, rating, quote, date, city, sort_order, is_published')
      .eq('locale', locale)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (result.error) {
      console.error('reviews select error:', result.error)
      return fileFallback
    }

    const rows = Array.isArray(result.data) ? (result.data as ReviewRow[]) : []

    if (!rows.length) {
      return fileFallback
    }

    return rows.map((row) => ({
      name: row.name ?? '',
      rating: row.rating ?? 5,
      quote: row.quote ?? '',
      date: row.date ?? undefined,
      city: row.city ?? undefined,
    }))
  } catch (error) {
    console.error('getReviewsFromSource failed:', error)
    return fileFallback
  }
}

export async function getFaqFromSource(locale: Locale): Promise<FaqItem[]> {

  const fileFallback = getFileFaq(locale)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return fileFallback
  }

  try {
    const result = await (supabase.from('faq_items') as any)
      .select('id, locale, question, answer, sort_order, is_published')
      .eq('locale', locale)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (result.error) {
      console.error('faq_items select error:', result.error)
      return fileFallback
    }

    const rows = Array.isArray(result.data) ? (result.data as FaqRow[]) : []

    if (!rows.length) {
      return fileFallback
    }

    return rows.map((row) => ({
      question: row.question ?? '',
      answer: row.answer ?? '',
    }))
  } catch (error) {
    console.error('getFaqFromSource failed:', error)
    return fileFallback
  }
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
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (result.error) {
      console.error('services list select error:', result.error)
      return fileFallback
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

export async function getAreasListFromSource(locale: Locale): Promise<AreaContent[]> {

  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return []
  }

  try {
    const result = await (supabase.from('areas') as any)
      .select('id, locale, slug, city, state, title, intro, highlights, supported_services, seo_title, seo_description, sort_order, is_published')
      .eq('locale', locale)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (result.error) {
      console.error('areas list select error:', result.error)
      return []
    }

    const rows = Array.isArray(result.data) ? (result.data as AreaRow[]) : []

    return rows.map(mapAreaRow)
  } catch (error) {
    console.error('getAreasListFromSource failed:', error)
    return []
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
      .eq('is_published', true)
      .limit(1)

    if (result.error) {
      console.error('services select error:', result.error)
      return catalogFallback ? mapCatalogService(catalogFallback) : fileFallback ? mapFileServiceFallback(fileFallback) : null
    }

    const row = (result.data?.[0] ?? null) as ServiceRow | null

    if (!row) {
      return catalogFallback ? mapCatalogService(catalogFallback) : fileFallback ? mapFileServiceFallback(fileFallback) : null
    }

    return catalogFallback ? mapCatalogService(catalogFallback) : mapServiceRow(row, fileFallback)
  } catch (error) {
    console.error('getServicePageFromSource failed:', error)
    return catalogFallback ? mapCatalogService(catalogFallback) : fileFallback ? mapFileServiceFallback(fileFallback) : null
  }
}

export async function getAreaPageFromSource(
  locale: Locale,
  slug: string
): Promise<AreaContent | null> {

  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return null
  }

  try {
    const result = await (supabase.from('areas') as any)
      .select('id, locale, slug, city, state, title, intro, highlights, supported_services, seo_title, seo_description, sort_order, is_published')
      .eq('locale', locale)
      .eq('slug', slug)
      .eq('is_published', true)
      .limit(1)

    if (result.error) {
      console.error('areas select error:', result.error)
      return null
    }

    const row = (result.data?.[0] ?? null) as AreaRow | null

    if (!row) {
      return null
    }

    return mapAreaRow(row)
  } catch (error) {
    console.error('getAreaPageFromSource failed:', error)
    return null
  }
}
