'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'
import { getDefaultReviews } from '@/lib/site-defaults'
import { getSupabaseClient } from '@/lib/supabase/client'

type Locale = 'en' | 'es' | 'ru'

type ReviewRow = {
  id: string
  locale: Locale
  name: string
  rating: number
  quote: string
  date: string
  city: string
  sortOrder: number
  isPublished: boolean
}

const locales: Locale[] = ['en', 'es', 'ru']
const FORM_ID = 'admin-reviews-form'
const labels: Record<Locale, string> = { en: 'English', es: 'Español', ru: 'Русский' }

function blank(locale: Locale, sortOrder = 0): ReviewRow {
  return { id: '', locale, name: '', rating: 5, quote: '', date: '', city: '', sortOrder, isPublished: true }
}

function presets(locale: Locale): ReviewRow[] {
  return getDefaultReviews(locale).map((review, index) => ({
    id: '',
    locale,
    name: review.name,
    rating: review.rating,
    quote: review.quote,
    date: review.date || '',
    city: review.city || '',
    sortOrder: index,
    isPublished: true,
  }))
}

function keyOf(row: Pick<ReviewRow, 'name' | 'quote'>) {
  return `${row.name} ${row.quote}`.trim().replace(/\s+/g, ' ').toLowerCase()
}

