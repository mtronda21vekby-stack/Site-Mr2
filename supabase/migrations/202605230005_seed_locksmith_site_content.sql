-- Production content for Planet Locksmiths.
-- Applies full-scope locksmith website copy to the Supabase CMS tables.
-- Run after 202605230004_site_background_settings.sql.

-- Keep existing logo, background, images, and orders. This only replaces public business copy.

update public.site_settings
set
  brand_name = 'Planet Locksmiths',
  logo_alt = coalesce(nullif(logo_alt, ''), 'Planet Locksmiths logo'),
  email = coalesce(nullif(email, ''), 'planetlocksmits@gmail.com'),
  service_hours = coalesce(nullif(service_hours, ''), '24/7 Emergency Locksmith Service')
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
  '24/7 Emergency, Residential, Commercial & Automotive Locksmith Services',
  'Locked out of a car, home, office, or business door? Need car key programming, lock repair, rekey service, smart lock installation, safe opening, mailbox lock service, or commercial access support? Planet Locksmiths provides mobile locksmith service across Philadelphia.',
  'Call Now',
  'Request Service',
  'Locked out or need locksmith help right now?',
  'Request fast mobile locksmith help for car lockouts, all keys lost, residential lockouts, commercial locks, rekeys, key fobs, access control, safe opening, mailbox locks, and urgent lock problems across Philadelphia.',
  'What customers value',
  'Locksmith Questions',
  'Book Mobile Locksmith Service',
  'Send your name, phone number, service type, location, and what happened. For vehicle, home, business, safe, mailbox, or access-control service, include the details that help confirm the right next step.'
),
(
  'es',
  'Cerrajeria 24/7 de emergencia, residencial, comercial y automotriz',
  'Servicio movil para autos, casas, oficinas, negocios, rekeys, programacion de llaves, smart locks, cajas fuertes, buzones y access control en Philadelphia.',
  'Llamar ahora',
  'Solicitar servicio',
  'Necesitas cerrajero ahora?',
  'Solicita ayuda movil para bloqueos de auto, llaves perdidas, casas, negocios, rekeys, key fobs, access control, cajas fuertes, buzones y problemas urgentes en Philadelphia.',
  'Lo que valoran los clientes',
  'Preguntas de cerrajeria',
  'Solicitar cerrajero movil',
  'Envia nombre, telefono, tipo de servicio, ubicacion y lo que ocurrio. Para auto, casa, negocio, caja fuerte, buzon o access control, agrega detalles para confirmar el proximo paso.'
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
)
select
  locale,
  slug,
  title,
  excerpt,
  excerpt,
  title || ' Philadelphia | Planet Locksmiths',
  excerpt,
  sort_order,
  true
