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

export const dynamic = 'force-dynamic'
export const revalidate = 0

const fallbackCopy: Record<Locale, { eyebrow: string; title: string; body: string; sections: Array<{ title: string; body: string }> }> = {
  en: { eyebrow: 'Customer information', title: 'Privacy Policy', body: 'This page explains how Planetlocksmiths handles information submitted through this website for mobile automotive locksmith service requests.', sections: [{ title: 'Information we collect', body: 'When you submit a service request, we may collect your name, phone number, email address, requested service, vehicle make/model/year, service location, urgency, preferred time, and message details. This information is used to respond to your request and understand the service needed.' }, { title: 'How we use information', body: 'Submitted information is used to contact you, review your automotive locksmith request, help estimate the required tools or parts, coordinate service availability, and improve customer communication.' }, { title: 'Sharing information', body: 'We do not sell customer request information. Information may be shared only when needed to process a service request, comply with law, protect rights and safety, or operate website infrastructure and customer communication systems.' }, { title: 'Security', body: 'We use reasonable technical and organizational measures to protect submitted information. No website or internet transmission can be guaranteed completely secure.' }, { title: 'Customer choices', body: 'You may contact us to ask about a service request, correct information, or request deletion of submitted request details where legally and operationally appropriate.' }] },
  es: { eyebrow: 'Información del cliente', title: 'Política de privacidad', body: 'Esta página explica cómo Planetlocksmiths maneja la información enviada a través del sitio para solicitudes móviles de cerrajería automotriz.', sections: [{ title: 'Información que recopilamos', body: 'Cuando envía una solicitud, podemos recopilar nombre, teléfono, email, servicio solicitado, vehículo, ubicación, urgencia, horario preferido y mensaje.' }, { title: 'Cómo usamos la información', body: 'La información se usa para contactarlo, revisar la solicitud, estimar herramientas o piezas, coordinar disponibilidad y mejorar la comunicación.' }, { title: 'Compartir información', body: 'No vendemos información de solicitudes. Puede compartirse solo cuando sea necesario para procesar servicio, cumplir la ley, proteger derechos o operar sistemas.' }, { title: 'Seguridad', body: 'Usamos medidas razonables para proteger información enviada. Ningún sitio o transmisión por internet puede garantizar seguridad absoluta.' }, { title: 'Opciones del cliente', body: 'Puede contactarnos para preguntar sobre una solicitud, corregir información o pedir eliminación cuando sea apropiado legal y operativamente.' }] },
  ru: { eyebrow: 'Информация клиенту', title: 'Политика приватности', body: 'Эта страница объясняет, как Planetlocksmiths обрабатывает информацию, отправленную через сайт для мобильных автомобильных locksmith-заявок.', sections: [{ title: 'Какую информацию мы собираем', body: 'При отправке заявки мы можем получать имя, телефон, email, услугу, данные автомобиля, локацию, срочность, желаемое время и сообщение.' }, { title: 'Как используется информация', body: 'Информация используется для связи, проверки заявки, оценки инструментов или деталей, координации доступности и коммуникации.' }, { title: 'Передача информации', body: 'Мы не продаём данные заявок. Информация может передаваться только для обработки услуги, соблюдения закона, защиты прав или работы систем.' }, { title: 'Безопасность', body: 'Мы используем разумные меры защиты. Ни один сайт или интернет-передача не может гарантировать абсолютную безопасность.' }, { title: 'Выбор клиента', body: 'Вы можете связаться с нами по вопросам заявки, исправления данных или удаления информации, где это уместно юридически и операционно.' }] },
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const [global, blocks] = await Promise.all([
    getGlobalSettingsFromSource(),
    getContentBlocksFromSource(locale, 'legal-privacy'),
  ])

  const copy = fallbackCopy[locale]
  const hero = blocks.find((block) => block.slot === 'hero')
  const sections = getLegalSections(blocks, copy.sections)

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="premium-panel premium-hairline relative overflow-hidden rounded-[2.25rem] p-6 sm:p-8 lg:p-10">
          <div className="absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full border border-accent-blue/15" />
          <div className="absolute bottom-[-8rem] left-[-6rem] h-80 w-80 rounded-full bg-accent-gold/10 blur-3xl" />
          <div className="relative">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">{hero?.eyebrow || copy.eyebrow}</p>
            <h1 className="text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{hero?.title || copy.title}</h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{hero?.body || copy.body}</p>
          </div>
        </section>

        <div className="mt-8 grid gap-4">
          {sections.map((section, index) => (
            <section key={section.title} className="premium-panel rounded-[1.5rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-accent-blue/30 sm:p-7">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent-gold">Policy {String(index + 1).padStart(2, '0')}</p>
              <h2 className="text-2xl font-semibold tracking-[-0.035em] text-text">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p>
              {section.items.length ? <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted">{section.items.map((item) => <li key={item}>• {item}</li>)}</ul> : null}
            </section>
          ))}
          <section className="premium-panel rounded-[1.5rem] p-6 sm:p-7">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-accent-cyan">Contact</p>
            <h2 className="text-2xl font-semibold tracking-[-0.035em] text-text">Planetlocksmiths</h2>
            <p className="mt-3 text-sm leading-7 text-muted">For privacy questions or service-request updates, contact Planetlocksmiths by phone at {global.phoneDisplay} or use the request form on the contact page.</p>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
      <MobileStickyCta locale={locale} phoneNumber={global.phonePrimary} />
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
