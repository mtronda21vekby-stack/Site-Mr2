'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'

type Locale = 'en' | 'es' | 'ru'
type PublishFilter = 'all' | 'published' | 'draft'

type ContentBlockRow = {
  id: string
  locale: Locale
  pageKey: string
  slot: string
  eyebrow: string
  title: string
  body: string
  itemsText: string
  ctaLabel: string
  ctaHref: string
  sortOrder: number
  isPublished: boolean
}

const locales: Locale[] = ['en', 'es', 'ru']
const FORM_ID = 'admin-content-blocks-form'

function createEmptyRow(locale: Locale, sortOrder = 0): ContentBlockRow {
  return {
    id: '',
    locale,
    pageKey: 'home',
    slot: 'section',
    eyebrow: '',
    title: '',
    body: '',
    itemsText: '',
    ctaLabel: '',
    ctaHref: '',
    sortOrder,
    isPublished: true,
  }
}

export default function AdminContentBlocksPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])

  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [rowsByLocale, setRowsByLocale] = useState<Record<Locale, ContentBlockRow[]>>({ en: [], es: [], ru: [] })
  const [isBooting, setIsBooting] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [publishFilter, setPublishFilter] = useState<PublishFilter>('all')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function boot() {
      try {
        setErrorMessage('')
        setSuccessMessage('')

        const sessionResult = await supabase.auth.getSession()
        const session = sessionResult?.data?.session

        if (!session) {
          router.replace('/admin/login')
          return
        }

        const result = await (supabase.from('site_content_blocks') as any)
          .select('id, locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, sort_order, is_published')
          .order('sort_order', { ascending: true })

        if (result.error) throw new Error(result.error.message)

        const nextRows: Record<Locale, ContentBlockRow[]> = { en: [], es: [], ru: [] }
        const rows = Array.isArray(result.data) ? result.data : []

        for (const row of rows) {
          const locale = row.locale as Locale
          if (!locales.includes(locale)) continue

          nextRows[locale].push({
            id: row.id ?? '',
            locale,
            pageKey: row.page_key ?? 'home',
            slot: row.slot ?? 'section',
            eyebrow: row.eyebrow ?? '',
            title: row.title ?? '',
            body: row.body ?? '',
            itemsText: Array.isArray(row.items) ? row.items.join('\n') : '',
            ctaLabel: row.cta_label ?? '',
            ctaHref: row.cta_href ?? '',
            sortOrder: Number(row.sort_order ?? 0),
            isPublished: Boolean(row.is_published ?? true),
          })
        }

        if (!mounted) return
        setRowsByLocale(nextRows)
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load content blocks')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => { mounted = false }
  }, [router, supabase])

  function updateRow(index: number, patch: Partial<ContentBlockRow>) {
    setRowsByLocale((prev) => {
      const copy = [...prev[activeLocale]]
      copy[index] = { ...copy[index], ...patch }
      return { ...prev, [activeLocale]: copy }
    })
  }

  function addRow() {
    setRowsByLocale((prev) => {
      const current = prev[activeLocale]
      const maxSort = current.length ? Math.max(...current.map((item) => item.sortOrder)) : -1
      return { ...prev, [activeLocale]: [...current, createEmptyRow(activeLocale, maxSort + 1)] }
    })
  }

  async function deleteRow(index: number) {
    setErrorMessage('')
    setSuccessMessage('')

    const row = rowsByLocale[activeLocale][index]
    if (!row) return

    if (!row.id) {
      setRowsByLocale((prev) => {
        const copy = [...prev[activeLocale]]
        copy.splice(index, 1)
        return { ...prev, [activeLocale]: copy }
      })
      setSuccessMessage('Unsaved block removed from form')
      return
    }

    const ok = window.confirm('Delete this content block permanently?')
    if (!ok) return

    setDeletingId(row.id)

    try {
      const result = await (supabase.from('site_content_blocks') as any).delete().eq('id', row.id)
      if (result.error) throw new Error(result.error.message)

      setRowsByLocale((prev) => {
        const copy = [...prev[activeLocale]]
        copy.splice(index, 1)
        return { ...prev, [activeLocale]: copy }
      })
      setSuccessMessage('Content block deleted')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete content block')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSaving(true)

    try {
      const currentRows = rowsByLocale[activeLocale]

      for (const row of currentRows) {
        const pageKey = row.pageKey.trim()
        const slot = row.slot.trim()
        const title = row.title.trim()
        const body = row.body.trim()
        const eyebrow = row.eyebrow.trim()
        const ctaLabel = row.ctaLabel.trim()
        const ctaHref = row.ctaHref.trim()

        if (!pageKey) throw new Error('Page Key is required.')
        if (!slot) throw new Error('Slot is required.')
        if (row.isPublished && !title && !body && !eyebrow && !row.itemsText.trim()) {
          throw new Error('Published content blocks must contain at least title, body, eyebrow, or items.')
        }

        const payload = {
          locale: row.locale,
          page_key: pageKey,
          slot,
          eyebrow: eyebrow || null,
          title: title || null,
          body: body || null,
          items: row.itemsText.split('\n').map((item) => item.trim()).filter(Boolean),
          cta_label: ctaLabel || null,
          cta_href: ctaHref || null,
          sort_order: Number(row.sortOrder || 0),
          is_published: row.isPublished,
        }

        if (row.id) {
          const result = await (supabase.from('site_content_blocks') as any).update(payload).eq('id', row.id)
          if (result.error) throw new Error(result.error.message)
        } else {
          const result = await (supabase.from('site_content_blocks') as any).insert(payload).select('id').single()
          if (result.error) throw new Error(result.error.message)
          row.id = result.data?.id ?? ''
        }
      }

      setSuccessMessage(`Content blocks saved for ${activeLocale.toUpperCase()}`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save content blocks')
    } finally {
      setIsSaving(false)
    }
  }

  const currentRows = rowsByLocale[activeLocale]
  const filteredRows = currentRows.filter((row) => {
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || row.pageKey.toLowerCase().includes(q) || row.slot.toLowerCase().includes(q) || row.title.toLowerCase().includes(q) || row.body.toLowerCase().includes(q)
    const matchesPublish = publishFilter === 'all' ? true : publishFilter === 'published' ? row.isPublished : !row.isPublished
    return matchesSearch && matchesPublish
  })

  if (isBooting) return <div style={{ paddingTop: 20 }}><p style={{ color: '#95A0B8', margin: 0 }}>Loading content blocks...</p></div>

  return (
    <div>
      <HeaderBlock breadcrumb="Planetlocksmiths / Admin / Content Blocks" title="Content Blocks" activeLocale={activeLocale} onLocaleChange={(locale) => { setSuccessMessage(''); setErrorMessage(''); setActiveLocale(locale) }} previewHref={`/${activeLocale}`} extraButton={<button type="button" onClick={addRow} style={ghostButtonStyle}>+ Add block</button>} />

      <div style={guideStyle}>
        Content Blocks are reusable editable sections. Use page_key like home, services, areas, service-detail, area-detail. Use slot like service-depth, customer-info, process, pricing, footer, legal, or custom.
      </div>

      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search page key, slot, title, body" filterValue={publishFilter} onFilterChange={(value) => setPublishFilter(value as PublishFilter)} filterOptions={[{ value: 'all', label: 'All blocks' }, { value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]} />

      {errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}
      {successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}

      <form id={FORM_ID} onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>
        {filteredRows.map((row) => {
          const realIndex = currentRows.indexOf(row)
          return (
            <div key={row.id || `${row.locale}-${realIndex}`} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div>
                  <strong style={{ fontSize: 18 }}>Block #{realIndex + 1}</strong>
                  <p style={{ margin: '6px 0 0', color: '#95A0B8', fontSize: 13 }}>{row.pageKey} / {row.slot}</p>
                </div>
                <button type="button" onClick={() => deleteRow(realIndex)} disabled={deletingId === row.id} style={dangerGhostButtonStyle}>{deletingId === row.id ? 'Deleting...' : 'Delete'}</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <Field label="Page Key" value={row.pageKey} onChange={(value) => updateRow(realIndex, { pageKey: value })} />
                <Field label="Slot" value={row.slot} onChange={(value) => updateRow(realIndex, { slot: value })} />
                <Field label="Sort Order" value={String(row.sortOrder)} onChange={(value) => updateRow(realIndex, { sortOrder: Number(value || 0) })} />
              </div>

              <Field label="Eyebrow" value={row.eyebrow} onChange={(value) => updateRow(realIndex, { eyebrow: value })} />
              <Field label="Title" value={row.title} onChange={(value) => updateRow(realIndex, { title: value })} />
              <TextAreaField label="Body" value={row.body} onChange={(value) => updateRow(realIndex, { body: value })} />
              <TextAreaField label="Items (one per line)" value={row.itemsText} onChange={(value) => updateRow(realIndex, { itemsText: value })} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <Field label="CTA Label" value={row.ctaLabel} onChange={(value) => updateRow(realIndex, { ctaLabel: value })} />
                <Field label="CTA Href" value={row.ctaHref} onChange={(value) => updateRow(realIndex, { ctaHref: value })} />
              </div>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}><input type="checkbox" checked={row.isPublished} onChange={(event) => updateRow(realIndex, { isPublished: event.target.checked })} /><span>Published</span></label>
            </div>
          )
        })}
        {!filteredRows.length ? <div style={emptyStateStyle}>No content blocks match the current filters.</div> : null}
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label={`Save ${activeLocale.toUpperCase()} Blocks`} note={`Content blocks for ${activeLocale.toUpperCase()} stay ready at the bottom while you scroll.`} />
    </div>
  )
}

