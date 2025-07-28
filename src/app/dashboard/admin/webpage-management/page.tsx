'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { WebpageManagement } from '@/components/admin/WebpageManagement';
import { User } from '@/entities/User';
import { toast } from 'sonner';

export default function WebpageManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      const user = await User.me();
      if (!user || user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load user data:', error);
      router.push('/login');
    }
  }, [router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh will be handled by the WebpageManagement component
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Webpage content refreshed');
    }, 1000);
  };

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (loading) {
    return (
      <AdminLayout 
        title="Webpage Management"
        subtitle="Manage website content including speakers, sponsors, team members, and events"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading webpage management...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Webpage Management"
      subtitle="Manage website content including speakers, sponsors, team members, and events"
      showRefresh={true}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      <div className="p-4 sm:p-6">
        <WebpageManagement onRefresh={handleRefresh} />
      </div>
    </AdminLayout>
  );
}