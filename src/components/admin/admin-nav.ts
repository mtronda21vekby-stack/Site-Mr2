export type AdminNavItem = {
  href: string
  label: string
}

export type AdminNavGroup = {
  title: string
  items: AdminNavItem[]
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    title: 'Core',
    items: [
      { href: '/admin/direct', label: 'Dashboard' },
      { href: '/admin/orders', label: 'Orders' },
      { href: '/admin/settings', label: 'Settings' },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/home', label: 'Home' },
      { href: '/admin/reviews', label: 'Reviews' },
      { href: '/admin/faq', label: 'FAQ' },
      { href: '/admin/services', label: 'Services' },
      { href: '/admin/areas', label: 'Areas' },
    ],
  },
]

export const adminFlatNavItems: AdminNavItem[] = adminNavGroups.flatMap(
  (group) => group.items
)
