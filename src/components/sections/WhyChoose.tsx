interface WhyChooseProps {
  items: string[]
}

export default function WhyChoose({ items }: WhyChooseProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="bg-bg py-18 md:py-24">
      <div className="section-frame">
        <div className="mb-10 max-w-3xl">
          <p className="premium-label mb-4">Why Planetlocksmiths</p>
          <h2 className="section-title mb-4">Built for urgent local service</h2>
          <p className="section-copy">
            Less generic marketing, more operational clarity. The site should feel direct,
            premium, and trustworthy from the first screen.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((reason, idx) => (
            <article key={idx} className="premium-card-soft p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-semibold text-accent-gold">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <p className="text-sm leading-7 text-muted">{reason}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
