'use client'

import { useMemo, useState } from 'react'
import type { Locale } from '@/components/layout/Header'

interface ContactSectionProps {
  title: string
  text: string
  phoneNumber: string
  phoneDisplay: string
  locale: Locale
}

type FormState = {
  name: string
  phone: string
  service: string
  vehicle: string
  location: string
  message: string
  website: string
}

const copy = {
  en: {
    labels: {
      name: 'Name',
      phone: 'Phone',
      service: 'Service needed',
      vehicle: 'Vehicle make / model',
      location: 'Location',
      message: 'Message',
      submit: 'Submit request',
      submitting: 'Submitting…',
      call: 'Call',
      optional: 'optional',
      trust: 'Mobile service only • Philadelphia coverage • 24/7 request intake',
      success: 'Thank you. Your request was received.',
      error: 'Something went wrong. Please try again.',
      phoneRequired: 'Phone is required.',
      serviceRequired: 'Please choose a service.',
    },
    placeholders: {
      name: 'Your name',
      phone: '215-555-1234',
      vehicle: 'Toyota Camry',
      location: 'Philadelphia, PA',
      message: 'Add a short description of the issue',
    },
    services: [
      'Car lockout',
      'Car key replacement',
      'Key programming',
      'Key fob services',
      'Ignition key issues',
      'Emergency mobile service',
    ],
  },
  es: {
    labels: {
      name: 'Nombre',
      phone: 'Teléfono',
      service: 'Servicio',
      vehicle: 'Marca / modelo',
      location: 'Ubicación',
      message: 'Mensaje',
      submit: 'Enviar solicitud',
      submitting: 'Enviando…',
      call: 'Llamar',
      optional: 'opcional',
      trust: 'Solo servicio móvil • Cobertura en Filadelfia • Solicitudes 24/7',
      success: 'Gracias. Tu solicitud fue recibida.',
      error: 'Algo salió mal. Inténtalo de nuevo.',
      phoneRequired: 'El teléfono es obligatorio.',
      serviceRequired: 'Selecciona un servicio.',
    },
    placeholders: {
      name: 'Tu nombre',
      phone: '215-555-1234',
      vehicle: 'Toyota Camry',
      location: 'Filadelfia, PA',
      message: 'Agrega una breve descripción del problema',
    },
    services: [
      'Apertura de auto',
      'Reemplazo de llave',
      'Programación de llave',
      'Servicios de key fob',
      'Problemas de encendido',
      'Servicio móvil urgente',
    ],
  },
  ru: {
    labels: {
      name: 'Имя',
      phone: 'Телефон',
      service: 'Нужная услуга',
      vehicle: 'Марка / модель',
      location: 'Локация',
      message: 'Сообщение',
      submit: 'Отправить заявку',
      submitting: 'Отправка…',
      call: 'Позвонить',
      optional: 'необязательно',
      trust: 'Только выездной сервис • Покрытие по Филадельфии • Прием заявок 24/7',
      success: 'Спасибо. Заявка получена.',
      error: 'Что-то пошло не так. Попробуйте еще раз.',
      phoneRequired: 'Телефон обязателен.',
      serviceRequired: 'Выберите услугу.',
    },
    placeholders: {
      name: 'Ваше имя',
      phone: '215-555-1234',
      vehicle: 'Toyota Camry',
      location: 'Philadelphia, PA',
      message: 'Коротко опишите проблему',
    },
    services: [
      'Открытие автомобиля',
      'Замена ключа',
      'Программирование ключа',
      'Услуги по брелокам',
      'Проблемы с ключом зажигания',
      'Срочный мобильный сервис',
    ],
  },
} as const

const initialState: FormState = {
  name: '',
  phone: '',
  service: '',
  vehicle: '',
  location: '',
  message: '',
  website: '',
}

export default function ContactSection({
  title,
  text,
  phoneNumber,
  phoneDisplay,
  locale,
}: ContactSectionProps) {
  const t = copy[locale]
  const [formData, setFormData] = useState<FormState>(initialState)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const serviceOptions = useMemo(() => t.services, [t.services])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.phone.trim()) {
      setErrorMessage(t.labels.phoneRequired)
      setStatus('error')
      return
    }

    if (!formData.service.trim()) {
      setErrorMessage(t.labels.serviceRequired)
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || t.labels.error)
        setStatus('error')
        return
      }

      setFormData(initialState)
      setStatus('success')
    } catch {
      setErrorMessage(t.labels.error)
      setStatus('error')
    }
  }

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="rounded-2xl border border-line bg-surface-2 p-6 md:p-8">
          <h2 className="mb-4 text-2xl font-heading font-semibold text-text">{title}</h2>
          <p className="mb-6 text-sm leading-7 text-muted">{text}</p>

          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-bg p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-cyan">Direct call</p>
              <a
                href={`tel:${phoneNumber}`}
                className="mt-2 block text-lg font-semibold text-text"
              >
                {phoneDisplay}
              </a>
            </div>

            <div className="rounded-xl border border-line bg-bg p-4">
              <p className="text-sm text-muted">{t.labels.trust}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-bg p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 text-xs font-medium text-muted">
                {t.labels.name} <span className="text-muted">({t.labels.optional})</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
                placeholder={t.placeholders.name}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-1 text-xs font-medium text-muted">
                {t.labels.phone} <span className="text-danger-soft">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
                placeholder={t.placeholders.phone}
                required
              />
            </div>

            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="service" className="mb-1 text-xs font-medium text-muted">
                {t.labels.service} <span className="text-danger-soft">*</span>
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-text focus:border-accent-blue focus:outline-none"
                required
              >
                <option value="">—</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="vehicle" className="mb-1 text-xs font-medium text-muted">
                {t.labels.vehicle}
              </label>
              <input
                id="vehicle"
                name="vehicle"
                type="text"
                value={formData.vehicle}
                onChange={handleChange}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
                placeholder={t.placeholders.vehicle}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="location" className="mb-1 text-xs font-medium text-muted">
                {t.labels.location}
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
                placeholder={t.placeholders.location}
              />
            </div>

            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="message" className="mb-1 text-xs font-medium text-muted">
                {t.labels.message}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
                placeholder={t.placeholders.message}
              />
            </div>

            <div className="hidden">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleChange}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="rounded-full bg-accent-blue px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
              >
                {status === 'submitting' ? t.labels.submitting : t.labels.submit}
              </button>
              <a
                href={`tel:${phoneNumber}`}
                className="rounded-full border border-line px-6 py-3 text-center text-sm font-medium text-text transition hover:bg-white/5"
              >
                {t.labels.call} {phoneDisplay}
              </a>
            </div>

            {status === 'success' && (
              <p className="pt-2 text-sm text-accent-gold sm:col-span-2">{t.labels.success}</p>
            )}

            {errorMessage && (
              <p className="pt-2 text-sm text-danger-soft sm:col-span-2">{errorMessage}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
