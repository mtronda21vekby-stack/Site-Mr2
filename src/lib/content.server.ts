import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'
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

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return null
  }

  return createClient(url, anonKey)
}

type SiteSettingsRow = {
  id: string
  brand_name: string | null
  phone_primary: string | null
  phone_display: string | null
  email: string | null
  service_hours: string | null
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

export type ServiceContent = {
  slug: string
  title: string
  excerpt: string
  intro: string
  seoTitle: string
  seoDescription: string
}

export async function getGlobalSettingsFromSource(): Promise<GlobalSettings> {
  noStore()

  const fileFallback = getFileGlobalSettings()
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return fileFallback
  }

  try {
    const result = await (supabase.from('site_settings') as any)
      .select('id, brand_name, phone_primary, phone_display, email, service_hours')
      .limit(1)

    if (result.error || !result.data?.[0]) {
      return fileFallback
    }

    const row = result.data[0] as SiteSettingsRow

    return {
      ...fileFallback,
      brandName: row.brand_name ?? fileFallback.brandName,
      phonePrimary: row.phone_primary ?? fileFallback.phonePrimary,
      phoneDisplay: row.phone_display ?? fileFallback.phoneDisplay,
      email: row.email ?? fileFallback.email,
      serviceHours: row.service_hours ?? fileFallback.serviceHours,
    }
  } catch (error) {
    console.error('getGlobalSettingsFromSource failed:', error)
    return fileFallback
  }
}

export async function getHomeContentFromSource(locale: Locale): Promise<HomeContent> {
  noStore()

  const fileFallback = getFileHomeContent(locale)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return fileFallback
  }

  try {
    const result = await (supabase.from('home_pages') as any)
      .select(
        'id, locale, hero_title, hero_subtitle, hero_primary_cta, hero_secondary_cta, emergency_title, emergency_text, reviews_title, faq_title, contact_title, contact_text'
      )
      .eq('locale', locale)
      .limit(1)

    if (result.error) {
      console.error('home_pages select error:', result.error)
      return fileFallback
    }

    const row = (result.data?.[0] ?? null) as HomePageRow | null

    if (!row) {
      console.error(`home_pages row not found for locale: ${locale}`)
      return fileFallback
    }

    return {
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
    }
  } catch (error) {
    console.error('getHomeContentFromSource failed:', error)
    return fileFallback
  }
}

export async function getReviewsFromSource(locale: Locale): Promise<ReviewItem[]> {
  noStore()

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
  noStore()

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

export async function getServicePageFromSource(
  locale: Locale,
  slug: string
): Promise<ServiceContent | null> {
  noStore()

  const fileHome = getFileHomeContent(locale)
  const fileFallback = fileHome.featuredServices.find((item) => item.slug === slug)

  const supabase = getSupabaseServerClient()

  if (!supabase) {
    if (!fileFallback) return null

    return {
      slug: fileFallback.slug,
      title: fileFallback.title,
      excerpt: fileFallback.excerpt,
      intro: fileFallback.excerpt,
      seoTitle: fileFallback.title,
      seoDescription: fileFallback.excerpt,
    }
  }

  try {
    const result = await (supabase.from('services') as any)
      .select(
        'id, locale, slug, title, excerpt, intro, seo_title, seo_description, sort_order, is_published'
      )
      .eq('locale', locale)
      .eq('slug', slug)
      .eq('is_published', true)
      .limit(1)

    if (result.error) {
      console.error('services select error:', result.error)

      if (!fileFallback) return null

      return {
        slug: fileFallback.slug,
        title: fileFallback.title,
        excerpt: fileFallback.excerpt,
        intro: fileFallback.excerpt,
        seoTitle: fileFallback.title,
        seoDescription: fileFallback.excerpt,
      }
    }

    const row = (result.data?.[0] ?? null) as ServiceRow | null

    if (!row) {
      if (!fileFallback) return null

      return {
        slug: fileFallback.slug,
        title: fileFallback.title,
        excerpt: fileFallback.excerpt,
        intro: fileFallback.excerpt,
        seoTitle: fileFallback.title,
        seoDescription: fileFallback.excerpt,
      }
    }

    return {
      slug: row.slug,
      title: row.title ?? fileFallback?.title ?? '',
      excerpt: row.excerpt ?? fileFallback?.excerpt ?? '',
      intro: row.intro ?? row.excerpt ?? fileFallback?.excerpt ?? '',
      seoTitle: row.seo_title ?? row.title ?? fileFallback?.title ?? '',
      seoDescription:
        row.seo_description ?? row.excerpt ?? fileFallback?.excerpt ?? '',
    }
  } catch (error) {
    console.error('getServicePageFromSource failed:', error)

    if (!fileFallback) return null

    return {
      slug: fileFallback.slug,
      title: fileFallback.title,
      excerpt: fileFallback.excerpt,
      intro: fileFallback.excerpt,
      seoTitle: fileFallback.title,
      seoDescription: fileFallback.excerpt,
    }
  }
}
