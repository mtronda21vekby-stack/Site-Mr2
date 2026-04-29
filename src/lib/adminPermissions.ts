export type UserRole = 'owner' | 'manager' | 'viewer'

export type AdminPermission =
  | 'content:read'
  | 'content:write'
  | 'orders:read'
  | 'orders:write'
  | 'orders:delete'
  | 'photos:read'
  | 'photos:write'
  | 'photos:delete'
  | 'settings:read'
  | 'settings:write'
  | 'users:read'
  | 'users:write'

export type AdminPermissionMap = Record<AdminPermission, boolean>

const roleRank: Record<UserRole, number> = {
  viewer: 1,
  manager: 2,
  owner: 3,
}

const ownerPermissions: AdminPermission[] = [
  'content:read',
  'content:write',
  'orders:read',
  'orders:write',
  'orders:delete',
  'photos:read',
  'photos:write',
  'photos:delete',
  'settings:read',
  'settings:write',
  'users:read',
  'users:write',
]

const managerPermissions: AdminPermission[] = [
  'content:read',
  'content:write',
  'orders:read',
  'orders:write',
  'photos:read',
  'photos:write',
  'settings:read',
  'users:read',
]

const viewerPermissions: AdminPermission[] = [
  'content:read',
  'orders:read',
  'photos:read',
  'settings:read',
  'users:read',
]

const permissionsByRole: Record<UserRole, AdminPermission[]> = {
  owner: ownerPermissions,
  manager: managerPermissions,
  viewer: viewerPermissions,
}

export function normalizeRole(role: unknown): UserRole {
  return role === 'manager' || role === 'viewer' || role === 'owner' ? role : 'viewer'
}

export function canRole(role: UserRole, required: UserRole) {
  return roleRank[role] >= roleRank[required]
}

export function getRolePermissions(role: UserRole): AdminPermissionMap {
  const allowed = new Set(permissionsByRole[role])
  return ownerPermissions.reduce((acc, permission) => {
    acc[permission] = allowed.has(permission)
    return acc
  }, {} as AdminPermissionMap)
}

export function hasPermission(role: UserRole, permission: AdminPermission) {
  return getRolePermissions(role)[permission]
}

export const roleLabels: Record<UserRole, string> = {
  owner: 'Владелец',
  manager: 'Менеджер',
  viewer: 'Просмотр',
}
