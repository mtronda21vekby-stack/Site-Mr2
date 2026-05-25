-- Production starter content for Planetlocksmiths.
-- Applies normal locksmith website copy to the Supabase CMS tables.
-- Run after 202605230004_site_background_settings.sql.

-- Keep existing logo/background/images/orders. This only replaces public business copy.

update public.site_settings
set
  brand_name = coalesce(nullif(brand_name, ''), 'Planetlocksmiths'),
  logo_alt = coalesce(nullif(logo_alt, ''), 'Planetlocksmiths mobile automotive locksmith'),
  email = coalesce(nullif(email, ''), 'info@planetlocksmiths.com'),
  service_hours = coalesce(nullif(service_hours, ''), '24/7 Emergency Mobile Service')
where true;

-- Home pages

delete from public.home_pages where locale in ('en', 'es');

insert into public.home_pages (
  locale,
  hero_title,
  hero_subtitle,
  hero_primary_cta,
  hero_secondary_cta,
  emergency_title,
  emergency_text,
  reviews_title,
  faq_title,
  contact_title,
  contact_text
) values
(
  'en',
  '24/7 Mobile Automotive Locksmith in Philadelphia',
  'Locked out, lost your car key, or need a replacement fob programmed? Planetlocksmiths sends mobile automotive locksmith help across Philadelphia for urgent lockouts, replacement keys, key fobs, transponder programming, and ignition key issues.',
  'Call Now',
  'Request Service',
  'Locked out or missing your car key right now?',
  'Request fast mobile locksmith help for car lockouts, lost keys, key replacement, key fob programming, and ignition-related key problems across Philadelphia. Tell us your vehicle, location, and situation so we can prepare the right service.',
  'What customers value',
  'Locksmith Questions',
  'Request Mobile Locksmith Service',
  'Send your name, phone number, vehicle details, location, and what happened. For urgent lockouts or lost keys, calling is usually the fastest option.'
),
(
  'es',
  'Cerrajero automotriz móvil 24/7 en Filadelfia',
  '¿No puedes abrir tu auto, perdiste la llave o necesitas programar un llavero nuevo? Planetlocksmiths ofrece servicio móvil de cerrajería automotriz en Filadelfia para bloqueos, reemplazo de llaves, llaveros, programación e inconvenientes con la llave de encendido.',
  'Llamar ahora',
  'Solicitar servicio',
  '¿No puedes abrir tu auto o perdiste la llave?',
  'Solicita ayuda móvil para bloqueos de auto, llaves perdidas, reemplazo de llaves, programación de llaveros y problemas relacionados con la llave de encendido en Filadelfia. Indica tu vehículo, ubicación y situación para preparar el servicio correcto.',
  'Lo que valoran los clientes',
  'Preguntas de cerrajería',
  'Solicitar cerrajero móvil',
  'Envía tu nombre, teléfono, detalles del vehículo, ubicación y lo que ocurrió. Para bloqueos urgentes o llaves perdidas, llamar suele ser la opción más rápida.'
);

-- Services

delete from public.services where locale in ('en', 'es');

