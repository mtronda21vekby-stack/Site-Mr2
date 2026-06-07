'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseClient(), [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session && mounted) {
        router.replace('/admin/direct')
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [router, supabase])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    router.replace('/admin/direct')
    router.refresh()
  }

  return (
    <main className="login">
      <div className="login__mesh" aria-hidden="true" />
      <section className="login__wrap">
        <div className="login__brandPanel">
          <div className="login__logoBox">
            <img src="/planetlocksmiths-logo.svg" alt="Planet Locksmiths" />
          </div>
          <p className="login__eyebrow">Planet Locksmiths</p>
          <h1>Admin Command Room</h1>
          <p>
            Управление production-сайтом, заявками, медиа, услугами, отзывами,
            FAQ и локальными страницами из защищенной панели.
          </p>
          <div className="login__signals">
            <span><b>24/7</b> emergency service</span>
            <span><b>CMS</b> Supabase</span>
            <span><b>Live</b> production</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login__card">
          <div>
            <p className="login__eyebrow">Secure workspace</p>
            <h2>Secure Admin Access</h2>
            <p className="login__muted">Sign in to manage the live website.</p>
          </div>

          <label>
            <span>Admin Email</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="admin@planetlocksmiths.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {errorMessage ? <div className="login__error">{errorMessage}</div> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Enter Control Panel'}
          </button>
        </form>
      </section>

      <style jsx>{`
        .login {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.040), transparent 320px),
            linear-gradient(132deg, #06070b 0%, #0f121b 40%, #090d12 68%, #030406 100%);
          color: #f5f7fb;
          padding: 22px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .login__mesh {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background:
            conic-gradient(from 210deg at 72% 0%, rgba(214,168,95,0.20), transparent 20%, rgba(92,141,255,0.13), transparent 45%, rgba(90,212,178,0.10), transparent 72%),
            linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: auto, 54px 54px, 54px 54px;
          opacity: 0.78;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 86%);
        }

        .login__wrap {
          position: relative;
          width: min(100%, 1060px);
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
          gap: 18px;
        }

        .login__brandPanel,
        .login__card {
          border: 1px solid rgba(255,255,255,0.115);
          border-radius: 30px;
          background:
            linear-gradient(155deg, rgba(255,255,255,0.088), rgba(255,255,255,0.026)),
            linear-gradient(135deg, rgba(214,168,95,0.10), transparent 44%, rgba(92,141,255,0.050)),
            rgba(8,9,13,0.84);
          box-shadow: 0 32px 110px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.085);
          backdrop-filter: blur(24px) saturate(132%);
        }

        .login__brandPanel {
          min-height: 560px;
          display: grid;
          align-content: end;
          padding: 28px;
          overflow: hidden;
        }

        .login__logoBox {
          width: 84px;
          height: 84px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.14);
          background: #05070b;
          box-shadow: 0 22px 60px rgba(0,0,0,0.34);
          margin-bottom: 28px;
        }

        .login__logoBox img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .login__eyebrow {
          margin: 0;
          color: #d6a85f;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 2.2px;
        }

        h1 {
          max-width: 620px;
          margin: 12px 0 0;
          color: #f5f7fb;
          font-size: clamp(44px, 7vw, 88px);
          line-height: 0.9;
          letter-spacing: -2.8px;
        }

        .login__brandPanel > p:not(.login__eyebrow) {
          max-width: 620px;
          margin: 22px 0 0;
          color: #9ca3af;
          font-size: 16px;
          line-height: 1.75;
        }

        .login__signals {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 28px;
        }

        .login__signals span {
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 17px;
          background: rgba(255,255,255,0.030);
          padding: 12px;
          color: #95a0b8;
          font-size: 12px;
          line-height: 1.4;
        }

        .login__signals b {
          display: block;
          color: #f5f7fb;
          font-size: 17px;
        }

        .login__card {
          padding: 28px;
          display: grid;
          gap: 18px;
          align-content: center;
        }

        h2 {
          margin: 10px 0 0;
          color: #f5f7fb;
          font-size: 36px;
          line-height: 1.02;
          letter-spacing: -1px;
        }

        .login__muted {
          margin: 10px 0 0;
          color: #95a0b8;
          font-size: 15px;
          line-height: 1.6;
        }

        label {
          display: grid;
          gap: 8px;
        }

        label span {
          color: #c6cbd6;
          font-size: 13px;
          font-weight: 820;
        }

        input {
          width: 100%;
          min-height: 54px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.11);
          background: rgba(7,11,20,0.72);
          color: #f5f7fb;
          padding: 0 15px;
          outline: none;
          font-size: 16px;
          box-sizing: border-box;
          -webkit-appearance: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }

        input:focus {
          border-color: rgba(214,168,95,0.48);
          box-shadow: 0 0 0 4px rgba(214,168,95,0.10), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .login__error {
          border-radius: 16px;
          border: 1px solid rgba(255,122,122,0.25);
          background: rgba(255,122,122,0.08);
          color: #ff9a9a;
          padding: 12px 14px;
          font-size: 14px;
          line-height: 1.5;
        }

        button {
          min-height: 54px;
          border-radius: 16px;
          border: 1px solid rgba(245,247,251,0.24);
          background: linear-gradient(180deg, rgba(255,255,255,1), rgba(223,226,232,1));
          color: #05070b;
          font-weight: 950;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          cursor: pointer;
          box-shadow: 0 18px 46px rgba(245,247,251,0.12);
        }

        button:disabled {
          opacity: 0.7;
          cursor: default;
        }

        @media (max-width: 860px) {
          .login {
            padding: 12px;
          }

          .login__wrap {
            grid-template-columns: 1fr;
          }

          .login__brandPanel {
            min-height: auto;
            padding: 22px;
          }

          .login__signals {
            grid-template-columns: 1fr;
          }

          .login__card {
            padding: 22px;
          }
        }
      `}</style>
    </main>
  )
}
