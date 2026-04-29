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
  { title: 'Фото', href: '/admin/photos', description: 'Загрузка фотографий, галерея, кейсы до/после, редактирование данных.', accent: '#2DE2E6' },
  { title: 'Заявки', href: '/admin/orders', description: 'Новые обращения клиентов, статусы, заметки и история работы.', accent: '#4DA2FF' },
  { title: 'Контент', href: '/admin/content-blocks', description: 'Секции сайта, CTA-блоки, текстовые блоки и карточки.', accent: '#2DE2E6' },
  { title: 'Главная', href: '/admin/home', description: 'Первый экран, заголовки, конверсионные блоки и описания.', accent: '#2DE2E6' },
  { title: 'Услуги', href: '/admin/services', description: 'Страницы услуг, SEO-поля, публикация и структура.', accent: '#2DE2E6' },
  { title: 'Города', href: '/admin/areas', description: 'Локальные страницы покрытия и сервисные зоны.', accent: '#D6A85F' },
  { title: 'Отзывы', href: '/admin/reviews', description: 'Отзывы клиентов и proof-блоки доверия.', accent: '#D6A85F' },
  { title: 'FAQ', href: '/admin/faq', description: 'Ответы на частые вопросы клиентов.', accent: '#4DA2FF' },
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

    async function boot() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/admin/login')
        return
      }

      if (mounted) setIsChecking(false)
      await loadDashboard()
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

  const readyItems = [
    metrics.services >= 6,
    metrics.areas >= 6,
    metrics.faq >= 8,
    metrics.reviews >= 6,
    true,
  ].filter(Boolean).length

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Planet Locksmiths / рабочая панель сайта</p>
          <h1 style={heroTitleStyle}>Панель управления сайтом</h1>
          <p style={heroTextStyle}>
            Управление заявками, фотографиями, услугами, городами, отзывами, FAQ и основным контентом сайта. Версия панели: RU-CONTROL-v6.
          </p>
        </div>

        <div style={heroActionsStyle}>
          <a href="/admin/photos" style={primaryLinkStyle}>📸 Фото</a>
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
                <span style={moduleOrbStyle(item.accent)} />
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
  const color = status === 'good' ? '#2DE2E6' : '#D6A85F'

  return (
    <a href={href} style={{ ...qualityCardStyle, borderColor: `${color}55` }}>
      <span style={{ ...qualityStatusStyle, color }}>{status === 'good' ? 'Готово' : 'Проверить'}</span>
      <strong style={qualityTitleStyle}>{title}</strong>
      <p style={moduleDescriptionStyle}>{note}</p>
      <span style={{ ...moduleCtaStyle, color }}>Открыть →</span>
    </a>
  )
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0 }
const heroStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 20,
  alignItems: 'end',
  border: '1px solid rgba(77,162,255,0.22)',
  borderRadius: 28,
  padding: 24,
  background: 'radial-gradient(circle at 12% 0%, rgba(77,162,255,0.18), transparent 320px), linear-gradient(145deg, rgba(17,25,46,0.82), rgba(3,5,11,0.9))',
  boxShadow: '0 28px 90px rgba(0,0,0,0.26)',
}
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }
const smallLabelStyle: CSSProperties = { margin: 0, color: '#A9D0FF', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const loadingTitleStyle: CSSProperties = { margin: '10px 0 0', color: '#F5F7FB', fontSize: 34 }
const heroTitleStyle: CSSProperties = { margin: '12px 0 0', color: '#F5F7FB', fontSize: 'clamp(36px, 6vw, 72px)', lineHeight: 0.94, letterSpacing: -2.8 }
const heroTextStyle: CSSProperties = { maxWidth: 740, margin: '18px 0 0', color: '#95A0B8', fontSize: 15, lineHeight: 1.8 }
const heroActionsStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
const primaryLinkStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid rgba(45,226,230,0.5)', background: 'rgba(45,226,230,0.15)', color: '#2DE2E6', textDecoration: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.6 }
const secondaryLinkStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.035)', color: '#F5F7FB', textDecoration: 'none', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.6 }
function refreshButtonStyle(disabled: boolean): CSSProperties { return { minHeight: 46, padding: '0 18px', borderRadius: 999, border: '1px solid rgba(77,162,255,0.32)', background: '#4DA2FF', color: '#02040A', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.6, opacity: disabled ? 0.7 : 1 } }
const errorStyle: CSSProperties = { borderRadius: 18, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: '14px 16px', fontSize: 14, lineHeight: 1.5 }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }
const panelStyle: CSSProperties = { background: 'linear-gradient(145deg, rgba(11,16,32,0.78), rgba(5,7,11,0.82))', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 26, padding: 18, minWidth: 0, boxShadow: '0 24px 70px rgba(0,0,0,0.22)' }
const photoPanelStyle: CSSProperties = { ...panelStyle, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 18, alignItems: 'end', border: '1px solid rgba(45,226,230,0.24)', background: 'radial-gradient(circle at 10% 0%, rgba(45,226,230,0.16), transparent 340px), linear-gradient(145deg, rgba(7,25,32,0.82), rgba(3,5,11,0.88))' }
const sectionTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 24, lineHeight: 1.1, letterSpacing: -0.7 }
const sectionTextStyle: CSSProperties = { margin: '12px 0 0', color: '#95A0B8', fontSize: 14, lineHeight: 1.7 }
const widePrimaryLinkStyle: CSSProperties = { minHeight: 54, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 22px', borderRadius: 999, border: '1px solid rgba(45,226,230,0.5)', background: '#2DE2E6', color: '#02040A', textDecoration: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.6, whiteSpace: 'nowrap' }
const panelHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }
const statusPillStyle: CSSProperties = { minHeight: 30, display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: '1px solid rgba(45,226,230,0.22)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6', padding: '0 11px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.6 }
const qualityGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginTop: 16 }
const qualityCardStyle: CSSProperties = { display: 'block', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, background: 'rgba(255,255,255,0.035)', padding: 16, textDecoration: 'none', color: '#F5F7FB' }
const qualityStatusStyle: CSSProperties = { display: 'inline-flex', marginBottom: 10, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.8 }
const qualityTitleStyle: CSSProperties = { display: 'block', fontSize: 18 }
const twoColumnStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(280px, 0.75fr)', gap: 14, minWidth: 0 }
const moduleGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 16 }
function moduleCardStyle(accent: string): CSSProperties { return { position: 'relative', overflow: 'hidden', display: 'block', border: `1px solid ${accent}44`, borderRadius: 20, background: 'rgba(17,25,46,0.62)', padding: 16, color: '#F5F7FB', textDecoration: 'none' } }
function moduleOrbStyle(accent: string): CSSProperties { return { position: 'absolute', right: -28, top: -28, width: 88, height: 88, borderRadius: 999, border: `1px solid ${accent}55`, background: `${accent}10` } }
const moduleTitleStyle: CSSProperties = { display: 'block', fontSize: 18 }
const moduleDescriptionStyle: CSSProperties = { margin: '8px 0 0', color: '#95A0B8', fontSize: 13, lineHeight: 1.6 }
const moduleCtaStyle: CSSProperties = { display: 'inline-flex', marginTop: 14, color: '#A9D0FF', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.7 }
const textLinkStyle: CSSProperties = { color: '#A9D0FF', textDecoration: 'none', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4 }
const ordersListStyle: CSSProperties = { display: 'grid', gap: 10, marginTop: 16 }
const orderCardStyle: CSSProperties = { display: 'block', textDecoration: 'none', color: '#F5F7FB', background: 'rgba(17,25,46,0.62)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 18, padding: 14 }
const orderTitleStyle: CSSProperties = { display: 'block', fontSize: 16, wordBreak: 'break-word' }
const mutedLineStyle: CSSProperties = { margin: '6px 0 0', color: '#95A0B8', fontSize: 13, lineHeight: 1.5, wordBreak: 'break-word' }
const statusTextStyle: CSSProperties = { margin: '8px 0 0', color: '#A9D0FF', fontSize: 11, lineHeight: 1.5, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 900 }
const emptyStateStyle: CSSProperties = { color: '#95A0B8', fontSize: 14, lineHeight: 1.7, border: '1px dashed rgba(255,255,255,0.14)', borderRadius: 18, padding: 16 }
