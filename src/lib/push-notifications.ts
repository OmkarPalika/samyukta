// Push notification service for mobile users

interface PushNotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string;
  icon?: string;
  badge?: string;
  tag?: string;
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class PushNotificationService {
  private vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || '',
    privateKey: process.env.VAPID_PRIVATE_KEY || '',
    subject: process.env.VAPID_SUBJECT || 'mailto:samyukta.summit@gmail.com'
  };

  async sendPushNotification(
    subscription: PushSubscription,
    data: PushNotificationData
  ): Promise<boolean> {
    try {
      // Import web-push dynamically to avoid issues in client-side code
      const webpush = await import('web-push');
      
      webpush.default.setVapidDetails(
        this.vapidKeys.subject,
        this.vapidKeys.publicKey,
        this.vapidKeys.privateKey
      );

      const payload = JSON.stringify({
        title: data.title,
        body: data.message,
        icon: data.icon || '/icons/notification-icon.png',
        badge: data.badge || '/icons/badge-icon.png',
        tag: data.tag || 'samyukta-notification',
        data: {
          url: data.action_url || '/',
          type: data.type,
          priority: data.priority,
          timestamp: Date.now()
        },
        actions: data.action_url ? [
          {
            action: 'view',
            title: 'View',
            icon: '/icons/view-icon.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/icons/dismiss-icon.png'
          }
        ] : [],
        requireInteraction: data.priority === 'urgent' || data.priority === 'high',
        silent: data.priority === 'low'
      });

      const options = {
        TTL: 24 * 60 * 60, // 24 hours
        urgency: this.getUrgencyLevel(data.priority),
        headers: {}
      };

      await webpush.default.sendNotification(subscription, payload, options);
      return true;
    } catch (error) {
      console.error('Failed to send push notification:', error);
      return false;
    }
  }

  async sendBulkPushNotifications(
    subscriptions: PushSubscription[],
    data: PushNotificationData
  ): Promise<{ successful: number; failed: number }> {
    let successful = 0;
    let failed = 0;

    const promises = subscriptions.map(async (subscription) => {
      const result = await this.sendPushNotification(subscription, data);
      if (result) {
        successful++;
      } else {
        failed++;
      }
    });

    await Promise.allSettled(promises);

    return { successful, failed };
  }

  private getUrgencyLevel(priority: string): 'very-low' | 'low' | 'normal' | 'high' {
    switch (priority) {
      case 'urgent': return 'high';
      case 'high': return 'high';
      case 'medium': return 'normal';
      case 'low': return 'low';
      default: return 'normal';
    }
  }

  async generateVapidKeys() {
    // This is a utility function for generating VAPID keys
    // Should only be used during setup
    try {
      const webpush = await import('web-push');
      return webpush.generateVAPIDKeys();
    } catch (error) {
      console.error('Failed to generate VAPID keys:', error);
      return null;
    }
  }
}

export const pushNotificationService = new PushNotificationService();