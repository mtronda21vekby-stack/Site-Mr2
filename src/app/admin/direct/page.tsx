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

type ModuleLink = {
  title: string
  href: string
  description: string
  accent: string
}

type SystemStatus = {
  supabase?: {
    configured?: boolean
  }
  emailNotifications?: {
    enabled?: boolean
    recipientConfigured?: boolean
    senderConfigured?: boolean
    recipientSource?: string
    senderSource?: string
  }
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

const modules: ModuleLink[] = [
  { title: 'Фото', href: '/admin/photos', description: 'Загрузка фотографий, галерея, кейсы до/после, редактирование данных.', accent: '#D6A85F' },
  { title: 'Заявки', href: '/admin/orders', description: 'Новые обращения клиентов, статусы, заметки и история работы.', accent: '#F5F7FB' },
  { title: 'Контент', href: '/admin/content-blocks', description: 'Секции сайта, CTA-блоки, текстовые блоки и карточки.', accent: '#D6A85F' },
  { title: 'Главная', href: '/admin/home', description: 'Первый экран, заголовки, конверсионные блоки и описания.', accent: '#D6A85F' },
  { title: 'Услуги', href: '/admin/services', description: 'Страницы услуг, SEO-поля, публикация и структура.', accent: '#D6A85F' },
  { title: 'Города', href: '/admin/areas', description: 'Локальные страницы покрытия и сервисные зоны.', accent: '#D6A85F' },
  { title: 'Отзывы', href: '/admin/reviews', description: 'Отзывы клиентов и proof-блоки доверия.', accent: '#D6A85F' },
  { title: 'FAQ', href: '/admin/faq', description: 'Ответы на частые вопросы клиентов.', accent: '#F5F7FB' },
  { title: 'Настройки', href: '/admin/settings', description: 'Телефон, бренд, email, часы работы и маршрутизация.', accent: '#D6A85F' },
  { title: 'Аудит', href: '/admin/audit', description: 'Проверка качества контента, SEO и готовности страниц.', accent: '#FF9A9A' },
]

export default function ControlPanelPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [isChecking, setIsChecking] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
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

        setMetrics({
          newOrders: newOrders.count ?? 0,
          activeOrders: activeOrders.count ?? 0,
          completedOrders: completedOrders.count ?? 0,
          reviews: reviews.count ?? 0,
          faq: faq.count ?? 0,
          services: services.count ?? 0,
          areas: areas.count ?? 0,
        })

        setRecentOrders(
          Array.isArray(recent.data)
            ? recent.data.map((row: any) => ({
                id: row.id ?? '',
                name: row.name ?? '',
                phone: row.phone ?? '',
                service_needed: row.service_needed ?? '',
                status: row.status ?? 'new',
                created_at: row.created_at ?? '',
              }))
            : [],
        )
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить данные панели')
      } finally {
        if (mounted) setIsRefreshing(false)
      }
    }

    async function loadSystemStatus(accessToken: string) {
      try {
        const response = await fetch('/api/admin/system-status', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (!response.ok) return
        const data = await response.json()
        if (mounted) setSystemStatus(data)
      } catch {
        if (mounted) setSystemStatus(null)
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

      if (mounted) setIsChecking(false)
      await Promise.all([loadDashboard(), loadSystemStatus(session.access_token)])
    }

    boot()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  if (isChecking) {
    return (
      <div style={panelStyle}>
        <p style={eyebrowStyle}>Панель управления</p>
        <h1 style={loadingTitleStyle}>Загрузка...</h1>
      </div>
    )
  }

  const emailReady = Boolean(systemStatus?.emailNotifications?.enabled)
  const emailSenderReady = Boolean(systemStatus?.emailNotifications?.senderConfigured)
  const emailRecipientReady = Boolean(systemStatus?.emailNotifications?.recipientConfigured)
  const readyItems = [
    metrics.services >= 6,
    metrics.areas >= 6,
    metrics.faq >= 8,
    metrics.reviews >= 6,
    emailReady,
  ].filter(Boolean).length
  const readinessScore = Math.round((readyItems / 5) * 100)
  const liveLoad = metrics.newOrders + metrics.activeOrders

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Planet Locksmiths / рабочая панель сайта</p>
          <h1 style={heroTitleStyle}>Панель управления сайтом</h1>
          <p style={heroTextStyle}>
            Управление заявками, фотографиями, услугами, городами, отзывами, FAQ и основным контентом сайта. Рабочий центр для live production.
          </p>
        </div>

        <div style={heroScoreCardStyle}>
          <div style={scoreHeadStyle}>
            <span style={smallLabelStyle}>Readiness</span>
            <strong style={scoreValueStyle}>{readinessScore}%</strong>
          </div>
          <div style={scoreTrackStyle}>
            <span style={{ ...scoreFillStyle, width: `${readinessScore}%` }} />
          </div>
          <div style={signalGridStyle}>
            <span><b>{liveLoad}</b> active</span>
            <span><b>{metrics.services}</b> services</span>
            <span><b>{metrics.areas}</b> areas</span>
          </div>
        </div>

        <div style={heroActionsStyle}>
          <a href="/admin/photos" style={primaryLinkStyle}>Media</a>
          <a href="/admin/orders" style={secondaryLinkStyle}>Заявки</a>
          <a href="/en" style={secondaryLinkStyle}>Открыть сайт</a>
          <button type="button" onClick={() => window.location.reload()} disabled={isRefreshing} style={refreshButtonStyle(isRefreshing)}>
            {isRefreshing ? 'Обновление...' : 'Обновить'}
          </button>
        </div>
      </section>

      {errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null}

      <section style={statsGridStyle}>
        <AdminStatCard title="Новые заявки" value={String(metrics.newOrders)} note="Свежие запросы клиентов." />
        <AdminStatCard title="Активные" value={String(metrics.activeOrders)} note="В работе или на связи." />
        <AdminStatCard title="Завершено" value={String(metrics.completedOrders)} note="Закрытые обращения." />
        <AdminStatCard title="Услуги" value={String(metrics.services)} note="Опубликованные услуги." />
        <AdminStatCard title="Города" value={String(metrics.areas)} note="Локальные страницы." />
        <AdminStatCard title="FAQ" value={String(metrics.faq)} note="Ответы клиентам." />
        <AdminStatCard title="Отзывы" value={String(metrics.reviews)} note="Карточки доверия." />
      </section>

      <section style={photoPanelStyle}>
        <div>
          <p style={eyebrowStyle}>Фото CMS</p>
          <h2 style={sectionTitleStyle}>Фотографии, галерея и кейсы до/после</h2>
          <p style={sectionTextStyle}>
            Загружайте работы, создавайте пары до/после, редактируйте название, описание и категорию изображения. Эти данные автоматически используются на сайте.
          </p>
        </div>
        <a href="/admin/photos" style={widePrimaryLinkStyle}>Перейти к фото →</a>
      </section>

      <section style={panelStyle}>
        <div style={panelHeaderStyle}>
          <div>
            <p style={smallLabelStyle}>Контроль качества</p>
            <h2 style={sectionTitleStyle}>SEO / UX / рекламная готовность</h2>
          </div>
          <span style={statusPillStyle}>{readyItems}/5 готово</span>
        </div>

        <div style={qualityGridStyle}>
          <QualityCard title="Фото CMS" href="/admin/photos" status="good" note="Загрузка фото и кейсов до/после подключена." />
          <QualityCard title="Страницы услуг" href="/admin/services" status={metrics.services >= 6 ? 'good' : 'warn'} note={metrics.services >= 6 ? 'Покрытие услуг хорошее.' : 'Добавьте больше страниц услуг.'} />
          <QualityCard title="Города" href="/admin/areas" status={metrics.areas >= 6 ? 'good' : 'warn'} note={metrics.areas >= 6 ? 'Локальное покрытие хорошее.' : 'Добавьте больше городских страниц.'} />
          <QualityCard title="FAQ" href="/admin/faq" status={metrics.faq >= 8 ? 'good' : 'warn'} note={metrics.faq >= 8 ? 'FAQ база сильная.' : 'Добавьте вопросы про цену, ключи и сроки.'} />
          <QualityCard title="Отзывы" href="/admin/reviews" status={metrics.reviews >= 6 ? 'good' : 'warn'} note={metrics.reviews >= 6 ? 'Доверие сильное.' : 'Добавьте больше отзывов.'} />
          <QualityCard title="Email заявки" href="/admin/audit" status={emailReady ? 'good' : 'warn'} note={emailReady ? 'Resend уведомления включены.' : 'Заявки сохраняются, но email требует RESEND_API_KEY.'} />
        </div>
      </section>

      <section style={systemPanelStyle}>
        <div>
          <p style={smallLabelStyle}>Launch systems</p>
          <h2 style={sectionTitleStyle}>Почта и production-настройки</h2>
          <p style={sectionTextStyle}>Форма заявок сохраняет обращения в Supabase. Email-уведомления работают только после настройки Resend env в Cloudflare Worker.</p>
        </div>
        <div style={systemGridStyle}>
          <SystemCard title="Resend API" isReady={emailReady} note={emailReady ? 'RESEND_API_KEY найден.' : 'Добавьте RESEND_API_KEY в production secrets.'} />
          <SystemCard title="Получатель" isReady={emailRecipientReady} note={emailRecipientReady ? `Источник: ${systemStatus?.emailNotifications?.recipientSource}` : 'Используется fallback email из настроек сайта.'} />
          <SystemCard title="Отправитель" isReady={emailSenderReady} note={emailSenderReady ? `Источник: ${systemStatus?.emailNotifications?.senderSource}` : 'Нужен CONTACT_FROM_EMAIL с verified domain в Resend.'} />
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={smallLabelStyle}>Разделы сайта</p>
              <h2 style={sectionTitleStyle}>Быстрый доступ</h2>
            </div>
            <span style={statusPillStyle}>Online</span>
          </div>

          <div style={moduleGridStyle}>
            {modules.map((item) => (
              <a key={item.href} href={item.href} style={moduleCardStyle(item.accent)}>
                <span style={moduleAccentStyle(item.accent)} />
                <strong style={moduleTitleStyle}>{item.title}</strong>
                <p style={moduleDescriptionStyle}>{item.description}</p>
                <span style={moduleCtaStyle}>Открыть →</span>
              </a>
            ))}
          </div>
        </div>

        <div style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <p style={smallLabelStyle}>Заявки</p>
              <h2 style={sectionTitleStyle}>Последние обращения</h2>
            </div>
            <a href="/admin/orders" style={textLinkStyle}>Все заявки →</a>
          </div>

          <div style={ordersListStyle}>
            {recentOrders.map((order) => (
              <a key={order.id} href="/admin/orders" style={orderCardStyle}>
                <strong style={orderTitleStyle}>{order.service_needed || 'Заявка'}</strong>
                <p style={mutedLineStyle}>{order.name || 'Без имени'} · {order.phone || 'Без телефона'}</p>
                <p style={statusTextStyle}>{order.status}</p>
              </a>
            ))}

            {!recentOrders.length ? <div style={emptyStateStyle}>Пока нет заявок. Новые обращения появятся здесь после отправки формы на сайте.</div> : null}
          </div>
        </div>
      </section>
    </div>
  )
}

