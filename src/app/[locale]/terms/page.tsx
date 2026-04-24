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
  en: {
    eyebrow: 'Customer information',
    title: 'Terms of Service',
    body: 'These terms explain the basic conditions for using this website and submitting a mobile automotive locksmith service request to Planetlocksmiths.',
    sections: [
      { title: 'Website use', body: 'This website provides information about automotive locksmith services and allows customers to submit service requests. You agree to provide accurate contact, vehicle, and location details when requesting service.' },
      { title: 'Service availability', body: 'Submitting a request does not guarantee immediate availability, dispatch, price, or completion of service. Availability depends on location, vehicle type, parts, technician availability, timing, and job complexity.' },
      { title: 'Pricing and estimates', body: 'Any estimate may depend on vehicle make, model, year, key type, programming requirements, lock condition, distance, emergency timing, and parts availability. Final pricing should be confirmed before work begins.' },
      { title: 'Vehicle ownership and authorization', body: 'Customers may be asked to confirm authorization to access or service a vehicle. Service may be declined if ownership, authorization, safety, or legal concerns cannot be reasonably resolved.' },
      { title: 'No misuse', body: 'You may not use this website to submit false requests, interfere with website operation, impersonate others, or request service for a vehicle you are not authorized to access.' },
    ],
  },
  es: {
    eyebrow: 'Información del cliente',
    title: 'Términos de servicio',
    body: 'Estos términos explican las condiciones básicas para usar este sitio y enviar una solicitud móvil de cerrajería automotriz a Planetlocksmiths.',
    sections: [
      { title: 'Uso del sitio', body: 'Este sitio ofrece información sobre servicios automotrices y permite enviar solicitudes. Usted acepta proporcionar datos correctos de contacto, vehículo y ubicación.' },
      { title: 'Disponibilidad del servicio', body: 'Enviar una solicitud no garantiza disponibilidad inmediata, despacho, precio o finalización. La disponibilidad depende de ubicación, vehículo, piezas, técnico, horario y complejidad.' },
      { title: 'Precios y estimados', body: 'Todo estimado puede depender de marca, modelo, año, tipo de llave, programación, condición de cerradura, distancia, urgencia y piezas. El precio final debe confirmarse antes del trabajo.' },
      { title: 'Propiedad y autorización', body: 'Puede solicitarse confirmación de autorización para acceder o trabajar en un vehículo. El servicio puede rechazarse si hay dudas legales, de seguridad o autorización.' },
      { title: 'No uso indebido', body: 'No puede usar el sitio para solicitudes falsas, interferir con el sitio, suplantar personas o pedir servicio para un vehículo sin autorización.' },
    ],
  },
  ru: {
    eyebrow: 'Информация клиенту',
    title: 'Условия сервиса',
    body: 'Эти условия объясняют базовые правила использования сайта и отправки мобильной автомобильной locksmith-заявки в Planetlocksmiths.',
    sections: [
      { title: 'Использование сайта', body: 'Сайт предоставляет информацию об автомобильных locksmith-услугах и позволяет отправлять заявки. Клиент должен указывать корректные контактные данные, авто и локацию.' },
      { title: 'Доступность услуги', body: 'Отправка заявки не гарантирует мгновенную доступность, выезд, цену или выполнение. Всё зависит от локации, авто, деталей, доступности техника, времени и сложности.' },
      { title: 'Цены и оценки', body: 'Любая оценка зависит от марки, модели, года, типа ключа, программирования, состояния замка, расстояния, срочности и деталей. Финальная цена подтверждается до начала работы.' },
      { title: 'Право доступа и авторизация', body: 'Клиенту может потребоваться подтвердить право доступа или обслуживания автомобиля. Услуга может быть отклонена при юридических или safety-сомнениях.' },
      { title: 'Запрет злоупотреблений', body: 'Нельзя использовать сайт для ложных заявок, вмешательства в работу сайта, выдачи себя за других или запроса услуги без права доступа к авто.' },
    ],
  },
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const [global, blocks] = await Promise.all([
    getGlobalSettingsFromSource(),
    getContentBlocksFromSource(locale, 'legal-terms'),
  ])

  const copy = fallbackCopy[locale]
  const hero = blocks.find((block) => block.slot === 'hero')
  const sections = getLegalSections(blocks, copy.sections)

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-accent-cyan">{hero?.eyebrow || copy.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{hero?.title || copy.title}</h1>
        <p className="mt-5 text-sm leading-7 text-muted">{hero?.body || copy.body}</p>
        <div className="mt-10 space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-text">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p>
              {section.items.length ? (
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted">
                  {section.items.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
          <section>
            <h2 className="text-xl font-semibold text-text">Contact</h2>
            <p className="mt-3 text-sm leading-7 text-muted">For questions about a request or these terms, contact Planetlocksmiths by phone at {global.phoneDisplay}.</p>
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
