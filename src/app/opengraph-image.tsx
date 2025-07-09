import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Samyukta 2025 - India\'s Premier Student Innovation Summit';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F0F23 0%, #1A1B3A 50%, #2D1B69 100%)',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              background: 'linear-gradient(90deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
            }}
          >
            Samyukta 2025
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#E5E7EB',
              marginBottom: '30px',
              maxWidth: '800px',
            }}
          >
            India's Premier Student Innovation Summit
          </div>
          <div
            style={{
              display: 'flex',
              gap: '40px',
              fontSize: 24,
              color: '#9CA3AF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              📅 August 6-9, 2025
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              📍 ANITS, Visakhapatnam
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              👥 400+ Participants
            </div>
          </div>
          <div
            style={{
              marginTop: '40px',
              fontSize: 20,
              color: '#60A5FA',
              fontWeight: 500,
            }}
          >
            Hackathons • AI/ML Workshops • Cloud Computing • Pitch Competitions
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}