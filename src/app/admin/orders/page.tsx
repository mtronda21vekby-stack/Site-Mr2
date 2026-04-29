'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

type OrderRow = {
  id: string
  name: string
  phone: string
  email: string
  service_needed: string
  vehicle_make_model: string
  vehicle_year: string
  location: string
  urgency: string
  preferred_time: string
  message: string
  status: string
  admin_note: string
  assigned_to: string
  created_at: string
}

const statusOptions = ['new', 'contacted', 'scheduled', 'in_progress', 'completed', 'cancelled']
const urgencyOptions = ['all', 'asap', 'same_day', 'scheduled', 'normal', 'urgent']

const statusLabels: Record<string, string> = {
  all: 'Все статусы',
  new: 'Новая',
  contacted: 'Связались',
  scheduled: 'Назначена',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена',
}

const urgencyLabels: Record<string, string> = {
  all: 'Любая срочность',
  asap: 'Срочно / сейчас',
  same_day: 'Сегодня',
  scheduled: 'По записи',
  normal: 'Обычная',
  urgent: 'Срочная',
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [rows, setRows] = useState<OrderRow[]>([])
  const [isBooting, setIsBooting] = useState(true)
  const [isSavingId, setIsSavingId] = useState<string | null>(null)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')

  useEffect(() => {
    let mounted = true

    async function boot() {
      try {
        setErrorMessage('')
        setSuccessMessage('')

        const sessionResult = await supabase.auth.getSession()
        const session = sessionResult?.data?.session
        if (!session) { router.replace('/admin/login'); return }

        const result = await (supabase.from('orders') as any)
          .select('id, name, phone, email, service_needed, vehicle_make_model, vehicle_year, location, urgency, preferred_time, message, status, admin_note, assigned_to, created_at')
          .order('created_at', { ascending: false })

        if (result.error) throw new Error(result.error.message)
        if (!mounted) return

        setRows(Array.isArray(result.data) ? result.data.map((row: any) => ({
          id: row.id ?? '',
          name: row.name ?? '',
          phone: row.phone ?? '',
          email: row.email ?? '',
          service_needed: row.service_needed ?? '',
          vehicle_make_model: row.vehicle_make_model ?? '',
          vehicle_year: row.vehicle_year ?? '',
          location: row.location ?? '',
          urgency: row.urgency ?? 'normal',
          preferred_time: row.preferred_time ?? '',
          message: row.message ?? '',
          status: row.status ?? 'new',
          admin_note: row.admin_note ?? '',
          assigned_to: row.assigned_to ?? '',
          created_at: row.created_at ?? '',
        })) : [])
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить заявки')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => { mounted = false }
  }, [router, supabase])

  function updateRow(id: string, patch: Partial<OrderRow>) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  async function saveRow(id: string) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsSavingId(id)

    try {
      const row = rows.find((item) => item.id === id)
      if (!row) throw new Error('Заявка не найдена')

      const result = await (supabase.from('orders') as any)
        .update({
          status: row.status,
          admin_note: row.admin_note.trim() || null,
          assigned_to: row.assigned_to.trim() || null,
        })
        .eq('id', row.id)

      if (result.error) throw new Error(result.error.message)
      setSuccessMessage(`Заявка ${id.slice(0, 8)} сохранена`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось сохранить заявку')
    } finally {
      setIsSavingId(null)
    }
  }

  async function deleteRow(id: string) {
    const ok = window.confirm('Удалить эту заявку навсегда? Действие нельзя отменить.')
    if (!ok) return

    setErrorMessage('')
    setSuccessMessage('')
    setIsDeletingId(id)

    try {
      const result = await (supabase.from('orders') as any).delete().eq('id', id)
      if (result.error) throw new Error(result.error.message)
      setRows((prev) => prev.filter((row) => row.id !== id))
      setSuccessMessage(`Заявка ${id.slice(0, 8)} удалена`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось удалить заявку')
    } finally {
      setIsDeletingId(null)
    }
  }

  const filteredRows = rows.filter((row) => {
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || row.name.toLowerCase().includes(q) || row.phone.toLowerCase().includes(q) || row.email.toLowerCase().includes(q) || row.service_needed.toLowerCase().includes(q) || row.location.toLowerCase().includes(q) || row.vehicle_make_model.toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'all' ? true : row.status === statusFilter
    const matchesUrgency = urgencyFilter === 'all' ? true : row.urgency === urgencyFilter
    return matchesSearch && matchesStatus && matchesUrgency
  })

  const newCount = rows.filter((row) => row.status === 'new').length
  const activeCount = rows.filter((row) => ['contacted', 'scheduled', 'in_progress'].includes(row.status)).length
  const completedCount = rows.filter((row) => row.status === 'completed').length

  if (isBooting) return <div style={panelStyle}><p style={eyebrowStyle}>Заявки</p><h1 style={titleStyle}>Загрузка...</h1></div>

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Клиенты / заявки</p>
          <h1 style={titleStyle}>Заявки клиентов</h1>
          <p style={mutedStyle}>Контроль обращений с сайта: статус, исполнитель, заметки, срочность и контактные данные клиента.</p>
        </div>
        <button type="button" onClick={() => window.location.reload()} style={refreshButtonStyle}>Обновить</button>
      </section>

      <section style={statsGridStyle}>
        <StatBlock title="Всего" value={String(rows.length)} />
        <StatBlock title="Новые" value={String(newCount)} />
        <StatBlock title="Активные" value={String(activeCount)} />
        <StatBlock title="Завершено" value={String(completedCount)} />
      </section>

      <section style={filtersStyle}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск: имя, телефон, email, услуга, адрес, авто" style={inputStyle} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
          <option value="all">Все статусы</option>
          {statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status] ?? status}</option>)}
        </select>
        <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} style={inputStyle}>
          {urgencyOptions.map((urgency) => <option key={urgency} value={urgency}>{urgencyLabels[urgency] ?? urgency}</option>)}
        </select>
      </section>

      {errorMessage ? <div style={messageErrorStyle}>{errorMessage}</div> : null}
      {successMessage ? <div style={messageSuccessStyle}>{successMessage}</div> : null}

      <section style={listStyle}>
        {filteredRows.map((row) => (
          <article key={row.id} style={orderCardStyle}>
            <div style={orderHeadStyle}>
              <div style={{ minWidth: 0 }}>
                <p style={eyebrowStyle}>{urgencyLabels[row.urgency] ?? row.urgency}</p>
                <h2 style={orderTitleStyle}>{row.service_needed || 'Заявка'}</h2>
                <p style={mutedStyle}>{row.created_at || 'Дата не указана'}</p>
              </div>
              <button type="button" onClick={() => deleteRow(row.id)} disabled={isDeletingId === row.id} style={deleteButtonStyle(isDeletingId === row.id)}>
                {isDeletingId === row.id ? 'Удаление...' : 'Удалить'}
              </button>
            </div>

            <div style={detailsGridStyle}>
              <Info label="Имя" value={row.name} />
              <Info label="Телефон" value={row.phone} />
              <Info label="Email" value={row.email} />
              <Info label="Авто" value={row.vehicle_make_model} />
              <Info label="Год" value={row.vehicle_year} />
              <Info label="Локация" value={row.location} />
              <Info label="Желаемое время" value={row.preferred_time} />
              <Info label="Статус" value={statusLabels[row.status] ?? row.status} />
            </div>

            {row.message ? <div style={clientMessageStyle}>{row.message}</div> : null}

            <div style={editGridStyle}>
              <label style={fieldStyle}><span style={labelStyle}>Статус</span><select value={row.status} onChange={(e) => updateRow(row.id, { status: e.target.value })} style={inputStyle}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status] ?? status}</option>)}</select></label>
              <label style={fieldStyle}><span style={labelStyle}>Исполнитель</span><input value={row.assigned_to} onChange={(e) => updateRow(row.id, { assigned_to: e.target.value })} style={inputStyle} placeholder="Имя диспетчера / мастера" /></label>
              <label style={fieldStyle}><span style={labelStyle}>Рабочая заметка</span><textarea value={row.admin_note} onChange={(e) => updateRow(row.id, { admin_note: e.target.value })} rows={4} style={textAreaStyle} placeholder="Результат звонка, ETA, заметка мастера..." /></label>
              <button type="button" onClick={() => saveRow(row.id)} disabled={isSavingId === row.id} style={saveButtonStyle(isSavingId === row.id)}>{isSavingId === row.id ? 'Сохранение...' : 'Сохранить заявку'}</button>
            </div>
          </article>
        ))}

        {!filteredRows.length ? <div style={emptyStyle}>Нет заявок под текущие фильтры.</div> : null}
      </section>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div style={infoStyle}><span>{label}</span><strong>{value || '—'}</strong></div>
}

