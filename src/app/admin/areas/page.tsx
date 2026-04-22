'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminAreasPage() {
  const router = useRouter()
  const supabase = getSupabaseClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace('/admin/login')
        return
      }
      setLoading(false)
    }
    check()
  }, [router, supabase])

  if (loading) return <main style={{ minHeight: '100vh', background: '#05070B', color: '#fff', padding: 24 }}>Loading...</main>

  return <main style={{ minHeight: '100vh', background: '#05070B', color: '#fff', padding: 24 }}>Areas admin coming next.</main>
}
