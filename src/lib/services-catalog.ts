import type { Locale } from '@/lib/content'

type ActiveLocale = 'en' | 'es'

export type CatalogService = {
  slug: string
  title: string
  excerpt: string
  intro: string
  seoTitle: string
  seoDescription: string
}

type ServiceSeed = {
  slug: string
  title: string
  excerpt: string
  intro?: string
}

const englishSeeds: ServiceSeed[] = [
  service('car-lockout', 'Car Lockout Service', 'Mobile help when keys are locked inside the vehicle or the vehicle will not open.'),
  service('key-duplication', 'Key Duplication', 'Duplicate key support for automotive, residential, and commercial key situations.'),
  service('car-key-programming', 'Car Key Programming', 'Programming support for many vehicle keys, chip keys, remotes, and smart keys.'),
  service('all-keys-lost', 'All Keys Lost', 'Help when every working key is lost, stolen, broken, or no longer usable.'),
  service('ignition-repair', 'Ignition Repair', 'Assistance when the ignition is stuck, worn, damaged, or the key will not turn.'),
  service('ignition-replacement', 'Ignition Replacement', 'Ignition replacement help when repair is not the practical next step.'),
  service('lock-repair', 'Lock Repair', 'Repair help for damaged, sticking, loose, or unreliable locks.'),
  service('lock-replacement', 'Lock Replacement', 'Lock replacement for damaged, outdated, failed, or security-sensitive locks.'),
  service('rekey-service', 'Rekey Service', 'Rekey existing locks so old keys stop working while hardware can stay in place.'),
  service('broken-key-extraction', 'Broken Key Extraction', 'Removal support when a key breaks in a door, ignition, trunk, or lock cylinder.'),
  service('commercial-locksmith', 'Commercial Locksmith Service', 'Locksmith support for offices, storefronts, service doors, and business access needs.'),
  service('emergency-locksmith-24-7', 'Emergency Locksmith Service 24/7', 'Urgent locksmith intake for lockouts, lost keys, broken keys, and access problems.'),
  service('smart-lock-installation', 'Smart Lock Installation', 'Smart lock installation support for compatible residential and commercial doors.'),
  service('mailbox-lock-service', 'Mailbox Lock Service', 'Mailbox lock replacement and access support when keys are lost or locks fail.'),
  service('safe-opening', 'Safe Opening', 'Safe opening request intake for locked, jammed, or forgotten-combination situations.'),
  service('house-lockout', 'House Lockout Service', 'Residential lockout help when you cannot access your home, apartment, or room.'),
  service('key-fob-programming', 'FOB Programming', 'Programming support for many key fobs, remotes, smart keys, and push-to-start keys.'),
  service('remote-start-diagnostics', 'Remote Start Diagnostics', 'Diagnostics for remote start, remote key, and vehicle start-control issues.'),
  service('transponder-key-programming', 'Transponder Key Programming', 'Chip key programming for many vehicles with immobilizer security systems.'),
  service('key-fob-repair', 'Key Fob Repair', 'Help with damaged, unreliable, or non-responding key fobs when repair is practical.'),
  service('push-to-start-key-programming', 'Push To Start Key Programming', 'Programming support for many smart keys used with push-to-start vehicles.'),
  service('oem-key-replacement', 'OEM Key Replacement', 'OEM-style replacement key options when the correct key type is available.'),
  service('aftermarket-key-fob-programming', 'Aftermarket Key Fob Programming', 'Programming support for compatible aftermarket key fobs and remotes.'),
  service('door-lock-installation', 'Door Lock Installation', 'Door lock installation for homes, apartments, offices, storefronts, and service doors.'),
  service('access-control', 'Access Control Service', 'Access control service for business entry, controlled doors, and security upgrades.'),
  service('master-key-system', 'Master Key System', 'Master key planning and setup for businesses, properties, and managed doors.'),
  service('panic-bar-installation', 'Panic Bar Installation', 'Panic bar installation and replacement support for commercial exit doors.'),
  service('high-security-lock-installation', 'High Security Lock Installation', 'High-security lock installation for stronger key control and improved resistance.'),
  service('residential-locksmith', 'Residential Locksmith Service', 'Residential locksmith help for lockouts, rekeys, lock changes, smart locks, and repairs.'),
  service('automotive-locksmith', 'Automotive Locksmith Service', 'Automotive locksmith support for lockouts, keys, fobs, programming, and ignition issues.'),
]

