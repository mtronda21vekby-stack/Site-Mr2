'use client'

import { usePathname } from 'next/navigation'
import { adminFlatNavItems } from './admin-nav'

export default function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        paddingBottom: 4,
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {adminFlatNavItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <a
            key={item.href}
            href={item.href}
            style={{
              flex: '0 0 auto',
              minHeight: 40,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 14px',
              textDecoration: 'none',
              borderRadius: 999,
              border: active
                ? '1px solid rgba(77,162,255,0.60)'
                : '1px solid rgba(255,255,255,0.08)',
              background: active ? '#4DA2FF' : '#11192E',
              color: active ? '#05070B' : '#F5F7FB',
              fontSize: 14,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </a>
        )
      })}
    </div>
  )
}
