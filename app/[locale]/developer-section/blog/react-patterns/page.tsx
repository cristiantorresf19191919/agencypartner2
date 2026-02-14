"use client";

import { Lightbulb } from "lucide-react";
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
                {"🧩 "}{t("react-patterns-compound-title-bilingual")}
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Build components that talk to each other like best friends! 🤝 Compound Components let you create flexible, composable APIs where parent and children share state seamlessly through Context. It's like LEGO blocks for your UI! 🧱"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> {"— The secret sauce behind every great component library. Master this and you'll build APIs that developers actually enjoy using! 🎯"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Context-based state sharing {"•"} Composable sub-components {"•"} Flexible API design {"•"} Real-world Accordion example
              </Text>
            </div>

            <div className={styles.sectionCalloutWrap}>
              <div className={styles.tipLine}>
                <span className={styles.tipLineIcon} aria-hidden>
                  <Lightbulb size={18} style={{ color: "rgba(147, 197, 253, 0.9)" }} />
                </span>
                <span className={styles.tipLineText}>
                  {t("react-patterns-compound-why")}
                </span>
              </div>
            </div>

            <CodeComparison
              language="tsx"
              whatToNoticeBad={[t("react-patterns-compound-notice-bad")]}
              whatToNoticeGood={[t("react-patterns-compound-notice-good")]}
              wrong={`// ❌ WRONG: Single component with all props - not flexible
const faqItems = [
  { question: "What is React?", answer: "A UI library for building interfaces." },
  { question: "Why use it?", answer: "Component-based, reusable, and declarative." },
];

function Accordion({ 
  items = [], 
  titleKey, 
  contentKey, 
  defaultOpen = 0 
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

// Usage - rigid structure (faqItems must match titleKey/contentKey)
function App() {
  return (
    <Accordion
      items={faqItems}
      titleKey="question"
      contentKey="answer"
      defaultOpen={0}
    />
  );
}
export default App;

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

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;

function Icon() { return <span>📌 </span>; }
function CustomComponent() { return <p>Custom content here</p>; }

function App() {
  return (
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
  );
}
export default App;

// Benefits:
// ✅ Full control over structure
// ✅ Easy to customize each item
// ✅ State shared automatically via Context`}
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
                {"🪝 "}{t("react-patterns-hooks-title")}
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Stop copy-pasting the same useState + useEffect combo everywhere! 🛑 Custom Hooks let you extract reusable logic into clean, testable functions. Write it once, use it everywhere — your future self will thank you! 🙏"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> {"— The #1 pattern every React developer must master. If you're duplicating logic across components, you're doing it wrong! 🚨"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Extracting reusable logic {"•"} useUser custom hook {"•"} Eliminating code duplication {"•"} Shared state patterns
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
// Mock API for demo (in real app this would be fetch)
const mockFetchUser = (id) => Promise.resolve({ name: 'Jane Doe', avatar: 'https://via.placeholder.com/48' });

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    mockFetchUser(userId)
      .then(data => { setUser(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}

function UserAvatar({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    mockFetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  if (loading) return <div style={{ width: 48, height: 48, background: '#333', borderRadius: 24 }} />;
  return <span>{user?.name} (avatar)</span>;
}

function App() {
  return (
    <div>
      <UserProfile userId="1" />
      <UserAvatar userId="1" />
    </div>
  );
}
export default App;

// Problems: Code duplication, hard to maintain, logic not reusable`}
              good={`// ✅ GOOD: Extract logic into custom hook
// Mock API for demo
const mockFetchUser = (id) => Promise.resolve({ name: 'Jane Doe', avatar: 'https://via.placeholder.com/48' });

function Skeleton() {
  return <div style={{ width: 48, height: 48, background: '#333', borderRadius: 24 }} />;
}

function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    mockFetchUser(userId)
      .then(data => { setUser(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [userId]);
  
  return { user, loading, error };
}

function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}

function UserAvatar({ userId }) {
  const { user, loading } = useUser(userId);
  if (loading) return <Skeleton />;
  return <span>{user?.name} (avatar)</span>;
}

function App() {
  return (
    <div>
      <UserProfile userId="1" />
      <UserAvatar userId="1" />
    </div>
  );
}
export default App;`}
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
                {"🎁 "}{t("react-patterns-hoc-title")}
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Wrap your components in superpowers! 🦸 HOCs are like gift wrapping — they take a component and return an enhanced version with extra abilities (auth, logging, theming). Think of them as component decorators! ✨"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔵"} <strong>Impact: MEDIUM</strong> {"— A classic pattern that's still relevant for cross-cutting concerns like auth guards and analytics wrappers! 🔐"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Authentication HOC {"•"} Component enhancement {"•"} Cross-cutting concerns {"•"} withAuth pattern
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
const checkAuth = () => Promise.resolve({ name: 'Demo User' });
const redirect = () => {};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkAuth().then(u => {
      if (!u) { redirect('/login'); return; }
      setUser(u);
      setLoading(false);
    });
  }, []);
  if (loading) return <div>Loading...</div>;
  return <div>Dashboard Content</div>;
}

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkAuth().then(u => {
      if (!u) { redirect('/login'); return; }
      setUser(u);
      setLoading(false);
    });
  }, []);
  if (loading) return <div>Loading...</div>;
  return <div>Profile</div>;
}

