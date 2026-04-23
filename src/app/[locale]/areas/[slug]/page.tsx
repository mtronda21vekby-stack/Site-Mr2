import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  getAreaPageFromSource,
  getGlobalSettingsFromSource,
} from '@/lib/content.server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru'; slug: string }>
}) {
  noStore()

  const { locale, slug } = await params

  const [global, area] = await Promise.all([
    getGlobalSettingsFromSource(),
    getAreaPageFromSource(locale, slug),
  ])

  if (!area) {
    notFound()
  }

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />

      <main className="mx-auto max-w-4xl px-4 py-16 text-text sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-heading font-semibold">{area.title}</h1>

        {area.intro ? (
          <div className="mb-8 space-y-4 text-base leading-7">
            {area.intro.split('\n').filter(Boolean).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {area.highlights.length ? (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-heading font-semibold">
              Highlights
            </h2>
            <ul className="grid gap-3">
              {area.highlights.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-xl border border-white/10 bg-surface px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {area.supportedServices.length ? (
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-heading font-semibold">
              Supported Services
            </h2>
            <ul className="grid gap-3">
              {area.supportedServices.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-xl border border-white/10 bg-surface px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="rounded-2xl border border-white/10 bg-surface p-6">
          <p className="mb-4 text-sm uppercase tracking-wide text-muted">
            Need service in {area.city || area.slug}?
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
