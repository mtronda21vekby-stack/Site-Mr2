import { getRolePermissions, normalizeRole, roleLabels, type AdminPermissionMap, type UserRole } from '@/lib/adminPermissions'

export type AdminClientUser = {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  roleLabel: string
  permissions: AdminPermissionMap
}

export async function loadAdminUser(): Promise<AdminClientUser | null> {
  const response = await fetch('/api/user/me', { cache: 'no-store' })
  if (!response.ok) return null

  const payload = await response.json().catch(() => null)
  const user = payload?.user
  const role = normalizeRole(user?.role)

  return {
    id: user?.id || 'primary-control-user',
    email: user?.email || 'admin@planetlocksmiths.com',
    full_name: user?.full_name || null,
    role,
    roleLabel: roleLabels[role],
    permissions: user?.permissions || getRolePermissions(role),
  }
}
