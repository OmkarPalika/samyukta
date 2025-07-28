'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BaseLayout from './BaseLayout';
import PublicLayout from './PublicLayout';
import DashboardLayout from './DashboardLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}