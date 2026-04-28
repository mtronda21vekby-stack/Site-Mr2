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
  const [caseTitle, setCaseTitle] = useState('case')
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
    if (!res.ok) throw new Error(data.error || 'Ошибка загрузки')
  }

  const upload = async () => {
    if (!file || loading) return

    setLoading(true)
    setStatus('Загрузка...')

    try {
      await uploadOne(file, title, alt, category)
      setStatus('Загружено')
      setFile(null)
      setPreview(null)
      setTitle('')
      setAlt('')
      setCategory('gallery')
      await loadPhotos()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  const uploadPair = async () => {
    if (!beforeFile || !afterFile || loading) return

    setLoading(true)
    setStatus('Загрузка кейса...')

    try {
      await uploadOne(beforeFile, caseTitle, caseAlt || `${caseTitle} до`, 'before')
      await uploadOne(afterFile, caseTitle, caseAlt || `${caseTitle} после`, 'after')
      setStatus('Кейс загружен')
      setBeforeFile(null)
      setAfterFile(null)
      setBeforePreview(null)
      setAfterPreview(null)
      setCaseTitle('case')
      setCaseAlt('')
      await loadPhotos()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Удалить фото?')) return

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
          <p className="text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">Админ фото</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">Загрузка фотографий</h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-black">Одиночное фото</h2>
            <input type="file" accept="image/*" onChange={onSelect} />

            <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-3 w-full" />
            <input placeholder="Alt текст" value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-3 w-full" />

            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-3 w-full">
              <option value="gallery">галерея</option>
              <option value="services">сервисы</option>
              <option value="before">до</option>
              <option value="after">после</option>
            </select>

            {preview && <img src={preview} className="mt-4 w-64" />}

            <button onClick={upload} className="mt-4 border px-4 py-2">Загрузить</button>
          </section>

          <section className="rounded-3xl border border-accent-cyan/20 bg-accent-cyan/[0.055] p-5">
            <h2 className="text-xl font-black">Кейс до / после</h2>

            <input placeholder="Название кейса" value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} className="mt-3 w-full" />
            <input placeholder="Описание" value={caseAlt} onChange={(e) => setCaseAlt(e.target.value)} className="mt-3 w-full" />

            <input type="file" onChange={(e) => onPairSelect('before', e)} />
            <input type="file" onChange={(e) => onPairSelect('after', e)} />

            <button onClick={uploadPair} className="mt-4 border px-4 py-2">Загрузить кейс</button>
          </section>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {photos.map((p) => (
            <div key={p.id}>
              <img src={p.image_url} className="w-full" />
              <button onClick={() => remove(p.id)}>Удалить</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
