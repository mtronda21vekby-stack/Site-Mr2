interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  title: string
  items: FaqItem[]
}

export default function FaqSection({ title, items }: FaqSectionProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent-gold">
            Operator FAQ
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted">
            Clear answers for emergency lockouts, replacement keys, programming, coverage, and appointment flow.
          </p>
        </div>

        <div className="space-y-4">
          {items.map((faq, idx) => (
            <details
              key={idx}
              className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition open:border-accent-blue/35 open:bg-white/[0.055]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-text marker:hidden">
                <span>{faq.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/25 text-accent-blue transition group-open:rotate-45 group-open:border-accent-blue/40">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
