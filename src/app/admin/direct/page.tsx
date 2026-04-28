'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStatCard from '@/components/admin/AdminStatCard'

type Metrics = { newOrders: number; activeOrders: number; completedOrders: number; reviews: number; faq: number; services: number; areas: number }
type RecentOrder = { id: string; name: string; phone: string; service_needed: string; status: string; created_at: string }
type QualityItem = { title: string; status: 'good' | 'warn' | 'danger'; href: string; note: string }

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

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
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить рабочую панель')
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
  if (isChecking) return <div style={loadingShellStyle}><div style={panelStyle}><p style={eyebrowStyle}>Панель управления</p><h1 style={titleStyle}>Загрузка...</h1></div></div>

  const sidebar = (
    <aside style={sidebarStyle(collapsed)}>
      <div style={brandBlockStyle}>
        <p style={brandEyebrowStyle}>{collapsed ? 'PL' : 'Planet Locksmiths'}</p>
        {!collapsed && <strong style={brandTitleStyle}>Панель сайта</strong>}
      </div>
      <button type="button" onClick={() => setCollapsed(!collapsed)} style={collapseButtonStyle}>{collapsed ? '→' : '← Свернуть'}</button>
      <nav style={sidebarNavStyle}>
        {links.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} title={item.title} style={sidebarLinkStyle(item.accent, item.href === '/admin/photos', collapsed)}>
            <span style={sidebarDotStyle(item.accent)} />
            {!collapsed && <span>{item.title}</span>}
          </a>
        ))}
      </nav>
      <div style={sidebarFooterStyle}>
        <a href="/en" style={sidebarGhostStyle}>{collapsed ? '↗' : 'Открыть сайт'}</a>
        <button type="button" onClick={() => window.location.reload()} disabled={isRefreshing} style={sidebarButtonStyle}>{collapsed ? '↻' : isRefreshing ? 'Обновление...' : 'Обновить'}</button>
      </div>
    </aside>
  )

  return (
    <div style={appShellStyle(collapsed)}>
      <div style={mobileBarStyle}>
        <button type="button" onClick={() => setSidebarOpen(true)} style={mobileMenuButtonStyle}>☰ Меню</button>
        <a href="/admin/photos" style={mobilePhotoButtonStyle}>📸 Фото</a>
      </div>
      <div style={desktopSidebarWrapStyle}>{sidebar}</div>
      {sidebarOpen && <button aria-label="Закрыть меню" type="button" onClick={() => setSidebarOpen(false)} style={mobileOverlayStyle} />}
      {sidebarOpen && <div style={mobileDrawerStyle}>{sidebar}</div>}
      <main style={mainContentStyle}>
        <div style={ambientBlueStyle} /><div style={ambientGoldStyle} />
        <section style={heroPanelStyle}>
          <div><p style={eyebrowStyle}>Planet Locksmiths / рабочая панель сайта</p><h1 style={heroTitleStyle}>Панель управления сайтом</h1><p style={heroTextStyle}>Быстрый доступ к заявкам, настройкам, контенту и загрузке фотографий. Версия: RU-PHOTOS-CMS-v5.</p></div>
          <div style={heroActionsStyle}><a href="/admin/photos" style={photoButtonStyle}>📸 Фото</a><a href="/admin" style={ghostButtonStyle}>Главная панель</a><a href="/en" style={ghostButtonStyle}>Открыть сайт</a><button type="button" onClick={() => window.location.reload()} disabled={isRefreshing} style={primaryButtonStyle(isRefreshing)}>{isRefreshing ? 'Обновление...' : 'Обновить'}</button></div>
        </section>
        <section style={photoAccessPanelStyle}><div><p style={eyebrowStyle}>Фото CMS</p><h2 style={panelTitleStyle}>Фотографии, галерея и кейсы до/после</h2><p style={heroTextStyle}>Здесь можно загрузить фото работ, создать кейс до/после, изменить название, описание и категорию изображения.</p></div><a href="/admin/photos" style={largePhotoLinkStyle}>Перейти к фото →</a></section>
        {errorMessage ? <div style={messageErrorStyle}>{errorMessage}</div> : null}
        <div style={statsGridStyle}><AdminStatCard title="Новые заявки" value={String(metrics.newOrders)} note="Свежие запросы." /><AdminStatCard title="Активные" value={String(metrics.activeOrders)} note="В работе." /><AdminStatCard title="Завершено" value={String(metrics.completedOrders)} note="Закрытые заявки." /><AdminStatCard title="Услуги" value={String(metrics.services)} note="Страницы услуг." /><AdminStatCard title="Локации" value={String(metrics.areas)} note="Городские страницы." /><AdminStatCard title="FAQ" value={String(metrics.faq)} note="Ответы клиентам." /><AdminStatCard title="Отзывы" value={String(metrics.reviews)} note="Доказательства доверия." /></div>
        <section style={panelStyle}><div style={panelHeadingRowStyle}><div><p style={panelEyebrowStyle}>Контроль качества</p><h2 style={panelTitleStyle}>SEO / UX / рекламная готовность</h2></div><span style={statusPillStyle}>{qualityItems.filter((item) => item.status === 'good').length}/{qualityItems.length} готово</span></div><div style={qualityGridStyle}>{qualityItems.map((item) => <QualityCard key={item.title} item={item} />)}</div></section>
        <div style={twoColumnStyle}><section style={panelStyle}><div style={panelHeadingRowStyle}><div><p style={panelEyebrowStyle}>Разделы сайта</p><h2 style={panelTitleStyle}>Быстрый доступ</h2></div><span style={statusPillStyle}>Online</span></div><div style={quickGridStyle}>{links.map((item) => <a key={item.href} href={item.href} style={quickLinkStyle(item.accent)}><span style={quickOrbStyle(item.accent)} /><strong style={{ display: 'block', fontSize: 18 }}>{item.title}</strong><p style={quickDescriptionStyle}>{item.description}</p><span style={quickCtaStyle}>Открыть →</span></a>)}</div></section><section style={panelStyle}><div style={panelHeadingRowStyle}><div><p style={panelEyebrowStyle}>Заявки</p><h2 style={panelTitleStyle}>Последние заявки</h2></div><a href="/admin/orders" style={smallTextLinkStyle}>Все заявки →</a></div><div style={{ display: 'grid', gap: 10, marginTop: 16 }}>{recentOrders.map((order) => <a key={order.id} href="/admin/orders" style={orderCardStyle}><strong style={{ display: 'block', fontSize: 16, wordBreak: 'break-word' }}>{order.service_needed || 'Заявка'}</strong><p style={mutedLineStyle}>{order.name || 'Без имени'} · {order.phone || 'Без телефона'}</p><p style={statusTextStyle}>{order.status}</p></a>)}{!recentOrders.length ? <div style={emptyStateStyle}>Пока нет заявок.</div> : null}</div></section></div>
      </main>
    </div>
  )
}

