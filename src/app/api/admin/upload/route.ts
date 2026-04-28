import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const title = String(formData.get('title') || '').trim()
  const alt = String(formData.get('alt') || '').trim()
  const category = String(formData.get('category') || 'gallery').trim() || 'gallery'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 })

  const supabase = getSupabaseAdmin()
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
  const fileName = `${category}/${Date.now()}-${safeName}`
  const arrayBuffer = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from('site-images')
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from('site-images').getPublicUrl(fileName)

  const { error: dbError } = await supabase.from('site_images').insert({
    image_url: data.publicUrl,
    storage_path: fileName,
    title: title || null,
    alt: alt || title || null,
    category,
  })

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ url: data.publicUrl })
}
