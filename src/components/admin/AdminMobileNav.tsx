'use client'

import { usePathname } from 'next/navigation'
import { adminFlatNavItems } from './admin-nav'

const mobileBadges: Record<string, string> = {
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

export default function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <div className="mobile-nav">
      {adminFlatNavItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <a
            key={item.href}
            href={item.href}
            className={active ? 'mobile-nav__link mobile-nav__link--active' : 'mobile-nav__link'}
          >
            <span>{mobileBadges[item.href] ?? 'AD'}</span>
            <strong>{item.href === '/admin/direct' ? 'Обзор' : item.label}</strong>
          </a>
        )
      })}

      <style jsx>{`
        .mobile-nav {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 0 0 4px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x proximity;
        }

        .mobile-nav::-webkit-scrollbar {
          display: none;
        }

        .mobile-nav__link {
          flex: 0 0 auto;
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 12px 0 8px;
          text-decoration: none;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.050), rgba(255,255,255,0.018)),
            rgba(255, 255, 255, 0.024);
          color: #f5f7fb;
          font-size: 13px;
          font-weight: 820;
          white-space: nowrap;
          scroll-snap-align: start;
        }

        .mobile-nav__link span {
          width: 26px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.032);
          color: #95a0b8;
          font-size: 9px;
          font-weight: 950;
        }

        .mobile-nav__link strong {
          font-size: 13px;
          font-weight: 860;
        }

        .mobile-nav__link--active {
          border-color: rgba(214, 168, 95, 0.48);
          background: rgba(214, 168, 95, 0.16);
          color: #f0d099;
        }

        .mobile-nav__link--active span {
          border-color: rgba(214, 168, 95, 0.38);
          background: rgba(214, 168, 95, 0.18);
          color: #f0d099;
        }
      `}</style>
    </div>
  )
}
