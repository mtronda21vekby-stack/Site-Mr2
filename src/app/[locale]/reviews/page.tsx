import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings } from '@/lib/content'

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru' }>
}) {
  const { locale } = await params
  const global = getGlobalSettings()

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-text">
        <h1 className="mb-6 text-3xl font-heading font-semibold">Reviews</h1>
        <p>This page will eventually show customer reviews. For now it is a placeholder.</p>
      </main>
      <Footer locale={locale} />
    </>
  )
}
