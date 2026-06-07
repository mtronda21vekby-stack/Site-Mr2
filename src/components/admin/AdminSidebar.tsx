'use client'

import { usePathname } from 'next/navigation'
import { adminNavGroups } from './admin-nav'

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="side-panel">
      <div className="brand-card">
        <div className="brand-mark">
          <img src="/planetlocksmiths-logo.svg" alt="Planet Locksmiths" />
        </div>
        <div>
          <p className="brand-kicker">Planet Locksmiths</p>
          <h2>Control Room</h2>
        </div>
      </div>

      <a href="/admin/photos" className="photo-cta">
        <span>Media</span>
        <strong>Фото и галерея</strong>
      </a>

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
          padding: 16px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .brand-card {
          display: grid;
          grid-template-columns: 58px minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          padding: 12px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.024)),
            rgba(255, 255, 255, 0.028);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
        }

        .brand-mark {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: #05070b;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.28);
        }

        .brand-mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .brand-kicker {
          margin: 0;
          color: #a4acba;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.6px;
        }

        h2 {
          margin: 5px 0 0;
          color: #f5f7fb;
          font-size: 20px;
          line-height: 1.05;
          letter-spacing: -0.4px;
        }

        .photo-cta {
          min-height: 58px;
          display: grid;
          align-content: center;
          gap: 4px;
          border-radius: 18px;
          border: 1px solid rgba(214, 168, 95, 0.34);
          background:
            linear-gradient(135deg, rgba(214, 168, 95, 0.14), rgba(255, 255, 255, 0.028)),
            rgba(255, 255, 255, 0.026);
          color: #f5f7fb;
          text-decoration: none;
          padding: 0 14px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.055);
        }

        .photo-cta span {
          color: #d6a85f;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 1.8px;
        }

        .photo-cta strong {
          font-size: 14px;
          line-height: 1.1;
        }

        .nav-stack {
          display: grid;
          gap: 16px;
        }

        .nav-title {
          margin: 0 0 8px;
          color: #7f8797;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.9px;
        }

        .nav-list {
          display: grid;
          gap: 6px;
        }

        .nav-link {
          min-height: 43px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 12px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.018);
          color: #dfe8f8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 780;
          transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
        }

        .nav-link:hover {
          transform: translateX(3px);
          border-color: rgba(214, 168, 95, 0.26);
          background: rgba(255, 255, 255, 0.045);
        }

        .nav-link--active {
          border-color: rgba(214, 168, 95, 0.50);
          background:
            linear-gradient(135deg, rgba(214, 168, 95, 0.18), rgba(255, 255, 255, 0.045)),
            rgba(255, 255, 255, 0.03);
          color: #ffffff;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .nav-dot {
          width: 6px;
          height: 6px;
          border-radius: 99px;
          background: #7f8797;
          flex: 0 0 auto;
        }

        .nav-link--active .nav-dot {
          background: #d6a85f;
          box-shadow: 0 0 16px rgba(214, 168, 95, 0.55);
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
          color: #c2c8d3;
          font-size: 12px;
          font-weight: 800;
        }

        .status-pill span {
          width: 8px;
          height: 8px;
          border-radius: 99px;
          background: #6ee7b7;
          box-shadow: 0 0 14px rgba(110, 231, 183, 0.55);
        }

        .site-link {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.028);
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
