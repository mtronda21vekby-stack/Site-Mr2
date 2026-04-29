'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type IssueLevel = 'good' | 'warn' | 'danger'
type AuditType = 'home' | 'settings' | 'service' | 'area' | 'content-block'

type AuditItem = {
  type: AuditType
  title: string
  href: string
  previewHref?: string
  score: number
  level: IssueLevel
  issues: string[]
}

const typeLabels: Record<AuditType, string> = {
  home: 'Главная',
  settings: 'Настройки',
  service: 'Услуга',
  area: 'Город',
  'content-block': 'Контент-блок',
}

const levelLabels: Record<IssueLevel, string> = {
  good: 'Готово',
  warn: 'Проверить',
  danger: 'Критично',
}

export default function AdminAuditPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [items, setItems] = useState<AuditItem[]>([])
  const [isBooting, setIsBooting] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [levelFilter, setLevelFilter] = useState<'all' | IssueLevel>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | AuditType>('all')

  useEffect(() => {
    let mounted = true

    async function boot() {
      try {
        setErrorMessage('')
        const sessionResult = await supabase.auth.getSession()
        if (!sessionResult?.data?.session) {
          router.replace('/admin/login')
          return
        }

        const [home, settings, services, areas, blocks] = await Promise.all([
          safeSelect(supabase, 'home_pages', 'id, locale, hero_title, hero_subtitle, hero_primary_cta, hero_secondary_cta, emergency_title, emergency_text, contact_title, contact_text, faq_title'),
          safeSelect(supabase, 'site_settings', 'id, brand_name, phone_primary, phone_display, email, service_hours'),
          safeSelect(supabase, 'services', 'id, locale, slug, title, excerpt, intro, seo_title, seo_description, is_published'),
          safeSelect(supabase, 'areas', 'id, locale, slug, city, title, intro, highlights, supported_services, seo_title, seo_description, is_published'),
          safeSelect(supabase, 'site_content_blocks', 'id, locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, is_published'),
        ])

        const nextItems: AuditItem[] = [
          ...auditHomeRows(home.rows),
          auditSettingsRow(settings.rows[0]),
          ...auditServiceRows(services.rows),
          ...auditAreaRows(areas.rows),
          ...auditBlockRows(blocks.rows, blocks.error),
        ].sort((a, b) => a.score - b.score)

        if (mounted) setItems(nextItems)
      } catch (error) {
        if (mounted) setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить аудит')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => { mounted = false }
  }, [router, supabase])

  const filteredItems = items.filter((item) => (levelFilter === 'all' || item.level === levelFilter) && (typeFilter === 'all' || item.type === typeFilter))
  const criticalItems = items.filter((item) => item.level === 'danger')
  const warningItems = items.filter((item) => item.level === 'warn')
  const goodItems = items.filter((item) => item.level === 'good')
  const siteScore = items.length ? Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length) : 0

  if (isBooting) {
    return <div style={panelStyle}><p style={eyebrowStyle}>Аудит</p><h1 style={titleStyle}>Загрузка...</h1></div>
  }

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Planet Locksmiths / контроль качества</p>
          <h1 style={heroTitleStyle}>Аудит сайта</h1>
          <p style={mutedStyle}>Проверка главной, настроек, услуг, городов и контент-блоков. Страница показывает, что нужно исправить перед показом заказчику или запуском рекламы.</p>
        </div>
        <div style={heroActionsStyle}>
          <a href="/admin/content-blocks" style={ghostButtonStyle}>Блоки</a>
          <a href="/admin/home" style={ghostButtonStyle}>Главная</a>
          <a href="/admin/services" style={ghostButtonStyle}>Услуги</a>
          <a href="/en" target="_blank" rel="noreferrer" style={primaryButtonStyle}>Открыть сайт</a>
        </div>
      </section>

      {errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null}

      <section style={statsGridStyle}>
        <Stat title="Оценка" value={`${siteScore}/100`} tone={siteScore >= 85 ? 'good' : siteScore >= 65 ? 'warn' : 'danger'} note="Средний балл по проверкам." />
        <Stat title="Проверено" value={String(items.length)} note="Всего элементов." />
        <Stat title="Готово" value={String(goodItems.length)} tone="good" note="Без проблем." />
        <Stat title="Проверить" value={String(warningItems.length)} tone="warn" note="Нужны улучшения." />
        <Stat title="Критично" value={String(criticalItems.length)} tone="danger" note="Исправить первым." />
      </section>

      <section style={panelStyle}>
        <div style={sectionHeadStyle}>
          <div>
            <p style={eyebrowStyle}>Фильтры</p>
            <h2 style={sectionTitleStyle}>Детальные проверки</h2>
          </div>
          <div style={filtersStyle}>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as 'all' | AuditType)} style={selectStyle}>
              <option value="all">Все типы</option>
              <option value="home">Главная</option>
              <option value="settings">Настройки</option>
              <option value="service">Услуги</option>
              <option value="area">Города</option>
              <option value="content-block">Блоки</option>
            </select>
            <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value as 'all' | IssueLevel)} style={selectStyle}>
              <option value="all">Все статусы</option>
              <option value="danger">Критично</option>
              <option value="warn">Проверить</option>
              <option value="good">Готово</option>
            </select>
          </div>
        </div>

        <div style={auditGridStyle}>
          {filteredItems.map((item, index) => <AuditCard key={`${item.type}-${item.title}-${index}`} item={item} />)}
          {!filteredItems.length ? <div style={emptyStyle}>Нет элементов под выбранные фильтры.</div> : null}
        </div>
      </section>
    </div>
  )
}

