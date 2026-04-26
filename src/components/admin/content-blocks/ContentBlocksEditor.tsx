'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'
import { getSupabaseClient } from '@/lib/supabase/client'
import {
  adminContentBlockKnownPageKeys,
  adminContentBlockPresetGroups,
  adminContentBlockPresets,
} from '@/lib/admin/content-block-presets'
import type {
  AdminContentBlockLocale,
  AdminContentBlockPreset,
  AdminContentBlockPublishFilter,
  AdminContentBlockRow,
} from '@/lib/admin/content-block-types'

const locales: AdminContentBlockLocale[] = ['en', 'es']
const FORM_ID = 'admin-content-blocks-form'

type BlockHealth = {
  label: string
  tone: 'good' | 'warn' | 'danger'
  notes: string[]
}

function createEmptyRow(locale: AdminContentBlockLocale, sortOrder = 0): AdminContentBlockRow {
  return { id: '', locale, pageKey: 'home', slot: 'section', eyebrow: '', title: '', body: '', itemsText: '', ctaLabel: '', ctaHref: '', sortOrder, isPublished: true }
}

function createPresetRow(locale: AdminContentBlockLocale, preset: AdminContentBlockPreset, sortOrder: number): AdminContentBlockRow {
  return { id: '', locale, pageKey: preset.pageKey, slot: preset.slot, eyebrow: preset.eyebrow ?? '', title: preset.title ?? '', body: preset.body ?? '', itemsText: preset.itemsText ?? '', ctaLabel: preset.ctaLabel ?? '', ctaHref: preset.ctaHref?.replace('/en/', `/${locale}/`) ?? '', sortOrder, isPublished: true }
}

function getBlockHealth(row: AdminContentBlockRow): BlockHealth {
  const notes: string[] = []
  const hasContent = Boolean(row.eyebrow.trim() || row.title.trim() || row.body.trim() || row.itemsText.trim() || row.ctaLabel.trim())
  if (!row.pageKey.trim()) notes.push('Missing page key')
  if (!row.slot.trim()) notes.push('Missing module slot')
  if (row.isPublished && !hasContent) notes.push('Published block has no content')
  if (row.ctaLabel.trim() && !row.ctaHref.trim()) notes.push('Button label exists but button link is empty')
  if (row.ctaHref.trim() && !row.ctaLabel.trim()) notes.push('Button link exists but button label is empty')
  if (!notes.length) return { label: 'Ready', tone: 'good', notes: ['Ready to publish'] }
  return { label: notes.some((note) => note.includes('Missing') || note.includes('no content')) ? 'Needs fix' : 'Review', tone: notes.some((note) => note.includes('Missing') || note.includes('no content')) ? 'danger' : 'warn', notes }
}

