"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card } from "@/components/ui";
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
        <section id="element-prop-pattern" className={styles.section}>
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
// Card needs to know about Button, Icon, etc. - limited flexibility
const Button = ({ variant, children }) => <button className={variant}>{children}</button>;
const Icon = ({ name }) => <span>[{name}]</span>;
const UserProfile = () => <div>User content</div>;

type CardProps = {
  title: string;
  showEditButton?: boolean;
  showIcon?: boolean;
  iconName?: string;
  footerText?: string;
};

const Card = ({ title, showEditButton, showIcon, iconName, footerText, children }) => (
  <div className="card">
    <div className="header">
      <h1>{title}</h1>
      {showIcon && iconName && <Icon name={iconName} />}
      {showEditButton && <Button variant="ghost">Edit</Button>}
    </div>
    <div className="content">{children}</div>
    {footerText && <div className="footer">{footerText}</div>}
  </div>
);

function App() {
  return (
    <Card
      title="Profile"
      showEditButton={true}
      showIcon={false}
      iconName="user"
      footerText="Last updated: Today"
    >
      <UserProfile />
    </Card>
  );
}
export default App;`}
                good={`// ✅ Flexible & Composable - Card doesn't care what you pass
import { ReactNode } from 'react';

const Button = ({ variant, children }) => <button className={variant}>{children}</button>;
const Link = ({ href, children }) => <a href={href}>{children}</a>;
const UserProfile = () => <div>User content</div>;

type CardProps = {
  title: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

const Card = ({ title, headerAction, footer, children }: CardProps) => (
  <div className="card">
    <div className="header">
      <h1>{title}</h1>
      <div className="actions">{headerAction}</div>
    </div>
    <div className="content">{children}</div>
    {footer && <div className="footer">{footer}</div>}
  </div>
);

function App() {
  return (
    <Card
      title="Profile"
      headerAction={<Button variant="ghost">Edit</Button>}
      footer={<span className="text-sm">Last updated: Today</span>}
    >
      <UserProfile />
    </Card>
  );
}
export default App;`}
              />
            </Stack>
          </Card>
        </section>

        {/* Module 2: Optimizing Context API (Split Context Pattern) */}
        <section id="split-context-pattern" className={styles.section}>
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

const LogoutButton = () => {
  const { logout } = useAuth();
  return <button onClick={logout}>Logout</button>;
};

function App() {
  return (
    <AuthProvider>
      <LogoutButton />
      <UserProfile />
    </AuthProvider>
  );
}
export default App;`}
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

const UserProfile = () => {
  const user = useUser();
  return <div>{user?.name}</div>;
};

function App() {
  return (
    <AuthProvider>
      <LogoutButton />
      <UserProfile />
    </AuthProvider>
  );
}
export default App;`}
              />
            </Stack>
          </Card>
        </section>

        {/* Module 3: Less UseEffects (Derived State) */}
        <section id="derived-state" className={styles.section}>
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
                wrong={`// ❌ Bad: Double Render - effect syncs state (two renders)
import { useState, useEffect } from 'react';

type Item = { id: string; category: string; name: string };

const ProductList = ({ items, filter }) => {
  const [filteredItems, setFilteredItems] = useState([]);

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

const MOCK_ITEMS = [
  { id: '1', category: 'A', name: 'Item 1' },
  { id: '2', category: 'B', name: 'Item 2' },
  { id: '3', category: 'A', name: 'Item 3' },
];

function App() {
  const [filter, setFilter] = useState('A');
  return (
    <div>
      <button onClick={() => setFilter('A')}>Category A</button>
      <button onClick={() => setFilter('B')}>Category B</button>
      <ProductList items={MOCK_ITEMS} filter={filter} />
    </div>
  );
}
export default App;`}
                good={`// ✅ Good: Single render - derive during render
import { useMemo, useState } from 'react';

type Item = { id: string; category: string; name: string };

const ProductList = ({ items, filter }) => {
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

const MOCK_ITEMS = [
  { id: '1', category: 'A', name: 'Item 1' },
  { id: '2', category: 'B', name: 'Item 2' },
  { id: '3', category: 'A', name: 'Item 3' },
];

function App() {
  const [filter, setFilter] = useState('A');
  return (
    <div>
      <button onClick={() => setFilter('A')}>Category A</button>
      <button onClick={() => setFilter('B')}>Category B</button>
      <ProductList items={MOCK_ITEMS} filter={filter} />
    </div>
  );
}
export default App;`}
              />
            </Stack>
          </Card>
        </section>

        {/* Additional Best Practices */}
        <section id="best-practices" className={styles.section}>
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
                wrong={`// ❌ Don't use useEffect for transforming data or user events
import { useState, useEffect } from 'react';

function App() {
  const [items] = useState([{ id: '1', category: 'A', name: 'Item 1' }]);
  const [filter] = useState('A');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(items.filter(i => i.category === filter));
  }, [items, filter]);

  return (
    <div>
      <p>Anti-pattern: effect syncing state (causes extra render)</p>
      <ul>{filteredItems.map(item => <li key={item.id}>{item.name}</li>)}</ul>
    </div>
  );
}
export default App;`}
                good={`// ✅ Use useEffect for sync with external systems (e.g. resize)
import { useState, useEffect } from 'react';

function App() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div>Window width: {width}px (resize to see)</div>;
}
export default App;`}
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

