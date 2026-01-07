"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { BlogContentLayout } from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function EdgeComputingPage() {
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
          <li className={styles.breadcrumbCurrent}>Edge Computing</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Edge Computing & Edge Functions: The Future of Low-Latency Applications
        </Heading>
        <Text className={styles.subtitle}>
          Master edge computing architecture: Vercel Edge Functions, Cloudflare Workers, edge caching strategies, and understand the critical trade-offs between edge computing and traditional serverless. Learn how to build ultra-fast, globally distributed applications that respond in milliseconds.
        </Text>
      </div>

      {/* Edge Computing Fundamentals */}
      <section id="edge-fundamentals" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. Edge Computing Fundamentals
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>What is Edge Computing?</strong> Edge computing brings computation and data storage closer to the location where it's needed, reducing latency and bandwidth usage. Instead of processing requests in a central data center, edge functions run on distributed edge locations worldwide.
                <br /><br />
                <strong>Why Edge Computing Matters:</strong> In a world where every millisecond counts, edge computing can reduce response times from 200-500ms (traditional serverless) to 10-50ms (edge functions). This is critical for real-time applications, global user bases, and performance-sensitive workloads.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Concepts:</strong>
                <br />• <strong>Edge Locations:</strong> Distributed points of presence (PoPs) closer to end users
                <br />• <strong>Cold Start Elimination:</strong> Edge functions are always warm, eliminating cold start latency
                <br />• <strong>Global Distribution:</strong> Code runs in 200+ locations worldwide simultaneously
                <br />• <strong>Request Routing:</strong> Automatic routing to the nearest edge location
                <br />• <strong>Stateless Execution:</strong> Edge functions are stateless, enabling horizontal scaling
              </Text>
            </div>

            <CodeComparison
              language="typescript"
              wrong={`// ❌ BAD: Traditional Serverless (Centralized)
// Request travels: User → CDN → Origin → Lambda (us-east-1) → Response
// Total latency: ~300-500ms for users far from us-east-1

export async function handler(event: APIGatewayEvent) {
  // Runs in single region (e.g., us-east-1)
  // User in Tokyo: 300ms+ latency
  // User in London: 200ms+ latency
  // User in Sydney: 400ms+ latency
  
  const data = await fetch('https://api.example.com/data');
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}`}
              good={`// ✅ GOOD: Edge Function (Distributed)
// Request travels: User → Nearest Edge Location → Response
// Total latency: ~10-50ms globally

// Vercel Edge Function
export const config = {
  runtime: 'edge', // Runs on edge network
};

export default async function handler(request: Request) {
  // Runs in 200+ locations simultaneously
  // User in Tokyo: ~15ms latency
  // User in London: ~12ms latency
  // User in Sydney: ~18ms latency
  
  const data = await fetch('https://api.example.com/data');
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}`}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-6`}>
              <Text className={styles.infoText}>
                <strong>When to Use Edge Computing:</strong>
                <br />• Real-time applications (chat, gaming, live updates)
                <br />• Global user bases requiring low latency
                <br />• A/B testing and personalization
                <br />• Authentication and authorization
                <br />• API route handlers
                <br />• Image optimization and transformations
                <br />• Bot detection and rate limiting
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Vercel Edge Functions */}
      <section id="vercel-edge" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Vercel Edge Functions
              </Heading>
              <Text className={styles.sectionDescription}>
                Vercel Edge Functions run on V8 isolates at the edge, providing sub-50ms response times globally. They're built on the Web API standard (Request/Response), making them familiar to web developers while offering incredible performance.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Vercel Edge Functions Features:</strong>
                <br />• <strong>Web API Standard:</strong> Uses Request/Response APIs (not Node.js)
                <br />• <strong>V8 Isolates:</strong> Lightweight, fast startup (no cold starts)
                <br />• <strong>Global Distribution:</strong> Runs in 200+ edge locations
                <br />• <strong>TypeScript Support:</strong> Full TypeScript support out of the box
                <br />• <strong>Streaming:</strong> Support for streaming responses
                <br />• <strong>Middleware:</strong> Edge Middleware for request interception
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Vercel Edge Function - Basic Example
// File: app/api/hello/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'World';
  
  return new Response(
    JSON.stringify({ 
      message: \`Hello, \${name}!\`,
      timestamp: new Date().toISOString(),
      region: request.headers.get('x-vercel-id') || 'unknown'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    }
  );
}

// ✅ Edge Function with Authentication
export const runtime = 'edge';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    );
  }
  
  const token = authHeader.substring(7);
  // Verify token (can use Web Crypto API)
  const isValid = await verifyToken(token);
  
  if (!isValid) {
    return new Response(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401 }
    );
  }
  
  return new Response(
    JSON.stringify({ message: 'Authenticated successfully' }),
    { status: 200 }
  );
}

// ✅ Edge Function with External API Call
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Edge functions can make fetch calls
    const response = await fetch('https://api.example.com/data', {
      headers: {
        'Authorization': \`Bearer \${process.env.API_KEY}\`
      }
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    
    // Transform data at the edge
    const transformed = {
      ...data,
      processedAt: new Date().toISOString(),
      edgeLocation: request.headers.get('x-vercel-id')
    };
    
    return new Response(JSON.stringify(transformed), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch data' }),
      { status: 500 }
    );
  }
}

// ✅ Edge Function with Streaming Response
export const runtime = 'edge';

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        const data = encoder.encode(\`Chunk \${i}\\n\`);
        controller.enqueue(data);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    }
  });
}

// ✅ Edge Function with CORS
export const runtime = 'edge';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}`}
            />

            <Heading level={3} className={styles.sectionTitle} style={{ marginTop: '2rem', fontSize: '1.5rem' }}>
              Vercel Edge Middleware
            </Heading>
            <Text className={styles.sectionDescription}>
              Edge Middleware runs before a request is processed, allowing you to intercept, modify, or redirect requests at the edge. This is perfect for authentication, A/B testing, geolocation-based routing, and more.
            </Text>

            <CodeEditor
              code={`// ✅ Vercel Edge Middleware
// File: middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get user's location
  const country = request.geo?.country || 'US';
  const city = request.geo?.city || 'Unknown';
  
  // A/B Testing
  const cookie = request.cookies.get('ab-test');
  const variant = cookie?.value || (Math.random() > 0.5 ? 'A' : 'B');
  
  // Create response
  const response = NextResponse.next();
  
  // Set A/B test cookie
  response.cookies.set('ab-test', variant, {
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  
  // Add custom headers
  response.headers.set('x-user-country', country);
  response.headers.set('x-user-city', city);
  response.headers.set('x-ab-variant', variant);
  
  // Redirect based on country
  if (country === 'CN' && !request.nextUrl.pathname.startsWith('/cn')) {
    return NextResponse.redirect(new URL('/cn' + request.nextUrl.pathname, request.url));
  }
  
  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// ✅ Authentication Middleware
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  
  // Redirect to login if not authenticated (except auth pages)
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to home if authenticated and on login page
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// ✅ Rate Limiting Middleware
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const limit = 100; // requests
  const window = 60000; // 1 minute
  
  const record = rateLimitMap.get(ip);
  
  if (record) {
    if (now > record.resetTime) {
      // Reset window
      rateLimitMap.set(ip, { count: 1, resetTime: now + window });
    } else {
      // Increment count
      record.count++;
      if (record.count > limit) {
        return new NextResponse('Rate limit exceeded', { status: 429 });
      }
      rateLimitMap.set(ip, record);
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + window });
  }
  
  return NextResponse.next();
}

// ✅ Geolocation-Based Content
export function middleware(request: NextRequest) {
  const country = request.geo?.country;
  const response = NextResponse.next();
  
  // Set country-specific headers
  response.headers.set('x-user-country', country || 'unknown');
  
  // Redirect to country-specific domain
  if (country === 'GB') {
    response.headers.set('x-content-region', 'uk');
  } else if (country === 'US') {
    response.headers.set('x-content-region', 'us');
  }
  
  return response;
}`}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Vercel Edge Functions Limitations:</strong>
                <br />• No Node.js APIs (use Web APIs instead)
                <br />• 50MB memory limit
                <br />• 30-second execution timeout
                <br />• No file system access
                <br />• Limited to Web Crypto API for cryptography
                <br />• Cannot use native Node.js modules
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Cloudflare Workers */}
      <section id="cloudflare-workers" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Cloudflare Workers
              </Heading>
              <Text className={styles.sectionDescription}>
                Cloudflare Workers is a serverless platform that runs JavaScript, WebAssembly, or Rust code on Cloudflare's edge network. With 300+ data centers worldwide, Workers provide exceptional global performance and powerful edge computing capabilities.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Cloudflare Workers Features:</strong>
                <br />• <strong>V8 Isolates:</strong> Fast, secure JavaScript execution
                <br />• <strong>WebAssembly Support:</strong> Run Rust, C, C++ code at the edge
                <br />• <strong>Durable Objects:</strong> Strongly consistent, globally distributed state
                <br />• <strong>KV Storage:</strong> Global key-value store at the edge
                <br />• <strong>R2 Storage:</strong> S3-compatible object storage
                <br />• <strong>D1 Database:</strong> SQLite-compatible edge database
                <br />• <strong>Workers AI:</strong> Run AI models at the edge
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Basic Cloudflare Worker
// File: worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle different routes
    if (url.pathname === '/api/hello') {
      return new Response(JSON.stringify({
        message: 'Hello from Cloudflare Workers!',
        timestamp: new Date().toISOString(),
        cf: {
          country: request.cf?.country,
          city: request.cf?.city,
          colo: request.cf?.colo // Cloudflare data center code
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Default response
    return new Response('Not Found', { status: 404 });
  }
};

// ✅ Worker with Environment Variables
export default {
  async fetch(request, env) {
    // Access environment variables
    const apiKey = env.API_KEY;
    const dbUrl = env.DATABASE_URL;
    
    // Make authenticated request
    const response = await fetch('https://api.example.com/data', {
      headers: {
        'Authorization': \`Bearer \${apiKey}\`
      }
    });
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// ✅ Worker with KV Storage
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    
    if (!key) {
      return new Response('Missing key parameter', { status: 400 });
    }
    
    // Read from KV
    const value = await env.MY_KV_NAMESPACE.get(key);
    
    if (!value) {
      return new Response('Key not found', { status: 404 });
    }
    
    // Write to KV
    await env.MY_KV_NAMESPACE.put(key, JSON.stringify({
      value,
      updatedAt: new Date().toISOString()
    }));
    
    return new Response(JSON.stringify({ key, value }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// ✅ Worker with Durable Objects (Strongly Consistent State)
// File: worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const id = env.COUNTER.idFromName('global-counter');
    const obj = env.COUNTER.get(id);
    
    // Forward request to Durable Object
    return obj.fetch(request);
  }
};

// File: durable-object.js
export class Counter {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  
  async fetch(request) {
    // Get current count
    let count = await this.state.storage.get('count') || 0;
    
    const url = new URL(request.url);
    if (url.pathname === '/increment') {
      count++;
      await this.state.storage.put('count', count);
    }
    
    return new Response(JSON.stringify({ count }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ✅ Worker with R2 Storage (S3-compatible)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (request.method === 'PUT' && url.pathname.startsWith('/upload/')) {
      const key = url.pathname.replace('/upload/', '');
      const body = await request.arrayBuffer();
      
      // Upload to R2
      await env.MY_BUCKET.put(key, body, {
        httpMetadata: {
          contentType: request.headers.get('Content-Type')
        }
      });
      
      return new Response(JSON.stringify({ success: true, key }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (request.method === 'GET' && url.pathname.startsWith('/download/')) {
      const key = url.pathname.replace('/download/', '');
      const object = await env.MY_BUCKET.get(key);
      
      if (!object) {
        return new Response('Not found', { status: 404 });
      }
      
      return new Response(object.body, {
        headers: {
          'Content-Type': object.httpMetadata.contentType
        }
      });
    }
    
    return new Response('Method not allowed', { status: 405 });
  }
};

// ✅ Worker with D1 Database (SQLite at the edge)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/users' && request.method === 'GET') {
      // Query D1 database
      const { results } = await env.DB.prepare(
        'SELECT * FROM users LIMIT 10'
      ).all();
      
      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/users' && request.method === 'POST') {
      const data = await request.json();
      
      // Insert into D1
      const result = await env.DB.prepare(
        'INSERT INTO users (name, email) VALUES (?, ?)'
      ).bind(data.name, data.email).run();
      
      return new Response(JSON.stringify({ id: result.meta.last_row_id }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};

// ✅ Worker with Workers AI (Run AI models at the edge)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/translate' && request.method === 'POST') {
      const { text, targetLang } = await request.json();
      
      // Use Workers AI for translation
      const response = await env.AI.run('@cf/meta/m2m100-1.2b', {
        text,
        target_lang: targetLang,
        source_lang: 'en'
      });
      
      return new Response(JSON.stringify({ translation: response.translated_text }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/summarize' && request.method === 'POST') {
      const { text } = await request.json();
      
      // Summarize text using AI
      const response = await env.AI.run('@cf/facebook/bart-large-cnn', {
        input_text: text,
        max_length: 100
      });
      
      return new Response(JSON.stringify({ summary: response.summary }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};

// ✅ Worker with WebAssembly (Rust)
// First, compile Rust to WASM: wasm-pack build --target web
// Then use in Worker:

import wasmModule from './pkg/rust_module.js';

export default {
  async fetch(request) {
    // Initialize WASM module
    await wasmModule.default();
    
    // Call WASM function
    const result = wasmModule.compute_heavy_operation(1000000);
    
    return new Response(JSON.stringify({ result }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// ✅ Worker with Caching
export default {
  async fetch(request, env, ctx) {
    const cacheKey = new Request(request.url, request);
    const cache = caches.default;
    
    // Try to get from cache
    let response = await cache.match(cacheKey);
    
    if (!response) {
      // Fetch fresh data
      response = await fetch('https://api.example.com/data');
      
      // Clone response for caching
      response = new Response(response.body, response);
      response.headers.set('Cache-Control', 'public, max-age=3600');
      
      // Store in cache
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }
    
    return response;
  }
};

// ✅ Worker with Request Transformation
export default {
  async fetch(request) {
    // Modify request before forwarding
    const modifiedRequest = new Request(request.url, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Custom-Header': 'edge-processed',
        'X-User-Country': request.cf?.country || 'unknown'
      },
      body: request.body
    });
    
    // Forward to origin
    const response = await fetch(modifiedRequest);
    
    // Modify response
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'X-Processed-By': 'cloudflare-workers'
      }
    });
    
    return modifiedResponse;
  }
};`}
            />

            <Heading level={3} className={styles.sectionTitle} style={{ marginTop: '2rem', fontSize: '1.5rem' }}>
              Cloudflare Workers vs Vercel Edge Functions
            </Heading>

            <CodeComparison
              language="markdown"
              wrong={`# ❌ Choosing Wrong Platform

// Using Vercel Edge Functions for:
- Complex state management (need Durable Objects)
- Large file processing (need R2 storage)
- SQL database operations (need D1)
- AI/ML inference (need Workers AI)
- WebAssembly workloads

// Using Cloudflare Workers for:
- Next.js-specific features
- React Server Components
- Vercel-specific integrations`}
              good={`# ✅ Choosing Right Platform

// Use Vercel Edge Functions when:
- Building Next.js applications
- Need seamless Next.js integration
- Want simple Request/Response API
- Focus on API routes and middleware
- Using Vercel deployment platform

// Use Cloudflare Workers when:
- Need persistent storage (KV, R2, D1)
- Require strongly consistent state (Durable Objects)
- Want AI/ML at the edge (Workers AI)
- Need WebAssembly support
- Building standalone edge services
- Require advanced caching strategies`}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Cloudflare Workers Advantages:</strong>
                <br />• More edge locations (300+ vs 200+)
                <br />• Persistent storage options (KV, R2, D1)
                <br />• Durable Objects for stateful applications
                <br />• Workers AI for edge ML inference
                <br />• WebAssembly support
                <br />• Longer execution time limits (up to 30 seconds)
                <br />• More generous free tier
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Edge Caching Strategies */}
      <section id="edge-caching" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Edge Caching Strategies
              </Heading>
              <Text className={styles.sectionDescription}>
                Effective edge caching is crucial for performance. Learn how to implement cache invalidation, stale-while-revalidate patterns, edge-side includes, and cache warming strategies that maximize hit rates while ensuring data freshness.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Caching Strategies:</strong>
                <br />• <strong>Cache-Control Headers:</strong> Control cache behavior with HTTP headers
                <br />• <strong>Stale-While-Revalidate:</strong> Serve stale content while fetching fresh data
                <br />• <strong>Cache Tags:</strong> Invalidate related content together
                <br />• <strong>Edge-Side Includes:</strong> Compose pages from cached fragments
                <br />• <strong>Cache Warming:</strong> Pre-populate cache before traffic spikes
                <br />• <strong>Vary Headers:</strong> Cache different versions based on request headers
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Cache-Control Headers Strategy
export const runtime = 'edge';

export async function GET(request: Request) {
  const data = await fetchData();
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      // Cache for 1 hour, allow stale for 1 day
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      // Or: Cache for 5 minutes, no stale
      // 'Cache-Control': 'public, max-age=300, must-revalidate',
      // Or: Never cache
      // 'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
}

// ✅ Stale-While-Revalidate Pattern
export const runtime = 'edge';

const CACHE_DURATION = 3600; // 1 hour
const STALE_DURATION = 86400; // 1 day

export async function GET(request: Request) {
  const cacheKey = request.url;
  const cache = caches.default;
  
  // Try to get from cache
  const cachedResponse = await cache.match(cacheKey);
  
  if (cachedResponse) {
    const cacheDate = cachedResponse.headers.get('date');
    const age = (Date.now() - new Date(cacheDate).getTime()) / 1000;
    
    // If within cache duration, return immediately
    if (age < CACHE_DURATION) {
      return cachedResponse;
    }
    
    // If within stale duration, return stale but revalidate
    if (age < STALE_DURATION) {
      // Revalidate in background
      revalidateCache(cacheKey, cache);
      
      // Return stale response
      return cachedResponse;
    }
  }
  
  // Fetch fresh data
  const data = await fetchFreshData();
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': \`public, s-maxage=\${CACHE_DURATION}, stale-while-revalidate=\${STALE_DURATION}\`,
      'Date': new Date().toUTCString()
    }
  });
  
  // Store in cache
  await cache.put(cacheKey, response.clone());
  
  return response;
}

async function revalidateCache(cacheKey: string, cache: Cache) {
  try {
    const data = await fetchFreshData();
    const response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': \`public, s-maxage=\${CACHE_DURATION}, stale-while-revalidate=\${STALE_DURATION}\`,
        'Date': new Date().toUTCString()
      }
    });
    await cache.put(cacheKey, response);
  } catch (error) {
    console.error('Cache revalidation failed:', error);
  }
}

