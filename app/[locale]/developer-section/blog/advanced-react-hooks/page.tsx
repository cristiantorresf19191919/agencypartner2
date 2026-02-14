"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function AdvancedReactHooksPage() {
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
            <li className={styles.breadcrumbCurrent}>Advanced React Hooks</li>
          </ol>
        </nav>

        {/* Header */}
        <div className={styles.headerSection}>
          <Heading className={styles.title}>
            Advanced React Hooks & Patterns
          </Heading>
          <Text className={styles.subtitle}>
            Here is how a senior engineer implements these concepts. I have stripped away the "tutorial fluff" and focused on the patterns that solve actual production problems: <strong>Performance</strong>, <strong>Visual Stability</strong>, and <strong>Race Conditions</strong>.
          </Text>
        </div>

        {/* The "Non-Blocking" UI (useTransition) */}
        <section id="use-transition" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"⚡ 1. The \"Non-Blocking\" UI (`useTransition`)"}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"Your search input freezes while filtering 10,000 items? That's because React treats ALL state updates equally! 😤 useTransition lets you tell React: 'Hey, update the input NOW, but take your time with the list.' It's like a fast lane for urgent updates! 🏎️💨"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🔴"} <strong>Impact: CRITICAL</strong> {"— The difference between a UI that feels instant and one that feels sluggish. Your users will FEEL this improvement! ✨"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> Urgent vs non-urgent updates {"•"} startTransition API {"•"} isPending state {"•"} Interruptible rendering
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"In production, users expect instant feedback when typing. By marking heavy updates as \"transitions\", React can interrupt them if the user continues typing, keeping the UI responsive. 🎯"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: All state updates happen synchronously
// The input freezes while filtering 5,000 items
import { useState } from 'react';

const HeavyList = ({ query }: { query: string }) => {
  const items = Array.from({ length: 5000 }, (_, i) => \`Item \${i}\`);
  const filtered = items.filter(item => item.includes(query));
  
  return (
    <ul>
      {filtered.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
};

export const SearchFeature = () => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 🛑 PROBLEM: This blocks the UI thread
    // User types "a" -> freezes -> filters -> renders
    // User types "ab" -> freezes -> filters -> renders
    // Input feels laggy and unresponsive
    setQuery(e.target.value);
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <HeavyList query={query} />
    </div>
  );
};
export default SearchFeature;`}
                good={`// ✅ GOOD: Split urgent vs. non-urgent updates
import { useState, useTransition } from 'react';

const HeavyList = ({ query }: { query: string }) => {
  // Simulate heavy computation (e.g. 10,000 rows)
  const items = Array.from({ length: 5000 }, (_, i) => \`Item \${i}\`);
  const filtered = items.filter(item => item.includes(query));
  
  return (
    <ul>
      {filtered.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
};

export const SearchFeature = () => {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  
  // ✅ Senior Pattern: Mark specific state updates as "transition" (lower priority)
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. URGENT: Update the input immediately so the user sees what they type
    setInputValue(e.target.value);

    // 2. NON-URGENT: Schedule the heavy list update for later
    // React will interrupt this if the user keeps typing
    startTransition(() => {
      setQuery(e.target.value);
    });
  };

  return (
    <div>
      <input value={inputValue} onChange={handleChange} />
      
      {/* Visual feedback is crucial for UX when deferring updates */}
      {isPending && <span className="text-gray-500 text-sm">Rendering...</span>}
      
      <HeavyList query={query} />
    </div>
  );
};
export default SearchFeature;`}
              />
            </Stack>
          </Card>
        </section>

        {/* Preventing "Flicker" (useLayoutEffect) */}
        <section id="use-layout-effect" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"👁️ 2. Preventing \"Flicker\" (`useLayoutEffect`)"}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"Ever see a tooltip appear in the wrong spot then JUMP to the right place? 😖 That's the flicker! useLayoutEffect runs BEFORE the browser paints, so you can measure and position elements without the user ever seeing the awkward dance. It's like rehearsing before going on stage! 🎭"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🟠"} <strong>Impact: HIGH</strong> {"— Visual polish that separates amateur apps from professional ones. No more janky positioning! 💎"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> useEffect vs useLayoutEffect {"•"} DOM measurement timing {"•"} Tooltip positioning {"•"} Paint prevention
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"`useLayoutEffect` runs synchronously after DOM mutations but before the browser paints. This prevents visual \"jumps\" that hurt UX, especially for tooltips, modals, and positioned elements. 🎯"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Tooltip appears in wrong position, then jumps
import { useState, useEffect, useRef } from 'react';

