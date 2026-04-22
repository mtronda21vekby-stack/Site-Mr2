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
    <div
      style={{
        background: '#0B1020',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 20,
        minHeight: 140,
      }}
    >
      <h3
        style={{
          margin: 0,
          color: '#F5F7FB',
          fontSize: 20,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      {description ? (
        <p
          style={{
            margin: '12px 0 0',
            color: '#95A0B8',
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {description}
        </p>
      ) : null}

      {children ? <div style={{ marginTop: 16 }}>{children}</div> : null}
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
