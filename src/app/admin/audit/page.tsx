'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type Locale = 'en' | 'es' | 'ru'
type IssueLevel = 'good' | 'warn' | 'danger'

type ServiceRow = {
  id: string
  locale: Locale
  slug: string
  title: string
  excerpt: string
  intro: string
  seo_title: string | null
  seo_description: string | null
  is_published: boolean
}

type AreaRow = {
  id: string
  locale: Locale
  slug: string
  city: string
  state: string
  title: string
  intro: string
  highlights: string[] | null
  supported_services: string[] | null
  seo_title: string | null
  seo_description: string | null
  is_published: boolean
}

type AuditItem = {
  type: 'service' | 'area'
  locale: Locale
  title: string
  slug: string
  href: string
  previewHref: string
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
  const [typeFilter, setTypeFilter] = useState<'all' | 'service' | 'area'>('all')

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

        const [servicesResult, areasResult] = await Promise.all([
          (supabase.from('services') as any).select('id, locale, slug, title, excerpt, intro, seo_title, seo_description, is_published').order('locale', { ascending: true }),
          (supabase.from('areas') as any).select('id, locale, slug, city, state, title, intro, highlights, supported_services, seo_title, seo_description, is_published').order('locale', { ascending: true }),
        ])

        if (servicesResult.error) throw new Error(servicesResult.error.message)
        if (areasResult.error) throw new Error(areasResult.error.message)

        const services = Array.isArray(servicesResult.data) ? servicesResult.data as ServiceRow[] : []
        const areas = Array.isArray(areasResult.data) ? areasResult.data as AreaRow[] : []
        const nextItems = [...services.map(auditService), ...areas.map(auditArea)].sort((a, b) => a.score - b.score)

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
    return () => { mounted = false }
  }, [router, supabase])

  const filteredItems = items.filter((item) => {
    const levelOk = filter === 'all' || item.level === filter
    const typeOk = typeFilter === 'all' || item.type === typeFilter
    return levelOk && typeOk
  })

  const stats = {
    total: items.length,
    good: items.filter((item) => item.level === 'good').length,
    warn: items.filter((item) => item.level === 'warn').length,
    danger: items.filter((item) => item.level === 'danger').length,
  }

  if (isBooting) {
    return <div style={pageStyle}><div style={panelStyle}><p style={eyebrowStyle}>Audit center</p><h1 style={titleStyle}>Loading content audit...</h1></div></div>
  }

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Planetlocksmiths / Admin / Audit</p>
          <h1 style={heroTitleStyle}>Content Audit Center</h1>
          <p style={mutedTextStyle}>Checks service and area landing pages for SEO, Ads-readiness, useful customer information, and publish quality.</p>
        </div>
        <div style={heroActionsStyle}>
          <a href="/admin/direct" style={ghostButtonStyle}>Dashboard</a>
          <a href="/en" target="_blank" rel="noreferrer" style={primaryLinkStyle}>View site</a>
        </div>
      </section>

      {errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null}

      <div style={statsGridStyle}>
        <Stat title="Audited pages" value={String(stats.total)} note="Services + areas checked." />
        <Stat title="Good" value={String(stats.good)} note="Ready or close to ready." tone="good" />
        <Stat title="Warnings" value={String(stats.warn)} note="Needs improvement." tone="warn" />
        <Stat title="Critical" value={String(stats.danger)} note="Fix before Ads push." tone="danger" />
      </div>

      <section style={panelStyle}>
        <div style={filterRowStyle}>
          <div>
            <p style={eyebrowStyle}>Landing page checks</p>
            <h2 style={sectionTitleStyle}>Page-level issues</h2>
          </div>
          <div style={filterControlsStyle}>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} style={selectStyle}>
              <option value="all">All types</option>
              <option value="service">Services</option>
              <option value="area">Areas</option>
            </select>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} style={selectStyle}>
              <option value="all">All statuses</option>
              <option value="danger">Critical</option>
              <option value="warn">Warnings</option>
              <option value="good">Good</option>
            </select>
          </div>
        </div>

        <div style={auditGridStyle}>
          {filteredItems.map((item) => <AuditCard key={`${item.type}-${item.locale}-${item.slug || item.title}`} item={item} />)}
          {!filteredItems.length ? <div style={emptyStateStyle}>No pages match the selected filters.</div> : null}
        </div>
      </section>
    </div>
  )
}

