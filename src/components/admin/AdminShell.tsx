import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import AdminMobileNav from './AdminMobileNav'

export default function AdminShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="admin-shell">
      <div className="admin-shell__body">
        <aside className="admin-shell__sidebar">
          <AdminSidebar />
        </aside>

        <main className="admin-shell__main">
          <div className="admin-shell__inner">
            <div className="admin-shell__mobileHead">
              <div className="admin-shell__mobileTopbar">
                <AdminTopbar />
              </div>

              <div className="admin-shell__mobileNav">
                <AdminMobileNav />
              </div>
            </div>

            <div className="admin-shell__panel">
              <div className="admin-shell__desktopTopbar">
                <AdminTopbar />
              </div>

              <div className="admin-shell__content">{children}</div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .admin-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(77, 162, 255, 0.08), transparent 30%),
            #05070b;
          color: #f5f7fb;
          font-family: Inter, sans-serif;
        }

        .admin-shell__body {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
        }

        .admin-shell__sidebar {
          width: 280px;
          min-width: 280px;
          flex-shrink: 0;
        }

        .admin-shell__main {
          flex: 1;
          min-width: 0;
          padding-top: 20px;
          padding-right: calc(20px + env(safe-area-inset-right));
          padding-bottom: calc(20px + env(safe-area-inset-bottom));
          padding-left: calc(20px + env(safe-area-inset-left));
          box-sizing: border-box;
        }

        .admin-shell__inner {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          min-width: 0;
        }

        .admin-shell__panel {
          background: rgba(11, 16, 32, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 18px;
          backdrop-filter: blur(10px);
          overflow: hidden;
          min-width: 0;
        }

        .admin-shell__content {
          margin-top: 16px;
          min-width: 0;
        }

        .admin-shell__mobileHead {
          display: none;
        }

        .admin-shell__desktopTopbar {
          display: block;
        }

        @media (max-width: 1023px) {
          .admin-shell__body {
            display: block;
          }

          .admin-shell__sidebar {
            display: none;
          }

          .admin-shell__main {
            padding-top: calc(12px + env(safe-area-inset-top));
            padding-right: calc(12px + env(safe-area-inset-right));
            padding-bottom: calc(12px + env(safe-area-inset-bottom));
            padding-left: calc(12px + env(safe-area-inset-left));
          }

          .admin-shell__inner {
            display: grid;
            gap: 12px;
          }

          .admin-shell__mobileHead {
            display: grid;
            gap: 12px;
            position: sticky;
            top: calc(10px + env(safe-area-inset-top));
            z-index: 30;
          }

          .admin-shell__mobileTopbar,
          .admin-shell__mobileNav,
          .admin-shell__panel {
            background: rgba(11, 16, 32, 0.88);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 20px;
            backdrop-filter: blur(12px);
            min-width: 0;
          }

          .admin-shell__mobileTopbar {
            padding: 14px;
          }

          .admin-shell__mobileNav {
            padding: 10px 12px;
          }

          .admin-shell__panel {
            padding: 14px;
            overflow: hidden;
          }

          .admin-shell__desktopTopbar {
            display: none;
          }

          .admin-shell__content {
            margin-top: 0;
          }
        }
      `}</style>
    </div>
  )
}
