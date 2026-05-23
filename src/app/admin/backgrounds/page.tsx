'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'

type BackgroundState = {
  id: string
  desktopUrl: string
  mobileUrl: string
  alt: string
  opacity: string
  desktopPosition: string
  mobilePosition: string
}

const FORM_ID = 'admin-backgrounds-form'
const IMAGE_BUCKET = 'site-images'

const initialState: BackgroundState = {
  id: '',
  desktopUrl: '',
  mobileUrl: '',
  alt: 'Planetlocksmiths background',
  opacity: '0.16',
  desktopPosition: 'center center',
  mobilePosition: 'center center',
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
}

function clampOpacity(value: string) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0.16
  return Math.min(0.55, Math.max(0.02, number))
}

export default function AdminBackgroundsPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [form, setForm] = useState<BackgroundState>(initialState)
  const [isBooting, setIsBooting] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingSlot, setUploadingSlot] = useState<'desktop' | 'mobile' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function boot() {
      try {
        setErrorMessage('')
        setSuccessMessage('')

        const sessionResult = await supabase.auth.getSession()
        const session = sessionResult?.data?.session
        if (!session) {
          router.replace('/admin/login')
          return
        }

        const result = await (supabase.from('site_settings') as any)
          .select('id, brand_name, background_image_url, background_mobile_image_url, background_alt, background_opacity, background_position, background_mobile_position')
          .limit(1)

        if (result.error) throw new Error(result.error.message)

        const row = Array.isArray(result.data) ? result.data[0] : null
        if (mounted && row) {
          setForm({
            id: row.id ?? '',
            desktopUrl: row.background_image_url ?? '',
            mobileUrl: row.background_mobile_image_url ?? '',
            alt: row.background_alt ?? row.brand_name ?? initialState.alt,
            opacity: String(row.background_opacity ?? initialState.opacity),
            desktopPosition: row.background_position ?? initialState.desktopPosition,
            mobilePosition: row.background_mobile_position ?? initialState.mobilePosition,
          })
        }
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить фоны сайта')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => {
      mounted = false
    }
  }, [router, supabase])

  function updateField<K extends keyof BackgroundState>(key: K, value: BackgroundState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleUpload(slot: 'desktop' | 'mobile', event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Можно загрузить только изображение')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setUploadingSlot(slot)

    try {
      const sessionResult = await supabase.auth.getSession()
      if (!sessionResult?.data?.session) {
        router.replace('/admin/login')
        return
      }

      const filePath = `backgrounds/${slot}/${Date.now()}-${sanitizeFileName(file.name)}`
      const uploadResult = await supabase.storage.from(IMAGE_BUCKET).upload(filePath, file, {
        cacheControl: '31536000',
        contentType: file.type,
        upsert: false,
      })

      if (uploadResult.error) throw new Error(uploadResult.error.message)

      const publicUrlResult = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath)
      const url = String(publicUrlResult.data?.publicUrl || '').trim()
      if (!url) throw new Error('Supabase Storage не вернул публичный URL')

      const imageInsert = await (supabase.from('site_images') as any).insert({
        image_url: url,
        storage_path: filePath,
        title: slot === 'desktop' ? 'Site desktop background' : 'Site mobile background',
        alt: form.alt || 'Planetlocksmiths background',
        category: slot === 'desktop' ? 'background-desktop' : 'background-mobile',
        is_published: true,
      })

      if (imageInsert.error) throw new Error(imageInsert.error.message)

      setForm((prev) => ({
        ...prev,
        [slot === 'desktop' ? 'desktopUrl' : 'mobileUrl']: url,
      }))
      setSuccessMessage(`${slot === 'desktop' ? 'Desktop' : 'Mobile'} фон загружен. Нажми “Сохранить фоны сайта”, чтобы применить.`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить фон')
    } finally {
      setUploadingSlot(null)
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSaving(true)

    try {
      const payload = {
        background_image_url: form.desktopUrl.trim() || null,
        background_mobile_image_url: form.mobileUrl.trim() || null,
        background_alt: form.alt.trim() || null,
        background_opacity: clampOpacity(form.opacity),
        background_position: form.desktopPosition.trim() || 'center center',
        background_mobile_position: form.mobilePosition.trim() || 'center center',
      }

      if (form.id) {
        const result = await (supabase.from('site_settings') as any).update(payload).eq('id', form.id)
        if (result.error) throw new Error(result.error.message)
      } else {
        const result = await (supabase.from('site_settings') as any).insert(payload).select('id').single()
        if (result.error) throw new Error(result.error.message)
        setForm((prev) => ({ ...prev, id: result.data?.id ?? '' }))
      }

      setSuccessMessage('Фоны сайта сохранены')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось сохранить фоны сайта')
    } finally {
      setIsSaving(false)
    }
  }

  if (isBooting) {
    return (
      <div style={panelStyle}>
        <p style={eyebrowStyle}>Фоны сайта</p>
        <h1 style={titleStyle}>Загрузка...</h1>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Визуал / фон сайта</p>
          <h1 style={titleStyle}>Фоны сайта</h1>
          <p style={mutedStyle}>Загружай отдельные фоновые изображения для desktop и mobile. Они применяются к общему фону сайта через CinematicBackground на всех публичных страницах.</p>
        </div>
        <a href="/en" target="_blank" rel="noreferrer" style={primaryLinkStyle}>Открыть сайт</a>
      </section>

      {errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}
      {successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}

      <form id={FORM_ID} onSubmit={handleSave} style={formStyle}>
        <section style={previewGridStyle}>
          <BackgroundCard
            title="Desktop background"
            note="Для ПК. Рекомендовано: 2400×1400 или больше, WebP/JPG."
            imageUrl={form.desktopUrl}
            uploadLabel={uploadingSlot === 'desktop' ? 'Загружается...' : 'Загрузить desktop'}
            onUpload={(event) => handleUpload('desktop', event)}
            onRemove={() => updateField('desktopUrl', '')}
          />
          <BackgroundCard
            title="Mobile background"
            note="Для телефона. Рекомендовано: 1200×1800 или больше, WebP/JPG."
            imageUrl={form.mobileUrl}
            uploadLabel={uploadingSlot === 'mobile' ? 'Загружается...' : 'Загрузить mobile'}
            onUpload={(event) => handleUpload('mobile', event)}
            onRemove={() => updateField('mobileUrl', '')}
          />
        </section>

        <section style={fieldPanelStyle}>
          <SectionTitle title="Настройки отображения" text="Opacity лучше держать 0.10–0.24, чтобы фон не мешал тексту и CTA." />
          <div style={fieldGridStyle}>
            <Field label="Desktop URL" value={form.desktopUrl} onChange={(value) => updateField('desktopUrl', value)} placeholder="https://.../desktop-background.webp" />
            <Field label="Mobile URL" value={form.mobileUrl} onChange={(value) => updateField('mobileUrl', value)} placeholder="https://.../mobile-background.webp" />
            <Field label="Alt / описание" value={form.alt} onChange={(value) => updateField('alt', value)} placeholder="Planetlocksmiths background" />
            <Field label="Opacity" value={form.opacity} onChange={(value) => updateField('opacity', value)} placeholder="0.16" type="number" step="0.01" min="0.02" max="0.55" />
            <SelectField label="Desktop position" value={form.desktopPosition} onChange={(value) => updateField('desktopPosition', value)} />
            <SelectField label="Mobile position" value={form.mobilePosition} onChange={(value) => updateField('mobilePosition', value)} />
          </div>
        </section>

        <section style={sitePreviewStyle}>
          <div style={sitePreviewBackdropStyle(form.desktopUrl || form.mobileUrl, clampOpacity(form.opacity), form.desktopPosition)} />
          <div style={sitePreviewOverlayStyle} />
          <div style={sitePreviewContentStyle}>
            <p style={eyebrowStyle}>Preview</p>
            <h2 style={previewTitleStyle}>Planetlocksmiths</h2>
            <p style={previewTextStyle}>Так фон будет работать под белым премиальным интерфейсом: мягко, не спорит с текстом и не ломает CTA.</p>
          </div>
        </section>
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label="Сохранить фоны сайта" note="После сохранения фон подтянется на публичных страницах. Может потребоваться refresh." />
    </div>
  )
}

function BackgroundCard({ title, note, imageUrl, uploadLabel, onUpload, onRemove }: { title: string; note: string; imageUrl: string; uploadLabel: string; onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void; onRemove: () => void }) {
  return (
    <article style={cardStyle}>
      <div>
        <p style={eyebrowStyle}>{title}</p>
        <p style={mutedSmallStyle}>{note}</p>
      </div>
      <div style={backgroundPreviewStyle}>
        {imageUrl ? <img src={imageUrl} alt="Background preview" style={backgroundPreviewImageStyle} /> : <span style={emptyLogoStyle}>NO BACKGROUND</span>}
      </div>
      <div style={actionsStyle}>
        <label style={uploadButtonStyle}>
          {uploadLabel}
          <input type="file" accept="image/png,image/webp,image/jpeg,image/svg+xml" onChange={onUpload} style={hiddenInputStyle} />
        </label>
        <button type="button" onClick={onRemove} style={dangerButtonStyle}>Убрать</button>
      </div>
    </article>
  )
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return <div><p style={eyebrowStyle}>Редактирование</p><h2 style={sectionTitleStyle}>{title}</h2><p style={mutedStyle}>{text}</p></div>
}

function Field({ label, value, placeholder, onChange, type = 'text', step, min, max }: { label: string; value: string; placeholder: string; onChange: (value: string) => void; type?: string; step?: string; min?: string; max?: string }) {
  return <label style={fieldStyle}><span style={labelStyle}>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} step={step} min={min} max={max} style={inputStyle} /></label>
}

function SelectField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const options = ['center center', 'center top', 'center bottom', 'left center', 'right center', 'left top', 'right top', 'left bottom', 'right bottom']
  return <label style={fieldStyle}><span style={labelStyle}>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
}

