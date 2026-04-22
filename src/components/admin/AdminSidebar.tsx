const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Settings', href: '/admin/settings' },
  { label: 'Home', href: '/admin/home' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Areas', href: '/admin/areas' },
  { label: 'Reviews', href: '/admin/reviews' },
  { label: 'FAQ', href: '/admin/faq' },
  { label: 'Media', href: '/admin/media' },
]

export default function AdminSidebar() {
  return (
    <aside
      style={{
        width: 260,
        background: '#0B1020',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <p
          style={{
            margin: 0,
            color: '#95A0B8',
            fontSize: 13,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
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
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              padding: '12px 14px',
              borderRadius: 12,
              color: '#F5F7FB',
              background: '#11192E',
              textDecoration: 'none',
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
