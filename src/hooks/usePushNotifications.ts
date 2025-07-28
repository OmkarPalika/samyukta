import { useState, useEffect, useCallback } from 'react';
import { pushNotificationClient } from '@/lib/push-notification-client';
import { toast } from 'sonner';

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  subscription: PushSubscription | null;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
    isLoading: true,
    subscription: null
  });

  // Initialize push notifications
  const initialize = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const isSupported = await pushNotificationClient.initialize();
      const permission = Notification.permission;
      const subscription = await pushNotificationClient.getSubscription();
      const isSubscribed = subscription !== null;

      setState({
        isSupported,
        permission,
        isSubscribed,
        isLoading: false,
        subscription
      });
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isSupported: false
      }));
    }
  }, []);

  // Request permission and subscribe
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Request permission
      const permission = await pushNotificationClient.requestPermission();
      
      if (permission !== 'granted') {
        toast.error('Push notification permission denied');
        setState(prev => ({ 
          ...prev, 
          permission, 
          isLoading: false 
        }));
        return false;
      }

      // Subscribe to push notifications
      const subscription = await pushNotificationClient.subscribe();
      
      if (subscription) {
        setState(prev => ({
          ...prev,
          permission,
          isSubscribed: true,
          subscription,
          isLoading: false
        }));
        toast.success('Push notifications enabled successfully');
        return true;
      } else {
        toast.error('Failed to enable push notifications');
        setState(prev => ({ 
          ...prev, 
          permission, 
          isLoading: false 
        }));
        return false;
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      toast.error('Failed to enable push notifications');
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, [state.isSupported]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const success = await pushNotificationClient.unsubscribe();
      
      if (success) {
        setState(prev => ({
          ...prev,
          isSubscribed: false,
          subscription: null,
          isLoading: false
        }));
        toast.success('Push notifications disabled');
        return true;
      } else {
        toast.error('Failed to disable push notifications');
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      toast.error('Failed to disable push notifications');
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  // Toggle subscription
  const toggle = useCallback(async (): Promise<boolean> => {
    if (state.isSubscribed) {
      return await unsubscribe();
    } else {
      return await subscribe();
    }
  }, [state.isSubscribed, subscribe, unsubscribe]);

  // Test notification
  const testNotification = useCallback(async () => {
    if (state.permission === 'granted') {
      await pushNotificationClient.showTestNotification();
      toast.success('Test notification sent');
    } else {
      toast.error('Push notification permission not granted');
    }
  }, [state.permission]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    ...state,
    subscribe,
    unsubscribe,
    toggle,
    testNotification,
    refresh: initialize
  };
}