'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type Locale = 'en' | 'es' | 'ru'
type PublishFilter = 'all' | 'published' | 'draft'

type AreaFormRow = {
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

function createEmptyRow(locale: Locale, sortOrder = 0): AreaFormRow {
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

export default function AdminAreasPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])

  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [rowsByLocale, setRowsByLocale] = useState<Record<Locale, AreaFormRow[]>>({
    en: [],
    es: [],
    ru: [],
  })
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

        const result = await (supabase.from('areas') as any)
          .select(
            'id, locale, slug, city, state, title, intro, highlights, supported_services, seo_title, seo_description, sort_order, is_published'
          )
          .order('sort_order', { ascending: true })

        if (result.error) {
          throw new Error(result.error.message)
        }

        const nextRows: Record<Locale, AreaFormRow[]> = {
          en: [],
          es: [],
          ru: [],
        }

        const rows = Array.isArray(result.data) ? result.data : []

        for (const row of rows) {
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
            highlightsText: Array.isArray(row.highlights)
              ? row.highlights.join('\n')
              : '',
            supportedServicesText: Array.isArray(row.supported_services)
              ? row.supported_services.join('\n')
              : '',
            seoTitle: row.seo_title ?? '',
            seoDescription: row.seo_description ?? '',
            sortOrder: Number(row.sort_order ?? 0),
            isPublished: Boolean(row.is_published ?? true),
          })
        }

        if (!mounted) return
        setRowsByLocale(nextRows)
      } catch (error) {
        if (!mounted) return
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load areas'
        )
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

  function updateRow(index: number, patch: Partial<AreaFormRow>) {
    setRowsByLocale((prev) => {
      const copy = [...prev[activeLocale]]
      copy[index] = { ...copy[index], ...patch }
      return {
        ...prev,
        [activeLocale]: copy,
      }
    })
  }

  function addRow() {
    setRowsByLocale((prev) => {
      const current = prev[activeLocale]
      const maxSort = current.length
        ? Math.max(...current.map((item) => item.sortOrder))
        : -1

      return {
        ...prev,
        [activeLocale]: [...current, createEmptyRow(activeLocale, maxSort + 1)],
      }
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
      setSuccessMessage('Unsaved area removed from form')
      return
    }

    const ok = window.confirm('Delete this area permanently?')
    if (!ok) return

    setDeletingId(row.id)

    try {
      const result = await (supabase.from('areas') as any)
        .delete()
        .eq('id', row.id)

      if (result.error) {
        throw new Error(result.error.message)
      }

      setRowsByLocale((prev) => {
        const copy = [...prev[activeLocale]]
        copy.splice(index, 1)
        return { ...prev, [activeLocale]: copy }
      })

      setSuccessMessage('Area deleted')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to delete area'
      )
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
        if (!row.slug.trim()) {
          throw new Error(`Slug is required for locale ${activeLocale.toUpperCase()}`)
        }

        const payload = {
          locale: row.locale,
          slug: row.slug.trim(),
          city: row.city.trim(),
          state: row.state.trim(),
          title: row.title.trim(),
          intro: row.intro.trim(),
          highlights: row.highlightsText
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
          supported_services: row.supportedServicesText
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
          seo_title: row.seoTitle.trim() || null,
          seo_description: row.seoDescription.trim() || null,
          sort_order: Number(row.sortOrder || 0),
          is_published: row.isPublished,
        }

        if (row.id) {
          const result = await (supabase.from('areas') as any)
            .update(payload)
            .eq('id', row.id)

          if (result.error) {
            throw new Error(result.error.message)
          }
        } else {
          const result = await (supabase.from('areas') as any)
            .insert(payload)
            .select('id')
            .single()

          if (result.error) {
            throw new Error(result.error.message)
          }

          row.id = result.data?.id ?? ''
        }
      }

      setSuccessMessage(`Areas saved for ${activeLocale.toUpperCase()}`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to save areas'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const currentRows = rowsByLocale[activeLocale]
  const filteredRows = currentRows.filter((row) => {
    const q = search.trim().toLowerCase()

    const matchesSearch =
      !q ||
      row.slug.toLowerCase().includes(q) ||
      row.city.toLowerCase().includes(q) ||
      row.state.toLowerCase().includes(q) ||
      row.title.toLowerCase().includes(q)

    const matchesPublish =
      publishFilter === 'all'
        ? true
        : publishFilter === 'published'
          ? row.isPublished
          : !row.isPublished

    return matchesSearch && matchesPublish
  })

  if (isBooting) {
    return (
      <div style={{ paddingTop: 20 }}>
        <p style={{ color: '#95A0B8', margin: 0 }}>Loading areas...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>
          Planetlocksmiths / Admin / Areas
        </p>
        <h1 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.1 }}>
          Areas
        </h1>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        {locales.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => {
              setSuccessMessage('')
              setErrorMessage('')
              setActiveLocale(locale)
            }}
            style={{
              minHeight: 42,
              padding: '0 14px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.10)',
              background: activeLocale === locale ? '#4DA2FF' : '#11192E',
              color: activeLocale === locale ? '#05070B' : '#F5F7FB',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {locale.toUpperCase()}
          </button>
        ))}

        <button
          type="button"
          onClick={addRow}
          style={ghostButtonStyle}
        >
          + Add area
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search slug, city, state, title"
          style={inputStyle}
        />

        <select
          value={publishFilter}
          onChange={(e) => setPublishFilter(e.target.value as PublishFilter)}
          style={inputStyle}
        >
          <option value="all">All areas</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}
      {successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}

      <form onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>
        {filteredRows.map((row) => {
          const realIndex = currentRows.indexOf(row)

          return (
            <div
              key={row.id || `${row.locale}-${realIndex}`}
              style={cardStyle}
            >
              <div style={cardHeaderStyle}>
                <strong style={{ fontSize: 18 }}>Area #{realIndex + 1}</strong>

                <button
                  type="button"
                  onClick={() => deleteRow(realIndex)}
                  disabled={deletingId === row.id}
                  style={dangerGhostButtonStyle}
                >
                  {deletingId === row.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              <Field
                label="Slug"
                value={row.slug}
                onChange={(value) => updateRow(realIndex, { slug: value })}
              />

              <Field
                label="City"
                value={row.city}
                onChange={(value) => updateRow(realIndex, { city: value })}
              />

              <Field
                label="State"
                value={row.state}
                onChange={(value) => updateRow(realIndex, { state: value })}
              />

              <Field
                label="Title"
                value={row.title}
                onChange={(value) => updateRow(realIndex, { title: value })}
              />

              <TextAreaField
                label="Intro"
                value={row.intro}
                onChange={(value) => updateRow(realIndex, { intro: value })}
              />

              <TextAreaField
                label="Highlights (one per line)"
                value={row.highlightsText}
                onChange={(value) =>
                  updateRow(realIndex, { highlightsText: value })
                }
              />

              <TextAreaField
                label="Supported Services (one per line)"
                value={row.supportedServicesText}
                onChange={(value) =>
                  updateRow(realIndex, { supportedServicesText: value })
                }
              />

              <Field
                label="SEO Title"
                value={row.seoTitle}
                onChange={(value) => updateRow(realIndex, { seoTitle: value })}
              />

              <TextAreaField
                label="SEO Description"
                value={row.seoDescription}
                onChange={(value) =>
                  updateRow(realIndex, { seoDescription: value })
                }
              />

              <Field
                label="Sort Order"
                value={String(row.sortOrder)}
                onChange={(value) =>
                  updateRow(realIndex, { sortOrder: Number(value || 0) })
                }
              />

              <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={row.isPublished}
                  onChange={(event) =>
                    updateRow(realIndex, { isPublished: event.target.checked })
                  }
                />
                <span>Published</span>
              </label>
            </div>
          )
        })}

        {!filteredRows.length ? (
          <div style={emptyStateStyle}>No areas match the current filters.</div>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          style={primaryButtonStyle(isSaving)}
        >
          {isSaving ? 'Saving...' : `Save ${activeLocale.toUpperCase()} Areas`}
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle}
      />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        style={textAreaStyle}
      />
    </label>
  )
}

