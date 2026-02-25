const CACHE = "kmb-eta-pwa-v1";
const ASSETS = ["./", "./index.html", "./manifest.json", "./sw.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null)))
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Cache-first for local files; network-first for API calls
  if (ASSETS.includes(url.pathname) || url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});