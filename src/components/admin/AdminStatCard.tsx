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
          'linear-gradient(145deg, rgba(17,25,46,0.84), rgba(5,7,11,0.72))',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 22,
        padding: 18,
        boxShadow: '0 22px 70px rgba(0,0,0,0.28)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -36,
          top: -36,
          width: 96,
          height: 96,
          borderRadius: 999,
          border: '1px solid rgba(77,162,255,0.22)',
        }}
      />

      <p
        style={{
          position: 'relative',
          margin: 0,
          color: '#A9D0FF',
          fontSize: 11,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: 2.2,
        }}
      >
        {title}
      </p>

      <h3
        style={{
          position: 'relative',
          margin: '12px 0 8px',
          fontSize: 34,
          lineHeight: 1,
          color: '#F5F7FB',
          letterSpacing: -1.2,
        }}
      >
        {value}
      </h3>

      <p
        style={{
          position: 'relative',
          margin: 0,
          color: '#95A0B8',
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {note}
      </p>
    </div>
  )
}
