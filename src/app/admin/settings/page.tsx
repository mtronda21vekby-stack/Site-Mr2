import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminSettingsPage() {
  return (
    <>
      <AdminHeader
        title="Settings"
        subtitle="Planetlocksmiths / Admin / Settings"
      />

      <form
        style={{
          display: 'grid',
          gap: 18,
          background: '#0B1020',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: 24,
        }}
      >
        <label style={{ display: 'grid', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#95A0B8' }}>Brand Name</span>
          <input defaultValue="Planetlocksmiths" style={inputStyle} />
        </label>

        <label style={{ display: 'grid', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#95A0B8' }}>Primary Phone</span>
          <input defaultValue="+1 (267) 000-0000" style={inputStyle} />
        </label>

        <label style={{ display: 'grid', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#95A0B8' }}>Display Phone</span>
          <input defaultValue="(267) 000-0000" style={inputStyle} />
        </label>

        <label style={{ display: 'grid', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#95A0B8' }}>Email</span>
          <input defaultValue="hello@planetlocksmiths.com" style={inputStyle} />
        </label>

        <label style={{ display: 'grid', gap: 8 }}>
          <span style={{ fontSize: 14, color: '#95A0B8' }}>Service Hours</span>
          <input defaultValue="24/7 Mobile Service" style={inputStyle} />
        </label>

        <button type="submit" style={buttonStyle}>
          Save Settings
        </button>
      </form>
    </>
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
