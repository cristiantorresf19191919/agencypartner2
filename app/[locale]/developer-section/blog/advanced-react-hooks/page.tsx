"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card , FullscreenSection } from "@/components/ui";
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
        <FullscreenSection id="use-transition" title="Use Transition" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  1. The "Non-Blocking" UI (`useTransition`)
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Updating all state at once, causing the input to freeze while the list filters.
                  <br /><br />
                  <strong>The Senior Fix:</strong> Split the "urgent" update (typing) from the "heavy" update (filtering).
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> In production, users expect instant feedback when typing. By marking heavy updates as "transitions", React can interrupt them if the user continues typing, keeping the UI responsive.
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
};`}
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
};`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* Preventing "Flicker" (useLayoutEffect) */}
        <FullscreenSection id="use-layout-effect" title="Use Layout Effect" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  2. Preventing "Flicker" (`useLayoutEffect`)
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Using `useEffect` to position a Tooltip. The user sees it render in the wrong spot, then "jump" to the right spot.
                  <br /><br />
                  <strong>The Senior Fix:</strong> Use `useLayoutEffect` to calculate position *before* the browser paints the screen.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> `useLayoutEffect` runs synchronously after DOM mutations but before the browser paints. This prevents visual "jumps" that hurt UX, especially for tooltips, modals, and positioned elements.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Tooltip appears in wrong position, then jumps
import { useState, useEffect, useRef } from 'react';

export const Tooltip = ({ targetRef, children }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 🛑 PROBLEM: useEffect runs AFTER the browser paints
  // User sees: Tooltip at (0,0) → flash → Tooltip at correct position
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
      style={{ 
        position: 'fixed', 
        top: coords.top, 
        left: coords.left
      }}
      className="bg-black text-white p-2 rounded shadow-lg"
    >
      {children}
    </div>
  );
};`}
                good={`// ✅ GOOD: Calculate position before paint (no flicker)
import { useState, useLayoutEffect, useRef } from 'react';

export const SmartTooltip = ({ targetRef, children }) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // ✅ Senior Pattern: Measure DOM layout synchronously
  // This runs BEFORE the browser paints, so the tooltip appears in the correct position immediately
  useLayoutEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Calculate position so it's centered above the target
      setCoords({
        top: targetRect.top - tooltipRect.height - 10,
        left: targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
      });
    }
  }, [targetRef]); // Dependency ensures we recalc if target changes

  return (
    <div 
      ref={tooltipRef}
      style={{ 
        position: 'fixed', 
        top: coords.top, 
        left: coords.left,
        opacity: coords.top === 0 ? 0 : 1 // Hide until calculated
      }}
      className="bg-black text-white p-2 rounded shadow-lg"
    >
      {children}
    </div>
  );
};`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* The "Callback Ref" Pattern */}
        <FullscreenSection id="callback-ref" title="Callback Ref" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  3. The "Callback Ref" Pattern (Advanced DOM)
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Using `useEffect` with a `ref.current` dependency (which doesn't work reliably) to detect when an element appears.
                  <br /><br />
                  <strong>The Senior Fix:</strong> Passing a function to `ref`. React calls this function precisely when the node mounts or unmounts.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> Callback refs fire exactly when DOM nodes mount/unmount, making them perfect for measurements, animations, and third-party library integration. Unlike `useEffect` with refs, they're guaranteed to run at the right time.
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
};`}
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
};`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* Modern Architecture (Loaders vs. Waterfalls) */}
        <FullscreenSection id="modern-architecture" title="Modern Architecture" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  4. Modern Architecture (Loaders vs. Waterfalls)
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Loading data inside `useEffect` in every component. (Component renders → Spinner → Fetch → Render).
                  <br /><br />
                  <strong>The Senior Fix:</strong> Lifting data fetching to the <strong>Router</strong> level (v6.4+). Fetching happens *before* rendering starts.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> Router loaders fetch data in parallel with code bundle downloading. By the time the component mounts, data is often already there. This eliminates loading spinners, reduces waterfalls, and improves perceived performance dramatically.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Data fetching waterfall in every component
// Component renders → Spinner → Fetch → Render
import { useState, useEffect } from 'react';

export const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🛑 PROBLEM: Waterfall pattern
  // 1. Component mounts
  // 2. Shows loading spinner
  // 3. Fetches data
  // 4. Updates state
  // 5. Re-renders with data
  // This creates a poor UX with multiple loading states
  useEffect(() => {
    setLoading(true);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

// Problems:
// - Loading spinner on every navigation
// - Data fetching happens AFTER component mounts
// - Can't prefetch data
// - Multiple components = multiple waterfalls`}
                good={`// ✅ GOOD: Router-level data fetching (React Router v6.4+)
// router.tsx (Definition)
import { createBrowserRouter } from "react-router-dom";
import { UserProfile } from "./UserProfile";

export const router = createBrowserRouter([
  {
    path: "/user/:id",
    element: <UserProfile />,
    // ✅ Senior Pattern: The "Loader"
    // This runs in parallel with the code bundle downloading.
    // By the time the component mounts, data is often already there.
    loader: async ({ params }) => {
      const res = await fetch(\`/api/users/\${params.id}\`);
      if (res.status === 404) throw new Response("Not Found", { status: 404 });
      return res.json();
    },
    // ✅ Error Boundaries are native now
    errorElement: <div className="p-4 bg-red-100">User not found or API crashed!</div>
  }
]);

// UserProfile.tsx (Component)
import { useLoaderData } from "react-router-dom";

export const UserProfile = () => {
  // No loading state needed! The component ONLY renders if data is ready.
  const user = useLoaderData() as { name: string; email: string };

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

// Benefits:
// ✅ Data fetches in parallel with code download
// ✅ Component only renders when data is ready
// ✅ No loading spinners needed
// ✅ Error handling at router level
// ✅ Can prefetch data on hover/link focus
// ✅ Eliminates waterfall patterns`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* React Portals: Escaping the CSS Trap */}
        <FullscreenSection id="react-portals" title="React Portals" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  5. React Portals: Escaping the CSS Trap
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Thinking Portals are just for Modals. Putting Tooltips or Dropdowns inside containers with `overflow: hidden` or weird `z-index`, causing them to get clipped.
                  <br /><br />
                  <strong>The Senior Fix:</strong> Use Portals to render components at the `document.body` level, bypassing all parent CSS constraints while keeping component logic in the child.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> Portals let you write component logic inside the child, but render the DOM node at a different level. This breaks out of Stacking Contexts, overflow constraints, and z-index issues that would otherwise clip your UI elements.
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

