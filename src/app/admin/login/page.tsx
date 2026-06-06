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
        data: { user },
      } = await supabase.auth.getUser()

      if (user && mounted) {
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
          'radial-gradient(circle at top, rgba(77,162,255,0.10), transparent 30%), #05070B',
        color: '#F5F7FB',
        padding: 20,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'rgba(11,16,32,0.88)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 28,
          padding: 24,
          boxSizing: 'border-box',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              margin: 0,
              color: '#95A0B8',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            Planet Locksmiths
          </p>

          <h1
            style={{
              margin: '10px 0 8px',
              fontSize: 34,
              lineHeight: 1.05,
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
  background: '#11192E',
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
  border: 'none',
  background: '#4DA2FF',
  color: '#05070B',
  fontWeight: 800,
  fontSize: 16,
  cursor: 'pointer',
}
