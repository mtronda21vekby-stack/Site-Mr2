'use client'

export default function AdminStickySaveBar({
  formId,
  isSaving,
  label,
  note,
}: {
  formId: string
  isSaving: boolean
  label: string
  note: string
}) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 'calc(10px + env(safe-area-inset-bottom))',
        zIndex: 40,
        marginTop: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          padding: 14,
          borderRadius: 18,
          border: '1px solid rgba(214,168,95,0.22)',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.072), rgba(255,255,255,0.032)), rgba(8,9,13,0.96)',
          backdropFilter: 'blur(12px)',
          boxShadow:
            '0 18px 54px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'grid', gap: 4 }}>
          <strong style={{ fontSize: 15, color: '#F5F7FB' }}>
            Ready to save
          </strong>
          <span
            style={{
              fontSize: 13,
              color: '#95A0B8',
              lineHeight: 1.5,
            }}
          >
            {note}
          </span>
        </div>

        <button
          type="submit"
          form={formId}
          disabled={isSaving}
          style={{
            minHeight: 46,
            padding: '0 16px',
            borderRadius: 12,
            border: '1px solid rgba(245,247,251,0.22)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,1), rgba(223,226,232,1))',
            color: '#05070B',
            fontWeight: 800,
            fontSize: 15,
            cursor: isSaving ? 'default' : 'pointer',
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          {isSaving ? 'Saving...' : label}
        </button>
      </div>
    </div>
  )
}
