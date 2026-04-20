import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import ServiceSchema from '@/components/seo/ServiceSchema'
import { getGlobalSettings, getHomeContent } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

type ServiceContent = {
  eyebrow: string
  title: string
  intro: string
  bullets: string[]
  processTitle: string
  process: string[]
  noteTitle: string
  note: string
  ctaTitle: string
  ctaText: string
  ctaPrimary: string
  ctaSecondary: string
  highlightsLabel: string
}

const content: Record<Locale, Record<string, ServiceContent>> = {
  en: {
    'car-lockout': {
      eyebrow: 'Mobile automotive locksmith',
      title: 'Car Lockout Service in Philadelphia',
      intro:
        'Fast mobile help when your vehicle is locked and the key is not accessible. Planetlocksmiths handles lockout requests across Philadelphia with clear communication and mobile dispatch.',
      bullets: [
        'Mobile response across Philadelphia.',
        'Urgent and same-day request handling based on availability.',
        'Clear communication from intake to arrival.',
      ],
      processTitle: 'How this service usually works',
      process: [
        'You send your location, vehicle make/model, and the issue.',
        'The request is reviewed and service availability is confirmed.',
        'A mobile visit is arranged if the request fits current coverage and scheduling.',
      ],
      noteTitle: 'What helps us review faster',
      note:
        'Your exact location, vehicle make/model, and whether the key is inside the car or not.',
      ctaTitle: 'Need mobile lockout help?',
      ctaText:
        'Call for urgent requests or send a service request with your location and vehicle details.',
      ctaPrimary: 'Call now',
      ctaSecondary: 'Request service',
      highlightsLabel: 'Service highlights',
    },
    'car-key-replacement': {
      eyebrow: 'Mobile automotive locksmith',
      title: 'Car Key Replacement in Philadelphia',
      intro:
        'Replacement solutions for lost, broken, or damaged car keys. Mobile service is available across Philadelphia depending on the vehicle and request type.',
      bullets: [
        'Support for lost and damaged key scenarios.',
        'Mobile service to your location.',
        'Vehicle details help confirm compatibility before dispatch.',
      ],
      processTitle: 'How this service usually works',
      process: [
        'You submit your vehicle information and describe the key issue.',
        'The request is reviewed for service fit and availability.',
        'Mobile service is scheduled if the request can be handled on-site.',
      ],
      noteTitle: 'What helps us review faster',
      note:
        'Vehicle year, make, model, and whether you still have an existing working key.',
      ctaTitle: 'Need a replacement key?',
      ctaText:
        'Send the vehicle details with your location so the request can be reviewed accurately.',
      ctaPrimary: 'Call now',
      ctaSecondary: 'Request service',
      highlightsLabel: 'Service highlights',
    },
    'key-programming': {
      eyebrow: 'Mobile automotive locksmith',
      title: 'Car Key Programming in Philadelphia',
      intro:
        'Programming support for many modern vehicle keys, remotes, and fobs. This service is mobile and focused on automotive requests across Philadelphia.',
      bullets: [
        'Support for many modern key and remote systems.',
        'Mobile programming service for compatible vehicles.',
        'Same-day availability may be possible depending on workload.',
      ],
      processTitle: 'How this service usually works',
      process: [
        'You send the vehicle details and explain what needs programming.',
        'Compatibility and service fit are reviewed.',
        'A mobile service visit is arranged if supported.',
      ],
      noteTitle: 'What helps us review faster',
      note:
        'Vehicle year, make, model, and whether this is a new key, spare key, or fob issue.',
      ctaTitle: 'Need programming support?',
      ctaText:
        'Send the vehicle information and the exact issue to speed up request review.',
      ctaPrimary: 'Call now',
      ctaSecondary: 'Request service',
      highlightsLabel: 'Service highlights',
    },
    'key-fob-services': {
      eyebrow: 'Mobile automotive locksmith',
      title: 'Key Fob Services in Philadelphia',
      intro:
        'Help with key fob access issues, replacement needs, and related automotive access support.',
      bullets: [
        'Mobile help for common fob-related access problems.',
        'Philadelphia coverage with mobile dispatch.',
        'Request review depends on the vehicle and issue type.',
      ],
      processTitle: 'How this service usually works',
      process: [
        'You describe the fob issue and provide vehicle details.',
        'The request is reviewed for compatibility and availability.',
        'Mobile service is arranged if the job fits current coverage.',
      ],
      noteTitle: 'What helps us review faster',
      note:
        'Whether the issue is battery-related, access-related, damage-related, or replacement-related.',
      ctaTitle: 'Need key fob help?',
      ctaText:
        'Include your vehicle information and a clear description of the issue.',
      ctaPrimary: 'Call now',
      ctaSecondary: 'Request service',
      highlightsLabel: 'Service highlights',
    },
    'ignition-key-issues': {
      eyebrow: 'Mobile automotive locksmith',
      title: 'Ignition Key Issues in Philadelphia',
      intro:
        'Support for ignition-related key problems and access issues tied to the vehicle key system.',
      bullets: [
        'Review of common ignition-related key issues.',
        'Mobile service where the request fits field support.',
        'Urgent service depends on current availability.',
      ],
      processTitle: 'How this service usually works',
      process: [
        'You describe the ignition issue and provide vehicle details.',
        'The request is reviewed for field-service fit.',
        'A mobile visit is scheduled if the case can be supported on-site.',
      ],
      noteTitle: 'What helps us review faster',
      note:
        'Tell us whether the key is stuck, not turning, damaged, or causing access/start issues.',
      ctaTitle: 'Need help with ignition-related key issues?',
      ctaText:
        'Send the vehicle details and a short description of the problem for faster review.',
      ctaPrimary: 'Call now',
      ctaSecondary: 'Request service',
      highlightsLabel: 'Service highlights',
    },
    'emergency-mobile-service': {
      eyebrow: 'Mobile automotive locksmith',
      title: 'Emergency Mobile Locksmith Service in Philadelphia',
      intro:
        '24/7 mobile response for urgent automotive key and lock situations across Philadelphia.',
      bullets: [
        'Urgent request intake available 24/7.',
        'Mobile-only support across Philadelphia.',
        'Same-day help depends on active demand and routing.',
      ],
      processTitle: 'How this service usually works',
      process: [
        'You call or submit an urgent request.',
        'Location, vehicle details, and issue are reviewed immediately.',
        'Mobile dispatch is arranged if service is available.',
      ],
      noteTitle: 'What helps us review faster',
      note:
        'Exact location, vehicle make/model, and whether this is a lockout, lost key, programming, or ignition-related issue.',
      ctaTitle: 'Need urgent automotive help?',
      ctaText:
        'Call directly for urgent requests or send your details through the service form.',
      ctaPrimary: 'Call now',
      ctaSecondary: 'Request service',
      highlightsLabel: 'Service highlights',
    },
  },
  es: {
    'car-lockout': {
      eyebrow: 'Cerrajería automotriz móvil',
      title: 'Apertura de auto en Filadelfia',
      intro:
        'Ayuda móvil rápida cuando el vehículo está cerrado y no tienes acceso a la llave.',
      bullets: [
        'Respuesta móvil en Filadelfia.',
        'Solicitudes urgentes y el mismo día según disponibilidad.',
        'Comunicación clara desde la solicitud hasta la llegada.',
      ],
      processTitle: 'Cómo suele funcionar',
      process: [
        'Envías ubicación, marca/modelo del vehículo y el problema.',
        'Se revisa la solicitud y la disponibilidad.',
        'Se agenda la visita móvil si el caso encaja con la cobertura actual.',
      ],
      noteTitle: 'Qué ayuda a revisar más rápido',
      note:
        'Tu ubicación exacta, marca/modelo del vehículo y si la llave quedó dentro del auto.',
      ctaTitle: '¿Necesitas ayuda para abrir tu auto?',
      ctaText:
        'Llama para solicitudes urgentes o envía tu ubicación y datos del vehículo.',
      ctaPrimary: 'Llamar ahora',
      ctaSecondary: 'Solicitar servicio',
      highlightsLabel: 'Puntos clave del servicio',
    },
    'car-key-replacement': {
      eyebrow: 'Cerrajería automotriz móvil',
      title: 'Reemplazo de llave de auto en Filadelfia',
      intro:
        'Soluciones para llaves perdidas, rotas o dañadas con servicio móvil según el vehículo y la solicitud.',
      bullets: [
        'Soporte para escenarios comunes de reemplazo.',
        'Servicio móvil hasta tu ubicación.',
        'Los datos del vehículo ayudan a confirmar compatibilidad.',
      ],
      processTitle: 'Cómo suele funcionar',
      process: [
        'Envías la información del vehículo y el problema.',
        'Se revisa compatibilidad y disponibilidad.',
        'Se agenda visita móvil si el caso puede resolverse en sitio.',
      ],
      noteTitle: 'Qué ayuda a revisar más rápido',
      note:
        'Año, marca, modelo y si aún tienes una llave funcional.',
      ctaTitle: '¿Necesitas reemplazo de llave?',
      ctaText:
        'Envía los datos del vehículo y la ubicación para revisar correctamente la solicitud.',
      ctaPrimary: 'Llamar ahora',
      ctaSecondary: 'Solicitar servicio',
      highlightsLabel: 'Puntos clave del servicio',
    },
    'key-programming': {
      eyebrow: 'Cerrajería automotriz móvil',
      title: 'Programación de llave en Filadelfia',
      intro:
        'Programación para muchas llaves, controles y fobs modernos con servicio móvil automotriz.',
      bullets: [
        'Soporte para muchos sistemas modernos.',
        'Servicio móvil para vehículos compatibles.',
        'La disponibilidad el mismo día depende de la carga de trabajo.',
      ],
      processTitle: 'Cómo suele funcionar',
      process: [
        'Envías la información del vehículo y lo que necesitas programar.',
        'Se revisa compatibilidad y alcance del trabajo.',
        'Se agenda visita móvil si el vehículo es compatible.',
      ],
      noteTitle: 'Qué ayuda a revisar más rápido',
      note:
        'Año, marca, modelo y si se trata de una llave nueva, copia o problema de fob.',
      ctaTitle: '¿Necesitas programación?',
      ctaText:
        'Comparte la información del vehículo y el problema exacto.',
      ctaPrimary: 'Llamar ahora',
      ctaSecondary: 'Solicitar servicio',
      highlightsLabel: 'Puntos clave del servicio',
    },
    'key-fob-services': {
      eyebrow: 'Cerrajería automotriz móvil',
      title: 'Servicios de key fob en Filadelfia',
      intro:
        'Ayuda con problemas de acceso, reemplazo y soporte relacionado con key fobs automotrices.',
      bullets: [
        'Ayuda móvil para problemas comunes de acceso.',
        'Cobertura en Filadelfia.',
        'La solicitud se revisa según vehículo y tipo de problema.',
      ],
      processTitle: 'Cómo suele funcionar',
      process: [
        'Describes el problema y compartes los datos del vehículo.',
        'Se revisa compatibilidad y disponibilidad.',
        'Se agenda visita móvil si aplica.',
      ],
      noteTitle: 'Qué ayuda a revisar más rápido',
      note:
        'Aclarar si el problema es de acceso, daño, batería o reemplazo.',
      ctaTitle: '¿Necesitas ayuda con tu key fob?',
      ctaText:
        'Envía la información del vehículo y una descripción clara del problema.',
      ctaPrimary: 'Llamar ahora',
      ctaSecondary: 'Solicitar servicio',
      highlightsLabel: 'Puntos clave del servicio',
    },
    'ignition-key-issues': {
      eyebrow: 'Cerrajería automotriz móvil',
      title: 'Problemas con llave de encendido en Filadelfia',
      intro:
        'Soporte para problemas de llave relacionados con encendido y acceso del vehículo.',
      bullets: [
        'Revisión de problemas comunes relacionados con encendido.',
        'Servicio móvil cuando aplica.',
        'La atención urgente depende de disponibilidad.',
      ],
      processTitle: 'Cómo suele funcionar',
      process: [
        'Explicas el problema y compartes los datos del vehículo.',
        'Se revisa si el caso puede atenderse en campo.',
        'Se agenda visita si la solicitud encaja con el servicio.',
      ],
      noteTitle: 'Qué ayuda a revisar más rápido',
      note:
        'Indica si la llave no gira, se queda atascada, está dañada o causa problemas de arranque.',
      ctaTitle: '¿Necesitas ayuda con la llave de encendido?',
      ctaText:
        'Comparte el problema y los datos del vehículo para revisar rápido el caso.',
      ctaPrimary: 'Llamar ahora',
      ctaSecondary: 'Solicitar servicio',
      highlightsLabel: 'Puntos clave del servicio',
    },
    'emergency-mobile-service': {
      eyebrow: 'Cerrajería automotriz móvil',
      title: 'Servicio móvil urgente en Filadelfia',
      intro:
        'Respuesta móvil 24/7 para situaciones urgentes con llaves y cerraduras automotrices.',
      bullets: [
        'Recepción de solicitudes urgentes 24/7.',
        'Servicio solo móvil en Filadelfia.',
        'La ayuda el mismo día depende de la demanda activa.',
      ],
      processTitle: 'Cómo suele funcionar',
      process: [
        'Llamas o envías una solicitud urgente.',
        'Se revisan ubicación, vehículo y problema.',
        'Se organiza el envío móvil si hay disponibilidad.',
      ],
      noteTitle: 'Qué ayuda a revisar más rápido',
      note:
        'Ubicación exacta, marca/modelo del vehículo y tipo de problema principal.',
      ctaTitle: '¿Necesitas ayuda urgente?',
      ctaText:
        'Llama directamente o envía tu ubicación y datos del vehículo.',
      ctaPrimary: 'Llamar ahora',
      ctaSecondary: 'Solicitar servicio',
      highlightsLabel: 'Puntos clave del servicio',
    },
  },
  ru: {
    'car-lockout': {
      eyebrow: 'Мобильный автомобильный сервис',
      title: 'Открытие автомобиля в Филадельфии',
      intro:
        'Быстрая мобильная помощь, когда автомобиль закрыт и доступа к ключу нет.',
      bullets: [
        'Выезд по Филадельфии.',
        'Срочные и same-day заявки по возможности.',
        'Понятная коммуникация от заявки до приезда.',
      ],
      processTitle: 'Как обычно проходит услуга',
      process: [
        'Ты отправляешь локацию, марку/модель и описание проблемы.',
        'Заявка проверяется по доступности и типу работ.',
        'Если сервис подходит, согласовывается мобильный выезд.',
      ],
      noteTitle: 'Что помогает быстрее принять заявку',
      note:
        'Точная локация, марка/модель автомобиля и информация о том, внутри ли ключ.',
      ctaTitle: 'Нужно открыть машину?',
      ctaText:
        'Для срочных заявок звони напрямую или отправь локацию и данные автомобиля.',
      ctaPrimary: 'Позвонить',
      ctaSecondary: 'Оставить заявку',
      highlightsLabel: 'Ключевые преимущества',
    },
    'car-key-replacement': {
      eyebrow: 'Мобильный автомобильный сервис',
      title: 'Замена ключа автомобиля в Филадельфии',
      intro:
        'Решения для утерянных, сломанных или поврежденных ключей с выездным сервисом по Филадельфии.',
      bullets: [
        'Поддержка типовых сценариев замены.',
        'Выезд к клиенту.',
        'Данные автомобиля помогают заранее понять совместимость.',
      ],
      processTitle: 'Как обычно проходит услуга',
      process: [
        'Ты отправляешь информацию по автомобилю и описываешь проблему.',
        'Проверяется доступность и применимость сервиса.',
        'Если задача подходит, согласовывается выезд.',
      ],
      noteTitle: 'Что помогает быстрее принять заявку',
      note:
        'Год, марка, модель и наличие рабочего ключа, если он есть.',
      ctaTitle: 'Нужна замена ключа?',
      ctaText:
        'Отправь данные автомобиля и локацию, чтобы заявка была оценена быстрее.',
      ctaPrimary: 'Позвонить',
      ctaSecondary: 'Оставить заявку',
      highlightsLabel: 'Ключевые преимущества',
    },
    'key-programming': {
      eyebrow: 'Мобильный автомобильный сервис',
      title: 'Программирование ключа в Филадельфии',
      intro:
        'Поддержка программирования для современных ключей, брелоков и пультов с выездом по Филадельфии.',
      bullets: [
        'Работа с современными автомобильными системами.',
        'Выездной сервис для совместимых автомобилей.',
        'Same-day заявки — по текущей загрузке.',
      ],
      processTitle: 'Как обычно проходит услуга',
      process: [
        'Ты присылаешь данные автомобиля и суть задачи.',
        'Проверяется совместимость и формат работы.',
        'При подтверждении согласовывается выезд.',
      ],
      noteTitle: 'Что помогает быстрее принять заявку',
      note:
        'Год, марка, модель и уточнение: новый ключ, запасной ключ или проблема с брелоком.',
      ctaTitle: 'Нужно программирование?',
      ctaText:
        'Отправь точные данные автомобиля и короткое описание задачи.',
      ctaPrimary: 'Позвонить',
      ctaSecondary: 'Оставить заявку',
      highlightsLabel: 'Ключевые преимущества',
    },
    'key-fob-services': {
      eyebrow: 'Мобильный автомобильный сервис',
      title: 'Услуги по брелокам в Филадельфии',
      intro:
        'Помощь с проблемами доступа, заменой и задачами, связанными с автомобильными брелоками.',
      bullets: [
        'Выездная помощь по типовым проблемам с доступом.',
        'Покрытие по Филадельфии.',
        'Заявка рассматривается по автомобилю и типу проблемы.',
      ],
      processTitle: 'Как обычно проходит услуга',
      process: [
        'Ты описываешь проблему и указываешь данные автомобиля.',
        'Проверяется совместимость и доступность сервиса.',
        'Если кейс подходит, согласовывается выезд.',
      ],
      noteTitle: 'Что помогает быстрее принять заявку',
      note:
        'Уточни, это проблема доступа, повреждения, батарейки или замены брелока.',
      ctaTitle: 'Нужна помощь с брелоком?',
      ctaText:
        'Пришли данные автомобиля и ясное описание проблемы.',
      ctaPrimary: 'Позвонить',
      ctaSecondary: 'Оставить заявку',
      highlightsLabel: 'Ключевые преимущества',
    },
    'ignition-key-issues': {
      eyebrow: 'Мобильный автомобильный сервис',
      title: 'Проблемы с ключом зажигания в Филадельфии',
      intro:
        'Помощь при проблемах с ключом, связанным с зажиганием и доступом автомобиля.',
      bullets: [
        'Разбор типовых проблем с зажиганием.',
        'Выездной сервис там, где это возможно.',
        'Срочный сервис зависит от текущей загрузки.',
      ],
      processTitle: 'Как обычно проходит услуга',
      process: [
        'Ты описываешь проблему и отправляешь данные автомобиля.',
        'Проверяется, подходит ли кейс под выездной формат.',
        'Если подходит, согласовывается выезд.',
      ],
      noteTitle: 'Что помогает быстрее принять заявку',
      note:
        'Напиши, если ключ застрял, не проворачивается, поврежден или вызывает проблемы запуска.',
      ctaTitle: 'Нужна помощь с ключом зажигания?',
      ctaText:
        'Отправь данные автомобиля и короткое описание проблемы.',
      ctaPrimary: 'Позвонить',
      ctaSecondary: 'Оставить заявку',
      highlightsLabel: 'Ключевые преимущества',
    },
    'emergency-mobile-service': {
      eyebrow: 'Мобильный автомобильный сервис',
      title: 'Срочный мобильный сервис в Филадельфии',
      intro:
        'Мобильный ответ 24/7 для срочных ситуаций с автомобильными ключами и замками.',
      bullets: [
        'Прием срочных заявок 24/7.',
        'Только выездной формат по Филадельфии.',
        'Same-day помощь зависит от текущего спроса.',
      ],
      processTitle: 'Как обычно проходит услуга',
      process: [
        'Ты звонишь или отправляешь срочную заявку.',
        'Проверяются локация, автомобиль и суть проблемы.',
        'Если доступно, организуется мобильный выезд.',
      ],
      noteTitle: 'Что помогает быстрее принять заявку',
      note:
        'Точная локация, марка/модель автомобиля и тип основной проблемы.',
      ctaTitle: 'Нужна срочная помощь?',
      ctaText:
        'Звони напрямую или отправляй заявку с локацией и данными автомобиля.',
      ctaPrimary: 'Позвонить',
      ctaSecondary: 'Оставить заявку',
      highlightsLabel: 'Ключевые преимущества',
    },
  },
}