const Tooltip = ({ targetRef, children }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      setCoords({
        top: targetRect.top - tooltipRect.height - 10,
        left: targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
      });
    }
  }, [targetRef]);

  return (
    <div
      ref={tooltipRef}
      style={{ position: 'fixed', top: coords.top, left: coords.left }}
      className="bg-black text-white p-2 rounded shadow-lg"
    >
      {children}
    </div>
  );
};

function App() {
  const targetRef = useRef(null);
  return (
    <div>
      <button ref={targetRef}>Hover target</button>
      <Tooltip targetRef={targetRef}>Tooltip content</Tooltip>
    </div>
  );
}
export default App;`}
                good={`// ✅ GOOD: Calculate position before paint (no flicker)
import { useState, useLayoutEffect, useRef } from 'react';

const SmartTooltip = ({ targetRef, children }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      setCoords({
        top: targetRect.top - tooltipRect.height - 10,
        left: targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
      });
    }
  }, [targetRef]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        opacity: coords.top === 0 ? 0 : 1
      }}
      className="bg-black text-white p-2 rounded shadow-lg"
    >
      {children}
    </div>
  );
};

function App() {
  const targetRef = useRef(null);
  return (
    <div>
      <button ref={targetRef}>Hover target</button>
      <SmartTooltip targetRef={targetRef}>Tooltip content</SmartTooltip>
    </div>
  );
}
export default App;`}
              />
            </Stack>
          </Card>
        </section>

        {/* The "Callback Ref" Pattern */}
        <section id="callback-ref" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"🎯 3. The \"Callback Ref\" Pattern (Advanced DOM)"}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"Did you know ref.current doesn't trigger re-renders? 😱 So putting it in useEffect deps is basically a lie! Callback refs are the real deal — React calls your function EXACTLY when the DOM node appears or disappears. It's like having a doorbell for your DOM elements! 🔔"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🟠"} <strong>Impact: HIGH</strong> {"— Essential for any DOM measurement, animation, or third-party library integration. This pattern just WORKS! 🔧"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> Callback ref pattern {"•"} DOM measurement {"•"} Mount/unmount detection {"•"} useCallback + ref combo
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"Callback refs fire exactly when DOM nodes mount/unmount, making them perfect for measurements, animations, and third-party library integration. Unlike `useEffect` with refs, they're guaranteed to run at the right time. ✅"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: useEffect with ref.current dependency doesn't work reliably
import { useState, useEffect, useRef } from 'react';

export const DynamicMeasurer = () => {
  const [height, setHeight] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  // 🛑 PROBLEM: ref.current doesn't trigger re-renders
  // useEffect won't run when the ref is first assigned
  // This is unreliable and can miss the initial mount
  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setHeight(Math.round(rect.height));
    }
  }, [divRef.current]); // ❌ This dependency doesn't work as expected!

  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle Content</button>
      <p>Measured Height: {height}px</p>
      {show && (
        <div ref={divRef} className="p-10 border border-blue-500">
          Hello, I am dynamic content!
        </div>
      )}
    </div>
  );
};
export default DynamicMeasurer;`}
                good={`// ✅ GOOD: Callback ref fires exactly when node mounts
import { useState, useCallback } from 'react';

export const DynamicMeasurer = () => {
  const [height, setHeight] = useState(0);

  // ✅ Senior Pattern: "Callback Ref"
  // Instead of a passive useRef object, we use a function.
  // This function runs automatically when the <div> mounts.
  const measureRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      // The node just mounted! We can measure it immediately.
      const rect = node.getBoundingClientRect();
      setHeight(Math.round(rect.height));
      
      console.log("Node mounted and measured:", rect.height);
    }
    // When node is null, it means the element unmounted
    // You can clean up here if needed
  }, []); // Empty deps = stable reference

  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle Content</button>
      
      <p>Measured Height: {height}px</p>

      {show && (
        // When this renders, 'measureRef' fires immediately
        <div ref={measureRef} className="p-10 border border-blue-500">
          Hello, I am dynamic content!
        </div>
      )}
    </div>
  );
};
export default DynamicMeasurer;`}
              />
            </Stack>
          </Card>
        </section>

        {/* Modern Architecture (Loaders vs. Waterfalls) */}
        <section id="modern-architecture" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"🏗️ 4. Modern Architecture (Loaders vs. Waterfalls)"}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"Stop the spinner madness! 🔄 When every component fetches its own data in useEffect, you get a waterfall of loading states. Router-level data fetching is the future — data loads BEFORE your component even mounts. By the time the UI renders, the data is already there! 🎁 No more spinners, no more waterfalls!"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🔴"} <strong>Impact: CRITICAL</strong> {"— This architectural shift eliminates loading spinners entirely. Your app feels like a native desktop application! 🖥️"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> Fetch waterfalls {"•"} Router-level loaders {"•"} Parallel data fetching {"•"} useLoaderData pattern
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"Router loaders fetch data in parallel with code bundle downloading. By the time the component mounts, data is often already there. This eliminates loading spinners, reduces waterfalls, and improves perceived performance dramatically. 🚀"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Data fetching waterfall in every component
// Mock API for demo (in real app this would be fetch)
const fetchUser = (id) => Promise.resolve({ name: 'Jane', email: 'j@example.com' });

import { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(data => { setUser(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

function App() {
  return <UserProfile userId="1" />;
}
export default App;`}
                good={`// ✅ GOOD: Router-level data fetching (concept demo with mock loader)
// Mock: In a real app useRouter() provides loader data. Here we stub it for demo.
const useLoaderData = () => ({ name: 'Jane', email: 'j@example.com' });

const UserProfile = () => {
  const user = useLoaderData();
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

function App() {
  return <UserProfile />;
}
export default App;`}
              />
            </Stack>
          </Card>
        </section>

        {/* React Portals: Escaping the CSS Trap */}
        <section id="react-portals" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"🌀 5. React Portals: Escaping the CSS Trap"}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"Portals aren't just for modals! 🚪 Got a tooltip clipped by overflow: hidden? A dropdown stuck behind a z-index wall? Portals teleport your component's DOM to document.body while keeping all the React logic in place. It's like a secret escape tunnel for your UI! 🕳️✨"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🟠"} <strong>Impact: HIGH</strong> {"— Every tooltip, dropdown, and popover library uses Portals under the hood. Understand this and you'll never fight CSS stacking again! 🛡️"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> createPortal API {"•"} Overflow escape {"•"} Z-index bypass {"•"} Tooltip/dropdown positioning
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"Portals let you write component logic inside the child, but render the DOM node at a different level. This breaks out of Stacking Contexts, overflow constraints, and z-index issues that would otherwise clip your UI elements. 🎯"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Tooltip gets clipped by parent overflow
import { useState } from 'react';

const Container = () => {
  return (
    <div style={{ overflow: 'hidden', height: '200px', position: 'relative' }}>
      <button>Hover me</button>
      {/* 🛑 PROBLEM: Tooltip gets clipped by overflow: hidden */}
      <Tooltip>This tooltip will be cut off!</Tooltip>
    </div>
  );
};

const Tooltip = ({ children }) => (
  <div style={{ position: 'absolute', top: '-50px', background: 'black', color: 'white', padding: '8px' }}>
    {children}
  </div>
);

function App() { return <Container />; }
export default App;

// Problems: Tooltip gets clipped by parent's overflow: hidden
// - Z-index conflicts with parent stacking contexts
// - Dropdowns can't escape container boundaries`}
                good={`// ✅ GOOD: Portal renders at document.body level
import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

const Container = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div style={{ overflow: 'hidden', height: '200px', position: 'relative' }}>
      <button 
        ref={buttonRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        Hover me
      </button>
      {/* ✅ Portal escapes parent constraints */}
      {showTooltip && buttonRef.current && (
        <Tooltip targetElement={buttonRef.current}>
          This tooltip escapes the overflow container!
        </Tooltip>
      )}
    </div>
  );
};

const Tooltip = ({ targetElement, children }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.top - 50,
        left: rect.left + rect.width / 2
      });
    }
  }, [targetElement]);

  // ✅ Senior Pattern: Portal to document.body
  // This renders the tooltip at the body level, bypassing all parent CSS
  return createPortal(
    <div style={{ 
      position: 'fixed', 
      top: position.top,
      left: position.left,
      transform: 'translateX(-50%)',
      background: 'black',
      color: 'white',
      padding: '8px',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      {children}
    </div>,
    document.body
  );
};

function App() { return <Container />; }
export default App;

// Benefits: Escapes overflow, bypasses z-index
// ✅ Bypasses z-index stacking contexts
// ✅ Perfect for modals, tooltips, dropdowns
// ✅ Component logic stays in child, DOM renders elsewhere`}
              />
            </Stack>
          </Card>
        </section>

        {/* Error Boundaries: The "Blast Radius" Control */}
        <section id="error-boundaries" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"💥 6. Error Boundaries: The \"Blast Radius\" Control"}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"One crash shouldn't nuke your entire app! 💣 Wrapping everything in a single Error Boundary is like having one fuse for your whole house. Granular boundaries are like circuit breakers — if the graph widget crashes, the rest of the dashboard keeps working perfectly! 🏥"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🔴"} <strong>Impact: CRITICAL</strong> {"— In production, graceful degradation is everything. Users should never see a full white screen of death! ☠️➡️😊"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> Granular error boundaries {"•"} Blast radius control {"•"} Fallback UI {"•"} Error logging per widget
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxRed} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"Error Boundaries are currently the only feature that still requires a Class Component (no Hook exists yet). They catch errors during rendering, in lifecycle methods, and in constructors. Granular boundaries limit the \"blast radius\" of failures! 🛡️"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: One boundary for entire app
import { Component, ReactNode } from 'react';

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Entire app crashed!</div>;
    }
    return this.props.children;
  }
}

