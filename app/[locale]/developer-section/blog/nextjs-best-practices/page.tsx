"use client";

import React from "react";
import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor , FullscreenSection } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import { useBlogPostContent } from "@/lib/blogTranslations";
import { getCategoryForPost } from "@/lib/blogCategories";
import { localize } from "@/lib/localize";
import styles from "../BlogPostPage.module.css";

export default function NextJSBestPracticesPage() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const locale = language as 'en' | 'es';
  const postContent = useBlogPostContent('nextjs-best-practices', language);
  const category = getCategoryForPost("nextjs-best-practices");

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
          {category && (
            <>
              <li className={styles.breadcrumbSeparator}>/</li>
              <li>
                <ButtonLink href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                  {localize(category.title, locale)}
                </ButtonLink>
              </li>
            </>
          )}
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>
            {postContent?.breadcrumbLabel || 'Next.js Best Practices'}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          {postContent?.title || 'Next.js Best Practices & Patterns'}
        </Heading>
        <Text className={styles.subtitle}>
          {postContent?.subtitle || 'Complete Next.js guide from fundamentals to advanced. Learn App Router, Server Components, data fetching patterns, caching strategies, performance optimization, routing, API routes, middleware, and production-ready patterns used by senior engineers. Master Next.js step-by-step with extensive real-world examples.'}
        </Text>
      </div>

      {/* Next.js Fundamentals */}
      <FullscreenSection id="nextjs-fundamentals" title="Nextjs Fundamentals" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. Next.js Fundamentals & App Router
              </Heading>
              <Text className={styles.sectionDescription}>
                Understand the Next.js App Router architecture, file-based routing, and fundamental concepts that form the foundation of modern Next.js applications.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Concepts:</strong>
                <br />• <strong>App Router:</strong> Modern routing system based on React Server Components
                <br />• <strong>File-based Routing:</strong> Routes are created by adding files to the `app` directory
                <br />• <strong>Server Components:</strong> Components that render on the server by default
                <br />• <strong>Client Components:</strong> Interactive components that run in the browser
                <br />• <strong>Layouts:</strong> Shared UI that wraps multiple pages
                <br />• <strong>Loading States:</strong> Built-in loading UI while data fetches
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Next.js App Router Structure
app/
  layout.tsx          // Root layout (required)
  page.tsx            // Home page (/)
  loading.tsx         // Loading UI
  error.tsx           // Error UI
  not-found.tsx       // 404 page
  globals.css         // Global styles
  
  dashboard/
    layout.tsx        // Dashboard layout
    page.tsx          // /dashboard
    loading.tsx       // Dashboard loading state
    settings/
      page.tsx        // /dashboard/settings
      layout.tsx      // Settings layout
      
  blog/
    page.tsx          // /blog (list)
    [slug]/
      page.tsx        // /blog/[slug] (dynamic route)
      
  (marketing)/        // Route group (doesn't affect URL)
    about/
      page.tsx        // /about
    contact/
      page.tsx        // /contact
      
  api/
    users/
      route.ts        // API route: /api/users
      [id]/
        route.ts      // API route: /api/users/[id]

// ✅ Root Layout (app/layout.tsx)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'Production-ready Next.js application',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    siteName: 'My App',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@username',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

// ✅ Page Component (app/page.tsx)
// By default, this is a Server Component
export default function HomePage() {
  // This runs on the server
  const timestamp = new Date().toISOString();
  
  return (
    <main>
      <h1>Welcome to Next.js</h1>
      <p>Server rendered at: {timestamp}</p>
    </main>
  );
}

// ✅ Layout Component (app/dashboard/layout.tsx)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <aside>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/settings">Settings</a>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Server vs Client Components */}
      <FullscreenSection id="server-client-components" title="Server Client Components" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Server Components vs Client Components
              </Heading>
              <Text className={styles.sectionDescription}>
                Master the fundamental distinction between Server and Client Components. Learn when to use each, and how to structure your application for optimal performance.
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Using Client Component for everything
"use client";

import { useState, useEffect } from 'react';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetching on client side - slower, exposes API
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

