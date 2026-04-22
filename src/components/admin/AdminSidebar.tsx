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
        padding: 14,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <p
          style={{
            margin: 0,
            color: '#95A0B8',
            fontSize: 12,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}
        >
          Planetlocksmiths
        </p>
        <h2
          style={{
            margin: '6px 0 0',
            color: '#F5F7FB',
            fontSize: 22,
            lineHeight: 1.1,
          }}
        >
          Admin
        </h2>
      </div>

      <nav
        style={{
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 42,
              padding: '0 14px',
              borderRadius: 12,
              color: '#F5F7FB',
              background: '#11192E',
              textDecoration: 'none',
              fontSize: 14,
              lineHeight: 1.3,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}
