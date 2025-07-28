'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { User } from '@/entities/User';
import { User as UserType } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, Send, Plus } from 'lucide-react';

export default function NotificationManagement() {
  const router = useRouter();
  const [, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'warning' | 'error' | 'announcement'>('info');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [category, setCategory] = useState<string>('general');
  const [recipientType, setRecipientType] = useState<'all' | 'role'>('all');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>(['in_app']);
  const [actionUrl, setActionUrl] = useState('');
  const [actionText, setActionText] = useState('');

  const loadUserData = useCallback(async () => {
    try {
      const user = await User.me();
      if (!user) {
        router.push('/login');
        return;
      }
      
      if (user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleChannelChange = (channel: string, checked: boolean) => {
    if (checked) {
      setChannels(prev => [...prev, channel]);
    } else {
      setChannels(prev => prev.filter(c => c !== channel));
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles(prev => [...prev, role]);
    } else {
      setSelectedRoles(prev => prev.filter(r => r !== role));
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in title and message');
      return;
    }

    if (channels.length === 0) {
      toast.error('Please select at least one channel');
      return;
    }

    if (recipientType === 'role' && selectedRoles.length === 0) {
      toast.error('Please select at least one role');
      return;
    }

    setSending(true);
    try {
      // First create the notification
      const createResponse = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          message,
          type,
          priority,
          category,
          recipients: {
            type: recipientType,
            filters: recipientType === 'role' ? { roles: selectedRoles } : undefined
          },
          channels,
          action_url: actionUrl || undefined,
          action_text: actionText || undefined
        }),
        credentials: 'include',
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create notification');
      }

      const { notification } = await createResponse.json();

      // Then send the notification
      const sendResponse = await fetch(`/api/notifications/${notification._id}/send`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!sendResponse.ok) {
        throw new Error('Failed to send notification');
      }

      const result = await sendResponse.json();
      toast.success(`Notification sent successfully to ${result.recipients_count} recipients`);
      
      // Reset form
      setTitle('');
      setMessage('');
      setType('info');
      setPriority('medium');
      setCategory('general');
      setRecipientType('all');
      setSelectedRoles([]);
      setChannels(['in_app']);
      setActionUrl('');
      setActionText('');
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout 
        title="Notification Management"
        subtitle="Send notifications to users"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Notification Management"
      subtitle="Send notifications to users"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Send Notification
              </h1>
              <p className="text-gray-400 mt-2">
                Create and send notifications to users via multiple channels
              </p>
            </div>
          </div>
        </div>

        {/* Notification Form */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title"
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-300">Type</Label>
                <Select value={type} onValueChange={(value: 'info' | 'success' | 'warning' | 'error' | 'announcement') => setType(value)}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter notification message"
                rows={4}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            {/* Priority, Category and Recipients */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
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
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="competitions">Competitions</SelectItem>
                    <SelectItem value="workshops">Workshops</SelectItem>
                    <SelectItem value="announcements">Announcements</SelectItem>
                    <SelectItem value="updates">Updates</SelectItem>
                    <SelectItem value="reminders">Reminders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipients" className="text-gray-300">Recipients</Label>
                <Select value={recipientType} onValueChange={(value: 'all' | 'role') => setRecipientType(value)}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="role">By Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Role Selection */}
            {recipientType === 'role' && (
              <div className="space-y-2">
                <Label className="text-gray-300">Select Roles</Label>
                <div className="flex flex-wrap gap-4">
                  {['admin', 'coordinator', 'participant', 'volunteer'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={role}
                        checked={selectedRoles.includes(role)}
                        onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                      />
                      <Label htmlFor={role} className="text-gray-300 capitalize">
                        {role}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Channels */}
            <div className="space-y-2">
              <Label className="text-gray-300">Delivery Channels *</Label>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'in_app', label: 'In-App' },
                  { id: 'email', label: 'Email' },
                  { id: 'sms', label: 'SMS' },
                  { id: 'push', label: 'Push' }
                ].map((channel) => (
                  <div key={channel.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={channel.id}
                      checked={channels.includes(channel.id)}
                      onCheckedChange={(checked) => handleChannelChange(channel.id, checked as boolean)}
                    />
                    <Label htmlFor={channel.id} className="text-gray-300">
                      {channel.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actionUrl" className="text-gray-300">Action URL (Optional)</Label>
                <Input
                  id="actionUrl"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actionText" className="text-gray-300">Action Text (Optional)</Label>
                <Input
                  id="actionText"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="View Details"
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Send Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSendNotification}
                disabled={sending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}