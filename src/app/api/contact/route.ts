import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are missing')
  }

  return createClient(url, anonKey)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const serviceNeeded =
      typeof body.service_needed === 'string'
        ? body.service_needed.trim()
        : typeof body.service === 'string'
          ? body.service.trim()
          : ''

    const vehicleMakeModel =
      typeof body.vehicle_make_model === 'string'
        ? body.vehicle_make_model.trim()
        : typeof body.vehicle === 'string'
          ? body.vehicle.trim()
          : ''

    const vehicleYear =
      typeof body.vehicle_year === 'string' ? body.vehicle_year.trim() : ''

    const location =
      typeof body.location === 'string' ? body.location.trim() : ''

    const urgency =
      typeof body.urgency === 'string' && body.urgency.trim()
        ? body.urgency.trim()
        : 'normal'

    const preferredTime =
      typeof body.preferred_time === 'string'
        ? body.preferred_time.trim()
        : ''

    const message =
      typeof body.message === 'string' ? body.message.trim() : ''

    if (!phone || !serviceNeeded) {
      return NextResponse.json(
        { error: 'Phone and service are required.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    const { error } = await (supabase.from('orders') as any).insert({
      name,
      phone,
      email: email || null,
      service_needed: serviceNeeded,
      vehicle_make_model: vehicleMakeModel || null,
      vehicle_year: vehicleYear || null,
      location,
      urgency,
      preferred_time: preferredTime || null,
      message: message || null,
      status: 'new',
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to create order.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    )
  }
}