function MessageBox({
  type,
  children,
}: {
  type: 'error' | 'success'
  children: React.ReactNode
}) {
  const isError = type === 'error'

  return (
    <div
      style={{
        borderRadius: 12,
        border: isError
          ? '1px solid rgba(255,122,122,0.25)'
          : '1px solid rgba(77,162,255,0.25)',
        background: isError
          ? 'rgba(255,122,122,0.08)'
          : 'rgba(77,162,255,0.08)',
        color: isError ? '#FF9A9A' : '#A9D0FF',
        padding: '12px 14px',
        fontSize: 14,
        lineHeight: 1.5,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 48,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.10)',
  background: '#11192E',
  color: '#F5F7FB',
  padding: '0 14px',
  outline: 'none',
  fontSize: 16,
  boxSizing: 'border-box',
  WebkitAppearance: 'none',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.10)',
  background: '#11192E',
  color: '#F5F7FB',
  padding: '12px 14px',
  outline: 'none',
  fontSize: 16,
  boxSizing: 'border-box',
  resize: 'vertical',
  WebkitAppearance: 'none',
}

const cardStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  background: '#0B1020',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: 18,
}

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
  flexWrap: 'wrap',
}

const ghostButtonStyle: React.CSSProperties = {
  minHeight: 42,
  padding: '0 14px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.10)',
  background: '#11192E',
  color: '#F5F7FB',
  fontWeight: 700,
  cursor: 'pointer',
}

const dangerGhostButtonStyle: React.CSSProperties = {
  minHeight: 38,
  padding: '0 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.10)',
  background: 'transparent',
  color: '#FF9A9A',
  cursor: 'pointer',
}

const emptyStateStyle: React.CSSProperties = {
  background: '#0B1020',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 18,
  padding: 18,
  color: '#95A0B8',
}

function primaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    minHeight: 50,
    borderRadius: 14,
    border: 'none',
    background: '#4DA2FF',
    color: '#05070B',
    fontWeight: 700,
    fontSize: 16,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.7 : 1,
  }
}
