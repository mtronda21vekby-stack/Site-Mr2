'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  SUPPORTED_UPLOAD_IMAGE_TYPES,
  hasMatchingImageSignature,
  isHeicLikeFile,
} from '@/lib/imageUploadValidation'
import { getSupabaseClient } from '@/lib/supabase/client'

type AdminPhoto = {
  id: string
  image_url: string
  storage_path?: string | null
  title?: string | null
  alt?: string | null
  category?: string | null
  sort_order?: number | null
  is_published?: boolean | null
}

type EditState = Record<string, { title: string; alt: string; category: string; sortOrder: number; isPublished: boolean }>

const IMAGE_BUCKET = 'site-images'
const ACCEPTED_IMAGE_TYPES = 'image/png,image/webp,image/svg+xml,image/jpeg'

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
}

async function getPhotoUploadError(file: File) {
  if (isHeicLikeFile(file)) {
    return 'HEIC/HEIF не грузится стабильно на всех устройствах. Загрузи PNG, WebP, SVG или JPG.'
  }

  if (!SUPPORTED_UPLOAD_IMAGE_TYPES.has(file.type)) {
    return 'Поддерживаются только PNG, WebP, SVG или JPG.'
  }

  if (!(await hasMatchingImageSignature(file))) {
    return 'Файл не похож на выбранный формат. Экспортируй изображение заново в PNG, WebP, SVG или JPG и загрузи еще раз.'
  }

  return ''
}

