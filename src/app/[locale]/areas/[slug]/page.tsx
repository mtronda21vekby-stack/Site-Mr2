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

  const paragraphs = area.intro?.split('\n').filter(Boolean) ?? []

  return (
    <div className="cinematic-shell min-h-screen">
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />

      <main className="relative overflow-hidden px-4 py-16 text-text sm:px-6 lg:px-8">
        <div className="absolute left-[-12rem] top-24 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent-blue/10 blur-3xl" />
        <div className="absolute right-[-12rem] bottom-0 -z-10 h-[34rem] w-[34rem] rounded-full bg-accent-gold/10 blur-3xl" />

        <article className="mx-auto max-w-7xl">
          <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8 lg:grid-cols-[1fr_22rem] lg:items-end lg:p-10">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan">
                Coverage sector / {area.city || slug}
              </p>
              <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-7xl">
                {area.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">
                Mobile automotive locksmith coverage for {[area.city, area.state].filter(Boolean).join(', ') || area.title}.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-accent-blue/20 bg-black/25 p-5 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">
                Dispatch line
              </p>
              <p className="mt-3 text-2xl font-semibold text-text">
                {global.phoneDisplay}
              </p>
              <a
                href={`tel:${global.phonePrimary}`}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition hover:brightness-110"
              >
                Call now
              </a>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-accent-gold">
                Area intelligence
              </p>

              {paragraphs.length ? (
                <div className="space-y-5 text-base leading-8 text-muted">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-base leading-8 text-muted">
                  This coverage page is connected to admin content. Add localized area copy from the Areas module to expand this information window.
                </p>
              )}
            </div>

            <aside className="grid gap-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-text">Response model</h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Mobile technician routing for automotive lockouts, key replacement, and programming requests.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-text">Local signal</h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {area.city || area.title} is presented as a dedicated coverage sector for stronger local SEO and conversion.
                </p>
              </div>
            </aside>
          </section>

          {area.highlights.length ? (
            <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-accent-cyan">
                Area highlights
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {area.highlights.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-muted"
                  >
                    <span className="mb-3 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent-gold">
                      Point {String(index + 1).padStart(2, '0')}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {area.supportedServices.length ? (
            <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-accent-cyan">
                Supported services
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {area.supportedServices.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-muted"
                  >
                    <span className="mb-3 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent-gold">
                      Module {String(index + 1).padStart(2, '0')}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
