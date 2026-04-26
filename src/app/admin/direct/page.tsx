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

type QualityItem = {
  title: string
  status: 'good' | 'warn' | 'danger'
  href: string
  note: string
}

const CONTENT_BLOCKS_HREF = '/admin/content-blocks'
const initialMetrics: Metrics = { newOrders: 0, activeOrders: 0, completedOrders: 0, reviews: 0, faq: 0, services: 0, areas: 0 }

export default function AdminDashboardPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [isChecking, setIsChecking] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true
    async function loadDashboard() {
      try {
        setErrorMessage('')
        setIsRefreshing(true)
        const [newOrders, activeOrders, completedOrders, reviews, faq, services, areas, recent] = await Promise.all([
          (supabase.from('orders') as any).select('*', { count: 'exact', head: true }).eq('status', 'new'),
          (supabase.from('orders') as any).select('*', { count: 'exact', head: true }).in('status', ['contacted', 'scheduled', 'in_progress']),
          (supabase.from('orders') as any).select('*', { count: 'exact', head: true }).eq('status', 'completed'),
          (supabase.from('reviews') as any).select('*', { count: 'exact', head: true }).eq('is_published', true),
          (supabase.from('faq_items') as any).select('*', { count: 'exact', head: true }).eq('is_published', true),
          (supabase.from('services') as any).select('*', { count: 'exact', head: true }).eq('is_published', true),
          (supabase.from('areas') as any).select('*', { count: 'exact', head: true }).eq('is_published', true),
          (supabase.from('orders') as any).select('id, name, phone, service_needed, status, created_at').order('created_at', { ascending: false }).limit(5),
        ])
        const firstError = newOrders.error || activeOrders.error || completedOrders.error || reviews.error || faq.error || services.error || areas.error || recent.error
        if (firstError) throw new Error(firstError.message)
        if (!mounted) return
        setMetrics({ newOrders: newOrders.count ?? 0, activeOrders: activeOrders.count ?? 0, completedOrders: completedOrders.count ?? 0, reviews: reviews.count ?? 0, faq: faq.count ?? 0, services: services.count ?? 0, areas: areas.count ?? 0 })
        setRecentOrders(Array.isArray(recent.data) ? recent.data.map((row: any) => ({ id: row.id ?? '', name: row.name ?? '', phone: row.phone ?? '', service_needed: row.service_needed ?? '', status: row.status ?? 'new', created_at: row.created_at ?? '' })) : [])
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load dashboard')
      } finally {
        if (mounted) setIsRefreshing(false)
      }
    }
    async function boot() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/admin/login'); return }
      if (mounted) setIsChecking(false)
      await loadDashboard()
    }
    boot()
    return () => { mounted = false }
  }, [router, supabase])

  const qualityItems = getQualityItems(metrics)
  if (isChecking) return <div style={loadingShellStyle}><div style={panelStyle}><p style={eyebrowStyle}>Planetlocksmiths cockpit</p><h1 style={titleStyle}>Loading admin...</h1></div></div>

  return (
    <div style={pageStyle}>
      <div style={ambientBlueStyle} /><div style={ambientGoldStyle} />
      <section style={heroPanelStyle}><div><p style={eyebrowStyle}>Planetlocksmiths / Workers control room</p><h1 style={heroTitleStyle}>Operations + Quality Dashboard</h1><p style={heroTextStyle}>Manage Supabase content, emergency leads, local landing pages, Ads-readiness, reviews, FAQ, content blocks, and service coverage from one command center.</p></div><div style={heroActionsStyle}><a href="/admin/audit" style={ghostButtonStyle}>Audit center</a><a href={CONTENT_BLOCKS_HREF} style={ghostButtonStyle}>Content blocks</a><a href="/en" style={ghostButtonStyle}>View site</a><button type="button" onClick={() => window.location.reload()} disabled={isRefreshing} style={primaryButtonStyle(isRefreshing)}>{isRefreshing ? 'Refreshing...' : 'Refresh signal'}</button></div></section>
      {errorMessage ? <div style={messageErrorStyle}>{errorMessage}</div> : null}
      <div style={statsGridStyle}><AdminStatCard title="New Orders" value={String(metrics.newOrders)} note="Fresh requests waiting for action." /><AdminStatCard title="Active Orders" value={String(metrics.activeOrders)} note="Contacted, scheduled, or in progress." /><AdminStatCard title="Completed" value={String(metrics.completedOrders)} note="Closed requests marked completed." /><AdminStatCard title="Services" value={String(metrics.services)} note="Published service landing pages." /><AdminStatCard title="Areas" value={String(metrics.areas)} note="Published local coverage pages." /><AdminStatCard title="FAQ" value={String(metrics.faq)} note="Published customer answers." /><AdminStatCard title="Reviews" value={String(metrics.reviews)} note="Published proof cards." /></div>
      <section style={panelStyle}><div style={panelHeadingRowStyle}><div><p style={panelEyebrowStyle}>Quality control</p><h2 style={panelTitleStyle}>Ads / SEO / UX Readiness</h2></div><span style={statusPillStyle}>{qualityItems.filter((item) => item.status === 'good').length}/{qualityItems.length} ready</span></div><div style={qualityGridStyle}>{qualityItems.map((item) => <QualityCard key={item.title} item={item} />)}</div></section>
      <div style={twoColumnStyle}><section style={panelStyle}><div style={panelHeadingRowStyle}><div><p style={panelEyebrowStyle}>Admin modules</p><h2 style={panelTitleStyle}>Quick Access</h2></div><span style={statusPillStyle}>Online</span></div><div style={quickGridStyle}>{links.map((item) => <a key={item.href} href={item.href} style={quickLinkStyle(item.accent)}><span style={quickOrbStyle(item.accent)} /><strong style={{ display: 'block', fontSize: 18 }}>{item.title}</strong><p style={quickDescriptionStyle}>{item.description}</p><span style={quickCtaStyle}>Open module →</span></a>)}</div></section><section style={panelStyle}><div style={panelHeadingRowStyle}><div><p style={panelEyebrowStyle}>Dispatch feed</p><h2 style={panelTitleStyle}>Latest Orders</h2></div><a href="/admin/orders" style={smallTextLinkStyle}>All orders →</a></div><div style={{ display: 'grid', gap: 10, marginTop: 16 }}>{recentOrders.map((order) => <a key={order.id} href="/admin/orders" style={orderCardStyle}><strong style={{ display: 'block', fontSize: 16, wordBreak: 'break-word' }}>{order.service_needed || 'Order'}</strong><p style={mutedLineStyle}>{order.name || 'No name'} · {order.phone || 'No phone'}</p><p style={statusTextStyle}>{order.status}</p></a>)}{!recentOrders.length ? <div style={emptyStateStyle}>No recent orders yet. New requests will appear here after the contact form starts receiving leads.</div> : null}</div></section></div>
    </div>
  )
}

