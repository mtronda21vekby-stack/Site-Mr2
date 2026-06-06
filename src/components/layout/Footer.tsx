import Link from 'next/link'
import type { Locale } from './Header'
import { getContentBlocksFromSource } from '@/lib/content.server'
import CookiePreferencesButton from './CookiePreferencesButton'

interface FooterProps {
  locale: Locale
}

const footerLabels: Record<Locale, { home: string; services: string; areas: string; contact: string; privacy: string; terms: string; cookiePreferences: string; request: string; rights: string; description: string; serviceNote: string; disclaimer: string; serviceTypes: string; customerInfo: string; defaultServiceItems: string[] }> = {
  en: { home: 'Home', services: 'Services', areas: 'Service Areas', contact: 'Contact', privacy: 'Privacy Policy', terms: 'Terms of Service', cookiePreferences: 'Cookie preferences', request: 'Request Service', rights: 'All rights reserved.', description: 'Planet Locksmiths provides mobile locksmith request support for car lockouts, key programming, rekeys, lock repair, lock replacement, residential, commercial, access control, safe opening, and emergency service.', serviceNote: 'Availability, response time, and final pricing depend on location, service type, lock or key system, parts availability, time, authorization, and job complexity.', disclaimer: 'Submitting a request does not guarantee immediate availability. Service details and authorization should be confirmed before work begins.', serviceTypes: 'Locksmith services', customerInfo: 'Customer information', defaultServiceItems: ['Emergency locksmith 24/7', 'Car lockout service', 'Rekey service', 'Commercial locksmith', 'Residential locksmith'] },
  es: { home: 'Inicio', services: 'Servicios', areas: 'Áreas', contact: 'Contacto', privacy: 'Política de privacidad', terms: 'Términos de servicio', cookiePreferences: 'Preferencias de cookies', request: 'Solicitud', rights: 'Todos los derechos reservados.', description: 'Planet Locksmiths ofrece soporte móvil de cerrajería para bloqueos, programación de llaves, rekeys, reparación, reemplazo, residencial, comercial, access control, cajas fuertes y emergencias.', serviceNote: 'La disponibilidad, tiempo de respuesta y precio final dependen de ubicación, servicio, sistema de cerradura o llave, piezas, horario, autorización y complejidad.', disclaimer: 'Enviar una solicitud no garantiza disponibilidad inmediata. Los detalles y autorización deben confirmarse antes del servicio.', serviceTypes: 'Servicios de cerrajería', customerInfo: 'Información al cliente', defaultServiceItems: ['Cerrajero de emergencia 24/7', 'Bloqueo de automóvil', 'Rekey', 'Cerrajero comercial', 'Cerrajero residencial'] },
  ru: { home: 'Home', services: 'Services', areas: 'Service Areas', contact: 'Contact', privacy: 'Privacy Policy', terms: 'Terms of Service', cookiePreferences: 'Cookie preferences', request: 'Request Service', rights: 'All rights reserved.', description: 'Planet Locksmiths provides mobile locksmith request support for car lockouts, key programming, rekeys, lock repair, lock replacement, residential, commercial, access control, safe opening, and emergency service.', serviceNote: 'Availability, response time, and final pricing depend on location, service type, lock or key system, parts availability, time, authorization, and job complexity.', disclaimer: 'Submitting a request does not guarantee immediate availability. Service details and authorization should be confirmed before work begins.', serviceTypes: 'Locksmith services', customerInfo: 'Customer information', defaultServiceItems: ['Emergency locksmith 24/7', 'Car lockout service', 'Rekey service', 'Commercial locksmith', 'Residential locksmith'] },
}

export default async function Footer({ locale }: FooterProps) {
  const activeLocale = locale === 'es' ? 'es' : 'en'
  const year = new Date().getFullYear()
  const labels = footerLabels[activeLocale]
  const blocks = await getContentBlocksFromSource(activeLocale, 'footer')
  const blockBySlot = new Map(blocks.map((block) => [block.slot, block]))
  const brandBlock = blockBySlot.get('brand')
  const servicesBlock = blockBySlot.get('services')
  const navigationBlock = blockBySlot.get('navigation')
  const legalBlock = blockBySlot.get('legal')
  const serviceItems = servicesBlock?.items.length ? servicesBlock.items : labels.defaultServiceItems
  const brandName = brandBlock?.title || 'Planet Locksmiths'

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-transparent pb-24 pt-14 text-muted md:pb-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/34 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="premium-panel premium-hairline rounded-[2rem] p-6 sm:p-8">
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.35fr_0.7fr_0.85fr]">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/18 bg-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_28px_rgba(77,162,255,0.16)] backdrop-blur-2xl">
                  <span className="h-3 w-3 rounded-full bg-accent-blue shadow-[0_0_22px_rgba(77,162,255,0.95)]" />
                </span>
                <h2 className="notranslate text-xl font-black tracking-[-0.03em] text-text" translate="no">{brandName}</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7">{brandBlock?.body || labels.description}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7">{brandBlock?.items[0] || labels.serviceNote}</p>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.22em] text-accent-gold">{servicesBlock?.title || labels.serviceTypes}</h3>
              <ul className="mt-4 grid gap-2 text-sm leading-6">
                {serviceItems.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />{item}</li>)}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.22em] text-accent-cyan">{navigationBlock?.title || labels.customerInfo}</h3>
              <nav className="mt-4 grid gap-3">
                <Link href={`/${activeLocale}`} className="text-sm transition hover:text-text">{labels.home}</Link>
                <Link href={`/${activeLocale}/services`} className="text-sm transition hover:text-text">{labels.services}</Link>
                <Link href={`/${activeLocale}/areas`} className="text-sm transition hover:text-text">{labels.areas}</Link>
                <Link href={`/${activeLocale}/contact`} className="text-sm transition hover:text-text">{labels.contact}</Link>
                <Link href={`/${activeLocale}/privacy`} className="text-sm transition hover:text-text">{labels.privacy}</Link>
                <Link href={`/${activeLocale}/terms`} className="text-sm transition hover:text-text">{labels.terms}</Link>
                <CookiePreferencesButton label={labels.cookiePreferences} />
                <Link href={navigationBlock?.ctaHref || `/${activeLocale}/contact#request-service`} className="w-fit rounded-full border border-white/18 bg-white/[0.075] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl transition hover:border-accent-blue/45 hover:bg-accent-blue/10 hover:text-accent-blue">{navigationBlock?.ctaLabel || labels.request}</Link>
              </nav>
            </div>
          </div>

          <div className="relative z-10 mt-8 border-t border-white/10 pt-6">
            <p className="text-xs leading-6 text-muted">{legalBlock?.body || labels.disclaimer}</p>
            <p className="mt-3 text-xs">© {year} <span className="notranslate" translate="no">{brandName}</span>. {legalBlock?.items[0] || labels.rights}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
