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
  {
    label: 'Services hero',
    pageKey: 'services',
    slot: 'hero',
    eyebrow: 'Planetlocksmiths / services',
    title: 'Automotive Locksmith Services',
    body: 'Mobile automotive locksmith help for lockouts, replacement keys, key fob programming, transponder keys, ignition issues, and broken key situations.',
    itemsText: 'Call',
    ctaLabel: 'Request service',
    ctaHref: '/en/contact#request-service',
  },
  {
    label: 'Services side card',
    pageKey: 'services',
    slot: 'side',
    title: 'Service request ready',
    body: 'Choose a service page, review what details are needed, then call or submit a request with vehicle make, model, year, location, and urgency.',
    itemsText: 'Published services',
  },
  {
    label: 'Services cards labels',
    pageKey: 'services',
    slot: 'cards',
    eyebrow: 'Service',
    ctaLabel: 'Open page',
  },
  {
    label: 'Areas hero',
    pageKey: 'areas',
    slot: 'hero',
    eyebrow: 'Planetlocksmiths / coverage',
    title: 'Mobile Locksmith Service Areas',
    body: 'Explore automotive locksmith coverage areas and request help with vehicle lockouts, keys, fobs, programming, and ignition-related service.',
    itemsText: 'Call',
    ctaLabel: 'Request service',
    ctaHref: '/en/contact#request-service',
  },
  {
    label: 'Areas side card',
    pageKey: 'areas',
    slot: 'side',
    title: 'Coverage ready',
    body: 'Select a service area to review local coverage details, then submit the vehicle, location, and urgency.',
    itemsText: 'Published areas',
  },
  {
    label: 'Area cards labels',
    pageKey: 'areas',
    slot: 'cards',
    eyebrow: 'Area',
    ctaLabel: 'Open area',
  },
  {
    label: 'Contact hero',
    pageKey: 'contact',
    slot: 'hero',
    eyebrow: 'Contact Planetlocksmiths',
    title: 'Request mobile automotive locksmith service',
    body: 'Use the form below to send vehicle details, location, urgency, and the service needed. For urgent lockouts or active roadside situations, calling may be faster.',
    itemsText: 'Call',
    ctaLabel: 'Request service',
    ctaHref: '#request-service',
  },
  {
    label: 'Contact side card',
    pageKey: 'contact',
    slot: 'side',
    title: 'What makes the request faster',
    body: 'Vehicle make, model, year, exact location, phone number, and key situation help create a cleaner callback and service path.',
  },
  {
    label: 'Contact phone tile',
    pageKey: 'contact',
    slot: 'info-phone',
    title: 'Phone',
    body: '+1 (215) 555-0100',
  },
  {
    label: 'Contact service tile',
    pageKey: 'contact',
    slot: 'info-service',
    title: 'Service type',
    body: 'Mobile automotive locksmith',
  },
  {
    label: 'Contact area tile',
    pageKey: 'contact',
    slot: 'info-area',
    title: 'Common area',
    body: 'Philadelphia, Pennsylvania and nearby coverage areas',
  },
  {
    label: 'Contact helper',
    pageKey: 'contact',
    slot: 'helper',
    eyebrow: 'Request details',
    title: 'Fast service needs clear vehicle information',
    body: 'Phone, service, vehicle make, model, year, current location, and urgency help route the request correctly.',
  },
  {
    label: 'Legal privacy hero',
    pageKey: 'legal-privacy',
    slot: 'hero',
    eyebrow: 'Customer information',
    title: 'Privacy Policy',
    body: 'This page explains how Planetlocksmiths handles information submitted through this website for mobile automotive locksmith service requests.',
  },
  {
    label: 'Legal privacy section',
    pageKey: 'legal-privacy',
    slot: 'section-1',
    title: 'Information we collect',
    body: 'When you submit a service request, we may collect your name, phone number, email address, requested service, vehicle make/model/year, service location, urgency, preferred time, and message details.',
  },
  {
    label: 'Legal terms hero',
    pageKey: 'legal-terms',
    slot: 'hero',
    eyebrow: 'Customer information',
    title: 'Terms of Service',
    body: 'These terms explain the basic conditions for using this website and submitting a mobile automotive locksmith service request to Planetlocksmiths.',
  },
  {
    label: 'Legal terms section',
    pageKey: 'legal-terms',
    slot: 'section-1',
    title: 'Website use',
    body: 'This website provides information about automotive locksmith services and allows customers to submit service requests. You agree to provide accurate contact, vehicle, and location details when requesting service.',
  },
  {
    label: 'Area detail prep',
    pageKey: 'area-detail',
    slot: 'prep',
    title: 'What to prepare before service',
    itemsText: 'Vehicle make, model, and year\nExact address, parking lot, or nearby landmark\nWhether all keys are lost\nWhether the vehicle is locked, running, or in a garage\nPhone number for fast confirmation',
  },
  {
    label: 'Area detail supported services',
    pageKey: 'area-detail',
    slot: 'supported-services',
    title: 'Services commonly requested here',
    itemsText: 'Car lockout help\nReplacement car keys\nKey fob and transponder programming\nBroken key extraction\nIgnition-related support',
  },
  {
    label: 'Area detail local info',
    pageKey: 'area-detail',
    slot: 'local-info',
    title: 'Local service information',
    itemsText: 'Mobile service depends on technician availability and location\nResponse times may vary by traffic, distance, weather, and urgency\nFinal price depends on vehicle details, parts, and job complexity',
  },
  {
    label: 'Area detail coverage notes',
    pageKey: 'area-detail',
    slot: 'coverage-notes',
    title: 'Coverage notes',
    itemsText: 'Mobile service availability is not guaranteed until confirmed\nParts and programming support depend on vehicle details\nFinal service scope should be confirmed before work begins',
  },
  {
    label: 'Service detail process',
    pageKey: 'service-detail',
    slot: 'process',
    eyebrow: 'How the request works',
    title: 'Simple request flow',
    body: 'The process stays clear before any service is confirmed.',
    itemsText: 'Submit service and vehicle details\nConfirm location, urgency, and phone number\nReview availability, parts, and programming needs\nConfirm next step before service begins',
  },
  {
    label: 'Service detail readiness',
    pageKey: 'service-detail',
    slot: 'readiness',
    title: 'Information customers should prepare',
    body: 'Vehicle make, model, year, current location, urgency, and whether all keys are lost help make the request actionable.',
  },
  {
    label: 'Service detail pricing',
    pageKey: 'service-detail',
    slot: 'pricing',
    title: 'What affects price and timing',
    body: 'Final pricing can depend on vehicle security system, key type, programming requirements, parts availability, distance, timing, and job complexity.',
  },
  {
    label: 'Service detail authorization',
    pageKey: 'service-detail',
    slot: 'authorization',
    title: 'Authorization and safety',
    body: 'Customers may be asked to confirm authorization to access or service the vehicle before work begins.',
  },
]

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