insert into public.services (
  locale,
  slug,
  title,
  excerpt,
  intro,
  seo_title,
  seo_description,
  sort_order,
  is_published
) values
('en','car-lockout','Car Lockout Service','Mobile help when the keys are locked inside your vehicle or the vehicle will not open.','Planetlocksmiths provides mobile car lockout assistance across Philadelphia. If your keys are locked inside, the trunk is stuck, or the vehicle will not open normally, request help with your location and vehicle details. The goal is safe access without unnecessary damage.','Car Lockout Service in Philadelphia | Planetlocksmiths','24/7 mobile car lockout service across Philadelphia. Help for locked keys, trunk lockouts, and urgent vehicle access issues.',10,true),
('en','lost-car-key-replacement','Lost Car Key Replacement','Replacement solutions when your only car key is lost, stolen, broken, or no longer usable.','Lost your only car key? Planetlocksmiths can help with mobile automotive key replacement options for many vehicles. Share the year, make, model, and key type so the technician can prepare the correct blank, cutting, and programming workflow when available.','Lost Car Key Replacement Philadelphia | Planetlocksmiths','Mobile lost car key replacement service in Philadelphia for many vehicles, including key cutting and programming support when available.',20,true),
('en','car-key-replacement','Car Key Replacement','Replacement keys for damaged, worn, broken, or missing automotive keys.','If your key is cracked, bent, worn out, or no longer works reliably, Planetlocksmiths offers mobile car key replacement help. The service can include cutting and programming support depending on the vehicle system and key type.','Car Key Replacement Philadelphia | Planetlocksmiths','Mobile car key replacement in Philadelphia for damaged, broken, worn, or missing vehicle keys.',30,true),
('en','key-fob-programming','Key Fob Programming','Programming support for many remote keys, smart keys, and push-to-start fobs.','Modern vehicles often need the remote, transponder, or smart key programmed before it can start the car. Planetlocksmiths provides mobile programming support for many key fobs and remote systems. Vehicle compatibility depends on year, make, model, and security system.','Key Fob Programming Philadelphia | Planetlocksmiths','Mobile key fob programming in Philadelphia for many remote keys, smart keys, and push-to-start fobs.',40,true),
('en','transponder-key-programming','Transponder Key Programming','Chip key programming for many vehicles with anti-theft immobilizer systems.','Transponder keys need the correct chip programming to communicate with the vehicle immobilizer. Planetlocksmiths helps with many chip-key and transponder-key situations, including replacement keys that need to be paired to the vehicle.','Transponder Key Programming Philadelphia | Planetlocksmiths','Mobile transponder key programming in Philadelphia for many chip keys and immobilizer systems.',50,true),
('en','ignition-key-issues','Ignition Key Issues','Help when the key will not turn, is stuck, or the ignition key system is causing access problems.','If the key will not turn, the ignition feels jammed, or the key is stuck, the issue may be the key, cylinder, lock wafers, or vehicle security system. Planetlocksmiths can assess ignition-related key problems and recommend the safest next step.','Ignition Key Issues Philadelphia | Planetlocksmiths','Mobile help for ignition key issues in Philadelphia, including stuck keys, no-turn problems, and worn ignition keys.',60,true),
('en','emergency-mobile-service','Emergency Mobile Locksmith','Urgent mobile automotive locksmith response for lockouts, lost keys, and key failures.','When the problem cannot wait, Planetlocksmiths focuses on mobile emergency automotive locksmith service across Philadelphia. Call or request service with the vehicle details, exact location, and whether the key is lost, locked in, broken, or not programming.','Emergency Mobile Locksmith Philadelphia | Planetlocksmiths','24/7 emergency mobile automotive locksmith service in Philadelphia for lockouts, lost keys, replacement keys, fobs, and urgent key problems.',70,true),
('en','motorcycle-key-service','Motorcycle Key Service','Mobile assistance for many motorcycle key and lock situations.','Planetlocksmiths can assist with many motorcycle key situations depending on the lock type, key code availability, and vehicle setup. Send the make, model, year, and issue so the request can be reviewed before dispatch.','Motorcycle Key Service Philadelphia | Planetlocksmiths','Mobile motorcycle key service in Philadelphia for many key and lock situations, depending on vehicle and lock type.',80,true),

