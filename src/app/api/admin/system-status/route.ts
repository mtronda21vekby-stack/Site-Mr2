import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

async function hasSupabaseSession(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!token || !url || !anonKey) return false

  try {
    const supabase = createClient(url, anonKey)
    const { data, error } = await supabase.auth.getUser(token)
    return Boolean(!error && data.user)
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  const isAuthorized = await hasSupabaseSession(request)
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasResendKey = Boolean(process.env.RESEND_API_KEY)
  const hasExplicitRecipient = Boolean(process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL)
  const hasVerifiedSender = Boolean(process.env.CONTACT_FROM_EMAIL)
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return NextResponse.json({
    supabase: {
      configured: hasSupabaseEnv,
    },
    emailNotifications: {
      enabled: hasResendKey,
      recipientConfigured: hasExplicitRecipient,
      senderConfigured: hasVerifiedSender,
      recipientSource: process.env.CONTACT_TO_EMAIL ? 'CONTACT_TO_EMAIL' : process.env.ADMIN_EMAIL ? 'ADMIN_EMAIL' : 'site_settings/default fallback',
      senderSource: process.env.CONTACT_FROM_EMAIL ? 'CONTACT_FROM_EMAIL' : 'Resend onboarding fallback',
    },
  })
}