const Dashboard = () => <div>Dashboard</div>;
const PaymentForm = () => <div>Payment Form</div>;
const ThirdPartyGraph = () => <div>Graph</div>;
const UserSettings = () => <div>Settings</div>;

function App() {
  return (
    <AppErrorBoundary>
      <Dashboard />
      <PaymentForm />
      <ThirdPartyGraph />
      <UserSettings />
    </AppErrorBoundary>
  );
}
export default App;

// Problems: One crash = entire app down
// - No granular error recovery
// - Poor user experience`}
                good={`// ✅ GOOD: Granular Error Boundaries
import { Component, ReactNode } from 'react';

// Reusable Error Boundary component
class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-red-800 font-semibold">Something went wrong</h3>
          <p className="text-red-600 text-sm">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = ({ children }) => <div><h2>Dashboard</h2>{children}</div>;
const PaymentForm = () => <div>Payment Form</div>;
const ThirdPartyGraph = () => <div>Graph</div>;
const UserSettings = () => <div>Settings</div>;

function App() {
  return (
    <Dashboard>
      <ErrorBoundary fallback={<div>Payment form unavailable.</div>}>
        <PaymentForm />
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Graph unavailable.</div>}>
        <ThirdPartyGraph />
      </ErrorBoundary>
      <UserSettings />
    </Dashboard>
  );
}
export default App;

// Benefits:
// ✅ Isolated failures don't crash entire app
// ✅ Better user experience (partial functionality)
// ✅ Easier debugging (know exactly which widget failed)
// ✅ Can log errors per widget to monitoring service`}
              />
            </Stack>
          </Card>
        </section>

        {/* Keys Explained: The Reset Button */}
        <section id="keys-explained" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"🔑 7. Keys Explained: The Reset Button"}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"Keys aren't just for silencing list warnings! 🤫 They're React's IDENTITY SYSTEM — and they're secretly one of the most powerful tools in your arsenal. Change the key and React goes: 'New phone, who dis?' and rebuilds the component from scratch! 📱🔄 Perfect for form resets and user switches!"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🟠"} <strong>Impact: HIGH</strong> {"— The most elegant solution for stale state bugs. One prop change and your component gets a fresh start! 🌟"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> {"React's identity system"} {"•"} Force remount with keys {"•"} Form state reset {"•"} User switching pattern
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"Keys aren't just for lists. They're React's identity system. Changing a key tells React \"this is a completely different component instance\" — forcing a full remount. Perfect for resetting form state, clearing animations, or handling user switches! 🎯"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Component keeps old state when user changes
import { useState } from 'react';

