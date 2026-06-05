import { createClient } from '@supabase/supabase-js'
import GalleryLightbox from './GalleryLightbox'
import BeforeAfterSlider from './BeforeAfterSlider'
import MobileScrollSpinGallery from './MobileScrollSpinGallery'

type SiteImage = {
  id: string
  image_url: string
  title: string | null
  alt: string | null
  category: string | null
  sort_order?: number | null
}

function getCaseKey(image: SiteImage) {
  const text = `${image.title || ''} ${image.alt || ''}`.toLowerCase()
  const match = text.match(/case[-_\s]*(\d+)/)
  return match?.[1] || '1'
}

function getSupabaseCmsClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return null

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  })
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
      .limit(12)

    if (result.error) {
      console.error('site_images select error:', result.error)
      return []
    }

    return Array.isArray(result.data) ? result.data : []
  } catch (error) {
    console.error('getGalleryImages failed:', error)
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
    <section className="relative border-y border-[#0B1F4D]/10 bg-white px-5 py-10 md:px-8 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(11,31,77,0.055),transparent_32rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_100%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 hidden gap-5 md:grid md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#123A73]">Real work proof</p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-[-0.045em] text-[#0B1F4D] md:text-5xl">
              Customer job photos from the field
            </h2>
            <p className="mt-4 text-base leading-7 text-[#42526E]">
              Photos uploaded by the business: vehicle keys, lockouts, programming work, emergency calls, and completed mobile service jobs.
            </p>
          </div>
          <a href="#request-service" className="inline-flex w-fit items-center rounded-full border border-[#0B1F4D]/25 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-[#0B1F4D] shadow-[0_16px_42px_rgba(11,31,77,0.10)] transition hover:-translate-y-0.5 hover:border-[#0B1F4D]/45 hover:bg-[#F3F7FF]">
            Request service →
          </a>
        </div>

        <div className="md:hidden">
          <MobileScrollSpinGallery images={images} />
        </div>

        <div className="hidden md:block">
          {caseKeys.length > 0 && (
            <div className="mb-14">
              <div className="mb-7 flex items-end justify-between gap-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#123A73]">Before / After</p>
                  <h3 className="mt-3 text-2xl font-black text-[#0B1F4D] md:text-4xl">Proof-based service cases</h3>
                </div>
                <p className="hidden max-w-sm text-right text-sm leading-6 text-[#42526E] md:block">
                  Paired images show what was found on arrival and the result after service.
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
      </div>
    </section>
  )
}
