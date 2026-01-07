"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function ReactPatternsPage() {
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
              <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                {t("developer-section-title")}
              </ButtonLink>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li>
              <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                {t("nav-blog")}
              </ButtonLink>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li className={styles.breadcrumbCurrent}>{t("react-patterns-title")}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className={styles.headerSection}>
          <Heading className={styles.title}>
            {t("react-patterns-title")}
          </Heading>
          <Text className={styles.subtitle}>
            {t("react-patterns-subtitle")}
          </Text>
        </div>

        {/* Compound Components Pattern */}
        <section id="compound-components" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("react-patterns-compound-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("react-patterns-compound-desc")}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
                <Text className={styles.infoText}>
                  {t("react-patterns-compound-why")}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Single component with all props - not flexible
function Accordion({ 
  items, 
  titleKey, 
  contentKey, 
  defaultOpen 
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <button onClick={() => setOpenIndex(index)}>
            {item[titleKey]}
          </button>
          {openIndex === index && (
            <div>{item[contentKey]}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// Usage - rigid structure
<Accordion
  items={faqItems}
  titleKey="question"
  contentKey="answer"
  defaultOpen={0}
/>

// Problems:
// - Can't customize individual items easily
// - Can't rearrange header/content order
// - Hard to add custom styling per item
// - Limited flexibility for different use cases`}
                good={`// ✅ GOOD: Compound components - flexible and composable
import { createContext, useContext, useState } from 'react';

const AccordionContext = createContext<{
  openIndex: number;
  setOpenIndex: (index: number) => void;
} | null>(null);

function Accordion({ children, defaultOpen = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  
  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ index, children }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be inside Accordion');
  
  const { openIndex, setOpenIndex } = context;
  const isOpen = openIndex === index;
  
  return (
    <div className="accordion-item">
      {React.Children.map(children, child => 
        React.cloneElement(child, { isOpen, onToggle: () => setOpenIndex(index) })
      )}
    </div>
  );
}

function AccordionHeader({ children, isOpen, onToggle }) {
  return (
    <button 
      onClick={onToggle}
      className={\`accordion-header \${isOpen ? 'open' : ''}\`}
    >
      {children}
    </button>
  );
}

function AccordionContent({ children, isOpen }) {
  if (!isOpen) return null;
  return <div className="accordion-content">{children}</div>;
}

// Attach as properties
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

// Usage - fully flexible!
<Accordion defaultOpen={0}>
  <Accordion.Item index={0}>
    <Accordion.Header>
      <Icon /> Custom Question with Icon
    </Accordion.Header>
    <Accordion.Content>
      <p>Answer with any content</p>
      <button>Learn More</button>
    </Accordion.Content>
  </Accordion.Item>
  
  <Accordion.Item index={1}>
    <Accordion.Header>Another Question</Accordion.Header>
    <Accordion.Content>
      <CustomComponent />
    </Accordion.Content>
  </Accordion.Item>
</Accordion>

// Benefits:
// ✅ Full control over structure
// ✅ Easy to customize each item
// ✅ Can rearrange components
// ✅ State shared automatically via Context
// ✅ Works with any content structure`}
              />
            </Stack>
          </Card>
        </section>

        {/* Custom Hooks Pattern */}
        <section id="custom-hooks" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("react-patterns-hooks-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("react-patterns-hooks-desc")}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
                <Text className={styles.infoText}>
                  {t("react-patterns-hooks-why")}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Logic duplicated in multiple components
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}

function UserAvatar({ userId }) {
  // Same logic duplicated! 😱
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // ... same code again
  }, [userId]);
  
  // ...
}

// Problems:
// - Code duplication
// - Hard to maintain
// - Logic not reusable
// - Testing is difficult`}
                good={`// ✅ GOOD: Extract logic into custom hook
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(\`/api/users/\${userId}\`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);
  
  return { user, loading, error };
}

// Now use it in any component
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}

function UserAvatar({ userId }) {
  const { user, loading } = useUser(userId);
  
  if (loading) return <Skeleton />;
  return <img src={user.avatar} alt={user.name} />;
}

// Benefits:
// ✅ Logic reused across components
// ✅ Easy to test in isolation
// ✅ Components stay clean and focused
// ✅ Single source of truth
// ✅ Can be shared across projects`}
              />
            </Stack>
          </Card>
        </section>

        {/* Higher-Order Components Pattern */}
        <section id="hoc" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("react-patterns-hoc-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("react-patterns-hoc-desc")}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
                <Text className={styles.infoText}>
                  {t("react-patterns-hoc-why")}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Authentication logic duplicated
function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth().then(user => {
      if (!user) {
        redirect('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>Dashboard Content</div>;
}

function Profile() {
  // Same auth logic again! 😱
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth().then(user => {
      if (!user) {
        redirect('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  // ...
}

// Problems:
// - Code duplication
// - Hard to maintain
// - Easy to forget to add auth check`}
                good={`// ✅ GOOD: Use HOC to add authentication
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
      checkAuth()
        .then(user => {
          if (!user) {
            router.push('/login');
            return;
          }
          setUser(user);
          setLoading(false);
        })
        .catch(() => {
          router.push('/login');
        });
    }, []);
    
    if (loading) return <div>Loading...</div>;
    if (!user) return null;
    
    return <Component {...props} user={user} />;
  };
}

// Now wrap any component that needs auth
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedProfile = withAuth(Profile);
const ProtectedSettings = withAuth(Settings);

// Usage
<ProtectedDashboard />
<ProtectedProfile />
<ProtectedSettings />

// Benefits:
// ✅ Auth logic in one place
// ✅ Reusable across components
// ✅ Components stay focused on their purpose
// ✅ Easy to add to new components
// ✅ Can compose multiple HOCs`}
              />
            </Stack>
          </Card>
        </section>

        {/* Render Props Pattern */}
        <section id="render-props" className="mb-16 scroll-mt-24">
          <Card variant="elevated" className="p-8 !bg-white/5 !border-white/10">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                  {t("react-patterns-render-props-title")}
                </Heading>
                <Text className="text-zinc-300 mb-6">
                  {t("react-patterns-render-props-desc")}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Tightly coupled, not reusable
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div>
      <p>Mouse at: {position.x}, {position.y}</p>
      {/* Can't reuse this logic elsewhere! */}
    </div>
  );
}

// Problems:
// - Logic tied to specific rendering
// - Can't reuse mouse tracking logic
// - Hard to customize display`}
                good={`// ✅ GOOD: Render prop pattern - flexible and reusable
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

// Now use it with different renderings
<MouseTracker 
  render={({ x, y }) => (
    <div>
      <p>Mouse at: {x}, {y}</p>
    </div>
  )}
/>

<MouseTracker 
  render={({ x, y }) => (
    <div className="cursor-follower" style={{ left: x, top: y }}>
      Follow me!
    </div>
  )}
/>

// Or use children as function (common pattern)
function MouseTracker({ children }) {
  // ... same logic
  return children(position);
}

<MouseTracker>
  {({ x, y }) => <div>Position: {x}, {y}</div>}
</MouseTracker>

// Benefits:
// ✅ Logic separated from rendering
// ✅ Fully customizable display
// ✅ Reusable across different use cases
// ✅ Component controls what to render`}
              />
            </Stack>
          </Card>
        </section>

        {/* Selective Hydration Pattern */}
        <section id="selective-hydration" className="mb-16 scroll-mt-24">
          <Card variant="elevated" className="p-8 !bg-white/5 !border-white/10">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                  {t("react-patterns-hydration-title")}
                </Heading>
                <Text className="text-zinc-300 mb-6">
                  {t("react-patterns-hydration-desc")}
                </Text>
              </div>

              <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded mb-6">
                <Text className="text-orange-200">
                  {t("react-patterns-hydration-why")}
                </Text>
              </div>

              <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-white/10">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full"
                  src="https://res.cloudinary.com/ddxwdqwkr/video/upload/f_auto/v1631144761/patterns.dev/selective-hydration-before.mp4" 
                />
                <div className="p-3 bg-white/5 border-t border-white/10 text-center">
                  <Text size="sm" className="text-zinc-400">
                    Visualizing Selective Hydration Priority
                  </Text>
                </div>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ TRADITIONAL SSR: Blocking "Waterfall"
// server.js
import { renderToString } from 'react-dom/server';

// 1. Wait for ALL data to be ready
// 2. Render ENTIRE tree to HTML
const html = renderToString(<App />);

// 3. Send HTML to client
res.send(html);

// 4. Client waits for ALL JS to load
// 5. React hydrates ENTIRE tree at once
// 🛑 Result: Page is non-interactive until everything loads`}
                good={`// ✅ SELECTIVE HYDRATION (React 18+)
// server.js
import { pipeToNodeWritable } from 'react-dom/server';

// 1. Start streaming HTML immediately
const { startWriting } = pipeToNodeWritable(
  <DataProvider data={data}>
    <App />
  </DataProvider>,
  res,
  {
    onReadyToStream() {
      res.setHeader('Content-type', 'text/html');
      res.write('<!DOCTYPE html>');
      startWriting();
    }
  }
);

// App.js
// 2. Wrap slow components in Suspense
<Suspense fallback={<Spinner />}>
  <Comments /> {/* Large data fetching component */}
</Suspense>
<Suspense fallback={<Spinner />}>
  <Sidebar />
</Suspense>

// 🎯 Result:
// - HTML streams in chunks
// - User sees content sooner (First Contentful Paint)
// - React hydrates interactive parts (like Sidebar) FIRST
// - "Heavy" parts (Comments) hydrate later without blocking`}
              />
            </Stack>
          </Card>
        </section>

        {/* Navigation */}
        <div className={styles.navigation}>
          <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog")}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="flex flex-col items-start">
                <span className="text-xs opacity-70 font-normal">{t("nav-blog")}</span>
                <span className="font-semibold">{t("blog-back-blog")}</span>
              </span>
            </span>
          </ButtonLink>
          <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog/design-patterns")}>
            <span className="flex items-center gap-2">
              <span className="flex flex-col items-end">
                <span className="text-xs opacity-70 font-normal">{t("blog-next")}</span>
                <span className="font-semibold">{t("blog-design-patterns")}</span>
              </span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </ButtonLink>
        </div>
    </BlogContentLayout>
  );
}

