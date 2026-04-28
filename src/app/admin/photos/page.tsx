'use client'

import { useEffect, useState } from 'react'

type AdminPhoto = {
  id: string
  image_url: string
  storage_path?: string | null
  title?: string | null
  alt?: string | null
  category?: string | null
}

export default function AdminPhotosPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [photos, setPhotos] = useState<AdminPhoto[]>([])
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [category, setCategory] = useState('gallery')

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
    form.append('title', title)
    form.append('alt', alt)
    form.append('category', category)

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
    setTitle('')
    setAlt('')
    setCategory('gallery')
    setLoading(false)
    await loadPhotos()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this photo?')) return

    await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    loadPhotos()
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black mb-6">Photo Upload</h1>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <input type="file" accept="image/*" onChange={onSelect} />

          <input
            placeholder="Title (example: case 1)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-3 w-full bg-black border px-3 py-2"
          />

          <input
            placeholder="Alt text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="mt-3 w-full bg-black border px-3 py-2"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-3 w-full bg-black border px-3 py-2"
          >
            <option value="gallery">gallery</option>
            <option value="before">before</option>
            <option value="after">after</option>
            <option value="services">services</option>
          </select>

          {preview && <img src={preview} className="mt-4 w-64" />}

          <button onClick={upload} className="mt-4 border px-4 py-2">
            Upload
          </button>

          <div>{status}</div>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {photos.map((p) => (
            <div key={p.id}>
              <img src={p.image_url} className="w-full" />
              <div>{p.category}</div>
              <button onClick={() => remove(p.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