const links = [
  { title: 'Audit', href: '/admin/audit', description: 'Detailed quality audit for editable content and landing pages.', accent: '#FF9A9A' },
  { title: 'Content Blocks', href: CONTENT_BLOCKS_HREF, description: 'Modular editor with shared presets, previews, reusable blocks, CTA copy, and section items.', accent: '#2DE2E6' },
  { title: 'Orders', href: '/admin/orders', description: 'Incoming leads, statuses, notes, field workflow.', accent: '#4DA2FF' },
  { title: 'Settings', href: '/admin/settings', description: 'Brand, phone, email, service hours, emergency routing.', accent: '#D6A85F' },
  { title: 'Home', href: '/admin/home', description: 'Hero, CTA copy, conversion rails, contact block.', accent: '#2DE2E6' },
  { title: 'Services', href: '/admin/services', description: 'Service landing pages, SEO fields, live publishing.', accent: '#2DE2E6' },
  { title: 'Areas', href: '/admin/areas', description: 'Local pages, coverage notes, supported services.', accent: '#D6A85F' },
  { title: 'FAQ', href: '/admin/faq', description: 'Customer answers for emergency and service questions.', accent: '#4DA2FF' },
  { title: 'Reviews', href: '/admin/reviews', description: 'Localized proof cards and rating signals.', accent: '#D6A85F' },
]

