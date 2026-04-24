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

const SERVICE_OPTIONS = [
  'Car lockout',
  'Car key replacement',
  'Lost all keys',
  'Key fob programming',
  'Transponder key programming',
  'Ignition repair / replacement',
  'Broken key extraction',
  'Trunk lockout',
  'Remote battery / remote issue',
  'Other automotive locksmith service',
]

const VEHICLE_MODELS: Record<string, string[]> = {
  Acura: ['ILX', 'Integra', 'TLX', 'RLX', 'NSX', 'RDX', 'MDX', 'ZDX', 'Other Acura'],
  Audi: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'Other Audi'],
  BMW: ['2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'i3', 'i4', 'iX', 'Other BMW'],
  Buick: ['Encore', 'Encore GX', 'Envision', 'Enclave', 'Regal', 'LaCrosse', 'Other Buick'],
  Cadillac: ['ATS', 'CTS', 'CT4', 'CT5', 'CT6', 'XT4', 'XT5', 'XT6', 'Escalade', 'Other Cadillac'],
  Chevrolet: ['Spark', 'Sonic', 'Cruze', 'Malibu', 'Impala', 'Camaro', 'Corvette', 'Trax', 'Trailblazer', 'Equinox', 'Blazer', 'Traverse', 'Tahoe', 'Suburban', 'Colorado', 'Silverado 1500', 'Silverado HD', 'Bolt EV', 'Other Chevrolet'],
  Chrysler: ['200', '300', 'Pacifica', 'Town & Country', 'Voyager', 'Other Chrysler'],
  Dodge: ['Dart', 'Charger', 'Challenger', 'Avenger', 'Durango', 'Journey', 'Grand Caravan', 'Hornet', 'Other Dodge'],
  Ford: ['Fiesta', 'Focus', 'Fusion', 'Taurus', 'Mustang', 'EcoSport', 'Escape', 'Edge', 'Explorer', 'Expedition', 'Bronco', 'Bronco Sport', 'Maverick', 'Ranger', 'F-150', 'F-250', 'F-350', 'Transit', 'Other Ford'],
  Genesis: ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80', 'Other Genesis'],
  GMC: ['Terrain', 'Acadia', 'Yukon', 'Canyon', 'Sierra 1500', 'Sierra HD', 'Savana', 'Hummer EV', 'Other GMC'],
  Honda: ['Fit', 'Civic', 'Accord', 'Insight', 'HR-V', 'CR-V', 'Passport', 'Pilot', 'Odyssey', 'Ridgeline', 'Clarity', 'Other Honda'],
  Hyundai: ['Accent', 'Elantra', 'Sonata', 'Veloster', 'Venue', 'Kona', 'Tucson', 'Santa Fe', 'Palisade', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'Santa Cruz', 'Other Hyundai'],
  Infiniti: ['Q50', 'Q60', 'Q70', 'QX30', 'QX50', 'QX55', 'QX60', 'QX70', 'QX80', 'Other Infiniti'],
  Jaguar: ['XE', 'XF', 'XJ', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace', 'Other Jaguar'],
  Jeep: ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler', 'Gladiator', 'Wagoneer', 'Grand Wagoneer', 'Patriot', 'Liberty', 'Other Jeep'],
  Kia: ['Rio', 'Forte', 'K5', 'Optima', 'Stinger', 'Soul', 'Seltos', 'Sportage', 'Sorento', 'Telluride', 'Carnival', 'Niro', 'EV6', 'Other Kia'],
  LandRover: ['Discovery Sport', 'Discovery', 'Range Rover Evoque', 'Range Rover Velar', 'Range Rover Sport', 'Range Rover', 'Defender', 'Other Land Rover'],
  Lexus: ['IS', 'ES', 'GS', 'LS', 'UX', 'NX', 'RX', 'GX', 'LX', 'RC', 'LC', 'Other Lexus'],
  Lincoln: ['MKZ', 'Continental', 'Corsair', 'Nautilus', 'Aviator', 'Navigator', 'MKC', 'MKX', 'MKT', 'Other Lincoln'],
  Mazda: ['Mazda2', 'Mazda3', 'Mazda5', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-9', 'CX-90', 'MX-5 Miata', 'Other Mazda'],
  MercedesBenz: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'CLS', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'Sprinter', 'Metris', 'Other Mercedes-Benz'],
  Mini: ['Cooper', 'Cooper S', 'Clubman', 'Countryman', 'Paceman', 'Other MINI'],
  Mitsubishi: ['Mirage', 'Lancer', 'Outlander Sport', 'Outlander', 'Eclipse Cross', 'Montero', 'Other Mitsubishi'],
  Nissan: ['Versa', 'Sentra', 'Altima', 'Maxima', 'Leaf', 'Kicks', 'Rogue Sport', 'Rogue', 'Murano', 'Pathfinder', 'Armada', 'Frontier', 'Titan', '370Z', 'Z', 'Other Nissan'],
  Porsche: ['718', '911', 'Panamera', 'Macan', 'Cayenne', 'Taycan', 'Other Porsche'],
  Ram: ['1500', '2500', '3500', 'ProMaster', 'ProMaster City', 'Other Ram'],
  Subaru: ['Impreza', 'Legacy', 'WRX', 'BRZ', 'Crosstrek', 'Forester', 'Outback', 'Ascent', 'Other Subaru'],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Other Tesla'],
  Toyota: ['Yaris', 'Corolla', 'Camry', 'Avalon', 'Prius', 'C-HR', 'Corolla Cross', 'RAV4', 'Venza', 'Highlander', '4Runner', 'Sequoia', 'Sienna', 'Tacoma', 'Tundra', 'GR86', 'Supra', 'Other Toyota'],
  Volkswagen: ['Golf', 'GTI', 'Jetta', 'Passat', 'Arteon', 'Beetle', 'Taos', 'Tiguan', 'Atlas', 'ID.4', 'Other Volkswagen'],
  Volvo: ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C40', 'Other Volvo'],
  Other: ['Other / Not listed'],
}

const MAKE_LABELS: Record<string, string> = {
  LandRover: 'Land Rover',
  MercedesBenz: 'Mercedes-Benz',
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

export default function ContactSection({
  title,
  text,
  phoneNumber,
  phoneDisplay,
}: ContactSectionProps) {
  const [formData, setFormData] = useState<FormState>(initialForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear() + 1
    return Array.from({ length: currentYear - 1989 }, (_, index) => String(currentYear - index))
  }, [])

  const makes = Object.keys(VEHICLE_MODELS)
  const selectedModels = formData.vehicle_make ? VEHICLE_MODELS[formData.vehicle_make] ?? [] : []

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target

    setFormData((prev) => {
      if (name === 'vehicle_make') {
        return {
          ...prev,
          vehicle_make: value,
          vehicle_model: '',
          vehicle_make_model: value === 'Other' ? prev.vehicle_make_model : '',
        }
      }

      return { ...prev, [name]: value }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.phone || !formData.service_needed) {
      setErrorMessage('Phone and service are required.')
      return
    }

    const makeLabel = MAKE_LABELS[formData.vehicle_make] ?? formData.vehicle_make
    const selectedVehicle = [makeLabel, formData.vehicle_model]
      .filter(Boolean)
      .join(' ')
      .trim()

    const payload = {
      ...formData,
      vehicle_make: makeLabel,
      vehicle_make_model:
        formData.vehicle_make === 'Other'
          ? formData.vehicle_make_model.trim()
          : selectedVehicle,
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    <section id="request-service" className="relative overflow-hidden bg-transparent py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(77,162,255,0.12),transparent_28rem),radial-gradient(circle_at_90%_30%,rgba(214,168,95,0.08),transparent_24rem)]" />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-accent-cyan">
            Request mobile locksmith service
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-text sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted">{text}</p>

          <div className="mt-8 grid gap-4">
            {[
              ['1', 'Choose service', 'Tell us what happened: lockout, lost key, fob programming, ignition, or other.'],
              ['2', 'Select vehicle', 'Pick make, model, and year using mobile-friendly wheel selectors.'],
              ['3', 'Send request', 'We receive the details and can respond faster with the right equipment.'],
            ].map(([step, heading, copy]) => (
              <div key={step} className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                <div className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-blue text-sm font-bold text-black">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text">{heading}</h3>
                    <p className="mt-1 text-sm leading-7 text-muted">{copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <a
            href={`tel:${phoneNumber}`}
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.035] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-text backdrop-blur-xl transition hover:border-accent-blue/45 hover:bg-accent-blue/10 sm:w-auto"
          >
            Call instead: {phoneDisplay}
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7"
        >
          <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-gold">
                Fast quote form
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-text">
                Vehicle + service details
              </h3>
            </div>
            <span className="w-fit rounded-full border border-accent-blue/25 bg-accent-blue/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-accent-cyan">
              Secure request
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              inputMode="tel"
            />

            <Field
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@email.com"
            />

            <SelectField
              label="Service Needed *"
              name="service_needed"
              value={formData.service_needed}
              onChange={handleChange}
              required
              placeholder="Select service"
              options={SERVICE_OPTIONS}
            />

            <SelectField
              label="Vehicle Make"
              name="vehicle_make"
              value={formData.vehicle_make}
              onChange={handleChange}
              placeholder="Select make"
              options={makes.map((make) => MAKE_LABELS[make] ?? make)}
              rawValues={makes}
            />

            {formData.vehicle_make === 'Other' ? (
              <Field
                label="Vehicle Make / Model"
                name="vehicle_make_model"
                value={formData.vehicle_make_model}
                onChange={handleChange}
                placeholder="Enter vehicle"
              />
            ) : (
              <SelectField
                label="Vehicle Model"
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                placeholder={formData.vehicle_make ? 'Select model' : 'Select make first'}
                options={selectedModels}
                disabled={!formData.vehicle_make}
              />
            )}

            <SelectField
              label="Vehicle Year"
              name="vehicle_year"
              value={formData.vehicle_year}
              onChange={handleChange}
              placeholder="Select year"
              options={years}
            />

            <SelectField
              label="Urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              options={['ASAP / locked out now', 'Same day', 'Scheduled appointment', 'Not urgent']}
              rawValues={['asap', 'same_day', 'scheduled', 'normal']}
            />

            <Field
              label="Service Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Philadelphia, PA / address / ZIP"
            />

            <Field
              label="Preferred Time"
              name="preferred_time"
              value={formData.preferred_time}
              onChange={handleChange}
              placeholder="ASAP / Today / 5 PM"
            />

            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="message" className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                Extra Details
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
                placeholder="Example: keys lost, car is running, door locked, key fob not detected, parking lot name, etc."
              />
            </div>

            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent-blue px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black shadow-[0_0_44px_rgba(77,162,255,0.32)] transition hover:brightness-110 disabled:opacity-50"
              >
                {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
              </button>

              <a
                href={`tel:${phoneNumber}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-black/25 px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-text transition hover:border-accent-gold/50 hover:bg-accent-gold/10"
              >
                Call {phoneDisplay}
              </a>
            </div>

            {status === 'success' ? (
              <p className="sm:col-span-2 rounded-2xl border border-accent-gold/25 bg-accent-gold/10 px-4 py-3 text-sm text-accent-gold">
                Thank you. Your request has been received.
              </p>
            ) : null}

            {errorMessage ? (
              <p className="sm:col-span-2 rounded-2xl border border-danger-soft/25 bg-danger-soft/10 px-4 py-3 text-sm text-danger-soft">
                {errorMessage}
              </p>
            ) : null}
          </div>
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
  inputMode,
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
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        inputMode={inputMode}
        className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-text placeholder:text-muted focus:border-accent-blue focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  rawValues,
  placeholder,
  required = false,
  disabled = false,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[]
  rawValues?: string[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
}) {
  return (
    <label className="flex flex-col">
      <span className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-text focus:border-accent-blue focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option, index) => (
          <option key={`${name}-${option}`} value={rawValues?.[index] ?? option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
