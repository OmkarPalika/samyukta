'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ClientAuth } from '@/lib/client-auth';
import { User as UserType } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Bell, Calendar, Trophy, Users, Camera, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageLoading } from '@/components/shared/Loading';

export default function ParticipantDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setQrCode] = useState('');
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; read: boolean; date: string }>>([]);

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = await ClientAuth.me();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      
      // Check if user is not a participant
      if (currentUser.role && currentUser.role !== 'participant') {
        router.push('/dashboard');
        return;
      }
      
      setUser(currentUser);
      setQrCode('/placeholder-qr.png');
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadUserData();
    loadNotifications();
  }, [loadUserData]);

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
      }
    ]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  if (loading) {
    return <PageLoading text="Loading dashboard..." />;
  }

  if (!user) {
    return router.push('/login');
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <DashboardTabs />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Welcome back, <span className="text-blue-400">{user.full_name}</span>!
            </h1>
            <p className="text-sm text-gray-400">
              Ready to make the most of Samyukta 2025? Let&apos;s dive in.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full">
            {/* Notifications Card */}
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 cursor-pointer hover:bg-gray-800/60 transition-colors" onClick={() => router.push('/dashboard/notifications')}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </div>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                      {notifications.filter(n => !n.read).length} new
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {notifications.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-700 ${!notification.read ? 'bg-gray-700/30' : ''}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(notification.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400 text-sm">No notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Card */}
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 cursor-pointer hover:bg-gray-800/60 transition-colors" onClick={() => router.push('/dashboard/profile')}>
              <CardHeader>
                <CardTitle className="text-white flex justify-between items-center">
                  <span>Your Profile</span>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                    View Profile
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-violet-500 text-lg sm:text-xl font-bold text-white">
                    {user.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-base sm:text-lg font-bold text-white mt-2">{user.full_name}</h3>
                <p className="text-gray-400 text-sm sm:text-base truncate">{user.email}</p>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mt-2 text-xs sm:text-sm">
                  Participant
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Cards */}
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center bg-gray-800/40 border-gray-700 hover:bg-gray-700/50"
              onClick={() => router.push('/dashboard/games')}
            >
              <QrCode className="w-8 h-8 mb-2 text-green-400" />
              <span>Games</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center bg-gray-800/40 border-gray-700 hover:bg-gray-700/50"
              onClick={() => router.push('/dashboard/competitions')}
            >
              <Trophy className="w-8 h-8 mb-2 text-orange-400" />
              <span>Competitions</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center bg-gray-800/40 border-gray-700 hover:bg-gray-700/50"
              onClick={() => router.push('/dashboard/team')}
            >
              <Users className="w-8 h-8 mb-2 text-violet-400" />
              <span>Team</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center bg-gray-800/40 border-gray-700 hover:bg-gray-700/50"
              onClick={() => router.push('/dashboard/social')}
            >
              <Camera className="w-8 h-8 mb-2 text-pink-400" />
              <span>Social</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center bg-gray-800/40 border-gray-700 hover:bg-gray-700/50"
              onClick={() => router.push('/dashboard/schedule')}
            >
              <Calendar className="w-8 h-8 mb-2 text-yellow-400" />
              <span>Schedule</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center bg-gray-800/40 border-gray-700 hover:bg-gray-700/50"
              onClick={() => router.push('/dashboard/help')}
            >
              <HelpCircle className="w-8 h-8 mb-2 text-emerald-400" />
              <span>Help</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}