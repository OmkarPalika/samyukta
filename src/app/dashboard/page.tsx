'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/entities/User";

export default function Dashboard() {
  const [, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await User.me();
        
        // Route to appropriate dashboard based on role
        if (currentUser.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (currentUser.role === 'coordinator') {
          router.push('/dashboard/coordinator');
        } else {
          router.push('/dashboard/participant');
        }
      } catch {
        // If user is not authenticated, redirect to login
        router.push('/login');
      }
      setLoading(false);
    };

    loadUserData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
    </div>
  );
}