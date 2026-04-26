'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'

type Locale = 'en' | 'es'
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

type Preset = {
  label: string
  group: string
  description: string
  usedOn: string
  fields: string
  pageKey: string
  slot: string
  eyebrow?: string
  title?: string
  body?: string
  itemsText?: string
  ctaLabel?: string
  ctaHref?: string
}

const locales: Locale[] = ['en', 'es']
const FORM_ID = 'admin-content-blocks-form'

const presets: Preset[] = [
  { group: 'Services', label: 'Services hero', description: 'Main hero module on the services listing page.', usedOn: '/services', fields: 'eyebrow, title, body, items[0], CTA', pageKey: 'services', slot: 'hero', eyebrow: 'Planetlocksmiths / services', title: 'Automotive Locksmith Services', body: 'Mobile automotive locksmith help for lockouts, replacement keys, key fob programming, transponder keys, ignition issues, and broken key situations.', itemsText: 'Call', ctaLabel: 'Request service', ctaHref: '/en/contact#request-service' },
  { group: 'Services', label: 'Services side card', description: 'Right-side support card beside the services hero.', usedOn: '/services', fields: 'title, body, items[0]', pageKey: 'services', slot: 'side', title: 'Service request ready', body: 'Choose a service page, review what details are needed, then call or submit a request with vehicle make, model, year, location, and urgency.', itemsText: 'Published services' },
  { group: 'Services', label: 'Services card labels', description: 'Small card prefix and open-link label for service cards.', usedOn: '/services', fields: 'eyebrow, CTA label', pageKey: 'services', slot: 'cards', eyebrow: 'Service', ctaLabel: 'Open page' },
  { group: 'Service detail', label: 'Service detail process', description: 'Four-step process grid on every service detail page.', usedOn: '/services/[slug]', fields: 'eyebrow, title, body, items', pageKey: 'service-detail', slot: 'process', eyebrow: 'How the request works', title: 'Simple request flow', body: 'The process stays clear before any service is confirmed.', itemsText: 'Submit service and vehicle details\nConfirm location, urgency, and phone number\nReview availability, parts, and programming needs\nConfirm next step before service begins' },
  { group: 'Service detail', label: 'Service readiness card', description: 'Small readiness card on service detail pages.', usedOn: '/services/[slug]', fields: 'title, body, items', pageKey: 'service-detail', slot: 'readiness', title: 'Information customers should prepare', body: 'Vehicle make, model, year, current location, urgency, and whether all keys are lost help make the request actionable.' },
  { group: 'Service detail', label: 'Service pricing card', description: 'Small card explaining what affects price and timing.', usedOn: '/services/[slug]', fields: 'title, body, items', pageKey: 'service-detail', slot: 'pricing', title: 'What affects price and timing', body: 'Final pricing can depend on vehicle security system, key type, programming requirements, parts availability, distance, timing, and job complexity.' },
  { group: 'Service detail', label: 'Service authorization card', description: 'Small card explaining ownership and authorization checks.', usedOn: '/services/[slug]', fields: 'title, body, items', pageKey: 'service-detail', slot: 'authorization', title: 'Authorization and safety', body: 'Customers may be asked to confirm authorization to access or service the vehicle before work begins.' },
  { group: 'Areas', label: 'Areas hero', description: 'Main hero module on the areas listing page.', usedOn: '/areas', fields: 'eyebrow, title, body, items[0], CTA', pageKey: 'areas', slot: 'hero', eyebrow: 'Planetlocksmiths / coverage', title: 'Mobile Locksmith Service Areas', body: 'Explore automotive locksmith coverage areas and request help with vehicle lockouts, keys, fobs, programming, and ignition-related service.', itemsText: 'Call', ctaLabel: 'Request service', ctaHref: '/en/contact#request-service' },
  { group: 'Areas', label: 'Areas side card', description: 'Right-side support card beside the areas hero.', usedOn: '/areas', fields: 'title, body, items[0]', pageKey: 'areas', slot: 'side', title: 'Coverage ready', body: 'Select a service area to review local coverage details, then submit the vehicle, location, and urgency.', itemsText: 'Published areas' },
  { group: 'Areas', label: 'Area card labels', description: 'Small card prefix and open-link label for area cards.', usedOn: '/areas', fields: 'eyebrow, CTA label', pageKey: 'areas', slot: 'cards', eyebrow: 'Area', ctaLabel: 'Open area' },
  { group: 'Area detail', label: 'Area prep card', description: 'Preparation checklist on every area detail page.', usedOn: '/areas/[slug]', fields: 'title, body, items', pageKey: 'area-detail', slot: 'prep', title: 'What to prepare before service', itemsText: 'Vehicle make, model, and year\nExact address, parking lot, or nearby landmark\nWhether all keys are lost\nWhether the vehicle is locked, running, or in a garage\nPhone number for fast confirmation' },
  { group: 'Area detail', label: 'Area supported services', description: 'Supported service list on area detail pages.', usedOn: '/areas/[slug]', fields: 'title, body, items', pageKey: 'area-detail', slot: 'supported-services', title: 'Services commonly requested here', itemsText: 'Car lockout help\nReplacement car keys\nKey fob and transponder programming\nBroken key extraction\nIgnition-related support' },
  { group: 'Area detail', label: 'Area local info', description: 'Local service notes on area detail pages.', usedOn: '/areas/[slug]', fields: 'title, body, items', pageKey: 'area-detail', slot: 'local-info', title: 'Local service information', itemsText: 'Mobile service depends on technician availability and location\nResponse times may vary by traffic, distance, weather, and urgency\nFinal price depends on vehicle details, parts, and job complexity' },
  { group: 'Area detail', label: 'Area coverage notes', description: 'Coverage limitations and confirmation notes.', usedOn: '/areas/[slug]', fields: 'title, body, items', pageKey: 'area-detail', slot: 'coverage-notes', title: 'Coverage notes', itemsText: 'Mobile service availability is not guaranteed until confirmed\nParts and programming support depend on vehicle details\nFinal service scope should be confirmed before work begins' },
  { group: 'Contact', label: 'Contact hero', description: 'Main contact page hero module.', usedOn: '/contact', fields: 'eyebrow, title, body, items[0], CTA', pageKey: 'contact', slot: 'hero', eyebrow: 'Contact Planetlocksmiths', title: 'Request mobile automotive locksmith service', body: 'Use the form below to send vehicle details, location, urgency, and the service needed. For urgent lockouts or active roadside situations, calling may be faster.', itemsText: 'Call', ctaLabel: 'Request service', ctaHref: '#request-service' },
  { group: 'Contact', label: 'Contact side card', description: 'Right-side helper card on contact page.', usedOn: '/contact', fields: 'title, body', pageKey: 'contact', slot: 'side', title: 'What makes the request faster', body: 'Vehicle make, model, year, exact location, phone number, and key situation help create a cleaner callback and service path.' },
  { group: 'Contact', label: 'Contact service tile', description: 'Small info tile describing service type.', usedOn: '/contact', fields: 'title, body', pageKey: 'contact', slot: 'info-service', title: 'Service type', body: 'Mobile automotive locksmith' },
  { group: 'Contact', label: 'Contact area tile', description: 'Small info tile describing coverage area.', usedOn: '/contact', fields: 'title, body', pageKey: 'contact', slot: 'info-area', title: 'Common area', body: 'Philadelphia, Pennsylvania and nearby coverage areas' },
  { group: 'Contact', label: 'Contact helper', description: 'Fallback helper copy used by the contact page.', usedOn: '/contact', fields: 'eyebrow, title, body', pageKey: 'contact', slot: 'helper', eyebrow: 'Request details', title: 'Fast service needs clear vehicle information', body: 'Phone, service, vehicle make, model, year, current location, and urgency help route the request correctly.' },
  { group: 'About', label: 'About hero', description: 'Main about page hero module.', usedOn: '/about', fields: 'eyebrow, title, body', pageKey: 'about', slot: 'hero', eyebrow: 'About Planetlocksmiths', title: 'Mobile automotive locksmith support built for clear, fast service requests.', body: 'Planetlocksmiths is structured around mobile automotive locksmith requests for car lockouts, replacement keys, key fob programming, transponder support, ignition-related help, and broken key situations.' },
  { group: 'About', label: 'About section', description: 'Reusable about page content card. Duplicate and change slot to section-2, section-3, etc.', usedOn: '/about', fields: 'title, body, items', pageKey: 'about', slot: 'section-1', title: 'Automotive focus', body: 'The site is designed around vehicle-specific requests so customers can provide service type, vehicle details, location, urgency, and contact information clearly.' },
  { group: 'FAQ', label: 'FAQ hero', description: 'Main FAQ page hero module.', usedOn: '/faq', fields: 'eyebrow, title, body', pageKey: 'faq', slot: 'hero', eyebrow: 'Customer questions', title: 'Frequently Asked Questions', body: 'Answers to common questions about mobile automotive locksmith requests, service timing, vehicle information, key programming, and availability.' },
  { group: 'FAQ', label: 'FAQ empty state', description: 'Text shown only when no FAQ items are published.', usedOn: '/faq', fields: 'body', pageKey: 'faq', slot: 'empty', body: 'No published FAQ items yet.' },
  { group: 'Reviews', label: 'Reviews hero', description: 'Main reviews page hero module.', usedOn: '/reviews', fields: 'eyebrow, title, body', pageKey: 'reviews', slot: 'hero', eyebrow: 'Customer feedback', title: 'Customer Reviews', body: 'Read customer feedback for mobile automotive locksmith requests including lockouts, replacement keys, fobs, transponder support, and related vehicle key situations.' },
  { group: 'Reviews', label: 'Reviews empty state', description: 'Text shown only when no reviews are published.', usedOn: '/reviews', fields: 'body', pageKey: 'reviews', slot: 'empty', body: 'No published reviews yet.' },
  { group: 'Legal', label: 'Legal privacy hero', description: 'Main privacy policy hero module.', usedOn: '/privacy', fields: 'eyebrow, title, body', pageKey: 'legal-privacy', slot: 'hero', eyebrow: 'Customer information', title: 'Privacy Policy', body: 'This page explains how Planetlocksmiths handles information submitted through this website for mobile automotive locksmith service requests.' },
  { group: 'Legal', label: 'Legal privacy section', description: 'Reusable privacy policy section. Duplicate and change slot to section-2, section-3, etc.', usedOn: '/privacy', fields: 'title, body, items', pageKey: 'legal-privacy', slot: 'section-1', title: 'Information we collect', body: 'When you submit a service request, we may collect your name, phone number, email address, requested service, vehicle make/model/year, service location, urgency, preferred time, and message details.' },
  { group: 'Legal', label: 'Legal terms hero', description: 'Main terms page hero module.', usedOn: '/terms', fields: 'eyebrow, title, body', pageKey: 'legal-terms', slot: 'hero', eyebrow: 'Customer information', title: 'Terms of Service', body: 'These terms explain the basic conditions for using this website and submitting a mobile automotive locksmith service request to Planetlocksmiths.' },
  { group: 'Legal', label: 'Legal terms section', description: 'Reusable terms section. Duplicate and change slot to section-2, section-3, etc.', usedOn: '/terms', fields: 'title, body, items', pageKey: 'legal-terms', slot: 'section-1', title: 'Website use', body: 'This website provides information about automotive locksmith services and allows customers to submit service requests. You agree to provide accurate contact, vehicle, and location details when requesting service.' },
]