function mergeWithPresets(locale: Locale, rows: ReviewRow[]) {
  const byKey = new Map<string, ReviewRow>()
  for (const row of rows) {
    const key = keyOf(row)
    if (key && !byKey.has(key)) byKey.set(key, row)
  }
  const presetRows = presets(locale)
  const presetKeys = new Set(presetRows.map(keyOf))
  const customRows = rows.filter((row) => keyOf(row) && !presetKeys.has(keyOf(row)))
  return [...presetRows.map((row) => byKey.get(keyOf(row)) ?? row), ...customRows].sort((a, b) => a.sortOrder - b.sortOrder)
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [rowsByLocale, setRowsByLocale] = useState<Record<Locale, ReviewRow[]>>({
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

        const result = await (supabase.from('reviews') as any)
          .select('id, locale, name, rating, quote, date, city, sort_order, is_published')
          .order('sort_order', { ascending: true })

        if (result.error) throw new Error(result.error.message)

        const nextRows: Record<Locale, ReviewRow[]> = { en: [], es: [], ru: [] }
        for (const row of Array.isArray(result.data) ? result.data : []) {
          const locale = row.locale as Locale
          if (!locales.includes(locale)) continue
          nextRows[locale].push({
            id: row.id ?? '',
            locale,
            name: row.name ?? '',
            rating: Number(row.rating ?? 5),
            quote: row.quote ?? '',
            date: row.date ?? '',
            city: row.city ?? '',
            sortOrder: Number(row.sort_order ?? 0),
            isPublished: Boolean(row.is_published ?? true),
          })
        }

        for (const locale of locales) nextRows[locale] = mergeWithPresets(locale, nextRows[locale])
        if (mounted) setRowsByLocale(nextRows)
      } catch (error) {
        if (mounted) setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить отзывы')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => { mounted = false }
  }, [router, supabase])

  function setRow(index: number, patch: Partial<ReviewRow>) {
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
      setRowsByLocale((previous) => {
        const rows = [...previous[activeLocale]]
        rows.splice(index, 1)
        return { ...previous, [activeLocale]: rows }
      })
      setSuccessMessage('Отзыв удалён из формы')
      return
    }

    if (!window.confirm('Удалить этот отзыв навсегда?')) return
    const result = await (supabase.from('reviews') as any).delete().eq('id', row.id)
    if (result.error) {
      setErrorMessage(result.error.message)
      return
    }
    setRowsByLocale((previous) => ({ ...previous, [activeLocale]: previous[activeLocale].filter((item) => item.id !== row.id) }))
    setSuccessMessage('Отзыв удалён')
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      for (const row of rowsByLocale[activeLocale]) {
        const payload = {
          locale: row.locale,
          name: row.name.trim(),
          rating: Math.max(1, Math.min(5, Number(row.rating || 5))),
          quote: row.quote.trim(),
          date: row.date.trim() || null,
          city: row.city.trim() || null,
          sort_order: Number(row.sortOrder || 0),
          is_published: row.isPublished,
        }
        if (!payload.name && !payload.quote && !payload.city) continue

        const result = row.id
          ? await (supabase.from('reviews') as any).update(payload).eq('id', row.id)
          : await (supabase.from('reviews') as any).insert(payload).select('id').single()
        if (result.error) throw new Error(result.error.message)
        if (!row.id) row.id = result.data?.id ?? ''
      }

      setSuccessMessage(`Отзывы сохранены: ${labels[activeLocale]}`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось сохранить отзывы')
    } finally {
      setIsSaving(false)
    }
  }

  const rows = rowsByLocale[activeLocale]

  if (isBooting) return <section style={panelStyle}>Загрузка отзывов...</section>

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Отзывы клиентов</p>
          <h1 style={titleStyle}>Reviews CMS</h1>
          <p style={mutedStyle}>Стандартные отзывы широкого locksmith scope уже подставлены. Отредактируй текст и сохрани, чтобы они управлялись из Supabase.</p>
        </div>
        <div style={actionsStyle}>
          {locales.map((locale) => (
            <button key={locale} type="button" onClick={() => setActiveLocale(locale)} style={tabStyle(activeLocale === locale)}>{locale.toUpperCase()}</button>
          ))}
          <button type="button" onClick={addRow} style={buttonStyle}>+ отзыв</button>
        </div>
      </header>

      {errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null}
      {successMessage ? <div style={successStyle}>{successMessage}</div> : null}

      <form id={FORM_ID} onSubmit={save} style={listStyle}>
        {rows.map((row, index) => (
          <article key={row.id || `${row.locale}-${index}`} style={cardStyle}>
            <div style={cardHeaderStyle}>
              <strong>#{index + 1} {row.name || 'Новый отзыв'}</strong>
              <label style={checkStyle}><input type="checkbox" checked={row.isPublished} onChange={(event) => setRow(index, { isPublished: event.target.checked })} /> published</label>
            </div>
            <div style={gridStyle}>
              <Field label="Имя" value={row.name} onChange={(value) => setRow(index, { name: value })} />
              <Field label="Город" value={row.city} onChange={(value) => setRow(index, { city: value })} />
              <Field label="Дата" value={row.date} onChange={(value) => setRow(index, { date: value })} />
              <Field label="Рейтинг" value={String(row.rating)} onChange={(value) => setRow(index, { rating: Number(value || 5) })} />
              <Field label="Порядок" value={String(row.sortOrder)} onChange={(value) => setRow(index, { sortOrder: Number(value || 0) })} />
            </div>
            <label style={fieldStyle}>
              <span style={labelStyle}>Текст отзыва</span>
              <textarea value={row.quote} onChange={(event) => setRow(index, { quote: event.target.value })} rows={4} style={textareaStyle} />
            </label>
            <button type="button" onClick={() => deleteRow(index)} style={dangerStyle}>Удалить</button>
          </article>
        ))}
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label="Сохранить отзывы" note={`Язык: ${labels[activeLocale]}. Опубликованные отзывы идут на публичный сайт.`} />
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

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0 }
const panelStyle: CSSProperties = { border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: 20, color: '#F5F7FB' }
const headerStyle: CSSProperties = { ...panelStyle, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }
const titleStyle: CSSProperties = { margin: '6px 0 0', color: '#F5F7FB', fontSize: 42, lineHeight: 1 }
const mutedStyle: CSSProperties = { margin: '10px 0 0', color: '#95A0B8', lineHeight: 1.6, maxWidth: 760 }
const actionsStyle: CSSProperties = { display: 'flex', gap: 10, flexWrap: 'wrap' }
const buttonStyle: CSSProperties = { minHeight: 42, borderRadius: 999, border: '1px solid rgba(77,162,255,.45)', background: '#4DA2FF', color: '#02040A', fontWeight: 900, padding: '0 16px' }
const dangerStyle: CSSProperties = { ...buttonStyle, background: 'rgba(255,122,122,.08)', color: '#FF9A9A', borderColor: 'rgba(255,122,122,.3)', justifySelf: 'start' }
const tabStyle = (active: boolean): CSSProperties => ({ ...buttonStyle, background: active ? 'rgba(45,226,230,.16)' : 'rgba(255,255,255,.04)', color: active ? '#2DE2E6' : '#F5F7FB', borderColor: active ? 'rgba(45,226,230,.5)' : 'rgba(255,255,255,.12)' })
const listStyle: CSSProperties = { display: 'grid', gap: 14 }
const cardStyle: CSSProperties = { ...panelStyle, display: 'grid', gap: 14, background: 'rgba(255,255,255,.035)' }
const cardHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', color: '#F5F7FB' }
const gridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }
const fieldStyle: CSSProperties = { display: 'grid', gap: 6, minWidth: 0 }
const labelStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, fontWeight: 800 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 46, boxSizing: 'border-box', borderRadius: 14, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(7,11,20,.82)', color: '#F5F7FB', padding: '0 12px' }
const textareaStyle: CSSProperties = { ...inputStyle, minHeight: 110, padding: 12, resize: 'vertical' }
const checkStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, color: '#F5F7FB', fontWeight: 800 }
const errorStyle: CSSProperties = { ...panelStyle, color: '#FF9A9A', borderColor: 'rgba(255,122,122,.3)' }
const successStyle: CSSProperties = { ...panelStyle, color: '#2DE2E6', borderColor: 'rgba(45,226,230,.3)' }
