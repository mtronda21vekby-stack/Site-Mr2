import {
  getFaq,
  getHomeContent,
  getReviews,
  type FaqItem,
  type HomeContent,
  type Locale,
  type ReviewItem,
} from '@/lib/content'

export type DefaultHomePreset = Pick<
  HomeContent,
  | 'heroTitle'
  | 'heroSubtitle'
  | 'heroPrimaryCta'
  | 'heroSecondaryCta'
  | 'emergencyTitle'
  | 'emergencyText'
  | 'reviewsTitle'
  | 'faqTitle'
  | 'contactTitle'
  | 'contactText'
>

export type DefaultAreaContent = {
  slug: string
  city: string
  state: string
  title: string
  intro: string
  highlights: string[]
  supportedServices: string[]
  seoTitle: string
  seoDescription: string
}

const DEFAULT_AREA_SERVICES_EN = [
  'Emergency Locksmith Service 24/7',
  'Car Lockout Service',
  'House Lockout Service',
  'Rekey Service',
  'Lock Repair',
  'Lock Replacement',
  'Commercial Locksmith Service',
  'Residential Locksmith Service',
  'Smart Lock Installation',
  'Access Control Service',
  'Safe Opening',
  'Mailbox Lock Service',
]

const DEFAULT_AREA_SERVICES_ES = [
  'Cerrajero de emergencia 24/7',
  'Bloqueo de automovil',
  'Bloqueo de casa',
  'Rekey',
  'Reparacion de cerraduras',
  'Reemplazo de cerraduras',
  'Cerrajero comercial',
  'Cerrajero residencial',
  'Instalacion de smart locks',
  'Access control',
  'Apertura de cajas fuertes',
  'Cerraduras de buzon',
]

const AREA_DEFINITIONS = [
  ['philadelphia', 'Philadelphia', 'PA'],
  ['center-city-philadelphia', 'Center City Philadelphia', 'PA'],
  ['northeast-philadelphia', 'Northeast Philadelphia', 'PA'],
  ['south-philadelphia', 'South Philadelphia', 'PA'],
  ['west-philadelphia', 'West Philadelphia', 'PA'],
  ['north-philadelphia', 'North Philadelphia', 'PA'],
  ['university-city', 'University City', 'PA'],
  ['fishtown', 'Fishtown', 'PA'],
  ['old-city', 'Old City', 'PA'],
  ['port-richmond', 'Port Richmond', 'PA'],
] as const

function makeEnglishArea(slug: string, city: string, state: string): DefaultAreaContent {
  const location = `${city}, ${state}`

  return {
    slug,
    city,
    state,
    title: `Mobile Locksmith Service in ${city}`,
    intro: `Planet Locksmiths provides mobile locksmith service in ${location} for emergency lockouts, automotive keys, residential locks, commercial doors, rekeying, smart locks, safes, mailbox locks, and access-control needs.`,
    highlights: [
      'Mobile locksmith service for cars, homes, offices, storefronts, and managed properties',
      'Emergency lockout, lost key, broken key, rekey, lock repair, and lock replacement support',
      'Service timing depends on technician availability, traffic, authorization, parts, and job complexity',
    ],
    supportedServices: [...DEFAULT_AREA_SERVICES_EN],
    seoTitle: `${city} Locksmith Service`,
    seoDescription: `Mobile locksmith service in ${location} for emergency, automotive, residential, commercial, rekey, smart lock, safe, mailbox, and access-control needs.`,
  }
}

function makeSpanishArea(slug: string, city: string, state: string): DefaultAreaContent {
  const location = `${city}, ${state}`

  return {
    slug,
    city,
    state,
    title: `Cerrajero movil en ${city}`,
    intro: `Planet Locksmiths ofrece cerrajeria movil en ${location} para emergencias, llaves de auto, cerraduras residenciales, puertas comerciales, rekey, smart locks, cajas fuertes, buzones y access control.`,
    highlights: [
      'Servicio movil para autos, casas, oficinas, tiendas y propiedades administradas',
      'Ayuda con bloqueos, llaves perdidas, llaves rotas, rekey, reparacion y reemplazo de cerraduras',
      'El tiempo depende de disponibilidad, trafico, autorizacion, piezas y complejidad del trabajo',
    ],
    supportedServices: [...DEFAULT_AREA_SERVICES_ES],
    seoTitle: `Cerrajero en ${city}`,
    seoDescription: `Servicio movil de cerrajeria en ${location} para emergencia, auto, residencial, comercial, rekey, smart locks, cajas fuertes, buzones y access control.`,
  }
}

function cloneArea(area: DefaultAreaContent): DefaultAreaContent {
  return {
    ...area,
    highlights: [...area.highlights],
    supportedServices: [...area.supportedServices],
  }
}

const DEFAULT_AREAS: Record<Locale, DefaultAreaContent[]> = {
  en: AREA_DEFINITIONS.map(([slug, city, state]) => makeEnglishArea(slug, city, state)),
  es: AREA_DEFINITIONS.map(([slug, city, state]) => makeSpanishArea(slug, city, state)),
  ru: AREA_DEFINITIONS.map(([slug, city, state]) => makeEnglishArea(slug, city, state)),
}

export function getDefaultHomePreset(locale: Locale): DefaultHomePreset {
  const home = getHomeContent(locale)

  return {
    heroTitle: home.heroTitle,
    heroSubtitle: home.heroSubtitle,
    heroPrimaryCta: home.heroPrimaryCta,
    heroSecondaryCta: home.heroSecondaryCta,
    emergencyTitle: home.emergencyTitle,
    emergencyText: home.emergencyText,
    reviewsTitle: home.reviewsTitle,
    faqTitle: home.faqTitle,
    contactTitle: home.contactTitle,
    contactText: home.contactText,
  }
}

export function getDefaultFaqItems(locale: Locale): FaqItem[] {
  return getFaq(locale).map((item) => ({ ...item }))
}

export function getDefaultReviews(locale: Locale): ReviewItem[] {
  return getReviews(locale).map((item) => ({ ...item }))
}

export function getDefaultAreas(locale: Locale): DefaultAreaContent[] {
  return (DEFAULT_AREAS[locale] ?? DEFAULT_AREAS.en).map(cloneArea)
}

export function getDefaultAreaBySlug(locale: Locale, slug: string): DefaultAreaContent | undefined {
  const normalizedSlug = slug.trim()
  return getDefaultAreas(locale).find((area) => area.slug === normalizedSlug)
}