const links = [
  { title: 'Фото', href: '/admin/photos', description: 'Загрузка фото, галерея, кейсы до/после, редактирование данных.', accent: '#2DE2E6' },
  { title: 'Аудит', href: '/admin/audit', description: 'Проверка качества контента и страниц.', accent: '#FF9A9A' },
  { title: 'Контент', href: CONTENT_BLOCKS_HREF, description: 'Редактор секций, CTA и блоков.', accent: '#2DE2E6' },
  { title: 'Заказы', href: '/admin/orders', description: 'Заявки, статусы, заметки.', accent: '#4DA2FF' },
  { title: 'Настройки', href: '/admin/settings', description: 'Бренд, телефон, email, часы работы.', accent: '#D6A85F' },
  { title: 'Главная', href: '/admin/home', description: 'Hero, CTA, конверсионные блоки.', accent: '#2DE2E6' },
  { title: 'Услуги', href: '/admin/services', description: 'Страницы услуг и SEO.', accent: '#2DE2E6' },
  { title: 'Города', href: '/admin/areas', description: 'Локальные страницы.', accent: '#D6A85F' },
  { title: 'FAQ', href: '/admin/faq', description: 'Ответы клиентам.', accent: '#4DA2FF' },
  { title: 'Отзывы', href: '/admin/reviews', description: 'Отзывы и proof-карточки.', accent: '#D6A85F' },
]