function App() {
  return (
    <div>
      <Dashboard />
      <Profile />
    </div>
  );
}
export default App;`}
              good={`// ✅ GOOD: Use HOC to add authentication
const checkAuth = () => Promise.resolve({ name: 'Demo User' });
const useRouter = () => ({ push: () => {} });

function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
      checkAuth()
        .then(u => {
          if (!u) { router.push('/login'); return; }
          setUser(u);
          setLoading(false);
        })
        .catch(() => router.push('/login'));
    }, []);
    if (loading) return <div>Loading...</div>;
    if (!user) return null;
    return <Component {...props} user={user} />;
  };
}

function Dashboard({ user }) {
  return <div>Dashboard: {user?.name}</div>;
}
function Profile({ user }) {
  return <div>Profile: {user?.name}</div>;
}
function Settings({ user }) {
  return <div>Settings: {user?.name}</div>;
}

const ProtectedDashboard = withAuth(Dashboard);
const ProtectedProfile = withAuth(Profile);
const ProtectedSettings = withAuth(Settings);

function App() {
  return (
    <div>
      <ProtectedDashboard />
      <ProtectedProfile />
      <ProtectedSettings />
    </div>
  );
}
export default App;`}
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
                {"🎨 "}{t("react-patterns-render-props-title")}
              </Heading>
              <Text className="text-zinc-300 mb-4">
                {"Pass a function as children and let the consumer decide what to render! 🖌️ Render Props give you maximum flexibility — the component handles the logic, and YOU choose the presentation. It's like a choose-your-own-adventure for UI! 📖"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔵"} <strong>Impact: MEDIUM</strong> {"— The OG flexibility pattern! Still powerful for sharing behavior between components without coupling them together 🔗"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Function-as-children pattern {"•"} MouseTracker example {"•"} Decoupled rendering {"•"} Reusable behavior sharing
              </Text>
            </div>

            <CodeComparison
              language="tsx"
              wrong={`// ❌ WRONG: Tightly coupled, not reusable
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <div>
      <p>Mouse at: {position.x}, {position.y}</p>
    </div>
  );
}

function App() {
  return <MouseTracker />;
}
export default App;`}
              good={`// ✅ GOOD: Render prop pattern - flexible and reusable
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return children(position);
}

function App() {
  return (
    <div>
      <MouseTracker>
        {({ x, y }) => <p>Mouse at: {x}, {y}</p>}
      </MouseTracker>
    </div>
  );
}
export default App;`}
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
                {"💧 "}{t("react-patterns-hydration-title")}
              </Heading>
              <Text className="text-zinc-300 mb-4">
                {"React 18 changed the game with Selective Hydration! 🎮 Instead of hydrating your entire app at once (blocking everything), React can now hydrate components in priority order. Users click a button? That component gets hydrated FIRST! It's like a VIP line for interactivity! 🎪"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🟠"} <strong>Impact: HIGH</strong> {"— This is how Netflix and Meta keep their apps feeling instant. Streaming SSR + selective hydration = blazing fast perceived performance! 🚀"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Traditional SSR waterfall {"•"} Streaming HTML {"•"} Suspense boundaries {"•"} Priority-based hydration
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

