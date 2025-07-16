'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BaseLayout from './BaseLayout';
import PublicLayout from './PublicLayout';
import DashboardLayout from './DashboardLayout';
import { AuthProvider } from '@/contexts/AuthContext';

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <BaseLayout>
        {pathname?.startsWith('/dashboard') ? (
          <DashboardLayout>
            {children}
          </DashboardLayout>
        ) : (
          <PublicLayout>
            {children}
          </PublicLayout>
        )}
      </BaseLayout>
    </AuthProvider>
  );
}