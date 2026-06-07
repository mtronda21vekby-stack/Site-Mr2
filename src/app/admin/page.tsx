'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'

const quickActions = [
  {
    title: 'Рабочая панель',
    description: 'Ежедневный dashboard: заявки, readiness, контент и быстрые переходы.',
    href: '/admin/direct',
    code: 'OV',
    accent: '#D6A85F',
  },
  {
    title: 'Фото и медиа',
    description: 'Галерея, логотип, фоновые фото и кейсы до/после для сайта.',
    href: '/admin/photos',
    code: 'PX',
    accent: '#6EE7B7',
  },
  {
    title: 'Заявки клиентов',
    description: 'Статусы обращений, контакты, заметки, исполнитель и история работы.',
    href: '/admin/orders',
    code: 'RQ',
    accent: '#F5F7FB',
  },
  {
    title: 'Аудит сайта',
    description: 'Контроль качества CMS, SEO, FAQ, отзывов, медиа и service pages.',
    href: '/admin/audit',
    code: 'QA',
    accent: '#FF9A9A',
  },
]

const controlLayers = [
  { title: 'Global Settings', href: '/admin/settings', detail: 'Бренд, телефон, email, часы и логотип.' },
  { title: 'Home Content', href: '/admin/home', detail: 'Hero, CTA, emergency и контактные секции.' },
  { title: 'Services', href: '/admin/services', detail: 'Все locksmith-услуги, SEO и публикация.' },
  { title: 'Areas', href: '/admin/areas', detail: 'Города, service zones и локальные страницы.' },
  { title: 'Reviews', href: '/admin/reviews', detail: 'Proof-блоки и реальные отзывы клиентов.' },
  { title: 'FAQ', href: '/admin/faq', detail: 'Вопросы, ответы и FAQ schema контент.' },
]

