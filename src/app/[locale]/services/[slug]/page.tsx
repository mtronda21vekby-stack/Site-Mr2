import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getGlobalSettings, getHomeContent } from '@/lib/content'

type Locale = 'en' | 'es' | 'ru'

type ServiceCopy = {
  title: string
  intro: string
  points: string[]
  closing: string
}

const serviceCopy: Record<Locale, Record<string, ServiceCopy>> = {
  en: {
    'car-lockout': {
      title: 'Car Lockout Service',
      intro:
        'Fast mobile help when your vehicle is locked and the key is not accessible.',
      points: [
        'Mobile response across Philadelphia.',
        'Clear communication from request to arrival.',
        'Support for urgent and same-day availability based on scheduling.',
      ],
      closing:
        'If you are locked out and need mobile automotive help, contact Planetlocksmiths for service availability.',
    },
    'car-key-replacement': {
      title: 'Car Key Replacement',
      intro:
        'Replacement solutions for lost, broken, or damaged automotive keys.',
      points: [
        'Support for many common replacement scenarios.',
        'Mobile service to your location.',
        'Vehicle details help confirm service requirements before dispatch.',
      ],
      closing:
        'If your key is lost or damaged, request service and include your vehicle make, model, and location.',
    },
    'key-programming': {
      title: 'Key Programming',
      intro:
        'Programming support for many modern vehicle keys, remotes, and fobs.',
      points: [
        'Automotive-focused programming support.',
        'Mobile service for compatible vehicles.',
        'Same-day requests may be available depending on scheduling.',
      ],
      closing:
        'For programming requests, include your vehicle information so the job can be reviewed properly.',
    },
    'key-fob-services': {
      title: 'Key Fob Services',
      intro:
        'Help with key fob access issues, replacement needs, and related support.',
      points: [
        'Mobile help for access-related fob issues.',
        'Service based on vehicle type and request details.',
        'Philadelphia coverage with mobile dispatch.',
      ],
      closing:
        'If your key fob is not working correctly, send your vehicle details and the issue you are seeing.',
    },
    'ignition-key-issues': {
      title: 'Ignition Key Issues',
      intro:
        'Support for ignition-related key problems and access issues connected to the vehicle key system.',
      points: [
        'Review of common ignition-related key problems.',
        'Mobile service where applicable.',
        'Urgent service may be available depending on current load.',
      ],
      closing:
        'Describe the ignition issue and your vehicle details when requesting service so the case can be reviewed accurately.',
    },
    'emergency-mobile-service': {
      title: 'Emergency Mobile Service',
      intro:
        '24/7 mobile response for urgent automotive key and lock situations.',
      points: [
        'Urgent request intake available 24/7.',
        'Mobile-only service across Philadelphia.',
        'Same-day support may be available depending on demand.',
      ],
      closing:
        'For urgent help, call directly or submit your request with location and vehicle details.',
    },
  },
  es: {
    'car-lockout': {
      title: 'Apertura de auto',
      intro:
        'Ayuda móvil rápida cuando el vehículo está cerrado y no tienes acceso a la llave.',
      points: [
        'Respuesta móvil en Filadelfia.',
        'Comunicación clara desde la solicitud hasta la llegada.',
        'Atención urgente o el mismo día según agenda.',
      ],
      closing:
        'Si no puedes abrir tu auto, contacta a Planetlocksmiths para confirmar disponibilidad.',
    },
    'car-key-replacement': {
      title: 'Reemplazo de llave de auto',
      intro:
        'Soluciones para llaves automotrices perdidas, rotas o dañadas.',
      points: [
        'Soporte para escenarios comunes de reemplazo.',
        'Servicio móvil hasta tu ubicación.',
        'Los datos del vehículo ayudan a validar el servicio antes del envío.',
      ],
      closing:
        'Si perdiste tu llave o está dañada, envía la marca, modelo y ubicación del vehículo.',
    },
    'key-programming': {
      title: 'Programación de llave',
      intro:
        'Programación para muchas llaves, controles y fobs modernos.',
      points: [
        'Soporte enfocado en automóviles.',
        'Servicio móvil para vehículos compatibles.',
        'Las solicitudes el mismo día dependen de disponibilidad.',
      ],
      closing:
        'Para programación, incluye la información del vehículo para revisar el trabajo correctamente.',
    },
    'key-fob-services': {
      title: 'Servicios de key fob',
      intro:
        'Ayuda con problemas de acceso, reemplazo y soporte relacionado con key fobs.',
      points: [
        'Asistencia móvil para problemas de acceso.',
        'Servicio según tipo de vehículo y detalles de la solicitud.',
        'Cobertura móvil en Filadelfia.',
      ],
      closing:
        'Si tu key fob no funciona bien, comparte los datos del vehículo y el problema exacto.',
    },
    'ignition-key-issues': {
      title: 'Problemas con llave de encendido',
      intro:
        'Soporte para problemas de llave relacionados con encendido y acceso del vehículo.',
      points: [
        'Revisión de problemas comunes relacionados con encendido.',
        'Servicio móvil cuando aplica.',
        'La atención urgente depende de la carga de trabajo.',
      ],
      closing:
        'Describe el problema de encendido y los datos del vehículo al solicitar servicio.',
    },
    'emergency-mobile-service': {
      title: 'Servicio móvil urgente',
      intro:
        'Respuesta móvil 24/7 para situaciones urgentes relacionadas con llaves y cerraduras automotrices.',
      points: [
        'Recepción de solicitudes urgentes 24/7.',
        'Servicio solo móvil en Filadelfia.',
        'Apoyo el mismo día según demanda.',
      ],
      closing:
        'Para ayuda urgente, llama directamente o envía la ubicación y los datos del vehículo.',
    },
  },
  ru: {
    'car-lockout': {
      title: 'Открытие автомобиля',
      intro:
        'Быстрая мобильная помощь, когда автомобиль закрыт и доступа к ключу нет.',
      points: [
        'Выезд по Филадельфии.',
        'Понятная коммуникация от заявки до приезда.',
        'Срочные и same-day заявки — по расписанию и загрузке.',
      ],
      closing:
        'Если машина закрыта и нужен выездной сервис, свяжись с Planetlocksmiths для подтверждения доступности.',
    },
    'car-key-replacement': {
      title: 'Замена ключа автомобиля',
      intro:
        'Решения для утерянных, сломанных или поврежденных автомобильных ключей.',
      points: [
        'Поддержка типовых сценариев замены.',
        'Мобильный выезд к клиенту.',
        'Данные автомобиля помогают заранее оценить заявку.',
      ],
      closing:
        'Если ключ потерян или поврежден, отправь марку, модель и локацию автомобиля.',
    },
    'key-programming': {
      title: 'Программирование ключа',
      intro:
        'Поддержка программирования для многих современных ключей, пультов и брелоков.',
      points: [
        'Фокус на автомобильных ключах.',
        'Выездной сервис для совместимых автомобилей.',
        'Same-day заявки возможны по загрузке.',
      ],
      closing:
        'Для программирования укажи данные автомобиля, чтобы заявка была оценена корректно.',
    },
    'key-fob-services': {
      title: 'Услуги по брелокам',
      intro:
        'Помощь с проблемами доступа, заменой и сопутствующими задачами по key fob.',
      points: [
        'Выездная помощь при проблемах с доступом.',
        'Сервис зависит от автомобиля и деталей заявки.',
        'Покрытие по Филадельфии.',
      ],
      closing:
        'Если брелок работает некорректно, отправь информацию по автомобилю и описание проблемы.',
    },
    'ignition-key-issues': {
      title: 'Проблемы с ключом зажигания',
      intro:
        'Помощь при проблемах с ключом, связанным с зажиганием и доступом автомобиля.',
      points: [
        'Разбор типовых проблем с зажиганием.',
        'Выездной сервис там, где это применимо.',
        'Срочные заявки зависят от текущей загрузки.',
      ],
      closing:
        'При обращении опиши проблему с зажиганием и укажи данные автомобиля.',
    },
    'emergency-mobile-service': {
      title: 'Срочный мобильный сервис',
      intro:
        'Мобильный ответ 24/7 для срочных ситуаций с автомобильными ключами и замками.',
      points: [
        'Прием срочных обращений 24/7.',
        'Только выездной сервис по Филадельфии.',
        'Same-day поддержка возможна по нагрузке.',
      ],
      closing:
        'Для срочной помощи звони напрямую или отправляй заявку с локацией и данными автомобиля.',
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

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const global = getGlobalSettings()
  const home = getHomeContent(locale)
  const fallback = home.featuredServices.find((s) => s.slug === slug)
  const content = serviceCopy[locale][slug]

  return (
    <>
      <Header
        locale={locale}
        phoneDisplay={global.phoneDisplay}
        phonePrimary={global.phonePrimary}
      />
      <main className="mx-auto max-w-4xl px-4 py-16 text-text sm:px-6 lg:px-8">
        {content ? (
          <>
            <h1 className="mb-4 text-3xl font-heading font-semibold">{content.title}</h1>
            <p className="mb-8 max-w-3xl text-muted">{content.intro}</p>

            <div className="mb-8 rounded-xl border border-line bg-surface p-6">
              <ul className="space-y-3 text-sm leading-6 text-muted">
                {content.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-accent-blue" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm leading-7 text-muted">{content.closing}</p>
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
