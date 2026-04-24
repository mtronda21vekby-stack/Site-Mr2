interface ReviewItem {
  name: string
  rating: number
  quote: string
  date?: string
  city?: string
}

interface ReviewsSectionProps {
  title: string
  items: ReviewItem[]
}

export default function ReviewsSection({ title, items }: ReviewsSectionProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_74%_20%,rgba(77,162,255,0.13),transparent_30rem),radial-gradient(circle_at_14%_62%,rgba(214,168,95,0.08),transparent_26rem)]" />
      <div className="absolute left-1/2 top-10 -z-10 h-px w-[min(70rem,90vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">
              Verified field signals
            </p>
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl lg:text-6xl">
              {title}
            </h2>
          </div>
          <div className="premium-panel rounded-2xl p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent-gold">Public proof layer</p>
            <p className="mt-2 text-sm leading-6 text-muted">Real review cards help customers understand service quality before they call.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((review, idx) => (
            <article
              key={idx}
              className="group premium-panel premium-hairline relative flex h-full min-h-[16rem] flex-col overflow-hidden rounded-[1.75rem] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-accent-blue/40"
            >
              <div className="absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full border border-accent-blue/20 transition duration-500 group-hover:scale-110 group-hover:border-accent-blue/35" />
              <div className="absolute bottom-[-4rem] left-[-3rem] h-32 w-32 rounded-full bg-accent-gold/10 blur-2xl transition group-hover:bg-accent-gold/16" />

              <div className="relative mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-text">{review.name}</h3>
                  {(review.city || review.date) ? (
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                      {[review.city, review.date].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                </div>

                <span className="flex rounded-full border border-accent-gold/25 bg-accent-gold/10 px-2.5 py-1 text-accent-gold shadow-[0_0_26px_rgba(214,168,95,0.12)]">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <svg key={starIdx} className={`h-3.5 w-3.5 ${starIdx < review.rating ? 'opacity-100' : 'opacity-25'}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.169c.969 0 1.371 1.24.588 1.81l-3.373 2.451a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.373-2.451a1 1 0 00-1.176 0l-3.373 2.451c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.98 9.382c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.949-.69l1.286-3.955z" />
                    </svg>
                  ))}
                </span>
              </div>

              <p className="relative flex-1 text-sm leading-7 text-muted">
                “{review.quote}”
              </p>

              <div className="relative mt-6 h-px bg-gradient-to-r from-accent-blue/0 via-accent-blue/25 to-accent-blue/0" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
