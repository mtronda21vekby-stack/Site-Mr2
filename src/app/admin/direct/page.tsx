export default function AdminDashboardPage() {
  const items = [
    ['Settings', '/admin/settings', 'Brand, phone, email, service hours'],
    ['Home', '/admin/home', 'Homepage content and hero copy'],
    ['Services', '/admin/services', 'Service pages and SEO content'],
    ['Areas', '/admin/areas', 'City and area pages'],
    ['Reviews', '/admin/reviews', 'Customer reviews'],
    ['FAQ', '/admin/faq', 'Questions and answers'],
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
          {items.map(([title, href, description]) => (
            <a
              key={href}
              href={href}
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
                {title}
              </h2>
              <p
                style={{
                  margin: '10px 0 0',
                  color: '#95A0B8',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
