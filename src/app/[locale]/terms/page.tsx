import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import { getGlobalSettingsFromSource } from '@/lib/content.server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TermsPage({ params }: { params: Promise<{ locale: 'en' | 'es' | 'ru' }> }) {
  const { locale } = await params
  const global = await getGlobalSettingsFromSource()

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">Customer information</p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Terms of Service</h1>
        <p className="mt-5 text-sm leading-7 text-muted">These terms explain the basic conditions for using this website and submitting a mobile automotive locksmith service request to Planetlocksmiths.</p>
        <div className="mt-10 space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
          <section><h2 className="text-xl font-semibold text-text">Website use</h2><p className="mt-3 text-sm leading-7 text-muted">This website provides information about automotive locksmith services and allows customers to submit service requests. You agree to provide accurate contact, vehicle, and location details when requesting service.</p></section>
          <section><h2 className="text-xl font-semibold text-text">Service availability</h2><p className="mt-3 text-sm leading-7 text-muted">Submitting a request does not guarantee immediate availability, dispatch, price, or completion of service. Availability depends on location, vehicle type, parts, technician availability, timing, and job complexity.</p></section>
          <section><h2 className="text-xl font-semibold text-text">Pricing and estimates</h2><p className="mt-3 text-sm leading-7 text-muted">Any estimate may depend on vehicle make, model, year, key type, programming requirements, lock condition, distance, emergency timing, and parts availability. Final pricing should be confirmed before work begins.</p></section>
          <section><h2 className="text-xl font-semibold text-text">Vehicle ownership and authorization</h2><p className="mt-3 text-sm leading-7 text-muted">Customers may be asked to confirm authorization to access or service a vehicle. Service may be declined if ownership, authorization, safety, or legal concerns cannot be reasonably resolved.</p></section>
          <section><h2 className="text-xl font-semibold text-text">No misuse</h2><p className="mt-3 text-sm leading-7 text-muted">You may not use this website to submit false requests, interfere with website operation, impersonate others, or request service for a vehicle you are not authorized to access.</p></section>
          <section><h2 className="text-xl font-semibold text-text">Contact</h2><p className="mt-3 text-sm leading-7 text-muted">For questions about a request or these terms, contact Planetlocksmiths by phone at {global.phoneDisplay}.</p></section>
        </div>
      </main>
      <Footer locale={locale} />
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
