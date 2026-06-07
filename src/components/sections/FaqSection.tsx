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
    <section className="relative bg-transparent py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-accent-gold">FAQ</p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl lg:text-6xl">{title}</h2>
          <p className="mt-5 text-sm leading-7 text-muted sm:text-base sm:leading-8">Clear answers about lockouts, replacement keys, programming, coverage, authorization, and service requests.</p>
        </div>

        <div className="space-y-3">
          {items.map((faq, idx) => (
            <details key={idx} className="group premium-panel premium-hairline overflow-hidden rounded-[1.25rem] p-5 transition duration-300 open:border-accent-blue/30 open:shadow-[0_24px_78px_rgba(11,31,77,0.12)]">
              <summary className="relative z-10 flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-text marker:hidden">
                <span className="text-base leading-7">{faq.question}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0B1F4D]/16 bg-white text-[#0B1F4D] shadow-[0_10px_24px_rgba(11,31,77,0.07)] transition duration-300 group-open:rotate-45 group-open:border-accent-blue/35 group-open:bg-[#F3F7FF]">+</span>
              </summary>
              <p className="relative z-10 mt-4 border-t border-[#0B1F4D]/10 pt-4 text-sm leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
