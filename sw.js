var staticCacheName = 'mws-restaurant-v4';
var contentImgsCache = 'mws-restaurant-imgs-v4';
var allCaches = [
  staticCacheName,
  contentImgsCache
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/dist/production_main.min.js',
        '/dist/production_restaurant.min.js',
        '/css/styles.css',
      ]);
    }),

    caches.open(contentImgsCache).then(function(cache) {
      return cache.addAll([
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg'
      ])
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-') && !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {

    if (requestUrl.pathname.startsWith('/img/')) {
      event.respondWith(servePhoto(event.request));
      return;
    }

    if (requestUrl.pathname.startsWith('/map')) {
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

/* to cache url pathname without param */

// self.addEventListener('fetch', function (event) {
//   url = new URL(event.request.url)
//   event.respondWith(
//     caches.match(url.pathname)
//     .then(function (response) {
//       return response || fetch(event.request);
//     })
//     .catch(err => console.log("Fetch error", err))
//   );
// });

// self.addEventListener('fetch', function(e){
//     //console.log('[ServiceWorker] Fetching', e.request.url);

//     e.respondWith(

//         caches.open(staticCacheName).then(cache => {
//             return cache.match(e.request).then(response => {
//                 // Return response from cache if one exists, otherwise go to network
//                 return (
//                     response ||
//                     fetch(e.request).then(response => {
//                         cache.put(e.request, response.clone());   /*This is the line with the error*/
//                         return response;
//                     })
//                     .catch(function (err) {
//                         console.log("[ServiceWorker]Error fetching and caching", err);
//                     })
//                 );
//             });
//         })
//     );
// })

function servePhoto(request) {
  var storageUrl = request.url.replace(/-\w+\./, '.');
  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}