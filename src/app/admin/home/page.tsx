'use client'

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { getDefaultHomePreset } from '@/lib/site-defaults'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'

type Locale = 'en' | 'es' | 'ru'

type HomePageForm = {
  id: string
  locale: Locale
  heroTitle: string
  heroSubtitle: string
  heroPrimaryCta: string
  heroSecondaryCta: string
  emergencyTitle: string
  emergencyText: string
  reviewsTitle: string
  faqTitle: string
  contactTitle: string
  contactText: string
}

const locales: Locale[] = ['en', 'es', 'ru']
const FORM_ID = 'admin-home-form'

const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
}

const emptyForm = (locale: Locale): HomePageForm => ({
  id: '',
  locale,
  ...getDefaultHomePreset(locale),
})

function withFallback(value: string | null | undefined, fallback: string) {
  return String(value || '').trim() || fallback
}

export default function AdminHomePage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [forms, setForms] = useState<Record<Locale, HomePageForm>>({ en: emptyForm('en'), es: emptyForm('es'), ru: emptyForm('ru') })
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
        if (!session) { router.replace('/admin/login'); return }

        const result = await (supabase.from('home_pages') as any)
          .select('id, locale, hero_title, hero_subtitle, hero_primary_cta, hero_secondary_cta, emergency_title, emergency_text, reviews_title, faq_title, contact_title, contact_text')

        if (result.error) throw new Error(result.error.message)

        const rows = Array.isArray(result.data) ? result.data : []
        const nextForms: Record<Locale, HomePageForm> = { en: emptyForm('en'), es: emptyForm('es'), ru: emptyForm('ru') }

        for (const row of rows) {
          const locale = row.locale as Locale
          if (!locales.includes(locale)) continue
          const fallback = emptyForm(locale)
          nextForms[locale] = {
            id: row.id ?? '',
            locale,
            heroTitle: withFallback(row.hero_title, fallback.heroTitle),
            heroSubtitle: withFallback(row.hero_subtitle, fallback.heroSubtitle),
            heroPrimaryCta: withFallback(row.hero_primary_cta, fallback.heroPrimaryCta),
            heroSecondaryCta: withFallback(row.hero_secondary_cta, fallback.heroSecondaryCta),
            emergencyTitle: withFallback(row.emergency_title, fallback.emergencyTitle),
            emergencyText: withFallback(row.emergency_text, fallback.emergencyText),
            reviewsTitle: withFallback(row.reviews_title, fallback.reviewsTitle),
            faqTitle: withFallback(row.faq_title, fallback.faqTitle),
            contactTitle: withFallback(row.contact_title, fallback.contactTitle),
            contactText: withFallback(row.contact_text, fallback.contactText),
          }
        }

        if (!mounted) return
        setForms(nextForms)
      } catch (error) {
        if (!mounted) return
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить главную страницу')
      } finally {
        if (mounted) setIsBooting(false)
      }
    }

    boot()
    return () => { mounted = false }
  }, [router, supabase])

  function updateField<K extends keyof HomePageForm>(key: K, value: HomePageForm[K]) {
    setForms((prev) => ({ ...prev, [activeLocale]: { ...prev[activeLocale], [key]: value } }))
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsSaving(true)

    try {
      const form = forms[activeLocale]
      const payload = {
        locale: activeLocale,
        hero_title: form.heroTitle.trim(),
        hero_subtitle: form.heroSubtitle.trim(),
        hero_primary_cta: form.heroPrimaryCta.trim(),
        hero_secondary_cta: form.heroSecondaryCta.trim(),
        emergency_title: form.emergencyTitle.trim(),
        emergency_text: form.emergencyText.trim(),
        reviews_title: form.reviewsTitle.trim(),
        faq_title: form.faqTitle.trim(),
        contact_title: form.contactTitle.trim(),
        contact_text: form.contactText.trim(),
      }

      if (form.id) {
        const result = await (supabase.from('home_pages') as any).update(payload).eq('id', form.id)
        if (result.error) throw new Error(result.error.message)
      } else {
        const result = await (supabase.from('home_pages') as any).insert(payload).select('id').single()
        if (result.error) throw new Error(result.error.message)
        setForms((prev) => ({ ...prev, [activeLocale]: { ...prev[activeLocale], id: result.data?.id ?? '' } }))
      }

      setSuccessMessage(`Главная сохранена: ${localeLabels[activeLocale]}`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось сохранить главную страницу')
    } finally {
      setIsSaving(false)
    }
  }

  const form = forms[activeLocale]
  const filledCount = [form.heroTitle, form.heroSubtitle, form.heroPrimaryCta, form.heroSecondaryCta, form.emergencyTitle, form.emergencyText, form.reviewsTitle, form.faqTitle, form.contactTitle, form.contactText].filter((value) => value.trim()).length

  if (isBooting) return <div style={panelStyle}><p style={eyebrowStyle}>Главная</p><h1 style={titleStyle}>Загрузка...</h1></div>

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Контент / главная страница</p>
          <h1 style={titleStyle}>Главная</h1>
          <p style={mutedStyle}>Редактирование hero, CTA, emergency-блока, заголовков отзывов, FAQ и контактного блока. Жёстких лимитов на длину текста нет.</p>
        </div>
        <div style={heroActionsStyle}>
          {locales.map((locale) => <button key={locale} type="button" onClick={() => { setSuccessMessage(''); setErrorMessage(''); setActiveLocale(locale) }} style={localeButtonStyle(activeLocale === locale)}>{locale.toUpperCase()}</button>)}
          <a href={`/${activeLocale}`} target="_blank" rel="noreferrer" style={secondaryLinkStyle}>Открыть</a>
        </div>
      </section>

      <section style={statsGridStyle}>
        <InfoCard title="Язык" value={localeLabels[activeLocale]} note="Текущая версия главной." />
        <InfoCard title="Заполнено" value={`${filledCount}/10`} note="Количество заполненных блоков." />
        <InfoCard title="Hero" value={form.heroTitle ? 'Есть' : 'Пусто'} note="Первый экран сайта." />
        <InfoCard title="CTA" value={form.heroPrimaryCta || 'Не указан'} note="Главная кнопка действия." />
      </section>

      <section style={guideStyle}>
        <p style={eyebrowStyle}>Подсказка</p>
        <p style={mutedStyle}>Главная должна быстро объяснять: кто вы, какие emergency, residential, commercial и automotive locksmith-услуги делаете, где работаете, как быстро можно связаться и что клиент получит после заявки.</p>
      </section>

      {errorMessage ? <MessageBox type="error">{errorMessage}</MessageBox> : null}
      {successMessage ? <MessageBox type="success">{successMessage}</MessageBox> : null}

      <form id={FORM_ID} onSubmit={handleSave} style={formStyle}>
        <Section title="Первый экран" text="Главный заголовок, подзаголовок и основные CTA-кнопки.">
          <Field label="Hero title" value={form.heroTitle} onChange={(value) => updateField('heroTitle', value)} />
          <TextAreaField label="Hero subtitle" value={form.heroSubtitle} onChange={(value) => updateField('heroSubtitle', value)} />
          <div style={fieldGridStyle}>
            <Field label="Primary CTA" value={form.heroPrimaryCta} onChange={(value) => updateField('heroPrimaryCta', value)} />
            <Field label="Secondary CTA" value={form.heroSecondaryCta} onChange={(value) => updateField('heroSecondaryCta', value)} />
          </div>
        </Section>

        <Section title="Emergency блок" text="Текст для срочного обращения, lockout и same-day сервиса.">
          <Field label="Emergency title" value={form.emergencyTitle} onChange={(value) => updateField('emergencyTitle', value)} />
          <TextAreaField label="Emergency text" value={form.emergencyText} onChange={(value) => updateField('emergencyText', value)} />
        </Section>

        <Section title="Доверие и FAQ" text="Заголовки секций, которые усиливают конверсию и доверие.">
          <div style={fieldGridStyle}>
            <Field label="Reviews title" value={form.reviewsTitle} onChange={(value) => updateField('reviewsTitle', value)} />
            <Field label="FAQ title" value={form.faqTitle} onChange={(value) => updateField('faqTitle', value)} />
          </div>
        </Section>

        <Section title="Контактный блок" text="Финальный блок перед заявкой или звонком.">
          <Field label="Contact title" value={form.contactTitle} onChange={(value) => updateField('contactTitle', value)} />
          <TextAreaField label="Contact text" value={form.contactText} onChange={(value) => updateField('contactText', value)} />
        </Section>
      </form>

      <AdminStickySaveBar formId={FORM_ID} isSaving={isSaving} label="Сохранить главную" note={`Сохраняется только текущий язык: ${localeLabels[activeLocale]}.`} />
    </div>
  )
}

