'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type SiteSettingsRow = {
  id: string
  brand_name: string
  phone_primary: string
  phone_display: string
  email: string
  service_hours: string
}

type SettingsForm = {
  id: string
  brandName: string
  phonePrimary: string
  phoneDisplay: string
  email: string
  serviceHours: string
}

const initialForm: SettingsForm = {
  id: '',
  brandName: '',
  phonePrimary: '',
  phoneDisplay: '',
  email: '',
  serviceHours: '',
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseClient(), [])

  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [form, setForm] = useState<SettingsForm>(initialForm)

  useEffect(() => {
    let isMounted = true

    async function boot() {
      setErrorMessage('')
      setSuccessMessage('')

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        if (isMounted) {
          setErrorMessage(sessionError.message)
          setIsCheckingSession(false)
        }
        return
      }

      if (!session) {
        router.replace('/admin/login')
        return
      }

      if (isMounted) {
        setIsCheckingSession(false)
      }

      await loadSettings(isMounted)
    }

    async function loadSettings(mounted: boolean) {
      setIsLoadingData(true)

      const { data, error } = await supabase
        .from('site_settings')
        .select('id, brand_name, phone_primary, phone_display, email, service_hours')
        .limit(1)
        .single()

      if (error) {
        if (mounted) {
          setErrorMessage(error.message)
          setIsLoadingData(false)
        }
        return
      }

      if (mounted && data) {
        const row = data as SiteSettingsRow

        setForm({
          id: row.id,
          brandName: row.brand_name ?? '',
          phonePrimary: row.phone_primary ?? '',
          phoneDisplay: row.phone_display ?? '',
          email: row.email ?? '',
          serviceHours: row.service_hours ?? '',
        })

        setIsLoadingData(false)
      }
    }

    boot()

    return () => {
      isMounted = false
    }
  }, [router, supabase])

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    if (!form.id) {
      setErrorMessage('Settings row is missing')
      return
    }

    setIsSaving(true)

    const { error } = await supabase
      .from('site_settings')
      .update({
        brand_name: form.brandName.trim(),
        phone_primary: form.phonePrimary.trim(),
        phone_display: form.phoneDisplay.trim(),
        email: form.email.trim(),
        service_hours: form.serviceHours.trim(),
      })
      .eq('id', form.id)

    setIsSaving(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    setSuccessMessage('Settings saved successfully')
  }

  function updateField<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (isCheckingSession || isLoadingData) {
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
