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
      { href: '/admin/audit', label: 'Audit' },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/home', label: 'Home' },
      { href: '/admin/content-blocks', label: 'Content Blocks' },
      { href: '/admin/services', label: 'Services' },
      { href: '/admin/areas', label: 'Areas' },
      { href: '/admin/reviews', label: 'Reviews' },
      { href: '/admin/faq', label: 'FAQ' },
    ],
  },
]

export const adminFlatNavItems: AdminNavItem[] = adminNavGroups.flatMap(
  (group) => group.items
)
