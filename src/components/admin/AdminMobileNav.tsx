'use client'

import { usePathname } from 'next/navigation'
import { adminFlatNavItems } from './admin-nav'

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
            {item.label}
          </a>
        )
      })}

      <style jsx>{`
        .mobile-nav {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 0 0 3px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
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
          padding: 0 13px;
          text-decoration: none;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(255, 255, 255, 0.028);
          color: #f5f7fb;
          font-size: 13px;
          font-weight: 820;
          white-space: nowrap;
        }

        .mobile-nav__link--active {
          border-color: rgba(214, 168, 95, 0.48);
          background: rgba(214, 168, 95, 0.16);
          color: #f0d099;
        }
      `}</style>
    </div>
  )
}
