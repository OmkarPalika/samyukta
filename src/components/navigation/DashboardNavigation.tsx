'use client';

import React, { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/shared/Logo';
import UserMenu from '@/components/shared/UserMenu';
import {
  Menu, QrCode, Trophy, Users, Camera, Calendar, HelpCircle,
  LogOut, Home, Settings, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User as UserType } from '@/lib/types';

interface DashboardNavigationProps {
  user: UserType;
  onLogout: () => void;
}

export default function DashboardNavigation({ user, onLogout }: DashboardNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const dashboardItems = useMemo(() => [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5 mr-3" /> },
    { path: '/dashboard/games', label: 'Games', icon: <QrCode className="w-5 h-5 mr-3 text-green-400" /> },
    { path: '/dashboard/competitions', label: 'Competitions', icon: <Trophy className="w-5 h-5 mr-3 text-orange-400" /> },
    { path: '/dashboard/team', label: 'Team', icon: <Users className="w-5 h-5 mr-3 text-violet-400" /> },
    { path: '/dashboard/social', label: 'Social', icon: <Camera className="w-5 h-5 mr-3 text-pink-400" /> },
    { path: '/dashboard/schedule', label: 'Schedule', icon: <Calendar className="w-5 h-5 mr-3 text-yellow-400" /> },
    { path: '/dashboard/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5 mr-3 text-blue-400" /> },
    { path: '/dashboard/help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5 mr-3 text-emerald-400" /> }
  ], []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800">
      <div className="w-full max-w-full px-2 sm:px-4">
        <div className="flex justify-between items-center h-12 sm:h-16 w-full max-w-full">
          <div className="flex-shrink-0">
            <Logo href="/dashboard" showText={false} />
          </div>
          <div className="flex-1 justify-center">
            {/* Desktop navigation removed as we're using tabs */}
          </div>

          <div className="flex flex-shrink-0">
            <UserMenu user={user} onLogout={onLogout} variant="dashboard" />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-gray-300 hover:text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800/95 border-gray-700 backdrop-blur-sm w-[280px] p-0">
                <div className="flex flex-col h-full">
                  {/* User Profile Section */}
                  <div className="p-4 border-b border-gray-700 bg-gray-800/80">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-white">
                          {user?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{user?.full_name || 'User'}</p>
                        <p className="text-gray-400 text-xs truncate">{user?.email || ''}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {user?.role || 'Participant'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white p-0 h-auto"
                        onClick={onLogout}
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        <span className="text-xs">Logout</span>
                      </Button>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 overflow-y-auto py-2">
                    <div className="px-2 space-y-1">
                      {dashboardItems.map((item) => (
                        <MenuItem
                          key={item.path}
                          icon={item.icon}
                          label={item.label}
                          isActive={pathname === item.path}
                          onClick={() => handleNavigation(item.path)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-700 p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-400 hover:text-white"
                      onClick={() => handleNavigation('/dashboard/profile')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Settings</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

function MenuItem({ icon, label, isActive, onClick }: MenuItemProps) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${isActive
          ? 'bg-gray-700/70 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}