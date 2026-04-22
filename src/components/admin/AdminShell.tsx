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
        display: 'flex',
        background: '#05070B',
        color: '#F5F7FB',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <AdminSidebar />

      <main
        style={{
          flex: 1,
          padding: 24,
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
  )
}