function createPresetRow(locale: Locale, preset: Preset, sortOrder: number): ContentBlockRow {
  return {
    id: '',
    locale,
    pageKey: preset.pageKey,
    slot: preset.slot,
    eyebrow: preset.eyebrow ?? '',
    title: preset.title ?? '',
    body: preset.body ?? '',
    itemsText: preset.itemsText ?? '',
    ctaLabel: preset.ctaLabel ?? '',
    ctaHref: preset.ctaHref?.replace('/en/', `/${locale}/`) ?? '',
    sortOrder,
    isPublished: true,
  }
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
  const [publishFilter, setPublishFilter] = useState<PublishFilter>('all')
  const [selectedPreset, setSelectedPreset] = useState(presets[0].label)
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

        const result = await supabase
          .from('site_content_blocks')
          .select('id, locale, page_key, slot, eyebrow, title, body, items, cta_label, cta_href, sort_order, is_published')
          .order('sort_order', { ascending: true })

        if (result.error) {
          throw new Error(result.error.message)
        }

        const nextRows: Record<Locale, ContentBlockRow[]> = { en: [], es: [] }
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

        if (mounted) {
          setRowsByLocale(nextRows)
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Failed to load content blocks')
        }
      } finally {
        if (mounted) {
          setIsBooting(false)
        }
      }
    }

    boot()
    return () => {
      mounted = false
    }
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

  function addPresetRow() {
    const preset = presets.find((item) => item.label === selectedPreset) ?? presets[0]

    setRowsByLocale((prev) => {
      const current = prev[activeLocale]
      const maxSort = current.length ? Math.max(...current.map((item) => item.sortOrder)) : -1
      return { ...prev, [activeLocale]: [...current, createPresetRow(activeLocale, preset, maxSort + 1)] }
    })

    setSuccessMessage(`Preset added: ${preset.label}. Review text and save.`)
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
      const result = await supabase.from('site_content_blocks').delete().eq('id', row.id)
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
      for (const row of rowsByLocale[activeLocale]) {
        const pageKey = row.pageKey.trim()
        const slot = row.slot.trim()
        const title = row.title.trim()
        const body = row.body.trim()
        const eyebrow = row.eyebrow.trim()
        const ctaLabel = row.ctaLabel.trim()
        const ctaHref = row.ctaHref.trim()

        if (!pageKey) throw new Error('Page Key is required.')
        if (!slot) throw new Error('Slot is required.')
        if (row.isPublished && !title && !body && !eyebrow && !row.itemsText.trim() && !ctaLabel) {
          throw new Error('Published content blocks must contain at least title, body, eyebrow, items, or CTA label.')
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
    const matchesPublish = publishFilter === 'all' ? true : publishFilter === 'published' ? row.isPublished : !row.isPublished
    return matchesSearch && matchesPublish
  })

  if (isBooting) {
    return <div style={{ paddingTop: 20 }}><p style={{ color: '#95A0B8', margin: 0 }}>Loading content blocks...</p></div>
  }

  return (
    <div>
      <HeaderBlock
        breadcrumb="Planetlocksmiths / Admin / Content Blocks"
        title="Content Blocks"
        activeLocale={activeLocale}
        onLocaleChange={(locale) => {
          setSuccessMessage('')
          setErrorMessage('')
          setActiveLocale(locale)
        }}
        previewHref={`/${activeLocale}`}
        extraButton={<button type="button" onClick={addRow} style={ghostButtonStyle}>+ Add blank</button>}
      />

      <div style={guideStyle}>Public module text is controlled here. Use presets first, then edit copy. RU is frozen; use EN/ES only.</div>
      <div style={guideStyle}>Page keys: <Code>services</Code>, <Code>areas</Code>, <Code>service-detail</Code>, <Code>area-detail</Code>, <Code>contact</Code>, <Code>legal-privacy</Code>, <Code>legal-terms</Code>, <Code>footer</Code>. Detail overrides can use <Code>service:slug</Code> or <Code>area:slug</Code>.</div>

      <div style={presetBarStyle}>
        <select value={selectedPreset} onChange={(event) => setSelectedPreset(event.target.value)} style={inputStyle}>
          {presets.map((preset) => <option key={preset.label} value={preset.label}>{preset.label}</option>)}
        </select>
        <button type="button" onClick={addPresetRow} style={primaryButtonStyle}>+ Add preset block</button>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search page key, slot, title, body"
        filterValue={publishFilter}
        onFilterChange={(value) => setPublishFilter(value as PublishFilter)}
        filterOptions={[
          { value: 'all', label: 'All blocks' },
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
        ]}
      />

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

              <div style={fieldGridStyle}>
                <Field label="Page Key" value={row.pageKey} onChange={(value) => updateRow(realIndex, { pageKey: value })} />
                <Field label="Slot" value={row.slot} onChange={(value) => updateRow(realIndex, { slot: value })} />
                <Field label="Sort Order" value={String(row.sortOrder)} onChange={(value) => updateRow(realIndex, { sortOrder: Number(value || 0) })} />
              </div>

              <Field label="Eyebrow" value={row.eyebrow} onChange={(value) => updateRow(realIndex, { eyebrow: value })} />
              <Field label="Title" value={row.title} onChange={(value) => updateRow(realIndex, { title: value })} />
              <TextAreaField label="Body" value={row.body} onChange={(value) => updateRow(realIndex, { body: value })} />
              <TextAreaField label="Items (one per line)" value={row.itemsText} onChange={(value) => updateRow(realIndex, { itemsText: value })} />

              <div style={fieldGridStyle}>
                <Field label="CTA Label" value={row.ctaLabel} onChange={(value) => updateRow(realIndex, { ctaLabel: value })} />
                <Field label="CTA Href" value={row.ctaHref} onChange={(value) => updateRow(realIndex, { ctaHref: value })} />
              </div>

              <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="checkbox" checked={row.isPublished} onChange={(event) => updateRow(realIndex, { isPublished: event.target.checked })} />
                <span>Published</span>
              </label>
            </div>
          )
        })}

        {!filteredRows.length ? <div style={emptyStateStyle}>No content blocks match the current filters.</div> : null}
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label={`Save ${activeLocale.toUpperCase()} Blocks`} note={`Content blocks for ${activeLocale.toUpperCase()} stay ready at the bottom while you scroll.`} />
    </div>
  )
}

