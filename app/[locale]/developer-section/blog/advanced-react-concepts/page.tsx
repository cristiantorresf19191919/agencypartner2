"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card , FullscreenSection } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function AdvancedReactConceptsPage() {
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
            <li className={styles.breadcrumbCurrent}>Advanced React Concepts</li>
          </ol>
        </nav>

        {/* Header */}
        <div className={styles.headerSection}>
          <Heading className={styles.title}>
            Advanced React Concepts
          </Heading>
          <Text className={styles.subtitle}>
            Senior-level documentation focusing on the <strong>why</strong> (architecture/trade-offs) rather than just the <strong>how</strong> (syntax). These patterns solve real production problems: <strong>Flexibility</strong>, <strong>Performance</strong>, and <strong>Maintainability</strong>.
          </Text>
        </div>

        {/* Module 1: The "Element Prop" Pattern */}
        <FullscreenSection id="element-prop-pattern" title="Element Prop Pattern" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  📘 Module 1: The "Element Prop" Pattern
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>Context:</strong> When building reusable layout components (like Cards, Modals, or Headers), we often need flexibility in what we render in specific "slots" (e.g., a header action, a footer button).
                  <br /><br />
                  <strong>The Junior Anti-Pattern:</strong> Passing strings or booleans forces the parent component to "know" too much about the implementation details. It limits flexibility.
                  <br /><br />
                  <strong>The Senior Solution:</strong> Instead of passing <em>data</em> to let the child build the UI, pass the <strong>UI itself</strong>. This pattern is extensively used in libraries like Material UI and Ant Design.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Benefits:</strong> <strong>Decoupling:</strong> The component doesn't need to import child components or know about their props. <strong>Performance:</strong> The passed elements are instantiated by the parent, so they don't necessarily re-render just because the parent re-renders (if they are memoized or static).
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ Rigid & Hard to Maintain
// The Card component needs to know about Button, Icon, etc.
// What if we want a "Delete" button instead of "Edit"?
// What if we want a Link instead of a Button?
import { Button } from './Button';
import { Icon } from './Icon';

type CardProps = {
  title: string;
  showEditButton?: boolean;  // What if we want a "Delete" button instead?
  showIcon?: boolean;
  iconName?: string;          // Now we need another prop for the icon name...
  footerText?: string;
};

export const Card = ({ 
  title, 
  showEditButton, 
  showIcon, 
  iconName,
  footerText 
}: CardProps) => {
  return (
    <div className="card">
      <div className="header">
        <h1>{title}</h1>
        {showIcon && iconName && <Icon name={iconName} />}
        {showEditButton && <Button variant="ghost">Edit</Button>}
      </div>
      <div className="content">{/* children */}</div>
      {footerText && <div className="footer">{footerText}</div>}
    </div>
  );
};

// Usage - Limited flexibility
<Card 
  title="Profile" 
  showEditButton={true}
  showIcon={false}
  iconName="user"
  footerText="Last updated: Today"
>
  <UserProfile />
</Card>`}
                good={`// ✅ Flexible & Composable
// The Card component doesn't care what you pass - it just renders it
// You have full control over what goes in each slot
import { ReactNode } from 'react';

type CardProps = {
  title: string;
  // We accept a ReactElement (an instance) or ReactNode
  headerAction?: ReactNode; 
  footer?: ReactNode;
  children: ReactNode;
};

