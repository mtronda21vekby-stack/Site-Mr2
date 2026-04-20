import { NextResponse } from 'next/server'

type ContactPayload = {
  name?: string
  phone?: string
  service?: string
  vehicle?: string
  location?: string
  message?: string
  locale?: string
  website?: string
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildTelegramMessage(payload: Required<ContactPayload>) {
  return [
    '<b>New service request</b>',
    '',
    `<b>Locale:</b> ${escapeHtml(payload.locale)}`,
    `<b>Name:</b> ${escapeHtml(payload.name || '-')}`,
    `<b>Phone:</b> ${escapeHtml(payload.phone)}`,
    `<b>Service:</b> ${escapeHtml(payload.service)}`,
    `<b>Vehicle:</b> ${escapeHtml(payload.vehicle || '-')}`,
    `<b>Location:</b> ${escapeHtml(payload.location || '-')}`,
    `<b>Message:</b> ${escapeHtml(payload.message || '-')}`,
  ].join('\n')
}

async function sendTelegramLead(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return { skipped: true }
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Telegram send failed: ${text}`)
  }

  return { skipped: false }
}

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as ContactPayload

    const payload: Required<ContactPayload> = {
      name: clean(raw.name),
      phone: clean(raw.phone),
      service: clean(raw.service),
      vehicle: clean(raw.vehicle),
      location: clean(raw.location),
      message: clean(raw.message),
      locale: clean(raw.locale) || 'en',
      website: clean(raw.website),
    }

    if (payload.website) {
      return NextResponse.json({ success: true })
    }

    if (!payload.phone) {
      return NextResponse.json({ error: 'Phone is required.' }, { status: 400 })
    }

    if (!payload.service) {
      return NextResponse.json({ error: 'Service is required.' }, { status: 400 })
    }

    const message = buildTelegramMessage(payload)
    await sendTelegramLead(message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('contact route error', error)
    return NextResponse.json(
      { error: 'Unable to submit request right now.' },
      { status: 500 }
    )
  }
}
