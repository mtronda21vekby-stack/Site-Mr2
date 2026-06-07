'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'
import { getDefaultAreas } from '@/lib/site-defaults'
import { getSupabaseClient } from '@/lib/supabase/client'

type Locale = 'en' | 'es' | 'ru'

type AreaRow = {
  id: string
  locale: Locale
  slug: string
  city: string
  state: string
  title: string
  intro: string
  highlightsText: string
  supportedServicesText: string
  seoTitle: string
  seoDescription: string
  sortOrder: number
  isPublished: boolean
}

const locales: Locale[] = ['en', 'es', 'ru']
const FORM_ID = 'admin-areas-form'
const labels: Record<Locale, string> = { en: 'English', es: 'Español', ru: 'Русский' }

function blank(locale: Locale, sortOrder = 0): AreaRow {
  return {
    id: '',
    locale,
    slug: '',
    city: '',
    state: '',
    title: '',
    intro: '',
    highlightsText: '',
    supportedServicesText: '',
    seoTitle: '',
    seoDescription: '',
    sortOrder,
    isPublished: true,
  }
}

function presets(locale: Locale): AreaRow[] {
  return getDefaultAreas(locale).map((area, index) => ({
    id: '',
    locale,
    slug: area.slug,
    city: area.city,
    state: area.state,
    title: area.title,
    intro: area.intro,
    highlightsText: area.highlights.join('\n'),
    supportedServicesText: area.supportedServices.join('\n'),
    seoTitle: area.seoTitle,
    seoDescription: area.seoDescription,
    sortOrder: index,
    isPublished: true,
  }))
}

function presetSlugs(locale: Locale) {
  return new Set(getDefaultAreas(locale).map((area) => area.slug))
}

function mergeWithPresets(locale: Locale, rows: AreaRow[]) {
  const bySlug = new Map<string, AreaRow>()
  for (const row of rows) {
    const slug = row.slug.trim()
    if (slug && !bySlug.has(slug)) bySlug.set(slug, row)
  }
  const presetRows = presets(locale)
  const slugs = presetSlugs(locale)
  const customRows = rows.filter((row) => row.slug.trim() && !slugs.has(row.slug.trim()))
  return [...presetRows.map((row) => bySlug.get(row.slug) ?? row), ...customRows].sort((a, b) => a.sortOrder - b.sortOrder)
}

