'use client'

import { usePathname } from 'next/navigation'
import { adminNavGroups } from './admin-nav'

const navBadges: Record<string, string> = {
  '/admin/direct': 'OV',
  '/admin/photos': 'PX',
  '/admin/backgrounds': 'BG',
  '/admin/orders': 'RQ',
  '/admin/settings': 'ST',
  '/admin/audit': 'QA',
  '/admin/home': 'HM',
  '/admin/content-blocks': 'CB',
  '/admin/services': 'SV',
  '/admin/areas': 'AR',
  '/admin/reviews': 'RV',
  '/admin/faq': 'FQ',
}

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
        <div>
          <span>Media Center</span>
          <strong>Фото, логотип, фон</strong>
        </div>
        <b>Open</b>
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
                    <span className="nav-badge">{navBadges[item.href] ?? 'AD'}</span>
                    <span>{label}</span>
                    <span className="nav-arrow">→</span>
                  </a>
                )
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="side-footer">
        <div className="health-card">
          <p>Production</p>
          <strong>Live CMS</strong>
          <span>Supabase connected</span>
        </div>
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
          grid-template-columns: 58px minmax(0, 1fr);
          gap: 12px;
          align-items: center;
          padding: 12px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background:
            linear-gradient(155deg, rgba(255, 255, 255, 0.088), rgba(255, 255, 255, 0.024)),
            linear-gradient(135deg, rgba(214, 168, 95, 0.12), transparent 48%),
            rgba(255, 255, 255, 0.028);
          box-shadow: 0 18px 64px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.09);
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-radius: 20px;
          border: 1px solid rgba(214, 168, 95, 0.34);
          background:
            linear-gradient(135deg, rgba(214, 168, 95, 0.18), rgba(90, 212, 178, 0.06) 48%, rgba(255, 255, 255, 0.028)),
            rgba(255, 255, 255, 0.026);
          color: #f5f7fb;
          text-decoration: none;
          padding: 0 12px 0 14px;
          box-shadow: 0 18px 54px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.07);
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .photo-cta:hover {
          transform: translateY(-1px);
          border-color: rgba(214, 168, 95, 0.56);
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

        .photo-cta b {
          width: 46px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #f5f7fb;
          color: #05070b;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.8px;
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
          padding: 0 10px;
          border-radius: 16px;
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

        .nav-badge {
          width: 31px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.035);
          color: #9ca3af;
          font-size: 10px;
          font-weight: 950;
          flex: 0 0 auto;
        }

        .nav-link--active .nav-badge {
          border-color: rgba(214, 168, 95, 0.42);
          background: rgba(214, 168, 95, 0.18);
          color: #f0d099;
          box-shadow: 0 0 18px rgba(214, 168, 95, 0.28);
        }

        .nav-arrow {
          margin-left: auto;
          color: #667085;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 160ms ease, transform 160ms ease;
        }

        .nav-link:hover .nav-arrow,
        .nav-link--active .nav-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .side-footer {
          margin-top: auto;
          display: grid;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .health-card {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background:
            linear-gradient(140deg, rgba(90, 212, 178, 0.11), transparent 42%),
            rgba(255, 255, 255, 0.026);
          padding: 13px;
          display: grid;
          gap: 4px;
        }

        .health-card p {
          margin: 0;
          color: #5ad4b2;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 1.6px;
        }

        .health-card strong {
          color: #f5f7fb;
          font-size: 18px;
          line-height: 1.1;
        }

        .health-card span {
          color: #95a0b8;
          font-size: 12px;
          font-weight: 760;
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
