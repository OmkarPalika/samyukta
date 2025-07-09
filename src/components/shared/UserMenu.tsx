import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserType {
  full_name: string;
}

interface UserMenuProps {
  user: UserType | null;
  onLogout: () => void;
  variant?: 'public' | 'dashboard';
}

export default function UserMenu({ user, onLogout, variant = 'public' }: UserMenuProps) {
  if (!user) {
    return (
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Button variant="outline" asChild className="px-3 sm:px-6 bg-transparent border-gray-600 text-gray-300 hover:bg-white hover:text-blue-500 hover:border-white text-sm">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg neon-glow px-3 sm:px-4 text-sm">
          <Link href="/register">Register</Link>
        </Button>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <Button variant="ghost" onClick={onLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 sm:p-2">
        <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg px-3 sm:px-4 text-sm">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button variant="ghost" onClick={onLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2">
        <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
    </div>
  );
}