'use client'

import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminTopbar() {
  async function handleLogout() {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: '#95A0B8',
            fontSize: 13,
          }}
        >
          Secure control panel
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <a
          href="/en"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 42,
            padding: '0 14px',
            borderRadius: 12,
            textDecoration: 'none',
            background: '#4DA2FF',
            color: '#05070B',
            fontWeight: 700,
          }}
        >
          Open site
        </a>

        <button
          type="button"
          onClick={handleLogout}
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
          Logout
        </button>
      </div>
    </div>
  )
}
