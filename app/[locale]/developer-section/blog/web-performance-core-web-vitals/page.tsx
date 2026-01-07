"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { BlogContentLayout } from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function WebPerformanceCoreWebVitalsPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Web Performance & Core Web Vitals</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Web Performance & Core Web Vitals
        </Heading>
        <Text className={styles.subtitle}>
          Master web performance optimization. Learn Critical Rendering Path optimization, resource hints (prefetch, preload), Service Workers & PWA, Web Workers for heavy computation, image optimization strategies, and font loading optimization used by senior engineers.
        </Text>
      </div>

      {/* Critical Rendering Path */}
      <section id="critical-rendering-path" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. Critical Rendering Path Optimization
              </Heading>
              <Text className={styles.sectionDescription}>
                Optimize the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on the screen.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Critical Rendering Path Steps:</strong>
                <br />1. HTML → DOM (Document Object Model)
                <br />2. CSS → CSSOM (CSS Object Model)
                <br />3. DOM + CSSOM → Render Tree
                <br />4. Layout (Reflow) → Calculate positions
                <br />5. Paint → Fill pixels
                <br />6. Composite → Layer composition
              </Text>
            </div>

            <CodeComparison
              language="html"
              wrong={`<!-- ❌ BAD: Blocking render -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="heavy-stylesheet.css">
  <script src="blocking-script.js"></script>
</head>
<body>
  <h1>Content</h1>
</body>
</html>`}
              good={`<!-- ✅ GOOD: Non-blocking, optimized -->
<!DOCTYPE html>
<html>
<head>
  <!-- Inline critical CSS -->
  <style>
    /* Critical above-the-fold styles */
    body { margin: 0; font-family: system-ui; }
    .header { height: 60px; background: #fff; }
  </style>
  <!-- Preload important resources -->
  <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="hero-image.jpg" as="image">
  <!-- Defer non-critical CSS -->
  <link rel="preload" href="non-critical.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="non-critical.css"></noscript>
</head>
<body>
  <h1>Content</h1>
  <!-- Defer non-critical scripts -->
  <script src="non-critical.js" defer></script>
</body>
</html>`}
            />

            <CodeEditor
              code={`// ✅ Critical CSS Extraction (Next.js)
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true
  }
};

// ✅ Inline Critical CSS (React)
import { useState, useEffect } from 'react';

function App() {
  useEffect(() => {
    // Load non-critical CSS after initial render
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/non-critical.css';
    document.head.appendChild(link);
  }, []);
  
  return (
    <div>
      {/* Critical content rendered immediately */}
      <header className="critical-header">Header</header>
      <main>Content</main>
    </div>
  );
}

// ✅ Optimize CSS Delivery
// 1. Extract critical CSS
// 2. Inline critical CSS in <head>
// 3. Load non-critical CSS asynchronously

// Critical CSS (inline in <head>)
const criticalCSS = \`
  body { margin: 0; font-family: system-ui; }
  .header { height: 60px; background: #fff; }
  .hero { height: 400px; background: #f0f0f0; }
\`;

// ✅ Minimize Render-Blocking Resources
function optimizeRenderBlocking() {
  // 1. Minimize CSS
  // - Remove unused CSS
  // - Minify CSS
  // - Use CSS containment
  
  // 2. Minimize JavaScript
  // - Code splitting
  // - Tree shaking
  // - Minification
  
  // 3. Optimize fonts
  // - Use font-display: swap
  // - Preload font files
  // - Subset fonts
}

// ✅ CSS Containment (Isolate rendering)
// Isolate parts of the page to prevent layout thrashing
const containedStyles = \`
  .widget {
    contain: layout style paint;
    /* Browser can optimize rendering of this element */
  }
  
  .isolated-component {
    contain: strict;
    /* Complete isolation - no external influence */
  }
\`;

// ✅ Reduce Layout Shifts
// 1. Set explicit dimensions for images
<img 
  src="image.jpg" 
  width={800} 
  height={600}
  alt="Description"
  style={{ aspectRatio: '800/600' }}
/>

// 2. Reserve space for dynamic content
<div style={{ minHeight: '200px' }}>
  {loading ? <Skeleton /> : <Content />}
</div>

// 3. Use aspect-ratio CSS
.image-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}

// ✅ Optimize JavaScript Execution
// 1. Defer non-critical scripts
<script src="analytics.js" defer></script>

// 2. Use async for independent scripts
<script src="widget.js" async></script>

// 3. Code splitting
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false // If not needed for SSR
});

// ✅ Measure Critical Rendering Path
function measureCRP() {
  const perfData = performance.getEntriesByType('navigation')[0];
  
  console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd);
  console.log('Load Complete:', perfData.loadEventEnd);
  
  // Measure paint timing
  const paintMetrics = performance.getEntriesByType('paint');
  paintMetrics.forEach(metric => {
    console.log(\`\${metric.name}: \${metric.startTime}ms\`);
  });
  
  // Measure layout shifts
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        console.log('Layout Shift:', entry.value);
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Resource Hints */}
      <section id="resource-hints" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Resource Hints (prefetch, preload)
              </Heading>
              <Text className={styles.sectionDescription}>
                Use resource hints to optimize resource loading and improve perceived performance.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Resource Hints Guide

// 1. preload - High priority resource needed soon
<link 
  rel="preload" 
  href="/font.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin="anonymous"
/>

<link 
  rel="preload" 
  href="/critical.css" 
  as="style"
/>

<link 
  rel="preload" 
  href="/hero-image.jpg" 
  as="image"
/>

// 2. prefetch - Low priority resource for next navigation
<link 
  rel="prefetch" 
  href="/next-page.js"
/>

<link 
  rel="prefetch" 
  href="/next-page-data.json"
/>

// 3. preconnect - Establish early connection
<link 
  rel="preconnect" 
  href="https://api.example.com"
/>

<link 
  rel="preconnect" 
  href="https://fonts.googleapis.com"
  crossorigin
/>

// 4. dns-prefetch - Resolve DNS early
<link 
  rel="dns-prefetch" 
  href="https://cdn.example.com"
/>

// ✅ React/Next.js Resource Hints
import Head from 'next/head';

function MyPage() {
  return (
    <>
      <Head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/hero.jpg"
          as="image"
        />
        
        {/* Preconnect to external domains */}
        <link
          rel="preconnect"
          href="https://api.example.com"
        />
        <link
          rel="dns-prefetch"
          href="https://cdn.example.com"
        />
        
        {/* Prefetch next page resources */}
        <link
          rel="prefetch"
          href="/api/user-data"
        />
      </Head>
      {/* Page content */}
    </>
  );
}

// ✅ Programmatic Resource Hints
function preloadResource(url: string, as: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

function prefetchResource(url: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

// ✅ Smart Prefetching (Next.js)
// Prefetch on hover or when link is visible
import Link from 'next/link';

function SmartLink({ href, children }: { href: string; children: React.ReactNode }) {
  const handleMouseEnter = () => {
    // Prefetch on hover
    prefetchResource(href);
  };
  
  return (
    <Link 
      href={href}
      onMouseEnter={handleMouseEnter}
      prefetch={true} // Next.js automatic prefetch
    >
      {children}
    </Link>
  );
}

// ✅ Intersection Observer for Prefetching
function usePrefetchOnVisible(href: string) {
  const ref = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            prefetchResource(href);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' } // Start prefetching 50px before visible
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [href]);
  
  return ref;
}

// ✅ Resource Priority Hints
// Hint to browser about resource priority
<link 
  rel="preload" 
  href="/critical.js" 
  as="script"
  fetchpriority="high"
/>

<img 
  src="hero.jpg" 
  fetchpriority="high"
  loading="eager"
/>

<img 
  src="below-fold.jpg" 
  fetchpriority="low"
  loading="lazy"
/>

// ✅ Module Preload (ES Modules)
<link 
  rel="modulepreload" 
  href="/module.js"
/>

// ✅ When to Use Each Hint
const resourceHintsGuide = {
  preload: {
    when: 'Resource is critical and needed soon',
    examples: [
      'Critical fonts',
      'Above-the-fold images',
      'Critical CSS',
      'Critical JavaScript'
    ],
    priority: 'High'
  },
  
  prefetch: {
    when: 'Resource likely needed for next navigation',
    examples: [
      'Next page JavaScript',
      'Next page data',
      'Related images'
    ],
    priority: 'Low'
  },
  
  preconnect: {
    when: 'Will make requests to external domain soon',
    examples: [
      'API endpoints',
      'CDN domains',
      'Third-party services'
    ],
    priority: 'Medium'
  },
  
  dnsPrefetch: {
    when: 'Will connect to external domain (lower priority)',
    examples: [
      'Analytics domains',
      'Social media widgets',
      'CDN domains'
    ],
    priority: 'Low'
  }
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Service Workers & PWA */}
      <section id="service-workers-pwa" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Service Workers & PWA
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement Service Workers for offline functionality, caching strategies, and Progressive Web App features.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Service Worker Registration
// public/sw.js

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

// ✅ Service Worker Implementation
// sw.js

const CACHE_NAME = 'my-app-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Take control immediately
});

// ✅ Cache Strategies

// 1. Cache First (Static assets)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/static/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  }
});

// 2. Network First (API requests)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// 3. Stale While Revalidate (Best of both)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(RUNTIME_CACHE).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// ✅ Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  const pendingRequests = await getPendingRequests();
  
  for (const request of pendingRequests) {
    try {
      await fetch(request.url, {
        method: request.method,
        body: request.body
      });
      await markRequestAsSynced(request.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}

// ✅ Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// ✅ PWA Manifest
// public/manifest.json
{
  "name": "My Progressive Web App",
  "short_name": "MyApp",
  "description": "A progressive web application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshot-wide.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "categories": ["productivity", "utilities"],
  "shortcuts": [
    {
      "name": "New Item",
      "short_name": "New",
      "description": "Create a new item",
      "url": "/new",
      "icons": [{ "src": "/icon-new.png", "sizes": "96x96" }]
    }
  ]
}

// ✅ Install Prompt (PWA)
function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);
  
  const install = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted install');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };
  
  return { isInstallable, install };
}

// Usage
function InstallButton() {
  const { isInstallable, install } = usePWAInstall();
  
  if (!isInstallable) return null;
  
  return <button onClick={install}>Install App</button>;
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Web Workers */}
      <section id="web-workers" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Web Workers for Heavy Computation
              </Heading>
              <Text className={styles.sectionDescription}>
                Offload heavy computations to Web Workers to keep the main thread responsive.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Web Worker Setup

// worker.js
self.onmessage = function(e) {
  const { data, type } = e.data;
  
  switch (type) {
    case 'COMPUTE':
      const result = heavyComputation(data);
      self.postMessage({ type: 'RESULT', result });
      break;
    
    case 'PROCESS_IMAGE':
      const processed = processImage(data);
      self.postMessage({ type: 'IMAGE_PROCESSED', processed });
      break;
    
    default:
      self.postMessage({ type: 'ERROR', error: 'Unknown type' });
  }
};

function heavyComputation(data) {
  // Heavy computation that would block main thread
  let result = 0;
  for (let i = 0; i < 10000000; i++) {
    result += Math.sqrt(i) * Math.sin(i);
  }
  return result;
}

// ✅ Using Web Worker (React)
import { useEffect, useRef, useState } from 'react';

function useWebWorker(workerScript: string) {
  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    workerRef.current = new Worker(workerScript);
    
    workerRef.current.onmessage = (e) => {
      const { type, result, error } = e.data;
      
      if (type === 'RESULT') {
        setResult(result);
        setLoading(false);
      } else if (type === 'ERROR') {
        setError(new Error(error));
        setLoading(false);
      }
    };
    
    workerRef.current.onerror = (error) => {
      setError(error);
      setLoading(false);
    };
    
    return () => {
      workerRef.current?.terminate();
    };
  }, [workerScript]);
  
  const postMessage = (data: any) => {
    if (workerRef.current) {
      setLoading(true);
      setError(null);
      workerRef.current.postMessage(data);
    }
  };
  
  return { postMessage, result, loading, error };
}

// Usage
function HeavyComputationComponent() {
  const { postMessage, result, loading } = useWebWorker('/worker.js');
  
  const handleCompute = () => {
    postMessage({ type: 'COMPUTE', data: [1, 2, 3, 4, 5] });
  };
  
  return (
    <div>
      <button onClick={handleCompute} disabled={loading}>
        {loading ? 'Computing...' : 'Start Computation'}
      </button>
      {result && <div>Result: {result}</div>}
    </div>
  );
}

// ✅ Image Processing in Web Worker
// worker.js
self.onmessage = function(e) {
  const { imageData, operation } = e.data;
  
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  
  let processedData;
  
  switch (operation) {
    case 'grayscale':
      processedData = applyGrayscale(ctx, imageData);
      break;
    case 'blur':
      processedData = applyBlur(ctx, imageData);
      break;
    case 'sharpen':
      processedData = applySharpen(ctx, imageData);
      break;
  }
  
  self.postMessage({ type: 'IMAGE_PROCESSED', data: processedData });
};

function applyGrayscale(ctx: OffscreenCanvasRenderingContext2D, imageData: ImageData) {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  
  ctx.putImageData(imageData, 0, 0);
  return ctx.getImageData(0, 0, imageData.width, imageData.height);
}

// ✅ Shared Worker (Multiple tabs)
// shared-worker.js
let connections = [];

self.onconnect = function(e) {
  const port = e.ports[0];
  connections.push(port);
  
  port.onmessage = function(e) {
    // Broadcast to all connections
    connections.forEach(conn => {
      if (conn !== port) {
        conn.postMessage(e.data);
      }
    });
  };
};

// ✅ Worker Pool (Multiple workers)
class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{ data: any; resolve: Function; reject: Function }> = [];
  private activeWorkers = 0;
  
  constructor(workerScript: string, poolSize: number = 4) {
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.onmessage = (e) => this.handleMessage(worker, e);
      worker.onerror = (e) => this.handleError(worker, e);
      this.workers.push(worker);
    }
  }
  
  private handleMessage(worker: Worker, e: MessageEvent) {
    const task = this.queue.shift();
    if (task) {
      task.resolve(e.data);
      this.activeWorkers--;
      this.processQueue();
    }
  }
  
  private handleError(worker: Worker, e: ErrorEvent) {
    const task = this.queue.shift();
    if (task) {
      task.reject(e.error);
      this.activeWorkers--;
      this.processQueue();
    }
  }
  
  private processQueue() {
    if (this.queue.length === 0 || this.activeWorkers >= this.workers.length) {
      return;
    }
    
    const task = this.queue[0];
    const worker = this.workers.find(w => !w.busy);
    
    if (worker) {
      worker.busy = true;
      this.activeWorkers++;
      worker.postMessage(task.data);
      this.queue.shift();
    }
  }
  
  postMessage(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ data, resolve, reject });
      this.processQueue();
    });
  }
  
  terminate() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.queue = [];
  }
}

// Usage
const pool = new WorkerPool('/worker.js', 4);

async function processMultiple(items: any[]) {
  const promises = items.map(item => pool.postMessage({ type: 'PROCESS', data: item }));
  return Promise.all(promises);
}

// ✅ Transferable Objects (Zero-copy transfer)
// Much faster for large data
const buffer = new ArrayBuffer(1000000);
worker.postMessage(buffer, [buffer]); // Transfer ownership
// buffer is now detached in main thread

// ✅ Comlink (Simplified Worker Communication)
// npm install comlink
import * as Comlink from 'comlink';

// worker.js
const api = {
  async compute(data) {
    return heavyComputation(data);
  }
};

Comlink.expose(api);

// main.js
const worker = new Worker('./worker.js', { type: 'module' });
const api = Comlink.wrap(worker);

const result = await api.compute([1, 2, 3, 4, 5]);`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Image Optimization */}
      <section id="image-optimization" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Image Optimization Strategies
              </Heading>
              <Text className={styles.sectionDescription}>
                Optimize images for web: modern formats, responsive images, lazy loading, and compression.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Modern Image Formats

