export default function AdminLoginPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#05070B',
        color: '#F5F7FB',
        padding: 24,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#0B1020',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: 24,
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#95A0B8',
            fontSize: 14,
          }}
        >
          Planetlocksmiths Admin
        </p>

        <h1
          style={{
            margin: '8px 0 18px',
            fontSize: 32,
            lineHeight: 1.1,
          }}
        >
          Sign in
        </h1>

        <form style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ color: '#95A0B8', fontSize: 14 }}>Email</span>
            <input
              type="email"
              placeholder="admin@example.com"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ color: '#95A0B8', fontSize: 14 }}>Password</span>
            <input
              type="password"
              placeholder="••••••••"
              style={inputStyle}
            />
          </label>

          <button type="submit" style={buttonStyle}>
            Continue
          </button>
        </form>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 48,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.10)',
  background: '#11192E',
  color: '#F5F7FB',
  padding: '0 14px',
  outline: 'none',
  fontSize: 16,
  boxSizing: 'border-box',
}

const buttonStyle: React.CSSProperties = {
  minHeight: 48,
  borderRadius: 12,
  border: 'none',
  background: '#4DA2FF',
  color: '#05070B',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
}
