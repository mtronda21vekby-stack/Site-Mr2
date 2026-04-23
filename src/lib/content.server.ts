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
  return getFileReviews(locale)
}

export async function getFaqFromSource(locale: Locale): Promise<FaqItem[]> {
  noStore()
  return getFileFaq(locale)
}
