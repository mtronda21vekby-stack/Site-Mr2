import type { ReactNode } from 'react'
import type { Viewport } from 'next'
import AdminLayoutFrame from '@/components/admin/AdminLayoutFrame'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return <AdminLayoutFrame>{children}</AdminLayoutFrame>
}