const presetGroups = Array.from(new Set(presets.map((preset) => preset.group)))
const knownPageKeys = Array.from(new Set(presets.map((preset) => preset.pageKey))).sort()

function createEmptyRow(locale: Locale, sortOrder = 0): ContentBlockRow {
  return { id: '', locale, pageKey: 'home', slot: 'section', eyebrow: '', title: '', body: '', itemsText: '', ctaLabel: '', ctaHref: '', sortOrder, isPublished: true }
}

function createPresetRow(locale: Locale, preset: Preset, sortOrder: number): ContentBlockRow {
  return { id: '', locale, pageKey: preset.pageKey, slot: preset.slot, eyebrow: preset.eyebrow ?? '', title: preset.title ?? '', body: preset.body ?? '', itemsText: preset.itemsText ?? '', ctaLabel: preset.ctaLabel ?? '', ctaHref: preset.ctaHref?.replace('/en/', `/${locale}/`) ?? '', sortOrder, isPublished: true }
}

export default function AdminContentBlocksPage() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseClient() as any, [])
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [rowsByLocale, setRowsByLocale] = useState<Record<Locale, ContentBlockRow[]>>({ en: [], es: [] })
  const [isBooting, setIsBooting] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [pageKeyFilter, setPageKeyFilter] = useState('all')
  const [publishFilter, setPublishFilter] = useState<PublishFilter>('all')
  const [selectedGroup, setSelectedGroup] = useState(presetGroups[0])
  const [selectedPreset, setSelectedPreset] = useState(presets[0].label)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const visiblePresets = presets.filter((preset) => preset.group === selectedGroup)
  const activePreset = presets.find((item) => item.label === selectedPreset) ?? visiblePresets[0] ?? presets[0]

  useEffect(() => {
    const firstPreset = presets.find((preset) => preset.group === selectedGroup)
    if (firstPreset) setSelectedPreset(firstPreset.label)
  }, [selectedGroup])

  useEffect(() => {
    let mounted = true
    async function boot() {
      try {
        setErrorMessage('')
        setSuccessMessage('')
        const sessionResult = await supabase.auth.getSession()
        const session = sessionResult?.data?.session
        if (!session) { router.replace('/admin/login'); return }
        const result = await supabase.from('site_content_blocks').select('id, locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, sort_order, is_published').order('sort_order', { ascending: true })
        if (result.error) throw new Error(result.error.message)
        const nextRows: Record<Locale, ContentBlockRow[]> = { en: [], es: [] }
        const rows = Array.isArray(result.data) ? result.data : []
        for (const row of rows) {
          const locale = row.locale as Locale
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

  function updateRow(index: number, patch: Partial<ContentBlockRow>) { setRowsByLocale((prev) => { const copy = [...prev[activeLocale]]; copy[index] = { ...copy[index], ...patch }; return { ...prev, [activeLocale]: copy } }) }
  function addRow() { setRowsByLocale((prev) => { const current = prev[activeLocale]; const maxSort = current.length ? Math.max(...current.map((item) => item.sortOrder)) : -1; return { ...prev, [activeLocale]: [...current, createEmptyRow(activeLocale, maxSort + 1)] } }) }
  function addPresetRow() { const preset = activePreset; setRowsByLocale((prev) => { const current = prev[activeLocale]; const maxSort = current.length ? Math.max(...current.map((item) => item.sortOrder)) : -1; return { ...prev, [activeLocale]: [...current, createPresetRow(activeLocale, preset, maxSort + 1)] } }); setSuccessMessage(`Preset added: ${preset.label}. Review text and save.`) }

  async function deleteRow(index: number) {
    setErrorMessage(''); setSuccessMessage('')
    const row = rowsByLocale[activeLocale][index]
    if (!row) return
    if (!row.id) { setRowsByLocale((prev) => { const copy = [...prev[activeLocale]]; copy.splice(index, 1); return { ...prev, [activeLocale]: copy } }); setSuccessMessage('Unsaved block removed from form'); return }
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
    event.preventDefault(); setErrorMessage(''); setSuccessMessage(''); setIsSaving(true)
    try {
      for (const row of rowsByLocale[activeLocale]) {
        const pageKey = row.pageKey.trim(); const slot = row.slot.trim(); const title = row.title.trim(); const body = row.body.trim(); const eyebrow = row.eyebrow.trim(); const ctaLabel = row.ctaLabel.trim(); const ctaHref = row.ctaHref.trim()
        if (!pageKey) throw new Error('Page Key is required.')
        if (!slot) throw new Error('Slot is required.')
        if (row.isPublished && !title && !body && !eyebrow && !row.itemsText.trim() && !ctaLabel) throw new Error('Published content blocks must contain at least title, body, eyebrow, items, or CTA label.')
        const payload = { locale: row.locale, page_key: pageKey, slot, eyebrow: eyebrow || null, title: title || null, body: body || null, items: row.itemsText.split('\n').map((item) => item.trim()).filter(Boolean), cta_label: ctaLabel || null, cta_href: ctaHref || null, sort_order: Number(row.sortOrder || 0), is_published: row.isPublished }
        if (row.id) { const result = await supabase.from('site_content_blocks').update(payload).eq('id', row.id); if (result.error) throw new Error(result.error.message) }
        else { const result = await supabase.from('site_content_blocks').insert(payload).select('id').single(); if (result.error) throw new Error(result.error.message); row.id = result.data?.id ?? '' }
      }
      setSuccessMessage(`Content blocks saved for ${activeLocale.toUpperCase()}`)
    } catch (error) { setErrorMessage(error instanceof Error ? error.message : 'Failed to save content blocks') }
    finally { setIsSaving(false) }
  }

  const currentRows = rowsByLocale[activeLocale]
  const filteredRows = currentRows.filter((row) => { const query = search.trim().toLowerCase(); const matchesSearch = !query || row.pageKey.toLowerCase().includes(query) || row.slot.toLowerCase().includes(query) || row.title.toLowerCase().includes(query) || row.body.toLowerCase().includes(query); const matchesPageKey = pageKeyFilter === 'all' || row.pageKey === pageKeyFilter; const matchesPublish = publishFilter === 'all' ? true : publishFilter === 'published' ? row.isPublished : !row.isPublished; return matchesSearch && matchesPageKey && matchesPublish })
  if (isBooting) return <div style={{ paddingTop: 20 }}><p style={{ color: '#95A0B8', margin: 0 }}>Loading content blocks...</p></div>

  return (
    <div>
      <HeaderBlock breadcrumb="Planetlocksmiths / Admin / Content Blocks" title="Content Blocks" activeLocale={activeLocale} onLocaleChange={(locale) => { setSuccessMessage(''); setErrorMessage(''); setActiveLocale(locale) }} previewHref={`/${activeLocale}`} extraButton={<button type="button" onClick={addRow} style={ghostButtonStyle}>+ Add blank</button>} />
      <div style={guideStyle}>Public modules are controlled here. Use presets first, then edit copy. RU is frozen; use EN/ES only. Phone numbers should be controlled from Settings, not typed into content blocks unless intentionally needed.</div>
      <div style={presetPanelStyle}>
        <div style={fieldGridStyle}>
          <label style={labelStyle}><span>Preset group</span><select value={selectedGroup} onChange={(event) => setSelectedGroup(event.target.value)} style={inputStyle}>{presetGroups.map((group) => <option key={group} value={group}>{group}</option>)}</select></label>
          <label style={labelStyle}><span>Preset module</span><select value={selectedPreset} onChange={(event) => setSelectedPreset(event.target.value)} style={inputStyle}>{visiblePresets.map((preset) => <option key={preset.label} value={preset.label}>{preset.label}</option>)}</select></label>
        </div>
        <PresetPreview preset={activePreset} />
        <button type="button" onClick={addPresetRow} style={primaryButtonStyle}>+ Add selected preset</button>
      </div>
      <div style={filterGridStyle}><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search page key, slot, title, body" style={inputStyle} /><select value={pageKeyFilter} onChange={(event) => setPageKeyFilter(event.target.value)} style={inputStyle}><option value="all">All page keys</option>{knownPageKeys.map((key) => <option key={key} value={key}>{key}</option>)}</select><select value={publishFilter} onChange={(event) => setPublishFilter(event.target.value as PublishFilter)} style={inputStyle}><option value="all">All blocks</option><option value="published">Published</option><option value="draft">Draft</option></select></div>
      {errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}
      {successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}
      <form id={FORM_ID} onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>
        {filteredRows.map((row) => { const realIndex = currentRows.indexOf(row); return <ContentBlockEditor key={row.id || `${row.locale}-${realIndex}`} row={row} index={realIndex} deletingId={deletingId} onPatch={(patch) => updateRow(realIndex, patch)} onDelete={() => deleteRow(realIndex)} /> })}
        {!filteredRows.length ? <div style={emptyStateStyle}>No content blocks match the current filters.</div> : null}
      </form>
      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label={`Save ${activeLocale.toUpperCase()} Blocks`} note={`Content blocks for ${activeLocale.toUpperCase()} stay ready at the bottom while you scroll.`} />
    </div>
  )
}

function PresetPreview({ preset }: { preset: Preset }) {
  const items = preset.itemsText?.split('\n').filter(Boolean) ?? []
  return <div style={previewStyle}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}><div><p style={previewKickerStyle}>{preset.group} · {preset.usedOn}</p><h3 style={{ margin: '6px 0 0', fontSize: 18 }}>{preset.label}</h3></div><span style={chipStyle}>{preset.pageKey} / {preset.slot}</span></div><p style={{ margin: '10px 0 0', color: '#95A0B8', lineHeight: 1.6 }}>{preset.description}</p><p style={{ margin: '10px 0 0', color: '#A9D0FF', fontSize: 13 }}>Uses: {preset.fields}</p><div style={miniCardStyle}>{preset.eyebrow ? <p style={previewKickerStyle}>{preset.eyebrow}</p> : null}{preset.title ? <strong style={{ display: 'block', marginTop: 6 }}>{preset.title}</strong> : null}{preset.body ? <p style={{ margin: '8px 0 0', color: '#95A0B8', lineHeight: 1.5 }}>{preset.body}</p> : null}{items.length ? <ul style={{ margin: '10px 0 0', paddingLeft: 18, color: '#F5F7FB' }}>{items.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul> : null}{preset.ctaLabel ? <p style={{ margin: '10px 0 0', color: '#4DA2FF', fontWeight: 800 }}>{preset.ctaLabel}</p> : null}</div></div>
}

function ContentBlockEditor({ row, index, deletingId, onPatch, onDelete }: { row: ContentBlockRow; index: number; deletingId: string | null; onPatch: (patch: Partial<ContentBlockRow>) => void; onDelete: () => void }) {
  return <div style={cardStyle}><div style={cardHeaderStyle}><div><strong style={{ fontSize: 18 }}>Block #{index + 1}</strong><p style={{ margin: '6px 0 0', color: '#95A0B8', fontSize: 13 }}>{row.pageKey} / {row.slot}</p></div><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={row.isPublished ? chipStyle : draftChipStyle}>{row.isPublished ? 'Published' : 'Draft'}</span><button type="button" onClick={onDelete} disabled={deletingId === row.id} style={dangerGhostButtonStyle}>{deletingId === row.id ? 'Deleting...' : 'Delete'}</button></div></div><div style={fieldGridStyle}><Field label="Page Key" hint="Which page/module reads this block." value={row.pageKey} onChange={(value) => onPatch({ pageKey: value })} /><Field label="Slot" hint="Exact module position, e.g. hero, side, section-1." value={row.slot} onChange={(value) => onPatch({ slot: value })} /><Field label="Sort Order" hint="Lower numbers appear first where sorting is used." value={String(row.sortOrder)} onChange={(value) => onPatch({ sortOrder: Number(value || 0) })} /></div><Field label="Eyebrow" hint="Small label above a title." value={row.eyebrow} onChange={(value) => onPatch({ eyebrow: value })} /><Field label="Title" hint="Primary heading for this module." value={row.title} onChange={(value) => onPatch({ title: value })} /><TextAreaField label="Body" hint="Main paragraph copy." value={row.body} onChange={(value) => onPatch({ body: value })} /><TextAreaField label="Items" hint="One item per line. Used for lists, steps, labels, or checklists." value={row.itemsText} onChange={(value) => onPatch({ itemsText: value })} /><div style={fieldGridStyle}><Field label="CTA Label" hint="Button/link text where this slot supports CTA." value={row.ctaLabel} onChange={(value) => onPatch({ ctaLabel: value })} /><Field label="CTA Href" hint="URL or anchor, e.g. /en/contact#request-service." value={row.ctaHref} onChange={(value) => onPatch({ ctaHref: value })} /></div><ModulePreview row={row} /><label style={{ display: 'flex', gap: 10, alignItems: 'center' }}><input type="checkbox" checked={row.isPublished} onChange={(event) => onPatch({ isPublished: event.target.checked })} /><span>Published</span></label></div>
}

function ModulePreview({ row }: { row: ContentBlockRow }) {
  const items = row.itemsText.split('\n').map((item) => item.trim()).filter(Boolean)
  return <div style={miniCardStyle}>{row.eyebrow ? <p style={previewKickerStyle}>{row.eyebrow}</p> : null}{row.title ? <strong style={{ display: 'block', marginTop: 6 }}>{row.title}</strong> : null}{row.body ? <p style={{ margin: '8px 0 0', color: '#95A0B8', lineHeight: 1.5 }}>{row.body}</p> : null}{items.length ? <ul style={{ margin: '10px 0 0', paddingLeft: 18, color: '#F5F7FB' }}>{items.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul> : null}{row.ctaLabel ? <p style={{ margin: '10px 0 0', color: '#4DA2FF', fontWeight: 800 }}>{row.ctaLabel}</p> : null}{!row.eyebrow && !row.title && !row.body && !items.length && !row.ctaLabel ? <p style={{ margin: 0, color: '#95A0B8' }}>Preview appears here after content is added.</p> : null}</div>
}

function HeaderBlock({ breadcrumb, title, activeLocale, onLocaleChange, previewHref, extraButton }: { breadcrumb: string; title: string; activeLocale: Locale; onLocaleChange: (locale: Locale) => void; previewHref?: string; extraButton?: ReactNode }) { return <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}><div><p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>{breadcrumb}</p><h2 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.1 }}>{title}</h2></div><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{locales.map((locale) => <button key={locale} type="button" onClick={() => onLocaleChange(locale)} style={{ minHeight: 42, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: activeLocale === locale ? '#4DA2FF' : '#11192E', color: activeLocale === locale ? '#05070B' : '#F5F7FB', fontWeight: 700, cursor: 'pointer' }}>{locale.toUpperCase()}</button>)}{previewHref ? <a href={previewHref} target="_blank" rel="noreferrer" style={ghostLinkStyle}>Preview</a> : null}{extraButton}</div></div> }
function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (value: string) => void; hint?: string }) { return <label style={labelStyle}><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} />{hint ? <small style={hintStyle}>{hint}</small> : null}</label> }
function TextAreaField({ label, value, onChange, hint }: { label: string; value: string; onChange: (value: string) => void; hint?: string }) { return <label style={labelStyle}><span>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} style={textAreaStyle} />{hint ? <small style={hintStyle}>{hint}</small> : null}</label> }
function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) { const isError = type === 'error'; return <div style={{ borderRadius: 12, border: isError ? '1px solid rgba(255,122,122,0.25)' : '1px solid rgba(77,162,255,0.25)', background: isError ? 'rgba(255,122,122,0.08)' : 'rgba(77,162,255,0.08)', color: isError ? '#FF9A9A' : '#A9D0FF', padding: '12px 14px', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>{children}</div> }
const labelStyle: CSSProperties = { display: 'grid', gap: 8, color: '#95A0B8', fontSize: 14 }
const hintStyle: CSSProperties = { color: '#68738E', lineHeight: 1.45 }
const fieldGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }
const filterGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(220px, 2fr) minmax(160px, 1fr) minmax(160px, 1fr)', gap: 12, marginBottom: 16 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 48, borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const textAreaStyle: CSSProperties = { width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '12px 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', resize: 'vertical', WebkitAppearance: 'none' }
const cardStyle: CSSProperties = { display: 'grid', gap: 12, background: '#0B1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18 }
const cardHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
const presetPanelStyle: CSSProperties = { display: 'grid', gap: 14, background: '#0B1020', border: '1px solid rgba(77,162,255,0.18)', borderRadius: 20, padding: 16, marginBottom: 16 }
const previewStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)', padding: 14 }
const miniCardStyle: CSSProperties = { marginTop: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)', padding: 14 }
const previewKickerStyle: CSSProperties = { margin: 0, color: '#4DA2FF', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em' }
const chipStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', minHeight: 28, borderRadius: 999, border: '1px solid rgba(77,162,255,0.25)', background: 'rgba(77,162,255,0.10)', color: '#A9D0FF', padding: '0 10px', fontSize: 12, fontWeight: 800 }
const draftChipStyle: CSSProperties = { ...chipStyle, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.06)', color: '#95A0B8' }
const primaryButtonStyle: CSSProperties = { minHeight: 48, padding: '0 16px', borderRadius: 12, border: '0', background: '#4DA2FF', color: '#05070B', fontWeight: 800, cursor: 'pointer' }
const ghostButtonStyle: CSSProperties = { minHeight: 42, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', fontWeight: 700, cursor: 'pointer' }
const dangerGhostButtonStyle: CSSProperties = { minHeight: 38, padding: '0 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.10)', background: 'transparent', color: '#FF9A9A', cursor: 'pointer' }
const ghostLinkStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 42, padding: '0 14px', borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', fontWeight: 700 }
const emptyStateStyle: CSSProperties = { background: '#0B1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, color: '#95A0B8' }
const guideStyle: CSSProperties = { marginBottom: 16, borderRadius: 16, border: '1px solid rgba(77,162,255,0.20)', background: 'rgba(77,162,255,0.08)', color: '#A9D0FF', padding: 14, fontSize: 14, lineHeight: 1.6 }
