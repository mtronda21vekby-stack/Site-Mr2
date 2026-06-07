import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type ContactRequest = {
  name: string
  phone: string
  email: string
  serviceNeeded: string
  vehicleMakeModel: string
  vehicleYear: string
  location: string
  urgency: string
  preferredTime: string
  message: string
}

type NotificationResult = {
  sent: boolean
  reason: string
}

const defaultContactEmail = 'planetlocksmits@gmail.com'
const defaultFromEmail = 'Planet Locksmiths <onboarding@resend.dev>'
const resendEndpoint = 'https://api.resend.com/emails'
const maxFieldLength = 500
const maxMessageLength = 2000

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing')
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function clean(value: string) {
  return value.trim() || '-'
}

function normalizeText(value: unknown, maxLength = maxFieldLength) {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function normalizeMultilineText(value: unknown, maxLength = maxMessageLength) {
  if (typeof value !== 'string') return ''
  return value.replace(/\r\n/g, '\n').replace(/\n{4,}/g, '\n\n\n').trim().slice(0, maxLength)
}

function hasSpamHoneypot(body: Record<string, unknown>) {
  return Boolean(normalizeText(body.company) || normalizeText(body.website) || normalizeText(body.fax))
}

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function buildEmailRows(contact: ContactRequest) {
  return [
    ['Name', contact.name],
    ['Phone', contact.phone],
    ['Email', contact.email],
    ['Service', contact.serviceNeeded],
    ['Urgency', contact.urgency],
    ['Location', contact.location],
    ['Preferred time', contact.preferredTime],
    ['Vehicle', contact.vehicleMakeModel],
    ['Vehicle year', contact.vehicleYear],
    ['Message', contact.message],
  ] as const
}

function buildEmailText(contact: ContactRequest) {
  return buildEmailRows(contact)
    .map(([label, value]) => `${label}: ${clean(value)}`)
    .join('\n')
}

function buildEmailHtml(contact: ContactRequest) {
  const rows = buildEmailRows(contact)
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#42526e;font-weight:700;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#0b1f4d;">${escapeHtml(clean(value)).replace(/\n/g, '<br>')}</td>
      </tr>
    `)
    .join('')

  return `
    <div style="font-family:Arial,sans-serif;color:#0b1f4d;">
      <h1 style="margin:0 0 12px;font-size:22px;">New Planet Locksmiths service request</h1>
      <p style="margin:0 0 18px;color:#42526e;">A customer submitted the website request form.</p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">${rows}</table>
    </div>
  `
}

async function getSettingsContactEmail(supabase: any) {
  try {
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

async function sendContactNotification(contact: ContactRequest, settingsEmail = ''): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { sent: false, reason: 'missing_resend_api_key' }
  }

  const to = (process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || settingsEmail || defaultContactEmail).trim()
  const from = (process.env.CONTACT_FROM_EMAIL || defaultFromEmail).trim()
  const subjectParts = ['Planet Locksmiths request', contact.serviceNeeded, contact.urgency === 'asap' ? 'ASAP' : contact.urgency]
  const subject = subjectParts.filter(Boolean).join(' - ')
  const payload: Record<string, unknown> = {
    from,
    to: [to],
    subject,
    text: buildEmailText(contact),
    html: buildEmailHtml(contact),
  }

  if (contact.email && isLikelyEmail(contact.email)) {
    payload.reply_to = contact.email
  }

  try {
    const response = await fetch(resendEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return { sent: false, reason: `resend_${response.status}` }
    }

    return { sent: true, reason: '' }
  } catch {
    return { sent: false, reason: 'resend_network_error' }
  }
}

export async function POST(request: Request) {
  let body: any

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    )
  }

  try {
    if (hasSpamHoneypot(body)) {
      return NextResponse.json({ success: true, notificationSent: false })
    }

    const name = normalizeText(body.name)
    const phone = normalizeText(body.phone, 80)
    const email = normalizeText(body.email, 254).toLowerCase()
    const serviceNeeded =
      typeof body.service_needed === 'string'
        ? normalizeText(body.service_needed)
        : typeof body.service === 'string'
          ? normalizeText(body.service)
          : ''

    const vehicleMake =
      normalizeText(body.vehicle_make)

    const vehicleModel =
      normalizeText(body.vehicle_model)

    const vehicleMakeModel =
      typeof body.vehicle_make_model === 'string' && normalizeText(body.vehicle_make_model)
        ? normalizeText(body.vehicle_make_model)
        : [vehicleMake, vehicleModel].filter(Boolean).join(' ')

    const vehicleYear =
      normalizeText(body.vehicle_year, 20)

    const location =
      normalizeText(body.location)

    const urgency =
      typeof body.urgency === 'string' && normalizeText(body.urgency, 40)
        ? normalizeText(body.urgency, 40)
        : 'normal'

    const preferredTime =
      normalizeText(body.preferred_time)

    const message =
      normalizeMultilineText(body.message)

    if (!phone || !serviceNeeded) {
      return NextResponse.json(
        { error: 'Phone and service are required.' },
        { status: 400 }
      )
    }

    if (email && !isLikelyEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address or leave it blank.' },
        { status: 400 }
      )
    }

    const contactRequest: ContactRequest = {
      name,
      phone,
      email,
      serviceNeeded,
      vehicleMakeModel,
      vehicleYear,
      location,
      urgency,
      preferredTime,
      message,
    }

    const supabase = getSupabaseServerClient()

    const { error } = await (supabase.from('orders') as any).insert({
      name: contactRequest.name,
      phone: contactRequest.phone,
      email: email || null,
      service_needed: contactRequest.serviceNeeded,
      vehicle_make_model: contactRequest.vehicleMakeModel || null,
      vehicle_year: contactRequest.vehicleYear || null,
      location: contactRequest.location,
      urgency: contactRequest.urgency,
      preferred_time: contactRequest.preferredTime || null,
      message: contactRequest.message || null,
      status: 'new',
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to create order.' },
        { status: 500 }
      )
    }

    const notificationEmail = await getSettingsContactEmail(supabase)
    const notification = await sendContactNotification(contactRequest, notificationEmail)

    return NextResponse.json({ success: true, notificationSent: notification.sent })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create order.'

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