function StatBlock({ title, value }: { title: string; value: string }) {
  return <div style={statStyle}><p>{title}</p><strong>{value}</strong></div>
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0 }
const panelStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.035)', padding: 20 }
const heroStyle: CSSProperties = { ...panelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', background: 'radial-gradient(circle at 0% 0%, rgba(45,226,230,0.14), transparent 320px), rgba(255,255,255,0.035)' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const titleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 'clamp(34px, 6vw, 58px)', lineHeight: 0.96, letterSpacing: -2.2 }
const mutedStyle: CSSProperties = { margin: '10px 0 0', color: '#95A0B8', fontSize: 14, lineHeight: 1.7 }
const refreshButtonStyle: CSSProperties = { minHeight: 46, padding: '0 18px', borderRadius: 999, border: '1px solid rgba(77,162,255,0.45)', background: '#4DA2FF', color: '#02040A', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.3 }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }
const statStyle: CSSProperties = { borderRadius: 22, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(17,25,46,0.82), rgba(5,7,11,0.72))', padding: 16 }
const filtersStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 48, borderRadius: 14, border: '1px solid rgba(255,255,255,0.11)', background: 'rgba(7,11,20,0.82)', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const textAreaStyle: CSSProperties = { ...inputStyle, minHeight: 110, padding: '12px 14px', resize: 'vertical' }
const messageErrorStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const messageSuccessStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(45,226,230,0.25)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const listStyle: CSSProperties = { display: 'grid', gap: 14 }
const orderCardStyle: CSSProperties = { borderRadius: 24, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(11,16,32,0.86), rgba(5,7,11,0.78))', padding: 18, display: 'grid', gap: 16 }
const orderHeadStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }
const orderTitleStyle: CSSProperties = { margin: '6px 0 0', color: '#F5F7FB', fontSize: 22, lineHeight: 1.15, wordBreak: 'break-word' }
const detailsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }
const infoStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.028)', padding: 12, display: 'grid', gap: 5 }
const clientMessageStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(77,162,255,0.16)', background: 'rgba(77,162,255,0.07)', padding: 14, color: '#F5F7FB', fontSize: 14, lineHeight: 1.65, wordBreak: 'break-word' }
const editGridStyle: CSSProperties = { display: 'grid', gap: 12 }
const fieldStyle: CSSProperties = { display: 'grid', gap: 8 }
const labelStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, fontWeight: 800 }
function deleteButtonStyle(disabled: boolean): CSSProperties { return { minHeight: 40, padding: '0 13px', borderRadius: 999, border: '1px solid rgba(255,122,122,0.28)', background: 'rgba(255,122,122,0.06)', color: '#FF9A9A', fontWeight: 900, opacity: disabled ? 0.65 : 1 } }
function saveButtonStyle(disabled: boolean): CSSProperties { return { minHeight: 48, borderRadius: 999, border: '1px solid rgba(77,162,255,0.45)', background: '#4DA2FF', color: '#02040A', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.2, opacity: disabled ? 0.65 : 1 } }
const emptyStyle: CSSProperties = { borderRadius: 22, border: '1px dashed rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.025)', padding: 18, color: '#95A0B8', fontSize: 14, lineHeight: 1.7 }
