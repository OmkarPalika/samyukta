// Service Worker for Samyukta 2025
// Auto-generate version based on timestamp for automatic updates
const CACHE_VERSION = '2025-08-03-2209'; // Update this with each deployment
const CACHE_NAME = `samyukta-2025-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `samyukta-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `samyukta-dynamic-${CACHE_VERSION}`;

console.log(`Service Worker: Cache version ${CACHE_VERSION}`);

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/logo.png',
  '/offline.html',
  '/manifest.webmanifest'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^\/api\/auth\/me$/,
  /^\/api\/dashboard\/stats$/,
  /^\/api\/events$/,
  /^\/api\/registrations\/stats$/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(async (cache) => {
        console.log('Service Worker: Caching static assets');
        
        // Cache assets individually to handle failures gracefully
        const cachePromises = STATIC_ASSETS.map(async (asset) => {
          try {
            await cache.add(asset);
            console.log(`Service Worker: Cached ${asset}`);
          } catch (error) {
            console.warn(`Service Worker: Failed to cache ${asset}:`, error);
          }
        });
        
        await Promise.allSettled(cachePromises);
        console.log('Service Worker: Static assets caching completed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to open cache', error);
        return self.skipWaiting(); // Continue installation even if caching fails
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        const currentCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, CACHE_NAME];
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete any cache that doesn't match current version
            if (!currentCaches.includes(cacheName) && 
                (cacheName.startsWith('samyukta-') || cacheName.startsWith('samyukta-2025-'))) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated and old caches cleaned');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$/)) {
    event.respondWith(handleStaticAssets(request));
  } else {
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check if this API should be cached
  const shouldCache = API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
  
  if (!shouldCache) {
    // For non-cacheable APIs, just fetch from network
    try {
      return await fetch(request);
    } catch (error) {
      console.error('API request failed:', error);
      return new Response(JSON.stringify({ error: 'Network error' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache for:', request.url);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return error response if no cache available
    return new Response(JSON.stringify({ 
      error: 'Offline - data not available',
      offline: true 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch static asset:', error);
    
    // Return a fallback for images
    if (request.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af">Image unavailable</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Handle page requests with network-first, fallback to cache
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for page, trying cache:', request.url);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any queued requests when connection is restored
  console.log('Service Worker: Handling background sync');
  
  // You can implement request queuing here
  // For now, just log that sync happened
  
  // Notify clients that connection is restored
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_COMPLETE',
      message: 'Connection restored'
    });
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received', event);
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'Samyukta 2025',
        body: event.data.text() || 'New notification',
        icon: '/logo.png',
        badge: '/logo.png'
      };
    }
  }

  const options = {
    body: notificationData.body || 'New notification from Samyukta 2025',
    icon: notificationData.icon || '/logo.png',
    badge: notificationData.badge || '/logo.png',
    tag: notificationData.tag || 'samyukta-notification',
    data: notificationData.data || { url: '/dashboard/participant/notifications' },
    actions: notificationData.actions || [
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
    ],
    requireInteraction: notificationData.requireInteraction || false,
    silent: notificationData.silent || false,
    vibrate: notificationData.vibrate || [200, 100, 200],
    timestamp: Date.now()
  };
  
  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'Samyukta 2025',
      options
    )
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  const action = event.action;
  const notificationData = event.notification.data;

  if (action === 'dismiss') {
    // Just close the notification
    return;
  }

  // Handle notification click
  const urlToOpen = action === 'view' && notificationData.url 
    ? notificationData.url 
    : notificationData.url || '/dashboard/participant/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }

        // If no existing window/tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE_NAME)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
});