// Problems:
// - All JavaScript shipped to client
// - Client-side data fetching (slower)
// - Exposes API endpoints
// - Worse SEO
// - Larger bundle size`}
              good={`// ✅ CORRECT: Server Component for data fetching
// app/products/page.tsx (Server Component - default)
import { Suspense } from 'react';
import ProductList from './components/ProductList';
import LoadingSkeleton from './components/LoadingSkeleton';

// Server Component - runs on server
async function getProducts() {
  // Direct database access or API call on server
  const res = await fetch('https://api.example.com/products', {
    cache: 'force-cache', // Cache the result
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function ProductsPage() {
  // This runs on the server - no JavaScript sent to client
  const products = await getProducts();
  
  return (
    <main>
      <h1>Products</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductList products={products} />
      </Suspense>
    </main>
  );
}

// ✅ Client Component only when needed
// app/products/components/ProductList.tsx
"use client";

import { useState } from 'react';

export default function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('');
  
  // Interactive UI - needs client-side JavaScript
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter products..."
      />
      {filtered.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ✅ Server Component with Metadata
export const metadata = {
  title: 'Products',
  description: 'Browse our amazing products',
};

// ✅ Pattern: Server Component fetches, Client Component renders interactively
// Server Component (page.tsx)
async function DashboardPage() {
  const data = await fetchDashboardData(); // Server-side
  
  return (
    <DashboardClient initialData={data} />
  );
}

// Client Component (interactive features)
"use client";
function DashboardClient({ initialData }) {
  const [filters, setFilters] = useState({});
  // Use initialData, add client-side interactivity
  return <DashboardUI data={initialData} filters={filters} />;
}`}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Data Fetching Patterns */}
      <FullscreenSection id="data-fetching" title="Data Fetching" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Data Fetching Patterns & Best Practices
              </Heading>
              <Text className={styles.sectionDescription}>
                Master Next.js data fetching: async Server Components, fetch caching, parallel and sequential requests, and streaming with Suspense.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Pattern 1: Async Server Component
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts(); // Awaits on server
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}

// ✅ Pattern 2: Parallel Data Fetching
async function DashboardPage() {
  // Fetch in parallel - both requests start simultaneously
  const [user, posts] = await Promise.all([
    fetch('https://api.example.com/user').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
  ]);
  
  return (
    <div>
      <UserProfile user={user} />
      <PostsList posts={posts} />
    </div>
  );
}

