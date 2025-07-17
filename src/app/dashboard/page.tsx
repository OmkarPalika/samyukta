'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClientAuth } from '@/lib/client-auth';
import { PageLoading } from '@/components/shared/Loading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{id: string; role: string} | null>(null);

  useEffect(() => {
    async function redirectBasedOnRole() {
      try {
        const user = await ClientAuth.me();
        if (!user) {
          router.push('/login');
          return;
        }
        
        setUser(user);

        // Only redirect admins and coordinators
        if (user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (user.role === 'coordinator') {
          router.push('/dashboard/coordinator');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    redirectBasedOnRole();
  }, [router]);

  if (loading) {
    return <PageLoading text="Loading dashboard..." />;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Dashboard Under Development</h2>
            <p className="text-gray-300">
              We&apos;re currently building an amazing dashboard experience for you. Once it&apos;s live, we&apos;ll notify you via email.
            </p>
            <div className="flex items-center justify-center text-sm text-blue-400 mt-2">
              <Mail className="w-4 h-4 mr-2" />
              <span>Check your email for updates</span>
            </div>
            <Button 
              onClick={() => router.push('/')}
              className="mt-4 bg-gradient-to-r from-blue-500 to-violet-500"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * This page is a placeholder until the dashboard is ready.
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClientAuth } from '@/lib/client-auth';
import { PageLoading } from '@/components/shared/Loading';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function redirectBasedOnRole() {
      try {
        const user = await ClientAuth.me();
        if (!user) {
          router.push('/login');
          return;
        }

        // Redirect based on user role
        switch (user.role) {
          case 'admin':
            router.push('/dashboard/admin');
            break;
          case 'coordinator':
            router.push('/dashboard/coordinator');
            break;
          default:
            router.push('/dashboard/participant');
            break;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    redirectBasedOnRole();
  }, [router]);

  if (loading) {
    return <PageLoading text="Loading dashboard..." />;
  }

  return null; // Will redirect to appropriate dashboard
}
 */