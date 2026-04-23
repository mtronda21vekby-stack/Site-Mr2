import type { ReactNode } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import AdminAuthGate from '@/components/admin/AdminAuthGate'

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <AdminAuthGate>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGate>
  )
}
