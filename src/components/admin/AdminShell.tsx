import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import AdminMobileNav from './AdminMobileNav'

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="control-shell">
      <div className="control-shell__noise" aria-hidden="true" />

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
          overflow-x: clip;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 260px),
            linear-gradient(135deg, #08090d 0%, #0f1218 44%, #06070a 100%);
          color: #f5f7fb;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .control-shell__noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.86), transparent 82%);
        }

        .control-shell__body {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 292px minmax(0, 1fr);
        }

        .control-shell__sidebar {
          min-width: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.075);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018)),
            rgba(8, 9, 13, 0.82);
          backdrop-filter: blur(26px);
        }

        .control-shell__main {
          min-width: 0;
          padding: 18px;
          box-sizing: border-box;
        }

        .control-shell__workspace {
          width: 100%;
          max-width: 1380px;
          min-height: calc(100vh - 36px);
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.025) 22%, rgba(255, 255, 255, 0.018)),
            rgba(10, 12, 18, 0.78);
          box-shadow:
            0 34px 120px rgba(0, 0, 0, 0.40),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(22px);
          overflow: hidden;
        }

        .control-shell__desktopTopbar {
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.022)),
            rgba(255, 255, 255, 0.018);
        }

        .control-shell__content {
          padding: 20px;
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
            padding: calc(10px + env(safe-area-inset-top)) calc(10px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(10px + env(safe-area-inset-left));
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
            border: 1px solid rgba(255, 255, 255, 0.10);
            border-radius: 20px;
            background:
              linear-gradient(180deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.022)),
              rgba(10, 12, 18, 0.92);
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
            border-radius: 22px;
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
