'use client'

import { useEffect, useState } from 'react'

type AdminPhoto = {
  id: string
  image_url: string
  storage_path?: string | null
  title?: string | null
  alt?: string | null
  category?: string | null
  created_at?: string | null
}

export default function AdminPhotosPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [photos, setPhotos] = useState<AdminPhoto[]>([])
  const [loading, setLoading] = useState(false)

  const loadPhotos = async () => {
    const res = await fetch('/api/admin/photos')
    const data = await res.json().catch(() => ({}))
    if (res.ok) setPhotos(data.photos ?? [])
  }

  useEffect(() => {
    loadPhotos()
  }, [])

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const upload = async () => {
    if (!file || loading) return

    const form = new FormData()
    form.append('file', file)

    setLoading(true)
    setStatus('Uploading...')

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: form,
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setStatus(data.error || 'Upload failed')
      setLoading(false)
      return
    }

    setStatus('Uploaded')
    setFile(null)
    setPreview(null)
    setLoading(false)
    await loadPhotos()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this photo?')) return

    const res = await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setStatus(data.error || 'Delete failed')
      return
    }

    setStatus('Deleted')
    await loadPhotos()
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">Admin</p>
          <h1 className="mt-2 text-3xl font-black">Photo Upload</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/55">
            Upload customer, service, vehicle key, and locksmith work photos. Images are stored in Supabase and stay available after refresh.
          </p>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
          <input type="file" accept="image/*" onChange={onSelect} className="block w-full text-sm text-white/70" />

          {preview && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <img src={preview} alt="Selected upload preview" className="max-h-80 w-full object-contain" />
            </div>
          )}

          <button
            onClick={upload}
            disabled={!file || loading}
            className="mt-5 rounded-full border border-accent-blue/40 bg-accent-blue/15 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? 'Uploading...' : 'Upload photo'}
          </button>

          <div className="mt-3 text-sm text-white/60">{status}</div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <article key={photo.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
              <img src={photo.image_url} alt={photo.alt || 'Uploaded site photo'} className="h-64 w-full object-cover" />
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-xs uppercase tracking-[0.18em] text-white/45">{photo.category || 'gallery'}</p>
                  <p className="truncate text-sm text-white/75">{photo.title || 'Untitled photo'}</p>
                </div>
                <button onClick={() => remove(photo.id)} className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-300">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
