'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'

type Locale = 'en' | 'es' | 'ru'
type PublishFilter = 'all' | 'published' | 'draft'

type ReviewFormRow = {
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

const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
}

function createEmptyRow(locale: Locale, sortOrder = 0): ReviewFormRow {
  return { id: '', locale, name: '', rating: 5, quote: '', date: '', city: '', sortOrder, isPublished: true }
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [rowsByLocale, setRowsByLocale] = useState<Record<Locale, ReviewFormRow[]>>({ en: [], es: [], ru: [] })
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
        if (!session) { router.replace('/admin/login'); return }

        const result = await (supabase.from('reviews') as any)
          .select('id, locale, name, rating, quote, date, city, sort_order, is_published')
          .order('sort_order', { ascending: true })

        if (result.error) throw new Error(result.error.message)

        const nextRows: Record<Locale, ReviewFormRow[]> = { en: [], es: [], ru: [] }
        const rows = Array.isArray(result.data) ? result.data : []

        for (const row of rows) {
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

        if (!mounted) return
        setRowsByLocale(nextRows)
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить отзывы')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => { mounted = false }
  }, [router, supabase])

  function updateRow(index: number, patch: Partial<ReviewFormRow>) {
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
      setSuccessMessage('Новый отзыв удалён из формы')
      return
    }

    const ok = window.confirm('Удалить этот отзыв навсегда?')
    if (!ok) return
    setDeletingId(row.id)

    try {
      const result = await (supabase.from('reviews') as any).delete().eq('id', row.id)
      if (result.error) throw new Error(result.error.message)
      setRowsByLocale((prev) => {
        const copy = [...prev[activeLocale]]
        copy.splice(index, 1)
        return { ...prev, [activeLocale]: copy }
      })
      setSuccessMessage('Отзыв удалён')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось удалить отзыв')
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
        const name = row.name.trim()
        const quote = row.quote.trim()
        const rating = Math.max(1, Math.min(5, Number(row.rating || 5)))

        if (!name && !quote && !row.city.trim()) continue

        const payload = {
          locale: row.locale,
          name,
          rating,
          quote,
          date: row.date.trim() || null,
          city: row.city.trim() || null,
          sort_order: Number(row.sortOrder || 0),
          is_published: row.isPublished,
        }

        if (row.id) {
          const result = await (supabase.from('reviews') as any).update(payload).eq('id', row.id)
          if (result.error) throw new Error(result.error.message)
        } else {
          const result = await (supabase.from('reviews') as any).insert(payload).select('id').single()
          if (result.error) throw new Error(result.error.message)
          row.id = result.data?.id ?? ''
        }
      }

      setSuccessMessage(`Отзывы сохранены: ${localeLabels[activeLocale]}`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось сохранить отзывы')
    } finally {
      setIsSaving(false)
    }
  }

  const currentRows = rowsByLocale[activeLocale]
  const filteredRows = currentRows.filter((row) => {
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || row.name.toLowerCase().includes(q) || row.city.toLowerCase().includes(q) || row.quote.toLowerCase().includes(q)
    const matchesPublish = publishFilter === 'all' ? true : publishFilter === 'published' ? row.isPublished : !row.isPublished
    return matchesSearch && matchesPublish
  })

  const publishedCount = currentRows.filter((row) => row.isPublished).length
  const draftCount = currentRows.length - publishedCount
  const averageRating = currentRows.length ? (currentRows.reduce((sum, row) => sum + Number(row.rating || 0), 0) / currentRows.length).toFixed(1) : '0.0'

  if (isBooting) return <div style={panelStyle}><p style={eyebrowStyle}>Отзывы</p><h1 style={titleStyle}>Загрузка...</h1></div>

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Доверие / отзывы клиентов</p>
          <h1 style={titleStyle}>Отзывы</h1>
          <p style={mutedStyle}>Управление отзывами для публичного сайта. Можно добавлять реальные отзывы клиентов, указывать город, дату, рейтинг и порядок вывода.</p>
        </div>
        <div style={heroActionsStyle}>
          {locales.map((locale) => <button key={locale} type="button" onClick={() => { setSuccessMessage(''); setErrorMessage(''); setActiveLocale(locale) }} style={localeButtonStyle(activeLocale === locale)}>{locale.toUpperCase()}</button>)}
          <button type="button" onClick={addRow} style={primaryButtonStyle}>+ Отзыв</button>
        </div>
      </section>

      <section style={statsGridStyle}>
        <InfoCard title="Язык" value={localeLabels[activeLocale]} note="Текущая версия отзывов." />
        <InfoCard title="Всего" value={String(currentRows.length)} note="Отзывы в выбранном языке." />
        <InfoCard title="Опубликовано" value={String(publishedCount)} note="Показываются на сайте." />
        <InfoCard title="Средний рейтинг" value={averageRating} note="Среднее значение по списку." />
        <InfoCard title="Черновики" value={String(draftCount)} note="Скрыты с сайта." />
      </section>

      <section style={guideStyle}>
        <p style={eyebrowStyle}>Подсказка</p>
        <p style={mutedStyle}>Используйте только реальные отзывы. Рейтинг автоматически ограничивается от 1 до 5. Жёстких лимитов на длину текста нет.</p>
      </section>

      <section style={filtersStyle}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск: имя, город, текст отзыва" style={inputStyle} />
        <select value={publishFilter} onChange={(e) => setPublishFilter(e.target.value as PublishFilter)} style={inputStyle}>
          <option value="all">Все отзывы</option>
          <option value="published">Опубликованные</option>
          <option value="draft">Черновики</option>
        </select>
      </section>

      {errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}
      {successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}

      <form id={FORM_ID} onSubmit={handleSave} style={formStyle}>
        {filteredRows.map((row) => {
          const realIndex = currentRows.indexOf(row)
          return (
            <article key={row.id || `${row.locale}-${realIndex}`} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ minWidth: 0 }}>
                  <p style={eyebrowStyle}>Отзыв #{realIndex + 1}</p>
                  <h2 style={cardTitleStyle}>{row.name || row.city || 'Новый отзыв'}</h2>
                  <p style={mutedStyle}>{'★'.repeat(Math.max(1, Math.min(5, Number(row.rating || 5))))}</p>
                </div>
                <button type="button" onClick={() => deleteRow(realIndex)} disabled={deletingId === row.id} style={dangerButtonStyle}>{deletingId === row.id ? 'Удаление...' : 'Удалить'}</button>
              </div>

              <div style={fieldGridStyle}>
                <Field label="Имя клиента" value={row.name} onChange={(value) => updateRow(realIndex, { name: value })} />
                <Field label="Город" value={row.city} onChange={(value) => updateRow(realIndex, { city: value })} />
                <Field label="Дата" value={row.date} onChange={(value) => updateRow(realIndex, { date: value })} />
                <Field label="Рейтинг 1–5" value={String(row.rating)} onChange={(value) => updateRow(realIndex, { rating: Number(value || 5) })} />
                <Field label="Порядок" value={String(row.sortOrder)} onChange={(value) => updateRow(realIndex, { sortOrder: Number(value || 0) })} />
              </div>

              <TextAreaField label="Текст отзыва" value={row.quote} onChange={(value) => updateRow(realIndex, { quote: value })} />

              <label style={switchStyle}>
                <input type="checkbox" checked={row.isPublished} onChange={(event) => updateRow(realIndex, { isPublished: event.target.checked })} />
                <span>{row.isPublished ? 'Опубликовано' : 'Черновик'}</span>
              </label>
            </article>
          )
        })}

        {!filteredRows.length ? <div style={emptyStateStyle}>Нет отзывов под текущий фильтр.</div> : null}
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label="Сохранить отзывы" note={`Сохраняется только текущий язык: ${localeLabels[activeLocale]}.`} />
    </div>
  )
}

