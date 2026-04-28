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

type EditState = Record<string, { title: string; alt: string; category: string }>

export default function AdminPhotosPage() {
  const [file, setFile] = useState<File | null>(null)
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [beforePreview, setBeforePreview] = useState<string | null>(null)
  const [afterPreview, setAfterPreview] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [photos, setPhotos] = useState<AdminPhoto[]>([])
  const [edits, setEdits] = useState<EditState>({})
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [category, setCategory] = useState('gallery')
  const [caseTitle, setCaseTitle] = useState('case')
  const [caseAlt, setCaseAlt] = useState('')

  const loadPhotos = async () => {
    const res = await fetch('/api/admin/photos')
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      const loadedPhotos: AdminPhoto[] = data.photos ?? []
      setPhotos(loadedPhotos)
      setEdits(
        Object.fromEntries(
          loadedPhotos.map((p) => [
            p.id,
            {
              title: p.title || '',
              alt: p.alt || '',
              category: p.category || 'gallery',
            },
          ]),
        ),
      )
    }
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
      setStatus('Фото загружено')
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

  const updateEdit = (id: string, field: 'title' | 'alt' | 'category', value: string) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        title: prev[id]?.title || '',
        alt: prev[id]?.alt || '',
        category: prev[id]?.category || 'gallery',
        [field]: value,
      },
    }))
  }

  const savePhoto = async (id: string) => {
    const edit = edits[id]
    if (!edit) return

    setStatus('Сохранение...')
    const res = await fetch('/api/admin/photos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...edit }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setStatus(data.error || 'Ошибка сохранения')
      return
    }

    setStatus('Сохранено')
    await loadPhotos()
  }

  const remove = async (id: string) => {
    if (!confirm('Удалить фото?')) return

    await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    setStatus('Удалено')
    await loadPhotos()
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-accent-cyan">Админ фото</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">Загрузка и редактирование фотографий</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
            Загружайте фотографии, создавайте пары до/после и редактируйте название, описание и категорию прямо под каждым изображением.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-black">Одиночное фото</h2>
            <input type="file" accept="image/*" onChange={onSelect} className="mt-5 block w-full text-sm text-white/70" />

            <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />
            <textarea placeholder="Alt текст / описание" value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />

            <input placeholder="Категория: gallery / services / before / after / любая своя" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />

            {preview && <img src={preview} alt="Превью" className="mt-4 max-h-64 w-full rounded-2xl bg-black/50 object-contain" />}

            <button onClick={upload} disabled={!file || loading} className="mt-5 rounded-full border border-accent-cyan/35 bg-accent-cyan/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white disabled:opacity-40">
              Загрузить фото
            </button>
          </section>

          <section className="rounded-3xl border border-accent-cyan/20 bg-accent-cyan/[0.055] p-5 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-black">Кейс до / после</h2>
            <input placeholder="Название кейса" value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />
            <textarea placeholder="Описание кейса" value={caseAlt} onChange={(e) => setCaseAlt(e.target.value)} className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="rounded-2xl border border-white/10 bg-black/35 p-4">
                <span className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">До</span>
                <input type="file" accept="image/*" onChange={(e) => onPairSelect('before', e)} className="mt-3 block w-full text-xs" />
                {beforePreview && <img src={beforePreview} alt="До" className="mt-3 h-44 w-full rounded-xl object-cover" />}
              </label>

              <label className="rounded-2xl border border-white/10 bg-black/35 p-4">
                <span className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">После</span>
                <input type="file" accept="image/*" onChange={(e) => onPairSelect('after', e)} className="mt-3 block w-full text-xs" />
                {afterPreview && <img src={afterPreview} alt="После" className="mt-3 h-44 w-full rounded-xl object-cover" />}
              </label>
            </div>

            <button onClick={uploadPair} disabled={!beforeFile || !afterFile || loading} className="mt-5 rounded-full border border-accent-cyan/45 bg-accent-cyan/15 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white disabled:opacity-40">
              Загрузить кейс
            </button>
          </section>
        </div>

        <div className="mt-4 text-sm text-white/60">{status}</div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => {
            const edit = edits[p.id] || { title: '', alt: '', category: 'gallery' }

            return (
              <article key={p.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl backdrop-blur-xl">
                <img src={p.image_url} alt={p.alt || 'Фото сайта'} className="h-64 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <input value={edit.title} onChange={(e) => updateEdit(p.id, 'title', e.target.value)} placeholder="Название" className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white" />
                  <textarea value={edit.alt} onChange={(e) => updateEdit(p.id, 'alt', e.target.value)} placeholder="Описание / alt" className="min-h-20 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white" />
                  <input value={edit.category} onChange={(e) => updateEdit(p.id, 'category', e.target.value)} placeholder="Категория" className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white" />
                  <div className="flex gap-2">
                    <button onClick={() => savePhoto(p.id)} className="rounded-full border border-accent-cyan/35 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-accent-cyan">
                      Сохранить
                    </button>
                    <button onClick={() => remove(p.id)} className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-300">
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </main>
  )
}