export default function ContentBlocksEditor() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseClient() as any, [])
  const [activeLocale, setActiveLocale] = useState<AdminContentBlockLocale>('en')
  const [rowsByLocale, setRowsByLocale] = useState<Record<AdminContentBlockLocale, AdminContentBlockRow[]>>({ en: [], es: [] })
  const [isBooting, setIsBooting] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [pageKeyFilter, setPageKeyFilter] = useState('all')
  const [publishFilter, setPublishFilter] = useState<AdminContentBlockPublishFilter>('all')
  const [selectedGroup, setSelectedGroup] = useState(adminContentBlockPresetGroups[0])
  const [selectedPreset, setSelectedPreset] = useState(adminContentBlockPresets[0].label)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const visiblePresets = adminContentBlockPresets.filter((preset) => preset.group === selectedGroup)
  const activePreset = adminContentBlockPresets.find((item) => item.label === selectedPreset) ?? visiblePresets[0] ?? adminContentBlockPresets[0]

  useEffect(() => {
    const firstPreset = adminContentBlockPresets.find((preset) => preset.group === selectedGroup)
    if (firstPreset) setSelectedPreset(firstPreset.label)
  }, [selectedGroup])

  useEffect(() => {
    let mounted = true
    async function boot() {
      try {
        setErrorMessage('')
        setSuccessMessage('')
        const sessionResult = await supabase.auth.getSession()
        if (!sessionResult?.data?.session) { router.replace('/admin/login'); return }
        const result = await supabase.from('site_content_blocks').select('id, locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, sort_order, is_published').order('sort_order', { ascending: true })
        if (result.error) throw new Error(result.error.message)
        const nextRows: Record<AdminContentBlockLocale, AdminContentBlockRow[]> = { en: [], es: [] }
        for (const row of Array.isArray(result.data) ? result.data : []) {
          const locale = row.locale as AdminContentBlockLocale
          if (!locales.includes(locale)) continue
          nextRows[locale].push({ id: row.id ?? '', locale, pageKey: row.page_key ?? 'home', slot: row.slot ?? 'section', eyebrow: row.eyebrow ?? '', title: row.title ?? '', body: row.body ?? '', itemsText: Array.isArray(row.items) ? row.items.join('\n') : '', ctaLabel: row.cta_label ?? '', ctaHref: row.cta_href ?? '', sortOrder: Number(row.sort_order ?? 0), isPublished: Boolean(row.is_published ?? true) })
        }
        if (mounted) setRowsByLocale(nextRows)
      } catch (error) {
        if (mounted) setErrorMessage(error instanceof Error ? error.message : 'Failed to load content blocks')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }
    boot()
    return () => { mounted = false }
  }, [router, supabase])

  function updateRow(index: number, patch: Partial<AdminContentBlockRow>) {
    setRowsByLocale((prev) => { const copy = [...prev[activeLocale]]; copy[index] = { ...copy[index], ...patch }; return { ...prev, [activeLocale]: copy } })
  }

  function addBlankRow() {
    setRowsByLocale((prev) => { const current = prev[activeLocale]; const maxSort = current.length ? Math.max(...current.map((item) => item.sortOrder)) : -1; return { ...prev, [activeLocale]: [...current, createEmptyRow(activeLocale, maxSort + 1)] } })
  }

  function addPresetRow() {
    setRowsByLocale((prev) => { const current = prev[activeLocale]; const maxSort = current.length ? Math.max(...current.map((item) => item.sortOrder)) : -1; return { ...prev, [activeLocale]: [...current, createPresetRow(activeLocale, activePreset, maxSort + 1)] } })
    setSuccessMessage(`Preset added: ${activePreset.label}. Review text and save.`)
  }

  async function deleteRow(index: number) {
    setErrorMessage('')
    setSuccessMessage('')
    const row = rowsByLocale[activeLocale][index]
    if (!row) return
    if (!row.id) {
      setRowsByLocale((prev) => { const copy = [...prev[activeLocale]]; copy.splice(index, 1); return { ...prev, [activeLocale]: copy } })
      setSuccessMessage('Unsaved block removed')
      return
    }
    if (!window.confirm('Delete this content block permanently?')) return
    setDeletingId(row.id)
    try {
      const result = await supabase.from('site_content_blocks').delete().eq('id', row.id)
      if (result.error) throw new Error(result.error.message)
      setRowsByLocale((prev) => { const copy = [...prev[activeLocale]]; copy.splice(index, 1); return { ...prev, [activeLocale]: copy } })
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
      for (const row of rowsByLocale[activeLocale]) {
        const pageKey = row.pageKey.trim()
        const slot = row.slot.trim()
        const title = row.title.trim()
        const body = row.body.trim()
        const eyebrow = row.eyebrow.trim()
        const ctaLabel = row.ctaLabel.trim()
        const ctaHref = row.ctaHref.trim()
        const health = getBlockHealth(row)
        if (!pageKey) throw new Error('Page is required.')
        if (!slot) throw new Error('Module slot is required.')
        if (health.tone === 'danger') throw new Error(`${row.pageKey || 'Block'} / ${row.slot || 'slot'}: ${health.notes[0]}`)
        const payload = { locale: row.locale, page_key: pageKey, slot, eyebrow: eyebrow || null, title: title || null, body: body || null, items: row.itemsText.split('\n').map((item) => item.trim()).filter(Boolean), cta_label: ctaLabel || null, cta_href: ctaHref || null, sort_order: Number(row.sortOrder || 0), is_published: row.isPublished }
        if (row.id) {
          const result = await supabase.from('site_content_blocks').update(payload).eq('id', row.id)
          if (result.error) throw new Error(result.error.message)
        } else {
          const result = await supabase.from('site_content_blocks').insert(payload).select('id').single()
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
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || row.pageKey.toLowerCase().includes(query) || row.slot.toLowerCase().includes(query) || row.title.toLowerCase().includes(query) || row.body.toLowerCase().includes(query)
    const matchesPageKey = pageKeyFilter === 'all' || row.pageKey === pageKeyFilter
    const matchesPublish = publishFilter === 'all' ? true : publishFilter === 'published' ? row.isPublished : !row.isPublished
    return matchesSearch && matchesPageKey && matchesPublish
  })
  const readyCount = currentRows.filter((row) => getBlockHealth(row).tone === 'good').length
  const issueCount = currentRows.filter((row) => getBlockHealth(row).tone !== 'good').length

  if (isBooting) return <div style={{ paddingTop: 20, color: '#95A0B8' }}>Loading content blocks...</div>

  return <div><HeaderBlock activeLocale={activeLocale} readyCount={readyCount} issueCount={issueCount} totalCount={currentRows.length} onLocaleChange={(locale) => { setActiveLocale(locale); setSuccessMessage(''); setErrorMessage('') }} onAddBlank={addBlankRow} /><div style={guideStyle}>Content blocks are connected to shared presets and reusable page modules. Start with a preset, then adjust copy. Phone numbers should stay in Settings unless a block intentionally needs custom text.</div><section style={presetPanelStyle}><div style={fieldGridStyle}><label style={labelStyle}><span>Preset group</span><select value={selectedGroup} onChange={(event) => setSelectedGroup(event.target.value)} style={inputStyle}>{adminContentBlockPresetGroups.map((group) => <option key={group} value={group}>{group}</option>)}</select></label><label style={labelStyle}><span>Preset module</span><select value={selectedPreset} onChange={(event) => setSelectedPreset(event.target.value)} style={inputStyle}>{visiblePresets.map((preset) => <option key={preset.label} value={preset.label}>{preset.label}</option>)}</select></label></div><PresetPreview preset={activePreset} /><button type="button" onClick={addPresetRow} style={primaryButtonStyle}>+ Add selected preset</button></section><div style={filterGridStyle}><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search page, slot, headline, body" style={inputStyle} /><select value={pageKeyFilter} onChange={(event) => setPageKeyFilter(event.target.value)} style={inputStyle}><option value="all">All pages</option>{adminContentBlockKnownPageKeys.map((key) => <option key={key} value={key}>{key}</option>)}</select><select value={publishFilter} onChange={(event) => setPublishFilter(event.target.value as AdminContentBlockPublishFilter)} style={inputStyle}><option value="all">All blocks</option><option value="published">Published</option><option value="draft">Draft</option></select></div>{errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}{successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}<form id={FORM_ID} onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>{filteredRows.map((row) => { const index = currentRows.indexOf(row); return <ContentBlockEditor key={row.id || `${row.locale}-${index}`} row={row} index={index} deletingId={deletingId} onPatch={(patch) => updateRow(index, patch)} onDelete={() => deleteRow(index)} /> })}{!filteredRows.length ? <div style={emptyStateStyle}>No content blocks match the current filters.</div> : null}</form><AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label={`Save ${activeLocale.toUpperCase()} Blocks`} note="Content blocks editor uses shared presets, validation, and preview." /></div>
}

function HeaderBlock({ activeLocale, readyCount, issueCount, totalCount, onLocaleChange, onAddBlank }: { activeLocale: AdminContentBlockLocale; readyCount: number; issueCount: number; totalCount: number; onLocaleChange: (locale: AdminContentBlockLocale) => void; onAddBlank: () => void }) {
  return <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}><div><p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>Planetlocksmiths / Admin / Content Blocks</p><h2 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.1 }}>Content Blocks</h2><div style={summaryRowStyle}><span style={summaryPillStyle}>{totalCount} blocks</span><span style={readyPillStyle}>{readyCount} ready</span><span style={issueCount ? warningPillStyle : summaryPillStyle}>{issueCount} issues</span></div></div><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{locales.map((locale) => <button key={locale} type="button" onClick={() => onLocaleChange(locale)} style={{ ...ghostButtonStyle, background: activeLocale === locale ? '#4DA2FF' : '#11192E', color: activeLocale === locale ? '#05070B' : '#F5F7FB' }}>{locale.toUpperCase()}</button>)}<button type="button" onClick={onAddBlank} style={ghostButtonStyle}>+ Add blank</button></div></div>
}

