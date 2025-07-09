import { ImageResponse } from 'next/og';
export const alt = 'Samyukta 2025 - India\'s Premier Student Innovation Summit';
export const size = {
  width: 1200,
  height: 600,
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
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'radial-gradient(circle at 25% 25%, #60A5FA 0%, transparent 50%), radial-gradient(circle at 75% 75%, #A78BFA 0%, transparent 50%)',
          }}
        />
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              background: 'linear-gradient(90deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '16px',
            }}
          >
            Samyukta 2025
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#E5E7EB',
              marginBottom: '24px',
              maxWidth: '700px',
            }}
          >
            India&apos;s Premier Student Innovation Summit
          </div>
          <div
            style={{
              display: 'flex',
              gap: '30px',
              fontSize: 20,
              color: '#9CA3AF',
              marginBottom: '20px',
            }}
          >
            <div>📅 Aug 6-9, 2025</div>
            <div>📍 ANITS, Vizag</div>
            <div>👥 400+ Participants</div>
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#60A5FA',
              fontWeight: 500,
            }}
          >
            #Samyukta2025 #TechSummit #Innovation #StudentEvent
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}