('es','car-lockout','Bloqueo de automóvil','Ayuda móvil cuando las llaves están dentro del vehículo o el auto no abre.','Planetlocksmiths ofrece asistencia móvil para bloqueos de automóvil en Filadelfia. Si las llaves están dentro, la cajuela no abre o el vehículo no abre normalmente, solicita ayuda con tu ubicación y datos del vehículo.','Bloqueo de automóvil en Filadelfia | Planetlocksmiths','Servicio móvil 24/7 para bloqueos de automóvil en Filadelfia, llaves dentro del auto y acceso urgente al vehículo.',10,true),
('es','lost-car-key-replacement','Reemplazo de llave perdida','Soluciones cuando la única llave del auto se perdió, fue robada, se rompió o ya no funciona.','¿Perdiste la única llave del auto? Planetlocksmiths ayuda con opciones móviles de reemplazo de llaves para muchos vehículos. Comparte año, marca, modelo y tipo de llave para preparar el proceso correcto cuando esté disponible.','Reemplazo de llave perdida en Filadelfia | Planetlocksmiths','Reemplazo móvil de llaves perdidas en Filadelfia para muchos vehículos, con corte y programación cuando esté disponible.',20,true),
('es','car-key-replacement','Reemplazo de llave de auto','Llaves de reemplazo para llaves dañadas, gastadas, rotas o extraviadas.','Si tu llave está rota, gastada, doblada o ya no funciona de forma confiable, Planetlocksmiths ofrece ayuda móvil de reemplazo. El servicio puede incluir corte y programación según el sistema del vehículo y tipo de llave.','Reemplazo de llave de auto en Filadelfia | Planetlocksmiths','Reemplazo móvil de llaves de auto en Filadelfia para llaves dañadas, rotas, gastadas o extraviadas.',30,true),
('es','key-fob-programming','Programación de llaveros','Soporte de programación para muchos controles remotos, smart keys y llaveros push-to-start.','Muchos vehículos modernos necesitan programar el control, transponder o smart key antes de arrancar. Planetlocksmiths ofrece soporte móvil de programación para muchos llaveros y sistemas remotos.','Programación de llaveros en Filadelfia | Planetlocksmiths','Programación móvil de llaveros en Filadelfia para muchos controles, smart keys y llaveros push-to-start.',40,true),
('es','transponder-key-programming','Programación de llave transponder','Programación de llaves con chip para muchos vehículos con inmovilizador antirrobo.','Las llaves transponder necesitan programación correcta para comunicarse con el inmovilizador del vehículo. Planetlocksmiths ayuda con muchas situaciones de llaves con chip y llaves transponder.','Programación de llave transponder en Filadelfia | Planetlocksmiths','Programación móvil de llaves transponder en Filadelfia para muchas llaves con chip y sistemas inmovilizadores.',50,true),
('es','ignition-key-issues','Problemas con llave de encendido','Ayuda cuando la llave no gira, se queda atascada o el sistema de encendido causa problemas.','Si la llave no gira, el encendido se siente trabado o la llave está atascada, el problema puede estar en la llave, cilindro o sistema de seguridad. Planetlocksmiths puede revisar la situación y recomendar el siguiente paso seguro.','Problemas de llave de encendido en Filadelfia | Planetlocksmiths','Ayuda móvil para problemas de llave de encendido en Filadelfia, llaves atascadas, llave que no gira y llaves gastadas.',60,true),
('es','emergency-mobile-service','Cerrajero móvil de emergencia','Respuesta móvil urgente para bloqueos, llaves perdidas y fallas de llave.','Cuando el problema no puede esperar, Planetlocksmiths se enfoca en servicio móvil de cerrajería automotriz de emergencia en Filadelfia. Llama o solicita servicio con los datos del vehículo y ubicación exacta.','Cerrajero móvil de emergencia en Filadelfia | Planetlocksmiths','Servicio móvil 24/7 de cerrajería automotriz en Filadelfia para bloqueos, llaves perdidas, reemplazos y urgencias.',70,true),
('es','motorcycle-key-service','Servicio de llave para motocicleta','Asistencia móvil para muchas situaciones de llaves y cerraduras de motocicleta.','Planetlocksmiths puede ayudar con muchas situaciones de llaves de motocicleta según el tipo de cerradura, disponibilidad de código y configuración del vehículo. Envía marca, modelo, año y problema para revisar la solicitud.','Servicio de llave de motocicleta en Filadelfia | Planetlocksmiths','Servicio móvil de llaves de motocicleta en Filadelfia para muchas situaciones de llave y cerradura.',80,true);

-- Service areas