function PresetPreview({ preset }: { preset: AdminContentBlockPreset }) {
  const items = preset.itemsText?.split('\n').filter(Boolean) ?? []
  return <div style={previewStyle}><p style={previewKickerStyle}>{preset.group} · {preset.usedOn}</p><h3 style={{ margin: '8px 0 0', fontSize: 20 }}>{preset.label}</h3><p style={{ margin: '10px 0 0', color: '#95A0B8', lineHeight: 1.6 }}>{preset.description}</p><p style={{ margin: '10px 0 0', color: '#A9D0FF', fontSize: 13 }}>Fields: {preset.fields}</p><div style={miniCardStyle}>{preset.eyebrow ? <p style={previewKickerStyle}>{preset.eyebrow}</p> : null}{preset.title ? <strong style={{ display: 'block', marginTop: 6 }}>{preset.title}</strong> : null}{preset.body ? <p style={{ margin: '8px 0 0', color: '#95A0B8', lineHeight: 1.5 }}>{preset.body}</p> : null}{items.length ? <ul style={{ margin: '10px 0 0', paddingLeft: 18 }}>{items.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul> : null}</div></div>
}

function ContentBlockEditor({ row, index, deletingId, onPatch, onDelete }: { row: AdminContentBlockRow; index: number; deletingId: string | null; onPatch: (patch: Partial<AdminContentBlockRow>) => void; onDelete: () => void }) {
  const health = getBlockHealth(row)
  return <div style={cardStyle}><div style={cardHeaderStyle}><div><strong style={{ fontSize: 18 }}>Block #{index + 1}</strong><p style={{ margin: '6px 0 0', color: '#95A0B8', fontSize: 13 }}>{row.pageKey || 'No page'} / {row.slot || 'No slot'}</p></div><div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><span style={healthPillStyle(health.tone)}>{health.label}</span><span style={row.isPublished ? readyPillStyle : summaryPillStyle}>{row.isPublished ? 'Published' : 'Draft'}</span><button type="button" onClick={onDelete} disabled={deletingId === row.id} style={dangerGhostButtonStyle}>{deletingId === row.id ? 'Deleting...' : 'Delete'}</button></div></div>{health.tone !== 'good' ? <div style={warningBoxStyle}>{health.notes.map((note) => <div key={note}>• {note}</div>)}</div> : null}<div style={fieldGridStyle}><Field label="Page" value={row.pageKey} onChange={(value) => onPatch({ pageKey: value })} hint="Example: services, contact, area-detail." /><Field label="Module slot" value={row.slot} onChange={(value) => onPatch({ slot: value })} hint="Example: hero, side, section-1, prep." /><Field label="Sort order" value={String(row.sortOrder)} onChange={(value) => onPatch({ sortOrder: Number(value || 0) })} hint="Lower numbers display first where sorting is used." /></div><Field label="Eyebrow / small label" value={row.eyebrow} onChange={(value) => onPatch({ eyebrow: value })} /><Field label="Headline" value={row.title} onChange={(value) => onPatch({ title: value })} /><TextAreaField label="Body copy" value={row.body} onChange={(value) => onPatch({ body: value })} /><TextAreaField label="List items" value={row.itemsText} onChange={(value) => onPatch({ itemsText: value })} hint="One item per line." /><div style={fieldGridStyle}><Field label="Button label" value={row.ctaLabel} onChange={(value) => onPatch({ ctaLabel: value })} /><Field label="Button link" value={row.ctaHref} onChange={(value) => onPatch({ ctaHref: value })} hint="Example: /en/contact#request-service" /></div><ModulePreview row={row} /><label style={{ display: 'flex', gap: 10, alignItems: 'center' }}><input type="checkbox" checked={row.isPublished} onChange={(event) => onPatch({ isPublished: event.target.checked })} /><span>Published</span></label></div>
}

function ModulePreview({ row }: { row: AdminContentBlockRow }) {
  const items = row.itemsText.split('\n').map((item) => item.trim()).filter(Boolean)
  return <div style={miniCardStyle}><p style={previewKickerStyle}>Live preview</p>{row.eyebrow ? <p style={{ ...previewKickerStyle, marginTop: 10 }}>{row.eyebrow}</p> : null}{row.title ? <strong style={{ display: 'block', marginTop: 6 }}>{row.title}</strong> : null}{row.body ? <p style={{ margin: '8px 0 0', color: '#95A0B8', lineHeight: 1.5 }}>{row.body}</p> : null}{items.length ? <ul style={{ margin: '10px 0 0', paddingLeft: 18 }}>{items.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul> : null}{row.ctaLabel ? <p style={{ margin: '10px 0 0', color: '#4DA2FF', fontWeight: 800 }}>{row.ctaLabel}</p> : null}{!row.eyebrow && !row.title && !row.body && !items.length && !row.ctaLabel ? <p style={{ margin: '8px 0 0', color: '#95A0B8' }}>Preview appears here after content is added.</p> : null}</div>
}

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (value: string) => void; hint?: string }) { return <label style={labelStyle}><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} />{hint ? <small style={hintStyle}>{hint}</small> : null}</label> }
function TextAreaField({ label, value, onChange, hint }: { label: string; value: string; onChange: (value: string) => void; hint?: string }) { return <label style={labelStyle}><span>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} style={textAreaStyle} />{hint ? <small style={hintStyle}>{hint}</small> : null}</label> }
function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) { const isError = type === 'error'; return <div style={{ borderRadius: 12, border: isError ? '1px solid rgba(255,122,122,0.25)' : '1px solid rgba(77,162,255,0.25)', background: isError ? 'rgba(255,122,122,0.08)' : 'rgba(77,162,255,0.08)', color: isError ? '#FF9A9A' : '#A9D0FF', padding: '12px 14px', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>{children}</div> }

function healthPillStyle(tone: BlockHealth['tone']): CSSProperties { return tone === 'good' ? readyPillStyle : tone === 'warn' ? warningPillStyle : dangerPillStyle }

const labelStyle: CSSProperties = { display: 'grid', gap: 8, color: '#95A0B8', fontSize: 14 }
const hintStyle: CSSProperties = { color: '#68738E', lineHeight: 1.45 }
const fieldGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }
const filterGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12, marginBottom: 16 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 48, borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const textAreaStyle: CSSProperties = { width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '12px 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', resize: 'vertical', WebkitAppearance: 'none' }
const cardStyle: CSSProperties = { display: 'grid', gap: 12, background: '#0B1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18 }
const cardHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
const presetPanelStyle: CSSProperties = { display: 'grid', gap: 14, background: '#0B1020', border: '1px solid rgba(77,162,255,0.18)', borderRadius: 20, padding: 16, marginBottom: 16 }
const previewStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)', padding: 14 }
const miniCardStyle: CSSProperties = { marginTop: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)', padding: 14 }
const previewKickerStyle: CSSProperties = { margin: 0, color: '#4DA2FF', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em' }
const primaryButtonStyle: CSSProperties = { minHeight: 48, padding: '0 16px', borderRadius: 12, border: '0', background: '#4DA2FF', color: '#05070B', fontWeight: 800, cursor: 'pointer' }
const ghostButtonStyle: CSSProperties = { minHeight: 42, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', fontWeight: 700, cursor: 'pointer' }
const dangerGhostButtonStyle: CSSProperties = { minHeight: 38, padding: '0 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.10)', background: 'transparent', color: '#FF9A9A', cursor: 'pointer' }
const emptyStateStyle: CSSProperties = { background: '#0B1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, color: '#95A0B8' }
const guideStyle: CSSProperties = { marginBottom: 16, borderRadius: 16, border: '1px solid rgba(77,162,255,0.20)', background: 'rgba(77,162,255,0.08)', color: '#A9D0FF', padding: 14, fontSize: 14, lineHeight: 1.6 }
const summaryRowStyle: CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }
const summaryPillStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', minHeight: 28, borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.045)', color: '#95A0B8', padding: '0 10px', fontSize: 12, fontWeight: 800 }
const readyPillStyle: CSSProperties = { ...summaryPillStyle, border: '1px solid rgba(45,226,230,0.24)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6' }
const warningPillStyle: CSSProperties = { ...summaryPillStyle, border: '1px solid rgba(214,168,95,0.28)', background: 'rgba(214,168,95,0.09)', color: '#D6A85F' }
const dangerPillStyle: CSSProperties = { ...summaryPillStyle, border: '1px solid rgba(255,122,122,0.28)', background: 'rgba(255,122,122,0.09)', color: '#FF9A9A' }
const warningBoxStyle: CSSProperties = { borderRadius: 14, border: '1px solid rgba(214,168,95,0.22)', background: 'rgba(214,168,95,0.08)', color: '#F4C983', padding: 12, fontSize: 13, lineHeight: 1.55 }
