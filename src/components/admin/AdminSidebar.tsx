'use client'

import { usePathname } from 'next/navigation'
import { adminNavGroups } from './admin-nav'

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="side-panel">
      <div className="brand-card">
        <div className="brand-mark">PL</div>
        <div>
          <p className="brand-kicker">Planet Locksmiths</p>
          <h2>Управление сайтом</h2>
        </div>
      </div>

      <a href="/admin/photos" className="photo-cta">📸 Фото и галерея</a>

      <nav className="nav-stack">
        {adminNavGroups.map((group) => (
          <section key={group.title} className="nav-group">
            <p className="nav-title">{group.title}</p>
            <div className="nav-list">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const label = item.href === '/admin/direct' ? 'Обзор' : item.label

                return (
                  <a key={item.href} href={item.href} className={active ? 'nav-link nav-link--active' : 'nav-link'}>
                    <span className="nav-dot" />
                    <span>{label}</span>
                  </a>
                )
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="side-footer">
        <div className="status-pill"><span /> Сессия активна</div>
        <a href="/en" className="site-link">Открыть сайт ↗</a>
      </div>

      <style jsx>{`
        .side-panel {
          min-height: 100vh;
          padding: 18px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .brand-card {
          display: grid;
          grid-template-columns: 46px minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          padding: 14px;
          border-radius: 24px;
          border: 1px solid rgba(45, 226, 230, 0.22);
          background: linear-gradient(145deg, rgba(45, 226, 230, 0.11), rgba(255, 255, 255, 0.035));
          box-shadow: 0 18px 60px rgba(45, 226, 230, 0.06);
        }

        .brand-mark {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #2de2e6;
          color: #02040a;
          font-weight: 950;
          letter-spacing: -0.8px;
          box-shadow: 0 0 34px rgba(45, 226, 230, 0.32);
        }

        .brand-kicker {
          margin: 0;
          color: #95a0b8;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.8px;
        }

        h2 {
          margin: 5px 0 0;
          color: #f5f7fb;
          font-size: 19px;
          line-height: 1.05;
          letter-spacing: -0.5px;
        }

        .photo-cta {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          border: 1px solid rgba(45, 226, 230, 0.38);
          background: linear-gradient(135deg, rgba(45, 226, 230, 0.18), rgba(77, 162, 255, 0.10));
          color: #2de2e6;
          text-decoration: none;
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 1.4px;
        }

        .nav-stack {
          display: grid;
          gap: 16px;
        }

        .nav-title {
          margin: 0 0 8px;
          color: #768199;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.9px;
        }

        .nav-list {
          display: grid;
          gap: 7px;
        }

        .nav-link {
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 12px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.028);
          color: #dfe8f8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 780;
          transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
        }

        .nav-link:hover {
          transform: translateX(3px);
          border-color: rgba(45, 226, 230, 0.24);
          background: rgba(45, 226, 230, 0.075);
        }

        .nav-link--active {
          border-color: rgba(45, 226, 230, 0.50);
          background: linear-gradient(135deg, rgba(45, 226, 230, 0.20), rgba(77, 162, 255, 0.12));
          color: #ffffff;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 0 28px rgba(45, 226, 230, 0.10);
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 99px;
          background: #4da2ff;
          box-shadow: 0 0 14px rgba(77, 162, 255, 0.7);
          flex: 0 0 auto;
        }

        .nav-link--active .nav-dot {
          background: #2de2e6;
          box-shadow: 0 0 18px rgba(45, 226, 230, 0.88);
        }

        .side-footer {
          margin-top: auto;
          display: grid;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #a9d0ff;
          font-size: 12px;
          font-weight: 800;
        }

        .status-pill span {
          width: 8px;
          height: 8px;
          border-radius: 99px;
          background: #2de2e6;
          box-shadow: 0 0 16px rgba(45, 226, 230, 0.8);
        }

        .site-link {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.035);
          color: #f5f7fb;
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.3px;
        }
      `}</style>
    </aside>
  )
}