const Tooltip = ({ children }) => {
  return (
    <div style={{ 
      position: 'absolute', 
      top: '-50px',
      background: 'black',
      color: 'white',
      padding: '8px'
    }}>
      {children}
    </div>
  );
};

// Problems:
// - Tooltip gets clipped by parent's overflow: hidden
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
    document.body // ✅ Renders here, not in the parent tree
  );
};

// Benefits:
// ✅ Escapes overflow: hidden constraints
// ✅ Bypasses z-index stacking contexts
// ✅ Perfect for modals, tooltips, dropdowns
// ✅ Component logic stays in child, DOM renders elsewhere`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* Error Boundaries: The "Blast Radius" Control */}
        <FullscreenSection id="error-boundaries" title="Error Boundaries" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  6. Error Boundaries: The "Blast Radius" Control
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Wrapping the whole `App` in one Error Boundary. If one widget crashes, the entire app goes down.
                  <br /><br />
                  <strong>The Senior Fix:</strong> Use <strong>Granular Boundaries</strong>. Wrap specific high-risk widgets (Payment Form, Third-Party Graph) in their own boundaries. If the graph crashes, the rest of the dashboard remains usable.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxRed} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> Error Boundaries are currently the only feature that still requires a Class Component (no Hook exists yet). They catch errors during rendering, in lifecycle methods, and in constructors. Granular boundaries limit the "blast radius" of failures, keeping the rest of your app functional.
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

// 🛑 PROBLEM: If PaymentForm crashes, entire dashboard dies
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

// Problems:
// - One crash = entire app down
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

// ✅ Senior Pattern: Granular Boundaries
// Each high-risk widget has its own boundary
function App() {
  return (
    <Dashboard>
      {/* ✅ If PaymentForm crashes, only this section shows error */}
      <ErrorBoundary
        fallback={<div>Payment form unavailable. Please try again later.</div>}
        onError={(error) => {
          // Log to error tracking service
          console.error('PaymentForm error:', error);
        }}
      >
        <PaymentForm />
      </ErrorBoundary>

      {/* ✅ If ThirdPartyGraph crashes, dashboard still works */}
      <ErrorBoundary
        fallback={<div>Graph unavailable. Other features still work.</div>}
      >
        <ThirdPartyGraph />
      </ErrorBoundary>

      {/* ✅ UserSettings is safe, no boundary needed */}
      <UserSettings />
    </Dashboard>
  );
}

