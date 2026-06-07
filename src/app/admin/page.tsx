'use client'

import Link from 'next/link'

const adminCards = [
  {
    title: 'Фотографии',
    description: 'Галерея, логотип, сервисные фото и кейсы до/после.',
    href: '/admin/photos',
    status: 'Media',
  },
  {
    title: 'Панель управления',
    description: 'Заявки, услуги, города, отзывы, FAQ и настройки сайта.',
    href: '/admin/direct',
    status: 'Control',
  },
  {
    title: 'Аудит сайта',
    description: 'Проверка контента, SEO, публикации и готовности страниц.',
    href: '/admin/audit',
    status: 'QA',
  },
]

export default function AdminPage() {
  return (
    <main className="admin-home">
      <section className="admin-home__hero">
        <div>
          <p className="admin-home__eyebrow">Planet Locksmiths</p>
          <h1>Админ-панель</h1>
          <p>
            Управление production-сайтом: контент, медиа, заявки, SEO-страницы,
            отзывы и настройки без ручного деплоя после каждой правки.
          </p>
        </div>
        <Link href="/en" className="admin-home__siteLink">Открыть сайт</Link>
      </section>

      <section className="admin-home__grid">
        {adminCards.map((card) => (
          <Link key={card.href} href={card.href} className="admin-home__card">
            <span>{card.status}</span>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            <strong>Перейти</strong>
          </Link>
        ))}
      </section>

      <style jsx>{`
        .admin-home {
          display: grid;
          gap: 16px;
          min-width: 0;
        }

        .admin-home__hero {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-end;
          flex-wrap: wrap;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 24px;
          padding: 22px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.065), rgba(255,255,255,0.024)),
            rgba(255,255,255,0.018);
          box-shadow: 0 18px 54px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.055);
        }

        .admin-home__eyebrow {
          margin: 0;
          color: #d6a85f;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        h1 {
          margin: 10px 0 0;
          color: #f5f7fb;
          font-size: clamp(34px, 6vw, 64px);
          line-height: 0.96;
          letter-spacing: -0.9px;
        }

        .admin-home__hero p:last-child {
          max-width: 760px;
          margin: 16px 0 0;
          color: #9ca3af;
          font-size: 15px;
          line-height: 1.75;
        }

        .admin-home__siteLink,
        .admin-home__card {
          text-decoration: none;
        }

        .admin-home__siteLink {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 18px;
          border-radius: 999px;
          border: 1px solid rgba(245,247,251,0.24);
          background: #f5f7fb;
          color: #08090d;
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 1.4px;
        }

        .admin-home__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 14px;
        }

        .admin-home__card {
          min-height: 210px;
          display: grid;
          align-content: space-between;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 22px;
          padding: 18px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.052), rgba(255,255,255,0.022)),
            rgba(255,255,255,0.018);
          color: #f5f7fb;
          box-shadow: 0 18px 54px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.055);
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .admin-home__card:hover {
          transform: translateY(-2px);
          border-color: rgba(214, 168, 95, 0.36);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.074), rgba(255,255,255,0.03)),
            rgba(255,255,255,0.022);
        }

        .admin-home__card span {
          width: max-content;
          border-radius: 999px;
          border: 1px solid rgba(214, 168, 95, 0.34);
          background: rgba(214, 168, 95, 0.12);
          color: #f0d099;
          padding: 7px 10px;
          font-size: 10px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 1.6px;
        }

        .admin-home__card h2 {
          margin: 0;
          color: #f5f7fb;
          font-size: 24px;
          line-height: 1.1;
        }

        .admin-home__card p {
          margin: 0;
          color: #9ca3af;
          font-size: 14px;
          line-height: 1.65;
        }

        .admin-home__card strong {
          color: #d6a85f;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
      `}</style>
    </main>
  )
}
