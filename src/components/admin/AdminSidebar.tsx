'use client'

import { usePathname } from 'next/navigation'
import { adminNavGroups } from './admin-nav'

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 280,
        minWidth: 280,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(11,16,32,1) 0%, rgba(7,11,20,1) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: 18,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#95A0B8',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          Planet Locksmiths
        </p>

        <h2
          style={{
            margin: '8px 0 8px',
            color: '#F5F7FB',
            fontSize: 24,
            lineHeight: 1.1,
          }}
        >
          Управление сайтом
        </h2>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#A9D0FF',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: '#2DE2E6',
              display: 'inline-block',
            }}
          />
          Сессия активна
        </div>
      </div>

      <div style={{ display: 'grid', gap: 18 }}>
        {adminNavGroups.map((group) => (
          <div key={group.title}>
            <p
              style={{
                margin: '0 0 8px',
                color: '#95A0B8',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}
            >
              {group.title}
            </p>

            <div style={{ display: 'grid', gap: 8 }}>
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: active ? '#05070B' : '#F5F7FB',
                      background: active ? '#4DA2FF' : '#11192E',
                      border: active ? '1px solid rgba(77,162,255,0.60)' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12,
                      padding: '12px 14px',
                      fontSize: 15,
                      lineHeight: 1.3,
                      fontWeight: active ? 800 : 600,
                    }}
                  >
                    {item.href === '/admin/direct' ? 'Обзор' : item.label}
                  </a>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