from (
  values
  ('en','car-lockout','Car Lockout Service','Mobile help when keys are locked inside the vehicle or the vehicle will not open.',10),
  ('en','key-duplication','Key Duplication','Duplicate key support for automotive, residential, and commercial key situations.',20),
  ('en','car-key-programming','Car Key Programming','Programming support for many vehicle keys, chip keys, remotes, and smart keys.',30),
  ('en','all-keys-lost','All Keys Lost Service','Help when every working key is lost, stolen, broken, or no longer usable.',40),
  ('en','ignition-repair','Ignition Repair','Assistance when the ignition is stuck, worn, damaged, or the key will not turn.',50),
  ('en','ignition-replacement','Ignition Replacement','Ignition replacement help when repair is not the practical next step.',60),
  ('en','lock-repair','Lock Repair','Repair help for damaged, sticking, loose, or unreliable locks.',70),
  ('en','lock-replacement','Lock Replacement','Lock replacement for damaged, outdated, failed, or security-sensitive locks.',80),
  ('en','rekey-service','Rekey Service','Rekey existing locks so old keys stop working while hardware can stay in place.',90),
  ('en','broken-key-extraction','Broken Key Extraction','Removal support when a key breaks in a door, ignition, trunk, or lock cylinder.',100),
  ('en','commercial-locksmith','Commercial Locksmith Service','Locksmith support for offices, storefronts, service doors, and business access needs.',110),
  ('en','emergency-locksmith-24-7','Emergency Locksmith Service 24/7','Urgent locksmith service for lockouts, lost keys, broken keys, and access problems.',120),
  ('en','smart-lock-installation','Smart Lock Installation','Smart lock installation support for compatible residential and commercial doors.',130),
  ('en','mailbox-lock-service','Mailbox Lock Service','Mailbox lock replacement and access support when keys are lost or locks fail.',140),
  ('en','safe-opening','Safe Opening','Safe opening help for locked, jammed, or forgotten-combination situations.',150),
  ('en','house-lockout','House Lockout Service','Residential lockout help when you cannot access your home, apartment, or room.',160),
  ('en','key-fob-programming','FOB Programming','Programming support for many key fobs, remotes, smart keys, and push-to-start keys.',170),
  ('en','remote-start-diagnostics','Remote Start Diagnostics','Diagnostics for remote start, remote key, and vehicle start-control issues.',180),
  ('en','transponder-key-programming','Transponder Key Programming','Chip key programming for many vehicles with immobilizer security systems.',190),
  ('en','key-fob-repair','Key Fob Repair','Help with damaged, unreliable, or non-responding key fobs when repair is practical.',200),
  ('en','push-to-start-key-programming','Push To Start Key Programming','Programming support for many smart keys used with push-to-start vehicles.',210),
  ('en','oem-key-replacement','OEM Key Replacement','OEM-style replacement key options when the correct key type is available.',220),
  ('en','aftermarket-key-fob-programming','Aftermarket Key Programming','Programming support for compatible aftermarket keys, key fobs, and remotes.',230),
  ('en','door-lock-installation','Door Lock Installation','Door lock installation for homes, apartments, offices, storefronts, and service doors.',240),
  ('en','access-control','Access Control Service','Access control service for business entry, controlled doors, and security upgrades.',250),
  ('en','master-key-system','Master Key System','Master key planning and setup for businesses, properties, and managed doors.',260),
  ('en','panic-bar-installation','Panic Bar Installation','Panic bar installation and replacement support for commercial exit doors.',270),
  ('en','high-security-lock-installation','High Security Lock Installation','High-security lock installation for stronger key control and improved resistance.',280),
  ('en','residential-locksmith','Residential Locksmith Service','Residential locksmith help for lockouts, rekeys, lock changes, smart locks, and repairs.',290),
  ('en','automotive-locksmith','Automotive Locksmith Service','Automotive locksmith support for lockouts, keys, fobs, programming, and ignition issues.',300),

  ('es','car-lockout','Bloqueo de automovil','Ayuda movil cuando las llaves estan dentro del vehiculo o el auto no abre.',10),
  ('es','key-duplication','Duplicacion de llaves','Soporte para copias de llaves automotrices, residenciales y comerciales.',20),
  ('es','car-key-programming','Programacion de llave de auto','Programacion para muchas llaves de vehiculo, chip keys, controles y smart keys.',30),
  ('es','all-keys-lost','Todas las llaves perdidas','Ayuda cuando ninguna llave funciona o todas se perdieron, rompieron o fueron robadas.',40),
  ('es','ignition-repair','Reparacion de ignicion','Ayuda cuando la ignicion esta trabada, gastada, danada o la llave no gira.',50),
  ('es','ignition-replacement','Reemplazo de ignicion','Ayuda con reemplazo de ignicion cuando la reparacion no es practica.',60),
  ('es','lock-repair','Reparacion de cerraduras','Reparacion para cerraduras danadas, flojas, trabadas o poco confiables.',70),
  ('es','lock-replacement','Reemplazo de cerraduras','Reemplazo de cerraduras danadas, antiguas, falladas o sensibles de seguridad.',80),
  ('es','rekey-service','Servicio de rekey','Rekey para que llaves antiguas dejen de funcionar sin cambiar todo el hardware.',90),
  ('es','broken-key-extraction','Extraccion de llave rota','Extraccion cuando una llave se rompe en puerta, ignicion, baul o cilindro.',100),
  ('es','commercial-locksmith','Cerrajero comercial','Soporte para oficinas, tiendas, puertas de servicio y necesidades de acceso comercial.',110),
  ('es','emergency-locksmith-24-7','Cerrajero de emergencia 24/7','Atencion urgente para bloqueos, llaves perdidas, llaves rotas y problemas de acceso.',120),
  ('es','smart-lock-installation','Instalacion de smart locks','Instalacion de smart locks compatibles para puertas residenciales y comerciales.',130),
  ('es','mailbox-lock-service','Servicio de cerradura de buzon','Reemplazo y acceso para buzones cuando la llave se pierde o la cerradura falla.',140),
  ('es','safe-opening','Apertura de cajas fuertes','Ayuda para cajas fuertes bloqueadas, trabadas o con combinacion olvidada.',150),
  ('es','house-lockout','Bloqueo de casa','Ayuda residencial cuando no puedes entrar a casa, apartamento o habitacion.',160),
  ('es','key-fob-programming','Programacion de FOB','Programacion para muchos key fobs, controles, smart keys y push-to-start.',170),
  ('es','remote-start-diagnostics','Diagnostico de remote start','Diagnostico para remote start, control remoto y fallas de arranque remoto.',180),
  ('es','transponder-key-programming','Programacion de llave transponder','Programacion de llaves con chip para vehiculos con inmovilizador.',190),
  ('es','key-fob-repair','Reparacion de key fob','Ayuda con controles danados, inestables o que no responden cuando reparar es practico.',200),
  ('es','push-to-start-key-programming','Programacion push to start','Programacion para muchas smart keys de vehiculos push-to-start.',210),
  ('es','oem-key-replacement','Reemplazo de llave OEM','Opciones de llave estilo OEM cuando el tipo correcto esta disponible.',220),
  ('es','aftermarket-key-fob-programming','Programacion de llave aftermarket','Programacion de llaves, controles y fobs aftermarket compatibles.',230),
  ('es','door-lock-installation','Instalacion de cerraduras de puerta','Instalacion para casas, apartamentos, oficinas, tiendas y puertas de servicio.',240),
  ('es','access-control','Servicio de access control','Access control para entradas de negocio, puertas controladas y mejoras de seguridad.',250),
  ('es','master-key-system','Sistema master key','Planeacion y configuracion de master key para negocios, propiedades y puertas administradas.',260),
  ('es','panic-bar-installation','Instalacion de panic bar','Instalacion y reemplazo de panic bars para salidas comerciales.',270),
  ('es','high-security-lock-installation','Instalacion de cerradura de alta seguridad','Cerraduras de alta seguridad para mejor control de llaves y proteccion.',280),
  ('es','residential-locksmith','Cerrajero residencial','Ayuda residencial para bloqueos, rekeys, cambios de cerradura, smart locks y reparaciones.',290),
  ('es','automotive-locksmith','Cerrajero automotriz','Soporte automotriz para bloqueos, llaves, fobs, programacion e ignicion.',300)
) as service_rows(locale, slug, title, excerpt, sort_order);

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
)
select
  locale,
  slug,
  city,
  'PA',
  case
    when locale = 'es' then 'Cerrajero movil en ' || city
    else 'Mobile Locksmith in ' || city
  end,
  case
    when locale = 'es' then 'Servicio movil de cerrajeria en ' || city || ' para emergencias, autos, hogares, negocios, rekeys, cajas fuertes, buzones y access control.'
    else 'Mobile locksmith service in ' || city || ' for emergency, automotive, residential, commercial, rekey, safe, mailbox, and access-control needs.'
  end,
  case
    when locale = 'es' then array['Servicio de emergencia 24/7', 'Auto, casa y negocio', 'Rekeys, cerraduras y llaves', 'Smart locks y access control']
    else array['24/7 emergency locksmith', 'Car, home, and business service', 'Rekeys, locks, and keys', 'Smart locks and access control']
  end,
  case
    when locale = 'es' then array['Cerrajero de emergencia 24/7', 'Bloqueo de automovil', 'Bloqueo de casa', 'Rekey', 'Cerrajero comercial', 'Cerrajero residencial', 'Access control', 'Apertura de cajas fuertes']
    else array['Emergency locksmith 24/7', 'Car lockout service', 'House lockout service', 'Rekey service', 'Commercial locksmith', 'Residential locksmith', 'Access control service', 'Safe opening']
  end,
  case
    when locale = 'es' then 'Cerrajero movil en ' || city || ' | Planet Locksmiths'
    else 'Mobile Locksmith in ' || city || ' | Planet Locksmiths'
  end,
  case
    when locale = 'es' then 'Servicio movil de cerrajeria en ' || city || ' para emergencias, autos, hogares, negocios, rekeys, cajas fuertes y access control.'
    else 'Mobile locksmith service in ' || city || ' for emergencies, cars, homes, businesses, rekeys, safes, mailbox locks, and access control.'
  end,
  sort_order,
  true