// ✅ Pattern 3: Sequential Data Fetching (when dependencies exist)
async function PostDetailPage({ params }: { params: { id: string } }) {
  // Fetch post first
  const post = await fetch(\`https://api.example.com/posts/\\\${params.id}\`).then(r => r.json());
  
  // Then fetch author (depends on post data)
  const author = await fetch(\`https://api.example.com/authors/\\\${post.authorId}\`).then(r => r.json());
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {author.name}</p>
      <div>{post.content}</div>
    </article>
  );
}

// ✅ Pattern 4: Streaming with Suspense
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function Revenue() {
  const revenue = await fetch('https://api.example.com/revenue', {
    cache: 'no-store', // Don't cache
  }).then(r => r.json());
  
  return <div>Revenue: \\\${revenue.total}</div>;
}

async function Users() {
  const users = await fetch('https://api.example.com/users', {
    cache: 'no-store',
  }).then(r => r.json());
  
  return <div>Users: {users.count}</div>;
}

export default function DashboardPage() {
  return (
    <div>
      {/* Stream each section independently */}
      <Suspense fallback={<RevenueSkeleton />}>
        <Revenue />
      </Suspense>
      
      <Suspense fallback={<UsersSkeleton />}>
        <Users />
      </Suspense>
    </div>
  );
}

// ✅ Pattern 5: Loading States
// app/posts/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

// ✅ Pattern 6: Error Handling
// app/posts/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// ✅ Pattern 7: Route Handlers (API Routes)
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  
  const posts = await getPostsFromDB(parseInt(page));
  
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate input
  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: 'Title and content required' },
      { status: 400 }
    );
  }
  
  const post = await createPost(body);
  
  return NextResponse.json({ post }, { status: 201 });
}

// ✅ Pattern 8: Dynamic Route Handlers
// app/api/posts/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await getPostById(params.id);
  
  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ post });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await deletePost(params.id);
  return NextResponse.json({ success: true });
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Caching Strategies */}
      <FullscreenSection id="caching" title="Caching" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Caching Strategies & Data Revalidation
              </Heading>
              <Text className={styles.sectionDescription}>
                Optimize performance with Next.js caching: Request Memoization, Data Cache, Full Route Cache, and advanced revalidation patterns.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Caching Levels in Next.js:</strong>
                <br />• <strong>Request Memoization:</strong> Automatically deduplicates fetch requests
                <br />• <strong>Data Cache:</strong> Persistent cache for fetch requests
                <br />• <strong>Full Route Cache:</strong> Caches entire rendered page
                <br />• <strong>Router Cache:</strong> Client-side cache for navigation
                <br />• <strong>Revalidation:</strong> Time-based or on-demand cache invalidation
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Caching Strategy 1: Time-based Revalidation
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    // Cache for 1 hour, then revalidate in background
    next: { revalidate: 3600 },
  });
  
  return res.json();
}

// ✅ Caching Strategy 2: On-demand Revalidation
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { path, tag } = await request.json();
  
  if (path) {
    revalidatePath(path);
  }
  
  if (tag) {
    revalidateTag(tag);
  }
  
  return NextResponse.json({ revalidated: true });
}

// Use tags for cache invalidation
async function getProduct(id: string) {
  const res = await fetch(\`https://api.example.com/products/\\\${id}\`, {
    next: { 
      tags: ['products', \`product-\\\${id}\`],
      revalidate: 3600,
    },
  });
  
  return res.json();
}

// ✅ Caching Strategy 3: Opt-out of Caching
async function getRealTimeData() {
  // Always fetch fresh data (no cache)
  const res = await fetch('https://api.example.com/realtime', {
    cache: 'no-store',
  });
  
  return res.json();
}

// ✅ Caching Strategy 4: Force Cache
async function getStaticData() {
  // Cache indefinitely (until manually revalidated)
  const res = await fetch('https://api.example.com/static-content', {
    cache: 'force-cache',
  });
  
  return res.json();
}

// ✅ Caching Strategy 5: Dynamic Functions (Opt-out of static generation)
// app/dynamic/page.tsx
export const dynamic = 'force-dynamic'; // Always render dynamically
export const revalidate = 0; // Don't cache

export default async function DynamicPage() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  }).then(r => r.json());
  
  return <div>{data.value}</div>;
}

// ✅ Caching Strategy 6: Segment Config
export const fetchCache = 'force-no-store'; // Don't cache any fetch in this route
export const runtime = 'nodejs'; // Use Node.js runtime
export const preferredRegion = 'us-east-1'; // Deploy to specific region

// ✅ Caching Strategy 7: Route Segment Config
// app/products/page.tsx
export const dynamic = 'force-static'; // Force static generation
export const revalidate = false; // Never revalidate (fully static)

// ✅ Caching Strategy 8: Advanced Revalidation Pattern
// app/api/products/route.ts
export async function POST(request: NextRequest) {
  const product = await createProduct(await request.json());
  
  // Revalidate product list and specific product
  revalidatePath('/products');
  revalidatePath(\`/products/\\\${product.id}\`);
  revalidateTag('products');
  revalidateTag(\`product-\\\${product.id}\`);
  
  return NextResponse.json({ product });
}

// ✅ Caching Strategy 9: Conditional Caching
async function getUserData(userId: string, forceRefresh?: boolean) {
  const res = await fetch(\`https://api.example.com/users/\\\${userId}\`, {
    cache: forceRefresh ? 'no-store' : 'force-cache',
    next: forceRefresh ? undefined : { revalidate: 3600 },
  });
  
  return res.json();
}

// ✅ Caching Strategy 10: Incremental Static Regeneration (ISR)
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return posts.map((post: Post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(\`https://api.example.com/posts/\\\${params.slug}\`, {
    next: { revalidate: 86400 }, // Revalidate once per day
  }).then(r => r.json());
  
  return <article>{/* Post content */}</article>;
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Routing Patterns */}
      <FullscreenSection id="routing-patterns" title="Routing Patterns" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Advanced Routing Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                Master Next.js routing: dynamic routes, catch-all segments, route groups, parallel routes, intercepting routes, and advanced patterns.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Pattern 1: Dynamic Routes
// app/products/[id]/page.tsx
export default async function ProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = await getProduct(params.id);
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}

// ✅ Pattern 2: Catch-all Segments
// app/shop/[...slug]/page.tsx
export default function ShopPage({ 
  params 
}: { 
  params: { slug: string[] } 
}) {
  // Handles /shop, /shop/category, /shop/category/product, etc.
  const path = params.slug?.join('/') || '';
  
  return <div>Shop: {path}</div>;
}

// ✅ Pattern 3: Optional Catch-all
// app/docs/[[...slug]]/page.tsx
export default function DocsPage({ 
  params 
}: { 
  params: { slug?: string[] } 
}) {
  // Handles /docs and /docs/any/path
  const slug = params.slug || [];
  
  return <div>Docs: {slug.join('/')}</div>;
}

// ✅ Pattern 4: Route Groups (Organize without affecting URL)
// app/(marketing)/about/page.tsx → /about
// app/(marketing)/contact/page.tsx → /contact
// app/(dashboard)/settings/page.tsx → /settings
// app/(dashboard)/profile/page.tsx → /profile

// ✅ Pattern 5: Parallel Routes
// app/dashboard/@analytics/page.tsx
export default function Analytics() {
  return <div>Analytics Content</div>;
}

// app/dashboard/@team/page.tsx
export default function Team() {
  return <div>Team Content</div>;
}

// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2">
        {analytics}
        {team}
      </div>
    </div>
  );
}

// ✅ Pattern 6: Intercepting Routes (Modals)
// app/@modal/(.)photo/[id]/page.tsx
// Shows modal when navigating to /photo/[id] from within app
// app/photo/[id]/page.tsx
// Shows full page when accessed directly

// ✅ Pattern 7: Conditional Routes
// app/(auth)/login/page.tsx - Requires authentication layout
// app/(public)/about/page.tsx - Public layout

// ✅ Pattern 8: Multiple Dynamic Segments
// app/posts/[category]/[slug]/page.tsx
export default async function PostPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const post = await getPost(params.category, params.slug);
  return <article>{/* Post */}</article>;
}

// ✅ Pattern 9: Route Handlers with Dynamic Segments
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserById(params.id);
  return NextResponse.json({ user });
}

// ✅ Pattern 10: SearchParams
// app/search/page.tsx
export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  
  return (
    <div>
      <h1>Search: {query}</h1>
      <p>Page: {page}</p>
    </div>
  );
}

// ✅ Pattern 11: Redirects and Rewrites
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://external-api.com/:path*',
      },
    ];
  },
};

// ✅ Pattern 12: Programmatic Navigation
// Client Component
"use client";
import { useRouter } from 'next/navigation';

export default function NavigationButton() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/dashboard');
    // or
    router.replace('/login'); // Replace current history entry
    // or
    router.refresh(); // Refresh current route
    // or
    router.back(); // Go back
  };
  
  return <button onClick={handleClick}>Navigate</button>;
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Middleware & Edge Runtime */}
      <FullscreenSection id="middleware" title="Middleware" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6. Middleware & Edge Runtime
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement authentication, redirects, header manipulation, and edge functions using Next.js Middleware running on the Edge Runtime.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Middleware Pattern 1: Basic Setup
// middleware.ts (root of project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware runs before request is completed
  const response = NextResponse.next();
  
  // Add custom header
  response.headers.set('x-custom-header', 'value');
  
  return response;
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};

// ✅ Middleware Pattern 2: Authentication
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};

// ✅ Middleware Pattern 3: A/B Testing
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Random A/B test variant
  const variant = Math.random() > 0.5 ? 'a' : 'b';
  
  // Set cookie for consistent experience
  response.cookies.set('ab-variant', variant, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  // Add header for analytics
  response.headers.set('x-ab-variant', variant);
  
  return response;
}

// ✅ Middleware Pattern 4: Geolocation & Localization
export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US';
  const locale = request.headers.get('accept-language')?.split(',')[0] || 'en';
  
  // Redirect based on country/locale
  if (country === 'ES' && !request.nextUrl.pathname.startsWith('/es')) {
    return NextResponse.redirect(new URL('/es' + request.nextUrl.pathname, request.url));
  }
  
  const response = NextResponse.next();
  response.headers.set('x-country', country);
  response.headers.set('x-locale', locale);
  
  return response;
}

// ✅ Middleware Pattern 5: Rate Limiting
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const key = \`rate-limit:\\\${ip}\`;
  
  const requests = rateLimitMap.get(key) || [];
  const now = Date.now();
  const recentRequests = requests.filter((time: number) => now - time < 60000); // Last minute
  
  if (recentRequests.length >= 10) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  recentRequests.push(now);
  rateLimitMap.set(key, recentRequests);
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

// ✅ Middleware Pattern 6: Request Logging
export function middleware(request: NextRequest) {
  const start = Date.now();
  
  const response = NextResponse.next();
  
  // Log after response
  response.headers.set('x-response-time', \`\\\${Date.now() - start}ms\`);
  
  // Log to analytics
  console.log({
    method: request.method,
    path: request.nextUrl.pathname,
    ip: request.ip,
    userAgent: request.headers.get('user-agent'),
  });
  
  return response;
}

// ✅ Middleware Pattern 7: Security Headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

// ✅ Middleware Pattern 8: Feature Flags
export function middleware(request: NextRequest) {
  const featureFlag = request.cookies.get('feature-flag')?.value || 'default';
  
  const response = NextResponse.next();
  
  // Inject feature flag into headers
  response.headers.set('x-feature-flag', featureFlag);
  
  // Conditional redirects based on feature flag
  if (featureFlag === 'beta' && !request.nextUrl.pathname.startsWith('/beta')) {
    return NextResponse.rewrite(new URL('/beta' + request.nextUrl.pathname, request.url));
  }
  
  return response;
}

// ✅ Middleware Pattern 9: Bot Detection
export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
  
  const response = NextResponse.next();
  
  if (isBot) {
    response.headers.set('x-is-bot', 'true');
    // Serve cached or simplified version for bots
  }
  
  return response;
}

// ✅ Middleware Pattern 10: Multi-Region Routing
export function middleware(request: NextRequest) {
  const region = request.geo?.region || 'us-east';
  
  // Route to regional API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const apiUrl = new URL(request.nextUrl.pathname, \`https://api-\\\${region}.example.com\`);
    return NextResponse.rewrite(apiUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

// ✅ Edge Runtime Configuration
export const runtime = 'edge'; // Use Edge Runtime for faster cold starts

// ✅ Advanced Matcher Patterns
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Or specific patterns
    '/dashboard/:path*',
    '/admin/:path*',
    // Exclude patterns
    '/((?!login|register|_next/static).*)',
  ],
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Performance Optimization */}
      <FullscreenSection id="performance" title="Performance" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                7. Performance Optimization Strategies
              </Heading>
              <Text className={styles.sectionDescription}>
                Optimize Next.js applications for speed: image optimization, font optimization, code splitting, bundle optimization, and Core Web Vitals.
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Unoptimized images and fonts
export default function HomePage() {
  return (
    <div>
      {/* Unoptimized image - large file, no lazy loading */}
      <img src="/large-image.jpg" alt="Large image" />
      
      {/* Multiple unoptimized images */}
      <img src="/image1.jpg" />
      <img src="/image2.jpg" />
      <img src="/image3.jpg" />
      
      {/* No font optimization */}
      <link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet" />
    </div>
  );
}

// Problems:
// - Large bundle sizes
// - Slow page loads
// - Poor Core Web Vitals
// - No image optimization
// - Blocking font loading`}
              good={`// ✅ CORRECT: Optimized images and fonts
import Image from 'next/image';
import { Inter } from 'next/font/google';

// Optimize fonts at build time
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Don't block rendering
  variable: '--font-inter',
  preload: true,
});

export default function HomePage() {
  return (
    <div className={inter.variable}>
      {/* Optimized Next.js Image component */}
      <Image
        src="/large-image.jpg"
        alt="Large image"
        width={1200}
        height={800}
        priority // Load immediately (above fold)
        placeholder="blur"
        blurDataURL="data:image/..." // Low quality placeholder
      />
      
      {/* Lazy load images below fold */}
      <Image
        src="/image1.jpg"
        alt="Image 1"
        width={600}
        height={400}
        loading="lazy" // Default for below fold
      />
      
      {/* Responsive images */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={1920}
        height={1080}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="responsive-image"
      />
    </div>
  );
}

// ✅ Image Optimization Configuration
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
    ],
  },
};

// ✅ Font Optimization Best Practices
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const customFont = localFont({
  src: './fonts/custom-font.woff2',
  display: 'swap',
  variable: '--font-custom',
});

export default function RootLayout({ children }) {
  return (
    <html className={\`\\\${inter.variable} \\\${robotoMono.variable} \\\${customFont.variable}\`}>
      <body>{children}</body>
    </html>
  );
}

// ✅ Dynamic Imports for Code Splitting
import dynamic from 'next/dynamic';

// Lazy load heavy component
const HeavyChart = dynamic(() => import('./components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR if component uses browser APIs
});

export default function DashboardPage() {
  return (
    <div>
      <HeavyChart />
    </div>
  );
}

// ✅ Bundle Analysis
// Install: npm install @next/bundle-analyzer
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your config
});

// Run: ANALYZE=true npm run build

// ✅ Performance Monitoring
// app/layout.tsx
export function reportWebVitals(metric: any) {
  // Send to analytics
  if (typeof window !== 'undefined') {
    // Example: send to analytics service
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(metric),
    });
  }
}`}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Metadata & SEO */}
      <FullscreenSection id="metadata-seo" title="Metadata Seo" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                8. Metadata & SEO Best Practices
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement comprehensive SEO with dynamic metadata, Open Graph, Twitter Cards, structured data, and sitemap generation.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Pattern 1: Static Metadata
// app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company and mission',
  keywords: ['about', 'company', 'mission'],
};

