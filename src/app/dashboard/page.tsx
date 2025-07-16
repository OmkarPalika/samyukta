'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClientAuth } from "@/lib/client-auth";
import { PageLoading } from "@/components/shared/Loading";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Add delay to ensure cookie is available
        await new Promise(resolve => setTimeout(resolve, 200));
        const currentUser = await ClientAuth.me();
        if (!currentUser) throw new Error('Not authenticated');
        
        // Route to appropriate dashboard based on role
        if (currentUser.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (currentUser.role === 'coordinator') {
          router.push('/dashboard/coordinator');
        } else {
          router.push('/dashboard/participant');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    loadUserData();
  }, [router]);

  return <PageLoading text="Redirecting to dashboard..." />;
}