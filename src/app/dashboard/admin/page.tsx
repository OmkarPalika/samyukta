'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  Users,
  FileText,
  Mail,
  DollarSign,
  Eye,
  ArrowRight,
  Activity,
  Clock} from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentActivity {
  type: string;
  message: string;
  time: string;
  icon?: React.ReactNode;
}

interface DashboardStats {
  totalUsers: number;
  totalRegistrations: number;
  totalRevenue: number;
  pendingApprovals: number;
  recentActivity: RecentActivity[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-stats', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardStats();
      toast.success('Dashboard refreshed successfully');
    } catch {
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  const quickActions = [
    {
      title: 'Analytics & Reports',
      description: 'View comprehensive analytics and generate reports',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      bgColor: 'bg-blue-500/10',
      route: '/dashboard/admin/analytics',
      stats: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '0'
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: <Users className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/20',
      bgColor: 'bg-green-500/10',
      route: '/dashboard/admin/user-management',
      stats: stats?.totalUsers ? `${stats.totalUsers} users` : '0 users'
    },
    {
      title: 'Registration Management',
      description: 'Handle team registrations and approvals',
      icon: <FileText className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      bgColor: 'bg-purple-500/10',
      route: '/dashboard/admin/registration-management',
      stats: stats?.totalRegistrations ? `${stats.totalRegistrations} teams` : '0 teams'
    },
    {
      title: 'Email Tools',
      description: 'Send bulk emails and notifications',
      icon: <Mail className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/20',
      bgColor: 'bg-orange-500/10',
      route: '/dashboard/admin/email-resend',
      stats: stats?.pendingApprovals ? `${stats.pendingApprovals} pending` : '0 pending'
    }
  ];

  const recentActivities = stats?.recentActivity || [];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back, Omkar! Here's your overview for today."
      showRefresh={true}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    ₹{stats?.totalRevenue?.toLocaleString() || '0'}
                  </p>
                  <p className="text-green-400 text-xs mt-1">+12% from last week</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Total Users</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    {stats?.totalUsers || 0}
                  </p>
                  <p className="text-green-400 text-xs mt-1">+8% from last week</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-400 text-sm font-medium">Registrations</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    {stats?.totalRegistrations || 0}
                  </p>
                  <p className="text-green-400 text-xs mt-1">+15% from last week</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20 backdrop-blur-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-400 text-sm font-medium">Pending</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white">
                    {stats?.pendingApprovals || 0}
                  </p>
                  <p className="text-yellow-400 text-xs mt-1">Needs attention</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`${action.bgColor} ${action.borderColor} backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300 group`}
                  onClick={() => router.push(action.route)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <div className={action.textColor}>
                          {action.icon}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>

                    <h4 className="text-white font-semibold mb-2 group-hover:text-white transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-3 group-hover:text-gray-300 transition-colors">
                      {action.description}
                    </p>
                    <div className={`text-sm font-medium ${action.textColor}`}>
                      {action.stats}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="bg-gray-800/40 border-gray-700/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Recent Activity
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {activity.message}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}