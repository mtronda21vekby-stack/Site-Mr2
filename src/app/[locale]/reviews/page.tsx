import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings, getReviews } from '@/lib/content'

const copy = {
  en: {
    title: 'Customer Reviews',
    intro: 'A few examples of the kind of feedback mobile automotive locksmith clients leave after service.',
  },
  es: {
    title: 'Reseñas de clientes',
    intro: 'Algunos ejemplos del tipo de comentarios que dejan los clientes después del servicio.',
  },
  ru: {
    title: 'Отзывы клиентов',
    intro: 'Ниже примеры того, какой фидбек оставляют клиенты после выездного сервиса.',
  },
} as const

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }, { locale: 'ru' }]
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru' }>
}) {
  const { locale } = await params
  const global = getGlobalSettings()
  const reviews = getReviews(locale)
  const t = copy[locale]

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-5xl px-4 py-16 text-text sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-heading font-semibold">{t.title}</h1>
        <p className="mb-8 max-w-2xl text-muted">{t.intro}</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <article key={`${review.name}-${index}`} className="rounded-xl border border-line bg-surface p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">{review.name}</h2>
                <span className="text-accent-gold">{'★'.repeat(review.rating)}</span>
              </div>
              <p className="text-sm text-muted">“{review.quote}”</p>
              {review.city ? <p className="mt-4 text-xs text-muted">{review.city}</p> : null}
            </article>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
