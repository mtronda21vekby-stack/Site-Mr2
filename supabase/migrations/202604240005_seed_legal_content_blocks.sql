insert into public.site_content_blocks
(locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, sort_order, is_published)
values
-- EN / PRIVACY
('en', 'legal-privacy', 'hero', 'Customer information', 'Privacy Policy', 'This page explains how Planetlocksmiths handles information submitted through this website for mobile automotive locksmith service requests.', '[]'::jsonb, null, null, 10, true),
('en', 'legal-privacy', 'section-1', null, 'Information we collect', 'When you submit a service request, we may collect your name, phone number, email address, requested service, vehicle make/model/year, service location, urgency, preferred time, and message details. This information is used to respond to your request and understand the service needed.', '[]'::jsonb, null, null, 20, true),
('en', 'legal-privacy', 'section-2', null, 'How we use information', 'Submitted information is used to contact you, review your automotive locksmith request, help estimate the required tools or parts, coordinate service availability, and improve customer communication.', '[]'::jsonb, null, null, 30, true),
('en', 'legal-privacy', 'section-3', null, 'Sharing information', 'We do not sell customer request information. Information may be shared only when needed to process a service request, comply with law, protect rights and safety, or operate website infrastructure and customer communication systems.', '[]'::jsonb, null, null, 40, true),
('en', 'legal-privacy', 'section-4', null, 'Security', 'We use reasonable technical and organizational measures to protect submitted information. No website or internet transmission can be guaranteed completely secure.', '[]'::jsonb, null, null, 50, true),
('en', 'legal-privacy', 'section-5', null, 'Customer choices', 'You may contact us to ask about a service request, correct information, or request deletion of submitted request details where legally and operationally appropriate.', '[]'::jsonb, null, null, 60, true),

-- EN / TERMS
('en', 'legal-terms', 'hero', 'Customer information', 'Terms of Service', 'These terms explain the basic conditions for using this website and submitting a mobile automotive locksmith service request to Planetlocksmiths.', '[]'::jsonb, null, null, 10, true),
('en', 'legal-terms', 'section-1', null, 'Website use', 'This website provides information about automotive locksmith services and allows customers to submit service requests. You agree to provide accurate contact, vehicle, and location details when requesting service.', '[]'::jsonb, null, null, 20, true),
('en', 'legal-terms', 'section-2', null, 'Service availability', 'Submitting a request does not guarantee immediate availability, dispatch, price, or completion of service. Availability depends on location, vehicle type, parts, technician availability, timing, and job complexity.', '[]'::jsonb, null, null, 30, true),
('en', 'legal-terms', 'section-3', null, 'Pricing and estimates', 'Any estimate may depend on vehicle make, model, year, key type, programming requirements, lock condition, distance, emergency timing, and parts availability. Final pricing should be confirmed before work begins.', '[]'::jsonb, null, null, 40, true),
('en', 'legal-terms', 'section-4', null, 'Vehicle ownership and authorization', 'Customers may be asked to confirm authorization to access or service a vehicle. Service may be declined if ownership, authorization, safety, or legal concerns cannot be reasonably resolved.', '[]'::jsonb, null, null, 50, true),
('en', 'legal-terms', 'section-5', null, 'No misuse', 'You may not use this website to submit false requests, interfere with website operation, impersonate others, or request service for a vehicle you are not authorized to access.', '[]'::jsonb, null, null, 60, true),

-- ES / PRIVACY
('es', 'legal-privacy', 'hero', 'Información del cliente', 'Política de privacidad', 'Esta página explica cómo Planetlocksmiths maneja la información enviada a través del sitio para solicitudes móviles de cerrajería automotriz.', '[]'::jsonb, null, null, 10, true),
('es', 'legal-privacy', 'section-1', null, 'Información que recopilamos', 'Cuando envía una solicitud, podemos recopilar nombre, teléfono, email, servicio solicitado, vehículo, ubicación, urgencia, horario preferido y mensaje.', '[]'::jsonb, null, null, 20, true),
('es', 'legal-privacy', 'section-2', null, 'Cómo usamos la información', 'La información se usa para contactarlo, revisar la solicitud, estimar herramientas o piezas, coordinar disponibilidad y mejorar la comunicación.', '[]'::jsonb, null, null, 30, true),
('es', 'legal-privacy', 'section-3', null, 'Compartir información', 'No vendemos información de solicitudes. Puede compartirse solo cuando sea necesario para procesar servicio, cumplir la ley, proteger derechos o operar sistemas.', '[]'::jsonb, null, null, 40, true),
('es', 'legal-privacy', 'section-4', null, 'Seguridad', 'Usamos medidas razonables para proteger información enviada. Ningún sitio o transmisión por internet puede garantizar seguridad absoluta.', '[]'::jsonb, null, null, 50, true),
('es', 'legal-privacy', 'section-5', null, 'Opciones del cliente', 'Puede contactarnos para preguntar sobre una solicitud, corregir información o pedir eliminación cuando sea apropiado legal y operativamente.', '[]'::jsonb, null, null, 60, true),

