export default function AdminSettingsPage() {
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
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <a
            href="/admin"
            style={{
              display: 'inline-block',
              marginBottom: 10,
              color: '#95A0B8',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            ← Back to dashboard
          </a>

          <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>
            Planetlocksmiths / Admin / Settings
          </p>
          <h1 style={{ margin: '8px 0 0', fontSize: 32, lineHeight: 1.1 }}>
            Settings
          </h1>
        </div>

        <form
          style={{
            display: 'grid',
            gap: 16,
            background: '#0B1020',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 18,
          }}
        >
          <Field label="Brand Name" defaultValue="Planetlocksmiths" />
          <Field label="Primary Phone" defaultValue="+1 (267) 000-0000" />
          <Field label="Display Phone" defaultValue="(267) 000-0000" />
          <Field label="Email" defaultValue="hello@planetlocksmiths.com" />
          <Field label="Service Hours" defaultValue="24/7 Mobile Service" />

          <button
            type="button"
            style={{
              minHeight: 50,
              borderRadius: 14,
              border: 'none',
              background: '#4DA2FF',
              color: '#05070B',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Save Settings
          </button>
        </form>
      </div>
    </main>
  )
}

function Field({
  label,
  defaultValue,
}: {
  label: string
  defaultValue: string
}) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span>
      <input
        defaultValue={defaultValue}
        style={{
          width: '100%',
          minHeight: 50,
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.10)',
          background: '#11192E',
          color: '#F5F7FB',
          padding: '0 14px',
          outline: 'none',
          fontSize: 16,
          boxSizing: 'border-box',
          WebkitAppearance: 'none',
        }}
      />
    </label>
  )
}
