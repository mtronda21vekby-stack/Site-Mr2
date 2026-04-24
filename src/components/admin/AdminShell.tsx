'use client'

import { useEffect, useState, type ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import AdminMobileNav from './AdminMobileNav'

export default function AdminShell({
  children,
}: {
  children: ReactNode
}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    function syncViewport() {
      setIsMobile(window.innerWidth < 1024)
    }

    syncViewport()
    window.addEventListener('resize', syncViewport)

    return () => {
      window.removeEventListener('resize', syncViewport)
    }
  }, [])

  if (isMobile === null) {
    return null
  }

  if (isMobile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top, rgba(77,162,255,0.10), transparent 30%), #05070B',
          color: '#F5F7FB',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <main
          style={{
            paddingTop: 'calc(12px + env(safe-area-inset-top))',
            paddingRight: 'calc(12px + env(safe-area-inset-right))',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
            paddingLeft: 'calc(12px + env(safe-area-inset-left))',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 1240,
              margin: '0 auto',
              display: 'grid',
              gap: 12,
            }}
          >
            <div
              style={{
                background: 'rgba(11,16,32,0.88)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: 14,
                backdropFilter: 'blur(12px)',
                position: 'sticky',
                top: 'calc(10px + env(safe-area-inset-top))',
                zIndex: 30,
              }}
            >
              <AdminTopbar />
              <div style={{ marginTop: 12 }}>
                <AdminMobileNav />
              </div>
            </div>

            <div
              style={{
                background: 'rgba(11,16,32,0.82)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: 14,
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
              }}
            >
              {children}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top right, rgba(77,162,255,0.08), transparent 30%), #05070B',
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
            paddingTop: 20,
            paddingRight: 'calc(20px + env(safe-area-inset-right))',
            paddingBottom: 20,
            paddingLeft: 'calc(20px + env(safe-area-inset-left))',
            boxSizing: 'border-box',
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
                overflow: 'hidden',
              }}
            >
              <AdminTopbar />
              <div style={{ marginTop: 16 }}>{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
