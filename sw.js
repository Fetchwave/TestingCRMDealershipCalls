// Fetchwave Revenue Recovery: phone alerts (web push). Keep this file next to index.html.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'Fetchwave', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Fetchwave', {
    body: d.body || '',
    icon: 'icon.png',
    badge: 'icon.png',
    tag: d.lead ? 'lead-' + d.lead : undefined,
    renotify: true,
    requireInteraction: ['missed', 'repeat', 'failed', 'lead'].includes(d.kind),
    data: { url: d.lead ? './#/lead/' + d.lead : './#/' },
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || './', self.registration.scope).href;
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if (c.url.startsWith(self.registration.scope)) { await c.focus(); c.navigate(url); return; } }
    await self.clients.openWindow(url);
  })());
});
