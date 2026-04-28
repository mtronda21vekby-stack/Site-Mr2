import { NextResponse } from 'next/server'
import { setAdminSession } from '@/lib/adminAuth'

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Admin password is not configured' }, { status: 500 })
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const ok = await setAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unable to create admin session' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
