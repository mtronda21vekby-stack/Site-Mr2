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
        background: '#0B1020',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: 18,
      }}
    >
      <p
        style={{
          margin: 0,
          color: '#95A0B8',
          fontSize: 13,
        }}
      >
        {title}
      </p>

      <h3
        style={{
          margin: '10px 0 8px',
          fontSize: 28,
          lineHeight: 1.1,
          color: '#F5F7FB',
        }}
      >
        {value}
      </h3>

      <p
        style={{
          margin: 0,
          color: '#95A0B8',
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        {note}
      </p>
    </div>
  )
}
