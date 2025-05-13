const CACHE = "pivot-cache-v1";
const ASSETS = [
  "index.html", "style.css", "manifest.json",
  "modified.html", "camarilla.html", "history.html",
  "modified.js", "camarilla.js", "history.js", "register-sw.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
