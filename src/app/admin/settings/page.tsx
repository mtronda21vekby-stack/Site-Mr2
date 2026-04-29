'use client'

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'

type SettingsState = {
  id: string
  brandName: string
  phonePrimary: string
  phoneDisplay: string
  email: string
  serviceHours: string
}

const FORM_ID = 'admin-settings-form'

const initialState: SettingsState = {
  id: '',
  brandName: 'Planet Locksmiths',
  phonePrimary: '+1 (267) 000-0000',
  phoneDisplay: '(267) 000-0000',
  email: 'hello@planetlocksmiths.com',
  serviceHours: '24/7 Mobile Service',
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [form, setForm] = useState<SettingsState>(initialState)
  const [isBooting, setIsBooting] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
          .select('id, brand_name, phone_primary, phone_display, email, service_hours')
          .limit(1)

        if (result.error) throw new Error(result.error.message)

        const row = Array.isArray(result.data) ? result.data[0] : null

        if (mounted && row) {
          setForm({
            id: row.id ?? '',
            brandName: row.brand_name ?? initialState.brandName,
            phonePrimary: row.phone_primary ?? initialState.phonePrimary,
            phoneDisplay: row.phone_display ?? initialState.phoneDisplay,
            email: row.email ?? initialState.email,
            serviceHours: row.service_hours ?? initialState.serviceHours,
          })
        }
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить настройки')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  function updateField<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSaving(true)

    try {
      const payload = {
        brand_name: form.brandName.trim() || null,
        phone_primary: form.phonePrimary.trim() || null,
        phone_display: form.phoneDisplay.trim() || null,
        email: form.email.trim() || null,
        service_hours: form.serviceHours.trim() || null,
      }

      if (form.id) {
        const result = await (supabase.from('site_settings') as any).update(payload).eq('id', form.id)
        if (result.error) throw new Error(result.error.message)
      } else {
        const result = await (supabase.from('site_settings') as any).insert(payload).select('id').single()
        if (result.error) throw new Error(result.error.message)
        setForm((prev) => ({ ...prev, id: result.data?.id ?? '' }))
      }

      setSuccessMessage('Настройки сохранены')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось сохранить настройки')
    } finally {
      setIsSaving(false)
    }
  }

  if (isBooting) {
    return (
      <div style={panelStyle}>
        <p style={eyebrowStyle}>Настройки</p>
        <h1 style={titleStyle}>Загрузка...</h1>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Сайт / глобальные настройки</p>
          <h1 style={titleStyle}>Настройки сайта</h1>
          <p style={mutedStyle}>
            Управление брендом, телефоном, email, часами работы и контактными CTA. Эти данные используются в шапке, формах и контактных блоках сайта.
          </p>
        </div>

        <div style={heroActionsStyle}>
          <a href="/en" target="_blank" rel="noreferrer" style={primaryLinkStyle}>Открыть сайт</a>
          <a href={`tel:${form.phonePrimary}`} style={secondaryLinkStyle}>Позвонить</a>
        </div>
      </section>

      <section style={guideGridStyle}>
        <InfoCard title="Телефон" value={form.phoneDisplay || form.phonePrimary || 'Не указан'} note="Показывается в CTA и контактных блоках." />
        <InfoCard title="Email" value={form.email || 'Не указан'} note="Используется в контактной информации." />
        <InfoCard title="Часы работы" value={form.serviceHours || 'Не указаны'} note="Отображается на сайте для клиентов." />
      </section>

      {errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}
      {successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}

      <form id={FORM_ID} onSubmit={handleSave} style={formStyle}>
        <SectionTitle title="Бренд и контакты" text="Можно вводить любые данные без ограничений. Пустые поля сохраняются как пустые значения." />

        <div style={fieldGridStyle}>
          <Field label="Название бренда" value={form.brandName} onChange={(value) => updateField('brandName', value)} placeholder="Planet Locksmiths" />
          <Field label="Основной телефон" value={form.phonePrimary} onChange={(value) => updateField('phonePrimary', value)} placeholder="+1 (267) 000-0000" />
          <Field label="Телефон для отображения" value={form.phoneDisplay} onChange={(value) => updateField('phoneDisplay', value)} placeholder="(267) 000-0000" />
          <Field label="Email" value={form.email} onChange={(value) => updateField('email', value)} placeholder="hello@planetlocksmiths.com" />
          <Field label="Часы работы" value={form.serviceHours} onChange={(value) => updateField('serviceHours', value)} placeholder="24/7 Mobile Service" />
        </div>
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label="Сохранить настройки" note="Изменения применяются к глобальным контактам, шапке сайта и CTA-блокам." />
    </div>
  )
}

function InfoCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <article style={infoCardStyle}>
      <p style={eyebrowStyle}>{title}</p>
      <strong style={infoValueStyle}>{value}</strong>
      <span style={infoNoteStyle}>{note}</span>
    </article>
  )
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div style={sectionTitleWrapStyle}>
      <p style={eyebrowStyle}>Редактирование</p>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <p style={mutedStyle}>{text}</p>
    </div>
  )
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />
    </label>
  )
}

function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) {
  const isError = type === 'error'
  return <div style={isError ? messageErrorStyle : messageSuccessStyle}>{children}</div>
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0 }
const panelStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.035)', padding: 20 }
const heroStyle: CSSProperties = { ...panelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', background: 'radial-gradient(circle at 0% 0%, rgba(45,226,230,0.14), transparent 320px), rgba(255,255,255,0.035)' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const titleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 'clamp(34px, 6vw, 58px)', lineHeight: 0.96, letterSpacing: -2.2 }
const mutedStyle: CSSProperties = { margin: '10px 0 0', color: '#95A0B8', fontSize: 14, lineHeight: 1.7, maxWidth: 760 }
const heroActionsStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
const primaryLinkStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid rgba(45,226,230,0.5)', background: 'rgba(45,226,230,0.15)', color: '#2DE2E6', textDecoration: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.3 }
const secondaryLinkStyle: CSSProperties = { minHeight: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.035)', color: '#F5F7FB', textDecoration: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.3 }
const guideGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }
const infoCardStyle: CSSProperties = { borderRadius: 22, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(17,25,46,0.82), rgba(5,7,11,0.72))', padding: 16, display: 'grid', gap: 8, minWidth: 0 }
const infoValueStyle: CSSProperties = { color: '#F5F7FB', fontSize: 20, lineHeight: 1.15, wordBreak: 'break-word' }
const infoNoteStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, lineHeight: 1.5 }
const formStyle: CSSProperties = { display: 'grid', gap: 18, borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(11,16,32,0.86), rgba(5,7,11,0.78))', padding: 18 }
const sectionTitleWrapStyle: CSSProperties = { display: 'grid', gap: 4 }
const sectionTitleStyle: CSSProperties = { margin: 0, color: '#F5F7FB', fontSize: 24, lineHeight: 1.1, letterSpacing: -0.7 }
const fieldGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }
const fieldStyle: CSSProperties = { display: 'grid', gap: 8 }
const labelStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, fontWeight: 800 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 50, borderRadius: 15, border: '1px solid rgba(255,255,255,0.11)', background: 'rgba(7,11,20,0.82)', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const messageErrorStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const messageSuccessStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(45,226,230,0.25)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
