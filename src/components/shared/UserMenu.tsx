import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface UserType {
  full_name: string;
  role?: string;
}

interface UserMenuProps {
  user: UserType | null;
  onLogout: () => void;
  variant?: 'public' | 'dashboard';
}

export default function UserMenu({ user, onLogout, variant = 'public' }: UserMenuProps) {
  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Button variant="outline" asChild className="px-6 bg-transparent border-gray-600 text-gray-300 hover:bg-white hover:text-blue-500 hover:border-white">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg neon-glow">
          <Link href="/register">Register</Link>
        </Button>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 text-gray-400 hover:text-gray-300">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gray-700 text-gray-300">
                {user.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{user.full_name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700">
          <DropdownMenuItem className="text-gray-300">
            Role: {user.role || 'participant'}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem onClick={onLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Button asChild className="bg-gradient-to-r from-blue-500 to-violet-500 hover:shadow-lg">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button variant="ghost" onClick={onLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
        <LogOut className="w-5 h-5" />
      </Button>
    </div>
  );
}