-- ES / TERMS
('es', 'legal-terms', 'hero', 'Información del cliente', 'Términos de servicio', 'Estos términos explican las condiciones básicas para usar este sitio y enviar una solicitud móvil de cerrajería automotriz a Planetlocksmiths.', '[]'::jsonb, null, null, 10, true),
('es', 'legal-terms', 'section-1', null, 'Uso del sitio', 'Este sitio ofrece información sobre servicios automotrices y permite enviar solicitudes. Usted acepta proporcionar datos correctos de contacto, vehículo y ubicación.', '[]'::jsonb, null, null, 20, true),
('es', 'legal-terms', 'section-2', null, 'Disponibilidad del servicio', 'Enviar una solicitud no garantiza disponibilidad inmediata, despacho, precio o finalización. La disponibilidad depende de ubicación, vehículo, piezas, técnico, horario y complejidad.', '[]'::jsonb, null, null, 30, true),
('es', 'legal-terms', 'section-3', null, 'Precios y estimados', 'Todo estimado puede depender de marca, modelo, año, tipo de llave, programación, condición de cerradura, distancia, urgencia y piezas. El precio final debe confirmarse antes del trabajo.', '[]'::jsonb, null, null, 40, true),
('es', 'legal-terms', 'section-4', null, 'Propiedad y autorización', 'Puede solicitarse confirmación de autorización para acceder o trabajar en un vehículo. El servicio puede rechazarse si hay dudas legales, de seguridad o autorización.', '[]'::jsonb, null, null, 50, true),
('es', 'legal-terms', 'section-5', null, 'No uso indebido', 'No puede usar el sitio para solicitudes falsas, interferir con el sitio, suplantar personas o pedir servicio para un vehículo sin autorización.', '[]'::jsonb, null, null, 60, true),

-- RU / PRIVACY
('ru', 'legal-privacy', 'hero', 'Информация клиенту', 'Политика приватности', 'Эта страница объясняет, как Planetlocksmiths обрабатывает информацию, отправленную через сайт для мобильных автомобильных locksmith-заявок.', '[]'::jsonb, null, null, 10, true),
('ru', 'legal-privacy', 'section-1', null, 'Какую информацию мы собираем', 'При отправке заявки мы можем получать имя, телефон, email, услугу, данные автомобиля, локацию, срочность, желаемое время и сообщение.', '[]'::jsonb, null, null, 20, true),
('ru', 'legal-privacy', 'section-2', null, 'Как используется информация', 'Информация используется для связи, проверки заявки, оценки инструментов или деталей, координации доступности и коммуникации.', '[]'::jsonb, null, null, 30, true),
('ru', 'legal-privacy', 'section-3', null, 'Передача информации', 'Мы не продаём данные заявок. Информация может передаваться только для обработки услуги, соблюдения закона, защиты прав или работы систем.', '[]'::jsonb, null, null, 40, true),
('ru', 'legal-privacy', 'section-4', null, 'Безопасность', 'Мы используем разумные меры защиты. Ни один сайт или интернет-передача не может гарантировать абсолютную безопасность.', '[]'::jsonb, null, null, 50, true),
('ru', 'legal-privacy', 'section-5', null, 'Выбор клиента', 'Вы можете связаться с нами по вопросам заявки, исправления данных или удаления информации, где это уместно юридически и операционно.', '[]'::jsonb, null, null, 60, true),

-- RU / TERMS
('ru', 'legal-terms', 'hero', 'Информация клиенту', 'Условия сервиса', 'Эти условия объясняют базовые правила использования сайта и отправки мобильной автомобильной locksmith-заявки в Planetlocksmiths.', '[]'::jsonb, null, null, 10, true),
('ru', 'legal-terms', 'section-1', null, 'Использование сайта', 'Сайт предоставляет информацию об автомобильных locksmith-услугах и позволяет отправлять заявки. Клиент должен указывать корректные контактные данные, авто и локацию.', '[]'::jsonb, null, null, 20, true),
('ru', 'legal-terms', 'section-2', null, 'Доступность услуги', 'Отправка заявки не гарантирует мгновенную доступность, выезд, цену или выполнение. Всё зависит от локации, авто, деталей, доступности техника, времени и сложности.', '[]'::jsonb, null, null, 30, true),
('ru', 'legal-terms', 'section-3', null, 'Цены и оценки', 'Любая оценка зависит от марки, модели, года, типа ключа, программирования, состояния замка, расстояния, срочности и деталей. Финальная цена подтверждается до начала работы.', '[]'::jsonb, null, null, 40, true),
('ru', 'legal-terms', 'section-4', null, 'Право доступа и авторизация', 'Клиенту может потребоваться подтвердить право доступа или обслуживания автомобиля. Услуга может быть отклонена при юридических или safety-сомнениях.', '[]'::jsonb, null, null, 50, true),
('ru', 'legal-terms', 'section-5', null, 'Запрет злоупотреблений', 'Нельзя использовать сайт для ложных заявок, вмешательства в работу сайта, выдачи себя за других или запроса услуги без права доступа к авто.', '[]'::jsonb, null, null, 60, true)
on conflict do nothing;
