'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminAuthGate({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => getSupabaseClient(), [])

  const [isChecking, setIsChecking] = useState(true)
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    let mounted = true

    async function boot() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const isLoginRoute = pathname === '/admin/login'
      const hasSession = Boolean(session)

      if (isLoginRoute) {
        if (hasSession) {
          router.replace('/admin/direct')
          return
        }

        if (mounted) {
          setIsAllowed(true)
          setIsChecking(false)
        }

        return
      }

      if (!hasSession) {
        router.replace('/admin/login')
        return
      }

      if (mounted) {
        setIsAllowed(true)
        setIsChecking(false)
      }
    }

    boot()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const isLoginRoute = pathname === '/admin/login'

      if (!session && !isLoginRoute) {
        router.replace('/admin/login')
        return
      }

      if (session && isLoginRoute) {
        router.replace('/admin/direct')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [pathname, router, supabase])

  if (isChecking) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #111319 0%, #06070A 48%, #020304 100%)',
          color: '#F5F7FB',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.072), rgba(255,255,255,0.028)), rgba(9,10,14,0.92)',
            border: '1px solid rgba(214,168,95,0.22)',
            borderRadius: 22,
            padding: 24,
            boxSizing: 'border-box',
            boxShadow:
              '0 28px 90px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <img
            src="/planetlocksmiths-logo.svg"
            alt="Planet Locksmiths"
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.12)',
              background: '#05070B',
              objectFit: 'contain',
              marginBottom: 16,
            }}
          />
          <p
            style={{
              margin: 0,
              color: '#D6A85F',
              fontSize: 12,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: 1.7,
            }}
          >
            Planet Locksmiths
          </p>

          <h1
            style={{
              margin: '10px 0 8px',
              fontSize: 28,
              lineHeight: 1.1,
            }}
          >
            Checking secure session
          </h1>

          <p
            style={{
              margin: 0,
              color: '#95A0B8',
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Verifying administrator access…
          </p>
        </div>
      </main>
    )
  }

  if (!isAllowed) {
    return null
  }

  return <>{children}</>
}