export default function AdminPhotosPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
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
  const [isBooting, setIsBooting] = useState(true)

  const [title, setTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [category, setCategory] = useState('gallery')
  const [caseTitle, setCaseTitle] = useState('case')
  const [caseAlt, setCaseAlt] = useState('')

  async function ensureSession() {
    const sessionResult = await supabase.auth.getSession()
    const session = sessionResult?.data?.session
    if (!session) {
      router.replace('/admin/login')
      return false
    }
    return true
  }

  async function loadPhotos() {
    const ok = await ensureSession()
    if (!ok) return

    const result = await (supabase.from('site_images') as any)
      .select('id,title,alt,category,image_url,storage_path,sort_order,is_published,created_at')
      .order('created_at', { ascending: false })

    if (result.error) {
      setStatus(result.error.message || 'Не удалось загрузить фото')
      return
    }

    const loadedPhotos: AdminPhoto[] = Array.isArray(result.data) ? result.data : []
    setPhotos(loadedPhotos)
    setEdits(
      Object.fromEntries(
        loadedPhotos.map((p) => [
          p.id,
          {
            title: p.title || '',
            alt: p.alt || '',
            category: p.category || 'gallery',
            sortOrder: Number(p.sort_order ?? 0),
            isPublished: Boolean(p.is_published ?? true),
          },
        ]),
      ),
    )
  }

  useEffect(() => {
    let mounted = true
    async function boot() {
      await loadPhotos()
      if (mounted) setIsBooting(false)
    }
    boot()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const uploadError = await getPhotoUploadError(f)
    if (uploadError) {
      e.target.value = ''
      setStatus(uploadError)
      setFile(null)
      setPreview(null)
      return
    }

    setStatus('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function onPairSelect(type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const uploadError = await getPhotoUploadError(f)
    if (uploadError) {
      e.target.value = ''
      setStatus(uploadError)
      if (type === 'before') {
        setBeforeFile(null)
        setBeforePreview(null)
      } else {
        setAfterFile(null)
        setAfterPreview(null)
      }
      return
    }

    setStatus('')
    if (type === 'before') {
      setBeforeFile(f)
      setBeforePreview(URL.createObjectURL(f))
    } else {
      setAfterFile(f)
      setAfterPreview(URL.createObjectURL(f))
    }
  }

  async function uploadOne(selectedFile: File, selectedTitle: string, selectedAlt: string, selectedCategory: string) {
    const uploadError = await getPhotoUploadError(selectedFile)
    if (uploadError) throw new Error(uploadError)

    const filePath = `${selectedCategory || 'gallery'}/${Date.now()}-${sanitizeFileName(selectedFile.name)}`
    const uploadResult = await supabase.storage.from(IMAGE_BUCKET).upload(filePath, selectedFile, {
      cacheControl: '31536000',
      contentType: selectedFile.type,
      upsert: false,
    })

    if (uploadResult.error) throw new Error(uploadResult.error.message)

    const publicUrlResult = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath)
    const imageUrl = String(publicUrlResult.data?.publicUrl || '').trim()
    if (!imageUrl) throw new Error('Supabase Storage не вернул публичный URL')

    const dbResult = await (supabase.from('site_images') as any).insert({
      image_url: imageUrl,
      storage_path: filePath,
      title: selectedTitle.trim() || null,
      alt: selectedAlt.trim() || selectedTitle.trim() || null,
      category: selectedCategory.trim() || 'gallery',
      is_published: true,
    })

    if (dbResult.error) throw new Error(dbResult.error.message)
  }

  async function upload() {
    if (!file || loading) return
    const ok = await ensureSession()
    if (!ok) return

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

  async function uploadPair() {
    if (!beforeFile || !afterFile || loading) return
    const ok = await ensureSession()
    if (!ok) return

    setLoading(true)
    setStatus('Загрузка кейса...')

    try {
      const caseId = `${caseTitle || 'case'}-${Date.now()}`
      await uploadOne(beforeFile, caseId, caseAlt || `${caseTitle} до`, 'before')
      await uploadOne(afterFile, caseId, caseAlt || `${caseTitle} после`, 'after')
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

  function updateEdit(id: string, field: 'title' | 'alt' | 'category' | 'sortOrder' | 'isPublished', value: string | number | boolean) {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        title: prev[id]?.title || '',
        alt: prev[id]?.alt || '',
        category: prev[id]?.category || 'gallery',
        sortOrder: Number(prev[id]?.sortOrder ?? 0),
        isPublished: Boolean(prev[id]?.isPublished ?? true),
        [field]: value,
      },
    }))
  }

  async function savePhoto(id: string) {
    const ok = await ensureSession()
    if (!ok) return
    const edit = edits[id]
    if (!edit) return

    setStatus('Сохранение...')
    const result = await (supabase.from('site_images') as any)
      .update({
        title: edit.title.trim() || null,
        alt: edit.alt.trim() || null,
        category: edit.category.trim() || 'gallery',
        sort_order: Number(edit.sortOrder || 0),
        is_published: edit.isPublished,
      })
      .eq('id', id)

    if (result.error) {
      setStatus(result.error.message || 'Ошибка сохранения')
      return
    }

    setStatus('Сохранено')
    await loadPhotos()
  }

  async function remove(id: string) {
    const ok = await ensureSession()
    if (!ok) return
    if (!confirm('Удалить фото?')) return

    const photo = photos.find((item) => item.id === id)
    setStatus('Удаление...')

    if (photo?.storage_path) {
      const storageResult = await supabase.storage.from(IMAGE_BUCKET).remove([photo.storage_path])
      if (storageResult.error) {
        setStatus(storageResult.error.message || 'Не удалось удалить файл из storage')
        return
      }
    }

    const dbResult = await (supabase.from('site_images') as any).delete().eq('id', id)
    if (dbResult.error) {
      setStatus(dbResult.error.message || 'Не удалось удалить запись')
      return
    }

    setStatus('Удалено')
    await loadPhotos()
  }

  if (isBooting) {
    return (
      <main className="min-w-0 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_54px_rgba(0,0,0,0.20)]">Загрузка...</div>
      </main>
    )
  }

  return (
    <main className="min-w-0 text-white">
      <div className="grid gap-5">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_54px_rgba(0,0,0,0.20)] backdrop-blur-xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D6A85F]">Media CMS</p>
          <h1 className="mt-2 text-3xl font-black md:text-5xl">Загрузка и редактирование фотографий</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">Фото теперь загружаются напрямую через Supabase Storage и сохраняются в таблицу site_images через Supabase Auth. Без отдельного ADMIN_PASSWORD API.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <h2 className="text-xl font-black">Одиночное фото</h2>
            <input type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={onSelect} className="mt-5 block w-full text-sm text-white/70" />
            <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />
            <textarea placeholder="Alt текст / описание" value={alt} onChange={(e) => setAlt(e.target.value)} className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />
            <input placeholder="Категория: gallery / services / before / after / logo" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />
            {preview && <img src={preview} alt="Превью" className="mt-4 max-h-64 w-full rounded-2xl bg-black/50 object-contain" />}
            <button onClick={upload} disabled={!file || loading} className="mt-5 rounded-full border border-[#D6A85F]/40 bg-[#D6A85F]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#F0D099] disabled:opacity-40">Загрузить фото</button>
          </section>

          <section className="rounded-3xl border border-[#D6A85F]/25 bg-[#D6A85F]/[0.07] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            <h2 className="text-xl font-black">Кейс до / после</h2>
            <input placeholder="Название кейса" value={caseTitle} onChange={(e) => setCaseTitle(e.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />
            <textarea placeholder="Описание кейса" value={caseAlt} onChange={(e) => setCaseAlt(e.target.value)} className="mt-3 min-h-24 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-3 text-white" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="rounded-2xl border border-white/10 bg-black/35 p-4"><span className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">До</span><input type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={(e) => onPairSelect('before', e)} className="mt-3 block w-full text-xs" />{beforePreview && <img src={beforePreview} alt="До" className="mt-3 h-44 w-full rounded-xl object-cover" />}</label>
              <label className="rounded-2xl border border-white/10 bg-black/35 p-4"><span className="block text-xs font-black uppercase tracking-[0.18em] text-white/55">После</span><input type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={(e) => onPairSelect('after', e)} className="mt-3 block w-full text-xs" />{afterPreview && <img src={afterPreview} alt="После" className="mt-3 h-44 w-full rounded-xl object-cover" />}</label>
            </div>
            <button onClick={uploadPair} disabled={!beforeFile || !afterFile || loading} className="mt-5 rounded-full border border-[#D6A85F]/45 bg-[#D6A85F]/15 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#F0D099] disabled:opacity-40">Загрузить кейс</button>
          </section>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/70">{status || 'Готово к работе'}</div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => {
            const edit = edits[p.id] || { title: '', alt: '', category: 'gallery', sortOrder: 0, isPublished: true }
            return (
              <article key={p.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-[0_18px_54px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <img src={p.image_url} alt={p.alt || 'Фото сайта'} className="h-64 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <input value={edit.title} onChange={(e) => updateEdit(p.id, 'title', e.target.value)} placeholder="Название" className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white" />
                  <textarea value={edit.alt} onChange={(e) => updateEdit(p.id, 'alt', e.target.value)} placeholder="Описание / alt" className="min-h-20 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white" />
                  <div className="grid grid-cols-[1fr_90px] gap-2">
                    <input value={edit.category} onChange={(e) => updateEdit(p.id, 'category', e.target.value)} placeholder="Категория" className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white" />
                    <input type="number" value={edit.sortOrder} onChange={(e) => updateEdit(p.id, 'sortOrder', Number(e.target.value))} placeholder="Sort" className="w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm text-white" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={edit.isPublished} onChange={(e) => updateEdit(p.id, 'isPublished', e.target.checked)} /> Опубликовано</label>
                  <div className="flex gap-2">
                    <button onClick={() => savePhoto(p.id)} className="rounded-full border border-[#D6A85F]/40 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#F0D099]">Сохранить</button>
                    <button onClick={() => remove(p.id)} className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-300">Удалить</button>
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
