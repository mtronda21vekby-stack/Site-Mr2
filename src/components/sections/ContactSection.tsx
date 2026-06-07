'use client'

import { useMemo, useState, type ChangeEvent, type FormEvent, type HTMLAttributes } from 'react'
import type { Locale } from '@/components/layout/Header'
import CallButton from '@/components/ui/CallButton'
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
  company: string
  website: string
  fax: string
}

const initialForm: FormState = {
  name: '', phone: '', email: '', service_needed: '', vehicle_make: '', vehicle_model: '', vehicle_year: '', vehicle_make_model: '', location: '', urgency: 'asap', preferred_time: '', message: '', company: '', website: '', fax: '',
}

const glassControlClass = 'min-h-12 rounded-2xl border border-[#0B1F4D]/16 bg-white px-4 py-3 text-sm text-[#0B1F4D] shadow-[0_10px_28px_rgba(11,31,77,0.05)] outline-none transition placeholder:text-[#42526E]/65 focus:border-[#0B1F4D]/45 focus:bg-[#F7FAFF] disabled:cursor-not-allowed disabled:opacity-50'

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
  const optionalDetails = formData.vehicle_make || formData.vehicle_model || formData.vehicle_make_model || formData.vehicle_year || formData.message
  const completionScore = [formData.phone, formData.service_needed, formData.location, optionalDetails, formData.name || formData.email].filter(Boolean).length

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData((prev) => name === 'vehicle_make' ? { ...prev, vehicle_make: value, vehicle_model: '', vehicle_make_model: value === 'Other' ? prev.vehicle_make_model : '' } : { ...prev, [name]: value })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!formData.phone || !formData.service_needed) { setErrorMessage('Phone and service are required.'); return }
    const makeLabel = MAKE_LABELS[formData.vehicle_make] ?? formData.vehicle_make
    const selectedVehicle = [makeLabel, formData.vehicle_model].filter(Boolean).join(' ').trim()
    const payload = { ...formData, vehicle_make: makeLabel, vehicle_make_model: formData.vehicle_make === 'Other' ? formData.vehicle_make_model.trim() : selectedVehicle }
    setStatus('submitting')
    setErrorMessage('')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) { setErrorMessage(data.error || 'Something went wrong.'); setStatus('error'); return }
      setStatus('success')
      setFormData(initialForm)
    } catch { setErrorMessage('Network error. Please try again later.'); setStatus('error') }
  }

  return (
    <section id="request-service" className="relative bg-white pb-28 pt-16 sm:pb-20 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(11,31,77,0.055),transparent_32rem),linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.76fr_1.24fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-[#123A73]">Book mobile locksmith service</p>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-[#0B1F4D] sm:text-5xl lg:text-6xl">{title}</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#42526E]">{text}</p>

          <div className="premium-panel mt-7 rounded-[1.35rem] p-5">
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#123A73]">Service details</p>
                <p className="mt-2 text-sm leading-7 text-[#42526E]">Phone, service, location, urgency, and job details help confirm the right next step.</p>
              </div>
              <span className="rounded-full border border-[#0B1F4D]/18 bg-white px-3 py-1 text-sm font-black text-[#0B1F4D] shadow-[0_10px_26px_rgba(11,31,77,0.06)]">{completionScore}/5</span>
            </div>
            <div className="relative z-10 mt-4 h-2 overflow-hidden rounded-full bg-[#0B1F4D]/10"><div className="h-full rounded-full bg-[#0B1F4D] transition-all" style={{ width: `${Math.round((completionScore / 5) * 100)}%` }} /></div>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              ['Service', 'Select the locksmith service needed.'],
              ['Details', 'Add lock, key, property, or vehicle details.'],
              ['Location', 'Add address, ZIP, or landmark.'],
            ].map(([heading, copy], index) => (
              <div key={heading} className="premium-panel rounded-[1.15rem] p-4">
                <div className="relative z-10 flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0B1F4D]/18 bg-[#F3F7FF] text-xs font-black text-[#0B1F4D]">{index + 1}</span>
                  <div><h3 className="font-semibold text-[#0B1F4D]">{heading}</h3><p className="mt-1 text-sm leading-6 text-[#42526E]">{copy}</p></div>
                </div>
              </div>
            ))}
          </div>

          <CallButton phoneNumber={phoneNumber} phoneDisplay={phoneDisplay} label="Call instead" variant="secondary" className="mt-7 sm:w-auto" />
        </div>

        <form onSubmit={handleSubmit} className="premium-panel rounded-[1.75rem] p-5 sm:p-7">
          <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label>
              Company
              <input name="company" value={formData.company} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            </label>
            <label>
              Website
              <input name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            </label>
            <label>
              Fax
              <input name="fax" value={formData.fax} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="relative z-10 mb-6 border-b border-[#0B1F4D]/10 pb-6">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#123A73]">Service form</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#0B1F4D]">Service details</h3>
            <p className="mt-3 text-sm leading-7 text-[#42526E]">Required: phone and service. Vehicle fields are optional; for home, business, safe, or access-control work, use Extra Details.</p>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
            <Field label="Phone *" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 215 000 0000" required inputMode="tel" />
            <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@email.com" />
            <SelectField label="Service Needed *" name="service_needed" value={formData.service_needed} onChange={handleChange} required placeholder="Select service" options={SERVICE_OPTIONS} />
            <SelectField label="Vehicle Make (if automotive)" name="vehicle_make" value={formData.vehicle_make} onChange={handleChange} placeholder="Select make" options={makes.map((make) => MAKE_LABELS[make] ?? make)} rawValues={makes} />
            {formData.vehicle_make === 'Other' ? <Field label="Vehicle Make / Model" name="vehicle_make_model" value={formData.vehicle_make_model} onChange={handleChange} placeholder="Enter vehicle" /> : <SelectField label="Vehicle Model" name="vehicle_model" value={formData.vehicle_model} onChange={handleChange} placeholder={formData.vehicle_make ? 'Select model' : 'Select make first'} options={selectedModels} disabled={!formData.vehicle_make} />}
            <SelectField label="Vehicle Year (if automotive)" name="vehicle_year" value={formData.vehicle_year} onChange={handleChange} placeholder="Select year" options={years} />
            <SelectField label="Urgency" name="urgency" value={formData.urgency} onChange={handleChange} options={['ASAP / locked out now', 'Same day', 'Scheduled appointment', 'Not urgent']} rawValues={['asap', 'same_day', 'scheduled', 'normal']} />
            <Field label="Service Location" name="location" value={formData.location} onChange={handleChange} placeholder="Philadelphia, PA / address / ZIP" />
            <Field label="Preferred Time" name="preferred_time" value={formData.preferred_time} onChange={handleChange} placeholder="ASAP / Today / 5 PM" />

            <div className="flex flex-col sm:col-span-2"><label htmlFor="message" className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#42526E]">Extra Details</label><textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className={`${glassControlClass} min-h-28 resize-y`} placeholder="Example: keys lost, house lockout, office rekey, safe opening, access control issue, car is running, parking lot name, etc." /></div>

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <button type="submit" disabled={status === 'submitting'} className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#0B1F4D]/10 bg-[#0B1F4D] px-7 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_16px_42px_rgba(11,31,77,0.22)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(11,31,77,0.28)] disabled:opacity-50">{status === 'submitting' ? 'Submitting...' : 'Send Service Details'}</button>
              <CallButton phoneNumber={phoneNumber} phoneDisplay={phoneDisplay} label="Call" variant="secondary" />
            </div>

            {status === 'success' ? <p className="sm:col-span-2 rounded-2xl border border-[#0B1F4D]/18 bg-[#F3F7FF] px-4 py-3 text-sm text-[#0B1F4D]">Thank you. We received your service details.</p> : null}
            {errorMessage ? <p className="sm:col-span-2 rounded-2xl border border-danger-soft/25 bg-danger-soft/10 px-4 py-3 text-sm text-danger-soft">{errorMessage}</p> : null}
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({ label, name, value, onChange, placeholder, required = false, type = 'text', inputMode }: { label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; placeholder: string; required?: boolean; type?: string; inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'] }) {
  return <div className="flex flex-col"><label htmlFor={name} className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#42526E]">{label}</label><input id={name} name={name} type={type} value={value} onChange={onChange} required={required} inputMode={inputMode} className={glassControlClass} placeholder={placeholder} /></div>
}

function SelectField({ label, name, value, onChange, options, rawValues, placeholder, required = false, disabled = false }: { label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: string[]; rawValues?: string[]; placeholder?: string; required?: boolean; disabled?: boolean }) {
  return <label className="flex flex-col"><span className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#42526E]">{label}</span><select name={name} value={value} onChange={onChange} required={required} disabled={disabled} className={glassControlClass}>{placeholder ? <option value="">{placeholder}</option> : null}{options.map((option, index) => <option key={`${name}-${option}`} value={rawValues?.[index] ?? option}>{option}</option>)}</select></label>
}
