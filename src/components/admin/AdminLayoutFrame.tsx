'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import AdminAuthGate from './AdminAuthGate'
import AdminShell from './AdminShell'

export default function AdminLayoutFrame({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const isLoginRoute = pathname === '/admin/login'

  return (
    <AdminAuthGate>
      {isLoginRoute ? <>{children}</> : <AdminShell>{children}</AdminShell>}
    </AdminAuthGate>
  )
}