function auditService(row: ServiceRow): AuditItem {
  const issues: string[] = []
  if (!row.is_published) issues.push('Draft: page is not published')
  if (!row.slug?.trim()) issues.push('Missing slug')
  if (!row.title?.trim()) issues.push('Missing title')
  if ((row.excerpt || '').trim().length < 80) issues.push('Excerpt is too short for a clear service card')
  if ((row.intro || '').trim().length < 350) issues.push('Intro should be longer: explain service, vehicle info, pricing factors, limits, and next steps')
  if (!(row.seo_title || '').trim()) issues.push('Missing SEO title')
  if ((row.seo_description || '').trim().length < 120) issues.push('SEO description is missing or too short')

  return makeAuditItem({
    type: 'service',
    locale: row.locale,
    title: row.title || row.slug || 'Untitled service',
    slug: row.slug || '',
    href: '/admin/services',
    previewHref: `/${row.locale}/services/${row.slug}`,
    issues,
  })
}

function auditArea(row: AreaRow): AuditItem {
  const issues: string[] = []
  const highlights = Array.isArray(row.highlights) ? row.highlights : []
  const supported = Array.isArray(row.supported_services) ? row.supported_services : []

  if (!row.is_published) issues.push('Draft: page is not published')
  if (!row.slug?.trim()) issues.push('Missing slug')
  if (!row.city?.trim()) issues.push('Missing city')
  if (!row.title?.trim()) issues.push('Missing title')
  if ((row.intro || '').trim().length < 300) issues.push('Intro should explain local coverage, service availability, and customer preparation')
  if (highlights.length < 3) issues.push('Add at least 3 area highlights')
  if (supported.length < 4) issues.push('Add at least 4 supported services')
  if (!(row.seo_title || '').trim()) issues.push('Missing SEO title')
  if ((row.seo_description || '').trim().length < 120) issues.push('SEO description is missing or too short')

  return makeAuditItem({
    type: 'area',
    locale: row.locale,
    title: row.title || row.city || row.slug || 'Untitled area',
    slug: row.slug || '',
    href: '/admin/areas',
    previewHref: `/${row.locale}/areas/${row.slug}`,
    issues,
  })
}

function makeAuditItem(input: Omit<AuditItem, 'score' | 'level'> & { issues: string[] }): AuditItem {
  const score = Math.max(0, 100 - input.issues.length * 14)
  const level: IssueLevel = input.issues.length === 0 ? 'good' : input.issues.length <= 3 ? 'warn' : 'danger'
  return { ...input, score, level }
}

function AuditCard({ item }: { item: AuditItem }) {
  const color = item.level === 'good' ? '#2DE2E6' : item.level === 'warn' ? '#D6A85F' : '#FF9A9A'
  return (
    <article style={{ ...cardStyle, borderColor: `${color}55` }}>
      <div style={cardTopStyle}>
        <span style={{ ...pillStyle, color, borderColor: `${color}55`, background: `${color}14` }}>{item.level}</span>
        <span style={scoreStyle}>{item.score}/100</span>
      </div>
      <p style={smallCapsStyle}>{item.type} · {item.locale.toUpperCase()}</p>
      <h3 style={cardTitleStyle}>{item.title}</h3>
      {item.slug ? <p style={slugStyle}>/{item.locale}/{item.type === 'service' ? 'services' : 'areas'}/{item.slug}</p> : null}
      {item.issues.length ? (
        <ul style={issueListStyle}>{item.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
      ) : <p style={goodTextStyle}>No obvious content issues found.</p>}
      <div style={cardActionsStyle}>
        <a href={item.href} style={inlineLinkStyle}>Edit content →</a>
        {item.slug ? <a href={item.previewHref} target="_blank" rel="noreferrer" style={inlineLinkStyle}>Preview →</a> : null}
      </div>
    </article>
  )
}

function Stat({ title, value, note, tone = 'neutral' }: { title: string; value: string; note: string; tone?: 'neutral' | IssueLevel }) {
  const color = tone === 'good' ? '#2DE2E6' : tone === 'warn' ? '#D6A85F' : tone === 'danger' ? '#FF9A9A' : '#A9D0FF'
  return <div style={{ ...statStyle, borderColor: `${color}44` }}><p style={{ ...smallCapsStyle, color }}>{title}</p><strong style={statValueStyle}>{value}</strong><p style={mutedSmallStyle}>{note}</p></div>
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
const selectStyle: CSSProperties = { minHeight: 42, borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '0 12px' }
const auditGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }
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
