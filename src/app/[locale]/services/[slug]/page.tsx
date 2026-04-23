import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  getGlobalSettingsFromSource,
  getServicePageFromSource,
} from '@/lib/content.server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru'; slug: string }>
}) {
  noStore()

  const { locale, slug } = await params

  const [global, service] = await Promise.all([
    getGlobalSettingsFromSource(),
    getServicePageFromSource(locale, slug),
  ])

  if (!service) {
    notFound()
  }

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-text">
        <h1 className="mb-6 text-3xl font-heading font-semibold">
          {service.title}
        </h1>

        {service.excerpt ? (
          <p className="mb-4 text-lg text-muted">{service.excerpt}</p>
        ) : null}

        {service.intro ? (
          <div className="space-y-4 text-base leading-7">
            {service.intro.split('\n').filter(Boolean).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        <div className="mt-10 rounded-2xl border border-white/10 bg-surface p-6">
          <p className="mb-4 text-sm uppercase tracking-wide text-muted">
            Need service now?
          </p>

          <a
            href={`tel:${global.phonePrimary}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--accent-blue)] px-5 font-semibold text-black"
          >
            Call {global.phoneDisplay}
          </a>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
