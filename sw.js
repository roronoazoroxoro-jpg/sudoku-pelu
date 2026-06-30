const CACHE = 'sudoku-pelu-v4';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './config.js',
  './manifest.webmanifest',
  './icons/icon.svg',
];

const NETWORK_FIRST = /\.(html|css|js)$|\/$/;

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!url.origin.startsWith(self.location.origin)) return;

  const path = url.pathname;
  const isAppFile = NETWORK_FIRST.test(path) || path.endsWith('/');

  if (isAppFile) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
