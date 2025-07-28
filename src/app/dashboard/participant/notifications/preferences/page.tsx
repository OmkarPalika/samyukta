'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { ClientAuth } from '@/lib/client-auth';
import { User as UserType } from '@/lib/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Mail, 

  Volume2,
  VolumeX,
  Save,
  RefreshCw
} from 'lucide-react';
import { PageLoading } from '@/components/shared/Loading';
import { PushNotificationSettings } from '@/components/notifications/PushNotificationSettings';
import { toast } from 'sonner';

interface NotificationPreferences {
  email_notifications: boolean;
  in_app_notifications: boolean;
  notification_types: {
    info: boolean;
    success: boolean;
    warning: boolean;
    error: boolean;
    announcement: boolean;
  };
  notification_frequency: 'immediate' | 'daily' | 'weekly';
  quiet_hours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export default function NotificationPreferencesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    in_app_notifications: true,
    notification_types: {
      info: true,
      success: true,
      warning: true,
      error: true,
      announcement: true
    },
    notification_frequency: 'immediate',
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await ClientAuth.me();
        if (!currentUser) {
          router.push('/login');
          return;
        }
        setUser(currentUser);
        await loadPreferences();
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    
    loadUserData();
  }, [router]);

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/user/notification-preferences', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
      toast.error('Failed to load preferences');
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/user/notification-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences }),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Notification preferences saved successfully');
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: string, value: unknown) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNotificationType = (type: string, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notification_types: {
        ...prev.notification_types,
        [type]: enabled
      }
    }));
  };

  const updateQuietHours = (key: string, value: unknown) => {
    setPreferences(prev => ({
      ...prev,
      quiet_hours: {
        ...prev.quiet_hours,
        [key]: value
      }
    }));
  };

  if (loading) {
    return <PageLoading text="Loading notification preferences..." />;
  }

  if (!user) {
    return router.push('/login');
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
        <div className="w-full max-w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <DashboardTabs />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Notification Preferences</h2>
                <p className="text-gray-400 text-sm">
                  Customize how and when you receive notifications
                </p>
              </div>
            </div>
            <Button
              onClick={savePreferences}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Push Notifications */}
            <PushNotificationSettings />

            {/* General Notification Settings */}
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="h-5 w-5 text-blue-400" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-400" />
                    <div>
                      <Label className="text-white font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
                  />
                </div>

                <Separator className="bg-gray-600" />

                {/* In-App Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-blue-400" />
                    <div>
                      <Label className="text-white font-medium">In-App Notifications</Label>
                      <p className="text-sm text-gray-400">Show notifications within the app</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.in_app_notifications}
                    onCheckedChange={(checked) => updatePreference('in_app_notifications', checked)}
                  />
                </div>

                <Separator className="bg-gray-600" />

                {/* Notification Frequency */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Notification Frequency</Label>
                  <Select
                    value={preferences.notification_frequency}
                    onValueChange={(value) => updatePreference('notification_frequency', value)}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 text-white">
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Types */}
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Notification Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(preferences.notification_types).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div>
                      <Label className="text-white font-medium capitalize">{type}</Label>
                      <p className="text-sm text-gray-400">
                        {type === 'info' && 'General information and updates'}
                        {type === 'success' && 'Success confirmations and achievements'}
                        {type === 'warning' && 'Important warnings and alerts'}
                        {type === 'error' && 'Error messages and issues'}
                        {type === 'announcement' && 'Official announcements and news'}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => updateNotificationType(type, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {preferences.quiet_hours.enabled ? (
                    <VolumeX className="h-5 w-5 text-orange-400" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-green-400" />
                  )}
                  Quiet Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white font-medium">Enable Quiet Hours</Label>
                    <p className="text-sm text-gray-400">
                      Disable notifications during specified hours
                    </p>
                  </div>
                  <Switch
                    checked={preferences.quiet_hours.enabled}
                    onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
                  />
                </div>

                {preferences.quiet_hours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Start Time</Label>
                      <Select
                        value={preferences.quiet_hours.start}
                        onValueChange={(value) => updateQuietHours('start', value)}
                      >
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">End Time</Label>
                      <Select
                        value={preferences.quiet_hours.end}
                        onValueChange={(value) => updateQuietHours('end', value)}
                      >
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}