'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BaseLayout from './BaseLayout';
import PublicLayout from './PublicLayout';
import DashboardLayout from './DashboardLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();

  // Admin pages handle their own layout (AdminLayout), so don't wrap them with DashboardLayout
  // Coordinator and participant pages use DashboardLayout
  const isAdminRoute = pathname?.startsWith('/dashboard/admin');
  const isDashboardRoute = pathname?.startsWith('/dashboard') && !isAdminRoute;

  return (
    <AuthProvider>
      {isAdminRoute ? (
        // Admin routes are completely independent - no BaseLayout wrapper
        <>
          {children}
          <Toaster 
            position="top-right" 
            theme="dark"
            richColors
            closeButton
          />
        </>
      ) : (
        <BaseLayout>
          {isDashboardRoute ? (
            <DashboardLayout>
              {children}
            </DashboardLayout>
          ) : (
            <PublicLayout>
              {children}
            </PublicLayout>
          )}
          <Toaster 
            position="top-right" 
            theme="dark"
            richColors
            closeButton
          />
        </BaseLayout>
      )}
    </AuthProvider>
  );
}