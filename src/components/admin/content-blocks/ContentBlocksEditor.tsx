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

const localeLabels: Record<AdminContentBlockLocale, string> = {
  en: 'English',
  es: 'Español',
}

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
  if (!row.pageKey.trim()) notes.push('Не указана страница')
  if (!row.slot.trim()) notes.push('Не указан слот блока')
  if (row.isPublished && !hasContent) notes.push('Опубликованный блок пустой')
  if (row.ctaLabel.trim() && !row.ctaHref.trim()) notes.push('Есть текст кнопки, но нет ссылки')
  if (row.ctaHref.trim() && !row.ctaLabel.trim()) notes.push('Есть ссылка кнопки, но нет текста кнопки')
  if (!notes.length) return { label: 'Готово', tone: 'good', notes: ['Готово к публикации'] }
  const danger = notes.some((note) => note.includes('Не указан') || note.includes('пустой'))
  return { label: danger ? 'Исправить' : 'Проверить', tone: danger ? 'danger' : 'warn', notes }
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
        if (mounted) setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить контент-блоки')
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
    setSuccessMessage(`Шаблон добавлен: ${activePreset.label}. Проверьте текст и сохраните.`)
  }

  async function deleteRow(index: number) {
    setErrorMessage('')
    setSuccessMessage('')
    const row = rowsByLocale[activeLocale][index]
    if (!row) return
    if (!row.id) {
      setRowsByLocale((prev) => { const copy = [...prev[activeLocale]]; copy.splice(index, 1); return { ...prev, [activeLocale]: copy } })
      setSuccessMessage('Новый блок удалён из формы')
      return
    }
    if (!window.confirm('Удалить этот контент-блок навсегда?')) return
    setDeletingId(row.id)
    try {
      const result = await supabase.from('site_content_blocks').delete().eq('id', row.id)
      if (result.error) throw new Error(result.error.message)
      setRowsByLocale((prev) => { const copy = [...prev[activeLocale]]; copy.splice(index, 1); return { ...prev, [activeLocale]: copy } })
      setSuccessMessage('Контент-блок удалён')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось удалить контент-блок')
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
        if (!pageKey && !slot && !row.title.trim() && !row.body.trim() && !row.itemsText.trim()) continue
        if (!pageKey) throw new Error('Для сохранения блока нужна страница.')
        if (!slot) throw new Error('Для сохранения блока нужен слот.')
        const payload = { locale: row.locale, page_key: pageKey, slot, eyebrow: row.eyebrow.trim() || null, title: row.title.trim() || null, body: row.body.trim() || null, items: row.itemsText.split('\n').map((item) => item.trim()).filter(Boolean), cta_label: row.ctaLabel.trim() || null, cta_href: row.ctaHref.trim() || null, sort_order: Number(row.sortOrder || 0), is_published: row.isPublished }
        if (row.id) {
          const result = await supabase.from('site_content_blocks').update(payload).eq('id', row.id)
          if (result.error) throw new Error(result.error.message)
        } else {
          const result = await supabase.from('site_content_blocks').insert(payload).select('id').single()
          if (result.error) throw new Error(result.error.message)
          row.id = result.data?.id ?? ''
        }
      }
      setSuccessMessage(`Контент-блоки сохранены: ${localeLabels[activeLocale]}`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось сохранить контент-блоки')
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
  const publishedCount = currentRows.filter((row) => row.isPublished).length

  if (isBooting) return <div style={panelStyle}><p style={eyebrowStyle}>Блоки</p><h1 style={titleStyle}>Загрузка...</h1></div>

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Контент / модульные блоки</p>
          <h1 style={titleStyle}>Контент-блоки</h1>
          <p style={mutedStyle}>Редактор reusable-блоков сайта: секции, CTA, списки, карточки и текстовые модули. Можно стартовать с шаблона или создать пустой блок.</p>
        </div>
        <div style={heroActionsStyle}>
          {locales.map((locale) => <button key={locale} type="button" onClick={() => { setActiveLocale(locale); setSuccessMessage(''); setErrorMessage('') }} style={localeButtonStyle(activeLocale === locale)}>{locale.toUpperCase()}</button>)}
          <button type="button" onClick={addBlankRow} style={secondaryButtonStyle}>+ Пустой</button>
        </div>
      </section>

      <section style={statsGridStyle}>
        <InfoCard title="Язык" value={localeLabels[activeLocale]} note="Текущая версия блоков." />
        <InfoCard title="Всего" value={String(currentRows.length)} note="Блоки в выбранном языке." />
        <InfoCard title="Опубликовано" value={String(publishedCount)} note="Показываются на сайте." />
        <InfoCard title="Готово" value={String(readyCount)} note="Без критичных замечаний." />
        <InfoCard title="Проверить" value={String(issueCount)} note="Есть предупреждения." />
      </section>

      <section style={guideStyle}>
        <p style={eyebrowStyle}>Подсказка</p>
        <p style={mutedStyle}>Page key определяет страницу, slot — место или тип модуля. Items вводятся построчно. Жёстких лимитов по длине нет, но пустой опубликованный блок лучше не оставлять.</p>
      </section>

      <section style={presetPanelStyle}>
        <div style={fieldGridStyle}>
          <label style={fieldStyle}><span style={labelStyle}>Группа шаблонов</span><select value={selectedGroup} onChange={(event) => setSelectedGroup(event.target.value)} style={inputStyle}>{adminContentBlockPresetGroups.map((group) => <option key={group} value={group}>{group}</option>)}</select></label>
          <label style={fieldStyle}><span style={labelStyle}>Шаблон блока</span><select value={selectedPreset} onChange={(event) => setSelectedPreset(event.target.value)} style={inputStyle}>{visiblePresets.map((preset) => <option key={preset.label} value={preset.label}>{preset.label}</option>)}</select></label>
        </div>
        <PresetPreview preset={activePreset} />
        <button type="button" onClick={addPresetRow} style={primaryButtonStyle}>+ Добавить выбранный шаблон</button>
      </section>

      <section style={filterGridStyle}>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск: страница, слот, заголовок, текст" style={inputStyle} />
        <select value={pageKeyFilter} onChange={(event) => setPageKeyFilter(event.target.value)} style={inputStyle}><option value="all">Все страницы</option>{adminContentBlockKnownPageKeys.map((key) => <option key={key} value={key}>{key}</option>)}</select>
        <select value={publishFilter} onChange={(event) => setPublishFilter(event.target.value as AdminContentBlockPublishFilter)} style={inputStyle}><option value="all">Все блоки</option><option value="published">Опубликованные</option><option value="draft">Черновики</option></select>
      </section>

      {errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}
      {successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}

      <form id={FORM_ID} onSubmit={handleSave} style={formStyle}>
        {filteredRows.map((row) => {
          const index = currentRows.indexOf(row)
          return <ContentBlockEditor key={row.id || `${row.locale}-${index}`} row={row} index={index} deletingId={deletingId} onPatch={(patch) => updateRow(index, patch)} onDelete={() => deleteRow(index)} />
        })}
        {!filteredRows.length ? <div style={emptyStateStyle}>Нет блоков под текущий фильтр.</div> : null}
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label="Сохранить блоки" note={`Сохраняется только текущий язык: ${localeLabels[activeLocale]}.`} />
    </div>
  )
}

