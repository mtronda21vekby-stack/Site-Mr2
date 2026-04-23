import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

export default function AdminShell({
  children,
}: {
  children: ReactNode
}) {
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
          display: 'flex',
          alignItems: 'stretch',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            display: 'none',
          }}
          className="admin-sidebar-mobile-hidden"
        />

        <div
          style={{
            display: 'flex',
            width: '100%',
            minHeight: '100vh',
          }}
        >
          <div
            style={{
              display: 'none',
            }}
          />

          <div
            style={{
              width: 260,
              flexShrink: 0,
            }}
          >
            <AdminSidebar />
          </div>

          <main
            style={{
              flex: 1,
              padding: 20,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <AdminTopbar />
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
