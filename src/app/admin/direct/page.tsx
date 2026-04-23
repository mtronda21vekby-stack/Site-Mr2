'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStatCard from '@/components/admin/AdminStatCard'

export default function AdminDashboardPage() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseClient(), [])

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

  if (isChecking) {
    return (
      <div style={{ paddingTop: 20 }}>
        <p style={{ color: '#95A0B8', margin: 0 }}>Loading admin...</p>
      </div>
    )
  }

  const links = [
    {
      title: 'Settings',
      href: '/admin/settings',
      description: 'Global brand, phones, email, service hours',
    },
    {
      title: 'Home',
      href: '/admin/home',
      description: 'Hero, CTA, emergency, reviews heading, contact text',
    },
    {
      title: 'Reviews',
      href: '/admin/reviews',
      description: 'Localized reviews and publishing control',
    },
    {
      title: 'FAQ',
      href: '/admin/faq',
      description: 'Localized FAQ management and ordering',
    },
    {
      title: 'Services',
      href: '/admin/services',
      description: 'Real service pages, SEO fields, publishing state',
    },
    {
      title: 'Areas',
      href: '/admin/areas',
      description: 'Next content block to build',
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <p
          style={{
            margin: 0,
            color: '#95A0B8',
            fontSize: 13,
          }}
        >
          Planetlocksmiths / Admin
        </p>

        <h1
          style={{
            margin: '8px 0 0',
            fontSize: 36,
            lineHeight: 1.1,
          }}
        >
          Technical Dashboard
        </h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <AdminStatCard
          title="Settings"
          value="Live"
          note="Global site settings already come from Supabase."
        />
        <AdminStatCard
          title="Home"
          value="Live"
          note="Homepage content is editable from the admin."
        />
        <AdminStatCard
          title="Reviews / FAQ"
          value="Live"
          note="Localized review and FAQ blocks are already database-driven."
        />
        <AdminStatCard
          title="Services"
          value="Live"
          note="Service pages can now come from Supabase."
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14,
        }}
      >
        {links.map((item) => (
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
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                lineHeight: 1.2,
              }}
            >
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
  )
}
