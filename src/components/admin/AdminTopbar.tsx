'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminTopbar() {
  const supabase = useMemo(() => getSupabaseClient(), [])
  const [userEmail, setUserEmail] = useState('Unknown session')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!mounted) return

      setUserEmail(user?.email ?? 'Unknown session')
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      setUserEmail(session?.user?.email ?? 'Unknown session')
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  async function handleLogout() {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 6,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#A9D0FF',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: '#2DE2E6',
              display: 'inline-block',
              boxShadow: '0 0 12px rgba(45,226,230,0.8)',
            }}
          />
          AUTHENTICATED SESSION
        </div>

        <p
          style={{
            margin: 0,
            color: '#95A0B8',
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          Signed in as <span style={{ color: '#F5F7FB' }}>{userEmail}</span>
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <a
          href="/en"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 42,
            padding: '0 14px',
            borderRadius: 12,
            textDecoration: 'none',
            background: '#4DA2FF',
            color: '#05070B',
            fontWeight: 700,
          }}
        >
          Open site
        </a>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            minHeight: 42,
            padding: '0 14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.10)',
            background: '#11192E',
            color: '#F5F7FB',
            fontWeight: 700,
            cursor: isLoggingOut ? 'default' : 'pointer',
            opacity: isLoggingOut ? 0.7 : 1,
          }}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}
