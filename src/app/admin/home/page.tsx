'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import AdminStickySaveBar from '@/components/admin/AdminStickySaveBar'
import AdminReadinessGuide from '@/components/admin/AdminReadinessGuide'

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

const emptyForm = (locale: Locale): HomePageForm => ({
  id: '',
  locale,
  heroTitle: '',
  heroSubtitle: '',
  heroPrimaryCta: '',
  heroSecondaryCta: '',
  emergencyTitle: '',
  emergencyText: '',
  reviewsTitle: '',
  faqTitle: '',
  contactTitle: '',
  contactText: '',
})

export default function AdminHomePage() {
  const router = useRouter()
  const supabase: any = useMemo(() => getSupabaseClient() as any, [])

  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [forms, setForms] = useState<Record<Locale, HomePageForm>>({
    en: emptyForm('en'),
    es: emptyForm('es'),
    ru: emptyForm('ru'),
  })
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

        const result = await (supabase.from('home_pages') as any)
          .select(
            'id, locale, hero_title, hero_subtitle, hero_primary_cta, hero_secondary_cta, emergency_title, emergency_text, reviews_title, faq_title, contact_title, contact_text'
          )

        if (result.error) {
          throw new Error(result.error.message)
        }

        const rows = Array.isArray(result.data) ? result.data : []

        const nextForms: Record<Locale, HomePageForm> = {
          en: emptyForm('en'),
          es: emptyForm('es'),
          ru: emptyForm('ru'),
        }

        for (const row of rows) {
          const locale = row.locale as Locale

          if (!locales.includes(locale)) continue

          nextForms[locale] = {
            id: row.id ?? '',
            locale,
            heroTitle: row.hero_title ?? '',
            heroSubtitle: row.hero_subtitle ?? '',
            heroPrimaryCta: row.hero_primary_cta ?? '',
            heroSecondaryCta: row.hero_secondary_cta ?? '',
            emergencyTitle: row.emergency_title ?? '',
            emergencyText: row.emergency_text ?? '',
            reviewsTitle: row.reviews_title ?? '',
            faqTitle: row.faq_title ?? '',
            contactTitle: row.contact_title ?? '',
            contactText: row.contact_text ?? '',
          }
        }

        if (!mounted) return
        setForms(nextForms)
      } catch (error) {
        if (!mounted) return
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to load home content'
        )
      } finally {
        if (mounted) {
          setIsBooting(false)
        }
      }
    }

    boot()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  function updateField<K extends keyof HomePageForm>(
    key: K,
    value: HomePageForm[K]
  ) {
    setForms((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        [key]: value,
      },
    }))
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    const form = forms[activeLocale]

    if (!form.id) {
      setErrorMessage(`Row for locale "${activeLocale}" not found`)
      return
    }

    setIsSaving(true)

    try {
      const result = await (supabase.from('home_pages') as any)
        .update({
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
        })
        .eq('id', form.id)

      if (result.error) {
        throw new Error(result.error.message)
      }

      setSuccessMessage(`Home content saved for ${activeLocale.toUpperCase()}`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to save home content'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const form = forms[activeLocale]

  if (isBooting) {
    return (
      <div style={{ paddingTop: 20 }}>
        <p style={{ color: '#95A0B8', margin: 0 }}>Loading home content...</p>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p style={{ margin: 0, color: '#95A0B8', fontSize: 13 }}>
            Planetlocksmiths / Admin / Home
          </p>
          <h2 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.1 }}>
            Home Content
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => {
                setSuccessMessage('')
                setErrorMessage('')
                setActiveLocale(locale)
              }}
              style={{
                minHeight: 42,
                padding: '0 14px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.10)',
                background: activeLocale === locale ? '#4DA2FF' : '#11192E',
                color: activeLocale === locale ? '#05070B' : '#F5F7FB',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {locale.toUpperCase()}
            </button>
          ))}

          <a
            href={`/${activeLocale}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 42,
              padding: '0 14px',
              borderRadius: 12,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.10)',
              background: '#11192E',
              color: '#F5F7FB',
              fontWeight: 700,
            }}
          >
            Preview {activeLocale.toUpperCase()}
          </a>
        </div>
      </div>

      <AdminReadinessGuide
        title="These fields control the premium homepage, CTAs, conversion rails, emergency panels, FAQ title, and request form text."
        items={[
          { title: 'Hero + first impression', text: 'Hero Title, Hero Subtitle, and both CTA fields are visible above the fold and inside premium conversion panels.' },
          { title: 'Emergency conversion', text: 'Emergency Title and Emergency Text power the dispatch panels and should explain urgency, service availability, and next steps.' },
          { title: 'Ads readiness', text: 'Contact Title/Text, FAQ Title, and Reviews Title help Google Ads quality by making service purpose, trust, and request flow clear.' },
        ]}
      />

      {errorMessage ? (
        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(255,122,122,0.25)',
            background: 'rgba(255,122,122,0.08)',
            color: '#FF9A9A',
            padding: '12px 14px',
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div
          style={{
            borderRadius: 12,
            border: '1px solid rgba(77,162,255,0.25)',
            background: 'rgba(77,162,255,0.08)',
            color: '#A9D0FF',
            padding: '12px 14px',
            fontSize: 14,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {successMessage}
        </div>
      ) : null}

      <form
        id={FORM_ID}
        onSubmit={handleSave}
        style={{
          display: 'grid',
          gap: 16,
          background: '#0B1020',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: 18,
        }}
      >
        <Field label="Hero Title" value={form.heroTitle} onChange={(value) => updateField('heroTitle', value)} />
        <TextAreaField label="Hero Subtitle" value={form.heroSubtitle} onChange={(value) => updateField('heroSubtitle', value)} />
        <Field label="Primary CTA" value={form.heroPrimaryCta} onChange={(value) => updateField('heroPrimaryCta', value)} />
        <Field label="Secondary CTA" value={form.heroSecondaryCta} onChange={(value) => updateField('heroSecondaryCta', value)} />
        <Field label="Emergency Title" value={form.emergencyTitle} onChange={(value) => updateField('emergencyTitle', value)} />
        <TextAreaField label="Emergency Text" value={form.emergencyText} onChange={(value) => updateField('emergencyText', value)} />
        <Field label="Reviews Title" value={form.reviewsTitle} onChange={(value) => updateField('reviewsTitle', value)} />
        <Field label="FAQ Title" value={form.faqTitle} onChange={(value) => updateField('faqTitle', value)} />
        <Field label="Contact Title" value={form.contactTitle} onChange={(value) => updateField('contactTitle', value)} />
        <TextAreaField label="Contact Text" value={form.contactText} onChange={(value) => updateField('contactText', value)} />
      </form>

      <AdminStickySaveBar
        formId={FORM_ID}
        isSaving={isSaving}
        label={`Save ${activeLocale.toUpperCase()} Home`}
        note={`Sticky save bar is active for ${activeLocale.toUpperCase()} homepage content.`}
      />
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} />
    </label>
  )
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span style={{ fontSize: 14, color: '#95A0B8' }}>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} style={textAreaStyle} />
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 48,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.10)',
  background: '#11192E',
  color: '#F5F7FB',
  padding: '0 14px',
  outline: 'none',
  fontSize: 16,
  boxSizing: 'border-box',
  WebkitAppearance: 'none',
}

const textAreaStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.10)',
  background: '#11192E',
  color: '#F5F7FB',
  padding: '12px 14px',
  outline: 'none',
  fontSize: 16,
  boxSizing: 'border-box',
  resize: 'vertical',
  WebkitAppearance: 'none',
}
