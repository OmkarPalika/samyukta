'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

// PWA utilities for Samyukta 2025

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Check if app is already installed
    this.checkInstallStatus();

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyInstallAvailable();
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifyInstalled();
    });

    // Register service worker
    this.registerServiceWorker();

    // Handle online/offline status
    this.setupNetworkListeners();
  }

  private checkInstallStatus() {
    // Check if running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }

    // Check if running as PWA on iOS
    if ((window.navigator as any).standalone === true) {
      this.isInstalled = true;
    }
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        this.serviceWorkerRegistration = registration;

        console.log('Service Worker registered successfully:', registration);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.notifyUpdateAvailable();
              }
            });
          }
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data);
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.notifyNetworkStatus(true);
    });

    window.addEventListener('offline', () => {
      this.notifyNetworkStatus(false);
    });
  }

  private handleServiceWorkerMessage(data: any) {
    switch (data.type) {
      case 'SYNC_COMPLETE':
        this.notifyNetworkStatus(true);
        break;
      case 'CACHE_UPDATED':
        console.log('Cache updated:', data.message);
        break;
    }
  }

  // Public methods
  public async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during app installation:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  public isInstallable(): boolean {
    return this.deferredPrompt !== null;
  }

  public isAppInstalled(): boolean {
    return this.isInstalled;
  }

  public async updateServiceWorker(): Promise<void> {
    if (this.serviceWorkerRegistration) {
      await this.serviceWorkerRegistration.update();
    }
  }

  public async skipWaiting(): Promise<void> {
    if (this.serviceWorkerRegistration?.waiting) {
      this.serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  public async cacheUrls(urls: string[]): Promise<void> {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_URLS',
        urls,
      });
    }
  }

  public getNetworkStatus(): boolean {
    return navigator.onLine;
  }

  // Event notifications (can be overridden)
  private notifyInstallAvailable() {
    window.dispatchEvent(new CustomEvent('pwa:installAvailable'));
  }

  private notifyInstalled() {
    window.dispatchEvent(new CustomEvent('pwa:installed'));
  }

  private notifyUpdateAvailable() {
    window.dispatchEvent(new CustomEvent('pwa:updateAvailable'));
  }

  private notifyNetworkStatus(isOnline: boolean) {
    window.dispatchEvent(new CustomEvent('pwa:networkStatus', {
      detail: { isOnline }
    }));
  }
}

// Singleton instance
export const pwaManager = new PWAManager();

// React hooks for PWA functionality
export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Initial states
    setIsInstallable(pwaManager.isInstallable());
    setIsInstalled(pwaManager.isAppInstalled());
    setIsOnline(pwaManager.getNetworkStatus());

    // Event listeners
    const handleInstallAvailable = () => setIsInstallable(true);
    const handleInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };
    const handleUpdateAvailable = () => setUpdateAvailable(true);
    const handleNetworkStatus = (event: CustomEvent) => {
      setIsOnline(event.detail.isOnline);
    };

    window.addEventListener('pwa:installAvailable', handleInstallAvailable);
    window.addEventListener('pwa:installed', handleInstalled);
    window.addEventListener('pwa:updateAvailable', handleUpdateAvailable);
    window.addEventListener('pwa:networkStatus', handleNetworkStatus as EventListener);

    return () => {
      window.removeEventListener('pwa:installAvailable', handleInstallAvailable);
      window.removeEventListener('pwa:installed', handleInstalled);
      window.removeEventListener('pwa:updateAvailable', handleUpdateAvailable);
      window.removeEventListener('pwa:networkStatus', handleNetworkStatus as EventListener);
    };
  }, []);

  const installApp = async () => {
    const success = await pwaManager.installApp();
    if (success) {
      setIsInstallable(false);
    }
    return success;
  };

  const updateApp = async () => {
    await pwaManager.skipWaiting();
    setUpdateAvailable(false);
    window.location.reload();
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    installApp,
    updateApp,
    cacheUrls: pwaManager.cacheUrls.bind(pwaManager),
  };
}

// Utility functions
export function getInstallPromptText(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('android')) {
    return 'Add Samyukta 2025 to your home screen for quick access!';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'Install Samyukta 2025: Tap the share button and select "Add to Home Screen"';
  } else {
    return 'Install Samyukta 2025 app for the best experience!';
  }
}

export function canInstall(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

// Push notification utilities
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!pwaManager['serviceWorkerRegistration']) {
    console.error('Service Worker not registered');
    return null;
  }

  try {
    const subscription = await pwaManager['serviceWorkerRegistration'].pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    console.log('Push subscription successful:', subscription);
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}