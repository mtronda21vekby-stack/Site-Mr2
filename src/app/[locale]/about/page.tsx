import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings } from '@/lib/content'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }, { locale: 'ru' }]
}

export default async function AboutPage({
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
      <main className="mx-auto max-w-4xl px-4 py-16 text-text sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-heading font-semibold">About Planetlocksmiths</h1>
        <div className="space-y-4 text-muted">
          <p>
            Planetlocksmiths is a mobile automotive locksmith service focused on fast,
            clear, and professional help across Philadelphia.
          </p>
          <p>
            We handle vehicle lockouts, lost key replacement, key programming, key fob
            support, and ignition-related key issues.
          </p>
          <p>
            Service is mobile-only. We come to your location and support urgent and
            same-day requests based on availability.
          </p>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
