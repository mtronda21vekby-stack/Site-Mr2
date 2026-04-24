import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileStickyCta from '@/components/layout/MobileStickyCta'
import CinematicBackground from '@/components/layout/CinematicBackground'
import ContactSection from '@/components/sections/ContactSection'
import {
  getGlobalSettingsFromSource,
  getHomeContentFromSource,
} from '@/lib/content.server'

type Locale = 'en' | 'es' | 'ru'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const copy: Record<Locale, { eyebrow: string; title: string; intro: string; phone: string; serviceType: string; serviceValue: string; area: string; areaValue: string; sideTitle: string; sideText: string }> = {
  en: { eyebrow: 'Contact Planetlocksmiths', title: 'Request mobile automotive locksmith service', intro: 'Use the form below to send vehicle details, location, urgency, and the service needed. For urgent lockouts or active roadside situations, calling may be faster.', phone: 'Phone', serviceType: 'Service type', serviceValue: 'Mobile automotive locksmith', area: 'Common area', areaValue: 'Philadelphia, Pennsylvania and nearby coverage areas', sideTitle: 'What makes the request faster', sideText: 'Vehicle make, model, year, exact location, phone number, and key situation help create a cleaner callback and service path.' },
  es: { eyebrow: 'Contacto Planetlocksmiths', title: 'Solicitar servicio móvil de cerrajería automotriz', intro: 'Use el formulario para enviar datos del vehículo, ubicación, urgencia y servicio requerido. Para autos cerrados o situaciones de carretera, llamar puede ser más rápido.', phone: 'Teléfono', serviceType: 'Tipo de servicio', serviceValue: 'Cerrajería automotriz móvil', area: 'Área común', areaValue: 'Philadelphia, Pennsylvania y áreas cercanas', sideTitle: 'Qué acelera la solicitud', sideText: 'Marca, modelo, año, ubicación exacta, teléfono y situación de la llave ayudan a una respuesta más clara.' },
  ru: { eyebrow: 'Контакт Planetlocksmiths', title: 'Оставить заявку на мобильный автомобильный locksmith-сервис', intro: 'Используйте форму ниже, чтобы отправить данные автомобиля, локацию, срочность и нужную услугу. При срочном lockout или roadside-ситуации звонок может быть быстрее.', phone: 'Телефон', serviceType: 'Тип услуги', serviceValue: 'Мобильный автомобильный locksmith', area: 'Основная зона', areaValue: 'Philadelphia, Pennsylvania и ближайшие районы', sideTitle: 'Что ускоряет заявку', sideText: 'Марка, модель, год, точная локация, телефон и ситуация с ключом помогают быстрее обработать запрос.' },
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const labels = copy[locale]
  const [global, home] = await Promise.all([
    getGlobalSettingsFromSource(),
    getHomeContentFromSource(locale),
  ])

  return (
    <div className="cinematic-shell min-h-screen pb-20 text-text md:pb-0">
      <CinematicBackground />
      <Header locale={locale} phoneDisplay={global.phoneDisplay} phonePrimary={global.phonePrimary} />

      <main className="flex flex-col">
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="premium-panel premium-hairline relative mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2.25rem] p-6 sm:p-8 lg:grid-cols-[1fr_23rem] lg:items-end lg:p-10">
            <div className="absolute right-[-8rem] top-[-8rem] h-80 w-80 rounded-full border border-accent-blue/15" />
            <div className="absolute bottom-[-8rem] left-[-6rem] h-80 w-80 rounded-full bg-accent-gold/10 blur-3xl" />

            <div className="relative">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-accent-cyan">{labels.eyebrow}</p>
              <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{labels.title}</h1>
              <p className="mt-7 max-w-3xl text-base leading-8 text-muted sm:text-lg">{labels.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`tel:${global.phonePrimary}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110">{global.phoneDisplay}</a>
                <a href="#request-service" className="inline-flex min-h-12 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-accent-gold transition duration-300 hover:-translate-y-0.5 hover:bg-accent-gold/15">{home.heroSecondaryCta || labels.serviceType}</a>
              </div>
            </div>

            <aside className="premium-panel relative rounded-[1.5rem] p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-accent-gold">{labels.sideTitle}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{labels.sideText}</p>
            </aside>
          </div>

          <div className="mx-auto mt-6 grid max-w-7xl gap-3 sm:grid-cols-3">
            <div className="premium-panel rounded-2xl p-4"><h2 className="text-sm font-semibold text-text">{labels.phone}</h2><p className="mt-2 text-sm text-muted">{global.phoneDisplay}</p></div>
            <div className="premium-panel rounded-2xl p-4"><h2 className="text-sm font-semibold text-text">{labels.serviceType}</h2><p className="mt-2 text-sm text-muted">{labels.serviceValue}</p></div>
            <div className="premium-panel rounded-2xl p-4"><h2 className="text-sm font-semibold text-text">{labels.area}</h2><p className="mt-2 text-sm text-muted">{labels.areaValue}</p></div>
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
