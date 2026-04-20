import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { getGlobalSettings, getReviews } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

const copy = {
  en: {
    title: 'Customer Reviews',
    metaTitle: 'Customer Reviews | Planetlocksmiths Philadelphia',
    metaDescription:
      'Read customer feedback for Planetlocksmiths mobile automotive locksmith service in Philadelphia.',
    intro: 'A few examples of the kind of feedback mobile automotive locksmith clients leave after service.',
  },
  es: {
    title: 'Reseñas de clientes',
    metaTitle: 'Reseñas de Clientes | Planetlocksmiths Filadelfia',
    metaDescription:
      'Comentarios de clientes sobre el servicio móvil de cerrajería automotriz Planetlocksmiths en Filadelfia.',
    intro: 'Algunos ejemplos del tipo de comentarios que dejan los clientes después del servicio.',
  },
  ru: {
    title: 'Отзывы клиентов',
    metaTitle: 'Отзывы Клиентов | Planetlocksmiths Филадельфия',
    metaDescription:
      'Отзывы клиентов о мобильном автомобильном ключном сервисе Planetlocksmiths в Филадельфии.',
    intro: 'Ниже примеры того, какой фидбек оставляют клиенты после выездного сервиса.',
  },
} as const

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }, { locale: 'ru' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const page = copy[locale]

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `/${locale}/reviews`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${locale}/reviews`,
      type: 'website',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'Planetlocksmiths',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: ['/opengraph-image'],
    },
  }
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const global = getGlobalSettings()
  const reviews = getReviews(locale)
  const page = copy[locale]
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: `${siteUrl}/${locale}` },
          { name: page.title, url: `${siteUrl}/${locale}/reviews` },
        ]}
      />

      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />

      <main className="bg-surface/40 py-16 md:py-20">
        <div className="section-frame">
          <div className="mb-10 max-w-3xl">
            <p className="premium-label mb-4">Client signal</p>
            <h1 className="mb-4 text-3xl font-heading font-semibold text-text md:text-5xl">
              {page.title}
            </h1>
            <p className="section-copy">{page.intro}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review, idx) => (
              <article key={`${review.name}-${idx}`} className="premium-card flex h-full flex-col p-6 md:p-7">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text">{review.name}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
                      {review.city || 'Philadelphia area'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <svg
                        key={starIdx}
                        className={`h-4 w-4 ${
                          starIdx < review.rating ? 'text-accent-gold' : 'text-white/15'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.169c.969 0 1.371 1.24.588 1.81l-3.373 2.451a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.373-2.451a1 1 0 00-1.176 0l-3.373 2.451c-.784.57-1.838-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.98 9.382c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.949-.69l1.286-3.955z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="mb-5 h-px w-full bg-white/10" />

                <p className="flex-1 text-sm leading-7 text-muted">“{review.quote}”</p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-accent-cyan">
                    Verified tone
                  </span>
                  {review.date ? <span className="text-xs text-muted">{review.date}</span> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
