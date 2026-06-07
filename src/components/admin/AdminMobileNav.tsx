'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { adminFlatNavItems, type AdminNavItem } from './admin-nav'

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
  const [isExpanded, setIsExpanded] = useState(false)

  const primaryItems = useMemo(() => {
    const fixedHrefs = ['/admin/direct', '/admin/photos', '/admin/backgrounds', '/admin/orders']
    const fixedItems = fixedHrefs
      .map((href) => adminFlatNavItems.find((item) => item.href === href))
      .filter(Boolean) as AdminNavItem[]

    const activeItem = adminFlatNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    if (activeItem && !fixedItems.some((item) => item.href === activeItem.href)) {
      return [...fixedItems.slice(0, 3), activeItem]
    }

    return fixedItems
  }, [pathname])

  const secondaryItems = adminFlatNavItems.filter((item) => !primaryItems.some((primary) => primary.href === item.href))

  function renderLink(item: AdminNavItem, compact = false) {
    const active =
      pathname === item.href || pathname.startsWith(`${item.href}/`)

    return (
      <a
        key={item.href}
        href={item.href}
        className={[
          'mobile-nav__link',
          compact ? 'mobile-nav__link--compact' : '',
          active ? 'mobile-nav__link--active' : '',
        ].filter(Boolean).join(' ')}
      >
        <span>{mobileBadges[item.href] ?? 'AD'}</span>
        <strong>{item.href === '/admin/direct' ? 'Обзор' : item.label}</strong>
      </a>
    )
  }

  return (
    <div className="mobile-nav">
      <div className="mobile-nav__primary">
        {primaryItems.map((item) => renderLink(item))}
      </div>

      <button
        type="button"
        className={isExpanded ? 'mobile-nav__toggle mobile-nav__toggle--open' : 'mobile-nav__toggle'}
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? 'Свернуть' : 'Еще разделы'}</span>
        <b>{isExpanded ? '↑' : '↓'}</b>
      </button>

      {isExpanded ? (
        <div className="mobile-nav__drawer">
          {secondaryItems.map((item) => renderLink(item, true))}
        </div>
      ) : null}

      <style jsx>{`
        .mobile-nav {
          display: grid;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          gap: 8px;
          overflow: hidden;
        }

        .mobile-nav__primary {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          min-width: 0;
        }

        .mobile-nav__drawer {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          min-width: 0;
          padding-top: 2px;
        }

        .mobile-nav__link {
          width: 100%;
          min-width: 0;
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          padding: 0 10px 0 8px;
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
          box-sizing: border-box;
          overflow: hidden;
        }

        .mobile-nav__link--compact {
          min-height: 38px;
        }

        .mobile-nav__link strong {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
          font-weight: 860;
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

        .mobile-nav__toggle {
          width: 100%;
          min-height: 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.026);
          color: #cfd6e4;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 0 12px;
          cursor: pointer;
        }

        .mobile-nav__toggle b {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: #f0d099;
          line-height: 1;
        }

        .mobile-nav__toggle--open {
          border-color: rgba(214, 168, 95, 0.34);
          background: rgba(214, 168, 95, 0.10);
          color: #f0d099;
        }

        @media (max-width: 430px) {
          .mobile-nav {
            gap: 7px;
          }

          .mobile-nav__primary,
          .mobile-nav__drawer {
            gap: 7px;
          }

          .mobile-nav__link {
            min-height: 39px;
            gap: 7px;
            padding: 0 9px 0 7px;
            border-radius: 13px;
          }

          .mobile-nav__link--compact {
            min-height: 36px;
          }

          .mobile-nav__link span {
            width: 24px;
            height: 24px;
            border-radius: 8px;
            font-size: 8px;
          }

          .mobile-nav__link strong {
            font-size: 12px;
          }

          .mobile-nav__toggle {
            min-height: 36px;
            border-radius: 13px;
            font-size: 10px;
            letter-spacing: 1px;
          }
        }
      `}</style>
    </div>
  )
}
