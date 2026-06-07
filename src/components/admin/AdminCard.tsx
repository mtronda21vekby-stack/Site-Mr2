import type { ReactNode } from 'react'

type AdminCardProps = {
  title: string
  description?: string
  children?: ReactNode
  href?: string
}

export default function AdminCard({
  title,
  description,
  children,
  href,
}: AdminCardProps) {
  const content = (
    <div className="admin-card">
      <div className="admin-card__shine" aria-hidden="true" />
      <h3>{title}</h3>

      {description ? (
        <p>{description}</p>
      ) : null}

      {children ? <div className="admin-card__body">{children}</div> : null}

      <style jsx>{`
        .admin-card {
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(155deg, rgba(255,255,255,0.078), rgba(255,255,255,0.024)),
            linear-gradient(135deg, rgba(214,168,95,0.085), transparent 42%, rgba(92,141,255,0.040)),
            rgba(255,255,255,0.018);
          border: 1px solid rgba(255,255,255,0.115);
          border-radius: 22px;
          padding: 20px;
          min-height: 148px;
          box-shadow: 0 22px 68px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.075);
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .admin-card:hover {
          transform: translateY(-2px);
          border-color: rgba(214,168,95,0.34);
        }

        .admin-card__shine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(110deg, transparent 0 30%, rgba(255,255,255,0.055) 40%, transparent 52% 100%);
          opacity: 0.70;
        }

        h3,
        p,
        .admin-card__body {
          position: relative;
        }

        h3 {
          margin: 0;
          color: #f5f7fb;
          font-size: 21px;
          line-height: 1.16;
          letter-spacing: -0.35px;
        }

        p {
          margin: 12px 0 0;
          color: #9ca3af;
          font-size: 15px;
          line-height: 1.7;
        }

        .admin-card__body {
          margin-top: 16px;
        }
      `}</style>
    </div>
  )

  if (!href) return content

  return (
    <a
      href={href}
      style={{
        display: 'block',
        textDecoration: 'none',
      }}
    >
      {content}
    </a>
  )
}
