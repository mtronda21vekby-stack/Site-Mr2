insert into public.site_content_blocks
(locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, sort_order, is_published)
values
-- EN / FOOTER
('en', 'footer', 'brand', null, 'Planet Locksmiths', 'Planet Locksmiths provides 24/7 mobile locksmith service for car lockouts, key programming, rekeys, lock repair, lock replacement, residential, commercial, access control, safe opening, and emergency locksmith needs.', '["Call for urgent lockouts or send the service details, location, and contact information for scheduling."]'::jsonb, null, null, 10, true),
('en', 'footer', 'services', null, 'Locksmith services', null, '["Emergency locksmith 24/7", "Car lockout service", "Rekey service", "Commercial locksmith", "Residential locksmith"]'::jsonb, null, null, 20, true),
('en', 'footer', 'navigation', null, 'Customer information', null, '[]'::jsonb, 'Request Service', '/en/contact#request-service', 30, true),
('en', 'footer', 'legal', null, null, 'Service timing, authorization, parts, and final pricing are confirmed before work begins.', '["All rights reserved."]'::jsonb, null, null, 40, true),

-- ES / FOOTER
('es', 'footer', 'brand', null, 'Planet Locksmiths', 'Planet Locksmiths ofrece cerrajería móvil 24/7 para bloqueos, programación de llaves, rekeys, reparación, reemplazo, residencial, comercial, access control, cajas fuertes y emergencias.', '["Llama para urgencias o envía servicio, ubicación y datos de contacto para coordinar."]'::jsonb, null, null, 10, true),
('es', 'footer', 'services', null, 'Servicios de cerrajería', null, '["Cerrajero de emergencia 24/7", "Bloqueo de automóvil", "Rekey", "Cerrajero comercial", "Cerrajero residencial"]'::jsonb, null, null, 20, true),
('es', 'footer', 'navigation', null, 'Información al cliente', null, '[]'::jsonb, 'Solicitud', '/es/contact#request-service', 30, true),
('es', 'footer', 'legal', null, null, 'Tiempo de servicio, autorización, piezas y precio final se confirman antes de comenzar.', '["Todos los derechos reservados."]'::jsonb, null, null, 40, true),

-- RU / FOOTER
('ru', 'footer', 'brand', null, 'Planet Locksmiths', 'Planet Locksmiths provides 24/7 mobile locksmith service for car lockouts, key programming, rekeys, lock repair, lock replacement, residential, commercial, access control, safe opening, and emergency locksmith needs.', '["Call for urgent lockouts or send the service details, location, and contact information for scheduling."]'::jsonb, null, null, 10, true),
('ru', 'footer', 'services', null, 'Locksmith services', null, '["Emergency locksmith 24/7", "Car lockout service", "Rekey service", "Commercial locksmith", "Residential locksmith"]'::jsonb, null, null, 20, true),
('ru', 'footer', 'navigation', null, 'Информация клиенту', null, '[]'::jsonb, 'Заявка', '/ru/contact#request-service', 30, true),
('ru', 'footer', 'legal', null, null, 'Service timing, authorization, parts, and final pricing are confirmed before work begins.', '["Все права защищены."]'::jsonb, null, null, 40, true)
on conflict do nothing;
