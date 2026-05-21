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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${siteUrl}/api/admin/photos`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return (data.photos ?? []).slice(0, 24)
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
    <section className="relative bg-[#02040A] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-accent-cyan">Real work proof</p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-[-0.045em] text-white md:text-5xl">
              Customer job photos from the field
            </h2>
            <p className="mt-4 text-base leading-7 text-white/58">
              Photos uploaded by the business: vehicle keys, lockouts, programming work, emergency calls, and completed mobile service jobs.
            </p>
          </div>
          <a href="#request" className="inline-flex w-fit items-center rounded-full border border-accent-blue/35 bg-accent-blue/10 px-5 py-3 text-xs font-black uppercase tracking-[0.17em] text-accent-blue transition hover:-translate-y-0.5 hover:border-accent-cyan/45 hover:text-accent-cyan">
            Request service →
          </a>
        </div>

        {caseKeys.length > 0 && (
          <div className="mb-14">
            <div className="mb-7 flex items-end justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-accent-cyan/80">Before / After</p>
                <h3 className="mt-3 text-2xl font-black text-white md:text-4xl">Proof-based service cases</h3>
              </div>
              <p className="hidden max-w-sm text-right text-sm leading-6 text-white/45 md:block">
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
    </section>
  )
}