// ✅ Cache Tags for Invalidation
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  const data = await fetchUserData(userId);
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600',
      // Tag cache entries for invalidation
      'Cache-Tag': \`user:\${userId},users:list\`
    }
  });
}

// Invalidate cache by tag (webhook or API call)
export async function POST(request: Request) {
  const { userId, action } = await request.json();
  
  if (action === 'invalidate') {
    // Invalidate all caches with this tag
    await invalidateCacheTag(\`user:\${userId}\`);
  }
  
  return new Response(JSON.stringify({ success: true }));
}

// ✅ Vary Headers for Different Cache Versions
export const runtime = 'edge';

export async function GET(request: Request) {
  const acceptLanguage = request.headers.get('Accept-Language') || 'en';
  const userAgent = request.headers.get('User-Agent') || '';
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  
  const data = await fetchData(acceptLanguage, isMobile);
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600',
      // Cache different versions based on headers
      'Vary': 'Accept-Language, User-Agent'
    }
  });
}

// ✅ Edge-Side Includes (ESI) Pattern
// Compose pages from cached fragments
export const runtime = 'edge';

export async function GET(request: Request) {
  // Fetch multiple fragments in parallel
  const [header, content, footer] = await Promise.all([
    fetchFragment('header'),
    fetchFragment('content'),
    fetchFragment('footer')
  ]);
  
  // Compose page from fragments
  const page = \`
    <!DOCTYPE html>
    <html>
      <head><title>My Page</title></head>
      <body>
        \${await header.text()}
        \${await content.text()}
        \${await footer.text()}
      </body>
    </html>
  \`;
  
  return new Response(page, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, s-maxage=3600'
    }
  });
}

async function fetchFragment(name: string) {
  const cache = caches.default;
  const cacheKey = \`https://api.example.com/fragments/\${name}\`;
  
  let response = await cache.match(cacheKey);
  
  if (!response) {
    response = await fetch(cacheKey);
    response = new Response(response.body, {
      headers: {
        ...Object.fromEntries(response.headers),
        'Cache-Control': 'public, s-maxage=7200'
      }
    });
    await cache.put(cacheKey, response.clone());
  }
  
  return response;
}

// ✅ Cache Warming Strategy
// Pre-populate cache before traffic spikes
export async function warmCache() {
  const endpoints = [
    '/api/popular-products',
    '/api/featured-articles',
    '/api/homepage-data'
  ];
  
  const cache = caches.default;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(\`https://your-domain.com\${endpoint}\`);
      const cacheKey = \`https://your-domain.com\${endpoint}\`;
      await cache.put(cacheKey, response.clone());
      console.log(\`Warmed cache for \${endpoint}\`);
    } catch (error) {
      console.error(\`Failed to warm cache for \${endpoint}:\`, error);
    }
  }
}

// Call warmCache() on schedule (cron job) or before expected traffic

// ✅ Conditional Requests (ETag/Last-Modified)
export const runtime = 'edge';

export async function GET(request: Request) {
  const data = await fetchData();
  const etag = generateETag(data);
  const lastModified = new Date().toUTCString();
  
  // Check if client has cached version
  const ifNoneMatch = request.headers.get('If-None-Match');
  const ifModifiedSince = request.headers.get('If-Modified-Since');
  
  if (ifNoneMatch === etag) {
    // Client has current version
    return new Response(null, { status: 304 }); // Not Modified
  }
  
  if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastModified)) {
    return new Response(null, { status: 304 });
  }
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'ETag': etag,
      'Last-Modified': lastModified,
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

function generateETag(data: any): string {
  // Simple ETag generation (use crypto for production)
  return \`"\${Buffer.from(JSON.stringify(data)).toString('base64').slice(0, 27)}"\`;
}

// ✅ Cache Partitioning by User Segment
export const runtime = 'edge';

export async function GET(request: Request) {
  const userSegment = getUserSegment(request);
  const cacheKey = \`\${request.url}:segment:\${userSegment}\`;
  const cache = caches.default;
  
  let response = await cache.match(cacheKey);
  
  if (!response) {
    const data = await fetchSegmentData(userSegment);
    response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=1800', // 30 minutes
        'Vary': 'Cookie' // Cache per user segment
      }
    });
    await cache.put(cacheKey, response.clone());
  }
  
  return response;
}

function getUserSegment(request: Request): string {
  // Determine user segment (e.g., free, premium, enterprise)
  const cookie = request.headers.get('Cookie');
  if (cookie?.includes('premium=true')) return 'premium';
  if (cookie?.includes('enterprise=true')) return 'enterprise';
  return 'free';
}`}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Cache Strategy Decision Tree:</strong>
                <br />• <strong>Static Content:</strong> Long TTL (24h+), no revalidation
                <br />• <strong>Dynamic Content:</strong> Short TTL (5-60min), stale-while-revalidate
                <br />• <strong>User-Specific:</strong> Private cache, vary by cookie/header
                <br />• <strong>Real-Time Data:</strong> No cache or very short TTL (1-5min)
                <br />• <strong>Heavy Computations:</strong> Long TTL, cache tags for invalidation
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Edge vs Serverless Trade-offs */}
      <section id="edge-vs-serverless" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Edge vs Serverless: Critical Trade-offs
              </Heading>
              <Text className={styles.sectionDescription}>
                Understanding when to use edge functions versus traditional serverless is crucial for building optimal architectures. Each has distinct advantages, limitations, and use cases that senior engineers must understand.
              </Text>
            </div>

            <CodeComparison
              language="markdown"
              wrong={`# ❌ BAD: Using Edge Functions for Everything

// Using edge functions for:
- Heavy database operations (need connection pooling)
- Long-running computations (30s timeout)
- File system operations (not available)
- Complex Node.js dependencies (not supported)
- WebSocket connections (limited support)
- Large memory requirements (>50MB)

// Result:
- Performance issues
- Function timeouts
- Missing features
- Higher costs
- Complex workarounds`}
              good={`# ✅ GOOD: Right Tool for Right Job

// Use Edge Functions for:
- Authentication/authorization
- Request routing & middleware
- A/B testing & personalization
- API route handlers
- Image optimization
- Bot detection
- Rate limiting
- Geo-based routing

// Use Traditional Serverless for:
- Database-heavy operations
- Long-running tasks
- File processing
- Complex Node.js apps
- WebSocket servers
- Background jobs
- ML model training`}
            />

            <Heading level={3} className={styles.sectionTitle} style={{ marginTop: '2rem', fontSize: '1.5rem' }}>
              Detailed Comparison
            </Heading>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Heading level={4} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>
                  Latency & Performance
                </Heading>
                <Text className={styles.sectionDescription} style={{ marginBottom: '0.5rem' }}>
                  <strong>Edge Functions:</strong> 10-50ms globally, no cold starts, always warm
                  <br />
                  <strong>Serverless:</strong> 100-500ms (varies by region), cold starts can add 1-5 seconds
                </Text>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Heading level={4} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>
                  Execution Environment
                </Heading>
                <Text className={styles.sectionDescription} style={{ marginBottom: '0.5rem' }}>
                  <strong>Edge Functions:</strong> V8 isolates, Web APIs only, limited runtime APIs
                  <br />
                  <strong>Serverless:</strong> Full Node.js/Python/etc runtime, all standard libraries
                </Text>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Heading level={4} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>
                  Execution Time Limits
                </Heading>
                <Text className={styles.sectionDescription} style={{ marginBottom: '0.5rem' }}>
                  <strong>Edge Functions:</strong> 30 seconds (Vercel), 30 seconds (Cloudflare)
                  <br />
                  <strong>Serverless:</strong> Up to 15 minutes (AWS Lambda), configurable
                </Text>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Heading level={4} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>
                  Memory & Resources
                </Heading>
                <Text className={styles.sectionDescription} style={{ marginBottom: '0.5rem' }}>
                  <strong>Edge Functions:</strong> 50-128MB memory, no disk storage
                  <br />
                  <strong>Serverless:</strong> Up to 10GB memory (AWS Lambda), ephemeral disk storage
                </Text>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Heading level={4} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>
                  Database Connections
                </Heading>
                <Text className={styles.sectionDescription} style={{ marginBottom: '0.5rem' }}>
                  <strong>Edge Functions:</strong> HTTP-based databases only, no connection pooling
                  <br />
                  <strong>Serverless:</strong> Full database drivers, connection pooling possible
                </Text>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Heading level={4} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>
                  Cost Structure
                </Heading>
                <Text className={styles.sectionDescription} style={{ marginBottom: '0.5rem' }}>
                  <strong>Edge Functions:</strong> Pay per request, very low cost per invocation
                  <br />
                  <strong>Serverless:</strong> Pay per request + execution time, can be expensive for long-running tasks
                </Text>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Heading level={4} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'white' }}>
                  State Management
                </Heading>
                <Text className={styles.sectionDescription} style={{ marginBottom: '0.5rem' }}>
                  <strong>Edge Functions:</strong> Stateless only, use external storage (KV, Redis)
                  <br />
                  <strong>Serverless:</strong> Can maintain state in memory (within execution), use databases
                </Text>
              </div>
            </div>

            <CodeEditor
              code={`// ✅ Hybrid Architecture: Edge + Serverless

// Edge Function: Fast authentication & routing
export const runtime = 'edge';

export async function GET(request: Request) {
  // Fast auth check at edge
  const token = request.headers.get('Authorization');
  if (!token || !await verifyTokenAtEdge(token)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Route to appropriate backend
  const user = await getUserFromToken(token);
  const backendUrl = user.plan === 'enterprise' 
    ? process.env.ENTERPRISE_API_URL
    : process.env.STANDARD_API_URL;
  
  // Proxy to serverless backend for heavy operations
  const response = await fetch(\`\${backendUrl}/api/data\`, {
    headers: {
      'Authorization': token,
      'X-Edge-Processed': 'true'
    }
  });
  
  return response;
}

// Serverless Function: Heavy database operations
// File: api/heavy-operation/route.ts (Next.js API route)
export async function POST(request: Request) {
  // Full Node.js runtime available
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Connection pooling
    idleTimeoutMillis: 30000
  });
  
  // Complex database query
  const result = await pool.query(`
    WITH complex_cte AS (
      SELECT * FROM large_table 
      WHERE created_at > NOW() - INTERVAL '30 days'
    )
    SELECT 
      category,
      COUNT(*) as count,
      AVG(price) as avg_price
    FROM complex_cte
    GROUP BY category
    ORDER BY count DESC
  `);
  
  // Process results
  const processed = result.rows.map(row => ({
    ...row,
    formatted_price: formatCurrency(row.avg_price)
  }));
  
  await pool.end();
  
  return Response.json(processed);
}

// ✅ Decision Matrix Implementation
export function shouldUseEdge(request: Request): boolean {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Use edge for:
  const edgePaths = [
    '/api/auth',
    '/api/middleware',
    '/api/rate-limit',
    '/api/geo',
    '/api/personalize'
  ];
  
  if (edgePaths.some(p => path.startsWith(p))) {
    return true;
  }
  
  // Use serverless for:
  const serverlessPaths = [
    '/api/reports',
    '/api/analytics',
    '/api/export',
    '/api/batch'
  ];
  
  if (serverlessPaths.some(p => path.startsWith(p))) {
    return false;
  }
  
  // Default: use edge for speed
  return true;
}

// ✅ Cost Optimization: Edge for High Traffic, Serverless for Low Traffic
export async function routeRequest(request: Request) {
  const endpoint = new URL(request.url).pathname;
  const trafficLevel = await getTrafficLevel(endpoint);
  
  if (trafficLevel === 'high') {
    // High traffic: use edge (lower cost per request)
    return handleAtEdge(request);
  } else {
    // Low traffic: use serverless (better for infrequent requests)
    return handleAtServerless(request);
  }
}

// ✅ Performance Optimization: Edge for Simple, Serverless for Complex
export function chooseRuntime(operation: Operation): 'edge' | 'serverless' {
  const complexity = estimateComplexity(operation);
  
  if (complexity.simple && complexity.latencySensitive) {
    return 'edge'; // Fast, simple operations
  }
  
  if (complexity.needsDatabase || complexity.longRunning) {
    return 'serverless'; // Complex operations
  }
  
  return 'edge'; // Default to edge for speed
}`}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Architecture Decision Framework:</strong>
                <br />
                <strong>Choose Edge When:</strong>
                <br />• Latency is critical (&lt;50ms required)
                <br />• Operation is stateless
                <br />• Simple request/response pattern
                <br />• High request volume
                <br />• Global user base
                <br />• Authentication/authorization
                <br />
                <br />
                <strong>Choose Serverless When:</strong>
                <br />• Need full runtime capabilities
                <br />• Long-running operations (&gt;30s)
                <br />• Database connection pooling required
                <br />• Complex dependencies
                <br />• File system access needed
                <br />• Background job processing
              </Text>
            </div>

            <Heading level={3} className={styles.sectionTitle} style={{ marginTop: '2rem', fontSize: '1.5rem' }}>
              Real-World Architecture Patterns
            </Heading>

            <CodeEditor
              code={`// ✅ Pattern 1: Edge Gateway + Serverless Backend
// Edge: Authentication, routing, rate limiting
// Serverless: Business logic, database operations

// Edge Gateway
export const runtime = 'edge';

export async function GET(request: Request) {
  // 1. Authenticate (fast at edge)
  const user = await authenticate(request);
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  // 2. Rate limit (fast at edge)
  if (await isRateLimited(user.id)) {
    return new Response('Rate limited', { status: 429 });
  }
  
  // 3. Route to serverless backend
  const backendResponse = await fetch(process.env.BACKEND_URL + '/api/data', {
    headers: {
      'X-User-ID': user.id,
      'Authorization': request.headers.get('Authorization')
    }
  });
  
  // 4. Transform response at edge
  const data = await backendResponse.json();
  const transformed = {
    ...data,
    processed_at: new Date().toISOString(),
    edge_location: request.headers.get('x-vercel-id')
  };
  
  return Response.json(transformed);
}

// ✅ Pattern 2: Edge Caching + Serverless Generation
// Edge: Serve cached content
// Serverless: Generate and cache content

// Edge: Cache layer
export const runtime = 'edge';

export async function GET(request: Request) {
  const cache = caches.default;
  const cacheKey = request.url;
  
  // Try cache first
  let response = await cache.match(cacheKey);
  
  if (!response) {
    // Cache miss: generate at serverless
    const serverlessResponse = await fetch(
      process.env.SERVERLESS_URL + '/generate',
      { method: 'POST', body: JSON.stringify({ url: request.url }) }
    );
    
    response = new Response(serverlessResponse.body, {
      headers: {
        ...Object.fromEntries(serverlessResponse.headers),
        'Cache-Control': 'public, s-maxage=3600'
      }
    });
    
    // Cache for future requests
    await cache.put(cacheKey, response.clone());
  }
  
  return response;
}

// ✅ Pattern 3: Edge Personalization + Serverless Data
// Edge: Personalize content
// Serverless: Fetch user data

export const runtime = 'edge';

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  
  // Fetch personalized data from serverless
  const dataResponse = await fetch(
    \`\${process.env.SERVERLESS_URL}/api/user-data/\${user.id}\`
  );
  const userData = await dataResponse.json();
  
  // Personalize at edge (fast)
  const personalized = {
    ...userData,
    recommendations: personalizeRecommendations(
      userData.history,
      request.geo?.country
    ),
    localized_content: getLocalizedContent(
      userData.content,
      request.headers.get('Accept-Language')
    )
  };
  
  return Response.json(personalized);
}

// ✅ Pattern 4: Edge API Gateway
// Single edge function routes to multiple serverless backends

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const service = url.pathname.split('/')[2]; // /api/{service}/...
  
  const serviceMap: Record<string, string> = {
    'users': process.env.USER_SERVICE_URL,
    'products': process.env.PRODUCT_SERVICE_URL,
    'orders': process.env.ORDER_SERVICE_URL,
    'analytics': process.env.ANALYTICS_SERVICE_URL
  };
  
  const serviceUrl = serviceMap[service];
  if (!serviceUrl) {
    return new Response('Service not found', { status: 404 });
  }
  
  // Add edge headers
  const headers = new Headers(request.headers);
  headers.set('X-Edge-Gateway', 'true');
  headers.set('X-Request-ID', crypto.randomUUID());
  
  // Proxy to appropriate service
  const response = await fetch(\`\${serviceUrl}\${url.pathname}\`, {
    method: request.method,
    headers,
    body: request.body
  });
  
  return response;
}`}
            />
          </Stack>
        </Card>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6. Edge Computing Best Practices
              </Heading>
              <Text className={styles.sectionDescription}>
                Learn production-ready patterns, error handling, monitoring, and optimization techniques that senior engineers use to build reliable edge applications.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Best Practice 1: Error Handling
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    // Log error (use external service like Sentry)
    console.error('Edge function error:', error);
    
    // Return user-friendly error
    return Response.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}

