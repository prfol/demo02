// Importa las librerías de Workbox desde una CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (workbox) {
    console.log(`¡Yay! Workbox está cargado 🎉`);

    // Configuración de depuración (opcional)
    // workbox.core.set
    workbox.core.setLogLevel(workbox.core.LOG_LEVEL.debug);

    // Precaching de recursos estáticos básicos
    // Puedes añadir manualmente archivos específicos que quieras precachear.
    // Aunque el objetivo es la caché automática, la página principal y el manifest son esenciales.
    workbox.precaching.precacheAndRoute([
        { url: 'https://prfol.github.io/demo02/', revision: '1' },
        { url: 'https://prfol.github.io/demo02/index.html', revision: '1' },
        { url: 'https://prfol.github.io/demo02/manifest.json', revision: '1' },
    ]);

    // Estrategia de caché para los activos de la página (CSS, JS, imágenes, etc.)
    // Esta es la parte clave para la caché automática de contenido
    workbox.routing.registerRoute(
        // Expresión regular que coincide con todas las solicitudes de la misma "origin"
        // y excluye las solicitudes de la extensión Chrome y otros tipos específicos.
        ({ request }) => request.destination === 'document' ||
                         request.destination === 'script' ||
                         request.destination === 'style' ||
                         request.destination === 'image' ||
                         request.destination === 'font',
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'mi-pwa-cache-v1',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    // Cacha hasta 50 activos diferentes.
                    maxEntries: 50,
                    // Los activos expirarán después de 30 días.
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200], // Almacena respuestas con estado 0 (opaque) o 200 (OK)
                }),
            ],
        })
    );

    // Estrategia de caché para otras solicitudes (ej. APIs, si las hubiera)
    // Para cualquier otra ruta que no sea estática y que quieras cachear
    workbox.routing.registerRoute(
        ({ url }) => url.origin === self.location.origin, // Coincide con todas las peticiones del mismo origen
        new workbox.strategies.NetworkFirst({
            cacheName: 'mi-pwa-dynamic-cache-v1',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 20,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 días
                }),
            ],
        })
    );

    // Opcional: Caché de Google Fonts
    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
        })
    );

    workbox.routing.registerRoute(
        /^https:\/\/fonts\.gstatic\.com/,
        new workbox.strategies.CacheFirst({
            cacheName: 'google-fonts-webfonts',
            plugins: [
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.ExpirationPlugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
                    maxEntries: 30,
                }),
            ],
        })
    );

} else {
    console.log(`¡Boo! Workbox no se pudo cargar 😬`);
}