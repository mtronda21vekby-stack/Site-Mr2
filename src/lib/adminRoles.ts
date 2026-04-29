import { isAdminAuthenticated } from '@/lib/adminAuth'
import { canRole, getRolePermissions, normalizeRole, type UserRole } from '@/lib/adminPermissions'

export type { UserRole }

export type CurrentUserProfile = {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  permissions: ReturnType<typeof getRolePermissions>
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return null

  const role = normalizeRole(process.env.ADMIN_ROLE || 'owner')

  return {
    id: 'primary-control-user',
    email: process.env.ADMIN_EMAIL || 'admin@planetlocksmiths.com',
    full_name: process.env.ADMIN_NAME || 'Planet Locksmiths Owner',
    role,
    permissions: getRolePermissions(role),
  }
}

export async function requireRole(required: UserRole) {
  const profile = await getCurrentUserProfile()
  if (!profile || !canRole(profile.role, required)) return null
  return profile
}
