'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
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

    setSuccessMessage('Signed in successfully')
    router.push('/admin')
    router.refresh()
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#05070B',
        color: '#F5F7FB',
        padding: 20,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#0B1020',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: 22,
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#95A0B8',
            fontSize: 14,
          }}
        >
          Planetlocksmiths Admin
        </p>

        <h1
          style={{
            margin: '8px 0 14px',
            fontSize: 32,
            lineHeight: 1.1,
          }}
        >
          Sign in
        </h1>

        <p
          style={{
            margin: '0 0 20px',
            color: '#95A0B8',
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Secure administrator access for content and website management.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ color: '#95A0B8', fontSize: 14 }}>Email</span>
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
            disabled={isSubmitting}
            style={{
              ...buttonStyle,
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Continue'}
          </button>
        </form>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
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
}

const buttonStyle: React.CSSProperties = {
  minHeight: 50,
  borderRadius: 14,
  border: 'none',
  background: '#4DA2FF',
  color: '#05070B',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
}