function InfoCard({ title, value, note }: { title: string; value: string; note: string }) {
  return <article style={infoCardStyle}><p style={eyebrowStyle}>{title}</p><strong style={infoValueStyle}>{value}</strong><span style={infoNoteStyle}>{note}</span></article>
}

function Section({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return <section style={cardStyle}><div><p style={eyebrowStyle}>Редактирование</p><h2 style={cardTitleStyle}>{title}</h2><p style={mutedStyle}>{text}</p></div>{children}</section>
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label style={fieldStyle}><span style={labelStyle}>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} /></label>
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label style={fieldStyle}><span style={labelStyle}>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} style={textAreaStyle} /></label>
}

function MessageBox({ type, children }: { type: 'error' | 'success'; children: ReactNode }) {
  return <div style={type === 'error' ? messageErrorStyle : messageSuccessStyle}>{children}</div>
}

const pageStyle: CSSProperties = { display: 'grid', gap: 18, minWidth: 0 }
const panelStyle: CSSProperties = { borderRadius: 26, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.035)', padding: 20 }
const heroStyle: CSSProperties = { ...panelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', background: 'radial-gradient(circle at 0% 0%, rgba(45,226,230,0.14), transparent 320px), rgba(255,255,255,0.035)' }
const eyebrowStyle: CSSProperties = { margin: 0, color: '#2DE2E6', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2.4 }
const titleStyle: CSSProperties = { margin: '8px 0 0', color: '#F5F7FB', fontSize: 'clamp(34px, 6vw, 58px)', lineHeight: 0.96, letterSpacing: -2.2 }
const mutedStyle: CSSProperties = { margin: '10px 0 0', color: '#95A0B8', fontSize: 14, lineHeight: 1.7, maxWidth: 760 }
const heroActionsStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }
function localeButtonStyle(active: boolean): CSSProperties { return { minHeight: 44, padding: '0 15px', borderRadius: 999, border: active ? '1px solid rgba(45,226,230,0.5)' : '1px solid rgba(255,255,255,0.12)', background: active ? 'rgba(45,226,230,0.16)' : 'rgba(255,255,255,0.035)', color: active ? '#2DE2E6' : '#F5F7FB', fontWeight: 900 } }
const secondaryLinkStyle: CSSProperties = { minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.035)', color: '#F5F7FB', textDecoration: 'none', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.1 }
const statsGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }
const infoCardStyle: CSSProperties = { borderRadius: 22, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(17,25,46,0.82), rgba(5,7,11,0.72))', padding: 16, display: 'grid', gap: 8, minWidth: 0 }
const infoValueStyle: CSSProperties = { color: '#F5F7FB', fontSize: 20, lineHeight: 1.15, wordBreak: 'break-word' }
const infoNoteStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, lineHeight: 1.5 }
const guideStyle: CSSProperties = { ...panelStyle, padding: 16 }
const formStyle: CSSProperties = { display: 'grid', gap: 16 }
const cardStyle: CSSProperties = { borderRadius: 24, border: '1px solid rgba(255,255,255,0.10)', background: 'linear-gradient(145deg, rgba(11,16,32,0.86), rgba(5,7,11,0.78))', padding: 18, display: 'grid', gap: 14 }
const cardTitleStyle: CSSProperties = { margin: '6px 0 0', color: '#F5F7FB', fontSize: 24, lineHeight: 1.12, wordBreak: 'break-word' }
const fieldGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }
const fieldStyle: CSSProperties = { display: 'grid', gap: 8 }
const labelStyle: CSSProperties = { color: '#95A0B8', fontSize: 13, fontWeight: 800 }
const inputStyle: CSSProperties = { width: '100%', minHeight: 50, borderRadius: 15, border: '1px solid rgba(255,255,255,0.11)', background: 'rgba(7,11,20,0.82)', color: '#F5F7FB', padding: '0 14px', outline: 'none', fontSize: 16, boxSizing: 'border-box', WebkitAppearance: 'none' }
const textAreaStyle: CSSProperties = { ...inputStyle, minHeight: 120, padding: '12px 14px', resize: 'vertical' }
const messageErrorStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(255,122,122,0.25)', background: 'rgba(255,122,122,0.08)', color: '#FF9A9A', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
const messageSuccessStyle: CSSProperties = { borderRadius: 16, border: '1px solid rgba(45,226,230,0.25)', background: 'rgba(45,226,230,0.08)', color: '#2DE2E6', padding: '12px 14px', fontSize: 14, lineHeight: 1.5 }
