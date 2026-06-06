import { ImageResponse } from 'next/og'

export const alt = 'Planet Locksmiths'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #05070B 0%, #0B1020 100%)',
          color: '#F5F7FB',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 10%, rgba(77,162,255,0.25), transparent 28%), radial-gradient(circle at 78% 18%, rgba(45,226,230,0.18), transparent 26%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: 90,
            top: 90,
            width: 340,
            height: 340,
            borderRadius: 9999,
            background:
              'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.10), transparent 20%), linear-gradient(145deg, rgba(17,25,46,0.96), rgba(5,7,11,0.98))',
            boxShadow:
              '0 40px 120px rgba(0,0,0,0.45), inset 0 1px 20px rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: 56,
            top: 56,
            width: 408,
            height: 408,
            borderRadius: 9999,
            border: '1px solid rgba(77,162,255,0.35)',
            transform: 'rotateX(70deg)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: 82,
            top: 82,
            width: 356,
            height: 356,
            borderRadius: 9999,
            border: '1px solid rgba(45,226,230,0.18)',
            transform: 'rotateX(70deg) rotateZ(14deg)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '72px 72px',
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.04)',
              color: '#2DE2E6',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '10px 18px',
              marginBottom: 28,
            }}
          >
            Mobile locksmith service
          </div>

          <div
            style={{
              fontSize: 68,
              lineHeight: 1.02,
              fontWeight: 700,
              maxWidth: 760,
              letterSpacing: '-0.04em',
            }}
          >
            Planet Locksmiths
          </div>

          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: '#95A0B8',
              marginTop: 24,
              maxWidth: 760,
            }}
          >
            Mobile locksmith service across Philadelphia — lockouts, key replacement,
            programming, and urgent response.
          </div>

          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 34,
            }}
          >
            {['24/7 service', 'Philadelphia', 'Mobile locksmith'].map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 9999,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '10px 16px',
                  fontSize: 20,
                  color: '#F5F7FB',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
