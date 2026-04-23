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
        <AdminSidebar />

        <main
          style={{
            flex: 1,
            padding: 20,
            boxSizing: 'border-box',
            background:
              'radial-gradient(circle at top right, rgba(77,162,255,0.08), transparent 30%), #05070B',
          }}
        >
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div
              style={{
                background: 'rgba(11,16,32,0.78)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: 18,
                backdropFilter: 'blur(10px)',
              }}
            >
              <AdminTopbar />
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
