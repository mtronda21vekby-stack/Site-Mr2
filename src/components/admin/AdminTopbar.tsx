'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { adminFlatNavItems } from './admin-nav'

export default function AdminTopbar() {
  const pathname = usePathname()
  const supabase = useMemo(() => getSupabaseClient(), [])
  const [userEmail, setUserEmail] = useState('Сессия не определена')
  const [todayLabel, setTodayLabel] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return
      setUserEmail(session?.user?.email ?? 'Сессия не определена')
      setTodayLabel(new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date()))
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
        <span className="topbar__status"><span /> Production control</span>
        <h1>{currentPage}</h1>
        <p>Planet Locksmiths CMS · <strong>{todayLabel || 'Live'}</strong></p>
      </div>

      <div className="topbar__actions">
        <div className="topbar__session" title={userEmail}>
          <span>Admin</span>
          <strong>{userEmail}</strong>
        </div>
        <a href="/admin/photos" className="topbar__button topbar__button--accent">Media</a>
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
          gap: 18px;
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
          color: #c2c8d3;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.6px;
        }

        .topbar__status span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #6ee7b7;
          box-shadow: 0 0 14px rgba(110, 231, 183, 0.58);
        }

        h1 {
          margin: 0;
          color: #f5f7fb;
          font-size: clamp(22px, 3vw, 32px);
          line-height: 1.05;
          letter-spacing: -0.6px;
        }

        p {
          margin: 0;
          color: #9ca3af;
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

        .topbar__session {
          height: 44px;
          max-width: 238px;
          display: grid;
          align-content: center;
          gap: 2px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background:
            linear-gradient(135deg, rgba(90, 212, 178, 0.10), transparent 56%),
            rgba(255, 255, 255, 0.030);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.055);
        }

        .topbar__session span {
          color: #5ad4b2;
          font-size: 9px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .topbar__session strong {
          max-width: 198px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #f5f7fb;
          font-size: 12px;
          line-height: 1.1;
        }

        .topbar__button {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.048), rgba(255, 255, 255, 0.020)),
            rgba(255, 255, 255, 0.024);
          color: #f5f7fb;
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.35px;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.052);
          transition: border-color 160ms ease, background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
        }

        .topbar__button:hover {
          transform: translateY(-1px);
          border-color: rgba(214, 168, 95, 0.34);
          background: rgba(255, 255, 255, 0.055);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .topbar__button--accent {
          border-color: rgba(214, 168, 95, 0.34);
          background: rgba(214, 168, 95, 0.13);
          color: #f0d099;
        }

        .topbar__button--primary {
          border-color: rgba(245, 247, 251, 0.24);
          background: #f5f7fb;
          color: #08090d;
          box-shadow: 0 14px 38px rgba(245, 247, 251, 0.12);
        }

        .topbar__button--ghost {
          font-family: inherit;
        }

        .topbar__button:disabled {
          opacity: 0.62;
          cursor: default;
        }

        @media (max-width: 720px) {
          .topbar {
            display: grid;
          }

          .topbar__actions {
            justify-content: stretch;
          }

          .topbar__session {
            max-width: none;
            width: 100%;
          }

          .topbar__session strong {
            max-width: none;
          }

          .topbar__button {
            flex: 1 1 auto;
          }
        }
      `}</style>
    </header>
  )
}
