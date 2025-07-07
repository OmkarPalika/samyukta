'use client';

import React from 'react';
import Logo from '@/components/shared/Logo';
import UserMenu from '@/components/shared/UserMenu';

interface UserType {
  full_name: string;
  role?: string;
}

interface DashboardNavigationProps {
  user: UserType;
  onLogout: () => void;
}

export default function DashboardNavigation({ user, onLogout }: DashboardNavigationProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center nav-height">
          <Logo href="/" showText={false} />
          <span className="text-base sm:text-lg font-semibold text-white">Dashboard</span>
          
          <UserMenu user={user} onLogout={onLogout} variant="dashboard" />
        </div>
      </div>
    </nav>
  );
}