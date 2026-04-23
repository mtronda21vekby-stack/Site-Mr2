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
        data: { user },
      } = await supabase.auth.getUser()

      const isLoginRoute = pathname === '/admin/login'

      if (isLoginRoute) {
        if (user) {
          router.replace('/admin/direct')
          return
        }

        if (mounted) {
          setIsAllowed(true)
          setIsChecking(false)
        }

        return
      }

      if (!user) {
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
          background: '#05070B',
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
            background: '#0B1020',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 24,
            boxSizing: 'border-box',
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#95A0B8',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            Planetlocksmiths
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
