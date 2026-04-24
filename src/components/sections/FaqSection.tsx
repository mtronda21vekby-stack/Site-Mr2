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
    <section className="relative overflow-hidden bg-transparent py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_22%,rgba(214,168,95,0.08),transparent_26rem),radial-gradient(circle_at_84%_54%,rgba(77,162,255,0.10),transparent_30rem)]" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-accent-gold">
            Operator FAQ
          </p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted sm:text-base sm:leading-8">
            Clear answers for emergency lockouts, replacement keys, programming, coverage, authorization, and appointment flow.
          </p>

          <div className="premium-panel mt-8 rounded-2xl p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-cyan">Trust system</p>
            <p className="mt-2 text-sm leading-7 text-muted">Strong FAQ content improves clarity before a customer submits a request or calls.</p>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((faq, idx) => (
            <details
              key={idx}
              className="group premium-panel overflow-hidden rounded-[1.35rem] p-5 transition duration-300 open:border-accent-blue/35 open:bg-white/[0.055]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-text marker:hidden">
                <span className="text-base leading-7">{faq.question}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/25 text-accent-blue transition duration-300 group-open:rotate-45 group-open:border-accent-blue/40 group-open:bg-accent-blue/10">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl border-t border-white/10 pt-4 text-sm leading-7 text-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
