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
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.024)), rgba(255,255,255,0.018)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 18,
        padding: 17,
        boxShadow: '0 18px 54px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.055)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: 'linear-gradient(180deg, #d6a85f, rgba(214,168,95,0.18))',
        }}
      />

      <p
        style={{
          position: 'relative',
          margin: 0,
          color: '#f0d099',
          fontSize: 11,
          fontWeight: 800,
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
          fontSize: 32,
          lineHeight: 1,
          color: '#F5F7FB',
          letterSpacing: -0.7,
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