// Benefits:
// ✅ Isolated failures don't crash entire app
// ✅ Better user experience (partial functionality)
// ✅ Easier debugging (know exactly which widget failed)
// ✅ Can log errors per widget to monitoring service`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* Keys Explained: The Reset Button */}
        <FullscreenSection id="keys-explained" title="Keys Explained" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  7. Keys Explained: The Reset Button
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Thinking keys are just for lists to silence warnings. Not understanding that keys are React's <strong>Identity System</strong>.
                  <br /><br />
                  <strong>The Senior Fix:</strong> Use a Key to <strong>force-reset</strong> a component. When switching from User A to User B, changing the key forces React to destroy the old instance and build a fresh one from scratch.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> Keys aren't just for lists. They're React's identity system. Changing a key tells React "this is a completely different component instance" - forcing a full remount. This is perfect for resetting form state, clearing animations, or handling user switches.
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
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(user => {
        setName(user.name);
        setEmail(user.email);
      });
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
      {/* ❌ React reuses component, form might show stale data */}
      <UserProfile userId={selectedUserId} />
    </div>
  );
}

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
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(user => {
        setName(user.name);
        setEmail(user.email);
      });
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
      {/* ✅ Senior Pattern: Key forces full remount */}
      {/* When userId changes, React destroys old instance and creates new one */}
      <UserProfile key={selectedUserId} userId={selectedUserId} />
    </div>
  );
}

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
        </FullscreenSection>

        {/* Event Listeners: Memory Leak Prevention */}
        <FullscreenSection id="event-listeners" title="Event Listeners" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  8. Event Listeners: Memory Leak Prevention
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Adding global event listeners (window resize, scroll) without removing them. The app gets slower every time the component re-mounts because you're stacking thousands of "ghost" listeners.
                  <br /><br />
                  <strong>The Senior Fix:</strong> Always pair your `addEventListener` with a `removeEventListener` inside the `useEffect` cleanup return.
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> React handles synthetic events (onClick), but fails at global events (window resize, scroll). If you don't clean up, every mount adds another listener. After 100 re-mounts, you have 100 listeners firing on every scroll, causing severe performance degradation.
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

// Problems:
// - Memory leak: listeners accumulate on every mount
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

// Benefits:
// ✅ No memory leaks
// ✅ Consistent performance
// ✅ Proper resource cleanup
// ✅ Prevents ghost listeners`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* useId: The SSR Hydration Fix */}
        <FullscreenSection id="use-id" title="Use Id" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  9. useId: The SSR Hydration Fix
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Using `Math.random()` for IDs in Server-Side Rendering (Next.js/Remix). Server generates "ID-1", client generates "ID-5" → <strong>Hydration Mismatch</strong> error.
                  <br /><br />
                  <strong>The Senior Fix:</strong> Use `useId` which guarantees a stable, unique ID on both server and client. Perfect for accessibility ({'`aria-labelledby={id}`'}).
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> In SSR, the server renders HTML with one ID, then React hydrates on the client. If IDs don't match, React throws a hydration error. `useId` generates stable IDs that match between server and client, making it perfect for form labels, ARIA attributes, and accessibility.
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

// Problems:
// - Hydration mismatch errors in SSR
// - IDs don't match between server/client
// - Breaks accessibility (screen readers)
// - Unpredictable behavior`}
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

// Benefits:
// ✅ No hydration mismatches
// ✅ Stable IDs across server/client
// ✅ Perfect for accessibility (ARIA)
// ✅ Works with Next.js, Remix, any SSR framework
// ✅ Each component instance gets unique ID`}
              />
            </Stack>
          </Card>
        </FullscreenSection>

        {/* useDeferredValue: The UX "Shock Absorber" */}
        <FullscreenSection id="use-deferred-value" title="Use Deferred Value" sectionClassName={styles.section}>
          <Card className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  10. useDeferredValue: The UX "Shock Absorber"
                </Heading>
                <Text className={styles.sectionDescription}>
                  <strong>The Junior Mistake:</strong> Debouncing search (waiting 500ms) feels sluggish. The user types, nothing happens, then results appear.
                  <br /><br />
                  <strong>The Senior Fix:</strong> Use `useDeferredValue` to update the UI immediately (input accepts typing) while deferring the heavy "result list" update until the CPU is free. It's like telling React: "Render the input *now*, and render the list *when you can*."
                </Text>
              </div>

              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
                <Text className={styles.infoText}>
                  <strong>Why this matters:</strong> Unlike debouncing (which delays updates), `useDeferredValue` allows immediate UI updates while deferring expensive computations. The input feels instant, and the list updates when React has time. This creates a snappy, responsive feel without the lag of debouncing.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Debouncing feels sluggish
import { useState, useEffect } from 'react';

const SearchFeature = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 🛑 PROBLEM: User types, nothing happens for 500ms
  // Then results appear. Feels laggy and unresponsive.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        // Input updates immediately, but results are delayed
      />
      <HeavySearchResults query={debouncedQuery} />
    </div>
  );
};

// Problems:
// - User types, sees nothing for 500ms
// - Feels unresponsive and laggy
// - Artificial delay hurts UX`}
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

