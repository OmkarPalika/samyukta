'use client';

import React from 'react';
import PublicNavigation from '@/components/navigation/PublicNavigation';
import Footer from '@/components/shared/Footer';
import { User } from '@/entities/User';

import { Card, CardContent } from '@/components/ui/card';

interface UserType {
  full_name: string;
  role?: string;
}

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [user, setUser] = React.useState<UserType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch {
      // Expected behavior when user is not authenticated
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      // Force redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect to home even if logout fails
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <PublicNavigation user={user} onLogout={handleLogout} />
      
      <main className="flex-grow nav-offset">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}