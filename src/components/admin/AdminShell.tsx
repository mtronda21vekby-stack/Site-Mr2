import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import AdminMobileNav from './AdminMobileNav'

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="control-shell">
      <div className="control-shell__noise" aria-hidden="true" />
      <div className="control-shell__orb control-shell__orb--blue" aria-hidden="true" />
      <div className="control-shell__orb control-shell__orb--cyan" aria-hidden="true" />

      <div className="control-shell__body">
        <aside className="control-shell__sidebar">
          <AdminSidebar />
        </aside>

        <main className="control-shell__main">
          <div className="control-shell__mobileHead">
            <div className="control-shell__mobileTopbar">
              <AdminTopbar />
            </div>
            <div className="control-shell__mobileNav">
              <AdminMobileNav />
            </div>
          </div>

          <section className="control-shell__workspace">
            <div className="control-shell__desktopTopbar">
              <AdminTopbar />
            </div>
            <div className="control-shell__content">{children}</div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .control-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 84% -10%, rgba(45, 226, 230, 0.16), transparent 34%),
            radial-gradient(circle at 14% 12%, rgba(77, 162, 255, 0.16), transparent 30%),
            linear-gradient(135deg, #02040a 0%, #060916 48%, #02040a 100%);
          color: #f5f7fb;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .control-shell__noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 80%);
        }

        .control-shell__orb {
          position: fixed;
          width: 460px;
          height: 460px;
          border-radius: 999px;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.42;
        }

        .control-shell__orb--blue {
          right: -220px;
          top: -180px;
          background: rgba(77, 162, 255, 0.38);
        }

        .control-shell__orb--cyan {
          left: 18%;
          bottom: -260px;
          background: rgba(45, 226, 230, 0.18);
        }

        .control-shell__body {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 292px minmax(0, 1fr);
        }

        .control-shell__sidebar {
          min-width: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(2, 4, 10, 0.54);
          backdrop-filter: blur(28px);
        }

        .control-shell__main {
          min-width: 0;
          padding: 22px;
          box-sizing: border-box;
        }

        .control-shell__workspace {
          width: 100%;
          max-width: 1380px;
          min-height: calc(100vh - 44px);
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 32px;
          background: linear-gradient(145deg, rgba(12, 18, 34, 0.72), rgba(2, 4, 10, 0.58));
          box-shadow: 0 34px 120px rgba(0, 0, 0, 0.42);
          backdrop-filter: blur(24px);
          overflow: hidden;
        }

        .control-shell__desktopTopbar {
          padding: 20px 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.025);
        }

        .control-shell__content {
          padding: 22px;
          min-width: 0;
        }

        .control-shell__mobileHead {
          display: none;
        }

        @media (max-width: 1023px) {
          .control-shell__body {
            display: block;
          }

          .control-shell__sidebar {
            display: none;
          }

          .control-shell__main {
            padding: calc(12px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) calc(14px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left));
          }

          .control-shell__mobileHead {
            display: grid;
            gap: 10px;
            position: sticky;
            top: calc(8px + env(safe-area-inset-top));
            z-index: 40;
            margin-bottom: 10px;
          }

          .control-shell__mobileTopbar,
          .control-shell__mobileNav {
            border: 1px solid rgba(255, 255, 255, 0.09);
            border-radius: 22px;
            background: rgba(9, 14, 28, 0.86);
            backdrop-filter: blur(22px);
            box-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
          }

          .control-shell__mobileTopbar {
            padding: 14px;
          }

          .control-shell__mobileNav {
            padding: 10px;
          }

          .control-shell__workspace {
            min-height: auto;
            border-radius: 24px;
          }

          .control-shell__desktopTopbar {
            display: none;
          }

          .control-shell__content {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  )
}
