import type { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import AdminMobileNav from './AdminMobileNav'

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="control-shell">
      <div className="control-shell__noise" aria-hidden="true" />
      <div className="control-shell__mesh" aria-hidden="true" />
      <div className="control-shell__beam control-shell__beam--one" aria-hidden="true" />
      <div className="control-shell__beam control-shell__beam--two" aria-hidden="true" />

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
            linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 280px),
            linear-gradient(132deg, #06070b 0%, #0f121b 36%, #090d12 66%, #030406 100%);
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

        .control-shell__mesh {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background:
            conic-gradient(from 210deg at 72% 0%, rgba(214, 168, 95, 0.18), transparent 20%, rgba(92, 141, 255, 0.12), transparent 45%, rgba(90, 212, 178, 0.10), transparent 72%),
            linear-gradient(118deg, transparent 0 18%, rgba(255, 255, 255, 0.035) 19%, transparent 20% 46%, rgba(214, 168, 95, 0.045) 47%, transparent 48% 100%);
          opacity: 0.86;
          mix-blend-mode: screen;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.92), rgba(0,0,0,0.45) 58%, transparent 100%);
        }

        .control-shell__beam {
          position: fixed;
          width: 42vw;
          height: 120vh;
          pointer-events: none;
          opacity: 0.23;
          background: linear-gradient(90deg, transparent, rgba(214, 168, 95, 0.20), rgba(255, 255, 255, 0.12), transparent);
          filter: blur(30px);
          transform: rotate(17deg);
          transform-origin: top center;
        }

        .control-shell__beam--one {
          top: -22vh;
          right: 4vw;
        }

        .control-shell__beam--two {
          top: -18vh;
          left: 34vw;
          opacity: 0.15;
          background: linear-gradient(90deg, transparent, rgba(92, 141, 255, 0.22), rgba(90, 212, 178, 0.11), transparent);
          transform: rotate(-21deg);
        }

        .control-shell__body {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 304px minmax(0, 1fr);
        }

        .control-shell__sidebar {
          min-width: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.075);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.072), rgba(255, 255, 255, 0.018)),
            linear-gradient(140deg, rgba(214, 168, 95, 0.055), transparent 36%),
            rgba(8, 9, 13, 0.74);
          backdrop-filter: blur(30px) saturate(130%);
          box-shadow: 22px 0 80px rgba(0, 0, 0, 0.28);
        }

        .control-shell__main {
          min-width: 0;
          padding: 22px;
          box-sizing: border-box;
        }

        .control-shell__workspace {
          width: 100%;
          max-width: 1440px;
          min-height: calc(100vh - 44px);
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 32px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.088), rgba(255, 255, 255, 0.026) 25%, rgba(255, 255, 255, 0.014)),
            linear-gradient(135deg, rgba(214, 168, 95, 0.08), transparent 24%, rgba(92, 141, 255, 0.05) 72%, transparent),
            rgba(10, 12, 18, 0.76);
          box-shadow:
            0 42px 150px rgba(0, 0, 0, 0.46),
            inset 0 1px 0 rgba(255, 255, 255, 0.11);
          backdrop-filter: blur(26px) saturate(132%);
          overflow: hidden;
        }

        .control-shell__desktopTopbar {
          padding: 18px 20px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.070), rgba(255, 255, 255, 0.024)),
            rgba(255, 255, 255, 0.020);
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
              linear-gradient(180deg, rgba(255, 255, 255, 0.082), rgba(255, 255, 255, 0.026)),
              rgba(10, 12, 18, 0.92);
            backdrop-filter: blur(24px) saturate(132%);
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

        @media (max-width: 680px) {
          .control-shell__beam {
            display: none;
          }

          .control-shell__content {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  )
}
