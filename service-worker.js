const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css', // Archivo CSS de tu página
  './script.js', // Archivo JavaScript de tu página (si tienes)
  './images/icon-192x192.png',
  './images/icon-512x512.png'
  // Agrega aquí todas las URLs de los recursos que quieres cachear
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el recurso está en caché, lo devuelve
        if (response) {
          return response;
        }
        // Si no está en caché, intenta obtenerlo de la red
        return fetch(event.request)
          .catch(() => {
            // Esto es útil para páginas sin conexión, puedes devolver una página offline.html
            // return caches.match('./offline.html');
            console.log('Offline: No resource found in cache or network failed.');
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});