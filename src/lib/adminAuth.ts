import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'planet_admin_session'

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || ''
}

export async function isAdminAuthenticated() {
  const password = getAdminPassword()
  if (!password) return false

  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === password
}

export async function setAdminSession() {
  const password = getAdminPassword()
  if (!password) return false

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return true
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}
