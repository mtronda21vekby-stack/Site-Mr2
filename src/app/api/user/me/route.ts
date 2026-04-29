import { NextResponse } from 'next/server'
import { getCurrentUserProfile } from '@/lib/adminRoles'

export async function GET() {
  const profile = await getCurrentUserProfile()

  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ user: profile })
}
