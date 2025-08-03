'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Info, AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RealTimeNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  duration?: number; // Auto-dismiss after this many milliseconds
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface RealTimeNotificationsProps {
  className?: string;
}

export default function RealTimeNotifications({ className = '' }: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);

  useEffect(() => {
    // Simulate real-time notifications
    const simulateNotifications = () => {
      const mockNotifications: Omit<RealTimeNotification, 'id' | 'timestamp'>[] = [
        {
          title: 'New Competition Alert! 🏆',
          message: 'Web Development Challenge registration is now open!',
          type: 'announcement',
          priority: 'high',
          duration: 8000,
          action: {
            label: 'Register Now',
            onClick: () => console.log('Navigate to competitions')
          }
        },
        {
          title: 'Workshop Starting Soon',
          message: 'AI/ML workshop begins in 15 minutes in Auditorium 2',
          type: 'info',
          priority: 'medium',
          duration: 6000
        },
        {
          title: 'Payment Confirmed ✅',
          message: 'Your registration payment has been successfully processed',
          type: 'success',
          priority: 'low',
          duration: 5000
        },
        {
          title: 'Schedule Update',
          message: 'Lunch break extended by 30 minutes due to high participation',
          type: 'warning',
          priority: 'medium',
          duration: 7000
        },
        {
          title: 'Achievement Unlocked! ⭐',
          message: 'You earned the "Team Player" badge for active participation',
          type: 'success',
          priority: 'low',
          duration: 6000
        }
      ];

      // Add a random notification every 10-30 seconds
      const randomDelay = Math.random() * 20000 + 10000;
      setTimeout(() => {
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
        simulateNotifications(); // Schedule next notification
      }, randomDelay);
    };

    // Start simulation after 5 seconds
    const initialTimeout = setTimeout(simulateNotifications, 5000);

    return () => clearTimeout(initialTimeout);
  }, []);

  const addNotification = (notification: Omit<RealTimeNotification, 'id' | 'timestamp'>) => {
    const newNotification: RealTimeNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-dismiss if duration is specified
    if (notification.duration) {
      setTimeout(() => {
        dismissNotification(newNotification.id);
      }, notification.duration);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'announcement': return <Zap className="w-4 h-4 text-purple-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getNotificationColors = (type: string, priority: string) => {
    const baseColors = {
      info: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
      success: 'from-green-500/20 to-green-600/10 border-green-500/30',
      warning: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
      error: 'from-red-500/20 to-red-600/10 border-red-500/30',
      announcement: 'from-purple-500/20 to-purple-600/10 border-purple-500/30'
    };

    const priorityRing = priority === 'urgent' ? 'ring-2 ring-red-500/50' : 
                       priority === 'high' ? 'ring-1 ring-orange-500/50' : '';

    return `${baseColors[type as keyof typeof baseColors]} ${priorityRing}`;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 space-y-2 max-w-sm ${className}`}>
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 5).map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              delay: index * 0.1 
            }}
            className={`
              bg-gradient-to-r ${getNotificationColors(notification.type, notification.priority)}
              backdrop-blur-sm border rounded-lg p-4 shadow-lg
              hover:shadow-xl transition-all duration-300
              ${notification.priority === 'urgent' ? 'animate-pulse' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-white font-medium text-sm leading-tight">
                    {notification.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    {notification.priority === 'urgent' && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-1">
                        URGENT
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissNotification(notification.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                  
                  {notification.action && (
                    <Button
                      size="sm"
                      onClick={notification.action.onClick}
                      className="h-6 text-xs px-2 bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {notifications.length > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={dismissAll}
            className="bg-gray-800/80 border-gray-600 text-gray-300 hover:text-white text-xs"
          >
            <Check className="w-3 h-3 mr-1" />
            Clear All ({notifications.length})
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Hook for adding notifications from other components
export const useRealTimeNotifications = () => {
  const [notificationComponent, setNotificationComponent] = useState<React.ComponentType | null>(null);

  const addNotification = (notification: Omit<RealTimeNotification, 'id' | 'timestamp'>) => {
    // This would typically dispatch to a global state or context
    console.log('Adding notification:', notification);
  };

  return { addNotification };
};