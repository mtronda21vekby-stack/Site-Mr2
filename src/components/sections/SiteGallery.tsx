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

function getCaseKey(image: SiteImage) {
  const text = `${image.title || ''} ${image.alt || ''}`.toLowerCase()
  const match = text.match(/case[-_\s]*(\d+)/)
  return match?.[1] || '1'
}

async function getGalleryImages(): Promise<SiteImage[]> {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('site_images')
      .select('id,image_url,title,alt,category')
      .order('created_at', { ascending: false })
      .limit(24)

    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export default async function SiteGallery() {
  const images = await getGalleryImages()
  if (!images.length) return null

  const beforeImages = images.filter((i) => i.category === 'before')
  const afterImages = images.filter((i) => i.category === 'after')
  const beforeByCase = new Map(beforeImages.map((image) => [getCaseKey(image), image]))
  const afterByCase = new Map(afterImages.map((image) => [getCaseKey(image), image]))
  const caseKeys = Array.from(beforeByCase.keys()).filter((key) => afterByCase.has(key)).slice(0, 4)

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

        {caseKeys.length > 0 && (
          <div className="mb-14">
            <div className="mb-7 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-accent-cyan/80">Before / After</p>
                <h3 className="mt-3 text-2xl font-black text-white md:text-4xl">Proof-based service cases</h3>
              </div>
              <p className="hidden max-w-sm text-right text-sm leading-6 text-white/45 md:block">
                Pair photos with titles like “case 1”, “case 2” to create multiple comparison sliders.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {caseKeys.map((key) => {
                const before = beforeByCase.get(key)!
                const after = afterByCase.get(key)!

                return (
                  <BeforeAfterSlider
                    key={key}
                    beforeImage={before.image_url}
                    afterImage={after.image_url}
                    beforeAlt={before.alt || before.title || 'Before locksmith service'}
                    afterAlt={after.alt || after.title || 'After locksmith service'}
                    title={after.title || before.title || `Before / After case ${key}`}
                    category={`case ${key}`}
                  />
                )
              })}
            </div>
          </div>
        )}

        <GalleryLightbox images={images} />
      </div>
    </section>
  )
}