function getQualityItems(metrics: Metrics): QualityItem[] { return [ { title: 'Фото CMS', href: '/admin/photos', status: 'good', note: 'Загрузка фото и кейсов до/после подключена.' }, { title: 'Контент-блоки', href: CONTENT_BLOCKS_HREF, status: 'warn', note: 'Редактор модульных секций.' }, { title: 'Аудит контента', href: '/admin/audit', status: 'warn', note: 'Проверка SEO, текстов и страниц.' }, { title: 'Страницы услуг', href: '/admin/services', status: metrics.services >= 6 ? 'good' : metrics.services >= 3 ? 'warn' : 'danger', note: metrics.services >= 6 ? 'Покрытие услуг хорошее.' : 'Добавить больше страниц услуг.' }, { title: 'Города', href: '/admin/areas', status: metrics.areas >= 6 ? 'good' : metrics.areas >= 3 ? 'warn' : 'danger', note: metrics.areas >= 6 ? 'Локальное покрытие хорошее.' : 'Добавить больше городских страниц.' }, { title: 'FAQ', href: '/admin/faq', status: metrics.faq >= 8 ? 'good' : metrics.faq >= 4 ? 'warn' : 'danger', note: metrics.faq >= 8 ? 'FAQ база сильная.' : 'Добавить вопросы про цену, ключи, сроки.' }, { title: 'Отзывы', href: '/admin/reviews', status: metrics.reviews >= 6 ? 'good' : metrics.reviews >= 3 ? 'warn' : 'danger', note: metrics.reviews >= 6 ? 'Доверие сильное.' : 'Добавить больше отзывов.' } ] }
function QualityCard({ item }: { item: QualityItem }) { const color = item.status === 'good' ? '#2DE2E6' : item.status === 'warn' ? '#D6A85F' : '#FF9A9A'; return <a href={item.href} style={{ ...infoWindowStyle, textDecoration: 'none', color: '#F5F7FB', borderColor: `${color}55` }}><span style={{ display: 'inline-flex', marginBottom: 10, color, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.8 }}>{item.status}</span><strong style={{ display: 'block', fontSize: 18 }}>{item.title}</strong><p style={quickDescriptionStyle}>{item.note}</p><span style={{ ...quickCtaStyle, color }}>Открыть →</span></a> }