delete from public.areas where locale in ('en', 'es');

insert into public.areas (
  locale,
  slug,
  city,
  state,
  title,
  intro,
  highlights,
  supported_services,
  seo_title,
  seo_description,
  sort_order,
  is_published
) values
('en','philadelphia','Philadelphia','PA','Mobile Automotive Locksmith in Philadelphia','Mobile automotive locksmith service across Philadelphia for lockouts, lost keys, replacement keys, key fob programming, and urgent vehicle access issues.',array['24/7 mobile response','Automotive key and fob support','Lockout and lost key help','Same-day availability when possible'],array['Car lockout','Lost car key replacement','Key fob programming','Transponder keys','Ignition key issues'],'Mobile Automotive Locksmith Philadelphia | Planetlocksmiths','24/7 mobile automotive locksmith service in Philadelphia for lockouts, lost keys, key fobs, programming, and ignition key issues.',10,true),
('en','center-city','Center City','PA','Automotive Locksmith in Center City Philadelphia','Mobile locksmith help for drivers in Center City, including lockouts, lost keys, key fobs, and urgent car key problems near apartments, offices, garages, and street parking.',array['Downtown mobile service','Garage and street parking help','Fast lockout response','Car key and fob support'],array['Car lockout','Lost car keys','Fob programming','Emergency mobile service'],'Center City Automotive Locksmith | Planetlocksmiths','Mobile automotive locksmith service in Center City Philadelphia for car lockouts, lost keys, key fobs, and urgent service.',20,true),
('en','south-philadelphia','South Philadelphia','PA','Automotive Locksmith in South Philadelphia','Mobile car locksmith service for South Philadelphia drivers dealing with locked keys, lost keys, key fob issues, and replacement key requests.',array['South Philly coverage','Mobile key service','Emergency lockout help','Replacement and programming support'],array['Car lockout','Replacement keys','Transponder programming','Emergency service'],'South Philadelphia Automotive Locksmith | Planetlocksmiths','Mobile automotive locksmith in South Philadelphia for lockouts, lost keys, replacement keys, and key programming.',30,true),
('en','northeast-philadelphia','Northeast Philadelphia','PA','Automotive Locksmith in Northeast Philadelphia','Mobile automotive locksmith response for Northeast Philadelphia, including lockouts, lost keys, remotes, fobs, and key programming support.',array['Northeast Philadelphia service','Mobile car key help','Urgent lockout response','Fob and transponder support'],array['Car lockout','Lost keys','Key fobs','Transponder keys'],'Northeast Philadelphia Automotive Locksmith | Planetlocksmiths','Mobile automotive locksmith service in Northeast Philadelphia for lockouts, lost keys, fobs, and programming.',40,true),
('en','west-philadelphia','West Philadelphia','PA','Automotive Locksmith in West Philadelphia','Mobile help for West Philadelphia drivers needing car lockout service, lost key replacement, key fob programming, and urgent automotive locksmith support.',array['West Philadelphia coverage','Mobile-only convenience','Lockout and lost key help','Same-day availability'],array['Car lockout','Lost car keys','Fob programming','Emergency mobile service'],'West Philadelphia Automotive Locksmith | Planetlocksmiths','Mobile automotive locksmith in West Philadelphia for lockouts, lost keys, replacement keys, and programming support.',50,true),
('en','fishtown','Fishtown','PA','Automotive Locksmith in Fishtown','Mobile locksmith service for Fishtown drivers, including car lockouts, lost car keys, replacement keys, key fobs, and emergency automotive requests.',array['Fishtown mobile service','Fast vehicle access help','Modern key support','Emergency availability'],array['Car lockout','Replacement keys','Key fob programming','Emergency service'],'Fishtown Automotive Locksmith | Planetlocksmiths','Mobile automotive locksmith in Fishtown for lockouts, lost keys, key fobs, and urgent service.',60,true),
('en','university-city','University City','PA','Automotive Locksmith in University City','Mobile automotive locksmith service around University City for lockouts, lost keys, key fobs, and vehicle access problems near campuses, garages, and apartments.',array['University City coverage','Campus and garage access help','Mobile key support','Urgent lockout response'],array['Car lockout','Lost keys','Fobs','Transponder keys'],'University City Automotive Locksmith | Planetlocksmiths','Mobile automotive locksmith in University City Philadelphia for car lockouts, lost keys, fobs, and programming.',70,true),
('en','manayunk','Manayunk','PA','Automotive Locksmith in Manayunk','Mobile car locksmith support in Manayunk for lockouts, missing keys, replacement key requests, key fobs, and ignition key issues.',array['Manayunk service area','Mobile vehicle help','Replacement key support','Emergency lockouts'],array['Car lockout','Car key replacement','Fob programming','Ignition key issues'],'Manayunk Automotive Locksmith | Planetlocksmiths','Mobile automotive locksmith in Manayunk for lockouts, replacement keys, fobs, and ignition key problems.',80,true),

