'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type SettingsState = {
  brandName: string
  phonePrimary: string
  phoneDisplay: string
  email: string
  serviceHours: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  const [isChecking, setIsChecking] = useState(true)
  const [form, setForm] = useState<SettingsState>({
    brandName: 'Planetlocksmiths',
    phonePrimary: '+1 (267) 000-0000',
    phoneDisplay: '(267) 000-0000',
    email: 'hello@planetlocksmiths.com',
    serviceHours: '24/7 Mobile Service',
  })

  useEffect(() => {
    let isMounted = true

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/admin/login')
        return
      }

      if (isMounted) {
        setIsChecking(false)
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [router, supabase])

  if (isChecking) {
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
        <p>Loading settings...</p>
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
            onChange={(value) =>
              setForm((prev) => ({ ...prev, brandName: value }))
            }
          />

          <Field
            label="Primary Phone"
            value={form.phonePrimary}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, phonePrimary: value }))
            }
          />

          <Field
            label="Display Phone"
            value={form.phoneDisplay}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, phoneDisplay: value }))
            }
          />

          <Field
            label="Email"
            value={form.email}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, email: value }))
            }
          />

          <Field
            label="Service Hours"
            value={form.serviceHours}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, serviceHours: value }))
            }
          />

          <button
            type="button"
            style={{
              minHeight: 50,
              borderRadius: 14,
              border: 'none',
              background: '#4DA2FF',
              color: '#05070B',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Save Settings
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
