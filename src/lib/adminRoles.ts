import { isAdminAuthenticated } from '@/lib/adminAuth'

export type UserRole = 'owner' | 'manager' | 'viewer'

export type CurrentUserProfile = {
  id: string
  email: string
  full_name: string | null
  role: UserRole
}

const roleRank: Record<UserRole, number> = {
  viewer: 1,
  manager: 2,
  owner: 3,
}

export function canRole(role: UserRole, required: UserRole) {
  return roleRank[role] >= roleRank[required]
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return null

  return {
    id: 'primary-control-user',
    email: process.env.ADMIN_EMAIL || 'admin@planetlocksmiths.com',
    full_name: process.env.ADMIN_NAME || 'Planet Locksmiths Owner',
    role: (process.env.ADMIN_ROLE as UserRole) || 'owner',
  }
}

export async function requireRole(required: UserRole) {
  const profile = await getCurrentUserProfile()
  if (!profile || !canRole(profile.role, required)) return null
  return profile
}
