'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type Locale = 'en' | 'es' | 'ru'
type IssueLevel = 'good' | 'warn' | 'danger'
type AuditType = 'home' | 'settings' | 'service' | 'area'

type ServiceRow = {
  id: string
  locale: Locale
  slug: string | null
  title: string | null
  excerpt: string | null
  intro: string | null
  seo_title: string | null
  seo_description: string | null
  is_published: boolean | null
}

type AreaRow = {
  id: string
  locale: Locale
  slug: string | null
  city: string | null
  state: string | null
  title: string | null
  intro: string | null
  highlights: string[] | null
  supported_services: string[] | null
  seo_title: string | null
  seo_description: string | null
  is_published: boolean | null
}

type HomeRow = {
  id: string
  locale: Locale
  hero_title: string | null
  hero_subtitle: string | null
  hero_primary_cta: string | null
  hero_secondary_cta: string | null
  emergency_title: string | null
  emergency_text: string | null
  contact_title: string | null
  contact_text: string | null
  faq_title: string | null
}

type SettingsRow = {
  id?: string
  brand_name?: string | null
  phone_primary?: string | null
  phone_display?: string | null
  email?: string | null
  service_hours?: string | null
}

type AuditItem = {
  type: AuditType
  locale?: Locale
  title: string
  slug: string
  href: string
  previewHref?: string
  score: number
  level: IssueLevel
  issues: string[]
}

