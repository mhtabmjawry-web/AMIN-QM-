// Service Worker برای آزمون‌ساز حرفه‌ای AMIN QM
// نسخه: 3.6.5

const CACHE_NAME = 'amin-qm-cache-v3.6.5';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/toastify-js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// نصب Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] در حال نصب...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] کش کردن فایل‌های ضروری');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] نصب کامل شد');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] خطا در نصب:', error);
      })
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] در حال فعال‌سازی...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] حذف کش قدیمی:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] فعال‌سازی کامل شد');
      return self.clients.claim();
    })
  );
});

// مدیریت درخواست‌ها
self.addEventListener('fetch', event => {
  // فقط درخواست‌های GET را مدیریت کن
  if (event.request.method !== 'GET') return;
  
  // برای درخواست‌های navigate (صفحه‌ها)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // ذخیره در کش برای استفاده‌های بعدی
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // اگر آفلاین هستیم، از کش استفاده کن
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/index.html');
            });
        })
    );
    return;
  }
  
  // برای درخواست‌های عادی
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // اگر در کش پیدا شد، از آن استفاده کن
        if (response) {
          return response;
        }
        
        // اگر در کش نبود، از شبکه بگیر
        return fetch(event.request)
          .then(response => {
            // فقط پاسخ‌های موفق را کش کن
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // پاسخ را برای استفاده‌های بعدی کش کن
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // اگر شبکه در دسترس نبود و درخواست تصویر بود، جایگزین نشان بده
            if (event.request.destination === 'image') {
              return caches.match('/images/placeholder.png');
            }
            return null;
          });
      })
  );
});

// همگام‌سازی پس‌زمینه (Background Sync)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-quiz-data') {
    console.log('[Service Worker] همگام‌سازی داده‌های آزمون...');
    event.waitUntil(syncQuizData());
  }
});

// دریافت پیام‌ها
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// دریافت Push Notification
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'آزمون جدید آماده است!',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'view',
        title: 'مشاهده'
      },
      {
        action: 'close',
        title: 'بستن'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'آزمون‌ساز AMIN QM', options)
  );
});

// کلیک بر روی Notification
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification کلیک شد:', event.notification.tag);
  event.notification.close();
  
  if (event.action === 'view') {
    // کاربر روی "مشاهده" کلیک کرده
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then(clientList => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// تابع همگام‌سازی داده‌ها
function syncQuizData() {
  return new Promise((resolve, reject) => {
    // اینجا می‌توانید داده‌های ذخیره شده محلی را به سرور ارسال کنید
    console.log('[Service Worker] در حال همگام‌سازی داده‌ها...');
    resolve();
  });
}

// تابع آفلاین ماندن
function handleOffline(event) {
  console.log('[Service Worker] حالت آفلاین فعال است');
  
  // اگر درخواست صفحه اصلی است، صفحه آفلاین را نشان بده
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(response => {
        return response || fetch(event.request);
      })
    );
  }
  
  // برای سایر درخواست‌ها از کش استفاده کن
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
}

// مدیریت خطاها
self.addEventListener('error', event => {
  console.error('[Service Worker] خطا:', event.error);
});

// ثبت Service Worker موفق
console.log('[Service Worker] AMIN QM Service Worker v3.6.5 فعال شد');