'use client'

import { useState } from 'react'
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
  email: string
  service_needed: string
  vehicle_make_model: string
  vehicle_year: string
  location: string
  urgency: string
  preferred_time: string
  message: string
}

const initialForm: FormState = {
  name: '',
  phone: '',
  email: '',
  service_needed: '',
  vehicle_make_model: '',
  vehicle_year: '',
  location: '',
  urgency: 'normal',
  preferred_time: '',
  message: '',
}

export default function ContactSection({
  title,
  text,
  phoneNumber,
  phoneDisplay,
}: ContactSectionProps) {
  const [formData, setFormData] = useState<FormState>(initialForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.phone || !formData.service_needed) {
      setErrorMessage('Phone and service are required.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong.')
        setStatus('error')
        return
      }

      setStatus('success')
      setFormData(initialForm)
    } catch {
      setErrorMessage('Network error. Please try again later.')
      setStatus('error')
    }
  }

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-heading font-semibold text-text">
          {title}
        </h2>

        <p className="mb-8 max-w-2xl text-sm text-muted">{text}</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
          />

          <Field
            label="Phone *"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="555-123-4567"
            required
          />

          <Field
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@email.com"
          />

          <Field
            label="Service Needed *"
            name="service_needed"
            value={formData.service_needed}
            onChange={handleChange}
            placeholder="Car lockout / Key replacement"
            required
          />

          <Field
            label="Vehicle Make / Model"
            name="vehicle_make_model"
            value={formData.vehicle_make_model}
            onChange={handleChange}
            placeholder="Toyota Camry"
          />

          <Field
            label="Vehicle Year"
            name="vehicle_year"
            value={formData.vehicle_year}
            onChange={handleChange}
            placeholder="2020"
          />

          <Field
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Philadelphia, PA"
          />

          <label className="flex flex-col">
            <span className="mb-1 text-xs font-medium text-muted">Urgency</span>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-text focus:border-accent-blue focus:outline-none"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="same_day">Same day</option>
            </select>
          </label>

          <Field
            label="Preferred Time"
            name="preferred_time"
            value={formData.preferred_time}
            onChange={handleChange}
            placeholder="ASAP / Today / 5 PM"
          />

          <div className="flex flex-col sm:col-span-2">
            <label htmlFor="message" className="mb-1 text-xs font-medium text-muted">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-text placeholder-muted focus:border-accent-blue focus:outline-none"
              placeholder="Extra details"
            />
          </div>

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-block rounded-full bg-accent-blue px-6 py-3 text-sm font-medium text-black transition-colors hover:brightness-110 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
            </button>

            <a
              href={`tel:${phoneNumber}`}
              className="inline-block rounded-full border border-line px-6 py-3 text-sm font-medium text-text transition-colors hover:border-line/70 hover:bg-white/5"
            >
              Call {phoneDisplay}
            </a>
          </div>

          {status === 'success' && (
            <p className="col-span-2 mt-2 text-sm text-accent-gold">
              Thank you. Your request has been received.
            </p>
          )}

          {errorMessage && (
            <p className="col-span-2 mt-2 text-sm text-danger-soft">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
}: {
  label: string
  name: string
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  placeholder: string
  required?: boolean
  type?: string
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 text-xs font-medium text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="rounded-md border border-line bg-bg px-3 py-2 text-sm text-text placeholder-muted focus:border-accent-blue focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  )
}
