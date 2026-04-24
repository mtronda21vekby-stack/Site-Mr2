insert into public.site_content_blocks
(locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, sort_order, is_published)
values
-- EN / FOOTER
('en', 'footer', 'brand', null, 'Planetlocksmiths', 'Planetlocksmiths provides mobile automotive locksmith request support for car lockouts, replacement keys, key fob programming, transponder keys, broken key extraction, and ignition-related help.', '["Mobile service availability, response time, and final pricing depend on location, vehicle, key type, parts availability, time, and job complexity."]'::jsonb, null, null, 10, true),
('en', 'footer', 'services', null, 'Automotive services', null, '["Car lockout service", "Car key replacement", "Key fob programming", "Transponder keys", "Ignition assistance"]'::jsonb, null, null, 20, true),
('en', 'footer', 'navigation', null, 'Customer information', null, '[]'::jsonb, 'Request Service', '/en/contact#request-service', 30, true),
('en', 'footer', 'legal', null, null, 'Submitting a request does not guarantee immediate availability. Service details should be confirmed before work begins.', '["All rights reserved."]'::jsonb, null, null, 40, true),

-- ES / FOOTER
('es', 'footer', 'brand', null, 'Planetlocksmiths', 'Planetlocksmiths ofrece soporte móvil de cerrajería automotriz para autos cerrados, reemplazo de llaves, programación de controles, llaves transponder, extracción de llave rota e ignición.', '["La disponibilidad, tiempo de respuesta y precio final dependen de ubicación, vehículo, tipo de llave, piezas, horario y complejidad."]'::jsonb, null, null, 10, true),
('es', 'footer', 'services', null, 'Servicios automotrices', null, '["Auto cerrado", "Reemplazo de llaves", "Programación de control", "Llaves transponder", "Soporte de ignición"]'::jsonb, null, null, 20, true),
('es', 'footer', 'navigation', null, 'Información al cliente', null, '[]'::jsonb, 'Solicitud', '/es/contact#request-service', 30, true),
('es', 'footer', 'legal', null, null, 'Enviar una solicitud no garantiza disponibilidad inmediata. Los detalles deben confirmarse antes del servicio.', '["Todos los derechos reservados."]'::jsonb, null, null, 40, true),

-- RU / FOOTER
('ru', 'footer', 'brand', null, 'Planetlocksmiths', 'Planetlocksmiths помогает с мобильными автомобильными locksmith-заявками: открытие авто, замена ключей, программирование брелков, transponder-ключи, сломанные ключи и зажигание.', '["Доступность, скорость выезда и финальная цена зависят от локации, автомобиля, типа ключа, деталей, времени и сложности работы."]'::jsonb, null, null, 10, true),
('ru', 'footer', 'services', null, 'Авто-услуги', null, '["Открытие авто", "Замена ключей", "Программирование брелков", "Transponder-ключи", "Помощь с зажиганием"]'::jsonb, null, null, 20, true),
('ru', 'footer', 'navigation', null, 'Информация клиенту', null, '[]'::jsonb, 'Заявка', '/ru/contact#request-service', 30, true),
('ru', 'footer', 'legal', null, null, 'Отправка заявки не гарантирует мгновенную доступность. Детали услуги должны подтверждаться до начала работы.', '["Все права защищены."]'::jsonb, null, null, 40, true)
on conflict do nothing;