function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) {
  return <div style={type === 'error' ? messageErrorStyle : messageSuccessStyle}>{children}</div>
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0, paddingBottom: 24 }
const panelStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.035)', padding: 20 }
const heroStyle: CSSProperties = { ...panelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', background: 'radial-gradient(circle at 0% 0%, rgba(45,226,230,0.14), transparent 320px), rgba(255,255,255,0.035)' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const titleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 'clamp(34px, 6vw, 58px)', lineHeight: 0.96, letterSpacing: -2.2 }
const mutedStyle: CSSProperties = { margin: '10px 0 0', color: '#95A0B8', fontSize: 14, lineHeight: 1.7, maxWidth: 760 }
const mutedSmallStyle: CSSProperties = { margin: '8px 0 0', color: '#95A0B8', fontSize: 13, lineHeight: 1.55 }
const primaryLinkStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid rgba(45,226,230,0.5)', background: 'rgba(45,226,230,0.15)', color: '#2DE2E6', textDecoration: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.3 }
const formStyle: CSSProperties = { display: 'grid', gap: 18 }
const previewGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }
const cardStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(11,16,32,0.86), rgba(5,7,11,0.78))', padding: 16, display: 'grid', gap: 14 }
const backgroundPreviewStyle: CSSProperties = { height: 220, borderRadius: 22, border: '1px solid rgba(255,255,255,0.11)', background: 'rgba(255,255,255,0.035)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }
const backgroundPreviewImageStyle: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' }
const emptyLogoStyle: CSSProperties = { color: '#95A0B8', fontSize: 12, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase' }
const actionsStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
const uploadButtonStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid rgba(45,226,230,0.5)', background: 'rgba(45,226,230,0.15)', color: '#2DE2E6', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2, cursor: 'pointer' }
const dangerButtonStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid rgba(255,122,122,0.3)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2, cursor: 'pointer' }
const hiddenInputStyle: CSSProperties = { display: 'none' }
const fieldPanelStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(11,16,32,0.86), rgba(5,7,11,0.78))', padding: 18, display: 'grid', gap: 18 }
const sectionTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 24, lineHeight: 1.1, letterSpacing: -0.7 }
const fieldGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }
const fieldStyle: CSSProperties = { display: 'grid', gap: 8 }
const labelStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, fontWeight: 800 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 50, borderRadius: 15, border: '1px solid rgba(255,255,255,0.11)', background: 'rgba(7,11,20,0.82)', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const messageErrorStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const messageSuccessStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(45,226,230,0.25)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const sitePreviewStyle: CSSProperties = { position: 'relative', minHeight: 280, overflow: 'hidden', borderRadius: 28, border: '1px solid rgba(255,255,255,0.10)', background: '#FFFFFF' }
const sitePreviewOverlayStyle: CSSProperties = { position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.74)', backdropFilter: 'blur(1px)' }
const sitePreviewContentStyle: CSSProperties = { position: 'relative', zIndex: 2, padding: 24, maxWidth: 540 }
const previewTitleStyle: CSSProperties = { margin: '8px 0 0', color: '#0B1F4D', fontSize: 44, lineHeight: 1, letterSpacing: -2 }
const previewTextStyle: CSSProperties = { margin: '14px 0 0', color: '#42526E', fontSize: 15, lineHeight: 1.7 }
function sitePreviewBackdropStyle(url: string, opacity: number, position: string): CSSProperties { return { position: 'absolute', inset: 0, backgroundImage: url ? `url(${url})` : 'linear-gradient(135deg,#F7FAFF,#FFFFFF)', backgroundSize: 'cover', backgroundPosition: position, opacity } }
