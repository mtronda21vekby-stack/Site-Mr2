import { createClient } from '@supabase/supabase-js'
import GalleryLightbox from './GalleryLightbox'
import MobileScrollSpinGallery from './MobileScrollSpinGallery'
import { isBrowserSupportedImageUrl } from '@/lib/images'

type SiteImage = {
  id: string
  image_url: string
  title: string | null
  alt: string | null
  category: string | null
  sort_order?: number | null
}

function getSupabaseCmsClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return null

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  })
}

function normalizeImages(rows: SiteImage[]) {
  const seen = new Set<string>()

  return rows
    .filter((image) => {
      const url = String(image.image_url || '').trim()
      if (!url || seen.has(url) || !isBrowserSupportedImageUrl(url)) return false
      seen.add(url)
      return true
    })
    .map((image, index) => ({
      ...image,
      alt: normalizeImageAlt(image.alt),
      category: image.category || 'gallery',
      sort_order: image.sort_order ?? index,
    }))
}

function isLegacyBrandText(value: string | null | undefined) {
  const compact = String(value || '').trim().replace(/[^a-z0-9]/gi, '').toLowerCase()
  return compact === 'planetlocksmith' || compact === 'planetlocksmiths'
}

function normalizeImageAlt(value: string | null | undefined) {
  const text = String(value || '').trim()
  if (!text || isLegacyBrandText(text)) return 'Planet Locksmiths service photo'
  return text
}

async function getGalleryImages(): Promise<SiteImage[]> {
  const supabase = getSupabaseCmsClient()
  if (!supabase) return []

  try {
    const result = await (supabase.from('site_images') as any)
      .select('id,title,alt,category,image_url,sort_order,created_at')
      .eq('is_published', true)
      .in('category', ['gallery', 'before', 'after'])
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(16)

    if (result.error) {
      console.error('site_images select error:', result.error)
      return []
    }

    return normalizeImages(Array.isArray(result.data) ? result.data : [])
  } catch (error) {
    console.error('getGalleryImages failed:', error)
    return []
  }
}

export default async function SiteGallery() {
  const images = await getGalleryImages()
  if (!images.length) return null

  return (
    <section className="relative border-y border-[#0B1F4D]/10 bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(18,58,115,0.06),transparent_32rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_100%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#123A73]">Recent work</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-normal text-[#0B1F4D] md:text-5xl">
              Locksmith service photos from the field
            </h2>
            <p className="mt-4 text-base leading-7 text-[#42526E]">
              Real service photos are displayed without heavy cropping so lock, key, vehicle, and access details stay visible.
            </p>
          </div>
          <a href="#request-service" className="inline-flex w-fit items-center rounded-full border border-[#0B1F4D]/25 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#0B1F4D] shadow-[0_16px_42px_rgba(11,31,77,0.10)] transition hover:-translate-y-0.5 hover:border-[#0B1F4D]/45 hover:bg-[#F3F7FF]">
            Request service
          </a>
        </div>

        <div className="md:hidden">
          <MobileScrollSpinGallery images={images} />
        </div>

        <div className="hidden md:block">
          <GalleryLightbox images={images} />
        </div>
      </div>
    </section>
  )
}
