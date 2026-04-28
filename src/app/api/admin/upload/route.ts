import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const supabase = getSupabaseAdmin()

  const fileName = `${Date.now()}-${file.name}`
  const arrayBuffer = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from('site-images')
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from('site-images').getPublicUrl(fileName)

  return NextResponse.json({ url: data.publicUrl })
}