export default function AdminAuditPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [isBooting, setIsBooting] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [items, setItems] = useState<AuditItem[]>([])
  const [filter, setFilter] = useState<'all' | IssueLevel>('all')
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

        const [servicesResult, areasResult, homeResult, settingsResult] = await Promise.all([
          (supabase.from('services') as any)
            .select('id, locale, slug, title, excerpt, intro, seo_title, seo_description, is_published')
            .order('locale', { ascending: true }),
          (supabase.from('areas') as any)
            .select('id, locale, slug, city, state, title, intro, highlights, supported_services, seo_title, seo_description, is_published')
            .order('locale', { ascending: true }),
          (supabase.from('home_pages') as any)
            .select('id, locale, hero_title, hero_subtitle, hero_primary_cta, hero_secondary_cta, emergency_title, emergency_text, contact_title, contact_text, faq_title')
            .order('locale', { ascending: true }),
          (supabase.from('site_settings') as any)
            .select('id, brand_name, phone_primary, phone_display, email, service_hours')
            .limit(1),
        ])

        const errors = [servicesResult.error, areasResult.error, homeResult.error, settingsResult.error].filter(Boolean)
        if (errors.length) throw new Error(errors.map((error: any) => error.message).join(' / '))

        const services = Array.isArray(servicesResult.data) ? (servicesResult.data as ServiceRow[]) : []
        const areas = Array.isArray(areasResult.data) ? (areasResult.data as AreaRow[]) : []
        const homeRows = Array.isArray(homeResult.data) ? (homeResult.data as HomeRow[]) : []
        const settingsRows = Array.isArray(settingsResult.data) ? (settingsResult.data as SettingsRow[]) : []

        const nextItems = [
          ...homeRows.map(auditHome),
          auditSettings(settingsRows[0] ?? null),
          ...services.map(auditService),
          ...areas.map(auditArea),
        ].sort((a, b) => a.score - b.score)

        if (!mounted) return
        setItems(nextItems)
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load audit')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => {
      mounted = false
    }
  }, [router, supabase])

  const filteredItems = items.filter((item) => {
    const levelOk = filter === 'all' || item.level === filter
    const typeOk = typeFilter === 'all' || item.type === typeFilter
    return levelOk && typeOk
  })

  const criticalItems = items.filter((item) => item.level === 'danger')
  const warningItems = items.filter((item) => item.level === 'warn')
  const goodItems = items.filter((item) => item.level === 'good')
  const siteScore = items.length ? Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length) : 0

  const stats = {
    total: items.length,
    good: goodItems.length,
    warn: warningItems.length,
    danger: criticalItems.length,
  }

  if (isBooting) {
    return (
      <div style={pageStyle}>
        <div style={panelStyle}>
          <p style={eyebrowStyle}>Audit center</p>
          <h1 style={titleStyle}>Loading content audit...</h1>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Planetlocksmiths / Admin / Audit</p>
          <h1 style={heroTitleStyle}>Content Audit Center</h1>
          <p style={mutedTextStyle}>
            Checks Home, Settings, service pages, and area landing pages for SEO, Ads-readiness, useful customer information, CTAs, and publish quality.
          </p>
        </div>
        <div style={heroActionsStyle}>
          <a href="/admin/direct" style={ghostButtonStyle}>Dashboard</a>
          <a href="/admin/home" style={ghostButtonStyle}>Fix in Home</a>
          <a href="/admin/settings" style={ghostButtonStyle}>Fix in Settings</a>
          <a href="/en" target="_blank" rel="noreferrer" style={primaryLinkStyle}>View site</a>
        </div>
      </section>

      {errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null}

      <div style={statsGridStyle}>
        <Stat title="Site Score" value={`${siteScore}/100`} note="Average score across audited content." tone={siteScore >= 85 ? 'good' : siteScore >= 65 ? 'warn' : 'danger'} />
        <Stat title="Audited items" value={String(stats.total)} note="Home, settings, services, and areas." />
        <Stat title="Good" value={String(stats.good)} note="Ready or close to ready." tone="good" />
        <Stat title="Warnings" value={String(stats.warn)} note="Needs improvement." tone="warn" />
        <Stat title="Critical" value={String(stats.danger)} note="Fix before Ads push." tone="danger" />
      </div>

      <section style={panelStyle}>
        <div style={filterRowStyle}>
          <div>
            <p style={eyebrowStyle}>Priority fixes</p>
            <h2 style={sectionTitleStyle}>Critical / Warnings / Good</h2>
          </div>
          <div style={quickActionsStyle}>
            <a href="/admin/home" style={inlineButtonStyle}>Fix in Home</a>
            <a href="/admin/settings" style={inlineButtonStyle}>Fix in Settings</a>
            <a href="/admin/services" style={inlineButtonStyle}>Fix in Services</a>
            <a href="/admin/areas" style={inlineButtonStyle}>Fix in Areas</a>
          </div>
        </div>

        <div style={threeColumnStyle}>
          <IssueColumn title="Critical Issues" items={criticalItems} tone="danger" />
          <IssueColumn title="Warnings" items={warningItems} tone="warn" />
          <IssueColumn title="Good" items={goodItems.slice(0, 8)} tone="good" />
        </div>
      </section>

      <section style={panelStyle}>
        <div style={filterRowStyle}>
          <div>
            <p style={eyebrowStyle}>Detailed checks</p>
            <h2 style={sectionTitleStyle}>Page-level issues</h2>
          </div>
          <div style={filterControlsStyle}>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'all' | AuditType)} style={selectStyle}>
              <option value="all">All types</option>
              <option value="home">Home</option>
              <option value="settings">Settings</option>
              <option value="service">Services</option>
              <option value="area">Areas</option>
            </select>
            <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | IssueLevel)} style={selectStyle}>
              <option value="all">All statuses</option>
              <option value="danger">Critical</option>
              <option value="warn">Warnings</option>
              <option value="good">Good</option>
            </select>
          </div>
        </div>

        <div style={auditGridStyle}>
          {filteredItems.map((item) => <AuditCard key={`${item.type}-${item.locale ?? 'global'}-${item.slug || item.title}`} item={item} />)}
          {!filteredItems.length ? <div style={emptyStateStyle}>No pages match the selected filters.</div> : null}
        </div>
      </section>
    </div>
  )
}