function HeaderBlock({ breadcrumb, title, activeLocale, onLocaleChange, previewHref, extraButton }: { breadcrumb: string; title: string; activeLocale: Locale; onLocaleChange: (locale: Locale) => void; previewHref?: string; extraButton?: ReactNode }) {
  return <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}><div><p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>{breadcrumb}</p><h2 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.1 }}>{title}</h2></div><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{locales.map((locale) => <button key={locale} type="button" onClick={() => onLocaleChange(locale)} style={{ minHeight: 42, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: activeLocale === locale ? '#4DA2FF' : '#11192E', color: activeLocale === locale ? '#05070B' : '#F5F7FB', fontWeight: 700, cursor: 'pointer' }}>{locale.toUpperCase()}</button>)}{previewHref ? <a href={previewHref} target="_blank" rel="noreferrer" style={ghostLinkStyle}>Preview</a> : null}{extraButton}</div></div>
}

function FilterBar({ search, onSearchChange, searchPlaceholder, filterValue, onFilterChange, filterOptions }: { search: string; onSearchChange: (value: string) => void; searchPlaceholder: string; filterValue: string; onFilterChange: (value: string) => void; filterOptions: Array<{ value: string; label: string }> }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 16 }}><input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} style={inputStyle} /><select value={filterValue} onChange={(e) => onFilterChange(e.target.value)} style={inputStyle}>{filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label style={{ display: 'grid', gap: 8 }}><span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} /></label> }
function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label style={{ display: 'grid', gap: 8 }}><span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} style={textAreaStyle} /></label> }
function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) { const isError = type === 'error'; return <div style={{ borderRadius: 12, border: isError ? '1px solid rgba(255,122,122,0.25)' : '1px solid rgba(77,162,255,0.25)', background: isError ? 'rgba(255,122,122,0.08)' : 'rgba(77,162,255,0.08)', color: isError ? '#FF9A9A' : '#A9D0FF', padding: '12px 14px', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>{children}</div> }

const inputStyle: CSSProperties = { width: '100%', minHeight: 48, borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const textAreaStyle: CSSProperties = { width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '12px 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', resize: 'vertical', WebkitAppearance: 'none' }
const cardStyle: CSSProperties = { display: 'grid', gap: 12, background: '#0B1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18 }
const cardHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
const ghostButtonStyle: CSSProperties = { minHeight: 42, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', fontWeight: 700, cursor: 'pointer' }
const dangerGhostButtonStyle: CSSProperties = { minHeight: 38, padding: '0 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.10)', background: 'transparent', color: '#FF9A9A', cursor: 'pointer' }
const ghostLinkStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 42, padding: '0 14px', borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', fontWeight: 700 }
const emptyStateStyle: CSSProperties = { background: '#0B1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, color: '#95A0B8' }
const guideStyle: CSSProperties = { marginBottom: 16, borderRadius: 16, border: '1px solid rgba(77,162,255,0.20)', background: 'rgba(77,162,255,0.08)', color: '#A9D0FF', padding: 14, fontSize: 14, lineHeight: 1.6 }
