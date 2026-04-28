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
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [beforePreview, setBeforePreview] = useState<string | null>(null)
  const [afterPreview, setAfterPreview] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [photos, setPhotos] = useState<AdminPhoto[]>([])
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [category, setCategory] = useState('gallery')
  const [caseTitle, setCaseTitle] = useState('case 1')
  const [caseAlt, setCaseAlt] = useState('')

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

  const onPairSelect = (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (type === 'before') {
      setBeforeFile(f)
      setBeforePreview(URL.createObjectURL(f))
    } else {
      setAfterFile(f)
      setAfterPreview(URL.createObjectURL(f))
    }
  }

  const uploadOne = async (selectedFile: File, selectedTitle: string, selectedAlt: string, selectedCategory: string) => {
    const form = new FormData()
    form.append('file', selectedFile)
    form.append('title', selectedTitle)
    form.append('alt', selectedAlt)
    form.append('category', selectedCategory)

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: form,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Upload failed')
  }

  const upload = async () => {
    if (!file || loading) return

    setLoading(true)
    setStatus('Uploading...')

    try {
      await uploadOne(file, title, alt, category)
      setStatus('Uploaded')
      setFile(null)
      setPreview(null)
      setTitle('')
      setAlt('')
      setCategory('gallery')
      await loadPhotos()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const uploadPair = async () => {
    if (!beforeFile || !afterFile || loading) return

    setLoading(true)
    setStatus('Uploading before/after case...')

    try {
      await uploadOne(beforeFile, caseTitle, caseAlt || `${caseTitle} before`, 'before')
      await uploadOne(afterFile, caseTitle, caseAlt || `${caseTitle} after`, 'after')
      setStatus('Before/after case uploaded')
      setBeforeFile(null)
      setAfterFile(null)
      setBeforePreview(null)
      setAfterPreview(null)
      setCaseTitle('case 1')
      setCaseAlt('')
      await loadPhotos()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Pair upload failed')
    } finally {
      setLoading(false)
    }
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
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">Admin photos</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">Photo Upload</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
            Upload regular gallery photos or create a before/after proof case with two files in one workflow.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-black">Single photo</h2>
            <input type="file" accept="image/*" onChange={onSelect} className="mt-5 block w-full text-sm text-white/70" />

            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3" />
            <input placeholder="Alt text" value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3" />

            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3">
              <option value="gallery">gallery</option>
              <option value="services">services</option>
              <option value="before">before</option>
              <option value="after">after</option>
            </select>

            {preview && <img src={preview} alt="Preview" className="mt-4 max-h-64 w-full rounded-2xl object-contain bg-black/50" />}

            <button onClick={upload} disabled={!file || loading} className="mt-5 rounded-full border border-accent-cyan/35 bg-accent-cyan/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] disabled:opacity-40">
              Upload photo
            </button>
          </section>

          <section className="rounded-3xl border border-accent-cyan/20 bg-accent-cyan/[0.055] p-5 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-black">Before / After pair</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">Upload two images as one proof case. The title must be case 1, case 2, etc.</p>

            <input placeholder="Case title: case 1" value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3" />
            <input placeholder="Alt text / description" value={caseAlt} onChange={(e) => setCaseAlt(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3" />

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="rounded-2xl border border-white/10 bg-black/35 p-4">
                <span className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">Before</span>
                <input type="file" accept="image/*" onChange={(e) => onPairSelect('before', e)} className="mt-3 block w-full text-xs" />
                {beforePreview && <img src={beforePreview} alt="Before preview" className="mt-3 h-44 w-full rounded-xl object-cover" />}
              </label>

              <label className="rounded-2xl border border-white/10 bg-black/35 p-4">
                <span className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">After</span>
                <input type="file" accept="image/*" onChange={(e) => onPairSelect('after', e)} className="mt-3 block w-full text-xs" />
                {afterPreview && <img src={afterPreview} alt="After preview" className="mt-3 h-44 w-full rounded-xl object-cover" />}
              </label>
            </div>

            <button onClick={uploadPair} disabled={!beforeFile || !afterFile || loading} className="mt-5 rounded-full border border-accent-cyan/45 bg-accent-cyan/15 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] disabled:opacity-40">
              Upload case
            </button>
          </section>
        </div>

        <div className="mt-4 text-sm text-white/60">{status}</div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
              <img src={p.image_url} alt={p.alt || 'Uploaded site photo'} className="h-64 w-full object-cover" />
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-xs uppercase tracking-[0.18em] text-accent-cyan/70">{p.category || 'gallery'}</p>
                  <p className="truncate text-sm text-white/75">{p.title || 'Untitled photo'}</p>
                </div>
                <button onClick={() => remove(p.id)} className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-300">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
