interface WhyChooseProps {
  items: string[]
}

export default function WhyChoose({ items }: WhyChooseProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(45,226,230,0.08),transparent_30rem)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent-gold">
              Trust protocol
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">
              Built for urgent automotive access.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
              A premium mobile locksmith experience: rapid dispatch, clean communication, and technical work presented with control-system clarity.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((reason, idx) => (
              <li
                key={idx}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition hover:border-accent-gold/35 hover:bg-white/[0.06]"
              >
                <div className="absolute right-[-2rem] top-[-2rem] h-24 w-24 rounded-full border border-accent-blue/15" />
                <div className="relative flex gap-4">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-gold/30 bg-accent-gold/10 text-xs font-bold text-accent-gold shadow-[0_0_24px_rgba(214,168,95,0.14)]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-7 text-muted transition group-hover:text-text/90">
                    {reason}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