function getQualityItems(metrics: Metrics): QualityItem[] {
  return [
    { title: 'Content blocks', href: CONTENT_BLOCKS_HREF, status: 'warn', note: 'Use the modular editor for shared presets, previews, and reusable page modules.' },
    { title: 'Content audit', href: '/admin/audit', status: 'warn', note: 'Open detailed audit for SEO, intro length, slugs, highlights, and supported services.' },
    { title: 'Service pages', href: '/admin/services', status: metrics.services >= 6 ? 'good' : metrics.services >= 3 ? 'warn' : 'danger', note: metrics.services >= 6 ? 'Strong service coverage.' : 'Add more published service landing pages.' },
    { title: 'Area pages', href: '/admin/areas', status: metrics.areas >= 6 ? 'good' : metrics.areas >= 3 ? 'warn' : 'danger', note: metrics.areas >= 6 ? 'Good local coverage depth.' : 'Add more local service-area pages.' },
    { title: 'FAQ depth', href: '/admin/faq', status: metrics.faq >= 8 ? 'good' : metrics.faq >= 4 ? 'warn' : 'danger', note: metrics.faq >= 8 ? 'Good answer base for Ads trust.' : 'Add FAQ about pricing, authorization, keys, timing, and service limits.' },
    { title: 'Reviews proof', href: '/admin/reviews', status: metrics.reviews >= 6 ? 'good' : metrics.reviews >= 3 ? 'warn' : 'danger', note: metrics.reviews >= 6 ? 'Strong public proof layer.' : 'Add more published customer reviews.' },
    { title: 'Lead flow', href: '/admin/orders', status: metrics.newOrders + metrics.activeOrders > 0 ? 'good' : 'warn', note: metrics.newOrders + metrics.activeOrders > 0 ? 'Requests are entering the system.' : 'No active/new requests visible yet.' },
  ]
}

function QualityCard({ item }: { item: QualityItem }) { const color = item.status === 'good' ? '#2DE2E6' : item.status === 'warn' ? '#D6A85F' : '#FF9A9A'; return <a href={item.href} style={{ ...infoWindowStyle, textDecoration: 'none', color: '#F5F7FB', borderColor: `${color}55` }}><span style={{ display: 'inline-flex', marginBottom: 10, color, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.8 }}>{item.status}</span><strong style={{ display: 'block', fontSize: 18 }}>{item.title}</strong><p style={quickDescriptionStyle}>{item.note}</p><span style={{ ...quickCtaStyle, color }}>Fix / review →</span></a> }