// ✅ Best Practice 2: Timeout Handling
export const runtime = 'edge';

const TIMEOUT_MS = 25000; // Leave buffer before 30s limit

export async function GET(request: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    const response = await fetch('https://api.example.com/data', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return Response.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }
    throw error;
  }
}

// ✅ Best Practice 3: Request Validation
export const runtime = 'edge';

const schema = {
  userId: (v: string) => /^[a-zA-Z0-9]+$/.test(v),
  limit: (v: number) => v > 0 && v <= 100
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  
  // Validate at edge (fast)
  if (!userId || !schema.userId(userId)) {
    return Response.json(
      { error: 'Invalid userId' },
      { status: 400 }
    );
  }
  
  if (!schema.limit(limit)) {
    return Response.json(
      { error: 'Limit must be between 1 and 100' },
      { status: 400 }
    );
  }
  
  // Proceed with validated request
  const data = await fetchUserData(userId, limit);
  return Response.json(data);
}

// ✅ Best Practice 4: Caching with Invalidation
export const runtime = 'edge';

export async function GET(request: Request) {
  const cache = caches.default;
  const cacheKey = request.url;
  
  // Check cache
  const cached = await cache.match(cacheKey);
  if (cached) {
    const age = parseInt(cached.headers.get('age') || '0');
    if (age < 3600) { // 1 hour
      return cached;
    }
  }
  
  // Fetch fresh
  const data = await fetchFreshData();
  const response = Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600',
      'Age': '0'
    }
  });
  
  await cache.put(cacheKey, response.clone());
  return response;
}

