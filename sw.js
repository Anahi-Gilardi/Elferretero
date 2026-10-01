/**
 * El Ferretero - Service Worker v2.0
 * Proporciona soporte offline resiliente, navegación garantizada sin bloqueos,
 * y experiencia PWA móvil de alta velocidad.
 */

const CACHE_NAME = 'el-ferretero-v2.1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './productos.html',
  './contacto.html',
  './electricidad.html',
  './herramienta-seguridad.html',
  './mantenimiento-limpieza.html',
  './mayorista-combos.html',
  './404.html',
  './manifest.json',
  './css/variables.css',
  './css/base.css',
  './css/components.css',
  './css/responsive.css',
  './js/app.js',
  './js/data/categories.js',
  './js/data/products.js',
  './js/modules/catalog.js',
  './img/banners/hero-ferreteria.jpg',
  './img/local/fachada-local.jpg'
];

// Instalación: Pre-cargar recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Usar individualmente para que si uno falla no rompa la instalación
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] No se pudo cachear ${url}:`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpiar cachés antiguas y tomar control inmediatamente
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[SW] Borrando caché obsoleta: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptor de peticiones
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignorar APIs externas, WhatsApp o Vercel analytics
  if (!url.origin.includes(self.location.origin)) return;

  // APIs del backend: Network-first con degradación silenciosa
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline', message: 'Modo sin conexión' }), {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          status: 503
        });
      })
    );
    return;
  }

  // 1. NAVEGACIÓN (Páginas HTML): Network-First
  // Siempre intentar obtener la versión más reciente en línea para evitar páginas desactualizadas.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Si no hay red, buscar en caché
          const cached = await caches.match(event.request);
          if (cached) return cached;

          // Intentar versión .html o limpia
          const pathname = url.pathname;
          const altPath = pathname.endsWith('.html') ? pathname.replace('.html', '') : (pathname + '.html');
          const altCached = await caches.match(altPath) || await caches.match('.' + altPath);
          if (altCached) return altCached;

          // Fallback a página de inicio
          const homeCached = await caches.match('./index.html') || await caches.match('/');
          if (homeCached) return homeCached;

          // Fallback final a 404
          const notFoundCached = await caches.match('./404.html');
          if (notFoundCached) return notFoundCached;

          return new Response(
            '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Sin conexión</title></head><body style="font-family:sans-serif;text-align:center;padding:40px;"><h1>El Ferretero Río Cuarto</h1><p>No tienes conexión a internet en este momento. Por favor verifica tu red y recarga la página.</p><a href="/">Reintentar</a></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 200 }
          );
        })
    );
    return;
  }

  // 2. RECURSOS ESTÁTICOS (CSS, JS, Imágenes, Fuentes): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => null);

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetchPromise.then((networkResponse) => {
        if (networkResponse) return networkResponse;
        return new Response('', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