function Code({ children }: { children: ReactNode }) {
  return <code style={{ color: '#F5F7FB', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 6 }}>{children}</code>
}

function HeaderBlock({ breadcrumb, title, activeLocale, onLocaleChange, previewHref, extraButton }: { breadcrumb: string; title: string; activeLocale: Locale; onLocaleChange: (locale: Locale) => void; previewHref?: string; extraButton?: ReactNode }) {
  return (
    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
      <div>
        <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>{breadcrumb}</p>
        <h2 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.1 }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {locales.map((locale) => <button key={locale} type="button" onClick={() => onLocaleChange(locale)} style={{ minHeight: 42, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: activeLocale === locale ? '#4DA2FF' : '#11192E', color: activeLocale === locale ? '#05070B' : '#F5F7FB', fontWeight: 700, cursor: 'pointer' }}>{locale.toUpperCase()}</button>)}
        {previewHref ? <a href={previewHref} target="_blank" rel="noreferrer" style={ghostLinkStyle}>Preview</a> : null}
        {extraButton}
      </div>
    </div>
  )
}

function FilterBar({ search, onSearchChange, searchPlaceholder, filterValue, onFilterChange, filterOptions }: { search: string; onSearchChange: (value: string) => void; searchPlaceholder: string; filterValue: string; onFilterChange: (value: string) => void; filterOptions: Array<{ value: string; label: string }> }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 16 }}>
      <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} style={inputStyle} />
      <select value={filterValue} onChange={(event) => onFilterChange(event.target.value)} style={inputStyle}>{filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label style={{ display: 'grid', gap: 8 }}><span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} /></label>
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label style={{ display: 'grid', gap: 8 }}><span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} style={textAreaStyle} /></label>
}

