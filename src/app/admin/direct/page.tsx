'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
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

type RecentOrder = {
  id: string
  name: string
  phone: string
  service_needed: string
  status: string
  created_at: string
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
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboard(mounted: boolean) {
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
          recentOrdersResult,
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

          (supabase.from('orders') as any)
            .select('id, name, phone, service_needed, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        const firstError =
          newOrdersResult.error ||
          activeOrdersResult.error ||
          completedOrdersResult.error ||
          reviewsResult.error ||
          faqResult.error ||
          servicesResult.error ||
          areasResult.error ||
          recentOrdersResult.error

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

        setRecentOrders(
          Array.isArray(recentOrdersResult.data)
            ? recentOrdersResult.data.map((row: any) => ({
                id: row.id ?? '',
                name: row.name ?? '',
                phone: row.phone ?? '',
                service_needed: row.service_needed ?? '',
                status: row.status ?? 'new',
                created_at: row.created_at ?? '',
              }))
            : []
        )
      } catch (error) {
        if (!mounted) return
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load dashboard'
        )
      } finally {
        if (mounted) {
          setIsRefreshing(false)
        }
      }
    }

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

      await loadDashboard(isMounted)
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
      description: 'Localized reviews, search, publish and delete',
    },
    {
      title: 'FAQ',
      href: '/admin/faq',
      description: 'Localized FAQ, search, publish and delete',
    },
    {
      title: 'Services',
      href: '/admin/services',
      description: 'Service pages, SEO, search, publish and delete',
    },
    {
      title: 'Areas',
      href: '/admin/areas',
      description: 'Localized area pages, highlights, publish and delete',
    },
  ]

  return (
    <div style={{ minWidth: 0 }}>
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
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              color: '#95A0B8',
              fontSize: 13,
            }}
          >
            Planetlocksmiths / Admin
          </p>

          <h2
            style={{
              margin: '8px 0 0',
              fontSize: 36,
              lineHeight: 1.1,
              wordBreak: 'break-word',
            }}
          >
            Technical Dashboard
          </h2>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          disabled={isRefreshing}
          style={buttonStyle(isRefreshing)}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {errorMessage ? (
        <div style={messageErrorStyle}>
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
        <AdminStatCard title="New Orders" value={String(metrics.newOrders)} note="Fresh incoming requests waiting for action." />
        <AdminStatCard title="Active Orders" value={String(metrics.activeOrders)} note="Contacted, scheduled, or currently in progress." />
        <AdminStatCard title="Completed Orders" value={String(metrics.completedOrders)} note="Closed requests marked as completed." />
        <AdminStatCard title="Reviews" value={String(metrics.reviews)} note="Published review entries visible on the site." />
        <AdminStatCard title="FAQ" value={String(metrics.faq)} note="Published FAQ items currently live." />
        <AdminStatCard title="Services" value={String(metrics.services)} note="Published service pages available by locale." />
        <AdminStatCard title="Areas" value={String(metrics.areas)} note="Published area landing pages available by locale." />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 14,
          minWidth: 0,
        }}
      >
        <div style={panelStyle}>
          <h3 style={panelTitleStyle}>Quick Access</h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
              marginTop: 14,
            }}
          >
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={quickLinkStyle}
              >
                <strong style={{ display: 'block', fontSize: 18 }}>
                  {item.title}
                </strong>

                <p
                  style={{
                    margin: '8px 0 0',
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

        <div style={panelStyle}>
          <h3 style={panelTitleStyle}>Latest Orders</h3>

          <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
            {recentOrders.map((order) => (
              <a
                key={order.id}
                href="/admin/orders"
                style={quickLinkStyle}
              >
                <strong style={{ display: 'block', fontSize: 16, wordBreak: 'break-word' }}>
                  {order.service_needed || 'Order'}
                </strong>
                <p
                  style={{
                    margin: '6px 0 0',
                    color: '#95A0B8',
                    fontSize: 14,
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                  }}
                >
                  {order.name || 'No name'} · {order.phone || 'No phone'}
                </p>
                <p
                  style={{
                    margin: '6px 0 0',
                    color: '#A9D0FF',
                    fontSize: 13,
                    lineHeight: 1.5,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                  }}
                >
                  {order.status}
                </p>
              </a>
            ))}

            {!recentOrders.length ? (
              <div
                style={{
                  color: '#95A0B8',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                No recent orders yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function buttonStyle(disabled: boolean): CSSProperties {
  return {
    minHeight: 42,
    padding: '0 14px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.10)',
    background: '#11192E',
    color: '#F5F7FB',
    fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.7 : 1,
  }
}

const panelStyle: CSSProperties = {
  background: '#0B1020',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18,
  padding: 18,
  minWidth: 0,
}

const panelTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.2,
  color: '#F5F7FB',
}

const quickLinkStyle: CSSProperties = {
  display: 'block',
  textDecoration: 'none',
  color: '#F5F7FB',
  background: '#11192E',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: 16,
  minWidth: 0,
}

const messageErrorStyle: CSSProperties = {
  borderRadius: 12,
  border: '1px solid rgba(255,122,122,0.25)',
  background: 'rgba(255,122,122,0.08)',
  color: '#FF9A9A',
  padding: '12px 14px',
  fontSize: 14,
  lineHeight: 1.5,
  marginBottom: 16,
}
