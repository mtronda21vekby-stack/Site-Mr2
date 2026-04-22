import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'

type AdminShellProps = {
  children: ReactNode
}

export default function AdminShell({ children }: AdminShellProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#05070B',
        color: '#F5F7FB',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
        }}
      >
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <AdminSidebar />
        </div>

        <main
          style={{
            padding: 16,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
