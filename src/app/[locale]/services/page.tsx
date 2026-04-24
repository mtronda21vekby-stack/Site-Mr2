import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  getGlobalSettingsFromSource,
  getServicesListFromSource,
} from '@/lib/content.server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru' }>
}) {
  const { locale } = await params

  const [global, services] = await Promise.all([
    getGlobalSettingsFromSource(),
    getServicesListFromSource(locale),
  ])

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />

      <main className="mx-auto max-w-6xl px-4 py-16 text-text sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-muted">
            Planetlocksmiths
          </p>
          <h1 className="text-4xl font-heading font-semibold leading-tight">
            Automotive Locksmith Services
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Mobile automotive locksmith support with live service pages connected
            to your admin system.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <a
              key={service.slug}
              href={`/${locale}/services/${service.slug}`}
              className="block rounded-2xl border border-white/10 bg-surface p-6 transition hover:border-white/20 hover:bg-white/5"
            >
              <h2 className="text-2xl font-heading font-semibold">
                {service.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {service.excerpt}
              </p>
              <span className="mt-5 inline-flex text-sm font-semibold text-[var(--accent-blue)]">
                Open page →
              </span>
            </a>
          ))}
        </div>

        {!services.length ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-6 text-muted">
            No published services yet.
          </div>
        ) : null}
      </main>

      <Footer locale={locale} />
    </>
  )
}
