// Service Worker for Push Notifications
const CACHE_NAME = 'luxe-furniture-v1';
const urlsToCache = [
  '/'
  // '/offline.html' - 파일이 없으므로 제거
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Push event - 푸시 알림 수신
self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  
  const options = {
    body: '새로운 메시지가 도착했습니다.',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/icon-check.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/icon-close.png'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.message || options.body;
    options.data = { ...options.data, ...data };
  }

  event.waitUntil(
    self.registration.showNotification('쓸만한 가', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // 채팅 페이지로 이동
    event.waitUntil(
      clients.openWindow('/mypage/chats')
    );
  } else if (event.action === 'close') {
    // 알림만 닫기
    event.notification.close();
  } else {
    // 기본 동작: 앱 열기
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});


