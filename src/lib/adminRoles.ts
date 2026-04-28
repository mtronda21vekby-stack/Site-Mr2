import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

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
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) return null

  const authClient = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll() {},
    },
  })

  const { data: authData } = await authClient.auth.getUser()
  const user = authData.user
  if (!user?.id) return null

  const admin = getSupabaseAdmin()
  const { data } = await admin
    .from('user_profiles')
    .select('id,email,full_name,role')
    .eq('id', user.id)
    .maybeSingle()

  const email = user.email || data?.email || ''
  const role = (data?.role || 'viewer') as UserRole

  return {
    id: user.id,
    email,
    full_name: data?.full_name || null,
    role,
  }
}

export async function requireRole(required: UserRole) {
  const profile = await getCurrentUserProfile()
  if (!profile || !canRole(profile.role, required)) return null
  return profile
}