export default function AboutPage() {
  return <div>About content</div>;
}

// ✅ Pattern 2: Dynamic Metadata
// app/blog/[slug]/page.tsx
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

// ✅ Pattern 3: Comprehensive Metadata
export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'Production-ready Next.js application',
  keywords: ['nextjs', 'react', 'web development'],
  authors: [{ name: 'John Doe', url: 'https://example.com' }],
  creator: 'John Doe',
  publisher: 'My Company',
  metadataBase: new URL('https://example.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    siteName: 'My App',
    title: 'My App',
    description: 'Production-ready Next.js application',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'Production-ready Next.js application',
    images: ['/twitter-image.jpg'],
    creator: '@username',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-token',
    yandex: 'verification-token',
    bing: 'verification-token',
  },
};

// ✅ Pattern 4: Structured Data (JSON-LD)
// app/components/StructuredData.tsx
export function ProductStructuredData({ product }: { product: Product }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// ✅ Pattern 5: Sitemap Generation
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://example.com';
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: \`\\\${baseUrl}/about\`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
  
  // Dynamic routes
  const posts = await getPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: \`\\\${baseUrl}/blog/\\\${post.slug}\`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
  
  return [...staticRoutes, ...postRoutes];
}

// ✅ Pattern 6: Robots.txt
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/'],
      },
    ],
    sitemap: 'https://example.com/sitemap.xml',
  };
}

// ✅ Pattern 7: Dynamic Open Graph Images
// app/og-image/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Default Title';
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// Use: <meta property="og:image" content="/og-image?title=My Post" />

// ✅ Pattern 8: Canonical URLs
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://example.com/post/slug',
  },
};

// ✅ Pattern 9: Language Alternates
export const metadata: Metadata = {
  alternates: {
    languages: {
      'en-US': 'https://example.com/en/post',
      'es-ES': 'https://example.com/es/post',
      'fr-FR': 'https://example.com/fr/post',
    },
  },
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Forms & Server Actions */}
      <FullscreenSection id="forms-server-actions" title="Forms Server Actions" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                9. Forms & Server Actions
              </Heading>
              <Text className={styles.sectionDescription}>
                Handle form submissions with Server Actions, progressive enhancement, validation, error handling, and optimistic updates.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Pattern 1: Server Actions
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // Validate input
  if (!title || !content) {
    return { error: 'Title and content are required' };
  }
  
  // Save to database
  const post = await db.posts.create({
    title,
    content,
  });
  
  // Revalidate and redirect
  revalidatePath('/posts');
    redirect(\`/posts/\\\${post.id}\`);
}

// ✅ Pattern 2: Form with Server Action
// app/posts/create/page.tsx
import { createPost } from '../actions';

export default function CreatePostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}

// ✅ Pattern 3: Server Action with Validation
'use server';

import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10),
});

export async function createPostWithValidation(
  prevState: any,
  formData: FormData
) {
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
  };
  
  // Validate with Zod
  const result = postSchema.safeParse(rawData);
  
  if (!result.success) {
    return {
      error: 'Validation failed',
      issues: result.error.issues,
    };
  }
  
  // Create post
  const post = await db.posts.create(result.data);
  
  return { success: true, postId: post.id };
}

// ✅ Pattern 4: useFormState Hook
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPostWithValidation } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPostWithValidation, null);
  
  return (
    <form action={formAction}>
      <input name="title" required />
      <textarea name="content" required />
      {state?.error && <div className="error">{state.error}</div>}
      {state?.issues && (
        <ul>
          {state.issues.map((issue: any) => (
            <li key={issue.path}>{issue.message}</li>
          ))}
        </ul>
      )}
      <SubmitButton />
    </form>
  );
}

// ✅ Pattern 5: Optimistic Updates
'use client';

import { useOptimistic } from 'react';
import { addComment } from './actions';

function CommentList({ comments }: { comments: Comment[] }) {
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: Comment) => [...state, newComment]
  );
  
  async function handleSubmit(formData: FormData) {
    const comment = {
      id: Date.now().toString(),
      text: formData.get('text') as string,
      pending: true,
    };
    
    // Optimistically add comment
    addOptimisticComment(comment);
    
    // Submit to server
    await addComment(formData);
  }
  
  return (
    <div>
      <form action={handleSubmit}>
        <input name="text" required />
        <button type="submit">Add Comment</button>
      </form>
      
      {optimisticComments.map((comment) => (
        <div key={comment.id}>
          {comment.text}
          {comment.pending && <span>(Pending...)</span>}
        </div>
      ))}
    </div>
  );
}

// ✅ Pattern 6: File Uploads
'use server';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { error: 'No file provided' };
  }
  
  // Validate file type and size
  if (file.size > 5 * 1024 * 1024) { // 5MB
    return { error: 'File too large' };
  }
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Save file (e.g., to S3, local storage, etc.)
  const path = await saveFile(buffer, file.name);
  
  return { success: true, path };
}

// ✅ Pattern 7: Progress Enhancement with Loading States
'use client';

import { useTransition } from 'react';
import { updateProfile } from './actions';

export default function ProfileForm({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  
  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await updateProfile(formData);
    });
  }
  
  return (
    <form action={handleSubmit}>
      <input name="name" defaultValue={user.name} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

// ✅ Pattern 8: Server Action Error Handling
'use server';

export async function deletePost(id: string) {
  try {
    await db.posts.delete(id);
    revalidatePath('/posts');
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { 
      error: 'Failed to delete post',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ✅ Pattern 9: Authentication in Server Actions
'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  // Create post as authenticated user
  const post = await db.posts.create({
    title: formData.get('title'),
    content: formData.get('content'),
    authorId: session.user.id,
  });
  
  return { success: true, postId: post.id };
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* TypeScript Patterns */}
      <FullscreenSection id="typescript-patterns" title="Typescript Patterns" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                10. TypeScript Patterns for Next.js
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement type-safe Next.js applications with proper TypeScript patterns, type definitions, and best practices.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Pattern 1: Typed Route Parameters
// app/posts/[id]/page.tsx
interface PageProps {
  params: {
    id: string;
  };
}

export default function PostPage({ params }: PageProps) {
  return <div>Post ID: {params.id}</div>;
}

// ✅ Pattern 2: Typed Search Params
interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
    category?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  
  return <div>Search: {query}, Page: {page}</div>;
}

// ✅ Pattern 3: Typed Layout Props
interface LayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export default function BlogLayout({ children, params }: LayoutProps) {
  return (
    <div>
      <h1>Blog: {params.slug}</h1>
      {children}
    </div>
  );
}

// ✅ Pattern 4: Typed Metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description',
};

// ✅ Pattern 5: Typed Server Actions
'use server';

type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createPost(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const post = await db.posts.create({
      title: formData.get('title') as string,
    });
    
    return { success: true, data: { id: post.id } };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ✅ Pattern 6: Typed API Routes
import { NextRequest, NextResponse } from 'next/server';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<User[]>>> {
  try {
    const users = await getUsers();
    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// ✅ Pattern 7: Type-safe Environment Variables
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    NEXT_PUBLIC_API_URL: string;
  }
}

// ✅ Pattern 8: Shared Types
// types/index.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
  author: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Pattern 9: Typed Dynamic Imports
const Component = dynamic<{ userId: string }>(
  () => import('./components/UserProfile'),
  {
    loading: () => <div>Loading...</div>,
  }
);

// ✅ Pattern 10: Generic API Handler
type HandlerFunction<T = any> = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse<T>>;

function createApiHandler<T>(
  handler: HandlerFunction<T>
): HandlerFunction<T> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export const GET = createApiHandler(async (request) => {
  const data = await fetchData();
  return NextResponse.json({ data });
});`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Production Patterns */}
      <FullscreenSection id="production-patterns" title="Production Patterns" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                11. Production-Ready Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                Implement production-grade patterns: error boundaries, monitoring, logging, environment configuration, and deployment best practices.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Pattern 1: Error Boundaries
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error to monitoring service
  useEffect(() => {
    console.error('Error:', error);
    // Send to error tracking service (Sentry, etc.)
    logErrorToService(error);
  }, [error]);
  
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// ✅ Pattern 2: Global Error Handler
// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}

