import Link from 'next/link'
import type { SiteContentBlock } from '@/lib/content.server'

type ContentBlockModuleVariant = 'section' | 'compact' | 'checklist' | 'side'

type ContentBlockModuleProps = {
  block: SiteContentBlock
  variant?: ContentBlockModuleVariant
  className?: string
}

export default function ContentBlockModule({ block, variant = 'section', className = '' }: ContentBlockModuleProps) {
  const hasText = Boolean(block.eyebrow || block.title || block.body)
  const hasItems = block.items.length > 0
  const hasCta = Boolean(block.ctaLabel && block.ctaHref)

  if (!hasText && !hasItems && !hasCta) return null

  const isCompact = variant === 'compact' || variant === 'side'
  const isChecklist = variant === 'checklist'

  return (
    <section className={`premium-panel premium-hairline relative overflow-hidden rounded-[1.75rem] ${isCompact ? 'p-5' : 'p-6 sm:p-8'} ${className}`}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border border-accent-blue/20 bg-accent-blue/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full border border-accent-gold/20 bg-accent-gold/10 blur-2xl" />

      <div className="relative z-10">
        {block.eyebrow ? <p className="text-[0.66rem] font-black uppercase tracking-[0.24em] text-accent-cyan">{block.eyebrow}</p> : null}
        {block.title ? <h2 className={`${isCompact ? 'mt-3 text-2xl' : 'mt-4 text-3xl sm:text-4xl'} text-balance font-semibold leading-[0.95] tracking-[-0.055em] text-text`}>{block.title}</h2> : null}
        {block.body ? <p className={`${isCompact ? 'mt-3 text-sm leading-7' : 'mt-5 max-w-3xl text-base leading-8'} text-muted`}>{block.body}</p> : null}

        {hasItems ? (
          <div className={`${isCompact ? 'mt-5' : 'mt-7'} grid gap-3 ${isChecklist ? 'sm:grid-cols-2' : ''}`}>
            {block.items.map((item, index) => (
              <div key={`${block.id}-${index}-${item}`} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-blue/30 bg-accent-blue/10 text-[0.65rem] font-black text-accent-cyan">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm leading-6 text-muted">{item}</span>
              </div>
            ))}
          </div>
        ) : null}

        {hasCta ? (
          <div className="mt-7">
            <Link href={block.ctaHref} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/[0.075] px-7 py-3 text-xs font-black uppercase tracking-[0.16em] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/45 hover:bg-accent-gold/12 hover:text-accent-gold">
              {block.ctaLabel} <span className="ml-2">→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
