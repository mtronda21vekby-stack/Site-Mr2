import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import {
  getContentBlocksFromSource,
  getGlobalSettingsFromSource,
  type SiteContentBlock,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'
type ActiveLocale = 'en' | 'es'

export const revalidate = 60

const fallbackCopy: Record<ActiveLocale, { eyebrow: string; title: string; body: string; sections: Array<{ title: string; body: string }> }> = {
  en: { eyebrow: 'Customer information', title: 'Privacy Policy', body: 'This page explains how Planet Locksmiths handles information submitted through this website for mobile locksmith service requests.', sections: [{ title: 'Information we collect', body: 'When you submit a service request, we may collect your name, phone number, email address, requested service, authorization details, vehicle details when relevant, service location, urgency, preferred time, and message details. This information is used to respond to your request and understand the service needed.' }, { title: 'How we use information', body: 'Submitted information is used to contact you, review your locksmith request, help estimate required tools or parts, coordinate service availability, and improve customer communication.' }, { title: 'Sharing information', body: 'We do not sell customer request information. Information may be shared only when needed to process a service request, comply with law, protect rights and safety, or operate website infrastructure and customer communication systems.' }, { title: 'Security', body: 'We use reasonable technical and organizational measures to protect submitted information. No website or internet transmission can be guaranteed completely secure.' }, { title: 'Customer choices', body: 'You may contact us to ask about a service request, correct information, or request deletion of submitted request details where legally and operationally appropriate.' }] },
  es: { eyebrow: 'Información del cliente', title: 'Política de privacidad', body: 'Esta página explica cómo Planet Locksmiths maneja la información enviada a través del sitio para solicitudes móviles de cerrajería.', sections: [{ title: 'Información que recopilamos', body: 'Cuando envía una solicitud, podemos recopilar nombre, teléfono, email, servicio solicitado, autorización, datos del vehículo cuando aplique, ubicación, urgencia, horario preferido y mensaje.' }, { title: 'Cómo usamos la información', body: 'La información se usa para contactarlo, revisar la solicitud de cerrajería, estimar herramientas o piezas, coordinar disponibilidad y mejorar la comunicación.' }, { title: 'Compartir información', body: 'No vendemos información de solicitudes. Puede compartirse solo cuando sea necesario para procesar servicio, cumplir la ley, proteger derechos o operar sistemas.' }, { title: 'Seguridad', body: 'Usamos medidas razonables para proteger información enviada. Ningún sitio o transmisión por internet puede garantizar seguridad absoluta.' }, { title: 'Opciones del cliente', body: 'Puede contactarnos para preguntar sobre una solicitud, corregir información o pedir eliminación cuando sea apropiado legal y operativamente.' }] },
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const activeLocale: ActiveLocale = locale === 'es' ? 'es' : 'en'
  const [global, blocks] = await Promise.all([
    getGlobalSettingsFromSource(),
    getContentBlocksFromSource(activeLocale, 'legal-privacy'),
  ])

  const copy = fallbackCopy[activeLocale]
  const hero = blocks.find((block) => block.slot === 'hero')
  const sections = getLegalSections(blocks, copy.sections)

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <CinematicBackground />
      <Header
        locale={activeLocale}
        brandName={global.brandName}
        logoUrl={global.logoUrl}
        logoAlt={global.logoAlt}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="premium-panel premium-hairline rounded-[2.25rem] p-6 sm:p-8 lg:p-10">
          <div className="relative z-10">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">{hero?.eyebrow || copy.eyebrow}</p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{hero?.title || copy.title}</h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{hero?.body || copy.body}</p>
          </div>
        </section>

        <div className="mt-8 grid gap-4">
          {sections.map((section, index) => (
            <section key={section.title} className="premium-panel rounded-[1.5rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/30 sm:p-7">
              <div className="relative z-10">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent-gold">Policy {String(index + 1).padStart(2, '0')}</p>
                <h2 className="text-2xl font-semibold tracking-[-0.035em] text-text">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p>
                {section.items.length ? <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted">{section.items.map((item) => <li key={item}>• {item}</li>)}</ul> : null}
              </div>
            </section>
          ))}
          <section className="premium-panel rounded-[1.5rem] p-6 sm:p-7">
            <div className="relative z-10">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent-cyan">Contact</p>
              <h2 className="notranslate text-2xl font-semibold tracking-[-0.035em] text-text" translate="no">{global.brandName}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">For privacy questions or service-request updates, contact <span className="notranslate" translate="no">{global.brandName}</span> by phone at <span className="notranslate" translate="no">{global.phoneDisplay}</span> or use the request form on the contact page.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer locale={activeLocale} />
      <MobileStickyCta locale={activeLocale} phoneNumber={global.phonePrimary} />
    </div>
  )
}

function getLegalSections(blocks: SiteContentBlock[], fallback: Array<{ title: string; body: string }>) {
  const blockSections = blocks
    .filter((block) => block.slot.startsWith('section-'))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((block) => ({ title: block.title, body: block.body, items: block.items }))
    .filter((section) => section.title && section.body)

  if (blockSections.length) return blockSections
  return fallback.map((section) => ({ ...section, items: [] as string[] }))
}