const pageStyle: CSSProperties = { position: 'relative', minWidth: 0, overflow: 'hidden', paddingBottom: 24 }
const ambientBlueStyle: CSSProperties = { position: 'fixed', right: -180, top: -120, width: 460, height: 460, borderRadius: 999, background: 'rgba(77,162,255,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }
const ambientGoldStyle: CSSProperties = { position: 'fixed', left: -180, bottom: -160, width: 420, height: 420, borderRadius: 999, background: 'rgba(214,168,95,0.09)', filter: 'blur(80px)', pointerEvents: 'none' }
const loadingShellStyle: CSSProperties = { minHeight: '60vh', display: 'grid', placeItems: 'center' }
const heroPanelStyle: CSSProperties = { position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'end', border: '1px solid rgba(77,162,255,0.22)', borderRadius: 30, padding: 24, marginBottom: 18, background: 'radial-gradient(circle at 12% 0%, rgba(77,162,255,0.20), transparent 320px), linear-gradient(145deg, rgba(17,25,46,0.78), rgba(3,5,11,0.86))', boxShadow: '0 32px 110px rgba(0,0,0,0.36)', backdropFilter: 'blur(20px)' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }
const titleStyle: CSSProperties = { color: '#F5F7FB', margin: '10px 0 0', fontSize: 34 }
const heroTitleStyle: CSSProperties = { margin: '12px 0 0', color: '#F5F7FB', fontSize: 'clamp(34px, 6vw, 64px)', lineHeight: 0.95, letterSpacing: -2.8 }
const heroTextStyle: CSSProperties = { maxWidth: 760, margin: '18px 0 0', color: '#95A0B8', fontSize: 15, lineHeight: 1.8 }
const heroActionsStyle: CSSProperties = { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
function primaryButtonStyle(disabled: boolean): CSSProperties { return { minHeight: 46, padding: '0 18px', borderRadius: 999, border: '1px solid rgba(77,162,255,0.32)', background: '#4DA2FF', color: '#02040A', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.8, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.7 : 1, boxShadow: '0 0 34px rgba(77,162,255,0.26)' } }
const ghostButtonStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.035)', color: '#F5F7FB', textDecoration: 'none', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.6 }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 18 }
const twoColumnStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, minWidth: 0, marginTop: 14 }
const panelStyle: CSSProperties = { position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, rgba(11,16,32,0.78), rgba(5,7,11,0.82))', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 26, padding: 18, minWidth: 0, boxShadow: '0 28px 90px rgba(0,0,0,0.26)', backdropFilter: 'blur(18px)' }
const panelHeadingRowStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }
const panelEyebrowStyle: CSSProperties = { margin: 0, color: '#A9D0FF', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const panelTitleStyle: CSSProperties = { margin: '8px 0 0', fontSize: 24, lineHeight: 1.1, color: '#F5F7FB', letterSpacing: -0.7 }
const statusPillStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', minHeight: 30, borderRadius: 999, border: '1px solid rgba(45,226,230,0.22)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6', padding: '0 11px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.6 }
const quickGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 16 }
const qualityGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginTop: 16 }
function quickLinkStyle(accent: string): CSSProperties { return { position: 'relative', overflow: 'hidden', display: 'block', textDecoration: 'none', color: '#F5F7FB', background: 'rgba(17,25,46,0.62)', border: `1px solid ${accent}44`, borderRadius: 20, padding: 16, minWidth: 0, boxShadow: `0 0 34px ${accent}12` } }
function quickOrbStyle(accent: string): CSSProperties { return { position: 'absolute', right: -28, top: -28, width: 88, height: 88, borderRadius: 999, border: `1px solid ${accent}55`, background: `${accent}10` } }
const quickDescriptionStyle: CSSProperties = { margin: '8px 0 0', color: '#95A0B8', fontSize: 13, lineHeight: 1.6 }
const quickCtaStyle: CSSProperties = { display: 'inline-flex', marginTop: 14, color: '#A9D0FF', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.7 }
const orderCardStyle: CSSProperties = { display: 'block', textDecoration: 'none', color: '#F5F7FB', background: 'rgba(17,25,46,0.62)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 18, padding: 14, minWidth: 0 }
const mutedLineStyle: CSSProperties = { margin: '6px 0 0', color: '#95A0B8', fontSize: 13, lineHeight: 1.5, wordBreak: 'break-word' }
const statusTextStyle: CSSProperties = { margin: '8px 0 0', color: '#A9D0FF', fontSize: 11, lineHeight: 1.5, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 900 }
const emptyStateStyle: CSSProperties = { color: '#95A0B8', fontSize: 14, lineHeight: 1.7, border: '1px dashed rgba(255,255,255,0.14)', borderRadius: 18, padding: 16 }
const infoWindowStyle: CSSProperties = { border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, background: 'rgba(255,255,255,0.035)', padding: 16 }
const smallTextLinkStyle: CSSProperties = { color: '#A9D0FF', textDecoration: 'none', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4 }
const messageErrorStyle: CSSProperties = { borderRadius: 18, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: '14px 16px', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }
