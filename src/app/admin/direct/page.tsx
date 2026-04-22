'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminDashboardPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()

  const [isChecking, setIsChecking] = useState(true)

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

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

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
        <p>Loading admin...</p>
      </main>
    )
  }

  const items = [
    {
      title: 'Settings',
      href: '/admin/settings',
      description: 'Brand, phone, email, and service hours',
    },
    {
      title: 'Home',
      href: '/admin/home',
      description: 'Hero section, badges, and homepage content',
    },
    {
      title: 'Services',
      href: '/admin/services',
      description: 'Service pages and localized content',
    },
    {
      title: 'Areas',
      href: '/admin/areas',
      description: 'Philadelphia and future city pages',
    },
    {
      title: 'Reviews',
      href: '/admin/reviews',
      description: 'Customer reviews management',
    },
    {
      title: 'FAQ',
      href: '/admin/faq',
      description: 'Questions and answers by locale',
    },
  ]

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
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            marginBottom: 20,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>
              Planetlocksmiths / Admin
            </p>
            <h1 style={{ margin: '8px 0 0', fontSize: 32, lineHeight: 1.1 }}>
              Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href="/en"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 44,
                padding: '0 16px',
                borderRadius: 12,
                textDecoration: 'none',
                color: '#05070B',
                background: '#4DA2FF',
                fontWeight: 700,
              }}
            >
              Open site
            </a>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                minHeight: 44,
                padding: '0 16px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'transparent',
                color: '#F5F7FB',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: '#F5F7FB',
                background: '#0B1020',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: 18,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
                {item.title}
              </h2>
              <p
                style={{
                  margin: '10px 0 0',
                  color: '#95A0B8',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
