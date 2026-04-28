import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('site_images')
    .select('id,title,alt,category,image_url,storage_path,created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ photos: data ?? [] })
}

export async function PATCH(req: Request) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, title, alt, category } = (await req.json().catch(() => ({}))) as {
    id?: string
    title?: string
    alt?: string
    category?: string
  }

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('site_images')
    .update({
      title: title ?? null,
      alt: alt ?? null,
      category: category || 'gallery',
    })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = (await req.json().catch(() => ({}))) as { id?: string }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  const { data: photo, error: readError } = await supabase
    .from('site_images')
    .select('storage_path')
    .eq('id', id)
    .single()

  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 })

  if (photo?.storage_path) {
    await supabase.storage.from('site-images').remove([photo.storage_path])
  }

  const { error } = await supabase.from('site_images').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
