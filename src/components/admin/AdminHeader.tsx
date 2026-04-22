type AdminHeaderProps = {
  title: string
  subtitle?: string
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}
    >
      <div>
        {subtitle ? (
          <p
            style={{
              margin: 0,
              color: '#95A0B8',
              fontSize: 14,
            }}
          >
            {subtitle}
          </p>
        ) : null}

        <h1
          style={{
            margin: '8px 0 0',
            color: '#F5F7FB',
            fontSize: 36,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
      </div>

      <a
        href="/en"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 44,
          padding: '0 18px',
          borderRadius: 12,
          textDecoration: 'none',
          color: '#05070B',
          background: '#4DA2FF',
          fontWeight: 700,
        }}
      >
        Open Website
      </a>
    </div>
  )
}
