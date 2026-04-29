'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { adminFlatNavItems } from './admin-nav'

export default function AdminTopbar() {
  const pathname = usePathname()
  const supabase = useMemo(() => getSupabaseClient(), [])
  const [userEmail, setUserEmail] = useState('Сессия не определена')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!mounted) return
      setUserEmail(user?.email ?? 'Сессия не определена')
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      setUserEmail(session?.user?.email ?? 'Сессия не определена')
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  async function handleLogout() {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const currentPage = adminFlatNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? 'Панель'

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#A9D0FF', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: '#2DE2E6', display: 'inline-block', boxShadow: '0 0 12px rgba(45,226,230,0.8)' }} />
          Сессия активна
        </div>

        <h1 style={{ margin: 0, fontSize: 24, lineHeight: 1.1, color: '#F5F7FB' }}>{currentPage}</h1>

        <p style={{ margin: 0, color: '#95A0B8', fontSize: 14, lineHeight: 1.5 }}>
          Пользователь: <span style={{ color: '#F5F7FB' }}>{userEmail}</span>
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href="/en" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 42, padding: '0 14px', borderRadius: 12, textDecoration: 'none', background: '#4DA2FF', color: '#05070B', fontWeight: 700 }}>
          Открыть сайт
        </a>

        <a href="/admin/photos" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 42, padding: '0 14px', borderRadius: 12, textDecoration: 'none', background: '#11192E', color: '#F5F7FB', fontWeight: 700, border: '1px solid rgba(45,226,230,0.35)' }}>
          Фото
        </a>

        <a href="/admin/orders" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 42, padding: '0 14px', borderRadius: 12, textDecoration: 'none', background: '#11192E', color: '#F5F7FB', fontWeight: 700, border: '1px solid rgba(255,255,255,0.10)' }}>
          Заявки
        </a>

        <button type="button" onClick={handleLogout} disabled={isLoggingOut} style={{ minHeight: 42, padding: '0 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)', background: '#11192E', color: '#F5F7FB', fontWeight: 700, cursor: isLoggingOut ? 'default' : 'pointer', opacity: isLoggingOut ? 0.7 : 1 }}>
          {isLoggingOut ? 'Выход...' : 'Выйти'}
        </button>
      </div>
    </div>
  )
}
