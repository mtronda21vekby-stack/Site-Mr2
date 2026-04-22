export default function AdminDashboardPage() {
  const items = [
    {
      title: 'Settings',
      href: '/admin/settings',
      description: 'Brand, phone, email, and service hours',
    },
    {
      title: 'Home',
      href: '/admin/home',
      description: 'Hero section, badges, and homepage content',
    },
    {
      title: 'Services',
      href: '/admin/services',
      description: 'Service pages and localized content',
    },
    {
      title: 'Areas',
      href: '/admin/areas',
      description: 'Philadelphia and future city pages',
    },
    {
      title: 'Reviews',
      href: '/admin/reviews',
      description: 'Customer reviews management',
    },
    {
      title: 'FAQ',
      href: '/admin/faq',
      description: 'Questions and answers by locale',
    },
  ]

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#05070B',
        color: '#F5F7FB',
        padding: '20px 16px 40px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>
            Planetlocksmiths / Admin
          </p>
          <h1 style={{ margin: '8px 0 0', fontSize: 32, lineHeight: 1.1 }}>
            Dashboard
          </h1>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: '#F5F7FB',
                background: '#0B1020',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                padding: 18,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
                {item.title}
              </h2>
              <p
                style={{
                  margin: '10px 0 0',
                  color: '#95A0B8',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