('es','philadelphia','Filadelfia','PA','Cerrajero automotriz móvil en Filadelfia','Servicio móvil de cerrajería automotriz en Filadelfia para bloqueos, llaves perdidas, reemplazo de llaves, programación de llaveros y acceso urgente al vehículo.',array['Respuesta móvil 24/7','Soporte de llaves y llaveros','Ayuda con bloqueos y llaves perdidas','Disponibilidad el mismo día cuando sea posible'],array['Bloqueo de auto','Reemplazo de llave perdida','Programación de llaveros','Llaves transponder','Problemas de encendido'],'Cerrajero automotriz móvil en Filadelfia | Planetlocksmiths','Servicio móvil 24/7 de cerrajería automotriz en Filadelfia para bloqueos, llaves perdidas, llaveros, programación y encendido.',10,true),
('es','center-city','Center City','PA','Cerrajero automotriz en Center City Philadelphia','Ayuda móvil para conductores en Center City, incluyendo bloqueos, llaves perdidas, llaveros y problemas urgentes de llave cerca de apartamentos, oficinas, garajes y estacionamiento.',array['Servicio móvil en el centro','Ayuda en garajes y estacionamiento','Respuesta rápida para bloqueos','Soporte de llaves y llaveros'],array['Bloqueo de auto','Llaves perdidas','Programación de llaveros','Servicio móvil urgente'],'Cerrajero automotriz Center City | Planetlocksmiths','Cerrajero automotriz móvil en Center City Philadelphia para bloqueos, llaves perdidas, llaveros y servicio urgente.',20,true),
('es','south-philadelphia','South Philadelphia','PA','Cerrajero automotriz en South Philadelphia','Servicio móvil para conductores de South Philadelphia con llaves encerradas, llaves perdidas, problemas de llavero y reemplazo de llave.',array['Cobertura South Philly','Servicio móvil de llaves','Ayuda urgente con bloqueos','Reemplazo y programación'],array['Bloqueo de auto','Reemplazo de llaves','Programación transponder','Emergencia móvil'],'Cerrajero automotriz South Philadelphia | Planetlocksmiths','Cerrajero automotriz móvil en South Philadelphia para bloqueos, llaves perdidas, reemplazo y programación.',30,true),
('es','northeast-philadelphia','Northeast Philadelphia','PA','Cerrajero automotriz en Northeast Philadelphia','Respuesta móvil de cerrajería automotriz para Northeast Philadelphia, incluyendo bloqueos, llaves perdidas, controles, llaveros y programación.',array['Servicio Northeast Philadelphia','Ayuda móvil para llaves','Respuesta urgente para bloqueos','Soporte fob y transponder'],array['Bloqueo de auto','Llaves perdidas','Llaveros','Llaves transponder'],'Cerrajero automotriz Northeast Philadelphia | Planetlocksmiths','Servicio móvil de cerrajería automotriz en Northeast Philadelphia para bloqueos, llaves perdidas, llaveros y programación.',40,true),
('es','west-philadelphia','West Philadelphia','PA','Cerrajero automotriz en West Philadelphia','Ayuda móvil para conductores de West Philadelphia que necesitan servicio de bloqueo, reemplazo de llave perdida, programación de llavero y soporte urgente.',array['Cobertura West Philadelphia','Conveniencia móvil','Ayuda con bloqueos y llaves perdidas','Disponibilidad el mismo día'],array['Bloqueo de auto','Llaves perdidas','Programación de llaveros','Servicio móvil urgente'],'Cerrajero automotriz West Philadelphia | Planetlocksmiths','Cerrajero automotriz móvil en West Philadelphia para bloqueos, llaves perdidas, reemplazo y programación.',50,true),
('es','fishtown','Fishtown','PA','Cerrajero automotriz en Fishtown','Servicio móvil para conductores de Fishtown, incluyendo bloqueos de auto, llaves perdidas, reemplazo de llaves, llaveros y solicitudes urgentes.',array['Servicio móvil Fishtown','Ayuda rápida de acceso','Soporte de llaves modernas','Disponibilidad urgente'],array['Bloqueo de auto','Reemplazo de llaves','Programación de llaveros','Servicio urgente'],'Cerrajero automotriz Fishtown | Planetlocksmiths','Cerrajero automotriz móvil en Fishtown para bloqueos, llaves perdidas, llaveros y servicio urgente.',60,true),
('es','university-city','University City','PA','Cerrajero automotriz en University City','Servicio móvil alrededor de University City para bloqueos, llaves perdidas, llaveros y problemas de acceso cerca de campus, garajes y apartamentos.',array['Cobertura University City','Ayuda en campus y garajes','Soporte móvil de llaves','Respuesta urgente'],array['Bloqueo de auto','Llaves perdidas','Llaveros','Llaves transponder'],'Cerrajero automotriz University City | Planetlocksmiths','Cerrajero automotriz móvil en University City Philadelphia para bloqueos, llaves perdidas, llaveros y programación.',70,true),
('es','manayunk','Manayunk','PA','Cerrajero automotriz en Manayunk','Soporte móvil en Manayunk para bloqueos, llaves extraviadas, reemplazo de llave, llaveros y problemas de llave de encendido.',array['Área Manayunk','Ayuda móvil para vehículos','Soporte de reemplazo de llave','Bloqueos urgentes'],array['Bloqueo de auto','Reemplazo de llave','Programación de llaveros','Problemas de encendido'],'Cerrajero automotriz Manayunk | Planetlocksmiths','Cerrajero automotriz móvil en Manayunk para bloqueos, reemplazo de llaves, llaveros y problemas de encendido.',80,true);

