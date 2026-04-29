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

  const matchedPage = adminFlatNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label
  const currentPage = pathname === '/admin/direct' ? 'Обзор' : matchedPage ?? 'Панель'

  return (
    <header className="topbar">
      <div className="topbar__titleBlock">
        <span className="topbar__status"><span /> Сессия активна</span>
        <h1>{currentPage}</h1>
        <p>Пользователь: <strong>{userEmail}</strong></p>
      </div>

      <div className="topbar__actions">
        <a href="/admin/photos" className="topbar__button topbar__button--accent">Фото</a>
        <a href="/admin/orders" className="topbar__button">Заявки</a>
        <a href="/en" className="topbar__button topbar__button--primary">Открыть сайт</a>
        <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="topbar__button topbar__button--ghost">
          {isLoggingOut ? 'Выход...' : 'Выйти'}
        </button>
      </div>

      <style jsx>{`
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .topbar__titleBlock {
          display: grid;
          gap: 6px;
          min-width: 0;
        }

        .topbar__status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #a9d0ff;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.6px;
        }

        .topbar__status span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #2de2e6;
          box-shadow: 0 0 14px rgba(45, 226, 230, 0.85);
        }

        h1 {
          margin: 0;
          color: #f5f7fb;
          font-size: clamp(22px, 3vw, 32px);
          line-height: 1.05;
          letter-spacing: -1.1px;
        }

        p {
          margin: 0;
          color: #95a0b8;
          font-size: 13px;
          line-height: 1.5;
        }

        strong {
          color: #f5f7fb;
          font-weight: 800;
        }

        .topbar__actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        .topbar__button {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.04);
          color: #f5f7fb;
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.35px;
          cursor: pointer;
        }

        .topbar__button--accent {
          border-color: rgba(45, 226, 230, 0.36);
          background: rgba(45, 226, 230, 0.12);
          color: #2de2e6;
        }

        .topbar__button--primary {
          border-color: rgba(77, 162, 255, 0.45);
          background: #4da2ff;
          color: #02040a;
        }

        .topbar__button--ghost {
          font-family: inherit;
        }

        .topbar__button:disabled {
          opacity: 0.62;
          cursor: default;
        }
      `}</style>
    </header>
  )
}