export async function generateStaticParams() {
  const locales: Array<Locale> = ['en', 'es', 'ru']
  const params: Array<{ locale: string; slug: string }> = []

  for (const locale of locales) {
    const home = getHomeContent(locale)
    home.featuredServices.forEach((service) => {
      params.push({ locale, slug: service.slug })
    })
  }

  return params
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const page = content[locale]?.[slug]
  const fallback = getHomeContent(locale).featuredServices.find((item) => item.slug === slug)

  const title = page?.title || fallback?.title || 'Automotive Locksmith Service'
  const description =
    page?.intro ||
    fallback?.excerpt ||
    'Mobile automotive locksmith support across Philadelphia.'

  return {
    title: `${title} | Planetlocksmiths`,
    description,
    alternates: {
      canonical: `/${locale}/services/${slug}`,
    },
    openGraph: {
      title: `${title} | Planetlocksmiths`,
      description,
      url: `/${locale}/services/${slug}`,
      type: 'article',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'Planetlocksmiths',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Planetlocksmiths`,
      description,
      images: ['/opengraph-image'],
    },
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const global = getGlobalSettings()
  const page = content[locale]?.[slug]
  const fallback = getHomeContent(locale).featuredServices.find((item) => item.slug === slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const serviceUrl = `${siteUrl}/${locale}/services/${slug}`

  return (
    <>
      {page ? (
        <>
          <BreadcrumbSchema
            items={[
              { name: 'Home', url: `${siteUrl}/${locale}` },
              { name: 'Services', url: `${siteUrl}/${locale}/services` },
              { name: page.title, url: serviceUrl },
            ]}
          />
          <ServiceSchema
            name={page.title}
            description={page.intro}
            url={serviceUrl}
            areaServed="Philadelphia"
          />
        </>
      ) : null}

      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-6xl px-4 py-16 text-text sm:px-6 lg:px-8">
        {page ? (
          <>
            <div className="mb-10 max-w-4xl">
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-accent-cyan">
                {page.eyebrow}
              </p>
              <h1 className="mb-4 text-3xl font-heading font-semibold md:text-5xl">
                {page.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted">{page.intro}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-2xl border border-line bg-surface p-6 md:p-8">
                <h2 className="mb-5 text-xl font-semibold">{page.highlightsLabel}</h2>
                <ul className="space-y-4">
                  {page.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-7 text-muted">
                      <span className="mt-2 h-2 w-2 rounded-full bg-accent-blue" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-line bg-surface-2 p-6 md:p-8">
                <h2 className="mb-5 text-xl font-semibold">{page.processTitle}</h2>
                <ol className="space-y-4">
                  {page.process.map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-sm text-text">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-7 text-muted">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <section className="mt-8 rounded-2xl border border-line bg-surface p-6 md:p-8">
              <h2 className="mb-3 text-xl font-semibold">{page.noteTitle}</h2>
              <p className="text-sm leading-7 text-muted">{page.note}</p>
            </section>

            <section className="mt-8 rounded-2xl border border-accent-blue/30 bg-gradient-to-br from-surface to-surface-2 p-6 md:p-8">
              <h2 className="mb-3 text-2xl font-heading font-semibold">{page.ctaTitle}</h2>
              <p className="mb-6 max-w-2xl text-sm leading-7 text-muted">{page.ctaText}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${global.phonePrimary}`}
                  className="rounded-full bg-accent-blue px-6 py-3 text-center text-sm font-medium text-black transition-colors hover:brightness-110"
                >
                  {page.ctaPrimary}
                </a>
                <Link
                  href={`/${locale}/contact`}
                  className="rounded-full border border-line px-6 py-3 text-center text-sm text-text transition-colors hover:bg-white/5"
                >
                  {page.ctaSecondary}
                </Link>
              </div>
            </section>
          </>
        ) : fallback ? (
          <>
            <h1 className="mb-4 text-3xl font-heading font-semibold">{fallback.title}</h1>
            <p className="text-muted">{fallback.excerpt}</p>
          </>
        ) : (
          <p className="text-muted">Service not found.</p>
        )}
      </main>
      <Footer locale={locale} />
    </>
  )
}