function auditHome(row: HomeRow): AuditItem {
  const issues: string[] = []
  const locale = row.locale

  if (!row.hero_title?.trim()) issues.push('Missing hero title')
  if ((row.hero_subtitle || '').trim().length < 80) issues.push('Hero subtitle should clearly explain service, location, and value')
  if (!row.hero_primary_cta?.trim()) issues.push('Missing primary CTA label')
  if (!row.hero_secondary_cta?.trim()) issues.push('Missing secondary CTA label')
  if (!row.emergency_title?.trim()) issues.push('Missing emergency title')
  if ((row.emergency_text || '').trim().length < 80) issues.push('Emergency text should explain urgency, availability, and next step')
  if (!row.contact_title?.trim()) issues.push('Missing contact title')
  if ((row.contact_text || '').trim().length < 80) issues.push('Contact text should explain what customer should submit')
  if (!row.faq_title?.trim()) issues.push('Missing FAQ title')

  return makeAuditItem({
    type: 'home',
    locale,
    title: `Home content ${locale.toUpperCase()}`,
    slug: locale,
    href: '/admin/home',
    previewHref: `/${locale}`,
    issues,
  })
}

function auditSettings(row: SettingsRow | null): AuditItem {
  const issues: string[] = []

  if (!row) issues.push('Missing site settings row')
  if (!row?.brand_name?.trim()) issues.push('Missing brand name')
  if (!row?.phone_primary?.trim()) issues.push('Missing primary phone number')
  if (!row?.phone_display?.trim()) issues.push('Missing display phone number')
  if (!row?.service_hours?.trim()) issues.push('Missing service hours')
  if (row && 'email' in row && !(row.email || '').trim()) issues.push('Email is empty')

  return makeAuditItem({
    type: 'settings',
    title: 'Global site settings',
    slug: 'settings',
    href: '/admin/settings',
    previewHref: '/en',
    issues,
  })
}

function auditService(row: ServiceRow): AuditItem {
  const issues: string[] = []
  const locale = row.locale
  const slug = row.slug || ''

  if (!row.is_published) issues.push('Draft: page is not published')
  if (!slug.trim()) issues.push('Missing slug')
  if (!row.title?.trim()) issues.push('Missing title')
  if ((row.excerpt || '').trim().length < 80) issues.push('Excerpt is too short for a clear service card')
  if ((row.intro || '').trim().length < 350) issues.push('Intro should explain service, vehicle info, pricing factors, limits, and next steps')
  if (!(row.seo_title || '').trim()) issues.push('Missing SEO title')
  if ((row.seo_description || '').trim().length < 120) issues.push('SEO description is missing or too short')

  return makeAuditItem({
    type: 'service',
    locale,
    title: row.title || slug || 'Untitled service',
    slug,
    href: '/admin/services',
    previewHref: slug ? `/${locale}/services/${slug}` : undefined,
    issues,
  })
}

function auditArea(row: AreaRow): AuditItem {
  const issues: string[] = []
  const locale = row.locale
  const slug = row.slug || ''
  const highlights = Array.isArray(row.highlights) ? row.highlights : []
  const supported = Array.isArray(row.supported_services) ? row.supported_services : []

  if (!row.is_published) issues.push('Draft: page is not published')
  if (!slug.trim()) issues.push('Missing slug')
  if (!row.city?.trim()) issues.push('Missing city')
  if (!row.title?.trim()) issues.push('Missing title')
  if ((row.intro || '').trim().length < 300) issues.push('Intro should explain local coverage, service availability, and customer preparation')
  if (highlights.length < 3) issues.push('Add at least 3 area highlights')
  if (supported.length < 4) issues.push('Add at least 4 supported services')
  if (!(row.seo_title || '').trim()) issues.push('Missing SEO title')
  if ((row.seo_description || '').trim().length < 120) issues.push('SEO description is missing or too short')

  return makeAuditItem({
    type: 'area',
    locale,
    title: row.title || row.city || slug || 'Untitled area',
    slug,
    href: '/admin/areas',
    previewHref: slug ? `/${locale}/areas/${slug}` : undefined,
    issues,
  })
}

