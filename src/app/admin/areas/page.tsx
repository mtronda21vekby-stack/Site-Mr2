'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type Locale = 'en' | 'es' | 'ru'

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

  function removeRow(index: number) {
    setRowsByLocale((prev) => {
      const copy = [...prev[activeLocale]]
      copy.splice(index, 1)
      return {
        ...prev,
        [activeLocale]: copy,
      }
    })
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
          style={{
            minHeight: 42,
            padding: '0 14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.10)',
            background: '#11192E',
            color: '#F5F7FB',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Add area
        </button>
      </div>

      {errorMessage ? (
        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(255,122,122,0.25)',
            background: 'rgba(255,122,122,0.08)',
            color: '#FF9A9A',
            padding: '12px 14px',
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(77,162,255,0.25)',
            background: 'rgba(77,162,255,0.08)',
            color: '#A9D0FF',
            padding: '12px 14px',
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {successMessage}
        </div>
      ) : null}

      <form onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>
        {currentRows.map((row, index) => (
          <div
            key={row.id || `${row.locale}-${index}`}
            style={{
              background: '#0B1020',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: 18,
              display: 'grid',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <strong style={{ fontSize: 18 }}>Area #{index + 1}</strong>

              <button
                type="button"
                onClick={() => removeRow(index)}
                style={{
                  minHeight: 38,
                  padding: '0 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'transparent',
                  color: '#FF9A9A',
                  cursor: 'pointer',
                }}
              >
                Remove from form
              </button>
            </div>

            <Field
              label="Slug"
              value={row.slug}
              onChange={(value) => updateRow(index, { slug: value })}
            />

            <Field
              label="City"
              value={row.city}
              onChange={(value) => updateRow(index, { city: value })}
            />

            <Field
              label="State"
              value={row.state}
              onChange={(value) => updateRow(index, { state: value })}
            />

            <Field
              label="Title"
              value={row.title}
              onChange={(value) => updateRow(index, { title: value })}
            />

            <TextAreaField
              label="Intro"
              value={row.intro}
              onChange={(value) => updateRow(index, { intro: value })}
            />

            <TextAreaField
              label="Highlights (one per line)"
              value={row.highlightsText}
              onChange={(value) => updateRow(index, { highlightsText: value })}
            />

            <TextAreaField
              label="Supported Services (one per line)"
              value={row.supportedServicesText}
              onChange={(value) =>
                updateRow(index, { supportedServicesText: value })
              }
            />

            <Field
              label="SEO Title"
              value={row.seoTitle}
              onChange={(value) => updateRow(index, { seoTitle: value })}
            />

            <TextAreaField
              label="SEO Description"
              value={row.seoDescription}
              onChange={(value) => updateRow(index, { seoDescription: value })}
            />

            <Field
              label="Sort Order"
              value={String(row.sortOrder)}
              onChange={(value) =>
                updateRow(index, { sortOrder: Number(value || 0) })
              }
            />

            <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={row.isPublished}
                onChange={(event) =>
                  updateRow(index, { isPublished: event.target.checked })
                }
              />
              <span>Published</span>
            </label>
          </div>
        ))}

        <button
          type="submit"
          disabled={isSaving}
          style={{
            minHeight: 50,
            borderRadius: 14,
            border: 'none',
            background: '#4DA2FF',
            color: '#05070B',
            fontWeight: 700,
            fontSize: 16,
            cursor: isSaving ? 'default' : 'pointer',
            opacity: isSaving ? 0.7 : 1,
          }}
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
        style={{
          width: '100%',
          minHeight: 50,
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.10)',
          background: '#11192E',
          color: '#F5F7FB',
          padding: '0 14px',
          outline: 'none',
          fontSize: 16,
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
        }}
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
        style={{
          width: '100%',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.10)',
          background: '#11192E',
          color: '#F5F7FB',
          padding: '12px 14px',
          outline: 'none',
          fontSize: 16,
          boxSizing: 'border-box',
          resize: 'vertical',
          WebkitAppearance: 'none',
        }}
      />
    </label>
  )
}