async function safeSelect(supabase: any, table: string, select: string): Promise<{ rows: any[]; error: string }> {
  try {
    const result = await supabase.from(table).select(select)
    if (result.error) return { rows: [], error: result.error.message || `Ошибка таблицы ${table}` }
    return { rows: Array.isArray(result.data) ? result.data : [], error: '' }
  } catch (error) {
    return { rows: [], error: error instanceof Error ? error.message : `Ошибка таблицы ${table}` }
  }
}

function auditHomeRows(rows: any[]): AuditItem[] {
  return rows.map((row) => {
    const issues: string[] = []
    if (!text(row.hero_title)) issues.push('Нет hero-заголовка')
    if (len(row.hero_subtitle) < 80) issues.push('Hero subtitle слишком короткий')
    if (!text(row.hero_primary_cta)) issues.push('Нет primary CTA')
    if (!text(row.hero_secondary_cta)) issues.push('Нет secondary CTA')
    if (!text(row.emergency_title)) issues.push('Нет emergency-заголовка')
    if (len(row.emergency_text) < 80) issues.push('Emergency-текст слишком короткий')
    if (!text(row.contact_title)) issues.push('Нет contact title')
    if (len(row.contact_text) < 80) issues.push('Contact text слишком короткий')
    if (!text(row.faq_title)) issues.push('Нет FAQ title')
    return makeItem('home', `Главная ${String(row.locale || '').toUpperCase()}`, '/admin/home', `/${row.locale || 'en'}`, issues)
  })
}

function auditSettingsRow(row: any): AuditItem {
  const issues: string[] = []
  if (!row) issues.push('Нет строки site_settings')
  if (!text(row?.brand_name)) issues.push('Нет названия бренда')
  if (!text(row?.phone_primary)) issues.push('Нет основного телефона')
  if (!text(row?.phone_display)) issues.push('Нет телефона для отображения')
  if (!text(row?.email)) issues.push('Нет email')
  if (!text(row?.service_hours)) issues.push('Нет часов работы')
  return makeItem('settings', 'Глобальные настройки', '/admin/settings', '/en', issues)
}

function auditServiceRows(rows: any[]): AuditItem[] {
  return rows.map((row) => {
    const issues: string[] = []
    if (!row.is_published) issues.push('Страница в черновике')
    if (!text(row.slug)) issues.push('Нет slug')
    if (!text(row.title)) issues.push('Нет заголовка')
    if (len(row.excerpt) < 80) issues.push('Excerpt слишком короткий')
    if (len(row.intro) < 300) issues.push('Intro слишком короткий')
    if (!text(row.seo_title)) issues.push('Нет SEO title')
    if (len(row.seo_description) < 120) issues.push('SEO description слишком короткий')
    const locale = row.locale || 'en'
    const slug = row.slug || ''
    return makeItem('service', row.title || slug || 'Услуга без названия', '/admin/services', slug ? `/${locale}/services/${slug}` : undefined, issues)
  })
}