const UserProfile = ({ userId }: { userId: string }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 🛑 PROBLEM: When userId changes, React reuses the component
  // The form fields still contain User A's data when switching to User B
  useEffect(() => {
    const mock = (id) => Promise.resolve({ name: id === 'user-1' ? 'Alice' : 'Bob', email: id + '@ex.com' });
    mock(userId).then(user => { setName(user.name); setEmail(user.email); });
  }, [userId]);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
    </form>
  );
};

function App() {
  const [selectedUserId, setSelectedUserId] = useState('user-1');
  return (
    <div>
      <button onClick={() => setSelectedUserId('user-1')}>User 1</button>
      <button onClick={() => setSelectedUserId('user-2')}>User 2</button>
      <UserProfile userId={selectedUserId} />
    </div>
  );
}
export default App;

// Problems:
// - Form fields keep old values when switching users
// - Animations don't reset
// - Component state persists across different entities`}
                good={`// ✅ GOOD: Key forces component reset
import { useState, useEffect } from 'react';

const UserProfile = ({ userId }: { userId: string }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const mock = (id) => Promise.resolve({ name: id === 'user-1' ? 'Alice' : 'Bob', email: id + '@ex.com' });
    mock(userId).then(user => { setName(user.name); setEmail(user.email); });
  }, [userId]);

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
    </form>
  );
};

function App() {
  const [selectedUserId, setSelectedUserId] = useState('user-1');
  return (
    <div>
      <button onClick={() => setSelectedUserId('user-1')}>User 1</button>
      <button onClick={() => setSelectedUserId('user-2')}>User 2</button>
      <UserProfile key={selectedUserId} userId={selectedUserId} />
    </div>
  );
}
export default App;

// How it works:
// 1. User clicks "User 2" → selectedUserId changes to 'user-2'
// 2. Key changes from 'user-1' to 'user-2'
// 3. React sees different key → destroys old UserProfile instance
// 4. React creates brand new UserProfile instance with fresh state
// 5. Form fields are empty, ready for User 2's data

// Benefits:
// ✅ Guaranteed fresh state on entity switch
// ✅ Animations reset properly
// ✅ No stale data issues
// ✅ Perfect for forms, modals, wizards`}
              />
            </Stack>
          </Card>
        </section>

        {/* Event Listeners: Memory Leak Prevention */}
        <section id="event-listeners" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"👻 8. Event Listeners: Memory Leak Prevention"}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"Ghost listeners are haunting your app! 👻 Every time a component mounts without cleaning up its event listeners, you stack another one. After 100 re-mounts, you have 100 scroll handlers firing on EVERY scroll event. Your app becomes a zombie — slow, unresponsive, and terrifying! 🧟 Always clean up!"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🔴"} <strong>Impact: CRITICAL</strong> {"— Memory leaks are silent killers. Your app works fine for 5 minutes, then becomes unusable. Prevention is the only cure! 💊"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> addEventListener cleanup {"•"} Ghost listener prevention {"•"} useEffect return function {"•"} Stable handler references
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"React handles synthetic events (onClick), but fails at global events (window resize, scroll). If you don't clean up, every mount adds another listener. After 100 re-mounts, you have 100 listeners firing on every scroll! 🐌"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Memory leak - listeners never removed
import { useState, useEffect } from 'react';

