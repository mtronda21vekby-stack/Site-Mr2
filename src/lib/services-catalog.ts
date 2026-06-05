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

const englishServices: CatalogService[] = [
  makeService('car-lockout', 'Car Lockout Service', 'Mobile help when keys are locked inside the vehicle or the vehicle will not open.', 'Fast mobile car lockout help for drivers in Philadelphia and nearby coverage areas. Share the vehicle, exact location, and lockout situation so the request can be routed correctly.', 'Car Lockout Service Philadelphia | Planetlocksmiths'),
  makeService('key-duplication', 'Key Duplication', 'Duplicate key support for automotive, residential, and commercial key situations.', 'Request key duplication help for spare keys, replacement copies, and practical backup keys. Service availability depends on key type, blank availability, and authorization.', 'Key Duplication Philadelphia | Planetlocksmiths'),
  makeService('car-key-programming', 'Car Key Programming', 'Programming support for many vehicle keys, chip keys, remotes, and smart keys.', 'Modern vehicle keys often need programming before they can start the vehicle. Send the year, make, model, and current key situation so compatibility can be reviewed.', 'Car Key Programming Philadelphia | Planetlocksmiths'),
  makeService('all-keys-lost', 'All Keys Lost Service', 'Help when every working key is lost, stolen, broken, or no longer usable.', 'All-keys-lost service can involve key generation, cutting, and programming depending on the vehicle and security system. Vehicle details and authorization may be required.', 'All Keys Lost Service Philadelphia | Planetlocksmiths'),
  makeService('ignition-repair', 'Ignition Repair', 'Assistance when the ignition is stuck, worn, damaged, or the key will not turn.', 'Ignition issues can come from a worn key, damaged cylinder, lock wafers, or a security system problem. The request is reviewed before the safest repair path is confirmed.', 'Ignition Repair Philadelphia | Planetlocksmiths'),
  makeService('ignition-replacement', 'Ignition Replacement', 'Ignition replacement help when repair is not the practical next step.', 'When an ignition cylinder or related part cannot be repaired reliably, replacement may be the better option. Final service depends on vehicle details and part availability.', 'Ignition Replacement Philadelphia | Planetlocksmiths'),
  makeService('lock-repair', 'Lock Repair', 'Repair help for damaged, sticking, loose, or unreliable locks.', 'Lock repair requests can include door locks, vehicle locks, commercial locks, and residential hardware. The right approach depends on the lock condition and parts needed.', 'Lock Repair Philadelphia | Planetlocksmiths'),
  makeService('lock-replacement', 'Lock Replacement', 'Lock replacement for damaged, outdated, failed, or security-sensitive locks.', 'Replace locks when repair is not enough, keys are compromised, hardware is damaged, or a property needs a practical security update.', 'Lock Replacement Philadelphia | Planetlocksmiths'),
  makeService('rekey-service', 'Rekey Service', 'Rekey existing locks so old keys stop working while hardware can stay in place.', 'Rekeying can be useful after moving, staff changes, lost keys, or security concerns. Compatibility depends on the lock cylinder and hardware condition.', 'Rekey Service Philadelphia | Planetlocksmiths'),
  makeService('broken-key-extraction', 'Broken Key Extraction', 'Removal support when a key breaks in a door, ignition, trunk, or lock cylinder.', 'Broken key extraction is handled carefully to reduce the chance of additional lock or ignition damage. Replacement key needs can be reviewed after extraction.', 'Broken Key Extraction Philadelphia | Planetlocksmiths'),
  makeService('commercial-locksmith', 'Commercial Locksmith Service', 'Locksmith support for offices, storefronts, service doors, and business access needs.', 'Commercial locksmith requests can include rekeys, lock changes, panic bars, master keys, high-security locks, access control, and urgent business lockouts.', 'Commercial Locksmith Service Philadelphia | Planetlocksmiths'),
  makeService('emergency-locksmith-24-7', 'Emergency Locksmith Service 24/7', 'Urgent locksmith intake for lockouts, lost keys, broken keys, and access problems.', 'Emergency requests can be sent any time. Availability, response time, and final scope depend on location, service type, parts, authorization, and technician schedule.', 'Emergency Locksmith Service 24/7 Philadelphia | Planetlocksmiths'),
  makeService('smart-lock-installation', 'Smart Lock Installation', 'Smart lock installation support for compatible residential and commercial doors.', 'Smart lock installation can include replacing existing hardware, setting up compatible smart locks, and checking basic operation after installation.', 'Smart Lock Installation Philadelphia | Planetlocksmiths'),
  makeService('mailbox-lock-service', 'Mailbox Lock Service', 'Mailbox lock replacement and access support when keys are lost or locks fail.', 'Mailbox lock service can help when a mailbox key is lost, the lock is damaged, or the cylinder needs replacement. Service depends on mailbox type and access authorization.', 'Mailbox Lock Service Philadelphia | Planetlocksmiths'),
  makeService('safe-opening', 'Safe Opening', 'Safe opening request intake for locked, jammed, or forgotten-combination situations.', 'Safe opening depends on safe type, lock type, condition, and proof of authorization. Submit the safe details and issue before service is confirmed.', 'Safe Opening Philadelphia | Planetlocksmiths'),
  makeService('house-lockout', 'House Lockout Service', 'Residential lockout help when you cannot access your home, apartment, or room.', 'House lockout service helps with urgent residential access problems. Exact location, lock type, and authorization details help confirm the safest next step.', 'House Lockout Service Philadelphia | Planetlocksmiths'),
  makeService('key-fob-programming', 'FOB Programming', 'Programming support for many key fobs, remotes, smart keys, and push-to-start keys.', 'Key fob programming availability depends on the vehicle year, make, model, remote type, and security system. Share the details before dispatch.', 'FOB Programming Philadelphia | Planetlocksmiths'),
  makeService('remote-start-diagnostics', 'Remote Start Diagnostics', 'Diagnostics for remote start, remote key, and vehicle start-control issues.', 'Remote start issues can come from programming, battery, antenna, module, or vehicle security conditions. Diagnostics help identify the likely next step.', 'Remote Start Diagnostics Philadelphia | Planetlocksmiths'),
  makeService('transponder-key-programming', 'Transponder Key Programming', 'Chip key programming for many vehicles with immobilizer security systems.', 'Transponder keys must be paired correctly with the vehicle immobilizer. Programming support depends on vehicle compatibility, key type, and authorization.', 'Transponder Key Programming Philadelphia | Planetlocksmiths'),
  makeService('key-fob-repair', 'Key Fob Repair', 'Help with damaged, unreliable, or non-responding key fobs when repair is practical.', 'Key fob repair may include shell, button, battery, or contact-related issues depending on the fob. Replacement and programming may be needed in some cases.', 'Key Fob Repair Philadelphia | Planetlocksmiths'),
  makeService('push-to-start-key-programming', 'Push To Start Key Programming', 'Programming support for many smart keys used with push-to-start vehicles.', 'Push-to-start smart keys require the right key type and compatible programming process. Send the vehicle details and current key situation for review.', 'Push To Start Key Programming Philadelphia | Planetlocksmiths'),
  makeService('oem-key-replacement', 'OEM Key Replacement', 'OEM-style replacement key options when the correct key type is available.', 'OEM key replacement can help when a customer wants a factory-style key or remote. Availability depends on parts, vehicle details, and programming requirements.', 'OEM Key Replacement Philadelphia | Planetlocksmiths'),
  makeService('aftermarket-key-fob-programming', 'Aftermarket Key Fob Programming', 'Programming support for compatible aftermarket key fobs and remotes.', 'Aftermarket key fob programming depends on fob quality, compatibility, vehicle system, and programming access. Not every aftermarket remote can be programmed.', 'Aftermarket Key Fob Programming Philadelphia | Planetlocksmiths'),
  makeService('door-lock-installation', 'Door Lock Installation', 'Door lock installation for homes, apartments, offices, storefronts, and service doors.', 'Door lock installation can include replacing old locks, installing compatible new hardware, and checking fit and operation after installation.', 'Door Lock Installation Philadelphia | Planetlocksmiths'),
  makeService('access-control', 'Access Control Service', 'Access control service for business entry, controlled doors, and security upgrades.', 'Access control requests can include planning, troubleshooting, and installation support for compatible door access systems. Final scope depends on hardware and site details.', 'Access Control Service Philadelphia | Planetlocksmiths'),
  makeService('master-key-system', 'Master Key System', 'Master key planning and setup for businesses, properties, and managed doors.', 'A master key system can simplify access while keeping individual door control. Planning depends on existing hardware, keyway, door count, and security requirements.', 'Master Key System Philadelphia | Planetlocksmiths'),
  makeService('panic-bar-installation', 'Panic Bar Installation', 'Panic bar installation and replacement support for commercial exit doors.', 'Panic bar work depends on door type, existing hardware, local code requirements, and site conditions. Compatibility should be confirmed before installation.', 'Panic Bar Installation Philadelphia | Planetlocksmiths'),
  makeService('high-security-lock-installation', 'High Security Lock Installation', 'High-security lock installation for stronger key control and improved resistance.', 'High-security locks can improve key control and protection for homes or businesses. The best option depends on door type, security goals, and budget.', 'High Security Lock Installation Philadelphia | Planetlocksmiths'),
  makeService('residential-locksmith', 'Residential Locksmith Service', 'Residential locksmith help for lockouts, rekeys, lock changes, smart locks, and repairs.', 'Residential locksmith requests can include lockouts, rekeys, lock replacement, broken keys, mailbox locks, smart locks, and general door lock service.', 'Residential Locksmith Service Philadelphia | Planetlocksmiths'),
  makeService('automotive-locksmith', 'Automotive Locksmith Service', 'Automotive locksmith support for lockouts, keys, fobs, programming, and ignition issues.', 'Automotive locksmith service covers car lockouts, all-keys-lost situations, car key programming, key fobs, transponders, ignition help, and broken key extraction.', 'Automotive Locksmith Service Philadelphia | Planetlocksmiths'),
]

