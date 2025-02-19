// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache-v1').then((cache) => {
        return cache.addAll([
          '/',               // Root page
          '/index.html',     // Main HTML file
          '/index.js',       // JavaScript file
          '/index.css',      // CSS file
          '/favicon.ico',    // Favicon
          '/icon.png',       // Icon file
          '/manifest.json',  // Manifest file
        ]);
      })
    );
  });
  
  // eslint-disable-next-line no-restricted-globals
  self.addEventListener('activate', (event) => {
    console.log('Service Worker Activated');
  });
  
  // eslint-disable-next-line no-restricted-globals
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;  // Return from cache if available
        } else {
          return fetch(event.request); // Otherwise, fetch from network
        }
      })
    );
  });
  