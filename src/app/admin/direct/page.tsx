export default function AdminDashboardPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#05070B',
        color: '#F5F7FB',
        padding: '24px 16px 40px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              margin: 0,
              color: '#95A0B8',
              fontSize: 13,
            }}
          >
            Planetlocksmiths / Admin
          </p>

          <h1
            style={{
              margin: '8px 0 0',
              fontSize: 34,
              lineHeight: 1.1,
            }}
          >
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
          {[
            ['Settings', '/admin/settings'],
            ['Home', '/admin/home'],
            ['Services', '/admin/services'],
            ['Areas', '/admin/areas'],
            ['Reviews', '/admin/reviews'],
            ['FAQ', '/admin/faq'],
          ].map(([title, href]) => (
            <a
              key={title}
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
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  lineHeight: 1.2,
                }}
              >
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
                Open section
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