const spanishServices: CatalogService[] = [
  makeService('car-lockout', 'Bloqueo de automóvil', 'Ayuda móvil cuando las llaves están dentro del vehículo o el auto no abre.', 'Ayuda móvil para bloqueos de automóvil en Philadelphia y áreas cercanas. Comparte vehículo, ubicación exacta y situación para orientar la solicitud correctamente.', 'Bloqueo de automóvil Philadelphia | Planetlocksmiths'),
  makeService('key-duplication', 'Duplicación de llaves', 'Soporte para copias de llaves automotrices, residenciales y comerciales.', 'Solicita duplicación para llaves de repuesto, copias de reemplazo y llaves prácticas de respaldo. Depende del tipo de llave y disponibilidad.', 'Duplicación de llaves Philadelphia | Planetlocksmiths'),
  makeService('car-key-programming', 'Programación de llave de auto', 'Programación para muchas llaves de vehículo, chip keys, controles y smart keys.', 'Muchas llaves modernas requieren programación antes de arrancar el vehículo. Envía año, marca, modelo y situación actual para revisar compatibilidad.', 'Programación de llave de auto Philadelphia | Planetlocksmiths'),
  makeService('all-keys-lost', 'Servicio de todas las llaves perdidas', 'Ayuda cuando ninguna llave funciona o todas se perdieron, rompieron o fueron robadas.', 'El servicio puede incluir generación, corte y programación según el vehículo y sistema de seguridad. Puede requerirse autorización.', 'Todas las llaves perdidas Philadelphia | Planetlocksmiths'),
  makeService('ignition-repair', 'Reparación de ignición', 'Ayuda cuando la ignición está trabada, gastada, dañada o la llave no gira.', 'Los problemas de ignición pueden venir de llave gastada, cilindro dañado o sistema de seguridad. Se revisa la solicitud antes de confirmar el servicio.', 'Reparación de ignición Philadelphia | Planetlocksmiths'),
  makeService('ignition-replacement', 'Reemplazo de ignición', 'Ayuda con reemplazo de ignición cuando la reparación no es práctica.', 'Si el cilindro o parte relacionada no se puede reparar de forma confiable, el reemplazo puede ser mejor. Depende de piezas y vehículo.', 'Reemplazo de ignición Philadelphia | Planetlocksmiths'),
  makeService('lock-repair', 'Reparación de cerraduras', 'Reparación para cerraduras dañadas, flojas, trabadas o poco confiables.', 'Las solicitudes pueden incluir cerraduras de puertas, vehículos, comercios y residencias. El enfoque depende del estado y piezas necesarias.', 'Reparación de cerraduras Philadelphia | Planetlocksmiths'),
  makeService('lock-replacement', 'Reemplazo de cerraduras', 'Reemplazo de cerraduras dañadas, antiguas, falladas o sensibles de seguridad.', 'Cambiar cerraduras ayuda cuando reparar no alcanza, se perdieron llaves o se necesita actualizar seguridad.', 'Reemplazo de cerraduras Philadelphia | Planetlocksmiths'),
  makeService('rekey-service', 'Servicio de rekey', 'Rekey para que llaves antiguas dejen de funcionar sin cambiar todo el hardware.', 'El rekey es útil después de mudanzas, cambios de personal, llaves perdidas o dudas de seguridad. Depende del cilindro.', 'Rekey Philadelphia | Planetlocksmiths'),
  makeService('broken-key-extraction', 'Extracción de llave rota', 'Extracción cuando una llave se rompe en puerta, ignición, baúl o cilindro.', 'La extracción se realiza con cuidado para reducir daño adicional. Después se puede revisar si hace falta una llave nueva.', 'Extracción de llave rota Philadelphia | Planetlocksmiths'),
  makeService('commercial-locksmith', 'Cerrajero comercial', 'Soporte para oficinas, tiendas, puertas de servicio y necesidades de acceso comercial.', 'Las solicitudes comerciales pueden incluir rekeys, cambios de cerradura, barras antipánico, master keys, alta seguridad y access control.', 'Cerrajero comercial Philadelphia | Planetlocksmiths'),
  makeService('emergency-locksmith-24-7', 'Cerrajero de emergencia 24/7', 'Atención urgente para bloqueos, llaves perdidas, llaves rotas y problemas de acceso.', 'Las solicitudes urgentes pueden enviarse en cualquier momento. Disponibilidad y alcance dependen de ubicación, servicio, piezas y horario.', 'Cerrajero de emergencia 24/7 Philadelphia | Planetlocksmiths'),
  makeService('smart-lock-installation', 'Instalación de smart locks', 'Instalación de smart locks compatibles para puertas residenciales y comerciales.', 'La instalación puede incluir reemplazo de hardware existente, configuración básica y revisión de funcionamiento.', 'Instalación de smart locks Philadelphia | Planetlocksmiths'),
  makeService('mailbox-lock-service', 'Servicio de cerradura de buzón', 'Reemplazo y acceso para buzones cuando la llave se pierde o la cerradura falla.', 'Puede ayudar con llave perdida, cerradura dañada o cilindro que necesita reemplazo. Depende del buzón y autorización.', 'Cerradura de buzón Philadelphia | Planetlocksmiths'),
  makeService('safe-opening', 'Apertura de cajas fuertes', 'Solicitud de apertura para cajas bloqueadas, trabadas o con combinación olvidada.', 'La apertura depende del tipo de caja fuerte, cerradura, estado y autorización. Envía detalles antes de confirmar.', 'Apertura de cajas fuertes Philadelphia | Planetlocksmiths'),
  makeService('house-lockout', 'Bloqueo de casa', 'Ayuda residencial cuando no puedes entrar a casa, apartamento o habitación.', 'El servicio ayuda con acceso residencial urgente. Ubicación, tipo de cerradura y autorización ayudan a confirmar el siguiente paso.', 'Bloqueo de casa Philadelphia | Planetlocksmiths'),
  makeService('key-fob-programming', 'Programación de FOB', 'Programación para muchos key fobs, controles, smart keys y push-to-start.', 'La disponibilidad depende de año, marca, modelo, tipo de control y sistema de seguridad. Envía datos antes del despacho.', 'Programación de FOB Philadelphia | Planetlocksmiths'),
  makeService('remote-start-diagnostics', 'Diagnóstico de remote start', 'Diagnóstico para remote start, control remoto y fallas de arranque remoto.', 'Los problemas pueden venir de programación, batería, antena, módulo o seguridad del vehículo. El diagnóstico orienta el siguiente paso.', 'Diagnóstico remote start Philadelphia | Planetlocksmiths'),
  makeService('transponder-key-programming', 'Programación de llave transponder', 'Programación de llaves con chip para vehículos con inmovilizador.', 'Las llaves transponder deben emparejarse con el inmovilizador. Depende de compatibilidad, tipo de llave y autorización.', 'Programación transponder Philadelphia | Planetlocksmiths'),
  makeService('key-fob-repair', 'Reparación de key fob', 'Ayuda con controles dañados, inestables o que no responden cuando reparar es práctico.', 'Puede incluir carcasa, botones, batería o contactos. En algunos casos se requiere reemplazo y programación.', 'Reparación de key fob Philadelphia | Planetlocksmiths'),
  makeService('push-to-start-key-programming', 'Programación push to start', 'Programación para muchas smart keys de vehículos push-to-start.', 'Requiere el tipo correcto de llave y proceso compatible. Envía datos del vehículo y situación actual para revisar.', 'Programación push to start Philadelphia | Planetlocksmiths'),
  makeService('oem-key-replacement', 'Reemplazo de llave OEM', 'Opciones de llave estilo OEM cuando el tipo correcto está disponible.', 'Puede ayudar cuando se busca llave o control estilo fábrica. Depende de piezas, vehículo y programación.', 'Reemplazo de llave OEM Philadelphia | Planetlocksmiths'),
  makeService('aftermarket-key-fob-programming', 'Programación de key fob aftermarket', 'Programación de controles aftermarket compatibles.', 'Depende de calidad del control, compatibilidad, vehículo y acceso de programación. No todos los controles aftermarket sirven.', 'Programación aftermarket key fob Philadelphia | Planetlocksmiths'),
  makeService('door-lock-installation', 'Instalación de cerraduras de puerta', 'Instalación para casas, apartamentos, oficinas, tiendas y puertas de servicio.', 'Puede incluir reemplazo de cerraduras antiguas, instalación de hardware compatible y revisión de funcionamiento.', 'Instalación de cerraduras Philadelphia | Planetlocksmiths'),
  makeService('access-control', 'Servicio de access control', 'Access control para entradas de negocio, puertas controladas y mejoras de seguridad.', 'Puede incluir planeación, diagnóstico e instalación de sistemas compatibles. El alcance depende del sitio y hardware.', 'Access control Philadelphia | Planetlocksmiths'),
  makeService('master-key-system', 'Sistema master key', 'Planeación y configuración de master key para negocios, propiedades y puertas administradas.', 'Un sistema master key simplifica acceso manteniendo control por puerta. Depende de hardware, keyway y necesidades.', 'Sistema master key Philadelphia | Planetlocksmiths'),
  makeService('panic-bar-installation', 'Instalación de panic bar', 'Instalación y reemplazo de panic bars para salidas comerciales.', 'El trabajo depende del tipo de puerta, hardware existente, requisitos locales y condiciones del sitio.', 'Instalación panic bar Philadelphia | Planetlocksmiths'),
  makeService('high-security-lock-installation', 'Instalación de cerradura de alta seguridad', 'Cerraduras de alta seguridad para mejor control de llaves y protección.', 'Las cerraduras de alta seguridad pueden mejorar control y protección. La mejor opción depende de puerta, objetivos y presupuesto.', 'Cerraduras de alta seguridad Philadelphia | Planetlocksmiths'),
  makeService('residential-locksmith', 'Cerrajero residencial', 'Ayuda residencial para bloqueos, rekeys, cambios de cerradura, smart locks y reparaciones.', 'Las solicitudes residenciales pueden incluir bloqueos, rekeys, reemplazos, llaves rotas, buzones, smart locks y servicio general.', 'Cerrajero residencial Philadelphia | Planetlocksmiths'),
  makeService('automotive-locksmith', 'Cerrajero automotriz', 'Soporte automotriz para bloqueos, llaves, fobs, programación e ignición.', 'El servicio automotriz cubre bloqueos, todas las llaves perdidas, programación, fobs, transponders, ignición y extracción de llave rota.', 'Cerrajero automotriz Philadelphia | Planetlocksmiths'),
]

const legacyServiceAliases: Record<string, string> = {
  'lost-car-key-replacement': 'all-keys-lost',
  'emergency-mobile-service': 'emergency-locksmith-24-7',
  'ignition-key-issues': 'ignition-repair',
  'motorcycle-key-service': 'automotive-locksmith',
}

const hiddenLegacySlugs = new Set(Object.keys(legacyServiceAliases))

function makeService(slug: string, title: string, excerpt: string, intro: string, seoTitle: string): CatalogService {
  return {
    slug,
    title,
    excerpt,
    intro,
    seoTitle,
    seoDescription: excerpt,
  }
}

function activeLocale(locale: Locale): ActiveLocale {
  return locale === 'es' ? 'es' : 'en'
}

export function getCatalogServices(locale: Locale): CatalogService[] {
  return activeLocale(locale) === 'es' ? spanishServices : englishServices
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
