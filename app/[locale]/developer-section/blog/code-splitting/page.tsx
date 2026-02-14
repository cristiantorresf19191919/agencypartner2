"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function CodeSplittingPage() {
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
          <li className={styles.breadcrumbCurrent}>Code Splitting</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Advanced Code Splitting & Bundling
        </Heading>
        <Text className={styles.subtitle}>
          Master code splitting strategies: Route-based splitting, component-based splitting, dynamic imports, bundle optimization, tree shaking, Module Federation, and modern bundler configurations.
        </Text>
      </div>

      {/* Route-based Code Splitting */}
      <section id="route-splitting" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🛤️"} 1. Route-based Code Splitting
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Why serve a buffet when your user only wants a snack? 🍕 Route-based splitting loads only what's needed per page — your users will thank you with faster load times and bigger smiles!"}
              </Text>
              <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🔴"} <strong>Impact: CRITICAL</strong> — {"The #1 performance win for most apps — can cut initial bundle size by 50%+ instantly! ⚡"}
                </Text>
              </div>
              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> React.lazy {"•"} Suspense Boundaries {"•"} Next.js Auto-splitting {"•"} Dynamic Route Imports
                </Text>
              </div>
            </div>

            <CodeEditor
              code={`// ✅ React.lazy for route splitting
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// ✅ Next.js automatic route splitting
// app/dashboard/page.tsx - automatically code split
export default function DashboardPage() {
  return <div>Dashboard</div>;
}

// ✅ Dynamic route imports
const loadDashboard = () => import('./pages/Dashboard');

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [Dashboard, setDashboard] = useState<React.ComponentType | null>(null);

  const handleClick = async () => {
    const module = await loadDashboard();
    setDashboard(() => module.default);
    setShowDashboard(true);
  };

  return (
    <div>
      <button onClick={handleClick}>Load Dashboard</button>
      {showDashboard && Dashboard && (
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      )}
    </div>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Component-based Splitting */}
      <section id="component-splitting" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🧩"} 2. Component-based Splitting
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Got a chunky chart or a beefy editor hiding below the fold? 🏋️ Don't load it until your user actually needs it — lazy loading components is like meal-prepping for performance! 📦✨"}
              </Text>
              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🟠"} <strong>Impact: HIGH</strong> — {"Heavy components can bloat your bundle by hundreds of KBs — lazy load them and watch your TTI plummet! 📉"}
                </Text>
              </div>
              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> Lazy Component Loading {"•"} Intersection Observer {"•"} Viewport-based Loading {"•"} Preload on Hover
                </Text>
              </div>
            </div>

            <CodeEditor
              code={`// ✅ Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));
const DataTable = lazy(() => import('./DataTable'));
const RichEditor = lazy(() => import('./RichEditor'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}

// ✅ Intersection Observer for viewport-based loading
function useLazyLoad(ref: React.RefObject<Element>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}

function LazyComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useLazyLoad(ref);

  return (
    <div ref={ref}>
      {isVisible ? (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyComponent />
        </Suspense>
      ) : (
        <div style={{ height: '200px' }}>Placeholder</div>
      )}
    </div>
  );
}

// ✅ Preload on hover
function PreloadableLink({ to, children }: { to: string; children: React.ReactNode }) {
  const preloadRoute = () => {
    import(\`./pages/\${to}\`);
  };

  return (
    <Link
      to={to}
      onMouseEnter={preloadRoute}
      onFocus={preloadRoute}
    >
      {children}
    </Link>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Module Federation */}
      <section id="module-federation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {"🔗"} 3. Module Federation
              </Heading>
              <Text className={styles.sectionDescription}>
                {"Think of it as Netflix for your micro-frontends — each app shares its best components like a potluck dinner! 🎉 Module Federation lets independent teams deploy and share code seamlessly. 🤝"}
              </Text>
              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🔵"} <strong>Impact: MEDIUM</strong> — {"Essential for large orgs with multiple teams — enables true micro-frontend architecture! 🏗️"}
                </Text>
              </div>
              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> Host Configuration {"•"} Remote Components {"•"} Shared Dependencies {"•"} Webpack Setup
                </Text>
              </div>
            </div>

            <CodeEditor
              code={`// ✅ Module Federation Host (Container)
// webpack.config.js
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        remoteApp: 'remote@http://localhost:3001/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};

// ✅ Using Remote Components
import { lazy, Suspense } from 'react';

const RemoteButton = lazy(() => import('remoteApp/Button'));
const RemoteHeader = lazy(() => import('remoteApp/Header'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteHeader />
        <RemoteButton onClick={() => console.log('clicked')}>
          Click me
        </RemoteButton>
      </Suspense>
    </div>
  );
}

// ✅ Module Federation Remote (Exposing)
// webpack.config.js (Remote App)
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
        './Header': './src/Header',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

