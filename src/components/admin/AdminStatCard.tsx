export default function AdminStatCard({
  title,
  value,
  note,
}: {
  title: string
  value: string
  note: string
}) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(155deg, rgba(255,255,255,0.082), rgba(255,255,255,0.024)), linear-gradient(135deg, rgba(214,168,95,0.10), transparent 44%, rgba(90,212,178,0.040)), rgba(255,255,255,0.018)',
        border: '1px solid rgba(255,255,255,0.115)',
        borderRadius: 22,
        padding: 19,
        boxShadow: '0 22px 68px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.075)',
        backdropFilter: 'blur(20px) saturate(128%)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(110deg, transparent 0 32%, rgba(255,255,255,0.052) 42%, transparent 54% 100%)',
          opacity: 0.7,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(214,168,95,0.55), transparent)',
        }}
      />

      <p
        style={{
          position: 'relative',
          margin: 0,
          color: '#f0d099',
          fontSize: 11,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: 1.8,
        }}
      >
        {title}
      </p>

      <h3
        style={{
          position: 'relative',
          margin: '12px 0 8px',
          fontSize: 36,
          lineHeight: 1,
          color: '#F5F7FB',
          letterSpacing: -1.1,
        }}
      >
        {value}
      </h3>

      <p
        style={{
          position: 'relative',
          margin: 0,
          color: '#9CA3AF',
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {note}
      </p>
    </div>
  )
}