// ✅ Pattern 3: Monitoring & Analytics
// lib/monitoring.ts
export function trackPageView(url: string) {
  if (typeof window !== 'undefined') {
    // Google Analytics, Plausible, etc.
    window.gtag?.('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
    });
  }
}

export function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    window.gtag?.('event', name, params);
  }
}

// ✅ Pattern 4: Environment Configuration
// lib/config.ts
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'My App',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    maintenance: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
  },
};

// ✅ Pattern 5: Maintenance Mode
// middleware.ts
export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true') {
    if (!request.nextUrl.pathname.startsWith('/maintenance')) {
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
  }
  
  return NextResponse.next();
}

// ✅ Pattern 6: Feature Flags
// lib/features.ts
export const features = {
  newDashboard: process.env.NEXT_PUBLIC_FEATURE_NEW_DASHBOARD === 'true',
  betaFeatures: process.env.NEXT_PUBLIC_BETA_FEATURES === 'true',
};

export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature] || false;
}

// ✅ Pattern 7: Logging Utility
// lib/logger.ts
type LogLevel = 'info' | 'warn' | 'error';

export function logger(level: LogLevel, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data }),
  };
  
  // Console logging
  console[level](logEntry);
  
  // Send to logging service in production
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
    }).catch(() => {
      // Fail silently if logging fails
    });
  }
}