function makeAuditItem(input: Omit<AuditItem, 'score' | 'level'> & { issues: string[] }): AuditItem {
  const score = Math.max(0, 100 - input.issues.length * 14)
  const level: IssueLevel = input.issues.length === 0 ? 'good' : input.issues.length <= 3 ? 'warn' : 'danger'
  return { ...input, score, level }
}

function IssueColumn({ title, items, tone }: { title: string; items: AuditItem[]; tone: IssueLevel }) {
  const color = getToneColor(tone)

  return (
    <div style={{ ...issueColumnStyle, borderColor: `${color}44` }}>
      <h3 style={{ ...columnTitleStyle, color }}>{title}</h3>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {items.map((item) => (
          <a key={`${item.type}-${item.locale ?? 'global'}-${item.slug}`} href={item.href} style={miniIssueStyle}>
            <strong style={{ display: 'block', color: '#F5F7FB', fontSize: 14 }}>{item.title}</strong>
            <span style={{ display: 'block', color: '#95A0B8', fontSize: 12, lineHeight: 1.45, marginTop: 4 }}>
              {item.issues[0] || 'No obvious content issues found.'}
            </span>
          </a>
        ))}
        {!items.length ? <div style={miniEmptyStyle}>No items.</div> : null}
      </div>
    </div>
  )
}

