import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const defaultContactEmail = 'planetlocksmits@gmail.com'

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

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

async function getSettingsContactEmail() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return ''

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const result = await (supabase.from('site_settings') as any)
      .select('email')
      .order('updated_at', { ascending: false })
      .limit(1)

    const email = String(result.data?.[0]?.email || '').trim()
    return isLikelyEmail(email) ? email : ''
  } catch {
    return ''
  }
}

export async function GET(request: Request) {
  const isAuthorized = await hasSupabaseSession(request)
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hasResendKey = Boolean(process.env.RESEND_API_KEY)
  const hasExplicitRecipient = Boolean(process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL)
  const settingsRecipientEmail = await getSettingsContactEmail()
  const hasFallbackRecipient = isLikelyEmail(defaultContactEmail)
  const hasVerifiedSender = Boolean(process.env.CONTACT_FROM_EMAIL)
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const hasSupabaseServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const recipientSource = process.env.CONTACT_TO_EMAIL
    ? 'CONTACT_TO_EMAIL'
    : process.env.ADMIN_EMAIL
      ? 'ADMIN_EMAIL'
      : settingsRecipientEmail
        ? 'site_settings.email'
        : hasFallbackRecipient
          ? 'default fallback'
          : 'missing'

  return NextResponse.json({
    supabase: {
      configured: hasSupabaseEnv,
      serviceRoleConfigured: hasSupabaseServiceRole,
    },
    emailNotifications: {
      enabled: hasResendKey,
      recipientConfigured: Boolean(hasExplicitRecipient || settingsRecipientEmail || hasFallbackRecipient),
      senderConfigured: hasVerifiedSender,
      recipientSource,
      senderSource: process.env.CONTACT_FROM_EMAIL ? 'CONTACT_FROM_EMAIL' : 'Resend onboarding fallback',
    },
  })
}
