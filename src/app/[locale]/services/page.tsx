import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CinematicBackground from '@/components/layout/CinematicBackground'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
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
    <div className="cinematic-shell min-h-screen pb-20 md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="relative overflow-hidden px-4 py-16 text-text sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-accent-cyan">Planetlocksmiths / services</p>
              <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-7xl">Automotive Locksmith Services</h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">Mobile automotive locksmith help for lockouts, replacement keys, key fob programming, transponder keys, ignition issues, and broken key situations. Each service page explains what information is needed before booking.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-72 lg:grid-cols-1">
              <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition hover:brightness-110">Call {global.phoneDisplay}</a>
              <a href={`/${locale}/contact`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-black/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-text backdrop-blur-xl transition hover:border-accent-gold/50 hover:bg-accent-gold/10">Request service</a>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <a key={service.slug} href={`/${locale}/services/${service.slug}`} className="group relative min-h-[18rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:border-accent-blue/40 hover:bg-white/[0.06]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_12%,rgba(77,162,255,0.16),transparent_18rem)] opacity-80" />
                <div className="absolute right-[-3rem] top-[-3rem] h-32 w-32 rounded-full border border-accent-gold/20" />
                <div className="relative flex h-full flex-col">
                  <p className="mb-7 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-accent-gold">Service {String(index + 1).padStart(2, '0')}</p>
                  <h2 className="text-balance text-2xl font-semibold tracking-[-0.035em]">{service.title}</h2>
                  <p className="mt-4 flex-1 text-sm leading-7 text-muted">{service.excerpt}</p>
                  <span className="mt-7 inline-flex text-xs font-bold uppercase tracking-[0.18em] text-accent-blue transition group-hover:text-accent-cyan">Open page →</span>
                </div>
              </a>
            ))}
          </div>

          {!services.length ? <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 text-muted backdrop-blur-xl">No published services yet.</div> : null}
        </section>
      </main>

      <Footer locale={locale} />
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
