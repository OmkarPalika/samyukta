'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DirectJoin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to tickets page since direct join is no longer available
    router.replace('/tickets');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Redirecting...</h1>
        <p className="text-gray-400">Direct join is no longer available. Redirecting to tickets page.</p>
      </div>
    </div>
  );
}