"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] to-[#1A1B3A] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.781 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard Under Development</h1>
          <p className="text-gray-300">We&apos;re working hard to bring you an amazing dashboard experience.</p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400">
            📧 We&apos;ll send you an email notification as soon as the dashboard is ready!
          </p>
        </div>
        
        <Button 
          onClick={() => window.history.back()}
          className="w-full bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Go Back
        </Button>
      </Card>
    </div>
  );
}

// 'use client';

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { User } from "@/entities/User";
// import { PageLoading } from "@/components/shared/Loading";

// export default function Dashboard() {
//   const router = useRouter();

//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         const currentUser = await User.me();
        
//         // Route to appropriate dashboard based on role
//         if (currentUser.role === 'admin') {
//           router.push('/dashboard/admin');
//         } else if (currentUser.role === 'coordinator') {
//           router.push('/dashboard/coordinator');
//         } else {
//           router.push('/dashboard/participant');
//         }
//       } catch {
//         // If user is not authenticated, redirect to login
//         router.push('/login');
//       }
//     };

//     loadUserData();
//   }, [router]);

//   return <PageLoading text="Redirecting to dashboard..." />;
// }