export default function AdminAreasPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [rowsByLocale, setRowsByLocale] = useState<Record<Locale, AreaRow[]>>({
    en: presets('en'),
    es: presets('es'),
    ru: presets('ru'),
  })
  const [isBooting, setIsBooting] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function boot() {
      try {
        const sessionResult = await supabase.auth.getSession()
        if (!sessionResult?.data?.session) {
          router.replace('/admin/login')
          return
        }

        const result = await (supabase.from('areas') as any)
          .select('id, locale, slug, city, state, title, intro, highlights, supported_services, seo_title, seo_description, sort_order, is_published')
          .order('sort_order', { ascending: true })

        if (result.error) throw new Error(result.error.message)

        const nextRows: Record<Locale, AreaRow[]> = { en: [], es: [], ru: [] }
        for (const row of Array.isArray(result.data) ? result.data : []) {
          const locale = row.locale as Locale
          if (!locales.includes(locale)) continue
          nextRows[locale].push({
            id: row.id ?? '',
            locale,
            slug: row.slug ?? '',
            city: row.city ?? '',
            state: row.state ?? '',
            title: row.title ?? '',
            intro: row.intro ?? '',
            highlightsText: Array.isArray(row.highlights) ? row.highlights.join('\n') : '',
            supportedServicesText: Array.isArray(row.supported_services) ? row.supported_services.join('\n') : '',
            seoTitle: row.seo_title ?? '',
            seoDescription: row.seo_description ?? '',
            sortOrder: Number(row.sort_order ?? 0),
            isPublished: Boolean(row.is_published ?? true),
          })
        }

        for (const locale of locales) nextRows[locale] = mergeWithPresets(locale, nextRows[locale])
        if (mounted) setRowsByLocale(nextRows)
      } catch (error) {
        if (mounted) setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить города')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => { mounted = false }
  }, [router, supabase])

  function setRow(index: number, patch: Partial<AreaRow>) {
    setRowsByLocale((previous) => {
      const rows = [...previous[activeLocale]]
      rows[index] = { ...rows[index], ...patch }
      return { ...previous, [activeLocale]: rows }
    })
  }

  function addRow() {
    setRowsByLocale((previous) => {
      const rows = previous[activeLocale]
      const sortOrder = rows.length ? Math.max(...rows.map((row) => row.sortOrder)) + 1 : 0
      return { ...previous, [activeLocale]: [...rows, blank(activeLocale, sortOrder)] }
    })
  }

  async function deleteRow(index: number) {
    const row = rowsByLocale[activeLocale][index]
    if (!row) return
    setErrorMessage('')
    setSuccessMessage('')

    if (!row.id) {
      if (presetSlugs(row.locale).has(row.slug)) {
        setRow(index, { isPublished: false })
        setSuccessMessage('Preset-город переведён в черновик. Сохрани форму, чтобы скрыть его на сайте.')
        return
      }
      setRowsByLocale((previous) => {
        const rows = [...previous[activeLocale]]
        rows.splice(index, 1)
        return { ...previous, [activeLocale]: rows }
      })
      setSuccessMessage('Город удалён из формы')
      return
    }

    if (!window.confirm('Удалить этот город навсегда?')) return
    const result = await (supabase.from('areas') as any).delete().eq('id', row.id)
    if (result.error) {
      setErrorMessage(result.error.message)
      return
    }
    setRowsByLocale((previous) => ({ ...previous, [activeLocale]: previous[activeLocale].filter((item) => item.id !== row.id) }))
    setSuccessMessage('Город удалён')
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      for (const row of rowsByLocale[activeLocale]) {
        const highlights = row.highlightsText.split('\n').map((item) => item.trim()).filter(Boolean)
        const supportedServices = row.supportedServicesText.split('\n').map((item) => item.trim()).filter(Boolean)
        const payload = {
          locale: row.locale,
          slug: row.slug.trim(),
          city: row.city.trim(),
          state: row.state.trim(),
          title: row.title.trim(),
          intro: row.intro.trim(),
          highlights,
          supported_services: supportedServices,
          seo_title: row.seoTitle.trim() || null,
          seo_description: row.seoDescription.trim() || null,
          sort_order: Number(row.sortOrder || 0),
          is_published: row.isPublished,
        }

        if (!payload.slug && !payload.city && !payload.title) continue
        if (!payload.slug) throw new Error('Для города нужен slug')

        const result = row.id
          ? await (supabase.from('areas') as any).update(payload).eq('id', row.id)
          : await (supabase.from('areas') as any).insert(payload).select('id').single()
        if (result.error) throw new Error(result.error.message)
        if (!row.id) row.id = result.data?.id ?? ''
      }

      setSuccessMessage(`Города сохранены: ${labels[activeLocale]}`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось сохранить города')
    } finally {
      setIsSaving(false)
    }
  }

  const rows = rowsByLocale[activeLocale]

  if (isBooting) return <section style={panelStyle}>Загрузка городов...</section>

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Service areas</p>
          <h1 style={titleStyle}>Areas CMS</h1>
          <p style={mutedStyle}>Production preset уже даёт Philadelphia coverage. Сохрани строки, чтобы управлять городами, SEO, услугами и публикацией из Supabase.</p>
        </div>
        <div style={actionsStyle}>
          {locales.map((locale) => (
            <button key={locale} type="button" onClick={() => setActiveLocale(locale)} style={tabStyle(activeLocale === locale)}>{locale.toUpperCase()}</button>
          ))}
          <button type="button" onClick={addRow} style={buttonStyle}>+ город</button>
        </div>
      </header>

      {errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null}
      {successMessage ? <div style={successStyle}>{successMessage}</div> : null}

      <form id={FORM_ID} onSubmit={save} style={listStyle}>
        {rows.map((row, index) => (
          <article key={row.id || `${row.locale}-${row.slug}-${index}`} style={cardStyle}>
            <div style={cardHeaderStyle}>
              <strong>#{index + 1} {row.city || row.slug || 'Новый город'}</strong>
              <label style={checkStyle}><input type="checkbox" checked={row.isPublished} onChange={(event) => setRow(index, { isPublished: event.target.checked })} /> published</label>
            </div>
            <div style={gridStyle}>
              <Field label="Slug" value={row.slug} onChange={(value) => setRow(index, { slug: value })} />
              <Field label="City" value={row.city} onChange={(value) => setRow(index, { city: value })} />
              <Field label="State" value={row.state} onChange={(value) => setRow(index, { state: value })} />
              <Field label="Title" value={row.title} onChange={(value) => setRow(index, { title: value })} />
              <Field label="SEO title" value={row.seoTitle} onChange={(value) => setRow(index, { seoTitle: value })} />
              <Field label="Порядок" value={String(row.sortOrder)} onChange={(value) => setRow(index, { sortOrder: Number(value || 0) })} />
            </div>
            <TextField label="Intro" value={row.intro} onChange={(value) => setRow(index, { intro: value })} />
            <TextField label="Highlights, по одному в строке" value={row.highlightsText} onChange={(value) => setRow(index, { highlightsText: value })} />
            <TextField label="Supported services, по одному в строке" value={row.supportedServicesText} onChange={(value) => setRow(index, { supportedServicesText: value })} />
            <TextField label="SEO description" value={row.seoDescription} onChange={(value) => setRow(index, { seoDescription: value })} />
            <button type="button" onClick={() => deleteRow(index)} style={dangerStyle}>Удалить</button>
          </article>
        ))}
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label="Сохранить города" note={`Язык: ${labels[activeLocale]}. Published города доступны на публичном сайте.`} />
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} />
    </label>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} style={textareaStyle} />
    </label>
  )
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0 }
const panelStyle: CSSProperties = {
  border: '1px solid rgba(255,255,255,.12)',
  borderRadius: 22,
  padding: 20,
  color: '#F5F7FB',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.052), rgba(255,255,255,0.022)), rgba(255,255,255,0.018)',
  boxShadow: '0 18px 54px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.055)',
}
const headerStyle: CSSProperties = { ...panelStyle, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#D6A85F', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }
const titleStyle: CSSProperties = { margin: '6px 0 0', color: '#F5F7FB', fontSize: 42, lineHeight: 1 }
const mutedStyle: CSSProperties = { margin: '10px 0 0', color: '#95A0B8', lineHeight: 1.6, maxWidth: 760 }
const actionsStyle: CSSProperties = { display: 'flex', gap: 10, flexWrap: 'wrap' }
const buttonStyle: CSSProperties = { minHeight: 42, borderRadius: 999, border: '1px solid rgba(245,247,251,.24)', background: '#F5F7FB', color: '#02040A', fontWeight: 900, padding: '0 16px' }
const dangerStyle: CSSProperties = { ...buttonStyle, background: 'rgba(255,122,122,.08)', color: '#FF9A9A', borderColor: 'rgba(255,122,122,.3)', justifySelf: 'start' }
const tabStyle = (active: boolean): CSSProperties => ({ ...buttonStyle, background: active ? 'rgba(214,168,95,.12)' : 'rgba(255,255,255,.04)', color: active ? '#D6A85F' : '#F5F7FB', borderColor: active ? 'rgba(214,168,95,.42)' : 'rgba(255,255,255,.12)' })
const listStyle: CSSProperties = { display: 'grid', gap: 14 }
const cardStyle: CSSProperties = { ...panelStyle, display: 'grid', gap: 14, background: 'rgba(255,255,255,.028)' }
const cardHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', color: '#F5F7FB' }
const gridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }
const fieldStyle: CSSProperties = { display: 'grid', gap: 6, minWidth: 0 }
const labelStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, fontWeight: 800 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 46, boxSizing: 'border-box', borderRadius: 14, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(7,11,20,.82)', color: '#F5F7FB', padding: '0 12px' }
const textareaStyle: CSSProperties = { ...inputStyle, minHeight: 110, padding: 12, resize: 'vertical' }
const checkStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, color: '#F5F7FB', fontWeight: 800 }
const errorStyle: CSSProperties = { ...panelStyle, color: '#FF9A9A', borderColor: 'rgba(255,122,122,.3)' }
const successStyle: CSSProperties = { ...panelStyle, color: '#D6A85F', borderColor: 'rgba(214,168,95,.28)' }
