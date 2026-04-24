'use client'

import { useEffect, useMemo, useState } from 'react'
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

const statusOptions = [
  'new',
  'contacted',
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
]

const urgencyOptions = ['all', 'normal', 'urgent', 'same_day']

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

        if (!session) {
          router.replace('/admin/login')
          return
        }

        const result = await (supabase.from('orders') as any)
          .select(
            'id, name, phone, email, service_needed, vehicle_make_model, vehicle_year, location, urgency, preferred_time, message, status, admin_note, assigned_to, created_at'
          )
          .order('created_at', { ascending: false })

        if (result.error) {
          throw new Error(result.error.message)
        }

        if (!mounted) return

        setRows(
          Array.isArray(result.data)
            ? result.data.map((row: any) => ({
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
              }))
            : []
        )
      } catch (error) {
        if (!mounted) return
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load orders'
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

  function updateRow(id: string, patch: Partial<OrderRow>) {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row))
    )
  }

  async function saveRow(id: string) {
    setErrorMessage('')
    setSuccessMessage('')
    setIsSavingId(id)

    try {
      const row = rows.find((item) => item.id === id)

      if (!row) {
        throw new Error('Order not found')
      }

      const result = await (supabase.from('orders') as any)
        .update({
          status: row.status,
          admin_note: row.admin_note.trim() || null,
          assigned_to: row.assigned_to.trim() || null,
        })
        .eq('id', row.id)

      if (result.error) {
        throw new Error(result.error.message)
      }

      setSuccessMessage(`Order ${id.slice(0, 8)} updated`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to update order'
      )
    } finally {
      setIsSavingId(null)
    }
  }

  async function deleteRow(id: string) {
    const ok = window.confirm(
      'Delete this order permanently? This action cannot be undone.'
    )

    if (!ok) return

    setErrorMessage('')
    setSuccessMessage('')
    setIsDeletingId(id)

    try {
      const result = await (supabase.from('orders') as any)
        .delete()
        .eq('id', id)

      if (result.error) {
        throw new Error(result.error.message)
      }

      setRows((prev) => prev.filter((row) => row.id !== id))
      setSuccessMessage(`Order ${id.slice(0, 8)} deleted`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to delete order'
      )
    } finally {
      setIsDeletingId(null)
    }
  }

  const filteredRows = rows.filter((row) => {
    const q = search.trim().toLowerCase()

    const matchesSearch =
      !q ||
      row.name.toLowerCase().includes(q) ||
      row.phone.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.service_needed.toLowerCase().includes(q) ||
      row.location.toLowerCase().includes(q) ||
      row.vehicle_make_model.toLowerCase().includes(q)

    const matchesStatus =
      statusFilter === 'all' ? true : row.status === statusFilter

    const matchesUrgency =
      urgencyFilter === 'all' ? true : row.urgency === urgencyFilter

    return matchesSearch && matchesStatus && matchesUrgency
  })

  const newCount = rows.filter((row) => row.status === 'new').length
  const activeCount = rows.filter((row) =>
    ['contacted', 'scheduled', 'in_progress'].includes(row.status)
  ).length
  const completedCount = rows.filter((row) => row.status === 'completed').length

  if (isBooting) {
    return (
      <div style={{ paddingTop: 20 }}>
        <p style={{ color: '#95A0B8', margin: 0 }}>Loading orders...</p>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>
            Planetlocksmiths / Admin / Orders
          </p>
          <h1 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.1 }}>
            Orders
          </h1>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
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
          Refresh
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <StatBlock title="Total" value={String(rows.length)} />
        <StatBlock title="New" value={String(newCount)} />
        <StatBlock title="Active" value={String(activeCount)} />
        <StatBlock title="Completed" value={String(completedCount)} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, email, service, location, vehicle"
          style={inputStyle}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
          style={inputStyle}
        >
          {urgencyOptions.map((urgency) => (
            <option key={urgency} value={urgency}>
              {urgency === 'all' ? 'All urgency' : urgency}
            </option>
          ))}
        </select>
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

      <div style={{ display: 'grid', gap: 16 }}>
        {filteredRows.map((row) => (
          <div
            key={row.id}
            style={{
              background: '#0B1020',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: 18,
              display: 'grid',
              gap: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'grid', gap: 8 }}>
                <strong style={{ fontSize: 18 }}>
                  {row.service_needed || 'Order'}
                </strong>

                <div style={{ color: '#95A0B8', fontSize: 14, lineHeight: 1.6 }}>
                  <div>Name: {row.name || '—'}</div>
                  <div>Phone: {row.phone || '—'}</div>
                  <div>Email: {row.email || '—'}</div>
                  <div>Vehicle: {row.vehicle_make_model || '—'}</div>
                  <div>Year: {row.vehicle_year || '—'}</div>
                  <div>Location: {row.location || '—'}</div>
                  <div>Urgency: {row.urgency || '—'}</div>
                  <div>Preferred time: {row.preferred_time || '—'}</div>
                  <div>Created: {row.created_at || '—'}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteRow(row.id)}
                disabled={isDeletingId === row.id}
                style={{
                  minHeight: 40,
                  padding: '0 12px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'transparent',
                  color: '#FF9A9A',
                  cursor: isDeletingId === row.id ? 'default' : 'pointer',
                  opacity: isDeletingId === row.id ? 0.7 : 1,
                }}
              >
                {isDeletingId === row.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>

            {row.message ? (
              <div
                style={{
                  background: '#11192E',
                  borderRadius: 12,
                  padding: 12,
                  color: '#F5F7FB',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {row.message}
              </div>
            ) : null}

            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'grid', gap: 8 }}>
                <span style={{ fontSize: 14, color: '#95A0B8' }}>Status</span>
                <select
                  value={row.status}
                  onChange={(e) => updateRow(row.id, { status: e.target.value })}
                  style={inputStyle}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: 8 }}>
                <span style={{ fontSize: 14, color: '#95A0B8' }}>Assigned To</span>
                <input
                  value={row.assigned_to}
                  onChange={(e) =>
                    updateRow(row.id, { assigned_to: e.target.value })
                  }
                  style={inputStyle}
                  placeholder="Dispatcher / Admin name"
                />
              </label>

              <label style={{ display: 'grid', gap: 8 }}>
                <span style={{ fontSize: 14, color: '#95A0B8' }}>Admin Note</span>
                <textarea
                  value={row.admin_note}
                  onChange={(e) =>
                    updateRow(row.id, { admin_note: e.target.value })
                  }
                  rows={4}
                  style={textAreaStyle}
                  placeholder="Call result, ETA, technician note..."
                />
              </label>

              <button
                type="button"
                onClick={() => saveRow(row.id)}
                disabled={isSavingId === row.id}
                style={{
                  minHeight: 46,
                  borderRadius: 12,
                  border: 'none',
                  background: '#4DA2FF',
                  color: '#05070B',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: isSavingId === row.id ? 'default' : 'pointer',
                  opacity: isSavingId === row.id ? 0.7 : 1,
                }}
              >
                {isSavingId === row.id ? 'Saving...' : 'Save Order'}
              </button>
            </div>
          </div>
        ))}

        {!filteredRows.length ? (
          <div
            style={{
              background: '#0B1020',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: 18,
              color: '#95A0B8',
            }}
          >
            No orders match the current filters.
          </div>
        ) : null}
      </div>
    </div>
  )
}

function StatBlock({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div
      style={{
        background: '#0B1020',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 16,
      }}
    >
      <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>{title}</p>
      <h2 style={{ margin: '8px 0 0', fontSize: 28, lineHeight: 1.1 }}>
        {value}
      </h2>
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
