interface WhyChooseProps {
  items: string[]
}

export default function WhyChoose({ items }: WhyChooseProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="relative bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-accent-gold">Why choose us</p>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">Clear mobile locksmith help when the vehicle matters.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted">Customers need fast communication, realistic expectations, and the right vehicle details before service. This section keeps the value proposition direct.</p>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((reason, idx) => (
              <li key={idx} className="premium-panel rounded-[1.35rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent-gold/30">
                <div className="flex gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-gold/25 bg-accent-gold/10 text-xs font-black text-accent-gold">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-sm leading-7 text-muted">{reason}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