-- FAQ

delete from public.faq_items where locale in ('en', 'es');

insert into public.faq_items (locale, question, answer, sort_order, is_published) values
('en','Do you provide 24/7 automotive locksmith service?','Yes. Planetlocksmiths is positioned for 24/7 mobile automotive locksmith requests across Philadelphia. Availability can depend on technician schedule, vehicle type, location, and service complexity.',10,true),
('en','Can you help if my keys are locked inside the car?','Yes. Car lockout service is one of the main mobile services. Provide your exact location, vehicle year, make, and model so the technician can prepare the right access method.',20,true),
('en','Can you replace a lost car key if I have no spare?','In many cases, yes. The process depends on the vehicle year, make, model, key type, and security system. Send your vehicle details before dispatch so compatibility can be checked.',30,true),
('en','Do you program key fobs and transponder keys?','Yes, programming support is available for many remote keys, smart keys, push-to-start fobs, and transponder keys. Some vehicles require dealer-level procedures or special authorization.',40,true),
('en','Do I need to bring the vehicle somewhere?','No. The service is mobile. The technician comes to the vehicle location when the job is accepted and scheduled.',50,true),
('en','What information should I send before service?','Send your name, phone number, exact location, vehicle year/make/model, key situation, and whether the key is lost, locked in, broken, or not programming.',60,true),
('en','Can you give an exact price online?','A final quote depends on vehicle details, key type, programming requirements, time, location, and whether the vehicle has additional security restrictions. The request form helps prepare an accurate estimate.',70,true),
('en','Do you work on house locks?','Planetlocksmiths is focused on mobile automotive locksmith service. If residential or commercial service is added later, it should be listed separately in the services section.',80,true),

