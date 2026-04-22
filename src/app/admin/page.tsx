export default function AdminPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#05070B',
        color: '#F5F7FB',
        padding: '48px 24px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ color: '#95A0B8', margin: 0, fontSize: 14 }}>
          Planetlocksmiths Admin
        </p>
        <h1 style={{ margin: '8px 0 16px', fontSize: 40, lineHeight: 1.1 }}>
          Admin Panel
        </h1>
        <p style={{ color: '#95A0B8', fontSize: 18, lineHeight: 1.7 }}>
          Admin route is live. Next step is connecting Supabase auth and real content editing.
        </p>
      </div>
    </main>
  )
}
