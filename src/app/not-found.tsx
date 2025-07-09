'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function NotFoundContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] to-[#1A1B3A] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-gray-300">The page you are looking for doesn&apos;t exist or has been moved.</p>
        </div>
        
        <Button 
          asChild
          className="w-full bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </Card>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <NotFoundContent />
    </Suspense>
  );
}