function InfoCard({ title, value, note }: { title: string; value: string; note: string }) {
  return <article style={infoCardStyle}><p style={eyebrowStyle}>{title}</p><strong style={infoValueStyle}>{value}</strong><span style={infoNoteStyle}>{note}</span></article>
}

function PresetPreview({ preset }: { preset: AdminContentBlockPreset }) {
  const items = preset.itemsText?.split('\n').filter(Boolean) ?? []
  return <div style={previewStyle}><p style={previewKickerStyle}>{preset.group} · {preset.usedOn}</p><h3 style={previewTitleStyle}>{preset.label}</h3><p style={previewTextStyle}>{preset.description}</p><p style={previewMetaStyle}>Поля: {preset.fields}</p><div style={miniCardStyle}>{preset.eyebrow ? <p style={previewKickerStyle}>{preset.eyebrow}</p> : null}{preset.title ? <strong style={{ display: 'block', marginTop: 6 }}>{preset.title}</strong> : null}{preset.body ? <p style={previewTextStyle}>{preset.body}</p> : null}{items.length ? <ul style={listStyle}>{items.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul> : null}</div></div>
}

function ContentBlockEditor({ row, index, deletingId, onPatch, onDelete }: { row: AdminContentBlockRow; index: number; deletingId: string | null; onPatch: (patch: Partial<AdminContentBlockRow>) => void; onDelete: () => void }) {
  const health = getBlockHealth(row)
  return <article style={cardStyle}><div style={cardHeaderStyle}><div><p style={eyebrowStyle}>Блок #{index + 1}</p><h2 style={cardTitleStyle}>{row.title || row.slot || 'Новый блок'}</h2><p style={mutedStyle}>{row.pageKey || 'Без страницы'} / {row.slot || 'Без слота'}</p></div><div style={cardActionsStyle}><span style={healthPillStyle(health.tone)}>{health.label}</span><span style={row.isPublished ? readyPillStyle : summaryPillStyle}>{row.isPublished ? 'Опубликовано' : 'Черновик'}</span><button type="button" onClick={onDelete} disabled={deletingId === row.id} style={dangerButtonStyle}>{deletingId === row.id ? 'Удаление...' : 'Удалить'}</button></div></div>{health.tone !== 'good' ? <div style={warningBoxStyle}>{health.notes.map((note) => <div key={note}>• {note}</div>)}</div> : null}<div style={fieldGridStyle}><Field label="Страница / page key" value={row.pageKey} onChange={(value) => onPatch({ pageKey: value })} /><Field label="Слот / module slot" value={row.slot} onChange={(value) => onPatch({ slot: value })} /><Field label="Порядок" value={String(row.sortOrder)} onChange={(value) => onPatch({ sortOrder: Number(value || 0) })} /></div><Field label="Eyebrow / маленькая подпись" value={row.eyebrow} onChange={(value) => onPatch({ eyebrow: value })} /><Field label="Заголовок" value={row.title} onChange={(value) => onPatch({ title: value })} /><TextAreaField label="Основной текст" value={row.body} onChange={(value) => onPatch({ body: value })} /><TextAreaField label="Список — один пункт в строке" value={row.itemsText} onChange={(value) => onPatch({ itemsText: value })} /><div style={fieldGridStyle}><Field label="Текст кнопки" value={row.ctaLabel} onChange={(value) => onPatch({ ctaLabel: value })} /><Field label="Ссылка кнопки" value={row.ctaHref} onChange={(value) => onPatch({ ctaHref: value })} /></div><ModulePreview row={row} /><label style={switchStyle}><input type="checkbox" checked={row.isPublished} onChange={(event) => onPatch({ isPublished: event.target.checked })} /><span>{row.isPublished ? 'Опубликовано' : 'Черновик'}</span></label></article>
}

function ModulePreview({ row }: { row: AdminContentBlockRow }) {
  const items = row.itemsText.split('\n').map((item) => item.trim()).filter(Boolean)
  return <div style={miniCardStyle}><p style={previewKickerStyle}>Preview</p>{row.eyebrow ? <p style={{ ...previewKickerStyle, marginTop: 10 }}>{row.eyebrow}</p> : null}{row.title ? <strong style={{ display: 'block', marginTop: 6 }}>{row.title}</strong> : null}{row.body ? <p style={previewTextStyle}>{row.body}</p> : null}{items.length ? <ul style={listStyle}>{items.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul> : null}{row.ctaLabel ? <p style={previewCtaStyle}>{row.ctaLabel}</p> : null}{!row.eyebrow && !row.title && !row.body && !items.length && !row.ctaLabel ? <p style={previewTextStyle}>Превью появится после заполнения блока.</p> : null}</div>
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label style={fieldStyle}><span style={labelStyle}>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} /></label>
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label style={fieldStyle}><span style={labelStyle}>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} style={textAreaStyle} /></label>
}

