// src/app/admin/settings/page.tsx

'use client'

import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// схематизируем таблицу site_settings
type Database = {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string
          brand_name: string
          phone_primary: string
          phone_display: string
          email: string
          service_hours: string
        }
        Update: {
          brand_name?: string
          phone_primary?: string
          phone_display?: string
          email?: string
          service_hours?: string
        }
      }
    }
  }
}

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    id: '',
    brandName: '',
    phonePrimary: '',
    phoneDisplay: '',
    email: '',
    serviceHours: '',
  })

  useEffect(() => {
    async function init() {
      // проверяем сессию
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/admin/login')
        return
      }
      // загружаем текущие настройки
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single()
      if (data) {
        setForm({
          id: data.id,
          brandName: data.brand_name ?? '',
          phonePrimary: data.phone_primary ?? '',
          phoneDisplay: data.phone_display ?? '',
          email: data.email ?? '',
          serviceHours: data.service_hours ?? '',
        })
      }
      setLoading(false)
    }
    init()
  }, [router])

  async function handleSave() {
    const { error } = await supabase
      .from('site_settings')
      .update({
        brand_name: form.brandName.trim(),
        phone_primary: form.phonePrimary.trim(),
        phone_display: form.phoneDisplay.trim(),
        email: form.email.trim(),
        service_hours: form.serviceHours.trim(),
      })
      .eq('id', form.id)
    if (!error) {
      alert('Saved ✅')
    }
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading…</p>
  }
  // …далее форма, как раньше
}
