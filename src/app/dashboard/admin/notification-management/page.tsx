'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { NotificationManagement } from '@/components/admin/NotificationManagement';
import { NotificationHistory } from '@/components/admin/NotificationHistory';
import { User } from '@/entities/User';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, History } from 'lucide-react';

export default function NotificationManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('send');

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
    // Refresh will be handled by the NotificationManagement component
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Notification management data refreshed');
    }, 1000);
  };

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (loading) {
    return (
      <AdminLayout 
        title="Notification Management"
        subtitle="Send targeted notifications to users across multiple channels"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading notification management...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Notification Management"
      subtitle="Send targeted notifications to users across multiple channels"
      showRefresh={true}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      <div className="p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
            <TabsTrigger 
              value="send" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              <History className="h-4 w-4 mr-2" />
              Notification History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="mt-6">
            <NotificationManagement onRefresh={handleRefresh} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <NotificationHistory />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}