('es','¿Ofrecen servicio de cerrajería automotriz 24/7?','Sí. Planetlocksmiths está orientado a solicitudes móviles de cerrajería automotriz 24/7 en Filadelfia. La disponibilidad puede depender del horario, tipo de vehículo, ubicación y complejidad del servicio.',10,true),
('es','¿Pueden ayudar si las llaves están dentro del auto?','Sí. El desbloqueo de auto es uno de los servicios móviles principales. Envía tu ubicación exacta, año, marca y modelo para preparar el método correcto.',20,true),
('es','¿Pueden reemplazar una llave perdida si no tengo copia?','En muchos casos, sí. Depende del año, marca, modelo, tipo de llave y sistema de seguridad. Envía los datos del vehículo antes del despacho para revisar compatibilidad.',30,true),
('es','¿Programan llaveros y llaves transponder?','Sí, hay soporte de programación para muchos controles, smart keys, llaveros push-to-start y llaves transponder. Algunos vehículos requieren procedimientos de concesionario o autorización especial.',40,true),
('es','¿Tengo que llevar el vehículo a algún lugar?','No. El servicio es móvil. El técnico va a la ubicación del vehículo cuando el trabajo se acepta y se programa.',50,true),
('es','¿Qué información debo enviar antes del servicio?','Envía tu nombre, teléfono, ubicación exacta, año/marca/modelo del vehículo, situación de la llave y si está perdida, encerrada, rota o no programa.',60,true),
('es','¿Pueden dar un precio exacto en línea?','La cotización final depende del vehículo, tipo de llave, programación, horario, ubicación y restricciones de seguridad. El formulario ayuda a preparar una estimación más precisa.',70,true),
('es','¿Trabajan con cerraduras de casas?','Planetlocksmiths está enfocado en cerrajería automotriz móvil. Si se agregan servicios residenciales o comerciales después, deben aparecer por separado en la sección de servicios.',80,true);

-- Reviews / testimonials: starter copy. Replace with real customer reviews before final public launch.

delete from public.reviews where locale in ('en', 'es');

insert into public.reviews (locale, name, rating, quote, city, sort_order, is_published) values
('en','Recent customer',5,'Fast communication, mobile arrival, and clear explanation of the key replacement process.', 'Philadelphia, PA',10,true),
('en','Philadelphia driver',5,'Helpful service when the key fob stopped working and I needed a practical next step.', 'Philadelphia, PA',20,true),
('en','Local vehicle owner',5,'The technician explained what was possible for my vehicle before starting the job.', 'Philadelphia, PA',30,true),
('en','Emergency request',5,'Good option when you are locked out and need mobile automotive locksmith help.', 'Philadelphia, PA',40,true),

('es','Cliente reciente',5,'Comunicación rápida, llegada móvil y explicación clara del proceso de reemplazo de llave.', 'Filadelfia, PA',10,true),
('es','Conductor local',5,'Buen servicio cuando el llavero dejó de funcionar y necesitaba una solución práctica.', 'Filadelfia, PA',20,true),
('es','Dueño de vehículo',5,'El técnico explicó qué era posible para mi vehículo antes de comenzar el trabajo.', 'Filadelfia, PA',30,true),
('es','Solicitud urgente',5,'Buena opción cuando no puedes abrir el auto y necesitas ayuda móvil automotriz.', 'Filadelfia, PA',40,true);

-- Content blocks for about and local proof pages.

delete from public.site_content_blocks where locale in ('en', 'es');

