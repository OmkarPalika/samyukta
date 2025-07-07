'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardNavigation from '@/components/navigation/DashboardNavigation';
import { User } from '@/entities/User';
import { Card, CardContent } from '@/components/ui/card';

interface UserType {
  full_name: string;
  role?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = React.useState<UserType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      router.push('/');
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

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <DashboardNavigation user={user} onLogout={handleLogout} />
      
      <main className="flex-grow nav-offset">
        {children}
      </main>
    </div>
  );
}