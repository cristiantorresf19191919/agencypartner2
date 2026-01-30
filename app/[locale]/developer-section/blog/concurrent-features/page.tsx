"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function ConcurrentFeaturesPage() {
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
          <li className={styles.breadcrumbCurrent}>Concurrent Features</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          React Concurrent Features & Suspense
        </Heading>
        <Text className={styles.subtitle}>
          Deep dive into React 18+ concurrent features: Suspense, useDeferredValue, useTransition, streaming SSR, and how to build responsive UIs that never block the user experience.
        </Text>
      </div>

      {/* Suspense & Error Boundaries */}
      <section id="suspense" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. Suspense & Error Boundaries
              </Heading>
              <Text className={styles.sectionDescription}>
                Use Suspense to declaratively handle loading states and combine with Error Boundaries for robust async data loading.
              </Text>
            </div>

            <CodeEditor
              code={`import { Suspense } from 'react';

const MOCK_USER = { name: "Demo User", email: "demo@example.com" };
function fetchUser() {
  const p = new Promise((r) => setTimeout(() => r(MOCK_USER), 600));
  (p as any).status = undefined;
  return p;
}

function use<T>(promise: Promise<T>): T {
  const p = promise as any;
  if (p.status === 'fulfilled') return p.value;
  if (p.status === 'rejected') throw p.reason;
  if (p.status === 'pending') throw promise;
  p.status = 'pending';
  promise.then(
    (result) => { p.status = 'fulfilled'; p.value = result; },
    (reason) => { p.status = 'rejected'; p.reason = reason; }
  );
  throw promise;
}

function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchUser());
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

function ErrorFallback() { return <div style={{ color: '#f87171' }}>Error</div>; }
function UserProfileSkeleton() { return <div>Loading user...</div>; }

function App() {
  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfile userId="123" />
    </Suspense>
  );
}
export default App;`}
              language="tsx"
              readOnly={false}
            />
          </Stack>
        </Card>
      </section>

      {/* useDeferredValue */}
      <section id="use-deferred-value" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. useDeferredValue Pattern
              </Heading>
              <Text className={styles.sectionDescription}>
                Defer non-urgent updates to keep the UI responsive. Perfect for search inputs, filters, and heavy computations.
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Blocks UI during filtering
function SearchList({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');

  const filtered = items.filter(item => 
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input 
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {/* Input feels laggy with 10,000 items */}
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`}
              good={`// ✅ CORRECT: Deferred filtering keeps input responsive
import { useState, useDeferredValue, useMemo } from 'react';

function SearchList({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    return items.filter(item => 
      item.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [items, deferredQuery]);

  const isPending = query !== deferredQuery;

  return (
    <div>
      <input 
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
        style={{ opacity: isPending ? 0.5 : 1 }}
      />
      {/* Input stays responsive, filtering happens in background */}
      {isPending && <div>Searching...</div>}
      <ul>
        {filtered.map(item => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`}
            />
          </Stack>
        </Card>
      </section>

      {/* useTransition */}
      <section id="use-transition" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. useTransition for Non-Blocking UI
              </Heading>
              <Text className={styles.sectionDescription}>
                Mark state updates as transitions to keep urgent updates (like typing) responsive while heavy updates happen in the background.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Tab switching with transitions
import { useState, useTransition } from 'react';

function TabContainer({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tabId: string) => {
    // Urgent: Update active tab immediately
    setActiveTab(tabId);
    
    // Non-urgent: Heavy content loading happens in transition
    startTransition(() => {
      // This won't block the tab switch
      loadTabContent(tabId);
    });
  };

  return (
    <div>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={activeTab === tab.id ? 'active' : ''}
            disabled={isPending}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {isPending && <div>Loading...</div>}
      
      <div className="tab-content">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
}

// ✅ List filtering with transition
function FilterableList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (value: string) => {
    // Urgent: Update input immediately
    setFilter(value);
    
    // Non-urgent: Filtering happens in background
    startTransition(() => {
      // Heavy filtering won't block input
    });
  };

  const filtered = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div>
      <input
        value={filter}
        onChange={e => handleFilterChange(e.target.value)}
        placeholder="Filter..."
      />
      {isPending && <span>Filtering...</span>}
      <ul>
        {filtered.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}`}
              language="tsx"
              readOnly={false}
            />
          </Stack>
        </Card>
      </section>

      {/* Streaming SSR */}
      <section id="streaming-ssr" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Streaming SSR
              </Heading>
              <Text className={styles.sectionDescription}>
                Stream HTML to the client progressively, showing content as it becomes available instead of waiting for everything.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Next.js 13+ App Router with Streaming
// app/page.tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Header />
      
      {/* This streams immediately */}
      <Suspense fallback={<ContentSkeleton />}>
        <FastContent />
      </Suspense>
      
      {/* This streams after FastContent */}
      <Suspense fallback={<SlowContentSkeleton />}>
        <SlowContent />
      </Suspense>
    </div>
  );
}

// ✅ Server Component with async data
async function SlowContent() {
  // This runs on the server
  const data = await fetchSlowData(); // Takes 2 seconds
  
  return <div>{data.content}</div>;
}

// ✅ React Server Components pattern
// Server Component
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <UserPosts userId={userId} />
    </div>
  );
}

// Nested Server Component
async function UserPosts({ userId }: { userId: string }) {
  const posts = await fetchUserPosts(userId);
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// ✅ Progressive Enhancement
function ProgressivePage() {
  return (
    <div>
      {/* Critical content loads first */}
      <CriticalContent />
      
      {/* Non-critical content streams in */}
      <Suspense fallback={null}>
        <NonCriticalContent />
      </Suspense>
    </div>
  );
}`}
              language="tsx"
              readOnly={false}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