const ScrollTracker = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // 🛑 PROBLEM: Listener is added but never removed
    // If component unmounts and remounts 10 times, you have 10 listeners
    // Each scroll event fires all 10 handlers → performance disaster
    window.addEventListener('scroll', () => {
      setScrollY(window.scrollY);
    });
    // ❌ No cleanup! Listener stays forever
  }, []);

  return <div>Scroll position: {scrollY}px</div>;
};

function App() { return <ScrollTracker />; }
export default App;

// Problems: Memory leak, listeners accumulate
// - Performance degrades over time
// - App gets slower with each navigation
// - Can cause browser tab to freeze`}
                good={`// ✅ GOOD: Cleanup removes listener on unmount
import { useState, useEffect } from 'react';

const ScrollTracker = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // ✅ Senior Pattern: Define handler outside to ensure same reference
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // ✅ CRITICAL: Cleanup function removes listener
    // This runs when component unmounts OR when dependencies change
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty deps = only run on mount/unmount

  return <div>Scroll position: {scrollY}px</div>;
};

// More complex example with resize listener
const ResponsiveComponent = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // ✅ Always return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>Width: {width}px</div>;
};

function App() {
  return (
    <div>
      <ScrollTracker />
      <ResponsiveComponent />
    </div>
  );
}
export default App;`}
              />
            </Stack>
          </Card>
        </section>

        {/* useId: The SSR Hydration Fix */}
        <section id="use-id" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"🆔 9. useId: The SSR Hydration Fix"}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"Math.random() in SSR is a ticking time bomb! 💣 Server says ID-42, client says ID-7 — BOOM, hydration mismatch! 💥 useId generates stable, deterministic IDs that match perfectly between server and client. It's like giving each element a passport that works in both countries! 🛂✨"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🔵"} <strong>Impact: MEDIUM</strong> {"— Essential for SSR/Next.js apps. One hook solves hydration mismatches AND improves accessibility for free! ♿"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> SSR hydration mismatches {"•"} Stable ID generation {"•"} ARIA accessibility {"•"} Form label connections
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"In SSR, the server renders HTML with one ID, then React hydrates on the client. If IDs don't match, React throws a hydration error. `useId` generates stable IDs that match between server and client — perfect for form labels and ARIA attributes! ♿🎯"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Math.random() causes hydration mismatch
import { useState } from 'react';

