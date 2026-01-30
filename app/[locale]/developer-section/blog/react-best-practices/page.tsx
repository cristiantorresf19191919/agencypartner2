"use client";

import React from "react";
import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import { useBlogPostContent } from "@/lib/blogTranslations";
import { getCategoryForPost } from "@/lib/blogCategories";
import styles from "../BlogPostPage.module.css";

export default function ReactBestPracticesPage() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const postContent = useBlogPostContent("react-best-practices", language);
  const category = getCategoryForPost("react-best-practices");

  return (
    <BlogContentLayout>
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
                  {category.title}
                </ButtonLink>
              </li>
            </>
          )}
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>
            {postContent?.breadcrumbLabel || "Vercel React Best Practices"}
          </li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          {postContent?.title || "Vercel React Best Practices"}
        </Heading>
        <Text className={styles.subtitle}>
          {postContent?.subtitle ||
            "Comprehensive performance optimization guide for React and Next.js applications from Vercel Engineering. 45+ rules across 8 categories: eliminating waterfalls, bundle size, server-side performance, client data fetching, re-renders, rendering, JavaScript micro-optimizations, and advanced patterns. Each rule includes editable code examples with live preview."}
        </Text>
        {postContent?.introParagraph && (
          <Text className={`${styles.sectionDescription} mt-3`}>
            {postContent.introParagraph}
          </Text>
        )}
      </div>

      {(postContent?.categoriesDescription) && (
        <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
          <Text className={styles.infoText}>
            {postContent.categoriesDescription}
          </Text>
        </div>
      )}

      {/* 1. Eliminating Waterfalls */}
      <section id="eliminating-waterfalls" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              1. Eliminating Waterfalls (CRITICAL)
            </Heading>
            <Text className={styles.sectionDescription}>
              Waterfalls are the #1 performance killer. Each sequential await adds full network latency. Execute independent operations in parallel and defer await until the branch that needs it.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Promise.all() for Independent Operations</Heading>
            <Text className="text-white/80 text-sm mb-3">Run both panels to see the difference: the bad example waits for each fetch one after another; the good example runs them in parallel.</Text>
            <CodeComparison
              comparisonId="waterfalls-promise-all"
              language="tsx"
              whatToNoticeBad={[
                "Three sequential awaits: each call waits for the previous to finish.",
                "Total time = sum of all latencies (e.g. 300ms + 300ms + 300ms).",
              ]}
              whatToNoticeGood={[
                "Promise.all() starts all fetches at once.",
                "Total time = slowest single request (e.g. ~300ms).",
              ]}
              wrong={`// ❌ Sequential: each await blocks the next (waterfall)
const fetchUser = () => new Promise(r => setTimeout(() => r({ name: 'User' }), 400));
const fetchPosts = () => new Promise(r => setTimeout(() => r([{ id: 1 }]), 400));
const fetchComments = () => new Promise(r => setTimeout(() => r([{ id: 1 }]), 400));

function App() {
  const [result, setResult] = React.useState(null);
  const [timing, setTiming] = React.useState('');
  React.useEffect(() => {
    const start = performance.now();
    (async () => {
      const user = await fetchUser();
      const posts = await fetchPosts();
      const comments = await fetchComments();
      setResult({ user, posts, comments });
      setTiming(((performance.now() - start) / 1000).toFixed(2) + 's');
    })();
  }, []);
  return <div>Sequential: {timing || 'loading...'} (3 × 400ms)</div>;
}
export default App;`}
              good={`// ✅ Parallel: all fetches start together
const fetchUser = () => new Promise(r => setTimeout(() => r({ name: 'User' }), 400));
const fetchPosts = () => new Promise(r => setTimeout(() => r([{ id: 1 }]), 400));
const fetchComments = () => new Promise(r => setTimeout(() => r([{ id: 1 }]), 400));

function App() {
  const [result, setResult] = React.useState(null);
  const [timing, setTiming] = React.useState('');
  React.useEffect(() => {
    const start = performance.now();
    Promise.all([fetchUser(), fetchPosts(), fetchComments()]).then(([user, posts, comments]) => {
      setResult({ user, posts, comments });
      setTiming(((performance.now() - start) / 1000).toFixed(2) + 's');
    });
  }, []);
  return <div>Parallel: {timing || 'loading...'} (~400ms)</div>;
}
export default App;`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Defer Await Until Needed</Heading>
            <CodeComparison
              comparisonId="waterfalls-defer-await"
              language="typescript"
              whatToNoticeBad={[
                "await runs before the skip check: we always fetch userData even when we will skip.",
                "Wastes latency and server work when skipProcessing is true.",
              ]}
              whatToNoticeGood={[
                "Early return before any await: no fetch when we are going to skip.",
                "Only fetch when we actually need the data.",
              ]}
              wrong={`async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  if (skipProcessing) return { skipped: true }
  return processUserData(userData)
}`}
              good={`async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) return { skipped: true }
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Dependency-Based Parallelization (better-all)</Heading>
            <CodeComparison
              comparisonId="waterfalls-better-all"
              language="typescript"
              whatToNoticeBad={[
                "First we wait for user and config; then we wait for profile (depends on user.id).",
                "Two round-trips: cannot start fetchProfile until user is ready.",
              ]}
              whatToNoticeGood={[
                "better-all runs independent tasks in parallel and resolves dependencies (profile needs user).",
                "user and config start immediately; profile starts as soon as user is available.",
              ]}
              wrong={`const [user, config] = await Promise.all([fetchUser(), fetchConfig()])
const profile = await fetchProfile(user.id)`}
              good={`import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Prevent Waterfall Chains in API Routes</Heading>
            <CodeComparison
              comparisonId="waterfalls-api-routes"
              language="typescript"
              whatToNoticeBad={[
                "Each await blocks the next: session → config → data in sequence.",
                "Total latency = sum of auth + fetchConfig + fetchData.",
              ]}
              whatToNoticeGood={[
                "Start auth and fetchConfig immediately; only await session before fetchData (it depends on session).",
                "config loads in parallel with session; then data loads using session.user.id.",
              ]}
              wrong={`export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}`}
              good={`export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Strategic Suspense Boundaries</Heading>
            <CodeComparison
              comparisonId="waterfalls-suspense"
              language="tsx"
              whatToNoticeBad={[
                "Page is async and awaits fetchData: nothing renders until data is ready.",
                "User sees a blank page until the slowest data loads (blocking).",
              ]}
              whatToNoticeGood={[
                "Suspense wraps only the part that needs data; Sidebar, Header, Footer render immediately.",
                "DataDisplay fetches inside; Suspense shows Skeleton until ready (streaming).",
              ]}
              wrong={`async function Page() {
  const data = await fetchData()
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div><DataDisplay data={data} /></div>
      <div>Footer</div>
    </div>
  )
}`}
              good={`function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData()
  return <div>{data.content}</div>
}`}
            />
          </Stack>
        </Card>
      </section>

      {/* 2. Bundle Size */}
      <section id="bundle-size" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              2. Bundle Size Optimization (CRITICAL)
            </Heading>
            <Text className={styles.sectionDescription}>
              Import directly from source, avoid barrel files, use dynamic imports for heavy components, defer third‑party scripts, and preload on hover/focus.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Avoid Barrel File Imports</Heading>
            <CodeComparison
              comparisonId="bundle-barrel"
              language="tsx"
              wrong={`import { Check, X, Menu } from 'lucide-react'
import { Button, TextField } from '@mui/material'`}
              good={`import Check from 'lucide-react/dist/esm/icons/check'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Or: next.config.js experimental.optimizePackageImports: ['lucide-react', '@mui/material']`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Dynamic Imports for Heavy Components</Heading>
            <CodeComparison
              comparisonId="bundle-dynamic"
              language="tsx"
              wrong={`import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }) {
  return <MonacoEditor value={code} />
}`}
              good={`import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }) {
  return <MonacoEditor value={code} />
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Defer Non-Critical Third-Party Libraries</Heading>
            <CodeComparison
              comparisonId="bundle-defer-thirdparty"
              language="tsx"
              wrong={`import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html><body>{children}<Analytics /></body></html>
  )
}`}
              good={`import dynamic from 'next/dynamic'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false }
)

export default function RootLayout({ children }) {
  return (
    <html><body>{children}<Analytics /></body></html>
  )
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Conditional Module Loading</Heading>
            <CodeEditor
              code={`function AnimationPlayer({ enabled, setEnabled }) {
  const [frames, setFrames] = useState(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js')
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <div className="h-20 bg-gray-200 animate-pulse" />
  return <div>Canvas with {frames.length} frames</div>
}`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Preload on Hover/Focus</Heading>
            <CodeEditor
              code={`function EditorButton({ onClick }) {
  const preload = () => {
    if (typeof window !== 'undefined') void import('./monaco-editor')
  }
  return (
    <button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
      Open Editor
    </button>
  )
}`}
              language="tsx"
              readOnly={false}
            />
          </Stack>
        </Card>
      </section>

      {/* 3. Server-Side Performance */}
      <section id="server-side" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              3. Server-Side Performance (HIGH)
            </Heading>
            <Text className={styles.sectionDescription}>
              Use React.cache() for per-request deduplication, LRU for cross-request cache, minimize serialization at RSC boundaries, parallelize with composition, and use after() for non-blocking work.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Per-Request Deduplication with React.cache()</Heading>
            <CodeComparison
              comparisonId="server-cache"
              language="typescript"
              wrong={`const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})
getUser({ uid: 1 })
getUser({ uid: 1 })  // Cache miss`}
              good={`import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({ where: { id: session.user.id } })
})

const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})
getUser(1)
getUser(1)  // Cache hit`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Cross-Request LRU Caching</Heading>
            <CodeEditor
              code={`import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached
  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}`}
              language="typescript"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Minimize Serialization at RSC Boundaries</Heading>
            <CodeComparison
              comparisonId="server-serialization"
              language="tsx"
              wrong={`async function Page() {
  const user = await fetchUser()
  return <Profile user={user} />
}
'use client'
function Profile({ user }) {
  return <div>{user.name}</div>
}`}
              good={`async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}
'use client'
function Profile({ name }) {
  return <div>{name}</div>
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Parallel Data Fetching with Composition</Heading>
            <CodeComparison
              comparisonId="server-parallel"
              language="tsx"
              wrong={`export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}
async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(i => <span key={i}>{i}</span>)}</nav>
}`}
              good={`async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}