// ✅ Pattern 8: Health Check Endpoint
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw\`SELECT 1\`;
    
    // Check external services
    const externalServiceStatus = await checkExternalService();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        external: externalServiceStatus,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

// ✅ Pattern 9: Rate Limiting
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function rateLimitMiddleware(identifier: string, limit: number = 10) {
  const count = rateLimit.get(identifier) as number | undefined;
  
  if (count === undefined) {
    rateLimit.set(identifier, 1);
    return { allowed: true, remaining: limit - 1 };
  }
  
  if (count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  
  rateLimit.set(identifier, count + 1);
  return { allowed: true, remaining: limit - count - 1 };
}

// ✅ Pattern 10: Security Headers
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

// ✅ Pattern 11: Database Connection Pooling
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// ✅ Pattern 12: Optimized Build Configuration
// next.config.js
module.exports = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: ['@mui/material', 'lodash'],
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
            },
          },
        },
      };
    }
    return config;
  },
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Real-World Examples */}
      <FullscreenSection id="real-world-examples" title="Real World Examples" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                12. Real-World Application Examples
              </Heading>
              <Text className={styles.sectionDescription}>
                Complete, production-ready examples: e-commerce product page, dashboard with real-time data, blog with comments, and authentication flow.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Example 1: E-commerce Product Page
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';
import AddToCartButton from './components/AddToCartButton';
import ProductReviews from './components/ProductReviews';

async function getProduct(id: string) {
  const res = await fetch(\`https://api.example.com/products/\\\${id}\`, {
    next: { revalidate: 3600 },
  });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="product-page">
      <div className="product-images">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          priority
        />
      </div>
      
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">$\\\${product.price}</p>
        <p>{product.description}</p>
        
        <Suspense fallback={<div>Loading...</div>}>
          <AddToCartButton productId={product.id} />
        </Suspense>
        
        <Suspense fallback={<ReviewsSkeleton />}>
          <ProductReviews productId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}

// ✅ Example 2: Dashboard with Real-time Data
// app/dashboard/page.tsx
import { Suspense } from 'react';
import RevenueChart from './components/RevenueChart';
import UserStats from './components/UserStats';
import RecentActivity from './components/RecentActivity';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <Suspense fallback={<StatSkeleton />}>
          <RevenueChart />
        </Suspense>
        
        <Suspense fallback={<StatSkeleton />}>
          <UserStats />
        </Suspense>
      </div>
      
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}

// app/dashboard/components/RevenueChart.tsx
async function getRevenue() {
  const res = await fetch('https://api.example.com/revenue', {
    cache: 'no-store', // Always fresh
  });
  
  return res.json();
}

export default async function RevenueChart() {
  const revenue = await getRevenue();
  
  return (
    <div>
      <h2>Revenue</h2>
      <Chart data={revenue} />
    </div>
  );
}

// ✅ Example 3: Blog with Comments
// app/blog/[slug]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import PostContent from './components/PostContent';
import CommentsSection from './components/CommentsSection';

async function getPost(slug: string) {
  const res = await fetch(\`https://api.example.com/posts/\\\${slug}\`, {
    next: { revalidate: 3600 },
  });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article>
      <PostContent post={post} />
      
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsSection postId={post.id} />
      </Suspense>
    </article>
  );
}

// ✅ Example 4: Authentication Flow
// app/login/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import LoginForm from './components/LoginForm';

export default async function LoginPage() {
  const session = await auth();
  
  // Redirect if already authenticated
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <div className="login-page">
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}

// app/login/components/LoginForm.tsx
'use client';

import { useFormState } from 'react-dom';
import { login } from '../actions';

export default function LoginForm() {
  const [state, formAction] = useFormState(login, null);
  
  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      
      {state?.error && (
        <div className="error">{state.error}</div>
      )}
      
      <button type="submit">Login</button>
    </form>
  );
}

// app/login/actions.ts
'use server';

import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    redirect('/dashboard');
  } catch (error) {
    return {
      error: 'Invalid credentials',
    };
  }
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Senior Tooling & Testing Playbook */}
      <FullscreenSection id="senior-tooling" title="Senior Tooling" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                13. Senior Next.js Tooling & Testing Playbook
              </Heading>
              <Text className={styles.sectionDescription}>
                Production-grade patterns for a senior workflow: edge runtime, cache-control, server actions with validation, revalidation, observability, and type-safe testing with Playwright/Vitest/MSW.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Edge Runtime + Geo A/B with Middleware
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: ['/checkout/:path*', '/promo'],
};

export function middleware(req: NextRequest) {
  const country = req.geo?.country || 'US';
  const url = req.nextUrl.clone();

  // Send some countries to lightweight edge experience
  if (country === 'BR') {
    url.pathname = '/promo/latam';
    return NextResponse.rewrite(url);
  }

  // Security headers at the edge
  const res = NextResponse.next();
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return res;
}

// ✅ Cache Strategy + Tag Revalidation
// app/api/products/route.ts
import { revalidateTag } from 'next/cache';

export const revalidate = 3600; // 1h ISR for this route segment

export async function GET() {
  const products = await fetchProducts(); // server-only call
  return Response.json({ data: products }, { status: 200, headers: { 'Cache-Control': 's-maxage=3600' } });
}

export async function POST(request: Request) {
  const body = await request.json();
  await createProduct(body);
  revalidateTag('products'); // bust all pages/components using this tag
  return Response.json({ ok: true }, { status: 201 });
}

// ✅ Server Action with Zod validation + typed result
// app/(admin)/products/actions.ts
'use server';
import { z } from 'zod';
import { revalidatePath, revalidateTag } from 'next/cache';

const ProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  tags: z.array(z.string()).optional(),
});

export async function createProductAction(_prev: unknown, formData: FormData) {
  const parsed = ProductSchema.safeParse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
    tags: formData.getAll('tags'),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  await db.product.create({ data: parsed.data });
  revalidateTag('products');
  revalidatePath('/dashboard/products');
  return { success: true };
}

// ✅ Observability hook (instrumentation)
// instrumentation.ts
import type { OpenTelemetryConfig } from 'next';

export const registerOTel = (): OpenTelemetryConfig => ({
  resourceDetectors: [],
  instrumentations: {
    http: { enabled: true },
    fetch: { enabled: true },
  },
});

// ✅ Type-safe env (server + client)
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_ENABLE_ANALYTICS?: 'true' | 'false';
    DATABASE_URL: string;
    SENTRY_DSN?: string;
  }
}

// ✅ Playwright E2E with seeded data
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});

// tests/e2e/cart.spec.ts
import { test, expect } from '@playwright/test';

test('adds item to cart', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.goto('/cart');
  await expect(page.getByText('Subtotal')).toBeVisible();
});

// ✅ Vitest + MSW for server/client units
// tests/product.test.ts
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getProducts } from '../app/api/products/data';

const server = setupServer(
  http.get('https://api.example.com/products', () => HttpResponse.json([{ id: 1, name: 'Test' }])),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('getProducts', () => {
  it('returns data', async () => {
    const products = await getProducts();
    expect(products[0].name).toBe('Test');
  });
});`}
              language="tsx"
              readOnly
            />
          </Stack>
        </Card>
      </FullscreenSection>
    </BlogContentLayout>
  );
}