function auditAreaRows(rows: any[]): AuditItem[] {
  return rows.map((row) => {
    const issues: string[] = []
    const highlights = Array.isArray(row.highlights) ? row.highlights : []
    const supported = Array.isArray(row.supported_services) ? row.supported_services : []
    if (!row.is_published) issues.push('Страница в черновике')
    if (!text(row.slug)) issues.push('Нет slug')
    if (!text(row.city)) issues.push('Нет города')
    if (!text(row.title)) issues.push('Нет заголовка')
    if (len(row.intro) < 250) issues.push('Intro слишком короткий')
    if (highlights.length < 3) issues.push('Меньше 3 highlights')
    if (supported.length < 4) issues.push('Меньше 4 supported services')
    if (!text(row.seo_title)) issues.push('Нет SEO title')
    if (len(row.seo_description) < 120) issues.push('SEO description слишком короткий')
    const locale = row.locale || 'en'
    const slug = row.slug || ''
    return makeItem('area', row.title || row.city || slug || 'Город без названия', '/admin/areas', slug ? `/${locale}/areas/${slug}` : undefined, issues)
  })
}

function auditBlockRows(rows: any[], tableError: string): AuditItem[] {
  if (tableError) return [makeItem('content-block', 'Контент-блоки недоступны', '/admin/content-blocks', undefined, [tableError])]

  const required = [
    { pageKey: 'home', slots: ['service-depth', 'customer-info', 'area-section'] },
    { pageKey: 'service-detail', slots: ['hero', 'overview', 'process'] },
    { pageKey: 'area-detail', slots: ['hero', 'overview', 'supported-services'] },
    { pageKey: 'footer', slots: ['brand', 'services', 'navigation'] },
  ]

  const items: AuditItem[] = []
  for (const group of required) {
    const matching = rows.filter((row) => row.page_key === group.pageKey && row.is_published !== false)
    const slots = new Set(matching.map((row) => row.slot).filter(Boolean))
    const issues = group.slots.filter((slot) => !slots.has(slot)).map((slot) => `Нет блока ${group.pageKey} / ${slot}`)
    items.push(makeItem('content-block', `Блоки: ${group.pageKey}`, '/admin/content-blocks', '/admin/content-blocks', issues))
  }

  return items
}