// ✅ Best Practice 5: Monitoring & Observability
export const runtime = 'edge';

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  try {
    const data = await fetchData();
    const duration = Date.now() - startTime;
    
    // Log metrics (send to analytics)
    logMetrics({
      requestId,
      duration,
      status: 200,
      endpoint: new URL(request.url).pathname
    });
    
    return Response.json(data, {
      headers: {
        'X-Request-ID': requestId,
        'X-Response-Time': \`\${duration}ms\`
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logMetrics({
      requestId,
      duration,
      status: 500,
      error: error.message,
      endpoint: new URL(request.url).pathname
    });
    
    throw error;
  }
}

// ✅ Best Practice 6: Security Headers
export const runtime = 'edge';

export async function GET(request: Request) {
  const data = await fetchData();
  
  return Response.json(data, {
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'"
    }
  });
}

// ✅ Best Practice 7: Request Deduplication
const pendingRequests = new Map<string, Promise<Response>>();

export const runtime = 'edge';

export async function GET(request: Request) {
  const cacheKey = request.url;
  
  // If same request is pending, wait for it
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }
  
  // Create new request
  const promise = (async () => {
    try {
      const data = await fetchData();
      const response = Response.json(data);
      return response;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();
  
  pendingRequests.set(cacheKey, promise);
  return promise;
}

// ✅ Best Practice 8: Graceful Degradation
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Try primary data source
    const data = await fetchPrimaryData();
    return Response.json(data);
  } catch (error) {
    console.error('Primary source failed:', error);
    
    try {
      // Fallback to secondary source
      const fallbackData = await fetchFallbackData();
      return Response.json({
        ...fallbackData,
        _fallback: true,
        _cached: true
      });
    } catch (fallbackError) {
      // Last resort: return cached/stale data
      const cached = await getCachedData();
      if (cached) {
        return Response.json({
          ...cached,
          _stale: true,
          _warning: 'Service degraded, showing cached data'
        });
      }
      
      // Complete failure
      return Response.json(
        { error: 'Service unavailable' },
        { status: 503 }
      );
    }
  }
}`}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Production Checklist:</strong>
                <br />✅ Implement proper error handling and logging
                <br />✅ Set appropriate timeouts (leave buffer before limits)
                <br />✅ Validate requests at the edge
                <br />✅ Implement caching strategies
                <br />✅ Add monitoring and observability
                <br />✅ Set security headers
                <br />✅ Handle request deduplication
                <br />✅ Implement graceful degradation
                <br />✅ Test cold start scenarios
                <br />✅ Monitor edge function performance
                <br />✅ Set up alerting for errors
                <br />✅ Document edge function behavior
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Navigation */}
      <div className={styles.navigation}>
        <ButtonLink
          href={createLocalizedPath("/developer-section/blog")}
          variant="secondary"
          className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
        >
          ← Back to Blog
        </ButtonLink>
        <ButtonLink
          href={createLocalizedPath("/developer-section/blog/aws-cloud")}
          variant="secondary"
          className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
        >
          AWS Cloud →
        </ButtonLink>
      </div>
    </BlogContentLayout>
  );
}

