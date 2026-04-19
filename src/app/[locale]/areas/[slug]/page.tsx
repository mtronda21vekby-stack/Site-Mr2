import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings } from '@/lib/content'

export async function generateStaticParams() {
  const locales: Array<'en' | 'es' | 'ru'> = ['en', 'es', 'ru']
  const areaSlugs = ['philadelphia']
  const params: Array<{ locale: string; slug: string }> = []

  for (const locale of locales) {
    for (const slug of areaSlugs) {
      params.push({ locale, slug })
    }
  }

  return params
}

export const dynamicParams = false
export const dynamic = 'force-static'

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru'; slug: string }>
}) {
  const { locale, slug } = await params
  const global = getGlobalSettings()

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-text">
        <h1 className="mb-6 text-3xl font-heading font-semibold">Service Area</h1>
        <p>
          This area page is a placeholder for {slug}. Add details about service coverage, highlights and
          supported services here.
        </p>
      </main>
      <Footer locale={locale} />
    </>
  )
}