function QualityCard({ title, href, status, note }: { title: string; href: string; status: 'good' | 'warn'; note: string }) {
  const color = status === 'good' ? '#6EE7B7' : '#D6A85F'

  return (
    <a href={href} style={{ ...qualityCardStyle, borderColor: `${color}55` }}>
      <span style={{ ...qualityStatusStyle, color }}>{status === 'good' ? 'Готово' : 'Проверить'}</span>
      <strong style={qualityTitleStyle}>{title}</strong>
      <p style={moduleDescriptionStyle}>{note}</p>
      <span style={{ ...moduleCtaStyle, color }}>Открыть →</span>
    </a>
  )
}

function SystemCard({ title, isReady, note }: { title: string; isReady: boolean; note: string }) {
  const color = isReady ? '#6EE7B7' : '#D6A85F'

  return (
    <article style={{ ...systemCardStyle, borderColor: `${color}55` }}>
      <span style={{ ...qualityStatusStyle, color }}>{isReady ? 'Готово' : 'Настроить'}</span>
      <strong style={moduleTitleStyle}>{title}</strong>
      <p style={moduleDescriptionStyle}>{note}</p>
    </article>
  )
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0 }
const heroStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
  gap: 20,
  alignItems: 'end',
  border: '1px solid rgba(214,168,95,0.30)',
  borderRadius: 28,
  padding: 26,
  background: 'linear-gradient(145deg, rgba(255,255,255,0.092), rgba(255,255,255,0.024)), linear-gradient(135deg, rgba(214,168,95,0.14), transparent 42%, rgba(92,141,255,0.060)), rgba(255,255,255,0.018)',
  boxShadow: '0 28px 90px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.085)',
}
const eyebrowStyle: CSSProperties = { margin: 0, color: '#D6A85F', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }
const smallLabelStyle: CSSProperties = { margin: 0, color: '#F0D099', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }
const loadingTitleStyle: CSSProperties = { margin: '10px 0 0', color: '#F5F7FB', fontSize: 34 }
const heroTitleStyle: CSSProperties = { margin: '12px 0 0', color: '#F5F7FB', fontSize: 'clamp(36px, 6vw, 68px)', lineHeight: 0.96, letterSpacing: -1.1 }
const heroTextStyle: CSSProperties = { maxWidth: 740, margin: '18px 0 0', color: '#9CA3AF', fontSize: 15, lineHeight: 1.75 }
const heroScoreCardStyle: CSSProperties = { alignSelf: 'stretch', display: 'grid', alignContent: 'space-between', gap: 16, minHeight: 190, border: '1px solid rgba(255,255,255,0.11)', borderRadius: 24, background: 'linear-gradient(155deg, rgba(255,255,255,0.080), rgba(255,255,255,0.026)), rgba(5,7,11,0.40)', padding: 18, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.075)' }
const scoreHeadStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }
const scoreValueStyle: CSSProperties = { color: '#F5F7FB', fontSize: 48, lineHeight: 1, letterSpacing: -1.8 }
const scoreTrackStyle: CSSProperties = { position: 'relative', height: 10, overflow: 'hidden', borderRadius: 999, background: 'rgba(255,255,255,0.08)' }
const scoreFillStyle: CSSProperties = { position: 'absolute', inset: 0, borderRadius: 999, background: 'linear-gradient(90deg, #D6A85F, #6EE7B7)' }
const signalGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, color: '#95A0B8', fontSize: 12, lineHeight: 1.35 }
const heroActionsStyle: CSSProperties = { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
const primaryLinkStyle: CSSProperties = { minHeight: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 15, border: '1px solid rgba(214,168,95,0.42)', background: 'rgba(214,168,95,0.14)', color: '#F0D099', textDecoration: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4 }
const secondaryLinkStyle: CSSProperties = { minHeight: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 15, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.028)', color: '#F5F7FB', textDecoration: 'none', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.4 }
function refreshButtonStyle(disabled: boolean): CSSProperties { return { minHeight: 48, padding: '0 18px', borderRadius: 15, border: '1px solid rgba(245,247,251,0.24)', background: '#F5F7FB', color: '#08090D', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4, opacity: disabled ? 0.7 : 1 } }
const errorStyle: CSSProperties = { borderRadius: 18, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: '14px 16px', fontSize: 14, lineHeight: 1.5 }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }
const panelStyle: CSSProperties = { background: 'linear-gradient(155deg, rgba(255,255,255,0.070), rgba(255,255,255,0.022)), rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.105)', borderRadius: 24, padding: 18, minWidth: 0, boxShadow: '0 22px 68px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.066)' }
const photoPanelStyle: CSSProperties = { ...panelStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 18, alignItems: 'end', border: '1px solid rgba(214,168,95,0.28)', background: 'linear-gradient(180deg, rgba(214,168,95,0.10), rgba(255,255,255,0.022)), rgba(255,255,255,0.018)' }
const systemPanelStyle: CSSProperties = { ...panelStyle, display: 'grid', gap: 18, border: '1px solid rgba(110,231,183,0.20)', background: 'linear-gradient(135deg, rgba(110,231,183,0.060), rgba(214,168,95,0.055) 55%, rgba(255,255,255,0.020)), rgba(255,255,255,0.018)' }
const systemGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }
const systemCardStyle: CSSProperties = { borderRadius: 18, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.026)', padding: 16, minWidth: 0 }
const sectionTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 24, lineHeight: 1.1, letterSpacing: -0.7 }
const sectionTextStyle: CSSProperties = { margin: '12px 0 0', color: '#9CA3AF', fontSize: 14, lineHeight: 1.7 }
const widePrimaryLinkStyle: CSSProperties = { minHeight: 54, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 22px', borderRadius: 999, border: '1px solid rgba(245,247,251,0.24)', background: '#F5F7FB', color: '#08090D', textDecoration: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4, whiteSpace: 'nowrap' }
const panelHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }
const statusPillStyle: CSSProperties = { minHeight: 30, display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: '1px solid rgba(214,168,95,0.28)', background: 'rgba(214,168,95,0.10)', color: '#F0D099', padding: '0 11px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4 }
const qualityGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginTop: 16 }
const qualityCardStyle: CSSProperties = { display: 'block', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 18, background: 'rgba(255,255,255,0.024)', padding: 16, textDecoration: 'none', color: '#F5F7FB' }
const qualityStatusStyle: CSSProperties = { display: 'inline-flex', marginBottom: 10, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.8 }
const qualityTitleStyle: CSSProperties = { display: 'block', fontSize: 18 }
const twoColumnStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 14, minWidth: 0 }
const moduleGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 16 }
function moduleCardStyle(accent: string): CSSProperties { return { position: 'relative', overflow: 'hidden', display: 'block', border: `1px solid ${accent}3d`, borderRadius: 18, background: 'rgba(255,255,255,0.024)', padding: 16, color: '#F5F7FB', textDecoration: 'none' } }
function moduleAccentStyle(accent: string): CSSProperties { return { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent } }
const moduleTitleStyle: CSSProperties = { display: 'block', fontSize: 18 }
const moduleDescriptionStyle: CSSProperties = { margin: '8px 0 0', color: '#9CA3AF', fontSize: 13, lineHeight: 1.6 }
const moduleCtaStyle: CSSProperties = { display: 'inline-flex', marginTop: 14, color: '#F0D099', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }
const textLinkStyle: CSSProperties = { color: '#F0D099', textDecoration: 'none', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4 }
const ordersListStyle: CSSProperties = { display: 'grid', gap: 10, marginTop: 16 }
const orderCardStyle: CSSProperties = { display: 'block', textDecoration: 'none', color: '#F5F7FB', background: 'rgba(255,255,255,0.024)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: 14 }
const orderTitleStyle: CSSProperties = { display: 'block', fontSize: 16, wordBreak: 'break-word' }
const mutedLineStyle: CSSProperties = { margin: '6px 0 0', color: '#9CA3AF', fontSize: 13, lineHeight: 1.5, wordBreak: 'break-word' }
const statusTextStyle: CSSProperties = { margin: '8px 0 0', color: '#F0D099', fontSize: 11, lineHeight: 1.5, textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 900 }
const emptyStateStyle: CSSProperties = { color: '#9CA3AF', fontSize: 14, lineHeight: 1.7, border: '1px dashed rgba(255,255,255,0.14)', borderRadius: 16, padding: 16 }