function InfoCard({ title, value, note }: { title: string; value: string; note: string }) {
  return <article style={infoCardStyle}><p style={eyebrowStyle}>{title}</p><strong style={infoValueStyle}>{value}</strong><span style={infoNoteStyle}>{note}</span></article>
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label style={fieldStyle}><span style={labelStyle}>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} /></label>
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label style={fieldStyle}><span style={labelStyle}>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} style={textAreaStyle} /></label>
}

function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) {
  return <div style={type === 'error' ? messageErrorStyle : messageSuccessStyle}>{children}</div>
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0 }
const panelStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.035)', padding: 20 }
const heroStyle: CSSProperties = { ...panelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', background: 'radial-gradient(circle at 0% 0%, rgba(45,226,230,0.14), transparent 320px), rgba(255,255,255,0.035)' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const titleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 'clamp(34px, 6vw, 58px)', lineHeight: 0.96, letterSpacing: -2.2 }
const mutedStyle: CSSProperties = { margin: '10px 0 0', color: '#95A0B8', fontSize: 14, lineHeight: 1.7, maxWidth: 760 }
const heroActionsStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
function localeButtonStyle(active: boolean): CSSProperties { return { minHeight: 44, padding: '0 15px', borderRadius: 999, border: active ? '1px solid rgba(45,226,230,0.5)' : '1px solid rgba(255,255,255,0.12)', background: active ? 'rgba(45,226,230,0.16)' : 'rgba(255,255,255,0.035)', color: active ? '#2DE2E6' : '#F5F7FB', fontWeight: 900 } }
const primaryButtonStyle: CSSProperties = { minHeight: 44, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(77,162,255,0.45)', background: '#4DA2FF', color: '#02040A', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.1 }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }
const infoCardStyle: CSSProperties = { borderRadius: 22, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(17,25,46,0.82), rgba(5,7,11,0.72))', padding: 16, display: 'grid', gap: 8, minWidth: 0 }
const infoValueStyle: CSSProperties = { color: '#F5F7FB', fontSize: 20, lineHeight: 1.15, wordBreak: 'break-word' }
const infoNoteStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, lineHeight: 1.5 }
const guideStyle: CSSProperties = { ...panelStyle, padding: 16 }
const filtersStyle: CSSProperties = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }
const formStyle: CSSProperties = { display: 'grid', gap: 16 }
const cardStyle: CSSProperties = { borderRadius: 24, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(11,16,32,0.86), rgba(5,7,11,0.78))', padding: 18, display: 'grid', gap: 14 }
const cardHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }
const cardTitleStyle: CSSProperties = { margin: '6px 0 0', color: '#F5F7FB', fontSize: 24, lineHeight: 1.12, wordBreak: 'break-word' }
const fieldGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }
const fieldStyle: CSSProperties = { display: 'grid', gap: 8 }
const labelStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, fontWeight: 800 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 50, borderRadius: 15, border: '1px solid rgba(255,255,255,0.11)', background: 'rgba(7,11,20,0.82)', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const textAreaStyle: CSSProperties = { ...inputStyle, minHeight: 120, padding: '12px 14px', resize: 'vertical' }
const switchStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', gap: 10, color: '#F5F7FB', fontWeight: 800 }
const dangerButtonStyle: CSSProperties = { minHeight: 40, padding: '0 13px', borderRadius: 999, border: '1px solid rgba(255,122,122,0.28)', background: 'rgba(255,122,122,0.06)', color: '#FF9A9A', fontWeight: 900 }
const messageErrorStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const messageSuccessStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(45,226,230,0.25)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const emptyStateStyle: CSSProperties = { borderRadius: 22, border: '1px dashed rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.025)', padding: 18, color: '#95A0B8', fontSize: 14, lineHeight: 1.7 }
