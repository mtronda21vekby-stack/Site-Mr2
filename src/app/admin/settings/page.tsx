'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'

type SettingsState = {
  id: string
  brandName: string
  phonePrimary: string
  phoneDisplay: string
  email: string
  serviceHours: string
}

const FORM_ID = 'admin-settings-form'
const initialState: SettingsState = {
  id: '',
  brandName: 'Planetlocksmiths',
  phonePrimary: '+1 (267) 000-0000',
  phoneDisplay: '(267) 000-0000',
  email: 'hello@planetlocksmiths.com',
  serviceHours: '24/7 Mobile Service',
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [form, setForm] = useState<SettingsState>(initialState)
  const [isBooting, setIsBooting] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function boot() {
      try {
        setErrorMessage('')
        setSuccessMessage('')
        const sessionResult = await supabase.auth.getSession()
        const session = sessionResult?.data?.session
        if (!session) { router.replace('/admin/login'); return }

        const result = await (supabase.from('site_settings') as any)
          .select('id, brand_name, phone_primary, phone_display, email, service_hours')
          .limit(1)

        if (result.error) throw new Error(result.error.message)
        const row = Array.isArray(result.data) ? result.data[0] : null

        if (mounted && row) {
          setForm({
            id: row.id ?? '',
            brandName: row.brand_name ?? initialState.brandName,
            phonePrimary: row.phone_primary ?? initialState.phonePrimary,
            phoneDisplay: row.phone_display ?? initialState.phoneDisplay,
            email: row.email ?? initialState.email,
            serviceHours: row.service_hours ?? initialState.serviceHours,
          })
        }
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load settings')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => { mounted = false }
  }, [router, supabase])

  function updateField<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const brandName = form.brandName.trim()
    const phonePrimary = form.phonePrimary.trim()
    const phoneDisplay = form.phoneDisplay.trim()
    const email = form.email.trim()
    const serviceHours = form.serviceHours.trim()

    if (!brandName) { setErrorMessage('Brand Name is required.'); return }
    if (!phonePrimary) { setErrorMessage('Primary Phone is required.'); return }
    if (!phoneDisplay) { setErrorMessage('Display Phone is required.'); return }
    if (!serviceHours) { setErrorMessage('Service Hours is required.'); return }
    if (email && !email.includes('@')) { setErrorMessage('Email must be a valid email address.'); return }

    setIsSaving(true)

    try {
      const payload = {
        brand_name: brandName,
        phone_primary: phonePrimary,
        phone_display: phoneDisplay,
        email: email || null,
        service_hours: serviceHours,
      }

      if (form.id) {
        const result = await (supabase.from('site_settings') as any).update(payload).eq('id', form.id)
        if (result.error) throw new Error(result.error.message)
      } else {
        const result = await (supabase.from('site_settings') as any).insert(payload).select('id').single()
        if (result.error) throw new Error(result.error.message)
        setForm((prev) => ({ ...prev, id: result.data?.id ?? '' }))
      }

      setSuccessMessage('Global settings saved')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (isBooting) return <div style={{ paddingTop: 20 }}><p style={{ color: '#95A0B8', margin: 0 }}>Loading settings...</p></div>

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>Planetlocksmiths / Admin / Settings</p>
          <h2 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.1 }}>Settings</h2>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="/en" target="_blank" rel="noreferrer" style={ghostLinkStyle}>Open site</a>
          <a href={`tel:${form.phonePrimary}`} style={ghostLinkStyle}>Call {form.phoneDisplay}</a>
        </div>
      </div>

      <div style={guideStyle}>Global settings control public phone CTAs, header call links, contact blocks, service hours, and business identity. Keep phone values live before running ads.</div>
      {errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}
      {successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}

      <form id={FORM_ID} onSubmit={handleSave} style={{ display: 'grid', gap: 16, background: '#0B1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18 }}>
        <SectionTitle title="Brand" text="Core global identity and public contact data." />
        <Field label="Brand Name" value={form.brandName} onChange={(value) => updateField('brandName', value)} />
        <Field label="Primary Phone" value={form.phonePrimary} onChange={(value) => updateField('phonePrimary', value)} />
        <Field label="Display Phone" value={form.phoneDisplay} onChange={(value) => updateField('phoneDisplay', value)} />
        <Field label="Email" value={form.email} onChange={(value) => updateField('email', value)} />
        <Field label="Service Hours" value={form.serviceHours} onChange={(value) => updateField('serviceHours', value)} />
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label="Save Settings" note="Global settings affect header, contact blocks, phone CTAs and shared site metadata." />
    </div>
  )
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return <div style={{ display: 'grid', gap: 6 }}><strong style={{ fontSize: 18, color: '#F5F7FB' }}>{title}</strong><span style={{ fontSize: 14, color: '#95A0B8', lineHeight: 1.6 }}>{text}</span></div>
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label style={{ display: 'grid', gap: 8 }}><span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} /></label>
}

function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) {
  const isError = type === 'error'
  return <div style={{ borderRadius: 12, border: isError ? '1px solid rgba(255,122,122,0.25)' : '1px solid rgba(77,162,255,0.25)', background: isError ? 'rgba(255,122,122,0.08)' : 'rgba(77,162,255,0.08)', color: isError ? '#FF9A9A' : '#A9D0FF', padding: '12px 14px', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>{children}</div>
}

const inputStyle: CSSProperties = { width: '100%', minHeight: 48, borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const ghostLinkStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 42, padding: '0 14px', borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', fontWeight: 700 }
const guideStyle: CSSProperties = { marginBottom: 16, borderRadius: 16, border: '1px solid rgba(77,162,255,0.20)', background: 'rgba(77,162,255,0.08)', color: '#A9D0FF', padding: 14, fontSize: 14, lineHeight: 1.6 }
