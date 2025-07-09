'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BaseLayout from './BaseLayout';
import PublicLayout from './PublicLayout';
import DashboardLayout from './DashboardLayout';

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();

  // Dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return (
      <BaseLayout>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </BaseLayout>
    );
  }

  // Public routes
  return (
    <BaseLayout>
      <PublicLayout>
        {children}
      </PublicLayout>
    </BaseLayout>
  );
}