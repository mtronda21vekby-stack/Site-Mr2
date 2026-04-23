'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type Locale = 'en' | 'es' | 'ru'

type ServiceFormRow = {
  id: string
  locale: Locale
  slug: string
  title: string
  excerpt: string
  intro: string
  seoTitle: string
  seoDescription: string
  sortOrder: number
  isPublished: boolean
}

const locales: Locale[] = ['en', 'es', 'ru']

function createEmptyRow(locale: Locale, sortOrder = 0): ServiceFormRow {
  return {
    id: '',
    locale,
    slug: '',
    title: '',
    excerpt: '',
    intro: '',
    seoTitle: '',
    seoDescription: '',
    sortOrder,
    isPublished: true,
  }
}

export default function AdminServicesPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])

  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [rowsByLocale, setRowsByLocale] = useState<Record<Locale, ServiceFormRow[]>>({
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

        const result = await (supabase.from('services') as any)
          .select(
            'id, locale, slug, title, excerpt, intro, seo_title, seo_description, sort_order, is_published'
          )
          .order('sort_order', { ascending: true })

        if (result.error) {
          throw new Error(result.error.message)
        }

        const nextRows: Record<Locale, ServiceFormRow[]> = {
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
            title: row.title ?? '',
            excerpt: row.excerpt ?? '',
            intro: row.intro ?? '',
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
          error instanceof Error ? error.message : 'Failed to load services'
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

  function updateRow(index: number, patch: Partial<ServiceFormRow>) {
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
          title: row.title.trim(),
          excerpt: row.excerpt.trim(),
          intro: row.intro.trim(),
          seo_title: row.seoTitle.trim() || null,
          seo_description: row.seoDescription.trim() || null,
          sort_order: Number(row.sortOrder || 0),
          is_published: row.isPublished,
        }

        if (row.id) {
          const result = await (supabase.from('services') as any)
            .update(payload)
            .eq('id', row.id)

          if (result.error) {
            throw new Error(result.error.message)
          }
        } else {
          const result = await (supabase.from('services') as any)
            .insert(payload)
            .select('id')
            .single()

          if (result.error) {
            throw new Error(result.error.message)
          }

          row.id = result.data?.id ?? ''
        }
      }

      setSuccessMessage(`Services saved for ${activeLocale.toUpperCase()}`)

      const reload = await (supabase.from('services') as any)
        .select(
          'id, locale, slug, title, excerpt, intro, seo_title, seo_description, sort_order, is_published'
        )
        .eq('locale', activeLocale)
        .order('sort_order', { ascending: true })

      if (!reload.error) {
        const rows = Array.isArray(reload.data) ? reload.data : []
        setRowsByLocale((prev) => ({
          ...prev,
          [activeLocale]: rows.map((row: any) => ({
            id: row.id ?? '',
            locale: activeLocale,
            slug: row.slug ?? '',
            title: row.title ?? '',
            excerpt: row.excerpt ?? '',
            intro: row.intro ?? '',
            seoTitle: row.seo_title ?? '',
            seoDescription: row.seo_description ?? '',
            sortOrder: Number(row.sort_order ?? 0),
            isPublished: Boolean(row.is_published ?? true),
          })),
        }))
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to save services'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const currentRows = rowsByLocale[activeLocale]

  if (isBooting) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: '#05070B',
          color: '#F5F7FB',
          padding: '24px 16px 40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ margin: 0, color: '#95A0B8', fontSize: 14 }}>
            Loading services...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#05070B',
        color: '#F5F7FB',
        padding: '20px 16px 40px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <a
            href="/admin/direct"
            style={{
              display: 'inline-block',
              marginBottom: 10,
              color: '#95A0B8',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            ← Back to dashboard
          </a>

          <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>
            Planetlocksmiths / Admin / Services
          </p>

          <h1 style={{ margin: '8px 0 0', fontSize: 32, lineHeight: 1.1 }}>
            Services
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
            + Add service
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>
          {currentRows.map((row, index) => (
            <div
              key={row.id || `${row.locale}-${index}`}
              style={{
                display: 'grid',
                gap: 12,
                background: '#0B1020',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: 18,
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
                <strong style={{ fontSize: 18 }}>Service #{index + 1}</strong>

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
                label="Title"
                value={row.title}
                onChange={(value) => updateRow(index, { title: value })}
              />

              <TextAreaField
                label="Excerpt"
                value={row.excerpt}
                onChange={(value) => updateRow(index, { excerpt: value })}
              />

              <TextAreaField
                label="Intro"
                value={row.intro}
                onChange={(value) => updateRow(index, { intro: value })}
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
              }}
            >
              {successMessage}
            </div>
          ) : null}

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
            {isSaving ? 'Saving...' : `Save ${activeLocale.toUpperCase()} Services`}
          </button>
        </form>
      </div>
    </main>
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
