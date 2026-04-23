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

export async function getGlobalSettingsFromSource(): Promise<GlobalSettings> {
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
  } catch {
    return fileFallback
  }
}

export async function getHomeContentFromSource(locale: Locale): Promise<HomeContent> {
  return getFileHomeContent(locale)
}

export async function getReviewsFromSource(locale: Locale): Promise<ReviewItem[]> {
  return getFileReviews(locale)
}

export async function getFaqFromSource(locale: Locale): Promise<FaqItem[]> {
  return getFileFaq(locale)
}
