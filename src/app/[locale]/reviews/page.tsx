import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import ReviewsSection from '@/components/sections/ReviewsSection'
import ContentBlockModule from '@/components/site/ContentBlockModule'
import { buildPageMetadata } from '@/lib/seo'
import {
  getContentBlocksFromSource,
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
  getReviewsFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const copy = fallbackCopy[activeLocale]
  return buildPageMetadata({ locale: activeLocale, path: '/reviews', title: copy.title, description: copy.body })
}

const fallbackCopy: Record<ActiveLocale, { eyebrow: string; title: string; body: string; empty: string }> = {
  en: { eyebrow: 'Customer feedback', title: 'Customer Reviews', body: 'Read customer feedback for mobile automotive locksmith requests including lockouts, replacement keys, fobs, transponder support, and related vehicle key situations.', empty: 'No published reviews yet.' },
  es: { eyebrow: 'Opiniones de clientes', title: 'Reseñas de clientes', body: 'Lea opiniones de clientes sobre solicitudes móviles de cerrajería automotriz: autos cerrados, llaves, controles, transponder y situaciones relacionadas.', empty: 'No hay reseñas publicadas todavía.' },
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const [global, home, reviews, blocks] = await Promise.all([getGlobalSettingsFromSource(), getHomeContentFromSource(activeLocale), getReviewsFromSource(activeLocale), getContentBlocksFromSource(activeLocale, 'reviews')])
  const fallback = fallbackCopy[activeLocale]
  const hero = blocks.find((block) => block.slot === 'hero')
  const empty = blocks.find((block) => block.slot === 'empty')
  const extraBlocks = blocks.filter((block) => !['hero', 'empty'].includes(block.slot))

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <CinematicBackground />
      <Header
        locale={activeLocale}
        brandName={global.brandName}
        logoUrl={global.logoUrl}
        logoAlt={global.logoAlt}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="premium-panel premium-hairline rounded-[2.25rem] p-6 sm:p-8 lg:p-10"><div className="relative z-10"><p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">{hero?.eyebrow || fallback.eyebrow}</p><h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{hero?.title || home.reviewsTitle || fallback.title}</h1><p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{hero?.body || fallback.body}</p></div></div>
          {extraBlocks.length ? <div className="mt-8 grid gap-5 lg:grid-cols-2">{extraBlocks.map((block) => <ContentBlockModule key={block.id} block={block} variant={block.items.length > 1 ? 'checklist' : 'section'} />)}</div> : null}
        </section>
        {reviews.length ? <ReviewsSection title={home.reviewsTitle || fallback.title} items={reviews} /> : <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8"><div className="premium-panel rounded-[1.5rem] p-6 text-muted"><div className="relative z-10">{empty?.body || fallback.empty}</div></div></section>}
      </main>
      <Footer locale={activeLocale} />
      <MobileStickyCta locale={activeLocale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
