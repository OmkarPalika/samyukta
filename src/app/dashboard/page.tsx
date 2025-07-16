'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/entities/User";
import { PageLoading } from "@/components/shared/Loading";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await User.me();
        
        // Route to appropriate dashboard based on role
        if (currentUser.role === 'admin') {
          router.push('/admin');
        } else if (currentUser.role === 'coordinator') {
          router.push('/dashboard/coordinator');
        } else {
          router.push('/dashboard/participant');
        }
      } catch {
        // If user is not authenticated, redirect to login
        router.push('/login');
      }
    };

    loadUserData();
  }, [router]);

  return <PageLoading text="Redirecting to dashboard..." />;
}