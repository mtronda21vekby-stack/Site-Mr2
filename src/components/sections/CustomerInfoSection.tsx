import type { FaqItem } from '@/lib/content'
import type { ServiceContent } from '@/lib/content.server'

type InfoBlock = {
  title: string
  text: string
  items?: string[]
}

type CustomerInfoSectionProps = {
  eyebrow: string
  title: string
  intro: string
  services: ServiceContent[]
  faq: FaqItem[]
}

export default function CustomerInfoSection({
  eyebrow,
  title,
  intro,
  services,
  faq,
}: CustomerInfoSectionProps) {
  const serviceBlocks: InfoBlock[] = services.slice(0, 3).map((service) => ({
    title: service.title,
    text: service.excerpt || service.seoDescription,
    items: (service.intro || service.seoDescription || service.excerpt)
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3),
  }))

  const faqBlock: InfoBlock | null = faq.length
    ? {
        title: faq[0].question,
        text: faq[0].answer,
        items: faq.slice(1, 4).map((item) => item.question),
      }
    : null

  const blocks = [...serviceBlocks, ...(faqBlock ? [faqBlock] : [])]

  if (!blocks.length) return null

  return (
    <section className="relative overflow-hidden bg-transparent py-16 sm:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(77,162,255,0.08),transparent_28rem)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">
            {eyebrow}
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-8 text-muted">{intro}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {blocks.map((block, index) => (
            <article key={`${block.title}-${index}`} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-blue text-sm font-bold text-black">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-text">{block.title}</h3>
              </div>
              <p className="text-sm leading-7 text-muted">{block.text}</p>
              {block.items?.length ? (
                <ul className="mt-5 grid gap-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-text/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