// 1. WebP (Better compression than JPEG/PNG)
<img 
  src="image.webp" 
  alt="Description"
  loading="lazy"
/>

// 2. AVIF (Best compression, newer)
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>

// ✅ Responsive Images
<img 
  srcSet="
    image-320w.jpg 320w,
    image-640w.jpg 640w,
    image-1280w.jpg 1280w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
  src="image-640w.jpg"
  alt="Description"
  loading="lazy"
/>

// ✅ Next.js Image Component (Optimized)
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority // Load immediately (above fold)
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

<Image
  src="/gallery/image.jpg"
  alt="Gallery image"
  width={800}
  height={600}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// ✅ Lazy Loading
// Native lazy loading (modern browsers)
<img 
  src="image.jpg" 
  alt="Description"
  loading="lazy"
  decoding="async"
/>

// Intersection Observer for older browsers
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s'
      }}
    />
  );
}

// ✅ Image Compression
// Client-side compression
import imageCompression from 'browser-image-compression';

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  
  return await imageCompression(file, options);
}

// ✅ Blur Placeholder (Low Quality Image Placeholder - LQIP)
function ImageWithBlur({ src, blurDataURL, alt }: {
  src: string;
  blurDataURL: string;
  alt: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div style={{ position: 'relative' }}>
      <img
        src={blurDataURL}
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.3s'
        }}
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        style={{
          position: 'relative',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s'
        }}
      />
    </div>
  );
}

