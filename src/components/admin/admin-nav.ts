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
    title: 'Основное',
    items: [
      { href: '/admin/direct', label: 'Панель' },
      { href: '/admin/photos', label: 'Фото' },
      { href: '/admin/orders', label: 'Заявки' },
      { href: '/admin/settings', label: 'Настройки' },
      { href: '/admin/audit', label: 'Аудит' },
    ],
  },
  {
    title: 'Контент',
    items: [
      { href: '/admin/home', label: 'Главная' },
      { href: '/admin/content-blocks', label: 'Блоки' },
      { href: '/admin/services', label: 'Услуги' },
      { href: '/admin/areas', label: 'Города' },
      { href: '/admin/reviews', label: 'Отзывы' },
      { href: '/admin/faq', label: 'FAQ' },
    ],
  },
]

export const adminFlatNavItems: AdminNavItem[] = adminNavGroups.flatMap((group) => group.items)
