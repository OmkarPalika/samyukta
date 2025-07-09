'use client';

import React, { useMemo } from 'react';
import Logo from '@/components/shared/Logo';
import UserMenu from '@/components/shared/UserMenu';
import MobileMenu, { MobileMenuItem, MobileMenuSection, MobileMenuButton } from '@/components/shared/MobileMenu';

interface UserType {
  full_name: string;
  role?: string;
}

interface DashboardNavigationProps {
  user: UserType;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export default function DashboardNavigation({ user, onLogout, mobileMenuOpen, onMobileMenuToggle }: DashboardNavigationProps) {
  const dashboardItems = useMemo(() => [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard#games', label: 'Games' },
    { href: '/dashboard#competitions', label: 'Competitions' },
    { href: '/dashboard#team', label: 'Team' },
    { href: '/social', label: 'Social' },
    { href: '/dashboard#help', label: 'Help' }
  ], []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
      <div className="w-full max-w-full px-2 sm:px-4">
        <div className="flex justify-between items-center h-12 sm:h-16 w-full max-w-full">
          <div className="flex-shrink-0">
            <Logo href="/" showText={false} />
          </div>
          <span className="text-sm sm:text-base font-semibold text-white truncate mx-2 flex-1 text-center min-w-0">Dashboard</span>
          
          <div className="hidden md:flex flex-shrink-0">
            <UserMenu user={user} onLogout={onLogout} variant="dashboard" />
          </div>

          <div className="flex-shrink-0">
            <MobileMenu 
            isOpen={mobileMenuOpen} 
            onToggle={onMobileMenuToggle}
            onClose={() => {}}
          >
            {dashboardItems.map((item) => (
              <MobileMenuItem 
                key={item.href}
                href={item.href}
                onClick={onMobileMenuToggle}
              >
                {item.label}
              </MobileMenuItem>
            ))}
            
            <MobileMenuSection>
              <MobileMenuButton 
                onClick={() => {
                  onLogout();
                  onMobileMenuToggle();
                }}
              >
                Logout
              </MobileMenuButton>
            </MobileMenuSection>
          </MobileMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}