function makeItem(type: AuditType, title: string, href: string, previewHref: string | undefined, issues: string[]): AuditItem {
  const score = Math.max(0, 100 - issues.length * 14)
  const level: IssueLevel = issues.length === 0 ? 'good' : issues.length <= 3 ? 'warn' : 'danger'
  return { type, title, href, previewHref, issues, score, level }
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function len(value: unknown) {
  return typeof value === 'string' ? value.trim().length : 0
}

function AuditCard({ item }: { item: AuditItem }) {
  const color = toneColor(item.level)
  return (
    <article style={{ ...cardStyle, borderColor: `${color}66` }}>
      <div style={cardTopStyle}><span style={{ ...pillStyle, color, borderColor: `${color}66`, background: `${color}14` }}>{levelLabels[item.level]}</span><strong style={scoreStyle}>{item.score}/100</strong></div>
      <p style={smallCapsStyle}>{typeLabels[item.type]}</p>
      <h3 style={cardTitleStyle}>{item.title}</h3>
      {item.issues.length ? <ul style={issueListStyle}>{item.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : <p style={goodTextStyle}>Проблем не найдено.</p>}
      <div style={cardActionsStyle}><a href={item.href} style={inlineLinkStyle}>Редактировать →</a>{item.previewHref ? <a href={item.previewHref} target="_blank" rel="noreferrer" style={inlineLinkStyle}>Preview →</a> : null}</div>
    </article>
  )
}

function Stat({ title, value, note, tone = 'neutral' }: { title: string; value: string; note: string; tone?: 'neutral' | IssueLevel }) {
  const color = tone === 'neutral' ? '#A9D0FF' : toneColor(tone)
  return <article style={{ ...statStyle, borderColor: `${color}55` }}><p style={{ ...smallCapsStyle, color }}>{title}</p><strong style={statValueStyle}>{value}</strong><p style={mutedSmallStyle}>{note}</p></article>
}

function toneColor(tone: IssueLevel) {
  return tone === 'good' ? '#2DE2E6' : tone === 'warn' ? '#D6A85F' : '#FF9A9A'
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0, paddingBottom: 24 }
const panelStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(11,16,32,0.78), rgba(5,7,11,0.82))', padding: 18, boxShadow: '0 24px 80px rgba(0,0,0,0.28)' }
const heroStyle: CSSProperties = { ...panelStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'end', gap: 18, background: 'radial-gradient(circle at 12% 0%, rgba(77,162,255,0.20), transparent 320px), linear-gradient(145deg, rgba(17,25,46,0.78), rgba(3,5,11,0.86))' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const titleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 34, lineHeight: 1.05 }
const heroTitleStyle: CSSProperties = { margin: '10px 0 0', color: '#F5F7FB', fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 0.95, letterSpacing: -2.4 }
const mutedStyle: CSSProperties = { margin: '14px 0 0', color: '#95A0B8', fontSize: 15, lineHeight: 1.8, maxWidth: 760 }
const heroActionsStyle: CSSProperties = { display: 'flex', gap: 10, flexWrap: 'wrap' }
const ghostButtonStyle: CSSProperties = { minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.035)', color: '#F5F7FB', textDecoration: 'none', fontWeight: 900 }
const primaryButtonStyle: CSSProperties = { ...ghostButtonStyle, border: '1px solid rgba(77,162,255,0.45)', background: '#4DA2FF', color: '#02040A' }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }
const statStyle: CSSProperties = { borderRadius: 22, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.035)', padding: 16 }
const statValueStyle: CSSProperties = { display: 'block', color: '#F5F7FB', fontSize: 34, lineHeight: 1, marginTop: 10 }
const mutedSmallStyle: CSSProperties = { margin: '8px 0 0', color: '#95A0B8', fontSize: 13, lineHeight: 1.55 }
const sectionHeadStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap', marginBottom: 16 }
const sectionTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 24, lineHeight: 1.1 }
const filtersStyle: CSSProperties = { display: 'flex', gap: 10, flexWrap: 'wrap' }
const selectStyle: CSSProperties = { minHeight: 44, borderRadius: 14, border: '1px solid rgba(255,255,255,0.11)', background: 'rgba(7,11,20,0.82)', color: '#F5F7FB', padding: '0 12px', fontSize: 15 }
const auditGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }
const cardStyle: CSSProperties = { borderRadius: 22, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.035)', padding: 16 }
const cardTopStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }
const pillStyle: CSSProperties = { display: 'inline-flex', borderRadius: 999, border: '1px solid rgba(255,255,255,0.10)', padding: '5px 9px', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4 }
const scoreStyle: CSSProperties = { color: '#F5F7FB', fontSize: 13 }
const smallCapsStyle: CSSProperties = { margin: '12px 0 0', color: '#A9D0FF', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }
const cardTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 20, lineHeight: 1.2 }
const issueListStyle: CSSProperties = { margin: '12px 0 0', paddingLeft: 18, color: '#95A0B8', fontSize: 13, lineHeight: 1.65 }
const goodTextStyle: CSSProperties = { margin: '12px 0 0', color: '#2DE2E6', fontSize: 13, lineHeight: 1.6 }
const cardActionsStyle: CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14 }
const inlineLinkStyle: CSSProperties = { color: '#A9D0FF', textDecoration: 'none', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2 }
const emptyStyle: CSSProperties = { borderRadius: 18, border: '1px dashed rgba(255,255,255,0.14)', padding: 18, color: '#95A0B8' }
const errorStyle: CSSProperties = { borderRadius: 18, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: 14 }
