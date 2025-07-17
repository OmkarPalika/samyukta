'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ClientAuth } from '@/lib/client-auth';
import { Social } from '@/entities/Social';
import { User as UserType } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { PageLoading } from '@/components/shared/Loading';

export default function SocialPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await ClientAuth.me();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    
    loadUserData();
  }, [router]);

  const handleSocialUpload = async (file: File) => {
    if (!user) return;
    try {
      const socialData = {
        uploaded_by: user.id,
        file_url: URL.createObjectURL(file),
        caption: 'Samyukta 2025 moment!'
      };
      await Social.create(socialData);
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Social upload error:', error);
      alert('Failed to upload photo. Please try again.');
    }
  };

  if (loading) {
    return <PageLoading text="Loading social feed..." />;
  }

  if (!user) {
    return router.push('/login');
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <DashboardTabs />
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center lg:hidden">
              <Camera className="w-5 h-5 mr-2 text-pink-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Social Feed</h2>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.push('/social')}
                className="bg-gradient-to-r from-pink-500 to-violet-500"
              >
                <Camera className="w-4 h-4 mr-2" />
                View Full Feed
              </Button>
              <Button 
                variant="outline"
                className="bg-transparent hover:bg-white hover:text-blue-400 border-gray-600 text-gray-300"
              >
                My Media
              </Button>
            </div>
          </div>
          
          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Share Your Moments</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSocialUpload(file);
                  }}
                  className="hidden"
                  id="social-upload"
                />
                <label htmlFor="social-upload">
                  <Button className="bg-gradient-to-r from-pink-500 to-violet-500 cursor-pointer">
                    <Camera className="w-4 h-4 mr-2" />
                    Share Photo
                  </Button>
                </label>
                <p className="text-gray-400 text-sm mt-4">
                  Share your Samyukta 2025 moments with the community!
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="aspect-square bg-gray-700/30 rounded-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-500" />
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                className="bg-transparent border-gray-600 text-gray-300 hover:text-pink-400"
              >
                Load More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}