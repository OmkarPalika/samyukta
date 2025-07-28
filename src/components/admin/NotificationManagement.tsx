'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Bell,
  Plus,
  Edit,
  Trash2,
  Send,
  RefreshCw,
  Save,
  X,

  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';
import { Notification, NotificationStats } from '@/lib/types';

interface NotificationManagementProps {
  onRefresh?: () => void;
}

export function NotificationManagement({ }: NotificationManagementProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');

  // Dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    recipients: {
      type: 'all'
    },
    channels: ['in_app'],
    status: 'draft'
  });

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
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
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/notifications/stats', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to load notification stats');
      }
      
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('Failed to load notification stats');
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadNotifications(), loadStats()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      recipients: {
        type: 'all'
      },
      channels: ['in_app'],
      status: 'draft'
    });
    setSelectedNotification(null);
    setShowCreateDialog(true);
  };

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification);
    setFormData(notification);
    setShowCreateDialog(true);
  };

  const handleSave = async () => {
    try {
      const url = selectedNotification 
        ? `/api/notifications/${selectedNotification.id}`
        : '/api/notifications';
      
      const method = selectedNotification ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to ${selectedNotification ? 'update' : 'create'} notification`);
      }

      toast.success(`Notification ${selectedNotification ? 'updated' : 'created'} successfully`);
      setShowCreateDialog(false);
      loadNotifications();
    } catch (error) {
      console.error('Failed to save notification:', error);
      toast.error(`Failed to ${selectedNotification ? 'update' : 'create'} notification`);
    }
  };

  const handleSend = async (id: string) => {
    if (!confirm('Are you sure you want to send this notification? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/notifications/${id}/send`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      toast.success('Notification sent successfully');
      loadNotifications();
      loadStats();
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      toast.success('Notification deleted successfully');
      loadNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'announcement': return <Zap className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-600';
      case 'success': return 'bg-green-600';
      case 'warning': return 'bg-yellow-600';
      case 'error': return 'bg-red-600';
      case 'announcement': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-600';
      case 'scheduled': return 'bg-blue-600';
      case 'draft': return 'bg-gray-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading notification management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">Notifications</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={loadData}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Write Notification
            </Button>
          </div>
        </div>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notifications.map((notification) => (
              <Card key={notification.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-base font-semibold truncate">
                          {notification.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {notification.recipients.type} recipients
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(notification.status)} variant="secondary">
                      {notification.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getPriorityColor(notification.priority)} text-xs`} variant="secondary">
                        {notification.priority}
                      </Badge>
                      <Badge className={`${getTypeColor(notification.type)} text-xs`} variant="outline">
                        {notification.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {notification.sent_at 
                        ? new Date(notification.sent_at).toLocaleDateString()
                        : new Date(notification.created_at).toLocaleDateString()
                      }
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {notification.channels.map((channel) => (
                      <Badge key={channel} variant="outline" className="text-xs border-gray-600">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <div className="flex items-center gap-1">
                      {notification.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSend(notification.id)}
                          className="border-green-600 text-green-400 hover:bg-green-900 h-8 px-2"
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(notification)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 h-8 px-2"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(notification.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900 h-8 px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {notification.status === 'sent' && (
                      <div className="text-xs text-gray-400">
                        Sent to {notification.recipients.count || 0} users
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No notifications found</h3>
              <p className="text-gray-400 mb-4">Create your first notification to get started.</p>
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Write First Notification
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          {stats && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Sent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.total_sent}</div>
                    <p className={`text-xs flex items-center gap-1 ${(stats.sent_change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span>{(stats.sent_change || 0) >= 0 ? '+' : ''}{(stats.sent_change || 0).toFixed(1)}%</span>
                      <span className="text-gray-400">from last week</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Delivered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">{stats.total_delivered}</div>
                    <p className={`text-xs flex items-center gap-1 ${(stats.delivered_change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span>{(stats.delivered_change || 0) >= 0 ? '+' : ''}{(stats.delivered_change || 0).toFixed(1)}%</span>
                      <span className="text-gray-400">from last week</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Read Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400">{stats.read_rate.toFixed(1)}%</div>
                    <p className={`text-xs flex items-center gap-1 ${(stats.read_rate_change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span>{(stats.read_rate_change || 0) >= 0 ? '+' : ''}{(stats.read_rate_change || 0).toFixed(1)}%</span>
                      <span className="text-gray-400">from last week</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Click Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-400">{stats.click_rate.toFixed(1)}%</div>
                    <p className={`text-xs flex items-center gap-1 ${(stats.click_rate_change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <span>{(stats.click_rate_change || 0) >= 0 ? '+' : ''}{(stats.click_rate_change || 0).toFixed(1)}%</span>
                      <span className="text-gray-400">from last week</span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Notification Performance</CardTitle>
                    <CardDescription>Recent notification engagement metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Average Open Rate</span>
                        <span className="text-sm font-medium text-white">{stats.read_rate.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Average Click Rate</span>
                        <span className="text-sm font-medium text-white">{stats.click_rate.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Delivery Success</span>
                        <span className="text-sm font-medium text-white">{stats.delivery_rate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Channel Performance</CardTitle>
                    <CardDescription>Performance by notification channel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Push Notifications</span>
                        <span className="text-sm font-medium text-green-400">85.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Email</span>
                        <span className="text-sm font-medium text-blue-400">72.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">In-App</span>
                        <span className="text-sm font-medium text-purple-400">91.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedNotification ? 'Edit Notification' : 'Create New Notification'}
            </DialogTitle>
            <DialogDescription>
              {selectedNotification ? 'Modify notification details and targeting options.' : 'Create a new notification to send to users with targeting options.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'info' | 'success' | 'warning' | 'error' | 'announcement') => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Notification title"
              />
            </div>

            <div>
              <Label>Message</Label>
              <Textarea
                value={formData.message || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Notification message"
                rows={4}
              />
            </div>

            {/* Recipients */}
            <div>
              <Label>Recipients</Label>
              <Select
                value={formData.recipients?.type}
                onValueChange={(value: 'all' | 'role' | 'custom') => 
                  setFormData(prev => ({ 
                    ...prev, 
                    recipients: { ...prev.recipients, type: value }
                  }))
                }
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="role">By Role</SelectItem>
                  <SelectItem value="custom">Custom List</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.recipients?.type === 'role' && (
              <div>
                <Label>Select Roles</Label>
                <div className="space-y-2 mt-2">
                  {['admin', 'coordinator', 'participant', 'volunteer'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role_${role}`}
                        checked={formData.recipients?.filters?.roles?.includes(role)}
                        onCheckedChange={(checked) => {
                          const currentRoles = formData.recipients?.filters?.roles || [];
                          const newRoles = checked 
                            ? [...currentRoles, role]
                            : currentRoles.filter(r => r !== role);
                          
                          setFormData(prev => ({
                            ...prev,
                            recipients: {
                              type: prev.recipients?.type || 'role',
                              ...prev.recipients,
                              filters: {
                                ...prev.recipients?.filters,
                                roles: newRoles
                              }
                            }
                          }));
                        }}
                      />
                      <Label htmlFor={`role_${role}`} className="capitalize">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.recipients?.type === 'custom' && (
              <div>
                <Label>User IDs (comma-separated)</Label>
                <Textarea
                  value={formData.recipients?.filters?.user_ids?.join(', ') || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    recipients: {
                      type: prev.recipients?.type || 'custom',
                      ...prev.recipients,
                      filters: {
                        ...prev.recipients?.filters,
                        user_ids: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                      }
                    }
                  }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="user1, user2, user3"
                  rows={3}
                />
              </div>
            )}

            {/* Channels */}
            <div>
              <Label>Delivery Channels</Label>
              <div className="space-y-2 mt-2">
                {['in_app', 'email', 'sms', 'push'].map((channel) => (
                  <div key={channel} className="flex items-center space-x-2">
                    <Checkbox
                      id={`channel_${channel}`}
                      checked={formData.channels?.includes(channel as 'in_app' | 'email' | 'sms' | 'push')}
                      onCheckedChange={(checked) => {
                        const currentChannels = formData.channels || [];
                        const newChannels = checked 
                          ? [...currentChannels, channel as 'in_app' | 'email' | 'sms' | 'push']
                          : currentChannels.filter(c => c !== channel);
                        
                        setFormData(prev => ({ ...prev, channels: newChannels }));
                      }}
                    />
                    <Label htmlFor={`channel_${channel}`} className="capitalize">
                      {channel.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Action URL (optional)</Label>
                <Input
                  value={formData.action_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, action_url: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://example.com/action"
                />
              </div>
              <div>
                <Label>Action Text (optional)</Label>
                <Input
                  value={formData.action_text || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, action_text: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="View Details"
                />
              </div>
            </div>

            <div>
              <Label>Expires At (optional)</Label>
              <Input
                type="datetime-local"
                value={formData.expires_at ? new Date(formData.expires_at).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  expires_at: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {selectedNotification ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}