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
    <section className="bg-bg py-18 md:py-24">
      <div className="section-frame">
        <div className="mb-10 max-w-3xl">
          <p className="premium-label mb-4">Request clarity</p>
          <h2 className="section-title mb-4">{title}</h2>
          <p className="section-copy">
            Keep the answers short, operational, and useful. This section should reduce
            hesitation and move the visitor closer to contact.
          </p>
        </div>

        <div className="grid gap-4">
          {items.map((faq, idx) => (
            <details
              key={idx}
              className="premium-card-soft group overflow-hidden p-5 md:p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="text-base font-semibold text-text md:text-lg">
                  {faq.question}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-text transition group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="mt-4 h-px w-full bg-white/10" />

              <p className="pt-4 text-sm leading-7 text-muted md:text-[15px]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
