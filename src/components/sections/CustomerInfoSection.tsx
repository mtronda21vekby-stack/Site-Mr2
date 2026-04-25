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

export default function CustomerInfoSection({ eyebrow, title, intro, services, faq }: CustomerInfoSectionProps) {
  const serviceBlocks: InfoBlock[] = services.slice(0, 2).map((service) => ({
    title: service.title,
    text: service.excerpt || service.seoDescription,
    items: (service.intro || service.seoDescription || service.excerpt).split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 2),
  }))

  const faqBlock: InfoBlock | null = faq.length
    ? { title: faq[0].question, text: faq[0].answer, items: faq.slice(1, 3).map((item) => item.question) }
    : null

  const blocks = [...serviceBlocks, ...(faqBlock ? [faqBlock] : [])]
  if (!blocks.length) return null

  return (
    <section className="relative bg-transparent py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-accent-cyan">{eyebrow}</p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-5 text-base leading-8 text-muted">{intro}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {blocks.map((block, index) => (
            <article key={`${block.title}-${index}`} className="premium-panel rounded-[1.35rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/30">
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-gold/25 bg-accent-gold/10 text-xs font-black text-accent-gold">{index + 1}</span>
                <h3 className="text-lg font-semibold leading-6 text-text">{block.title}</h3>
              </div>
              <p className="text-sm leading-7 text-muted">{block.text}</p>
              {block.items?.length ? (
                <ul className="mt-4 grid gap-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-text/82">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
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
