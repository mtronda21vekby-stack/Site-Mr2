'use client'

const items = [
  { href: '/admin/direct', label: 'Dashboard' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/home', label: 'Home' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/faq', label: 'FAQ' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/areas', label: 'Areas' },
]

export default function AdminSidebar() {
  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        background: '#0B1020',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: 18,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <p
          style={{
            margin: 0,
            color: '#95A0B8',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          Planetlocksmiths
        </p>
        <h2
          style={{
            margin: '8px 0 0',
            color: '#F5F7FB',
            fontSize: 24,
            lineHeight: 1.1,
          }}
        >
          Admin
        </h2>
      </div>

      <nav style={{ display: 'grid', gap: 10 }}>
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              textDecoration: 'none',
              color: '#F5F7FB',
              background: '#11192E',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 15,
              lineHeight: 1.3,
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
