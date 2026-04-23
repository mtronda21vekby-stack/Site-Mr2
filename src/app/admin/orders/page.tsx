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

export default function AdminOrdersPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])

  const [rows, setRows] = useState<OrderRow[]>([])
  const [isBooting, setIsBooting] = useState(true)
  const [isSavingId, setIsSavingId] = useState<string | null>(null)
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

  if (isBooting) {
    return (
      <div style={{ paddingTop: 20 }}>
        <p style={{ color: '#95A0B8', margin: 0 }}>Loading orders...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>
          Planetlocksmiths / Admin / Orders
        </p>
        <h1 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.1 }}>
          Orders
        </h1>
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
        {rows.map((row) => (
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
                display: 'grid',
                gap: 8,
              }}
            >
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
            </div>

            <div
              style={{
                display: 'grid',
                gap: 12,
              }}
            >
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
      </div>
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
