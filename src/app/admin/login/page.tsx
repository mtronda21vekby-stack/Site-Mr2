'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseClient(), [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session && mounted) {
        router.replace('/admin/direct')
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    router.replace('/admin/direct')
    router.refresh()
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background:
          'linear-gradient(180deg, #111319 0%, #06070A 48%, #020304 100%)',
        color: '#F5F7FB',
        padding: 20,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.072), rgba(255,255,255,0.028)), rgba(9,10,14,0.92)',
          border: '1px solid rgba(214,168,95,0.22)',
          borderRadius: 26,
          padding: 26,
          boxSizing: 'border-box',
          backdropFilter: 'blur(12px)',
          boxShadow:
            '0 28px 90px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <img
            src="/planetlocksmiths-logo.svg"
            alt="Planet Locksmiths"
            style={{
              width: 54,
              height: 54,
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.12)',
              background: '#05070B',
              objectFit: 'contain',
            }}
          />
          <div>
            <p
              style={{
                margin: 0,
                color: '#D6A85F',
                fontSize: 11,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: 1.7,
              }}
            >
              Planet Locksmiths
            </p>
            <strong style={{ display: 'block', marginTop: 4, color: '#F5F7FB', fontSize: 17 }}>
              Admin Control Room
            </strong>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              margin: 0,
              color: '#F0D099',
              fontSize: 12,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: 1.7,
            }}
          >
            Secure workspace
          </p>

          <h1
            style={{
              margin: '10px 0 8px',
              fontSize: 34,
              lineHeight: 1.05,
              letterSpacing: -0.7,
            }}
          >
            Secure Admin Access
          </h1>

          <p
            style={{
              margin: 0,
              color: '#95A0B8',
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Sign in to manage live website content, localized pages, reviews,
            FAQ, and services.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ color: '#95A0B8', fontSize: 14 }}>Admin Email</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="admin@planetlocksmiths.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={inputStyle}
              required
            />
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ color: '#95A0B8', fontSize: 14 }}>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={inputStyle}
              required
            />
          </label>

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

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...buttonStyle,
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Enter Control Panel'}
          </button>
        </form>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 52,
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'rgba(255,255,255,0.045)',
  color: '#F5F7FB',
  padding: '0 14px',
  outline: 'none',
  fontSize: 16,
  boxSizing: 'border-box',
  WebkitAppearance: 'none',
}

const buttonStyle: React.CSSProperties = {
  minHeight: 52,
  borderRadius: 14,
  border: '1px solid rgba(245,247,251,0.24)',
  background:
    'linear-gradient(180deg, rgba(255,255,255,1), rgba(223,226,232,1))',
  color: '#05070B',
  fontWeight: 800,
  fontSize: 16,
  cursor: 'pointer',
}
