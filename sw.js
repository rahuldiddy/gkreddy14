/* Service worker: makes the app installable and quick to reopen.
   Bump VERSION whenever you deploy changes so visitors get the update. */
const VERSION = "portfolio-v1.2";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/js/config.js", "./assets/js/properties.js", "./assets/js/placeholders.js",
  "./assets/js/components.js", "./assets/js/app.js",
  "./icons/icon-192.png", "./icons/favicon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first (so edits to property data show up right away), cache as offline fallback.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
