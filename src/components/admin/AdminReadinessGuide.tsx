type GuideItem = {
  title: string
  text: string
}

export default function AdminReadinessGuide({
  title,
  eyebrow = 'Ads / UX readiness',
  items,
}: {
  title: string
  eyebrow?: string
  items: GuideItem[]
}) {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 18,
        borderRadius: 22,
        border: '1px solid rgba(77,162,255,0.22)',
        background:
          'radial-gradient(circle at 10% 0%, rgba(77,162,255,0.16), transparent 280px), linear-gradient(145deg, rgba(17,25,46,0.82), rgba(5,7,11,0.82))',
        padding: 18,
        boxShadow: '0 24px 80px rgba(0,0,0,0.26)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -46,
          top: -46,
          width: 130,
          height: 130,
          borderRadius: 999,
          border: '1px solid rgba(214,168,95,0.20)',
        }}
      />

      <p
        style={{
          position: 'relative',
          margin: 0,
          color: '#2DE2E6',
          fontSize: 11,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: 2.6,
        }}
      >
        {eyebrow}
      </p>

      <h3
        style={{
          position: 'relative',
          margin: '8px 0 0',
          color: '#F5F7FB',
          fontSize: 24,
          lineHeight: 1.12,
          letterSpacing: -0.7,
        }}
      >
        {title}
      </h3>

      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 12,
          marginTop: 16,
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.title}
            style={{
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.035)',
              padding: 14,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 999,
                background: '#4DA2FF',
                color: '#02040A',
                fontSize: 12,
                fontWeight: 900,
                marginBottom: 10,
              }}
            >
              {index + 1}
            </span>
            <strong style={{ display: 'block', color: '#F5F7FB', fontSize: 15 }}>
              {item.title}
            </strong>
            <p style={{ margin: '6px 0 0', color: '#95A0B8', fontSize: 13, lineHeight: 1.55 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