// ✅ Art Direction (Different images for different viewports)
<picture>
  <source 
    media="(max-width: 768px)" 
    srcSet="mobile-hero.jpg"
  />
  <source 
    media="(min-width: 769px)" 
    srcSet="desktop-hero.jpg"
  />
  <img src="desktop-hero.jpg" alt="Hero" />
</picture>

// ✅ Image CDN with Transformations
// Using Cloudinary, Imgix, or similar
const cloudinaryUrl = \`
  https://res.cloudinary.com/demo/image/upload
  /w_800,h_600,c_fill,q_auto,f_auto
  /sample.jpg
\`;

// ✅ Aspect Ratio Preservation
.img-container {
  aspect-ratio: 16 / 9;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// ✅ Image Sprites (For icons)
.icon {
  background-image: url('sprite.png');
  background-size: 200px 200px;
  width: 32px;
  height: 32px;
}

.icon-home {
  background-position: 0 0;
}

.icon-user {
  background-position: -32px 0;
}

// ✅ SVG Optimization
// 1. Remove unnecessary attributes
// 2. Minify SVG
// 3. Use SVG sprites
// 4. Inline small SVGs

<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
</svg>

// ✅ Image Optimization Checklist
const imageOptimizationChecklist = {
  format: [
    'Use WebP or AVIF for photos',
    'Use SVG for icons and logos',
    'Provide fallbacks for older browsers'
  ],
  sizing: [
    'Serve appropriately sized images',
    'Use srcset for responsive images',
    'Set explicit width and height to prevent layout shift'
  ],
  loading: [
    'Lazy load below-the-fold images',
    'Use priority for above-the-fold images',
    'Use blur placeholder for better UX'
  ],
  compression: [
    'Compress images (aim for < 200KB)',
    'Use quality 80-85 for JPEG',
    'Use quality 80-90 for WebP'
  ],
  delivery: [
    'Use CDN for image delivery',
    'Enable HTTP/2 or HTTP/3',
    'Use appropriate cache headers'
  ]
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Font Loading Optimization */}
      <section id="font-optimization" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6. Font Loading Optimization
              </Heading>
              <Text className={styles.sectionDescription}>
                Optimize font loading to prevent FOIT (Flash of Invisible Text) and FOUT (Flash of Unstyled Text).
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Font Loading Strategies

// 1. font-display: swap (Prevents FOIT)
@font-face {
  font-family: 'Inter';
  src: url('inter.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately, swap when loaded */
}

// font-display options:
// - auto: Browser default (usually block)
// - block: Hide text until font loads (FOIT)
// - swap: Show fallback immediately, swap when loaded (FOUT)
// - fallback: Short block period, then swap
// - optional: Use font only if available quickly

// ✅ Preload Critical Fonts
<link
  rel="preload"
  href="/fonts/inter.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>

// ✅ Font Subsetting (Reduce file size)
// Only include characters you need
@font-face {
  font-family: 'Inter';
  src: url('inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

// ✅ Font Loading API (JavaScript control)
const font = new FontFace(
  'Inter',
  'url(/fonts/inter.woff2) format("woff2")',
  {
    display: 'swap',
    unicodeRange: 'U+0000-00FF'
  }
);

font.load().then((loadedFont) => {
  document.fonts.add(loadedFont);
  // Font is ready, update UI
  document.body.classList.add('fonts-loaded');
});

// ✅ React Font Loading Hook
function useFontLoader(fontFamily: string, fontUrl: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const font = new FontFace(fontFamily, \`url(\${fontUrl})\`);
    
    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setIsLoaded(true);
      })
      .catch((err) => {
        setError(err);
      });
  }, [fontFamily, fontUrl]);
  
  return { isLoaded, error };
}

// ✅ Fallback Font Stack
body {
  font-family: 
    'Inter',           /* Custom font */
    -apple-system,     /* System fonts as fallback */
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

// ✅ Font Loading with CSS
.fonts-loaded body {
  font-family: 'Inter', sans-serif;
}

body {
  font-family: system-ui, sans-serif; /* Fallback */
}

// ✅ Critical Font Inlining
// Inline base64 encoded font in CSS for critical path
<style>
  @font-face {
    font-family: 'Inter';
    src: url('data:font/woff2;base64,...') format('woff2');
    font-display: swap;
  }
</style>

// ✅ Variable Fonts (Single file, multiple weights)
@font-face {
  font-family: 'Inter Variable';
  src: url('inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-stretch: 75% 100%;
}

.inter-light {
  font-family: 'Inter Variable';
  font-weight: 300;
}

.inter-bold {
  font-family: 'Inter Variable';
  font-weight: 700;
}

// ✅ Font Loading Performance
function measureFontLoad() {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const fontEntries = performance.getEntriesByType('resource')
      .filter(entry => entry.name.includes('.woff') || entry.name.includes('.ttf'));
    
    fontEntries.forEach(entry => {
      console.log(\`Font: \${entry.name}\`);
      console.log(\`Load time: \${entry.duration}ms\`);
      console.log(\`Size: \${entry.transferSize} bytes\`);
    });
  }
}

// ✅ Preconnect to Font CDN
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

// ✅ Self-Hosted Fonts (Better performance than CDN)
// 1. Download fonts
// 2. Subset fonts (only needed characters)
// 3. Convert to WOFF2
// 4. Host on your domain
// 5. Preload in <head>

// ✅ Font Loading Best Practices
const fontLoadingBestPractices = {
  critical: [
    'Preload critical fonts',
    'Use font-display: swap',
    'Inline critical font CSS',
    'Subset fonts to reduce size'
  ],
  fallbacks: [
    'Use system font stack as fallback',
    'Match fallback font metrics to custom font',
    'Test with fonts disabled'
  ],
  performance: [
    'Self-host fonts (avoid external CDN)',
    'Use WOFF2 format (best compression)',
    'Limit number of font families',
    'Use variable fonts when possible'
  ],
  ux: [
    'Prevent FOIT with font-display: swap',
    'Match fallback font size to custom font',
    'Show content immediately with fallback',
    'Smooth transition when font loads'
  ]
};

// ✅ Font Metrics Matching
// Match fallback font size to custom font to prevent layout shift
body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
}

/* When Inter loads, it should have similar metrics */
.fonts-loaded body {
  font-family: 'Inter', system-ui, sans-serif;
  /* Metrics should match to prevent shift */
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

