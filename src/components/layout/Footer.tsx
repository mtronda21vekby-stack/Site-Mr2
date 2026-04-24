import Link from 'next/link'
import type { Locale } from './Header'
import { getContentBlocksFromSource } from '@/lib/content.server'

interface FooterProps {
  locale: Locale
}

const footerLabels: Record<
  Locale,
  {
    home: string
    services: string
    areas: string
    contact: string
    privacy: string
    terms: string
    request: string
    rights: string
    description: string
    serviceNote: string
    disclaimer: string
    serviceTypes: string
    customerInfo: string
    defaultServiceItems: string[]
  }
> = {
  en: {
    home: 'Home',
    services: 'Services',
    areas: 'Service Areas',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    request: 'Request Service',
    rights: 'All rights reserved.',
    description: 'Planetlocksmiths provides mobile automotive locksmith request support for car lockouts, replacement keys, key fob programming, transponder keys, broken key extraction, and ignition-related help.',
    serviceNote: 'Mobile service availability, response time, and final pricing depend on location, vehicle, key type, parts availability, time, and job complexity.',
    disclaimer: 'Submitting a request does not guarantee immediate availability. Service details should be confirmed before work begins.',
    serviceTypes: 'Automotive services',
    customerInfo: 'Customer information',
    defaultServiceItems: ['Car lockout service', 'Car key replacement', 'Key fob programming', 'Transponder keys', 'Ignition assistance'],
  },
  es: {
    home: 'Inicio',
    services: 'Servicios',
    areas: 'Áreas',
    contact: 'Contacto',
    privacy: 'Política de privacidad',
    terms: 'Términos de servicio',
    request: 'Solicitud',
    rights: 'Todos los derechos reservados.',
    description: 'Planetlocksmiths ofrece soporte móvil de cerrajería automotriz para autos cerrados, reemplazo de llaves, programación de controles, llaves transponder, extracción de llave rota e ignición.',
    serviceNote: 'La disponibilidad, tiempo de respuesta y precio final dependen de ubicación, vehículo, tipo de llave, piezas, horario y complejidad.',
    disclaimer: 'Enviar una solicitud no garantiza disponibilidad inmediata. Los detalles deben confirmarse antes del servicio.',
    serviceTypes: 'Servicios automotrices',
    customerInfo: 'Información al cliente',
    defaultServiceItems: ['Auto cerrado', 'Reemplazo de llaves', 'Programación de control', 'Llaves transponder', 'Soporte de ignición'],
  },
  ru: {
    home: 'Главная',
    services: 'Услуги',
    areas: 'Районы',
    contact: 'Контакты',
    privacy: 'Политика приватности',
    terms: 'Условия сервиса',
    request: 'Заявка',
    rights: 'Все права защищены.',
    description: 'Planetlocksmiths помогает с мобильными автомобильными locksmith-заявками: открытие авто, замена ключей, программирование брелков, transponder-ключи, сломанные ключи и зажигание.',
    serviceNote: 'Доступность, скорость выезда и финальная цена зависят от локации, автомобиля, типа ключа, деталей, времени и сложности работы.',
    disclaimer: 'Отправка заявки не гарантирует мгновенную доступность. Детали услуги должны подтверждаться до начала работы.',
    serviceTypes: 'Авто-услуги',
    customerInfo: 'Информация клиенту',
    defaultServiceItems: ['Открытие авто', 'Замена ключей', 'Программирование брелков', 'Transponder-ключи', 'Помощь с зажиганием'],
  },
}

export default async function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear()
  const labels = footerLabels[locale]
  const blocks = await getContentBlocksFromSource(locale, 'footer')
  const blockBySlot = new Map(blocks.map((block) => [block.slot, block]))
  const brandBlock = blockBySlot.get('brand')
  const servicesBlock = blockBySlot.get('services')
  const navigationBlock = blockBySlot.get('navigation')
  const legalBlock = blockBySlot.get('legal')
  const serviceItems = servicesBlock?.items.length ? servicesBlock.items : labels.defaultServiceItems

  return (
    <footer className="border-t border-white/10 bg-surface-2 pb-24 pt-10 text-muted md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr_0.8fr]">
          <div>
            <h2 className="text-xl font-bold text-text">{brandBlock?.title || 'Planetlocksmiths'}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7">{brandBlock?.body || labels.description}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7">{brandBlock?.items[0] || labels.serviceNote}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-text">{servicesBlock?.title || labels.serviceTypes}</h3>
            <ul className="mt-4 grid gap-2 text-sm leading-6">
              {serviceItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-text">{navigationBlock?.title || labels.customerInfo}</h3>
            <nav className="mt-4 grid gap-3">
              <Link href={`/${locale}`} className="text-sm hover:text-text">{labels.home}</Link>
              <Link href={`/${locale}/services`} className="text-sm hover:text-text">{labels.services}</Link>
              <Link href={`/${locale}/areas`} className="text-sm hover:text-text">{labels.areas}</Link>
              <Link href={`/${locale}/contact`} className="text-sm hover:text-text">{labels.contact}</Link>
              <Link href={`/${locale}/privacy`} className="text-sm hover:text-text">{labels.privacy}</Link>
              <Link href={`/${locale}/terms`} className="text-sm hover:text-text">{labels.terms}</Link>
              <Link href={navigationBlock?.ctaHref || `/${locale}/contact#request-service`} className="text-sm hover:text-text">{navigationBlock?.ctaLabel || labels.request}</Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-xs leading-6 text-muted">{legalBlock?.body || labels.disclaimer}</p>
          <p className="mt-3 text-xs">© {year} {brandBlock?.title || 'Planetlocksmiths'}. {legalBlock?.items[0] || labels.rights}</p>
        </div>
      </div>
    </footer>
  )
}
