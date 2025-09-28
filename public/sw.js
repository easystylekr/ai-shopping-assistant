const CACHE_NAME = 'ai-shopping-assistant-v1.0.0';
const RUNTIME = 'runtime';

// Essential files to cache for offline functionality
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other static assets as needed
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch Strategy: Network First, falling back to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests differently
  if (event.request.url.includes('/api/') || event.request.url.includes('gemini')) {
    // Network only for API requests
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return a custom offline response for API failures
        return new Response(
          JSON.stringify({
            error: '오프라인 상태입니다. 인터넷 연결을 확인해주세요.',
            offline: true
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      })
    );
    return;
  }

  // For other requests, use network first strategy
  event.respondWith(
    caches.open(RUNTIME).then(async (cache) => {
      try {
        // Try network first
        const networkResponse = await fetch(event.request);

        // Cache successful responses
        if (networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // Network failed, try cache
        console.log('Network failed, trying cache for:', event.request.url);

        const cacheResponse = await cache.match(event.request);
        if (cacheResponse) {
          return cacheResponse;
        }

        // Check static cache as fallback
        const staticResponse = await caches.match(event.request);
        if (staticResponse) {
          return staticResponse;
        }

        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          const offlineResponse = await caches.match('/');
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // Final fallback
        return new Response(
          '오프라인 상태입니다. 인터넷 연결을 확인해주세요.',
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
              'Content-Type': 'text/plain; charset=utf-8'
            }
          }
        );
      }
    })
  );
});

// Background Sync for offline message queue
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle queued messages when back online
  try {
    const offlineActions = await getOfflineActions();

    for (const action of offlineActions) {
      try {
        await processOfflineAction(action);
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error('Failed to process offline action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getOfflineActions() {
  // Get queued actions from IndexedDB
  return new Promise((resolve) => {
    const request = indexedDB.open('ai-shopping-offline', 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['actions'], 'readonly');
      const store = transaction.objectStore('actions');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || []);
      };

      getAllRequest.onerror = () => {
        resolve([]);
      };
    };

    request.onerror = () => {
      resolve([]);
    };
  });
}

async function processOfflineAction(action) {
  // Process queued action (e.g., send message, purchase request)
  const response = await fetch(action.url, {
    method: action.method || 'POST',
    headers: action.headers || { 'Content-Type': 'application/json' },
    body: action.body
  });

  if (!response.ok) {
    throw new Error(`Failed to process action: ${response.status}`);
  }

  return response;
}

async function removeOfflineAction(actionId) {
  // Remove processed action from IndexedDB
  return new Promise((resolve) => {
    const request = indexedDB.open('ai-shopping-offline', 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['actions'], 'readwrite');
      const store = transaction.objectStore('actions');

      const deleteRequest = store.delete(actionId);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => resolve();
    };

    request.onerror = () => resolve();
  });
}

// Push Notifications (for future implementation)
self.addEventListener('push', (event) => {
  console.log('Push message received');

  const options = {
    body: event.data ? event.data.text() : '새로운 상품 추천이 있습니다!',
    icon: '/pwa-icon-192.png',
    badge: '/pwa-icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/pwa-icon-192.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('AI 쇼핑 어시스턴트', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received.');

  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      default:
        console.log('Unknown message type:', event.data.type);
    }
  }
});

console.log('Service Worker loaded successfully');