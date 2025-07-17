'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ClientAuth } from '@/lib/client-auth';
import { User as UserType } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { PageLoading } from '@/components/shared/Loading';

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Array<{id: string; title: string; message: string; read: boolean; date: string}>>([]);

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
    loadNotifications();
  }, [router]);

  const loadNotifications = async () => {
    // Mock notifications
    setNotifications([
      {
        id: '1',
        title: 'Welcome to Samyukta 2025!',
        message: 'Thank you for registering. Your journey begins now!',
        read: false,
        date: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Workshop Schedule Updated',
        message: 'The AI workshop has been moved to Auditorium 2. Please check your schedule.',
        read: false,
        date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '3',
        title: 'New Competition Announced',
        message: 'Exciting news! A new Blockchain hackathon has been added to the event lineup.',
        read: true,
        date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: '4',
        title: 'Registration Confirmed',
        message: 'Your registration for the Cloud Computing workshop has been confirmed.',
        read: true,
        date: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      },
      {
        id: '5',
        title: 'Payment Received',
        message: 'We have received your payment for the event registration.',
        read: true,
        date: new Date(Date.now() - 345600000).toISOString() // 4 days ago
      }
    ]);
  };
  
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  if (loading) {
    return <PageLoading text="Loading notifications..." />;
  }

  if (!user) {
    return router.push('/login');
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <DashboardTabs />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center lg:hidden">
              <Bell className="w-5 h-5 mr-2 text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Notifications</h2>
            </div>
            {notifications.filter(n => !n.read).length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent border-gray-600 text-gray-300 hover:text-blue-400"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
          
          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span>All Notifications</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                    {notifications.filter(n => !n.read).length} unread
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length > 0 ? (
                <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-gray-700 ${!notification.read ? 'bg-gray-700/30' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{notification.message}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(notification.date).toLocaleDateString()} at {new Date(notification.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No notifications</p>
                  <p className="text-gray-500 text-sm mt-2">You&apos;re all caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}