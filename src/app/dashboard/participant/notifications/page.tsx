'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ClientAuth } from '@/lib/client-auth';
import { User as UserType } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  CheckCheck, 
  Search,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { PageLoading } from '@/components/shared/Loading';
import { toast } from 'sonner';

interface UserNotification {
  id: string;
  notification_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string;
  action_text?: string;
  read: boolean;
  read_at?: string;
  clicked: boolean;
  clicked_at?: string;
  created_at: string;
  expires_at?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<UserNotification[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter notifications based on active filters
  useEffect(() => {
    let filtered = notifications;

    // Filter by tab (read status)
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (activeTab === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(n => n.priority === priorityFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.message.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeTab, typeFilter, priorityFilter, searchQuery]);

  const loadNotifications = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/notifications/user', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to load notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      toast.error('Failed to load notifications');
      setNotifications([]);
    } finally {
      setRefreshing(false);
    }
  };
  
  const markNotificationAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/notifications/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_read',
          notification_ids: [id]
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_all_read'
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      setNotifications(notifications.map(notification => ({ 
        ...notification, 
        read: true, 
        read_at: new Date().toISOString() 
      })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 text-blue-400" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'announcement': return <Zap className="h-4 w-4 text-purple-400" />;
      default: return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-500/5';
      case 'high': return 'border-l-orange-500 bg-orange-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'low': return 'border-l-green-500 bg-green-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: UserNotification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
  };

  if (loading) {
    return <PageLoading text="Loading notifications..." />;
  }

  if (!user) {
    return router.push('/login');
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <DashboardTabs />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Bell className="w-6 h-6 mr-3 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Notifications</h2>
                <p className="text-gray-400 text-sm">
                  {notifications.length} total, {unreadCount} unread
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={loadNotifications}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-600 text-gray-300 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-transparent border-gray-600 text-gray-300 hover:text-blue-400"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          
          {/* Filters and Tabs */}
          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 mb-6">
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <TabsList className="bg-gray-700/50 border-gray-600">
                    <TabsTrigger value="all" className="data-[state=active]:bg-gray-600">
                      All ({notifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="data-[state=active]:bg-gray-600">
                      Unread ({unreadCount})
                    </TabsTrigger>
                    <TabsTrigger value="read" className="data-[state=active]:bg-gray-600">
                      Read ({notifications.length - unreadCount})
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-48 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-32 bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-32 bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
            <CardContent className="p-0">
              {filteredNotifications.length > 0 ? (
                <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-gray-700 hover:bg-gray-700/30 cursor-pointer transition-colors border-l-2 ${getPriorityColor(notification.priority)} ${!notification.read ? 'bg-gray-700/20' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium truncate ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className={`text-xs line-clamp-2 ${notification.read ? 'text-gray-400' : 'text-gray-300'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                            {notification.action_url && (
                              <div className="flex items-center gap-1 text-xs text-blue-400">
                                <span>{notification.action_text || 'View'}</span>
                                <ExternalLink className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {searchQuery || typeFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'No notifications match your filters' 
                      : activeTab === 'unread' 
                        ? 'No unread notifications'
                        : activeTab === 'read'
                          ? 'No read notifications'
                          : 'No notifications'
                    }
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {searchQuery || typeFilter !== 'all' || priorityFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'You\'re all caught up!'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}