import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

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
      .limit(6)

    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export default async function SiteGallery() {
  const images = await getGalleryImages()
  if (!images.length) return null

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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <article
              key={image.id}
              className={`group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl ${index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className={`${index === 0 ? 'h-[24rem]' : 'h-72'} overflow-hidden bg-black/50`}>
                <img
                  src={image.image_url}
                  alt={image.alt || image.title || 'Planet Locksmiths service photo'}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-black uppercase tracking-[0.22em] text-accent-cyan/80">
                    {image.category || 'gallery'}
                  </p>
                  <h3 className="mt-1 truncate text-sm font-bold text-white/82">
                    {image.title || 'Mobile locksmith service'}
                  </h3>
                </div>
                <div className="h-2 w-2 shrink-0 rounded-full bg-accent-cyan shadow-[0_0_18px_rgba(45,226,230,0.8)]" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