export const Card = ({ title, headerAction, footer, children }: CardProps) => {
  return (
    <div className="card">
      <div className="header">
        <h1>{title}</h1>
        {/* We just render the slot. We don't care what it is. */}
        <div className="actions">{headerAction}</div>
      </div>
      <div className="content">{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
};

// Usage - Maximum flexibility
<Card 
  title="Profile" 
  // We can pass a Button, a Link, or nothing. The Card doesn't care.
  headerAction={<Button variant="ghost">Edit</Button>} 
  footer={<span className="text-sm">Last updated: Today</span>}
>
  <UserProfile />
</Card>

// Or with a Delete button instead
<Card 
  title="Profile" 
  headerAction={<Button variant="danger">Delete</Button>}
  footer={<Link href="/settings">Settings</Link>}
>
  <UserProfile />
</Card>

// Or with multiple actions
<Card 
  title="Profile" 
  headerAction={
    <>
      <Button variant="ghost">Edit</Button>
      <Button variant="danger">Delete</Button>
    </>
  }
>
  <UserProfile />
</Card>`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* Module 2: Optimizing Context API (Split Context Pattern) */}
        <FullscreenSection id="split-context-pattern" title="Split Context Pattern" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  📘 Module 2: Optimizing Context API (Split Context Pattern)
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>Context:</strong> A naive React Context implementation causes a "re-render blast radius." If <em>any</em> part of the context value changes, <em>every</em> component consuming that context re-renders, even if they didn't need the specific data that changed.
                  <br /><br />
                  <strong>The Junior Anti-Pattern:</strong> Bundling state and actions into a single object forces re-renders on components that only needed the actions.
                  <br /><br />
                  <strong>The Senior Solution:</strong> Split the "Data" (State) and the "Actions" (Dispatch) into separate contexts.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Benefits:</strong> <strong>Performance:</strong> Components that only need to trigger an action (like a LogoutButton) utilize the actions context. They will <strong>never</strong> re-render when the state changes. <strong>Scalability:</strong> Prevents the "Context Hell" performance bottleneck in large apps.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ The "God Object" - Any component using 'login' will re-render when 'user' changes
import { createContext, useContext, useState, ReactNode } from 'react';

type User = { id: string; name: string; email: string };

type AuthContextValue = {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async () => {
    // ... login logic
    setUser({ id: '1', name: 'John', email: 'john@example.com' });
  };

  const logout = () => {
    setUser(null);
  };

  // 🛑 PROBLEM: If 'user' updates, this entire object reference changes
  // Every component using this context will re-render, even if they only
  // use the 'login' function and don't care about 'user' changes
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Usage - LogoutButton re-renders when user changes (even though it doesn't need to)
const LogoutButton = () => {
  const { logout } = useAuth(); // ❌ Re-renders when user changes!
  return <button onClick={logout}>Logout</button>;
};`}
                good={`// ✅ Context Splitting - Separate state and actions
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type User = { id: string; name: string; email: string };

// ✅ 1. Create two separate contexts
const AuthStateContext = createContext<User | null>(null);
const AuthActionsContext = createContext<{
  login: () => Promise<void>;
  logout: () => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ 2. Memoize the actions so they are referentially stable
  // This object NEVER changes, so consumers of this context NEVER re-render.
  const actions = useMemo(() => ({
    login: async () => {
      // ... login logic
      setUser({ id: '1', name: 'John', email: 'john@example.com' });
    },
    logout: () => setUser(null)
  }), []); // Empty deps = stable reference forever

  return (
    <AuthActionsContext.Provider value={actions}>
      <AuthStateContext.Provider value={user}>
        {children}
      </AuthStateContext.Provider>
    </AuthActionsContext.Provider>
  );
};

// ✅ Custom Hooks for consumption
export const useUser = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useUser must be used within AuthProvider');
  }
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  if (!context) {
    throw new Error('useAuthActions must be used within AuthProvider');
  }
  return context;
};

// Usage - LogoutButton NEVER re-renders when user changes!
const LogoutButton = () => {
  const { logout } = useAuthActions(); // ✅ Only subscribes to actions context
  return <button onClick={logout}>Logout</button>;
};

// UserProfile re-renders when user changes (as it should)
const UserProfile = () => {
  const user = useUser(); // ✅ Only subscribes to state context
  return <div>{user?.name}</div>;
};`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* Module 3: Less UseEffects (Derived State) */}
        <FullscreenSection id="derived-state" title="Derived State" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  📘 Module 3: Less UseEffects (Derived State)
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>Context:</strong> `useEffect` is widely overused for logic that should happen during rendering or in event handlers. This leads to "race conditions," infinite loops, and double-rendering bugs.
                  <br /><br />
                  <strong>The Junior Anti-Pattern:</strong> Using an effect to update one state variable based on another state variable. This causes two renders: one for the prop change, and another after the effect runs.
                  <br /><br />
                  <strong>The Senior Solution:</strong> Calculate values <strong>during the render</strong>. If the calculation is expensive, wrap it in `useMemo`, but <strong>never</strong> put it in `useEffect` or `useState`.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> Derived state eliminates unnecessary re-renders, prevents race conditions, and makes the code more predictable. Effects should be reserved for <strong>synchronization with external systems</strong> (like connecting to a socket or observing DOM changes), not for transforming data.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ Bad: Double Render & Complexity
// Using an effect to sync state causes two renders:
// 1. First render with old filteredItems
// 2. Effect runs, updates filteredItems
// 3. Second render with new filteredItems
import { useState, useEffect } from 'react';

type Item = { id: string; category: string; name: string };

const ProductList = ({ items, filter }: { items: Item[]; filter: string }) => {
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  // 🛑 PROBLEM: This triggers a second render immediately after the first one
  // Also creates a race condition if 'items' or 'filter' change rapidly
  useEffect(() => {
    setFilteredItems(items.filter(i => i.category === filter));
  }, [items, filter]);

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// ❌ Another Anti-Pattern: Effects for User Events
const [submitted, setSubmitted] = useState(false);

useEffect(() => {
  if (submitted) {
    postDataToAPI(); // ⚠️ Why is this here? It belongs in the handler.
  }
}, [submitted]);

return <button onClick={() => setSubmitted(true)}>Submit</button>;`}
                good={`// ✅ Good: Single Render & Source of Truth
// Calculate directly during render. React simply recalculates this on every render.
// It is fast. You likely don't even need useMemo unless 'items' is huge (10,000+ items).
import { useMemo } from 'react';

type Item = { id: string; category: string; name: string };

const ProductList = ({ items, filter }: { items: Item[]; filter: string }) => {
  // ✅ Calculate directly during render
  // If the calculation is expensive (e.g., 10,000+ items), use useMemo
  const filteredItems = useMemo(
    () => items.filter(i => i.category === filter),
    [items, filter]
  );

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// For most cases, you don't even need useMemo:
const ProductListSimple = ({ items, filter }: { items: Item[]; filter: string }) => {
  // ✅ Simple and fast - React is optimized for this
  const filteredItems = items.filter(i => i.category === filter);

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// ✅ Good: Event Handlers for User Actions
// Place logic where the user action happens. Keep Effects strictly for
// synchronization with external systems (like connecting to a socket or observing DOM changes).
const handleSubmit = async () => {
  // No state needed. Just run the logic.
  await postDataToAPI();
  toast.success("Done!");
};

return <button onClick={handleSubmit}>Submit</button>;`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* Additional Best Practices */}
        <FullscreenSection id="best-practices" title="Best Practices" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  When to Use useEffect
                </Heading>
                <Text className={styles.sectionDescription}>
                  Effects should be reserved for <strong>synchronization with external systems</strong>. Here are valid use cases:
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Valid useEffect Use Cases:</strong>
                  <br />
                  • Connecting to external APIs (WebSockets, REST subscriptions)
                  <br />
                  • Setting up event listeners (window resize, keyboard shortcuts)
                  <br />
                  • Integrating with third-party libraries (charts, maps)
                  <br />
                  • Cleaning up resources (unsubscribing, removing listeners)
                  <br />
                  • Synchronizing with browser APIs (localStorage, history)
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ Don't use useEffect for:
// - Transforming data (use derived state)
// - User events (use event handlers)
// - Conditional logic based on state (use conditional rendering)
// - Fetching data on mount (use router loaders or React Query)

useEffect(() => {
  // ❌ Don't do this
  const filtered = items.filter(i => i.category === filter);
  setFilteredItems(filtered);
}, [items, filter]);

useEffect(() => {
  // ❌ Don't do this
  if (submitted) {
    postData();
  }
}, [submitted]);`}
                good={`// ✅ Use useEffect for synchronization with external systems:

// 1. WebSocket connection
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com');
  ws.onmessage = (event) => {
    setMessage(JSON.parse(event.data));
  };
  return () => ws.close(); // Cleanup
}, []);

// 2. Event listeners
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// 3. Third-party library integration
useEffect(() => {
  const chart = new Chart(canvasRef.current, config);
  return () => chart.destroy();
}, [data]);

// 4. Browser API synchronization
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

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
          <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog/advanced-react-hooks")}>
            <span className="flex items-center gap-2">
              <span className="flex flex-col items-end">
                <span className="text-xs opacity-70 font-normal">{t("blog-next")}</span>
                <span className="font-semibold">Advanced React Hooks</span>
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

