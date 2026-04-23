'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type SettingsForm = {
  id: string
  brandName: string
  phonePrimary: string
  phoneDisplay: string
  email: string
  serviceHours: string
}

const defaultForm: SettingsForm = {
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

  const [form, setForm] = useState<SettingsForm>(defaultForm)
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

        if (!session) {
          router.replace('/admin/login')
          return
        }

        const row = await ensureSettingsRow()

        if (!mounted) return

        setForm({
          id: row.id ?? '',
          brandName: row.brand_name ?? defaultForm.brandName,
          phonePrimary: row.phone_primary ?? defaultForm.phonePrimary,
          phoneDisplay: row.phone_display ?? defaultForm.phoneDisplay,
          email: row.email ?? defaultForm.email,
          serviceHours: row.service_hours ?? defaultForm.serviceHours,
        })
      } catch (error) {
        if (!mounted) return
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load settings'
        )
      } finally {
        if (mounted) {
          setIsBooting(false)
        }
      }
    }

    async function ensureSettingsRow() {
      const existingResult = await supabase
        .from('site_settings')
        .select('id, brand_name, phone_primary, phone_display, email, service_hours')
        .limit(1)
        .maybeSingle()

      if (existingResult.error) {
        throw new Error(existingResult.error.message)
      }

      if (existingResult.data) {
        return existingResult.data
      }

      const insertResult = await supabase
        .from('site_settings')
        .insert({
          brand_name: defaultForm.brandName,
          phone_primary: defaultForm.phonePrimary,
          phone_display: defaultForm.phoneDisplay,
          email: defaultForm.email,
          service_hours: defaultForm.serviceHours,
        })
        .select('id, brand_name, phone_primary, phone_display, email, service_hours')
        .single()

      if (insertResult.error) {
        throw new Error(insertResult.error.message)
      }

      return insertResult.data
    }

    boot()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    if (!form.id) {
      setErrorMessage('Settings row not found')
      return
    }

    setIsSaving(true)

    try {
      const updateResult = await supabase
        .from('site_settings')
        .update({
          brand_name: form.brandName.trim(),
          phone_primary: form.phonePrimary.trim(),
          phone_display: form.phoneDisplay.trim(),
          email: form.email.trim(),
          service_hours: form.serviceHours.trim(),
        })
        .eq('id', form.id)

      if (updateResult.error) {
        throw new Error(updateResult.error.message)
      }

      setSuccessMessage('Settings saved successfully')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to save settings'
      )
    } finally {
      setIsSaving(false)
    }
  }

  function updateField<K extends keyof SettingsForm>(
    key: K,
    value: SettingsForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (isBooting) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: '#05070B',
          color: '#F5F7FB',
          padding: '24px 16px 40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ margin: 0, color: '#95A0B8', fontSize: 14 }}>
            Loading settings...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#05070B',
        color: '#F5F7FB',
        padding: '20px 16px 40px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <a
            href="/admin/direct"
            style={{
              display: 'inline-block',
              marginBottom: 10,
              color: '#95A0B8',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            ← Back to dashboard
          </a>

          <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>
            Planetlocksmiths / Admin / Settings
          </p>

          <h1 style={{ margin: '8px 0 0', fontSize: 32, lineHeight: 1.1 }}>
            Settings
          </h1>
        </div>

        <form
          onSubmit={handleSave}
          style={{
            display: 'grid',
            gap: 16,
            background: '#0B1020',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 18,
          }}
        >
          <Field
            label="Brand Name"
            value={form.brandName}
            onChange={(value) => updateField('brandName', value)}
          />

          <Field
            label="Primary Phone"
            value={form.phonePrimary}
            onChange={(value) => updateField('phonePrimary', value)}
          />

          <Field
            label="Display Phone"
            value={form.phoneDisplay}
            onChange={(value) => updateField('phoneDisplay', value)}
          />

          <Field
            label="Email"
            value={form.email}
            onChange={(value) => updateField('email', value)}
          />

          <Field
            label="Service Hours"
            value={form.serviceHours}
            onChange={(value) => updateField('serviceHours', value)}
          />

          {errorMessage ? (
            <div
              style={{
                borderRadius: 12,
                border: '1px solid rgba(255,122,122,0.25)',
                background: 'rgba(255,122,122,0.08)',
                color: '#FF9A9A',
                padding: '12px 14px',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div
              style={{
                borderRadius: 12,
                border: '1px solid rgba(77,162,255,0.25)',
                background: 'rgba(77,162,255,0.08)',
                color: '#A9D0FF',
                padding: '12px 14px',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {successMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSaving}
            style={{
              minHeight: 50,
              borderRadius: 14,
              border: 'none',
              background: '#4DA2FF',
              color: '#05070B',
              fontWeight: 700,
              fontSize: 16,
              cursor: isSaving ? 'default' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: '100%',
          minHeight: 50,
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.10)',
          background: '#11192E',
          color: '#F5F7FB',
          padding: '0 14px',
          outline: 'none',
          fontSize: 16,
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
        }}
      />
    </label>
  )
}