function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) {
  const isError = type === 'error'
  return <div style={{ borderRadius: 12, border: isError ? '1px solid rgba(255,122,122,0.25)' : '1px solid rgba(77,162,255,0.25)', background: isError ? 'rgba(255,122,122,0.08)' : 'rgba(77,162,255,0.08)', color: isError ? '#FF9A9A' : '#A9D0FF', padding: '12px 14px', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>{children}</div>
}

const fieldGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 48, borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const textAreaStyle: CSSProperties = { width: '100%', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', padding: '12px 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', resize: 'vertical', WebkitAppearance: 'none' }
const cardStyle: CSSProperties = { display: 'grid', gap: 12, background: '#0B1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18 }
const cardHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
const presetBarStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12, marginBottom: 16 }
const primaryButtonStyle: CSSProperties = { minHeight: 48, padding: '0 16px', borderRadius: 12, border: '0', background: '#4DA2FF', color: '#05070B', fontWeight: 800, cursor: 'pointer' }
const ghostButtonStyle: CSSProperties = { minHeight: 42, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', fontWeight: 700, cursor: 'pointer' }
const dangerGhostButtonStyle: CSSProperties = { minHeight: 38, padding: '0 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.10)', background: 'transparent', color: '#FF9A9A', cursor: 'pointer' }
const ghostLinkStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 42, padding: '0 14px', borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', fontWeight: 700 }
const emptyStateStyle: CSSProperties = { background: '#0B1020', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, color: '#95A0B8' }
const guideStyle: CSSProperties = { marginBottom: 16, borderRadius: 16, border: '1px solid rgba(77,162,255,0.20)', background: 'rgba(77,162,255,0.08)', color: '#A9D0FF', padding: 14, fontSize: 14, lineHeight: 1.6 }
