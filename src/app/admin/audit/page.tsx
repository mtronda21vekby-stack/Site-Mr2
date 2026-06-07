'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type IssueLevel = 'good' | 'warn' | 'danger'
type AuditType = 'home' | 'settings' | 'service' | 'area' | 'content-block' | 'media' | 'order' | 'infra'

type AuditItem = {
  type: AuditType
  title: string
  href: string
  previewHref?: string
  score: number
  level: IssueLevel
  issues: string[]
}

type SelectResult = { rows: any[]; error: string }
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

const typeLabels: Record<AuditType, string> = {
  home: 'Главная',
  settings: 'Настройки',
  service: 'Услуга',
  area: 'Город',
  'content-block': 'Контент-блок',
  media: 'Медиа',
  order: 'Заявки',
  infra: 'Инфраструктура',
}

const levelLabels: Record<IssueLevel, string> = {
  good: 'Готово',
  warn: 'Проверить',
  danger: 'Критично',
}

const requiredTables = [
  'site_settings',
  'home_pages',
  'services',
  'areas',
  'reviews',
  'faq_items',
  'site_content_blocks',
  'site_images',
  'orders',
]

const launchTargets = {
  services: 30,
  areas: 10,
  faq: 10,
  reviews: 6,
  gallery: 6,
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
        const session = sessionResult?.data?.session
        if (!session) {
          router.replace('/admin/login')
          return
        }

        const [home, settings, services, areas, blocks, images, orders, reviews, faq, systemStatus] = await Promise.all([
          safeSelect(supabase, 'home_pages', 'id, locale, hero_title, hero_subtitle, hero_primary_cta, hero_secondary_cta, emergency_title, emergency_text, contact_title, contact_text, faq_title'),
          safeSelect(supabase, 'site_settings', 'id, brand_name, logo_url, logo_alt, phone_primary, phone_display, email, service_hours'),
          safeSelect(supabase, 'services', 'id, locale, slug, title, excerpt, intro, seo_title, seo_description, is_published'),
          safeSelect(supabase, 'areas', 'id, locale, slug, city, title, intro, highlights, supported_services, seo_title, seo_description, is_published'),
          safeSelect(supabase, 'site_content_blocks', 'id, locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, is_published'),
          safeSelect(supabase, 'site_images', 'id, image_url, storage_path, title, alt, category, sort_order, is_published, created_at'),
          safeSelect(supabase, 'orders', 'id, name, phone, service_needed, status, created_at'),
          safeSelect(supabase, 'reviews', 'id, locale, name, quote, rating, is_published'),
          safeSelect(supabase, 'faq_items', 'id, locale, question, answer, is_published'),
          safeFetchSystemStatus(session.access_token),
        ])

        const tableResults: Record<string, SelectResult> = {
          site_settings: settings,
          home_pages: home,
          services,
          areas,
          site_content_blocks: blocks,
          site_images: images,
          orders,
          reviews,
          faq_items: faq,
        }

        const nextItems: AuditItem[] = [
          auditInfra(tableResults),
          auditSystemStatus(systemStatus),
          ...auditHomeRows(home.rows, home.error),
          auditSettingsRow(settings.rows[0], settings.error),
          ...auditServiceRows(services.rows, services.error),
          ...auditAreaRows(areas.rows, areas.error),
          ...auditBlockRows(blocks.rows, blocks.error),
          auditMediaRows(images.rows, images.error),
          auditOrdersRows(orders.rows, orders.error),
          auditReviewsRows(reviews.rows, reviews.error),
          auditFaqRows(faq.rows, faq.error),
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

  if (isBooting) return <div style={panelStyle}><p style={eyebrowStyle}>Аудит</p><h1 style={titleStyle}>Загрузка...</h1></div>

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Planet Locksmiths / CMS контроль качества</p>
          <h1 style={heroTitleStyle}>Аудит сайта</h1>
          <p style={mutedStyle}>Проверка Supabase CMS, логотипа, фото, главной, услуг, городов, отзывов, FAQ, заявок и контент-блоков. Это рабочий чеклист перед показом клиенту и запуском рекламы.</p>
        </div>
        <div style={heroActionsStyle}>
          <a href="/admin/settings" style={ghostButtonStyle}>Настройки</a>
          <a href="/admin/photos" style={ghostButtonStyle}>Фото</a>
          <a href="/admin/home" style={ghostButtonStyle}>Главная</a>
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
              <option value="infra">Инфраструктура</option>
              <option value="settings">Настройки</option>
              <option value="media">Медиа</option>
              <option value="home">Главная</option>
              <option value="service">Услуги</option>
              <option value="area">Города</option>
              <option value="content-block">Блоки</option>
              <option value="order">Заявки</option>
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

async function safeSelect(supabase: any, table: string, select: string): Promise<SelectResult> {
  try {
    const result = await supabase.from(table).select(select)
    if (result.error) return { rows: [], error: result.error.message || `Ошибка таблицы ${table}` }
    return { rows: Array.isArray(result.data) ? result.data : [], error: '' }
  } catch (error) {
    return { rows: [], error: error instanceof Error ? error.message : `Ошибка таблицы ${table}` }
  }
}

async function safeFetchSystemStatus(accessToken: string): Promise<{ data: SystemStatus | null; error: string }> {
  try {
    const response = await fetch('/api/admin/system-status', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!response.ok) return { data: null, error: `System status API: ${response.status}` }
    const data = await response.json()
    return { data, error: '' }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'System status API недоступен' }
  }
}

function auditInfra(results: Record<string, SelectResult>): AuditItem {
  const issues = requiredTables.flatMap((table) => results[table]?.error ? [`${table}: ${results[table].error}`] : [])
  const emptyCritical = ['site_settings', 'home_pages'].filter((table) => !results[table]?.error && !results[table]?.rows.length)
  issues.push(...emptyCritical.map((table) => `${table}: нет данных`))
  return makeItem('infra', 'Supabase CMS foundation', '/admin/audit', undefined, issues)
}

function auditSystemStatus(result: { data: SystemStatus | null; error: string }): AuditItem {
  const issues: string[] = []
  if (result.error) issues.push(result.error)
  if (!result.data?.supabase?.configured) issues.push('Supabase env не подтверждены')
  if (!result.data?.emailNotifications?.enabled) issues.push('RESEND_API_KEY не задан: email-уведомления по заявкам не отправятся')
  if (!result.data?.emailNotifications?.recipientConfigured) issues.push('CONTACT_TO_EMAIL или ADMIN_EMAIL не задан: используется fallback получателя')
  if (!result.data?.emailNotifications?.senderConfigured) issues.push('CONTACT_FROM_EMAIL не задан: нужен verified sender/domain в Resend')
  return makeItem('infra', 'Production почта и env', '/admin/audit', undefined, issues)
}

function auditHomeRows(rows: any[], tableError: string): AuditItem[] {
  if (tableError) return [makeItem('home', 'Главная недоступна', '/admin/home', undefined, [tableError])]
  if (!rows.length) return [makeItem('home', 'Главная не заполнена', '/admin/home', undefined, ['Нет строк home_pages'])]

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

function auditSettingsRow(row: any, tableError: string): AuditItem {
  const issues: string[] = []
  if (tableError) issues.push(tableError)
  if (!row) issues.push('Нет строки site_settings')
  if (!text(row?.brand_name)) issues.push('Нет названия бренда')
  if (!text(row?.logo_url)) issues.push('Нет логотипа в site_settings.logo_url')
  if (!text(row?.logo_alt)) issues.push('Нет alt текста логотипа')
  if (!text(row?.phone_primary)) issues.push('Нет основного телефона')
  if (!text(row?.phone_display)) issues.push('Нет телефона для отображения')
  if (!text(row?.email)) issues.push('Нет email')
  if (!text(row?.service_hours)) issues.push('Нет часов работы')
  return makeItem('settings', 'Глобальные настройки', '/admin/settings', '/en', issues)
}

function auditServiceRows(rows: any[], tableError: string): AuditItem[] {
  if (tableError) return [makeItem('service', 'Услуги недоступны', '/admin/services', undefined, [tableError])]
  if (!rows.length) return [makeItem('service', 'Услуги не заполнены', '/admin/services', undefined, ['Нет строк services'])]

  const publishedEn = rows.filter((row) => (row.locale || 'en') === 'en' && row.is_published !== false)
  const summaryIssues: string[] = []
  if (publishedEn.length < launchTargets.services) summaryIssues.push(`EN услуг меньше ${launchTargets.services}: сейчас ${publishedEn.length}`)

  const rowItems = rows.map((row) => {
    const issues: string[] = []
    if (!row.is_published) issues.push('Страница в черновике')
    if (!text(row.slug)) issues.push('Нет slug')
    if (!text(row.title)) issues.push('Нет заголовка')
    if (len(row.excerpt) < 80) issues.push('Excerpt слишком короткий')
    if (len(row.intro) < 240) issues.push('Intro слишком короткий')
    if (!text(row.seo_title)) issues.push('Нет SEO title')
    if (len(row.seo_description) < 120) issues.push('SEO description слишком короткий')
    const locale = row.locale || 'en'
    const slug = row.slug || ''
    return makeItem('service', row.title || slug || 'Услуга без названия', '/admin/services', slug ? `/${locale}/services/${slug}` : undefined, issues)
  })

  return [
    makeItem('service', `Услуги EN: ${publishedEn.length}/${launchTargets.services}`, '/admin/services', '/en/services', summaryIssues),
    ...rowItems,
  ]
}

function auditAreaRows(rows: any[], tableError: string): AuditItem[] {
  if (tableError) return [makeItem('area', 'Города недоступны', '/admin/areas', undefined, [tableError])]
  if (!rows.length) return [makeItem('area', 'Города не заполнены', '/admin/areas', undefined, ['Нет строк areas'])]

  const publishedEn = rows.filter((row) => (row.locale || 'en') === 'en' && row.is_published !== false)
  const summaryIssues: string[] = []
  if (publishedEn.length < launchTargets.areas) summaryIssues.push(`EN городов меньше ${launchTargets.areas}: сейчас ${publishedEn.length}`)

  const rowItems = rows.map((row) => {
    const issues: string[] = []
    const highlights = Array.isArray(row.highlights) ? row.highlights : []
    const supported = Array.isArray(row.supported_services) ? row.supported_services : []
    if (!row.is_published) issues.push('Страница в черновике')
    if (!text(row.slug)) issues.push('Нет slug')
    if (!text(row.city)) issues.push('Нет города')
    if (!text(row.title)) issues.push('Нет заголовка')
    if (len(row.intro) < 220) issues.push('Intro слишком короткий')
    if (highlights.length < 3) issues.push('Меньше 3 highlights')
    if (supported.length < 4) issues.push('Меньше 4 supported services')
    if (!text(row.seo_title)) issues.push('Нет SEO title')
    if (len(row.seo_description) < 120) issues.push('SEO description слишком короткий')
    const locale = row.locale || 'en'
    const slug = row.slug || ''
    return makeItem('area', row.title || row.city || slug || 'Город без названия', '/admin/areas', slug ? `/${locale}/areas/${slug}` : undefined, issues)
  })

  return [
    makeItem('area', `Города EN: ${publishedEn.length}/${launchTargets.areas}`, '/admin/areas', '/en/areas', summaryIssues),
    ...rowItems,
  ]
}

function auditBlockRows(rows: any[], tableError: string): AuditItem[] {
  if (tableError) return [makeItem('content-block', 'Контент-блоки недоступны', '/admin/content-blocks', undefined, [tableError])]

  const required = [
    { pageKey: 'home', slots: ['service-depth', 'customer-info', 'area-section'] },
    { pageKey: 'service-detail', slots: ['hero', 'overview', 'process'] },
    { pageKey: 'area-detail', slots: ['hero', 'overview', 'supported-services'] },
    { pageKey: 'footer', slots: ['brand', 'services', 'navigation'] },
  ]

  return required.map((group) => {
    const matching = rows.filter((row) => row.page_key === group.pageKey && row.is_published !== false)
    const slots = new Set(matching.map((row) => row.slot).filter(Boolean))
    const issues = group.slots.filter((slot) => !slots.has(slot)).map((slot) => `Нет блока ${group.pageKey} / ${slot}`)
    return makeItem('content-block', `Блоки: ${group.pageKey}`, '/admin/content-blocks', '/admin/content-blocks', issues)
  })
}

function auditMediaRows(rows: any[], tableError: string): AuditItem {
  const issues: string[] = []
  if (tableError) issues.push(tableError)
  const published = rows.filter((row) => row.is_published !== false)
  const logos = published.filter((row) => row.category === 'logo')
  const gallery = published.filter((row) => row.category === 'gallery')
  const backgrounds = published.filter((row) => ['background-decor', 'background-desktop', 'background-mobile'].includes(row.category))
  const before = published.filter((row) => row.category === 'before')
  const after = published.filter((row) => row.category === 'after')
  if (!published.length) issues.push('Нет опубликованных изображений')
  if (!logos.length) issues.push('Нет logo-изображения в site_images')
  if (gallery.length < launchTargets.gallery) issues.push(`Меньше ${launchTargets.gallery} gallery-фото`)
  if (!backgrounds.length) issues.push('Нет опубликованных фоновых изображений')
  if (before.length !== after.length) issues.push('Количество before/after фото не совпадает')
  if (rows.some((row) => !text(row.image_url))) issues.push('Есть изображения без image_url')
  return makeItem('media', `Медиа CMS: ${published.length} опубликовано`, '/admin/photos', '/en', issues)
}

function auditOrdersRows(rows: any[], tableError: string): AuditItem {
  const issues: string[] = []
  if (tableError) issues.push(tableError)
  const active = rows.filter((row) => ['new', 'contacted', 'scheduled', 'in_progress'].includes(String(row.status || '')))
  if (!rows.length) issues.push('Заявок пока нет — проверь форму request service после деплоя')
  if (active.some((row) => !text(row.phone))) issues.push('Есть активные заявки без телефона')
  return makeItem('order', `Заявки: ${rows.length}`, '/admin/orders', undefined, issues)
}

function auditReviewsRows(rows: any[], tableError: string): AuditItem {
  const issues: string[] = []
  if (tableError) issues.push(tableError)
  const published = rows.filter((row) => row.is_published !== false)
  const publishedEn = published.filter((row) => (row.locale || 'en') === 'en')
  if (publishedEn.length < launchTargets.reviews) issues.push(`Меньше ${launchTargets.reviews} опубликованных EN отзывов`)
  if (published.some((row) => !text(row.name) || !text(row.quote))) issues.push('Есть отзывы без имени или текста')
  return makeItem('content-block', `Отзывы EN: ${publishedEn.length}/${launchTargets.reviews}`, '/admin/reviews', '/en/reviews', issues)
}

function auditFaqRows(rows: any[], tableError: string): AuditItem {
  const issues: string[] = []
  if (tableError) issues.push(tableError)
  const published = rows.filter((row) => row.is_published !== false)
  const publishedEn = published.filter((row) => (row.locale || 'en') === 'en')
  if (publishedEn.length < launchTargets.faq) issues.push(`Меньше ${launchTargets.faq} опубликованных EN FAQ`)
  if (published.some((row) => !text(row.question) || !text(row.answer))) issues.push('Есть FAQ без вопроса или ответа')
  return makeItem('content-block', `FAQ EN: ${publishedEn.length}/${launchTargets.faq}`, '/admin/faq', '/en/faq', issues)
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
  const color = tone === 'neutral' ? '#C6CBD6' : toneColor(tone)
  return <article style={{ ...statStyle, borderColor: `${color}55` }}><p style={{ ...smallCapsStyle, color }}>{title}</p><strong style={statValueStyle}>{value}</strong><p style={mutedSmallStyle}>{note}</p></article>
}

function toneColor(tone: IssueLevel) {
  return tone === 'good' ? '#D6A85F' : tone === 'warn' ? '#D6A85F' : '#FF9A9A'
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0, paddingBottom: 24 }
const panelStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(11,16,32,0.78), rgba(5,7,11,0.82))', padding: 18, boxShadow: '0 24px 80px rgba(0,0,0,0.28)' }
const heroStyle: CSSProperties = { ...panelStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'end', gap: 18, background: 'linear-gradient(180deg, rgba(214,168,95,0.10), rgba(255,255,255,0.022)), rgba(255,255,255,0.018)' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#D6A85F', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const titleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 34, lineHeight: 1.05 }
const heroTitleStyle: CSSProperties = { margin: '10px 0 0', color: '#F5F7FB', fontSize: 'clamp(36px, 6vw, 64px)', lineHeight: 0.95, letterSpacing: -2.4 }
const mutedStyle: CSSProperties = { margin: '14px 0 0', color: '#95A0B8', fontSize: 15, lineHeight: 1.8, maxWidth: 760 }
const heroActionsStyle: CSSProperties = { display: 'flex', gap: 10, flexWrap: 'wrap' }
const ghostButtonStyle: CSSProperties = { minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.035)', color: '#F5F7FB', textDecoration: 'none', fontWeight: 900 }
const primaryButtonStyle: CSSProperties = { ...ghostButtonStyle, border: '1px solid rgba(214,168,95,0.42)', background: '#F5F7FB', color: '#02040A' }
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
const smallCapsStyle: CSSProperties = { margin: '12px 0 0', color: '#C6CBD6', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }
const cardTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 20, lineHeight: 1.2 }
const issueListStyle: CSSProperties = { margin: '12px 0 0', paddingLeft: 18, color: '#95A0B8', fontSize: 13, lineHeight: 1.65 }
const goodTextStyle: CSSProperties = { margin: '12px 0 0', color: '#D6A85F', fontSize: 13, lineHeight: 1.6 }
const cardActionsStyle: CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14 }
const inlineLinkStyle: CSSProperties = { color: '#F0D099', textDecoration: 'none', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2 }
const emptyStyle: CSSProperties = { borderRadius: 18, border: '1px dashed rgba(255,255,255,0.14)', padding: 18, color: '#95A0B8' }
const errorStyle: CSSProperties = { borderRadius: 18, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: 14 }
