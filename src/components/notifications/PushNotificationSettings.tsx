'use client';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Smartphone, TestTube, RefreshCw } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function PushNotificationSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    toggle,
    testNotification,
    refresh
  } = usePushNotifications();

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Granted</Badge>;
      case 'denied':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Denied</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Not Requested</Badge>;
    }
  };

  const getSupportBadge = () => {
    return isSupported 
      ? <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Supported</Badge>
      : <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Not Supported</Badge>;
  };

  if (!isSupported) {
    return (
      <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BellOff className="h-5 w-5 text-red-400" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in your browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BellOff className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">
              Your browser doesn&apos;t support push notifications. Try using a modern browser like Chrome, Firefox, or Safari.
            </p>
            <Button
              onClick={refresh}
              variant="outline"
              className="bg-transparent border-gray-600 text-gray-300 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Bell className="h-5 w-5 text-blue-400" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive instant notifications on your device even when the app is closed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Browser Support</Label>
            {getSupportBadge()}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Permission Status</Label>
            {getPermissionBadge()}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Subscription Status</Label>
            {isSubscribed 
              ? <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
              : <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Inactive</Badge>
            }
          </div>
        </div>

        {/* Main Toggle */}
        <div className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-blue-400" />
            <div>
              <Label className="text-white font-medium">
                Enable Push Notifications
              </Label>
              <p className="text-sm text-gray-400">
                Get notified about important updates and announcements
              </p>
            </div>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={toggle}
            disabled={isLoading || permission === 'denied'}
          />
        </div>

        {/* Permission Denied Message */}
        {permission === 'denied' && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <BellOff className="h-4 w-4" />
              <span className="font-medium">Permission Denied</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              Push notifications are blocked. To enable them:
            </p>
            <ol className="text-sm text-gray-300 space-y-1 ml-4">
              <li>1. Click the lock icon in your browser&apos;s address bar</li>
              <li>2. Change notifications from &quot;Block&quot; to &quot;Allow&quot;</li>
              <li>3. Refresh this page and try again</li>
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {!isSubscribed && permission !== 'denied' && (
            <Button
              onClick={subscribe}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Enabling...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Notifications
                </>
              )}
            </Button>
          )}

          {isSubscribed && (
            <Button
              onClick={unsubscribe}
              disabled={isLoading}
              variant="outline"
              className="bg-transparent border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Disabling...
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4 mr-2" />
                  Disable Notifications
                </>
              )}
            </Button>
          )}

          {isSubscribed && (
            <Button
              onClick={testNotification}
              variant="outline"
              className="bg-transparent border-gray-600 text-gray-300 hover:text-white"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test Notification
            </Button>
          )}

          <Button
            onClick={refresh}
            variant="outline"
            size="sm"
            className="bg-transparent border-gray-600 text-gray-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>

        {/* Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Push notifications work even when the website is closed</p>
          <p>• You can disable notifications anytime from your browser settings</p>
          <p>• We respect your privacy and only send important updates</p>
        </div>
      </CardContent>
    </Card>
  );
}