insert into public.site_content_blocks (
  locale,
  page_key,
  slot,
  eyebrow,
  title,
  body,
  items,
  cta_label,
  cta_href,
  sort_order,
  is_published
) values
('en','about','story','Mobile automotive locksmith','Built for drivers who need help where the vehicle is parked','Planetlocksmiths is a mobile automotive locksmith service focused on vehicle access, replacement keys, key fobs, transponder programming support, and urgent key problems across Philadelphia. The service model is simple: collect the vehicle details, prepare the right tools, and come to the vehicle location when the request is accepted.', '["Automotive-focused service", "Mobile response across Philadelphia", "Lockouts, lost keys, fobs, programming", "Clear request-to-arrival communication"]'::jsonb, 'Request Service', '/en/contact#request-service', 10, true),
('en','about','process','How service works','A clean dispatch process for urgent key problems','Send the vehicle year, make, model, location, and what happened. The request is reviewed for compatibility, availability, and the most practical service path before the job is confirmed.', '["Send vehicle details", "Confirm location and key situation", "Prepare tools and key options", "Technician arrives at the vehicle"]'::jsonb, 'View Services', '/en/services', 20, true),
('en','services','intro','Services','Automotive locksmith services built around mobile response','From emergency lockouts to replacement keys and fob programming, Planetlocksmiths focuses on automotive locksmith requests that can be handled at the vehicle location whenever possible.', '["Car lockout service", "Lost car key replacement", "Key fob programming", "Transponder key support", "Ignition key issues"]'::jsonb, 'Request Service', '/en/contact#request-service', 10, true),
('en','areas','intro','Coverage','Mobile service across Philadelphia neighborhoods','Planetlocksmiths covers Philadelphia with mobile automotive locksmith service for drivers at home, work, parking garages, apartments, campuses, and roadside locations.', '["Philadelphia", "Center City", "South Philadelphia", "Northeast Philadelphia", "West Philadelphia", "Fishtown", "University City", "Manayunk"]'::jsonb, 'Request Service', '/en/contact#request-service', 10, true),

('es','about','story','Cerrajero automotriz móvil','Hecho para conductores que necesitan ayuda donde está el vehículo','Planetlocksmiths es un servicio móvil de cerrajería automotriz enfocado en acceso al vehículo, reemplazo de llaves, llaveros, programación transponder y problemas urgentes de llave en Filadelfia.', '["Servicio enfocado en autos", "Respuesta móvil en Filadelfia", "Bloqueos, llaves perdidas, llaveros, programación", "Comunicación clara desde la solicitud"]'::jsonb, 'Solicitar servicio', '/es/contact#request-service', 10, true),
('es','about','process','Cómo funciona','Proceso claro para problemas urgentes de llave','Envía año, marca, modelo, ubicación y lo que ocurrió. La solicitud se revisa por compatibilidad, disponibilidad y la mejor ruta de servicio antes de confirmar el trabajo.', '["Enviar datos del vehículo", "Confirmar ubicación y situación", "Preparar herramientas y opciones", "El técnico llega al vehículo"]'::jsonb, 'Ver servicios', '/es/services', 20, true),
('es','services','intro','Servicios','Cerrajería automotriz con respuesta móvil','Desde bloqueos de emergencia hasta reemplazo de llaves y programación de llaveros, Planetlocksmiths se enfoca en solicitudes automotrices que pueden atenderse en la ubicación del vehículo cuando sea posible.', '["Bloqueo de auto", "Reemplazo de llave perdida", "Programación de llaveros", "Llaves transponder", "Problemas de encendido"]'::jsonb, 'Solicitar servicio', '/es/contact#request-service', 10, true),
('es','areas','intro','Cobertura','Servicio móvil en vecindarios de Filadelfia','Planetlocksmiths cubre Filadelfia con servicio móvil de cerrajería automotriz para conductores en casa, trabajo, garajes, apartamentos, campus y ubicaciones en carretera.', '["Filadelfia", "Center City", "South Philadelphia", "Northeast Philadelphia", "West Philadelphia", "Fishtown", "University City", "Manayunk"]'::jsonb, 'Solicitar servicio', '/es/contact#request-service', 10, true);
