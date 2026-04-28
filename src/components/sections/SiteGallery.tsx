import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import GalleryLightbox from './GalleryLightbox'
import BeforeAfterSlider from './BeforeAfterSlider'

type SiteImage = {
  id: string
  image_url: string
  title: string | null
  alt: string | null
  category: string | null
}

async function getGalleryImages(): Promise<SiteImage[]> {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('site_images')
      .select('id,image_url,title,alt,category')
      .order('created_at', { ascending: false })
      .limit(12)

    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export default async function SiteGallery() {
  const images = await getGalleryImages()
  if (!images.length) return null

  const before = images.find((i) => i.category === 'before')
  const after = images.find((i) => i.category === 'after')

  return (
    <section className="relative px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-accent-cyan">Field gallery</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
            Real locksmith work, uploaded from the admin panel.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/58">
            Fresh photos from vehicle key programming, lockouts, emergency calls, and mobile service jobs.
          </p>
        </div>

        {before && after && (
          <div className="mb-12">
            <BeforeAfterSlider
              beforeImage={before.image_url}
              afterImage={after.image_url}
              title="Before / After vehicle unlock"
              category="proof"
            />
          </div>
        )}

        <GalleryLightbox images={images} />
      </div>
    </section>
  )
}
