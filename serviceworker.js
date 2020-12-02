const name = "speed";
  
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(name).then((cache) => {
			return cache.addAll(["/"]);
		})
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});