const FormField = ({ label }: { label: string }) => {
  // 🛑 PROBLEM: Server generates one ID, client generates different ID
  // Server: id="input-0.123456" → Client: id="input-0.789012"
  // React sees mismatch → Hydration Error!
  const inputId = \`input-\${Math.random()}\`;
  const labelId = \`label-\${Math.random()}\`;

  return (
    <div>
      <label htmlFor={inputId} id={labelId}>
        {label}
      </label>
      <input 
        id={inputId}
        aria-labelledby={labelId}
      />
    </div>
  );
};

function App() { return <FormField label="Name" />; }
export default App;

// Problems: Hydration mismatch in SSR, IDs don't match`}
                good={`// ✅ GOOD: useId generates stable IDs for SSR
import { useId } from 'react';

const FormField = ({ label }: { label: string }) => {
  // ✅ Senior Pattern: useId generates stable, unique ID
  // Server: id=":r1:" → Client: id=":r1:" (matches!)
  // No hydration mismatch, perfect for SSR
  const id = useId();
  const labelId = \`\${id}-label\`;
  const inputId = \`\${id}-input\`;

  return (
    <div>
      <label htmlFor={inputId} id={labelId}>
        {label}
      </label>
      <input 
        id={inputId}
        aria-labelledby={labelId}
        aria-describedby={\`\${id}-error\`}
      />
      {/* Error message with matching ID */}
      <span id={\`\${id}-error\`} className="sr-only">
        Error message
      </span>
    </div>
  );
};

// Multiple fields example
const ContactForm = () => {
  const nameId = useId();
  const emailId = useId();

  return (
    <form>
      <div>
        <label htmlFor={\`\${nameId}-input\`}>Name</label>
        <input id={\`\${nameId}-input\`} />
      </div>
      <div>
        <label htmlFor={\`\${emailId}-input\`}>Email</label>
        <input id={\`\${emailId}-input\`} />
      </div>
    </form>
  );
};

function App() { return <ContactForm />; }
export default App;`}
              />
            </Stack>
          </Card>
        </section>

        {/* useDeferredValue: The UX "Shock Absorber" */}
        <section id="use-deferred-value" className={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {"🧲 10. useDeferredValue: The UX \"Shock Absorber\""}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {"Debouncing feels like talking to someone with a 500ms delay — awkward! 😬 useDeferredValue is the upgrade: the input updates INSTANTLY while the heavy list renders whenever React has a free moment. It's like having a personal assistant who takes notes immediately but processes them when they have time! 📝⚡"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🟠"} <strong>Impact: HIGH</strong> {"— The modern replacement for debouncing. Better UX, less code, and React handles the scheduling for you! 🎛️"}
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> useDeferredValue vs debounce {"•"} Stale state indicators {"•"} Interruptible updates {"•"} Instant input feedback
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
                <Text className={styles.infoText}>
                  {"💡"} <strong>Why this matters:</strong> {"Unlike debouncing (which delays updates), `useDeferredValue` allows immediate UI updates while deferring expensive computations. The input feels instant, and the list updates when React has time. Snappy UX with zero artificial delays! 🚀"}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Debouncing feels sluggish
import { useState, useEffect } from 'react';

const HeavySearchResults = ({ query }) => {
  const items = Array.from({ length: 100 }, (_, i) => \`Item \${i}\`);
  const filtered = items.filter(item => item.includes(query));
  return <ul>{filtered.map(item => <li key={item}>{item}</li>)}</ul>;
};

const SearchFeature = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <HeavySearchResults query={debouncedQuery} />
    </div>
  );
};
export default SearchFeature;`}
                good={`// ✅ GOOD: useDeferredValue feels snappy
import { useState, useDeferredValue } from 'react';

const HeavySearchResults = ({ query }: { query: string }) => {
  // Simulate expensive filtering (e.g., 10,000 items)
  const items = Array.from({ length: 10000 }, (_, i) => \`Item \${i}\`);
  const filtered = items.filter(item => 
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ul>
      {filtered.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

const SearchFeature = () => {
  const [query, setQuery] = useState('');

  // ✅ Senior Pattern: Defer expensive updates
  // Input updates immediately, results update when CPU is free
  const deferredQuery = useDeferredValue(query);

  // Show stale results while new ones are computing
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        // ✅ Input updates instantly - user sees what they type
      />
      
      {/* Visual feedback when results are stale */}
      {isStale && (
        <div className="text-gray-500 text-sm">
          Updating results...
        </div>
      )}
      
      {/* ✅ Results update when React has time */}
      <HeavySearchResults query={deferredQuery} />
    </div>
  );
};
export default SearchFeature;

// How it works:
// 1. User types "a" → query updates immediately → input shows "a"
// 2. deferredQuery is still "" (old value)
// 3. React prioritizes input render (urgent)
// 4. When CPU is free, React updates deferredQuery to "a"
// 5. HeavySearchResults re-renders with new query
// 6. User types "ab" → process repeats, but React can interrupt old work

// Benefits:
// ✅ Input feels instant (no artificial delay)
// ✅ Results update when CPU is free
// ✅ React can interrupt old work if user keeps typing
// ✅ Better UX than debouncing
// ✅ No lag, feels snappy`}
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
          <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog/react-patterns")}>
            <span className="flex items-center gap-2">
              <span className="flex flex-col items-end">
                <span className="text-xs opacity-70 font-normal">{t("blog-next")}</span>
                <span className="font-semibold">React Patterns</span>
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