export default function AdminPage() {
  return (
    <main className="admin-home">
      <section className="admin-home__hero">
        <div className="admin-home__copy">
          <p className="admin-home__eyebrow">Planet Locksmiths command system</p>
          <h1>Админка сайта</h1>
          <p>
            Современный центр управления production-сайтом: заявки, фото, услуги,
            города, отзывы, FAQ, SEO и глобальные настройки в одном месте.
          </p>
          <div className="admin-home__actions">
            <Link href="/admin/direct" className="admin-home__primary">Открыть dashboard</Link>
            <Link href="/en" className="admin-home__secondary">Публичный сайт</Link>
          </div>
        </div>

        <div className="admin-home__signal">
          <div className="admin-home__signalHead">
            <span>Live CMS</span>
            <strong>Production</strong>
          </div>
          <div className="admin-home__meter">
            <span />
          </div>
          <div className="admin-home__signalGrid">
            <span><b>24/7</b> emergency</span>
            <span><b>CMS</b> connected</span>
            <span><b>SEO</b> ready</span>
          </div>
        </div>
      </section>

      <section className="admin-home__quickGrid">
        {quickActions.map((card) => (
          <Link key={card.href} href={card.href} className="admin-home__quickCard" style={{ '--accent': card.accent } as CSSProperties}>
            <span className="admin-home__code">{card.code}</span>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <strong>Открыть →</strong>
          </Link>
        ))}
      </section>

      <section className="admin-home__panel">
        <div className="admin-home__panelHead">
          <div>
            <p className="admin-home__eyebrow">Content layers</p>
            <h2>Что можно управлять из админки</h2>
          </div>
          <Link href="/admin/audit" className="admin-home__pill">Проверить сайт</Link>
        </div>

        <div className="admin-home__layerGrid">
          {controlLayers.map((layer, index) => (
            <Link key={layer.href} href={layer.href} className="admin-home__layer">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong>{layer.title}</strong>
                <p>{layer.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style jsx>{`
        .admin-home {
          display: grid;
          gap: 18px;
          min-width: 0;
        }

        .admin-home__hero,
        .admin-home__panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(214, 168, 95, 0.28);
          border-radius: 28px;
          background:
            linear-gradient(150deg, rgba(255,255,255,0.092), rgba(255,255,255,0.024)),
            linear-gradient(135deg, rgba(214,168,95,0.14), transparent 42%, rgba(92,141,255,0.06)),
            rgba(255,255,255,0.018);
          box-shadow: 0 28px 90px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.085);
        }

        .admin-home__hero {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.6fr);
          gap: 22px;
          align-items: stretch;
          padding: 28px;
        }

        .admin-home__copy {
          min-width: 0;
        }

        .admin-home__eyebrow {
          margin: 0;
          color: #d6a85f;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 2.2px;
        }

        h1 {
          margin: 12px 0 0;
          color: #f5f7fb;
          font-size: clamp(42px, 8vw, 92px);
          line-height: 0.9;
          letter-spacing: -2.8px;
        }

        .admin-home__copy p:last-of-type {
          max-width: 760px;
          margin: 20px 0 0;
          color: #9ca3af;
          font-size: 16px;
          line-height: 1.75;
        }

        .admin-home__actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .admin-home__primary,
        .admin-home__secondary,
        .admin-home__pill {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          padding: 0 18px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 1.4px;
        }

        .admin-home__primary {
          border: 1px solid rgba(245,247,251,0.24);
          background: #f5f7fb;
          color: #05070b;
          box-shadow: 0 18px 46px rgba(245,247,251,0.12);
        }

        .admin-home__secondary,
        .admin-home__pill {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.032);
          color: #f5f7fb;
        }

        .admin-home__signal {
          display: grid;
          align-content: space-between;
          gap: 18px;
          border: 1px solid rgba(255,255,255,0.11);
          border-radius: 24px;
          padding: 18px;
          background:
            linear-gradient(155deg, rgba(255,255,255,0.08), rgba(255,255,255,0.026)),
            rgba(5,7,11,0.40);
          min-height: 240px;
        }

        .admin-home__signalHead {
          display: grid;
          gap: 8px;
        }

        .admin-home__signalHead span {
          color: #6ee7b7;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .admin-home__signalHead strong {
          color: #f5f7fb;
          font-size: clamp(30px, 5vw, 52px);
          line-height: 0.95;
          letter-spacing: -1.4px;
        }

        .admin-home__meter {
          height: 12px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
        }

        .admin-home__meter span {
          display: block;
          width: 88%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #d6a85f, #6ee7b7);
        }

        .admin-home__signalGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          color: #95a0b8;
          font-size: 12px;
          line-height: 1.4;
        }

        .admin-home__signalGrid b {
          display: block;
          color: #f5f7fb;
          font-size: 16px;
        }

        .admin-home__quickGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 14px;
        }

        .admin-home__quickCard {
          position: relative;
          overflow: hidden;
          min-height: 230px;
          display: grid;
          align-content: space-between;
          gap: 18px;
          border: 1px solid color-mix(in srgb, var(--accent), transparent 62%);
          border-radius: 24px;
          padding: 20px;
          background:
            linear-gradient(155deg, rgba(255,255,255,0.075), rgba(255,255,255,0.024)),
            rgba(255,255,255,0.018);
          color: #f5f7fb;
          text-decoration: none;
          box-shadow: 0 22px 68px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.07);
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .admin-home__quickCard::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, color-mix(in srgb, var(--accent), transparent 86%), transparent 52%);
          pointer-events: none;
        }

        .admin-home__quickCard:hover {
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--accent), transparent 36%);
        }

        .admin-home__code,
        .admin-home__quickCard h2,
        .admin-home__quickCard p,
        .admin-home__quickCard strong {
          position: relative;
        }

        .admin-home__code {
          width: 42px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid color-mix(in srgb, var(--accent), transparent 54%);
          background: color-mix(in srgb, var(--accent), transparent 88%);
          color: var(--accent);
          font-size: 11px;
          font-weight: 950;
        }

        .admin-home__quickCard h2,
        .admin-home__panel h2 {
          margin: 0;
          color: #f5f7fb;
          font-size: 26px;
          line-height: 1.05;
          letter-spacing: -0.8px;
        }

        .admin-home__quickCard p {
          margin: 0;
          color: #9ca3af;
          font-size: 14px;
          line-height: 1.65;
        }

        .admin-home__quickCard strong {
          color: var(--accent);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .admin-home__panel {
          padding: 20px;
        }

        .admin-home__panelHead {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .admin-home__panel h2 {
          margin-top: 8px;
        }

        .admin-home__layerGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }

        .admin-home__layer {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 18px;
          background: rgba(255,255,255,0.026);
          padding: 14px;
          color: #f5f7fb;
          text-decoration: none;
        }

        .admin-home__layer > span {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid rgba(214,168,95,0.32);
          background: rgba(214,168,95,0.10);
          color: #f0d099;
          font-size: 11px;
          font-weight: 950;
        }

        .admin-home__layer strong {
          display: block;
          font-size: 16px;
          line-height: 1.2;
        }

        .admin-home__layer p {
          margin: 7px 0 0;
          color: #9ca3af;
          font-size: 13px;
          line-height: 1.55;
        }

        @media (max-width: 760px) {
          .admin-home__hero {
            grid-template-columns: 1fr;
            padding: 20px;
          }

          h1 {
            letter-spacing: -1.8px;
          }

          .admin-home__signalGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  )
}