function AuditCard({ item }: { item: AuditItem }) {
  const color = getToneColor(item.level)
  const typeLabel = item.locale ? `${item.type} · ${item.locale.toUpperCase()}` : item.type

  return (
    <article style={{ ...cardStyle, borderColor: `${color}55` }}>
      <div style={cardTopStyle}>
        <span style={{ ...pillStyle, color, borderColor: `${color}55`, background: `${color}14` }}>{item.level}</span>
        <span style={scoreStyle}>{item.score}/100</span>
      </div>
      <p style={smallCapsStyle}>{typeLabel}</p>
      <h3 style={cardTitleStyle}>{item.title}</h3>
      {item.slug ? <p style={slugStyle}>{item.previewHref || item.slug}</p> : null}
      {item.issues.length ? (
        <ul style={issueListStyle}>{item.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
      ) : <p style={goodTextStyle}>No obvious content issues found.</p>}
      <div style={cardActionsStyle}>
        <a href={item.href} style={inlineLinkStyle}>Edit content →</a>
        {item.previewHref ? <a href={item.previewHref} target="_blank" rel="noreferrer" style={inlineLinkStyle}>Preview →</a> : null}
      </div>
    </article>
  )
}

function Stat({ title, value, note, tone = 'neutral' }: { title: string; value: string; note: string; tone?: 'neutral' | IssueLevel }) {
  const color = tone === 'neutral' ? '#A9D0FF' : getToneColor(tone)
  return <div style={{ ...statStyle, borderColor: `${color}44` }}><p style={{ ...smallCapsStyle, color }}>{title}</p><strong style={statValueStyle}>{value}</strong><p style={mutedSmallStyle}>{note}</p></div>
}

function getToneColor(tone: IssueLevel) {
  return tone === 'good' ? '#2DE2E6' : tone === 'warn' ? '#D6A85F' : '#FF9A9A'
}

const pageStyle: CSSProperties = { position: 'relative', display: 'grid', gap: 18, paddingBottom: 24 }
const heroStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, alignItems: 'end', border: '1px solid rgba(77,162,255,0.22)', borderRadius: 30, padding: 24, background: 'radial-gradient(circle at 12% 0%, rgba(77,162,255,0.20), transparent 320px), linear-gradient(145deg, rgba(17,25,46,0.78), rgba(3,5,11,0.86))', boxShadow: '0 32px 110px rgba(0,0,0,0.36)' }
const panelStyle: CSSProperties = { border: '1px solid rgba(255,255,255,0.10)', borderRadius: 26, padding: 18, background: 'linear-gradient(145deg, rgba(11,16,32,0.78), rgba(5,7,11,0.82))', boxShadow: '0 28px 90px rgba(0,0,0,0.26)' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.6 }
const titleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 32 }
const heroTitleStyle: CSSProperties = { margin: '10px 0 0', color: '#F5F7FB', fontSize: 'clamp(34px, 6vw, 62px)', lineHeight: 0.95, letterSpacing: -2.4 }
const mutedTextStyle: CSSProperties = { maxWidth: 720, margin: '16px 0 0', color: '#95A0B8', fontSize: 15, lineHeight: 1.8 }
const heroActionsStyle: CSSProperties = { display: 'flex', gap: 10, flexWrap: 'wrap' }
const ghostButtonStyle: CSSProperties = { minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.035)', color: '#F5F7FB', textDecoration: 'none', fontWeight: 800 }
const primaryLinkStyle: CSSProperties = { ...ghostButtonStyle, background: '#4DA2FF', color: '#02040A', border: '1px solid rgba(77,162,255,0.32)' }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }
const statStyle: CSSProperties = { border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, background: 'rgba(255,255,255,0.035)', padding: 16 }
const statValueStyle: CSSProperties = { display: 'block', color: '#F5F7FB', fontSize: 34, lineHeight: 1, marginTop: 10 }
const mutedSmallStyle: CSSProperties = { margin: '8px 0 0', color: '#95A0B8', fontSize: 13, lineHeight: 1.55 }
const filterRowStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'end', flexWrap: 'wrap', marginBottom: 16 }
const sectionTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 24, letterSpacing: -0.7 }
const filterControlsStyle: CSSProperties = { display: 'flex', gap: 10, flexWrap: 'wrap' }
const quickActionsStyle: CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap' }
const inlineButtonStyle: CSSProperties = { minHeight: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.035)', color: '#A9D0FF', textDecoration: 'none', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2 }
const selectStyle: CSSProperties = { minHeight: 42, borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '0 12px' }
const auditGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }
const threeColumnStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }
const issueColumnStyle: CSSProperties = { border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, background: 'rgba(255,255,255,0.035)', padding: 14 }
const columnTitleStyle: CSSProperties = { margin: 0, fontSize: 16, textTransform: 'uppercase', letterSpacing: 1.5 }
const miniIssueStyle: CSSProperties = { display: 'block', textDecoration: 'none', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.18)', padding: 12 }
const miniEmptyStyle: CSSProperties = { borderRadius: 14, border: '1px dashed rgba(255,255,255,0.12)', color: '#95A0B8', padding: 12, fontSize: 13 }
const cardStyle: CSSProperties = { border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20, background: 'rgba(255,255,255,0.035)', padding: 16 }
const cardTopStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }
const pillStyle: CSSProperties = { display: 'inline-flex', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 999, padding: '5px 9px', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.6 }
const scoreStyle: CSSProperties = { color: '#F5F7FB', fontSize: 13, fontWeight: 900 }
const smallCapsStyle: CSSProperties = { margin: '12px 0 0', color: '#A9D0FF', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }
const cardTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 20, lineHeight: 1.2 }
const slugStyle: CSSProperties = { margin: '8px 0 0', color: '#95A0B8', fontSize: 12, wordBreak: 'break-word' }
const issueListStyle: CSSProperties = { margin: '12px 0 0', paddingLeft: 18, color: '#95A0B8', fontSize: 13, lineHeight: 1.65 }
const goodTextStyle: CSSProperties = { margin: '12px 0 0', color: '#2DE2E6', fontSize: 13, lineHeight: 1.6 }
const cardActionsStyle: CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14 }
const inlineLinkStyle: CSSProperties = { color: '#A9D0FF', textDecoration: 'none', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.3 }
const emptyStateStyle: CSSProperties = { border: '1px dashed rgba(255,255,255,0.14)', borderRadius: 18, padding: 18, color: '#95A0B8' }
const errorStyle: CSSProperties = { borderRadius: 18, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: 14 }
