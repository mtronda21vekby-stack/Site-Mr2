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
    <section className="bg-surface/40 py-18 md:py-24">
      <div className="section-frame">
        <div className="mb-10 max-w-3xl">
          <p className="premium-label mb-4">Client signal</p>
          <h2 className="section-title mb-4">{title}</h2>
          <p className="section-copy">
            Trust is built through clarity, speed, and the feeling that the request is
            handled professionally from the first call.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((review, idx) => (
            <article key={idx} className="premium-card flex h-full flex-col p-6 md:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-text">{review.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
                    {review.city || 'Philadelphia area'}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <svg
                      key={starIdx}
                      className={`h-4 w-4 ${
                        starIdx < review.rating ? 'text-accent-gold' : 'text-white/15'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.169c.969 0 1.371 1.24.588 1.81l-3.373 2.451a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.373-2.451a1 1 0 00-1.176 0l-3.373 2.451c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.98 9.382c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.949-.69l1.286-3.955z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="mb-5 h-px w-full bg-white/10" />

              <p className="flex-1 text-sm leading-7 text-muted">
                “{review.quote}”
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-accent-cyan">
                  Verified tone
                </span>
                {review.date ? (
                  <span className="text-xs text-muted">{review.date}</span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
