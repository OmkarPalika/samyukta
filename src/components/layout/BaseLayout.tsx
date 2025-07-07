'use client';

import React from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --neon-blue: #00D4FF;
          --electric-violet: #8B5CF6;
          --dark-bg: #0F0F23;
          --card-bg: #1A1B3A;
          --text-primary: #FFFFFF;
          --text-secondary: #B8BCC8;
        }
        
        .neon-glow {
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        
        .violet-glow {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
      `}</style>
      
      {children}
    </>
  );
}