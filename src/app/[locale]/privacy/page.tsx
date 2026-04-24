import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import { getGlobalSettingsFromSource } from '@/lib/content.server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PrivacyPage({ params }: { params: Promise<{ locale: 'en' | 'es' | 'ru' }> }) {
  const { locale } = await params
  const global = await getGlobalSettingsFromSource()

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">Customer information</p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Privacy Policy</h1>
        <p className="mt-5 text-sm leading-7 text-muted">This page explains how Planetlocksmiths handles information submitted through this website for mobile automotive locksmith service requests.</p>
        <div className="mt-10 space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
          <section><h2 className="text-xl font-semibold text-text">Information we collect</h2><p className="mt-3 text-sm leading-7 text-muted">When you submit a service request, we may collect your name, phone number, email address, requested service, vehicle make/model/year, service location, urgency, preferred time, and message details. This information is used to respond to your request and understand the service needed.</p></section>
          <section><h2 className="text-xl font-semibold text-text">How we use information</h2><p className="mt-3 text-sm leading-7 text-muted">Submitted information is used to contact you, review your automotive locksmith request, help estimate the required tools or parts, coordinate service availability, and improve customer communication.</p></section>
          <section><h2 className="text-xl font-semibold text-text">Sharing information</h2><p className="mt-3 text-sm leading-7 text-muted">We do not sell customer request information. Information may be shared only when needed to process a service request, comply with law, protect rights and safety, or operate website infrastructure and customer communication systems.</p></section>
          <section><h2 className="text-xl font-semibold text-text">Security</h2><p className="mt-3 text-sm leading-7 text-muted">We use reasonable technical and organizational measures to protect submitted information. No website or internet transmission can be guaranteed completely secure.</p></section>
          <section><h2 className="text-xl font-semibold text-text">Customer choices</h2><p className="mt-3 text-sm leading-7 text-muted">You may contact us to ask about a service request, correct information, or request deletion of submitted request details where legally and operationally appropriate.</p></section>
          <section><h2 className="text-xl font-semibold text-text">Contact</h2><p className="mt-3 text-sm leading-7 text-muted">For privacy questions or service-request updates, contact Planetlocksmiths by phone at {global.phoneDisplay} or use the request form on the contact page.</p></section>
        </div>
      </main>
      <Footer locale={locale} />
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
    </div>
  )
}
