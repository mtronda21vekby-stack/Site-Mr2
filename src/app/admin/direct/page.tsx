'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStatCard from '@/components/admin/AdminStatCard'

type Metrics = {
  newOrders: number
  activeOrders: number
  completedOrders: number
  reviews: number
  faq: number
  services: number
  areas: number
}

const initialMetrics: Metrics = {
  newOrders: 0,
  activeOrders: 0,
  completedOrders: 0,
  reviews: 0,
  faq: 0,
  services: 0,
  areas: 0,
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])

  const [isChecking, setIsChecking] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function boot() {
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

      await loadMetrics(isMounted)
    }

    async function loadMetrics(mounted: boolean) {
      try {
        setErrorMessage('')
        setIsRefreshing(true)

        const [
          newOrdersResult,
          activeOrdersResult,
          completedOrdersResult,
          reviewsResult,
          faqResult,
          servicesResult,
          areasResult,
        ] = await Promise.all([
          (supabase.from('orders') as any)
            .select('*', { count: 'exact', head: true })
            .eq('status', 'new'),

          (supabase.from('orders') as any)
            .select('*', { count: 'exact', head: true })
            .in('status', ['contacted', 'scheduled', 'in_progress']),

          (supabase.from('orders') as any)
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed'),

          (supabase.from('reviews') as any)
            .select('*', { count: 'exact', head: true })
            .eq('is_published', true),

          (supabase.from('faq_items') as any)
            .select('*', { count: 'exact', head: true })
            .eq('is_published', true),

          (supabase.from('services') as any)
            .select('*', { count: 'exact', head: true })
            .eq('is_published', true),

          (supabase.from('areas') as any)
            .select('*', { count: 'exact', head: true })
            .eq('is_published', true),
        ])

        const firstError =
          newOrdersResult.error ||
          activeOrdersResult.error ||
          completedOrdersResult.error ||
          reviewsResult.error ||
          faqResult.error ||
          servicesResult.error ||
          areasResult.error

        if (firstError) {
          throw new Error(firstError.message)
        }

        if (!mounted) return

        setMetrics({
          newOrders: newOrdersResult.count ?? 0,
          activeOrders: activeOrdersResult.count ?? 0,
          completedOrders: completedOrdersResult.count ?? 0,
          reviews: reviewsResult.count ?? 0,
          faq: faqResult.count ?? 0,
          services: servicesResult.count ?? 0,
          areas: areasResult.count ?? 0,
        })
      } catch (error) {
        if (!mounted) return
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load dashboard metrics'
        )
      } finally {
        if (mounted) {
          setIsRefreshing(false)
        }
      }
    }

    boot()

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
      title: 'Orders',
      href: '/admin/orders',
      description: 'Incoming leads, filters, statuses, admin notes, delete',
    },
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
      description: 'Localized area pages with highlights and supported services',
    },
  ]

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
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

        <button
          type="button"
          onClick={() => window.location.reload()}
          disabled={isRefreshing}
          style={{
            minHeight: 42,
            padding: '0 14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.10)',
            background: '#11192E',
            color: '#F5F7FB',
            fontWeight: 700,
            cursor: isRefreshing ? 'default' : 'pointer',
            opacity: isRefreshing ? 0.7 : 1,
          }}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

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
            marginBottom: 16,
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <AdminStatCard
          title="New Orders"
          value={String(metrics.newOrders)}
          note="Fresh incoming requests waiting for action."
        />
        <AdminStatCard
          title="Active Orders"
          value={String(metrics.activeOrders)}
          note="Contacted, scheduled, or currently in progress."
        />
        <AdminStatCard
          title="Completed Orders"
          value={String(metrics.completedOrders)}
          note="Closed requests marked as completed."
        />
        <AdminStatCard
          title="Reviews"
          value={String(metrics.reviews)}
          note="Published review entries visible on the site."
        />
        <AdminStatCard
          title="FAQ"
          value={String(metrics.faq)}
          note="Published FAQ items currently live."
        />
        <AdminStatCard
          title="Services"
          value={String(metrics.services)}
          note="Published service pages available by locale."
        />
        <AdminStatCard
          title="Areas"
          value={String(metrics.areas)}
          note="Published area landing pages available by locale."
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
