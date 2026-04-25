'use client'

import { useMemo, useState, type ChangeEvent, type FormEvent, type HTMLAttributes } from 'react'
import type { Locale } from '@/components/layout/Header'
import { MAKE_LABELS, SERVICE_OPTIONS, VEHICLE_MODELS } from '@/lib/vehicle-options'

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
  vehicle_make: string
  vehicle_model: string
  vehicle_year: string
  vehicle_make_model: string
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
  vehicle_make: '',
  vehicle_model: '',
  vehicle_year: '',
  vehicle_make_model: '',
  location: '',
  urgency: 'asap',
  preferred_time: '',
  message: '',
}

export default function ContactSection({ title, text, phoneNumber, phoneDisplay }: ContactSectionProps) {
  const [formData, setFormData] = useState<FormState>(initialForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear() + 1
    return Array.from({ length: currentYear - 1989 }, (_, index) => String(currentYear - index))
  }, [])

  const makes = Object.keys(VEHICLE_MODELS)
  const selectedModels = formData.vehicle_make ? VEHICLE_MODELS[formData.vehicle_make] ?? [] : []
  const completionScore = [formData.phone, formData.service_needed, formData.vehicle_make, formData.vehicle_model || formData.vehicle_make_model, formData.vehicle_year, formData.location].filter(Boolean).length

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData((prev) => {
      if (name === 'vehicle_make') return { ...prev, vehicle_make: value, vehicle_model: '', vehicle_make_model: value === 'Other' ? prev.vehicle_make_model : '' }
      return { ...prev, [name]: value }
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!formData.phone || !formData.service_needed) {
      setErrorMessage('Phone and service are required.')
      return
    }

    const makeLabel = MAKE_LABELS[formData.vehicle_make] ?? formData.vehicle_make
    const selectedVehicle = [makeLabel, formData.vehicle_model].filter(Boolean).join(' ').trim()
    const payload = { ...formData, vehicle_make: makeLabel, vehicle_make_model: formData.vehicle_make === 'Other' ? formData.vehicle_make_model.trim() : selectedVehicle }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
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
    <section id="request-service" className="relative bg-transparent py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-accent-cyan">Request mobile locksmith service</p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-text sm:text-5xl lg:text-6xl">{title}</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted">{text}</p>

          <div className="premium-panel mt-7 rounded-[1.35rem] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-gold">Request readiness</p>
                <p className="mt-2 text-sm leading-7 text-muted">Phone, service, vehicle, year, and location help speed up the callback.</p>
              </div>
              <span className="rounded-full border border-accent-blue/25 bg-accent-blue/10 px-3 py-1 text-sm font-black text-accent-cyan">{completionScore}/6</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent-blue transition-all" style={{ width: `${Math.round((completionScore / 6) * 100)}%` }} />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              ['Service', 'Select the locksmith service needed.'],
              ['Vehicle', 'Choose make, model, and year.'],
              ['Location', 'Add address, ZIP, or landmark.'],
            ].map(([heading, copy], index) => (
              <div key={heading} className="premium-panel rounded-[1.15rem] p-4">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-blue/25 bg-accent-blue/10 text-xs font-black text-accent-blue">{index + 1}</span>
                  <div><h3 className="font-semibold text-text">{heading}</h3><p className="mt-1 text-sm leading-6 text-muted">{copy}</p></div>
                </div>
              </div>
            ))}
          </div>

          <a href={`tel:${phoneNumber}`} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent-blue/45 hover:bg-accent-blue/10 sm:w-auto">Call instead: {phoneDisplay}</a>
        </div>

        <form onSubmit={handleSubmit} className="premium-panel rounded-[1.75rem] p-5 sm:p-7">
          <div className="mb-6 border-b border-white/10 pb-6">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-accent-gold">Service request form</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-text">Vehicle + service details</h3>
            <p className="mt-3 text-sm leading-7 text-muted">Required: phone and service. More vehicle details improve routing accuracy.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
            <Field label="Phone *" name="phone" value={formData.phone} onChange={handleChange} placeholder="555-123-4567" required inputMode="tel" />
            <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@email.com" />
            <SelectField label="Service Needed *" name="service_needed" value={formData.service_needed} onChange={handleChange} required placeholder="Select service" options={SERVICE_OPTIONS} />
            <SelectField label="Vehicle Make" name="vehicle_make" value={formData.vehicle_make} onChange={handleChange} placeholder="Select make" options={makes.map((make) => MAKE_LABELS[make] ?? make)} rawValues={makes} />
            {formData.vehicle_make === 'Other' ? <Field label="Vehicle Make / Model" name="vehicle_make_model" value={formData.vehicle_make_model} onChange={handleChange} placeholder="Enter vehicle" /> : <SelectField label="Vehicle Model" name="vehicle_model" value={formData.vehicle_model} onChange={handleChange} placeholder={formData.vehicle_make ? 'Select model' : 'Select make first'} options={selectedModels} disabled={!formData.vehicle_make} />}
            <SelectField label="Vehicle Year" name="vehicle_year" value={formData.vehicle_year} onChange={handleChange} placeholder="Select year" options={years} />
            <SelectField label="Urgency" name="urgency" value={formData.urgency} onChange={handleChange} options={['ASAP / locked out now', 'Same day', 'Scheduled appointment', 'Not urgent']} rawValues={['asap', 'same_day', 'scheduled', 'normal']} />
            <Field label="Service Location" name="location" value={formData.location} onChange={handleChange} placeholder="Philadelphia, PA / address / ZIP" />
            <Field label="Preferred Time" name="preferred_time" value={formData.preferred_time} onChange={handleChange} placeholder="ASAP / Today / 5 PM" />

            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="message" className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted">Extra Details</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition focus:border-accent-blue focus:bg-black/35" placeholder="Example: keys lost, car is running, door locked, key fob not detected, parking lot name, etc." />
            </div>

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <button type="submit" disabled={status === 'submitting'} className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_28px_rgba(77,162,255,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50">{status === 'submitting' ? 'Submitting…' : 'Submit Request'}</button>
              <a href={`tel:${phoneNumber}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-text transition duration-300 hover:-translate-y-0.5 hover:border-accent-gold/45 hover:bg-accent-gold/10">Call {phoneDisplay}</a>
            </div>

            {status === 'success' ? <p className="sm:col-span-2 rounded-2xl border border-accent-gold/25 bg-accent-gold/10 px-4 py-3 text-sm text-accent-gold">Thank you. Your request has been received.</p> : null}
            {errorMessage ? <p className="sm:col-span-2 rounded-2xl border border-danger-soft/25 bg-danger-soft/10 px-4 py-3 text-sm text-danger-soft">{errorMessage}</p> : null}
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({ label, name, value, onChange, placeholder, required = false, type = 'text', inputMode }: { label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; placeholder: string; required?: boolean; type?: string; inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'] }) {
  return <div className="flex flex-col"><label htmlFor={name} className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted">{label}</label><input id={name} name={name} type={type} value={value} onChange={onChange} required={required} inputMode={inputMode} className="min-h-12 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-text placeholder:text-muted outline-none transition focus:border-accent-blue focus:bg-black/35" placeholder={placeholder} /></div>
}

function SelectField({ label, name, value, onChange, options, rawValues, placeholder, required = false, disabled = false }: { label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: string[]; rawValues?: string[]; placeholder?: string; required?: boolean; disabled?: boolean }) {
  return <label className="flex flex-col"><span className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-muted">{label}</span><select name={name} value={value} onChange={onChange} required={required} disabled={disabled} className="min-h-12 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-text outline-none transition focus:border-accent-blue focus:bg-black/35 disabled:cursor-not-allowed disabled:opacity-50">{placeholder ? <option value="">{placeholder}</option> : null}{options.map((option, index) => <option key={`${name}-${option}`} value={rawValues?.[index] ?? option}>{option}</option>)}</select></label>
}