from (
  values
  ('en','philadelphia','Philadelphia',10),
  ('en','center-city','Center City Philadelphia',20),
  ('en','south-philadelphia','South Philadelphia',30),
  ('en','northeast-philadelphia','Northeast Philadelphia',40),
  ('en','west-philadelphia','West Philadelphia',50),
  ('en','fishtown','Fishtown',60),
  ('en','university-city','University City Philadelphia',70),
  ('en','manayunk','Manayunk',80),
  ('es','philadelphia','Philadelphia',10),
  ('es','center-city','Center City Philadelphia',20),
  ('es','south-philadelphia','South Philadelphia',30),
  ('es','northeast-philadelphia','Northeast Philadelphia',40),
  ('es','west-philadelphia','West Philadelphia',50),
  ('es','fishtown','Fishtown',60),
  ('es','university-city','University City Philadelphia',70),
  ('es','manayunk','Manayunk',80)
) as area_rows(locale, slug, city, sort_order);

-- FAQ

delete from public.faq_items where locale in ('en', 'es');

insert into public.faq_items (locale, question, answer, sort_order, is_published) values
('en','Do you offer 24/7 emergency locksmith service?','Yes. Planet Locksmiths provides 24/7 emergency locksmith service for lockouts, lost keys, broken keys, rekeys, lock repair, and access problems. Availability can depend on location, timing, authorization, parts, and job complexity.',10,true),
('en','Can you help with house lockouts?','Yes. House lockouts are part of the residential locksmith scope. Send the exact address, lock type if known, and authorization details so the service can be prepared correctly.',20,true),
('en','Do you program car keys and key fobs?','Yes. Programming support is available for many car keys, key fobs, transponder keys, smart keys, and push-to-start keys. Compatibility depends on year, make, model, key type, and vehicle security system.',30,true),
('en','Can you rekey locks instead of replacing them?','Often, yes. Rekeying can keep the existing hardware while making old keys stop working. Replacement may be recommended when the lock is damaged, worn out, or not a good security fit.',40,true),
('en','Do you work with commercial locks and access control?','Yes. Commercial locksmith service can include office locks, storefront doors, lock repair, master key systems, panic bars, high-security locks, and access-control service.',50,true),
('en','Can you install smart locks?','Yes. Smart lock installation is available for compatible residential and commercial doors. The correct setup depends on the door, existing hardware, power requirements, and lock model.',60,true),
('en','Can you open safes?','Safe opening service is available for many locked, jammed, or forgotten-combination situations. The next step depends on the safe type, lock condition, and access authorization.',70,true),
('en','Can you replace mailbox locks?','Yes. Mailbox lock service can include replacement or access help when keys are lost, the lock fails, or a property needs a new working key setup.',80,true),
('en','What should I do if all car keys are lost?','Call with the year, make, model, location, and key situation. Some vehicles require specific blanks, programming tools, or proof of authorization before service.',90,true),
('en','Do you repair broken or stuck keys?','Broken key extraction and lock repair are available for many doors, ignitions, trunks, mailboxes, and lock cylinders. The next step depends on the lock condition and access authorization.',100,true),

