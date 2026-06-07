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
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.052), rgba(255,255,255,0.022)), rgba(255,255,255,0.018)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 18,
        padding: 18,
        minHeight: 140,
        boxShadow: '0 18px 54px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.055)',
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
            color: '#9CA3AF',
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