function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) {
  return <div style={type === 'error' ? messageErrorStyle : messageSuccessStyle}>{children}</div>
}

function healthPillStyle(tone: BlockHealth['tone']): CSSProperties {
  return tone === 'good' ? readyPillStyle : tone === 'warn' ? warningPillStyle : dangerPillStyle
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0 }
const panelStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.035)', padding: 20 }
const heroStyle: CSSProperties = { ...panelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', background: 'radial-gradient(circle at 0% 0%, rgba(45,226,230,0.14), transparent 320px), rgba(255,255,255,0.035)' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const titleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 'clamp(34px, 6vw, 58px)', lineHeight: 0.96, letterSpacing: -2.2 }
const mutedStyle: CSSProperties = { margin: '10px 0 0', color: '#95A0B8', fontSize: 14, lineHeight: 1.7, maxWidth: 760 }
const heroActionsStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
function localeButtonStyle(active: boolean): CSSProperties { return { minHeight: 44, padding: '0 15px', borderRadius: 999, border: active ? '1px solid rgba(45,226,230,0.5)' : '1px solid rgba(255,255,255,0.12)', background: active ? 'rgba(45,226,230,0.16)' : 'rgba(255,255,255,0.035)', color: active ? '#2DE2E6' : '#F5F7FB', fontWeight: 900 } }
const secondaryButtonStyle: CSSProperties = { minHeight: 44, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.035)', color: '#F5F7FB', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.1 }
const primaryButtonStyle: CSSProperties = { minHeight: 48, padding: '0 16px', borderRadius: 999, border: '1px solid rgba(77,162,255,0.45)', background: '#4DA2FF', color: '#02040A', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.1 }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }
const infoCardStyle: CSSProperties = { borderRadius: 22, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(17,25,46,0.82), rgba(5,7,11,0.72))', padding: 16, display: 'grid', gap: 8, minWidth: 0 }
const infoValueStyle: CSSProperties = { color: '#F5F7FB', fontSize: 20, lineHeight: 1.15, wordBreak: 'break-word' }
const infoNoteStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, lineHeight: 1.5 }
const guideStyle: CSSProperties = { ...panelStyle, padding: 16 }
const fieldGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }
const filterGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }
const formStyle: CSSProperties = { display: 'grid', gap: 16 }
const presetPanelStyle: CSSProperties = { borderRadius: 24, border: '1px solid rgba(77,162,255,0.20)', background: 'linear-gradient(145deg, rgba(17,25,46,0.82), rgba(5,7,11,0.72))', padding: 18, display: 'grid', gap: 14 }
const previewStyle: CSSProperties = { borderRadius: 18, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)', padding: 14 }
const previewTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 20, lineHeight: 1.12 }
const previewTextStyle: CSSProperties = { margin: '10px 0 0', color: '#95A0B8', lineHeight: 1.6, fontSize: 14 }
const previewMetaStyle: CSSProperties = { margin: '10px 0 0', color: '#A9D0FF', fontSize: 13 }
const miniCardStyle: CSSProperties = { marginTop: 12, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)', padding: 14 }
const previewKickerStyle: CSSProperties = { margin: 0, color: '#4DA2FF', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.8 }
const listStyle: CSSProperties = { margin: '10px 0 0', paddingLeft: 18, color: '#95A0B8', lineHeight: 1.55 }
const previewCtaStyle: CSSProperties = { margin: '10px 0 0', color: '#4DA2FF', fontWeight: 900 }
const cardStyle: CSSProperties = { borderRadius: 24, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(11,16,32,0.86), rgba(5,7,11,0.78))', padding: 18, display: 'grid', gap: 14 }
const cardHeaderStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }
const cardActionsStyle: CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }
const cardTitleStyle: CSSProperties = { margin: '6px 0 0', color: '#F5F7FB', fontSize: 24, lineHeight: 1.12, wordBreak: 'break-word' }
const fieldStyle: CSSProperties = { display: 'grid', gap: 8 }
const labelStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, fontWeight: 800 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 50, borderRadius: 15, border: '1px solid rgba(255,255,255,0.11)', background: 'rgba(7,11,20,0.82)', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const textAreaStyle: CSSProperties = { ...inputStyle, minHeight: 130, padding: '12px 14px', resize: 'vertical' }
const switchStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', gap: 10, color: '#F5F7FB', fontWeight: 800 }
const summaryPillStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', minHeight: 28, borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.045)', color: '#95A0B8', padding: '0 10px', fontSize: 12, fontWeight: 800 }
const readyPillStyle: CSSProperties = { ...summaryPillStyle, border: '1px solid rgba(45,226,230,0.24)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6' }
const warningPillStyle: CSSProperties = { ...summaryPillStyle, border: '1px solid rgba(214,168,95,0.28)', background: 'rgba(214,168,95,0.09)', color: '#D6A85F' }
const dangerPillStyle: CSSProperties = { ...summaryPillStyle, border: '1px solid rgba(255,122,122,0.28)', background: 'rgba(255,122,122,0.09)', color: '#FF9A9A' }
const warningBoxStyle: CSSProperties = { borderRadius: 14, border: '1px solid rgba(214,168,95,0.22)', background: 'rgba(214,168,95,0.08)', color: '#F4C983', padding: 12, fontSize: 13, lineHeight: 1.55 }
const dangerButtonStyle: CSSProperties = { minHeight: 40, padding: '0 13px', borderRadius: 999, border: '1px solid rgba(255,122,122,0.28)', background: 'rgba(255,122,122,0.06)', color: '#FF9A9A', fontWeight: 900 }
const messageErrorStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const messageSuccessStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(45,226,230,0.25)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const emptyStateStyle: CSSProperties = { borderRadius: 22, border: '1px dashed rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.025)', padding: 18, color: '#95A0B8', fontSize: 14, lineHeight: 1.7 }