const spanishSeeds: ServiceSeed[] = [
  service('car-lockout', 'Bloqueo de automóvil', 'Ayuda móvil cuando las llaves están dentro del vehículo o el auto no abre.'),
  service('key-duplication', 'Duplicación de llaves', 'Soporte para copias de llaves automotrices, residenciales y comerciales.'),
  service('car-key-programming', 'Programación de llave de auto', 'Programación para muchas llaves de vehículo, chip keys, controles y smart keys.'),
  service('all-keys-lost', 'Todas las llaves perdidas', 'Ayuda cuando ninguna llave funciona o todas se perdieron, rompieron o fueron robadas.'),
  service('ignition-repair', 'Reparación de ignición', 'Ayuda cuando la ignición está trabada, gastada, dañada o la llave no gira.'),
  service('ignition-replacement', 'Reemplazo de ignición', 'Ayuda con reemplazo de ignición cuando la reparación no es práctica.'),
  service('lock-repair', 'Reparación de cerraduras', 'Reparación para cerraduras dañadas, flojas, trabadas o poco confiables.'),
  service('lock-replacement', 'Reemplazo de cerraduras', 'Reemplazo de cerraduras dañadas, antiguas, falladas o sensibles de seguridad.'),
  service('rekey-service', 'Servicio de rekey', 'Rekey para que llaves antiguas dejen de funcionar sin cambiar todo el hardware.'),
  service('broken-key-extraction', 'Extracción de llave rota', 'Extracción cuando una llave se rompe en puerta, ignición, baúl o cilindro.'),
  service('commercial-locksmith', 'Cerrajero comercial', 'Soporte para oficinas, tiendas, puertas de servicio y necesidades de acceso comercial.'),
  service('emergency-locksmith-24-7', 'Cerrajero de emergencia 24/7', 'Atención urgente para bloqueos, llaves perdidas, llaves rotas y problemas de acceso.'),
  service('smart-lock-installation', 'Instalación de smart locks', 'Instalación de smart locks compatibles para puertas residenciales y comerciales.'),
  service('mailbox-lock-service', 'Servicio de cerradura de buzón', 'Reemplazo y acceso para buzones cuando la llave se pierde o la cerradura falla.'),
  service('safe-opening', 'Apertura de cajas fuertes', 'Solicitud de apertura para cajas bloqueadas, trabadas o con combinación olvidada.'),
  service('house-lockout', 'Bloqueo de casa', 'Ayuda residencial cuando no puedes entrar a casa, apartamento o habitación.'),
  service('key-fob-programming', 'Programación de FOB', 'Programación para muchos key fobs, controles, smart keys y push-to-start.'),
  service('remote-start-diagnostics', 'Diagnóstico de remote start', 'Diagnóstico para remote start, control remoto y fallas de arranque remoto.'),
  service('transponder-key-programming', 'Programación de llave transponder', 'Programación de llaves con chip para vehículos con inmovilizador.'),
  service('key-fob-repair', 'Reparación de key fob', 'Ayuda con controles dañados, inestables o que no responden cuando reparar es práctico.'),
  service('push-to-start-key-programming', 'Programación push to start', 'Programación para muchas smart keys de vehículos push-to-start.'),
  service('oem-key-replacement', 'Reemplazo de llave OEM', 'Opciones de llave estilo OEM cuando el tipo correcto está disponible.'),
  service('aftermarket-key-fob-programming', 'Programación de key fob aftermarket', 'Programación de controles aftermarket compatibles.'),
  service('door-lock-installation', 'Instalación de cerraduras de puerta', 'Instalación para casas, apartamentos, oficinas, tiendas y puertas de servicio.'),
  service('access-control', 'Servicio de access control', 'Access control para entradas de negocio, puertas controladas y mejoras de seguridad.'),
  service('master-key-system', 'Sistema master key', 'Planeación y configuración de master key para negocios, propiedades y puertas administradas.'),
  service('panic-bar-installation', 'Instalación de panic bar', 'Instalación y reemplazo de panic bars para salidas comerciales.'),
  service('high-security-lock-installation', 'Instalación de cerradura de alta seguridad', 'Cerraduras de alta seguridad para mejor control de llaves y protección.'),
  service('residential-locksmith', 'Cerrajero residencial', 'Ayuda residencial para bloqueos, rekeys, cambios de cerradura, smart locks y reparaciones.'),
  service('automotive-locksmith', 'Cerrajero automotriz', 'Soporte automotriz para bloqueos, llaves, fobs, programación e ignición.'),
]

const legacyServiceAliases: Record<string, string> = {
  'lost-car-key-replacement': 'all-keys-lost',
  'emergency-mobile-service': 'emergency-locksmith-24-7',
  'ignition-key-issues': 'ignition-repair',
  'motorcycle-key-service': 'automotive-locksmith',
}

const hiddenLegacySlugs = new Set(Object.keys(legacyServiceAliases))

function service(slug: string, title: string, excerpt: string, intro?: string): ServiceSeed {
  return { slug, title, excerpt, intro }
}

function makeCatalog(seed: ServiceSeed): CatalogService {
  return {
    slug: seed.slug,
    title: seed.title,
    excerpt: seed.excerpt,
    intro: seed.intro || seed.excerpt,
    seoTitle: `${seed.title} Philadelphia | Planet Locksmiths`,
    seoDescription: seed.excerpt,
  }
}

function activeLocale(locale: Locale): ActiveLocale {
  return locale === 'es' ? 'es' : 'en'
}

export function getCatalogServices(locale: Locale): CatalogService[] {
  const seeds = activeLocale(locale) === 'es' ? spanishSeeds : englishSeeds
  return seeds.map(makeCatalog)
}

export function getCatalogServiceBySlug(locale: Locale, slug: string): CatalogService | null {
  const services = getCatalogServices(locale)
  const targetSlug = legacyServiceAliases[slug] || slug
  return services.find((service) => service.slug === targetSlug) || null
}

export function isHiddenLegacyServiceSlug(slug: string) {
  return hiddenLegacySlugs.has(slug)
}

export function getCatalogServiceOptions(locale: Locale = 'en') {
  return getCatalogServices(locale).map((service) => service.title)
}
