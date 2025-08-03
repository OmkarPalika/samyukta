'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  X,
  Bell
} from 'lucide-react';
import { usePWA, getInstallPromptText, requestNotificationPermission } from '@/lib/pwa-utils';
import { toast } from 'sonner';

// Install App Prompt Component
export function InstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show prompt after a delay if app is installable and not dismissed
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, dismissed]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast.success('App installed successfully!');
      setShowPrompt(false);
    } else {
      toast.error('Installation cancelled or failed');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (!showPrompt || isInstalled || dismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">
              Install Samyukta 2025
            </h3>
            <p className="text-xs opacity-90 mb-3">
              {getInstallPromptText()}
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleInstall}
                className="bg-white text-blue-600 hover:bg-gray-100 text-xs px-3 py-1 h-auto"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 text-xs px-2 py-1 h-auto"
              >
                Later
              </Button>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="flex-shrink-0 text-white hover:bg-white/20 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Network Status Indicator
export function NetworkStatus() {
  const { isOnline } = usePWA();
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Show status change notification
    setShowStatus(true);
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOnline]);

  if (!showStatus) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      showStatus ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <Badge 
        variant={isOnline ? 'default' : 'destructive'}
        className="flex items-center gap-2 px-3 py-2 text-sm"
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            Back Online
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            You&apos;re Offline
          </>
        )}
      </Badge>
    </div>
  );
}

// App Update Notification
export function UpdateNotification() {
  const { updateAvailable, updateApp } = usePWA();
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    console.log('UpdateNotification: updateAvailable changed to:', updateAvailable);
    if (updateAvailable) {
      console.log('UpdateNotification: Showing update notification');
      setShowUpdate(true);
    }
  }, [updateAvailable]);

  const handleUpdate = async () => {
    await updateApp();
    toast.success('App updated successfully!');
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <Card className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md bg-green-600 text-white border-0 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">
              Update Available
            </h3>
            <p className="text-xs opacity-90 mb-3">
              A new version of Samyukta 2025 is ready to install.
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleUpdate}
                className="bg-white text-green-600 hover:bg-gray-100 text-xs px-3 py-1 h-auto"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Update Now
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 text-xs px-2 py-1 h-auto"
              >
                Later
              </Button>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="flex-shrink-0 text-white hover:bg-white/20 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Notification Permission Request
export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check current permission status
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if permission is default and user has been active
      if (Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 10000); // Show after 10 seconds

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    const newPermission = await requestNotificationPermission();
    setPermission(newPermission);
    setShowPrompt(false);
    
    if (newPermission === 'granted') {
      toast.success('Notifications enabled! You\'ll receive updates about Samyukta 2025.');
    } else {
      toast.error('Notifications disabled. You can enable them later in settings.');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('notification-prompt-dismissed', 'true');
  };

  // Don't show if permission already granted/denied or dismissed
  if (!showPrompt || permission !== 'default') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">
              Stay Updated
            </h3>
            <p className="text-xs opacity-90 mb-3">
              Get notified about important updates, event reminders, and announcements.
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleRequestPermission}
                className="bg-white text-orange-600 hover:bg-gray-100 text-xs px-3 py-1 h-auto"
              >
                <Bell className="w-3 h-3 mr-1" />
                Enable
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 text-xs px-2 py-1 h-auto"
              >
                Not Now
              </Button>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="flex-shrink-0 text-white hover:bg-white/20 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Offline Indicator
export function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium z-40">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        You&apos;re offline. Some features may be limited.
      </div>
    </div>
  );
}



// Combined PWA Manager Component
export function PWAManager() {
  return (
    <>
      <InstallPrompt />
      <UpdateNotification />
      <NetworkStatus />
      <NotificationPrompt />
      <OfflineIndicator />
    </>
  );
}