function appShellStyle(collapsed: boolean): CSSProperties { return { minHeight: '100vh', display: 'grid', gridTemplateColumns: collapsed ? '92px minmax(0, 1fr)' : '280px minmax(0, 1fr)', background: '#02040A', color: '#F5F7FB' } }
const desktopSidebarWrapStyle: CSSProperties = { display: 'block' }
function sidebarStyle(collapsed: boolean): CSSProperties { return { position: 'sticky', top: 0, alignSelf: 'start', height: '100vh', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(180deg, rgba(8,13,26,0.98), rgba(2,4,10,0.98))', padding: collapsed ? 12 : 18, boxShadow: '18px 0 80px rgba(0,0,0,0.28)', zIndex: 5 } }
const brandBlockStyle: CSSProperties = { border: '1px solid rgba(45,226,230,0.22)', borderRadius: 22, background: 'rgba(45,226,230,0.07)', padding: 16, marginBottom: 12 }
const brandEyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const brandTitleStyle: CSSProperties = { display: 'block', marginTop: 8, color: '#F5F7FB', fontSize: 22, lineHeight: 1.05 }
const collapseButtonStyle: CSSProperties = { width: '100%', minHeight: 38, marginBottom: 14, borderRadius: 999, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.035)', color: '#DDE6F7', fontSize: 12, fontWeight: 900 }
const sidebarNavStyle: CSSProperties = { display: 'grid', gap: 8 }
function sidebarLinkStyle(accent: string, active: boolean, collapsed: boolean): CSSProperties { return { display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, minHeight: 44, padding: collapsed ? '0' : '0 12px', borderRadius: 14, border: `1px solid ${active ? accent : 'rgba(255,255,255,0.08)'}`, background: active ? `${accent}18` : 'rgba(255,255,255,0.025)', color: active ? accent : '#DDE6F7', textDecoration: 'none', fontSize: 14, fontWeight: 900, boxShadow: active ? `0 0 28px ${accent}18` : 'none' } }
function sidebarDotStyle(accent: string): CSSProperties { return { width: 8, height: 8, borderRadius: 99, background: accent, boxShadow: `0 0 16px ${accent}` } }
const sidebarFooterStyle: CSSProperties = { display: 'grid', gap: 8, marginTop: 18, borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: 14 }
const sidebarGhostStyle: CSSProperties = { minHeight: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', color: '#F5F7FB', textDecoration: 'none', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }
const sidebarButtonStyle: CSSProperties = { minHeight: 40, borderRadius: 999, border: '1px solid rgba(77,162,255,0.32)', background: '#4DA2FF', color: '#02040A', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }
const mobileBarStyle: CSSProperties = { display: 'none', position: 'sticky', top: 0, zIndex: 40, padding: 12, borderBottom: '1px solid rgba(255,255,255,0.10)', background: 'rgba(2,4,10,0.92)', backdropFilter: 'blur(18px)' }
const mobileMenuButtonStyle: CSSProperties = { minHeight: 42, borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', color: '#F5F7FB', padding: '0 14px', fontWeight: 900 }
const mobilePhotoButtonStyle: CSSProperties = { minHeight: 42, display: 'inline-flex', alignItems: 'center', marginLeft: 8, borderRadius: 999, border: '1px solid rgba(45,226,230,0.4)', background: 'rgba(45,226,230,0.12)', color: '#2DE2E6', padding: '0 14px', fontWeight: 900, textDecoration: 'none' }
const mobileOverlayStyle: CSSProperties = { position: 'fixed', inset: 0, zIndex: 60, border: 0, background: 'rgba(0,0,0,0.62)' }
const mobileDrawerStyle: CSSProperties = { position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 70, width: 300, maxWidth: '88vw' }
const mainContentStyle: CSSProperties = { position: 'relative', minWidth: 0, overflow: 'hidden', padding: 24 }
const ambientBlueStyle: CSSProperties = { position: 'fixed', right: -180, top: -120, width: 460, height: 460, borderRadius: 999, background: 'rgba(77,162,255,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }
const ambientGoldStyle: CSSProperties = { position: 'fixed', left: -180, bottom: -160, width: 420, height: 420, borderRadius: 999, background: 'rgba(214,168,95,0.09)', filter: 'blur(80px)', pointerEvents: 'none' }
const loadingShellStyle: CSSProperties = { minHeight: '60vh', display: 'grid', placeItems: 'center' }
const heroPanelStyle: CSSProperties = { position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'end', border: '1px solid rgba(77,162,255,0.22)', borderRadius: 30, padding: 24, marginBottom: 18, background: 'radial-gradient(circle at 12% 0%, rgba(77,162,255,0.20), transparent 320px), linear-gradient(145deg, rgba(17,25,46,0.78), rgba(3,5,11,0.86))', boxShadow: '0 32px 110px rgba(0,0,0,0.36)', backdropFilter: 'blur(20px)' }
const photoAccessPanelStyle: CSSProperties = { ...heroPanelStyle, border: '1px solid rgba(45,226,230,0.34)', background: 'radial-gradient(circle at 10% 0%, rgba(45,226,230,0.20), transparent 340px), linear-gradient(145deg, rgba(7,25,32,0.82), rgba(3,5,11,0.88))' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }
const titleStyle: CSSProperties = { color: '#F5F7FB', margin: '10px 0 0', fontSize: 34 }
const heroTitleStyle: CSSProperties = { margin: '12px 0 0', color: '#F5F7FB', fontSize: 'clamp(34px, 6vw, 64px)', lineHeight: 0.95, letterSpacing: -2.8 }
const heroTextStyle: CSSProperties = { maxWidth: 760, margin: '18px 0 0', color: '#95A0B8', fontSize: 15, lineHeight: 1.8 }
const heroActionsStyle: CSSProperties = { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
function primaryButtonStyle(disabled: boolean): CSSProperties { return { minHeight: 46, padding: '0 18px', borderRadius: 999, border: '1px solid rgba(77,162,255,0.32)', background: '#4DA2FF', color: '#02040A', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.8, opacity: disabled ? 0.7 : 1 } }
const ghostButtonStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.035)', color: '#F5F7FB', textDecoration: 'none', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.6 }
const photoButtonStyle: CSSProperties = { ...ghostButtonStyle, border: '1px solid rgba(45,226,230,0.5)', background: 'rgba(45,226,230,0.15)', color: '#2DE2E6' }
const largePhotoLinkStyle: CSSProperties = { minHeight: 58, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 22px', borderRadius: 999, border: '1px solid rgba(45,226,230,0.5)', background: '#2DE2E6', color: '#02040A', textDecoration: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.6 }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 18 }
const twoColumnStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, minWidth: 0, marginTop: 14 }
const panelStyle: CSSProperties = { position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, rgba(11,16,32,0.78), rgba(5,7,11,0.82))', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 26, padding: 18, minWidth: 0, boxShadow: '0 28px 90px rgba(0,0,0,0.26)', backdropFilter: 'blur(18px)' }
const panelHeadingRowStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }
const panelEyebrowStyle: CSSProperties = { margin: 0, color: '#A9D0FF', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const panelTitleStyle: CSSProperties = { margin: '8px 0 0', fontSize: 24, lineHeight: 1.1, color: '#F5F7FB', letterSpacing: -0.7 }
const statusPillStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', minHeight: 30, borderRadius: 999, border: '1px solid rgba(45,226,230,0.22)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6', padding: '0 11px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.6 }
const quickGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 16 }
const qualityGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginTop: 16 }
function quickLinkStyle(accent: string): CSSProperties { return { position: 'relative', overflow: 'hidden', display: 'block', textDecoration: 'none', color: '#F5F7FB', background: 'rgba(17,25,46,0.62)', border: `1px solid ${accent}44`, borderRadius: 20, padding: 16, minWidth: 0 } }
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