('es','Ofrecen servicio de cerrajeria de emergencia 24/7?','Si. Planet Locksmiths ofrece servicio de emergencia 24/7 para bloqueos, llaves perdidas, llaves rotas, rekeys, reparacion de cerraduras y problemas de acceso.',10,true),
('es','Pueden ayudar con bloqueos de casa?','Si. Los bloqueos de casa son parte del servicio residencial. Envia direccion exacta, tipo de cerradura si lo sabes y detalles de autorizacion.',20,true),
('es','Programan llaves de auto y key fobs?','Si. Hay soporte para muchas llaves de auto, key fobs, llaves transponder, smart keys y push-to-start.',30,true),
('es','Pueden hacer rekey en vez de reemplazar cerraduras?','A menudo, si. El rekey permite conservar el hardware existente y hacer que las llaves antiguas dejen de funcionar.',40,true),
('es','Trabajan con cerraduras comerciales y access control?','Si. El servicio comercial puede incluir cerraduras de oficina, puertas de tienda, reparacion, master key systems, panic bars y access control.',50,true),
('es','Pueden instalar smart locks?','Si. La instalacion de smart locks esta disponible para puertas residenciales y comerciales compatibles.',60,true),
('es','Pueden abrir cajas fuertes?','El servicio de apertura de caja fuerte esta disponible para muchas situaciones de cajas bloqueadas, trabadas o con combinacion olvidada.',70,true),
('es','Pueden reemplazar cerraduras de buzon?','Si. El servicio de cerradura de buzon puede incluir reemplazo o ayuda de acceso cuando se pierden las llaves o falla la cerradura.',80,true);

-- Reviews

delete from public.reviews where locale in ('en', 'es');

insert into public.reviews (locale, name, rating, quote, city, sort_order, is_published) values
('en','Car lockout and fob programming',5,'Good communication on a car lockout, and the key fob programming options were explained before the work started.', 'Philadelphia, PA',10,true),
('en','House lockout customer',5,'The request was handled clearly. I explained the house lockout, sent the address, and knew what to expect before service.', 'Philadelphia, PA',20,true),
('en','Rekey service',5,'Helpful rekey service after moving into a new place. The existing locks could stay, and the old keys no longer worked.', 'Philadelphia, PA',30,true),
('en','Smart lock installation',5,'The smart lock setup was explained clearly, including what worked with the existing door hardware.', 'Philadelphia, PA',40,true),
('en','Commercial access service',5,'They reviewed the business door issue and explained the lock repair and access-control options without rushing the decision.', 'Philadelphia, PA',50,true),
('en','Emergency locksmith call',5,'The after-hours lock problem was handled with clear communication about timing and what information was needed.', 'Philadelphia, PA',60,true),

('es','Bloqueo de auto y fob',5,'Buena comunicacion en un bloqueo de auto, y explicaron las opciones de programacion del key fob antes de empezar.', 'Philadelphia, PA',10,true),
('es','Cliente residencial',5,'La solicitud fue clara. Explique el bloqueo de casa, envie la direccion y supe que esperar antes del servicio.', 'Philadelphia, PA',20,true),
('es','Servicio de rekey',5,'Buen servicio de rekey despues de mudarme. Las cerraduras existentes pudieron quedarse y las llaves antiguas dejaron de funcionar.', 'Philadelphia, PA',30,true),
('es','Servicio comercial',5,'Revisaron el problema de la puerta del negocio y explicaron opciones de reparacion y access control sin apurar la decision.', 'Philadelphia, PA',40,true);

-- Content blocks for about, services, areas, contact, and legal support pages.

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
('en','about','story','Full-service locksmith','Mobile locksmith help for cars, homes, and businesses','Planet Locksmiths provides mobile locksmith service for vehicle access, house lockouts, commercial locks, rekeys, key programming, safe opening, mailbox locks, access control, and urgent lock problems across Philadelphia.', '["Automotive, residential, and commercial service", "Mobile response across Philadelphia", "Lockouts, lost keys, fobs, rekeys, and programming", "Clear service communication"]'::jsonb, 'Request Service', '/en/contact#request-service', 10, true),
('en','about','process','How service works','Clear communication before service begins','Send the service type, location, urgency, authorization details, and vehicle information when relevant. Service timing, parts, and next steps are confirmed before work begins.', '["Send service details", "Confirm location and urgency", "Prepare tools and parts", "Confirm next step before service"]'::jsonb, 'View Services', '/en/services', 20, true),
('en','services','intro','Services','Locksmith services with mobile response','From emergency lockouts to rekeys, key programming, safe opening, smart locks, access control, mailbox locks, and commercial hardware, Planet Locksmiths handles full-service mobile locksmith needs.', '["Emergency locksmith 24/7", "Car lockout service", "Residential locksmith", "Commercial locksmith", "Access control service"]'::jsonb, 'Request Service', '/en/contact#request-service', 10, true),
('en','areas','intro','Coverage','Mobile service across Philadelphia neighborhoods','Planet Locksmiths covers Philadelphia and nearby areas with mobile locksmith service for cars, homes, businesses, safes, mailboxes, and access systems.', '["Philadelphia", "Center City", "South Philadelphia", "Northeast Philadelphia", "West Philadelphia", "Fishtown", "University City", "Manayunk"]'::jsonb, 'Request Service', '/en/contact#request-service', 10, true),
('en','contact','service-info','Contact','Call or send service details','For urgent lockouts, lost keys, safe issues, business access problems, and residential lockouts, calling may be faster. The contact form can still collect details for scheduling and callback.', '["Service type", "Exact location", "Phone number", "Authorization details", "Vehicle details when relevant"]'::jsonb, 'Call Now', 'tel:+12676122555', 10, true),
('en','legal-privacy','hero','Customer information','Privacy Policy','This page explains how Planet Locksmiths handles information submitted through this website for mobile locksmith service.', '[]'::jsonb, null, null, 10, true),
('en','legal-terms','hero','Customer information','Terms of Service','These terms explain the basic conditions for using this website and submitting a mobile locksmith service request to Planet Locksmiths.', '[]'::jsonb, null, null, 10, true),

('es','about','story','Cerrajeria completa','Servicio movil para autos, hogares y negocios','Planet Locksmiths ofrece cerrajeria movil para acceso de vehiculos, bloqueos de casa, cerraduras comerciales, rekeys, programacion de llaves, cajas fuertes, buzones, access control y problemas urgentes en Philadelphia.', '["Servicio automotriz, residencial y comercial", "Respuesta movil en Philadelphia", "Bloqueos, llaves perdidas, fobs, rekeys y programacion", "Comunicacion clara de servicio"]'::jsonb, 'Solicitar servicio', '/es/contact#request-service', 10, true),
('es','about','process','Como funciona','Comunicacion clara antes del servicio','Envia tipo de servicio, ubicacion, urgencia, autorizacion y datos del vehiculo cuando aplique. Tiempo, piezas y siguiente paso se confirman antes de comenzar.', '["Enviar detalles del servicio", "Confirmar ubicacion y urgencia", "Preparar herramientas y piezas", "Confirmar siguiente paso"]'::jsonb, 'Ver servicios', '/es/services', 20, true),
('es','services','intro','Servicios','Cerrajeria movil completa','Desde emergencias hasta rekeys, programacion de llaves, cajas fuertes, smart locks, access control, buzones y hardware comercial, Planet Locksmiths cubre necesidades completas de cerrajeria movil.', '["Cerrajero de emergencia 24/7", "Bloqueo de automovil", "Cerrajero residencial", "Cerrajero comercial", "Access control"]'::jsonb, 'Solicitar servicio', '/es/contact#request-service', 10, true),
('es','areas','intro','Cobertura','Servicio movil en vecindarios de Philadelphia','Planet Locksmiths cubre Philadelphia y areas cercanas con cerrajeria movil para autos, hogares, negocios, cajas fuertes, buzones y sistemas de acceso.', '["Philadelphia", "Center City", "South Philadelphia", "Northeast Philadelphia", "West Philadelphia", "Fishtown", "University City", "Manayunk"]'::jsonb, 'Solicitar servicio', '/es/contact#request-service', 10, true),
('es','contact','service-info','Contacto','Llama o envia detalles del servicio','Para bloqueos urgentes, llaves perdidas, cajas fuertes, acceso comercial y bloqueos residenciales, llamar puede ser mas rapido. El formulario tambien puede recopilar detalles para coordinar.', '["Tipo de servicio", "Ubicacion exacta", "Telefono", "Detalles de autorizacion", "Datos del vehiculo cuando aplique"]'::jsonb, 'Llamar ahora', 'tel:+12676122555', 10, true),
('es','legal-privacy','hero','Informacion del cliente','Politica de privacidad','Esta pagina explica como Planet Locksmiths maneja la informacion enviada a traves del sitio para servicio movil de cerrajeria.', '[]'::jsonb, null, null, 10, true),
('es','legal-terms','hero','Informacion del cliente','Terminos de servicio','Estos terminos explican las condiciones basicas para usar este sitio y enviar una solicitud movil de cerrajeria a Planet Locksmiths.', '[]'::jsonb, null, null, 10, true);
