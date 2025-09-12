// Enhanced Service Worker for Herman Kwayu Consulting Website
// Version 3.0 - Comprehensive PWA Support

const CACHE_NAME = 'hermankwayu-consulting-v3';
const RUNTIME_CACHE = 'hermankwayu-runtime-v3';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml'
];

const PRECACHE_URLS = [
  '/',
  '/#about',
  '/#services', 
  '/#contact',
  '/resume-builder',
  '/unsubscribe'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
      caches.open(RUNTIME_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => 
            cacheName.startsWith('herman') && 
            cacheName !== CACHE_NAME && 
            cacheName !== RUNTIME_CACHE
          )
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Strategy for HTML pages - Network First, fallback to cache
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  // Strategy for static assets - Cache First
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'manifest') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Strategy for images - Cache First with expiration
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Check if cached image is older than 7 days
          const cachedDate = new Date(cachedResponse.headers.get('date'));
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          
          if (cachedDate > weekAgo) {
            return cachedResponse;
          }
        }
        
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => cachedResponse);
      })
    );
    return;
  }

  // Strategy for API calls - Network First
  if (url.pathname.includes('/api/') || url.pathname.includes('/functions/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200 && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          if (request.method === 'GET') {
            return caches.match(request);
          }
          return new Response('Network error occurred', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
  if (event.tag === 'newsletter-form-sync') {
    event.waitUntil(syncNewsletterForm());
  }
});

// Sync functions
async function syncContactForm() {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const pendingRequests = await cache.keys();
    
    for (const request of pendingRequests) {
      if (request.url.includes('contact-sync')) {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.log('Failed to sync contact form:', error);
        }
      }
    }
  } catch (error) {
    console.log('Contact sync error:', error);
  }
}

async function syncNewsletterForm() {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const pendingRequests = await cache.keys();
    
    for (const request of pendingRequests) {
      if (request.url.includes('newsletter-sync')) {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.log('Failed to sync newsletter form:', error);
        }
      }
    }
  } catch (error) {
    console.log('Newsletter sync error:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore', 
          title: 'View Details',
          icon: '/icon-96x96.png'
        },
        {
          action: 'close', 
          title: 'Close',
          icon: '/icon-96x96.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('Herman Kwayu Consulting', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for offline functionality
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_FORM_DATA') {
    // Store form data for offline submission
    const formData = event.data.payload;
    console.log('Caching form data for offline sync:', formData);
  }
});