async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(i => <span key={i}>{i}</span>)}</nav>
}
export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Use after() for Non-Blocking Operations</Heading>
            <CodeComparison
              comparisonId="server-after"
              language="tsx"
              wrong={`export async function POST(request: Request) {
  await updateDatabase(request)
  await logUserAction({ userAgent: request.headers.get('user-agent') })
  return new Response(JSON.stringify({ status: 'success' }))
}`}
              good={`import { after } from 'next/server'
import { headers, cookies } from 'next/headers'

export async function POST(request: Request) {
  await updateDatabase(request)
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value
    logUserAction({ sessionCookie, userAgent })
  })
  return new Response(JSON.stringify({ status: 'success' }))
}`}
            />
          </Stack>
        </Card>
      </section>

      {/* 4. Client-Side Data Fetching */}
      <section id="client-data" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              4. Client-Side Data Fetching (MEDIUM-HIGH)
            </Heading>
            <Text className={styles.sectionDescription}>
              Use SWR for deduplication, deduplicate global event listeners, use passive listeners for scroll, and version/minimize localStorage.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Use SWR for Automatic Deduplication</Heading>
            <CodeComparison
              comparisonId="client-swr"
              language="tsx"
              wrong={`function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)
  }, [])
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}`}
              good={`import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
  return <ul>{(users||[]).map(u => <li key={u.id}>{u.name}</li>)}</ul>
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Deduplicate Global Event Listeners</Heading>
            <CodeEditor
              code={`import useSWRSubscription from 'swr/subscription'

const keyCallbacks = new Map()

function useKeyboardShortcut(key, callback) {
  useEffect(() => {
    if (!keyCallbacks.has(key)) keyCallbacks.set(key, new Set())
    keyCallbacks.get(key).add(callback)
    return () => {
      const set = keyCallbacks.get(key)
      if (set) { set.delete(callback); if (set.size === 0) keyCallbacks.delete(key) }
    }
  }, [key, callback])

  useSWRSubscription('global-keydown', () => {
    const handler = (e) => {
      if (e.metaKey && keyCallbacks.has(e.key))
        keyCallbacks.get(e.key).forEach(cb => cb())
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Passive Event Listeners for Scroll</Heading>
            <CodeComparison
              comparisonId="client-passive"
              language="typescript"
              wrong={`document.addEventListener('touchstart', handleTouch)
document.addEventListener('wheel', handleWheel)`}
              good={`document.addEventListener('touchstart', handleTouch, { passive: true })
document.addEventListener('wheel', handleWheel, { passive: true })`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Version and Minimize localStorage</Heading>
            <Text className="text-slate-300 mb-4 text-sm">
              Add version prefix to keys and store only needed fields. Prevents schema conflicts and accidental storage of sensitive data. Always wrap in try-catch as getItem/setItem throw in incognito mode or when quota is exceeded.
            </Text>
            <CodeComparison
              comparisonId="client-localstorage"
              language="typescript"
              wrong={`// No version, stores everything, no error handling
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')`}
              good={`const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(\`userConfig:\${VERSION}\`, JSON.stringify(config))
  } catch {
    // Throws in incognito/private browsing, quota exceeded, or disabled
  }
}

function loadConfig() {
  try {
    const data = localStorage.getItem(\`userConfig:\${VERSION}\`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Migration from v1 to v2
function migrate() {
  try {
    const v1 = localStorage.getItem('userConfig:v1')
    if (v1) {
      const old = JSON.parse(v1)
      saveConfig({ theme: old.darkMode ? 'dark' : 'light', language: old.lang })
      localStorage.removeItem('userConfig:v1')
    }
  } catch {}
}

// Store minimal fields from server responses
function cachePrefs(user: FullUser) {
  try {
    localStorage.setItem('prefs:v1', JSON.stringify({
      theme: user.preferences.theme,
      notifications: user.preferences.notifications
    }))
  } catch {}
}`}
            />
            <Text className="text-slate-400 text-xs mt-2">
              Benefits: Schema evolution via versioning, reduced storage size, prevents storing tokens/PII/internal flags.
            </Text>
          </Stack>
        </Card>
      </section>

      {/* 5. Re-render Optimization */}
      <section id="rerender" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              5. Re-render Optimization (MEDIUM)
            </Heading>
            <Text className={styles.sectionDescription}>
              Defer state reads to usage, extract to memoized components, narrow effect deps, subscribe to derived booleans, use functional setState, lazy state init, and startTransition for non-urgent updates.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Defer State Reads to Usage Point</Heading>
            <CodeComparison
              comparisonId="rerender-share"
              language="tsx"
              wrong={`function ShareButton({ chatId }) {
  const searchParams = useSearchParams()
  const handleShare = () => {
    shareChat(chatId, { ref: searchParams.get('ref') })
  }
  return <button onClick={handleShare}>Share</button>
}`}
              good={`function ShareButton({ chatId }) {
  const handleShare = () => {
    const ref = new URLSearchParams(window.location.search).get('ref')
    shareChat(chatId, { ref })
  }
  return <button onClick={handleShare}>Share</button>
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Extract to Memoized Components</Heading>
            <CodeComparison
              comparisonId="rerender-profile"
              language="tsx"
              wrong={`function Profile({ user, loading }) {
  const avatar = useMemo(() => <Avatar id={computeAvatarId(user)} />, [user])
  if (loading) return <div className="h-20 bg-gray-200" />
  return <div>{avatar}</div>
}`}
              good={`import { memo } from 'react'
const UserAvatar = memo(function UserAvatar({ user }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }) {
  if (loading) return <div className="h-20 bg-gray-200" />
  return <div><UserAvatar user={user} /></div>
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Interactive Example: Memoized Components</Heading>
            <CodeEditor
              code={`import { useState, memo, useMemo } from 'react'

// ✅ Correct: Memoized component enables early return
const UserAvatar = memo(function UserAvatar({ user }) {
  const avatarId = useMemo(() => {
    // Expensive computation
    return user.name.toLowerCase().replace(/\\s+/g, '-')
  }, [user.name])
  
  return (
    <div style={{ padding: '1rem', background: '#1e293b', borderRadius: '8px' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        {user.avatar || '👤'}
      </div>
      <div style={{ color: '#94a3b8' }}>ID: {avatarId}</div>
      <div style={{ color: '#fff', fontWeight: 'bold' }}>{user.name}</div>
    </div>
  )
})

function Profile({ user, loading }) {
  // Early return - no expensive computation when loading
  if (loading) {
    return (
      <div style={{ padding: '1rem', background: '#334155', borderRadius: '8px' }}>
        <div style={{ height: '20px', background: '#475569', borderRadius: '4px', marginBottom: '0.5rem' }} />
        <div style={{ height: '16px', background: '#475569', borderRadius: '4px', width: '60%' }} />
      </div>
    )
  }
  
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}

export const App = () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({ name: 'John Doe', avatar: '👨‍💻' })
  
  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Memoized Component Demo</h2>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setLoading(!loading)}
          style={{
            padding: '0.5rem 1rem',
            background: loading ? '#ef4444' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Show Loading' : 'Show Profile'}
        </button>
        <button
          onClick={() => setUser({ ...user, name: user.name === 'John Doe' ? 'Jane Smith' : 'John Doe' })}
          style={{
            padding: '0.5rem 1rem',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Change User
        </button>
      </div>
      
      <Profile user={user} loading={loading} />
      
      <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '1rem' }}>
        {loading 
          ? '✅ Early return - no expensive computation' 
          : '✅ Avatar computed only when needed'}
      </p>
    </div>
  )
}`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Narrow Effect Dependencies</Heading>
            <CodeComparison
              comparisonId="rerender-effect-deps"
              language="tsx"
              wrong={`useEffect(() => { console.log(user.id) }, [user])`}
              good={`useEffect(() => { console.log(user.id) }, [user.id])`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Subscribe to Derived State</Heading>
            <Text className="text-slate-300 mb-4 text-sm">
              Subscribe to derived boolean state instead of continuous values to reduce re-render frequency. Re-renders only when the boolean changes, not on every pixel change.
            </Text>
            <CodeComparison
              comparisonId="rerender-sidebar"
              language="tsx"
              wrong={`function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}`}
              good={`function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')  // re-renders only when boolean changes
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}`}
            />
            <CodeEditor
              code={`import { useState, useEffect } from 'react'

// ✅ Correct: Subscribe to derived boolean
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [query])

  return matches
}

// ❌ Wrong: Subscribe to continuous value
function useWindowWidth() {
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return 0
    return window.innerWidth
  })

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return width
}

function Sidebar() {
  // ✅ Only re-renders when crossing 767px threshold
  const isMobile = useMediaQuery('(max-width: 767px)')
  
  return (
    <nav style={{
      padding: '1rem',
      background: isMobile ? '#1e293b' : '#0f172a',
      color: '#fff',
      borderRadius: '8px'
    }}>
      <div style={{ marginBottom: '0.5rem' }}>
        Mode: {isMobile ? 'Mobile' : 'Desktop'}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
        ✅ Re-renders only when boolean changes
        <br />
        ✅ Not on every pixel resize
      </div>
    </nav>
  )
}

export const App = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#fff', marginBottom: '1rem' }}>
        Derived State Demo
      </h2>
      <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
        Resize the window to see the difference. The component only re-renders
        when crossing the 767px threshold, not on every pixel change.
      </p>
      <Sidebar />
    </div>
  )
}`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Use Functional setState Updates</Heading>
            <CodeComparison
              comparisonId="rerender-callback"
              language="tsx"
              wrong={`const addItems = useCallback((newItems) => {
  setItems([...items, ...newItems])
}, [items])

const removeItem = useCallback((id) => {
  setItems(items.filter(item => item.id !== id))
}, [])`}
              good={`const addItems = useCallback((newItems) => {
  setItems(curr => [...curr, ...newItems])
}, [])

const removeItem = useCallback((id) => {
  setItems(curr => curr.filter(item => item.id !== id))
}, [])`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Interactive Example: Functional setState</Heading>
            <CodeEditor
              code={`import { useState, useCallback } from 'react'

function TodoList() {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build app' }
  ])
  
  // ✅ Correct: Functional setState - stable callback
  const addItems = useCallback((newItems) => {
    setItems(curr => [...curr, ...newItems])
  }, []) // No dependency on items!
  
  // ✅ Correct: Functional setState - stable callback
  const removeItem = useCallback((id) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, []) // No dependency on items!
  
  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Todo List</h2>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => addItems([
            { id: Date.now(), text: 'New Task ' + Date.now() }
          ])}
          style={{
            padding: '0.5rem 1rem',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Add Item
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              padding: '0.75rem',
              background: '#1e293b',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ color: '#fff' }}>{item.text}</span>
            <button
              onClick={() => removeItem(item.id)}
              style={{
                padding: '0.25rem 0.75rem',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: '#14532d', 
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#86efac'
      }}>
        ✅ Callbacks are stable (no dependency on items)
        <br />
        ✅ Functional setState prevents stale closures
        <br />
        ✅ Better performance - callbacks don't recreate
      </div>
    </div>
  )
}

export const App = () => <TodoList />`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Use Lazy State Initialization</Heading>
            <CodeComparison
              comparisonId="rerender-settings"
              language="tsx"
              wrong={`const [settings, setSettings] = useState(
  JSON.parse(localStorage.getItem('settings') || '{}')
)`}
              good={`const [settings, setSettings] = useState(() => {
  const stored = localStorage.getItem('settings')
  return stored ? JSON.parse(stored) : {}
})`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Interactive Example: Lazy State Initialization</Heading>
            <CodeEditor
              code={`import { useState } from 'react'

// Simulate localStorage
const mockStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage?.getItem(key)
    return stored || null
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem(key, value)
    }
  }
}

// Initialize with mock data for demo
if (typeof window !== 'undefined' && !mockStorage.getItem('settings')) {
  mockStorage.setItem('settings', JSON.stringify({ theme: 'dark', lang: 'en' }))
}

function SettingsPanel() {
  // ✅ Correct: Lazy initialization - only runs once
  const [settings, setSettings] = useState(() => {
    const stored = mockStorage.getItem('settings')
    console.log('Initializing settings (runs only once)...')
    return stored ? JSON.parse(stored) : { theme: 'light', lang: 'en' }
  })
  
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    mockStorage.setItem('settings', JSON.stringify(newSettings))
  }
  
  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Settings</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>
          Theme
        </label>
        <select
          value={settings.theme}
          onChange={(e) => updateSetting('theme', e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
            borderRadius: '6px'
          }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>
          Language
        </label>
        <select
          value={settings.lang}
          onChange={(e) => updateSetting('lang', e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
            borderRadius: '6px'
          }}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>
      
      <div style={{ 
        padding: '1rem', 
        background: '#14532d', 
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#86efac'
      }}>
        ✅ Lazy initialization runs only once
        <br />
        ✅ Expensive operations (JSON.parse) don't run on every render
        <br />
        ✅ Check console - initialization logs only once
      </div>
    </div>
  )
}

export const App = () => <SettingsPanel />`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Use Transitions for Non-Urgent Updates</Heading>
            <CodeComparison
              comparisonId="rerender-transitions"
              language="tsx"
              wrong={`useEffect(() => {
  const handler = () => setScrollY(window.scrollY)
  window.addEventListener('scroll', handler, { passive: true })
  return () => window.removeEventListener('scroll', handler)
}, [])`}
              good={`import { startTransition } from 'react'

useEffect(() => {
  const handler = () => {
    startTransition(() => setScrollY(window.scrollY))
  }
  window.addEventListener('scroll', handler, { passive: true })
  return () => window.removeEventListener('scroll', handler)
}, [])`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Interactive Example: Transitions for Smooth UI</Heading>
            <CodeEditor
              code={`import { useState, useEffect, startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  const [urgentCount, setUrgentCount] = useState(0)
  
  useEffect(() => {
    const handler = () => {
      // ✅ Non-urgent update wrapped in startTransition
      startTransition(() => {
        setScrollY(window.scrollY)
      })
      
      // Urgent update (not wrapped) - updates immediately
      setUrgentCount(c => c + 1)
    }
    
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  
  return (
    <div style={{ padding: '2rem', minHeight: '200vh' }}>
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        background: '#1e293b',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #334155',
        minWidth: '200px'
      }}>
        <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
          Scroll Position
        </h3>
        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
          Y: {Math.round(scrollY)}px
        </div>
        <div style={{ color: '#10b981', fontSize: '0.75rem' }}>
          Updates: {urgentCount}
        </div>
        <div style={{ 
          marginTop: '0.5rem', 
          padding: '0.5rem', 
          background: '#0f172a', 
          borderRadius: '4px',
          fontSize: '0.7rem',
          color: '#64748b'
        }}>
          ✅ Scroll position uses startTransition
          <br />
          ✅ Keeps UI responsive
        </div>
      </div>
      
      <div style={{ padding: '2rem', color: '#fff' }}>
        <h2 style={{ marginBottom: '1rem' }}>Scroll Down to See Transitions</h2>
        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
          The scroll position updates are marked as non-urgent using startTransition,
          which keeps the UI responsive even during rapid scrolling. Try scrolling
          quickly and notice how the UI remains smooth.
        </p>
      </div>
    </div>
  )
}

export const App = () => <ScrollTracker />`}
              language="tsx"
              readOnly={false}
            />
          </Stack>
        </Card>
      </section>

      {/* 6. Rendering Performance */}
      <section id="rendering" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              6. Rendering Performance (MEDIUM)
            </Heading>
            <Text className={styles.sectionDescription}>
              Animate SVG wrappers, use content-visibility for long lists, hoist static JSX, reduce SVG precision, avoid hydration flicker, use Activity for show/hide, and prefer ternary over && for conditionals.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Animate SVG Wrapper, Not SVG Element</Heading>
            <Text className="text-slate-300 mb-4 text-sm">
              Many browsers don't have hardware acceleration for CSS3 animations on SVG elements. Wrap SVG in a &lt;div&gt; and animate the wrapper instead for GPU-accelerated animations.
            </Text>
            <CodeComparison
              comparisonId="rendering-spinner"
              language="tsx"
              wrong={`function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin"
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}`}
              good={`function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}`}
            />
            <Text className="text-slate-400 text-xs mt-2">
              This applies to all CSS transforms and transitions (transform, opacity, translate, scale, rotate). The wrapper div enables GPU acceleration for smoother animations.
            </Text>
            <CodeEditor
              code={`import { useState } from 'react'

// ❌ Wrong: Animating SVG directly (no hardware acceleration)
function BadSpinner() {
  return (
    <svg 
      style={{
        animation: 'spin 1s linear infinite',
        width: '48px',
        height: '48px',
        viewBox: '0 0 24 24'
      }}
    >
      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
      <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="none" />
    </svg>
  )
}

// ✅ Correct: Animating wrapper div (hardware accelerated)
function GoodSpinner() {
  return (
    <div style={{
      animation: 'spin 1s linear infinite',
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
      <svg width="48" height="48" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

export const App = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ color: '#fff', marginBottom: '2rem' }}>SVG Animation Comparison</h2>
      
      <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#fca5a5', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            ❌ Wrong (SVG element)
          </div>
          <BadSpinner />
          <div style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            No GPU acceleration
          </div>
        </div>
        
        <div>
          <div style={{ color: '#86efac', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            ✅ Correct (Wrapper div)
          </div>
          <GoodSpinner />
          <div style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.75rem' }}>
            GPU accelerated
          </div>
        </div>
      </div>
      
      <p style={{ color: '#94a3b8', marginTop: '2rem', fontSize: '0.875rem' }}>
        The wrapper div approach enables hardware acceleration for smoother animations.
      </p>
    </div>
  )
}`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">CSS content-visibility for Long Lists</Heading>
            <Text className="text-slate-300 mb-4 text-sm">
              Apply <code className="text-purple-400">content-visibility: auto</code> to defer off-screen rendering. For 1000 messages, browser skips layout/paint for ~990 off-screen items (10× faster initial render).
            </Text>
            <CodeEditor
              code={`/* CSS: 
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
*/

function MessageList({ messages }) {
  return (
    <div style={{ overflowY: 'auto', height: '100vh' }}>
      {messages.map(msg => (
        <div 
          key={msg.id} 
          className="message-item"
          style={{
            padding: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {msg.author}
          </div>
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}

// Example usage
export const App = () => {
  const messages = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    author: \`User \${i + 1}\`,
    content: \`Message content \${i + 1}\`
  }))
  
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#fff', marginBottom: '1rem' }}>
        Long List with content-visibility
      </h2>
      <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
        Scroll to see how off-screen items are deferred
      </p>
      <MessageList messages={messages} />
    </div>
  )
}`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Hoist Static JSX Elements</Heading>
            <Text className="text-slate-300 mb-4 text-sm">
              Extract static JSX outside components to avoid re-creation on every render. Especially helpful for large and static SVG nodes.
            </Text>
            <CodeComparison
              comparisonId="rendering-skeleton"
              language="tsx"
              wrong={`function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}`}
              good={`const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}`}
            />
            <Text className="text-slate-400 text-xs mt-2">
              Note: If your project has React Compiler enabled, the compiler automatically hoists static JSX elements, making manual hoisting unnecessary.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Prevent Hydration Mismatch Without Flickering</Heading>
            <CodeComparison
              comparisonId="rendering-theme"
              language="tsx"
              wrong={`function ThemeWrapper({ children }) {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) setTheme(stored)
  }, [])
  return <div className={theme}>{children}</div>
}`}
              good={`function ThemeWrapper({ children }) {
  return (
    <>
      <div id="theme-wrapper">{children}</div>
      <script dangerouslySetInnerHTML={{ __html: \`
        (function() {
          try {
            var theme = localStorage.getItem('theme') || 'light';
            var el = document.getElementById('theme-wrapper');
            if (el) el.className = theme;
          } catch (e) {}
        })();
      \` }} />
    </>
  )
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Use Activity for Show/Hide (React 19)</Heading>
            <CodeEditor
              code={`import { Activity } from 'react'

function Dropdown({ isOpen }) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Use Explicit Conditional (Ternary, Not &&)</Heading>
            <CodeComparison
              comparisonId="rendering-badge"
              language="tsx"
              wrong={`function Badge({ count }) {
  return <div>{count && <span className="badge">{count}</span>}</div>
}`}
              good={`function Badge({ count }) {
  return <div>{count > 0 ? <span className="badge">{count}</span> : null}</div>
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Interactive Example: Conditional Rendering</Heading>
            <CodeEditor
              code={`import { useState } from 'react'

// ❌ Wrong: Renders "0" when count is 0
function BadBadge({ count }) {
  return (
    <div style={{ padding: '1rem', background: '#7f1d1d', borderRadius: '8px', marginBottom: '1rem' }}>
      <div style={{ color: '#fca5a5', marginBottom: '0.5rem' }}>❌ Wrong Approach</div>
      <div style={{ color: '#fff' }}>
        Count: {count && <span style={{ 
          background: '#ef4444', 
          padding: '0.25rem 0.5rem', 
          borderRadius: '4px',
          marginLeft: '0.5rem'
        }}>{count}</span>}
      </div>
      {count === 0 && (
        <div style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          ⚠️ Renders "0" instead of nothing!
        </div>
      )}
    </div>
  )
}

// ✅ Correct: Explicit ternary
function GoodBadge({ count }) {
  return (
    <div style={{ padding: '1rem', background: '#14532d', borderRadius: '8px' }}>
      <div style={{ color: '#86efac', marginBottom: '0.5rem' }}>✅ Correct Approach</div>
      <div style={{ color: '#fff' }}>
        Count: {count > 0 ? (
          <span style={{ 
            background: '#10b981', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '4px',
            marginLeft: '0.5rem'
          }}>{count}</span>
        ) : null}
      </div>
      {count === 0 && (
        <div style={{ color: '#86efac', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          ✅ Renders nothing when count is 0
        </div>
      )}
    </div>
  )
}

export const App = () => {
  const [count, setCount] = useState(0)
  
  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Conditional Rendering Demo</h2>
      
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={() => setCount(c => Math.max(0, c - 1))}
          style={{
            padding: '0.5rem 1rem',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          -
        </button>
        <span style={{ color: '#fff', minWidth: '60px', textAlign: 'center' }}>
          Count: {count}
        </span>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{
            padding: '0.5rem 1rem',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
      </div>
      
      <BadBadge count={count} />
      <GoodBadge count={count} />
      
      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: '#1e293b', 
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#94a3b8'
      }}>
        <strong style={{ color: '#fff' }}>Try setting count to 0:</strong>
        <br />
        • Wrong approach renders "0" as text
        <br />
        • Correct approach renders nothing
      </div>
    </div>
  )
}`}
              language="tsx"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Optimize SVG Precision</Heading>
            <Text className="text-slate-300 mb-4 text-sm">
              Reduce SVG coordinate precision to decrease file size. The optimal precision depends on the viewBox size, but in general reducing precision should be considered.
            </Text>
            <CodeComparison
              comparisonId="js-precision"
              language="html"
              wrong={`<!-- Excessive precision: 15 bytes -->
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />`}
              good={`<!-- Optimized precision: 9 bytes (40% smaller) -->
<path d="M 10.3 20.8 L 30.9 40.2" />

<!-- Automate with SVGO -->
<!-- npx svgo --precision=1 --multipass icon.svg -->`}
            />
            <CodeEditor
              code={`// ✅ SVG Optimization Example

// Before optimization (excessive precision)
const beforeOptimization = \`<svg viewBox="0 0 100 100">
  <path d="M 10.293847 20.847362 L 30.938472 40.192837 L 50.123456 60.789012" />
</svg>\`

// After optimization (1 decimal place)
const afterOptimization = \`<svg viewBox="0 0 100 100">
  <path d="M 10.3 20.8 L 30.9 40.2 L 50.1 60.8" />
</svg>\`

console.log('Before:', beforeOptimization.length, 'bytes')
console.log('After:', afterOptimization.length, 'bytes')
console.log('Savings:', Math.round((1 - afterOptimization.length / beforeOptimization.length) * 100) + '%')

// Use SVGO CLI for batch optimization:
// npx svgo --precision=1 --multipass --folder=./icons --output=./icons-optimized

export const App = () => {
  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <h2 style={{ marginBottom: '1rem' }}>SVG Precision Optimization</h2>
      <div style={{ 
        padding: '1rem', 
        background: '#1e293b', 
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontFamily: 'monospace'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Before:</strong> {beforeOptimization.length} bytes
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>After:</strong> {afterOptimization.length} bytes
        </div>
        <div style={{ color: '#10b981' }}>
          <strong>Savings:</strong> {Math.round((1 - afterOptimization.length / beforeOptimization.length) * 100)}%
        </div>
      </div>
      <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.875rem' }}>
        Check console for details. Use SVGO CLI for batch optimization.
      </p>
    </div>
  )
}`}
              language="tsx"
              readOnly={false}
            />
          </Stack>
        </Card>
      </section>

      {/* 7. JavaScript Performance */}
      <section id="javascript" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              7. JavaScript Performance (LOW-MEDIUM)
            </Heading>
            <Text className={styles.sectionDescription}>
              Batch DOM/CSS, use Set/Map for lookups, cache property access and function results, cache storage reads, combine iterations, length-check first, early exit, hoist RegExp, use loop for min/max, and toSorted() for immutability.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Batch DOM CSS Changes</Heading>
            <CodeComparison
              comparisonId="js-width"
              language="typescript"
              wrong={`element.style.width = '100px'
const w = element.offsetWidth
element.style.height = '200px'`}
              good={`element.style.width = '100px'
element.style.height = '200px'
const { width, height } = element.getBoundingClientRect()`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Use Set/Map for O(1) Lookups</Heading>
            <CodeComparison
              comparisonId="js-includes"
              language="typescript"
              wrong={`const allowedIds = ['a', 'b', 'c']
items.filter(item => allowedIds.includes(item.id))`}
              good={`const allowedIds = new Set(['a', 'b', 'c'])
items.filter(item => allowedIds.has(item.id))`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Build Index Maps for Repeated Lookups</Heading>
            <CodeComparison
              comparisonId="js-map"
              language="typescript"
              wrong={`return orders.map(order => ({
  ...order,
  user: users.find(u => u.id === order.userId)
}))`}
              good={`const userById = new Map(users.map(u => [u.id, u]))
return orders.map(order => ({
  ...order,
  user: userById.get(order.userId)
}))`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Cache Property Access in Loops</Heading>
            <CodeComparison
              comparisonId="js-for"
              language="typescript"
              wrong={`for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}`}
              good={`const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) process(value)`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Cache Repeated Function Calls</Heading>
            <CodeComparison
              comparisonId="js-map-sideeffect"
              language="typescript"
              wrong={`projects.map(p => {
  const slug = slugify(p.name)
  return <ProjectCard key={p.id} slug={slug} />
})`}
              good={`const slugifyCache = new Map()

function cachedSlugify(text) {
  if (slugifyCache.has(text)) return slugifyCache.get(text)
  const r = slugify(text)
  slugifyCache.set(text, r)
  return r
}

projects.map(p => {
  const slug = cachedSlugify(p.name)
  return <ProjectCard key={p.id} slug={slug} />
})`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Cache Storage API Calls</Heading>
            <CodeEditor
              code={`const storageCache = new Map()

function getLocalStorage(key) {
  if (!storageCache.has(key))
    storageCache.set(key, localStorage.getItem(key))
  return storageCache.get(key)
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)
}`}
              language="typescript"
              readOnly={false}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Combine Multiple Array Iterations</Heading>
            <CodeComparison
              comparisonId="js-filter"
              language="typescript"
              wrong={`const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)`}
              good={`const admins = [], testers = [], inactive = []
for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Early Length Check for Array Comparisons</Heading>
            <CodeComparison
              comparisonId="js-haschanges"
              language="typescript"
              wrong={`function hasChanges(current, original) {
  return current.sort().join() !== original.sort().join()
}`}
              good={`function hasChanges(current, original) {
  if (current.length !== original.length) return true
  const a = current.toSorted(), b = original.toSorted()
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true
  return false
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Early Return from Functions</Heading>
            <CodeComparison
              comparisonId="js-validate"
              language="typescript"
              wrong={`function validateUsers(users) {
  let hasError = false, errorMessage = ''
  for (const u of users) {
    if (!u.email) { hasError = true; errorMessage = 'Email required' }
    if (!u.name) { hasError = true; errorMessage = 'Name required' }
  }
  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}`}
              good={`function validateUsers(users) {
  for (const u of users) {
    if (!u.email) return { valid: false, error: 'Email required' }
    if (!u.name) return { valid: false, error: 'Name required' }
  }
  return { valid: true }
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Hoist RegExp Creation</Heading>
            <CodeComparison
              comparisonId="advanced-highlighter"
              language="tsx"
              wrong={`function Highlighter({ text, query }) {
  const regex = new RegExp(\`(\${query})\`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((p, i) => <span key={i}>{p}</span>)}</>
}`}
              good={`function Highlighter({ text, query }) {
  const regex = useMemo(
    () => new RegExp(\`(\${escapeRegex(query)})\`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((p, i) => <span key={i}>{p}</span>)}</>
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Use Loop for Min/Max Instead of Sort</Heading>
            <CodeComparison
              comparisonId="advanced-getlatest"
              language="typescript"
              wrong={`function getLatestProject(projects) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}`}
              good={`function getLatestProject(projects) {
  if (projects.length === 0) return null
  let latest = projects[0]
  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) latest = projects[i]
  }
  return latest
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">Use toSorted() Instead of sort()</Heading>
            <CodeComparison
              comparisonId="advanced-usememo"
              language="tsx"
              wrong={`const sorted = useMemo(
  () => users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
)`}
              good={`const sorted = useMemo(
  () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
  [users]
)`}
            />
          </Stack>
        </Card>
      </section>

      {/* 8. Advanced Patterns */}
      <section id="advanced" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              8. Advanced Patterns (LOW)
            </Heading>
            <Text className={styles.sectionDescription}>
              Store event handlers in refs for stable subscriptions; use useLatest for stable callback refs without adding to dependency arrays.
            </Text>

            <Heading level={3} className="text-xl font-semibold text-white mt-4 mb-2">Store Event Handlers in Refs</Heading>
            <CodeComparison
              comparisonId="advanced-windowevent"
              language="tsx"
              wrong={`function useWindowEvent(event, handler) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}`}
              good={`function useWindowEvent(event, handler) {
  const handlerRef = useRef(handler)
  useEffect(() => { handlerRef.current = handler }, [handler])
  useEffect(() => {
    const listener = (e) => handlerRef.current(e)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event])
}`}
            />

            <Heading level={3} className="text-xl font-semibold text-white mt-6 mb-2">useLatest for Stable Callback Refs</Heading>
            <CodeComparison
              comparisonId="advanced-search"
              language="tsx"
              wrong={`function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('')
  useEffect(() => {
    const t = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(t)
  }, [query, onSearch])
}`}
              good={`function useLatest(value) {
  const ref = useRef(value)
  useLayoutEffect(() => { ref.current = value }, [value])
  return ref
}

function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('')
  const onSearchRef = useLatest(onSearch)
  useEffect(() => {
    const t = setTimeout(() => onSearchRef.current(query), 300)
    return () => clearTimeout(t)
  }, [query])
}`}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}
