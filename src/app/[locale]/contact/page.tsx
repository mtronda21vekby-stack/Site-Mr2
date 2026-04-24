import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import ContactSection from '@/components/sections/ContactSection'
import {
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
} from '@/lib/content.server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'es' | 'ru' }>
}) {
  const { locale } = await params
  const [global, home] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
  ])

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="flex flex-col">
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">Contact Planetlocksmiths</p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Request mobile automotive locksmith service</h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-muted">
              Use the form below to send vehicle details, location, urgency, and the service needed. For urgent lockouts or active roadside situations, calling may be faster.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><h2 className="text-sm font-semibold text-text">Phone</h2><p className="mt-2 text-sm text-muted">{global.phoneDisplay}</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><h2 className="text-sm font-semibold text-text">Service type</h2><p className="mt-2 text-sm text-muted">Mobile automotive locksmith</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><h2 className="text-sm font-semibold text-text">Common area</h2><p className="mt-2 text-sm text-muted">Philadelphia, Pennsylvania and nearby coverage areas</p></div>
            </div>
          </div>
        </section>

        <ContactSection
          title={home.contactTitle}
          text={home.contactText}
          phoneNumber={global.phonePrimary}
          phoneDisplay={global.phoneDisplay}
          locale={locale}
        />
      </main>

      <Footer locale={locale} />
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
