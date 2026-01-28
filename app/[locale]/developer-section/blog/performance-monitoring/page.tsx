"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor , FullscreenSection } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function PerformanceMonitoringPage() {
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
          <li className={styles.breadcrumbCurrent}>Performance Monitoring</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Performance Monitoring & Optimization
        </Heading>
        <Text className={styles.subtitle}>
          Measure and optimize React performance: React DevTools Profiler, Web Vitals, bundle analysis, Core Web Vitals, performance budgets, real user monitoring (RUM), and optimization strategies used in production.
        </Text>
      </div>

      {/* React DevTools Profiler */}
      <FullscreenSection id="react-profiler" title="React Profiler" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. React DevTools Profiler
              </Heading>
              <Text className={styles.sectionDescription}>
                Use React's built-in Profiler component and DevTools to identify performance bottlenecks.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Profiler Component
import { Profiler, ProfilerOnRenderCallback } from 'react';

const onRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  console.log('Profiler:', {
    id,
    phase, // "mount" or "update"
    actualDuration, // Time spent rendering
    baseDuration, // Estimated time without memoization
    startTime,
    commitTime
  });

  // Send to analytics
  if (actualDuration > 16) { // > 1 frame at 60fps
    performanceAnalytics.recordSlowRender(id, actualDuration);
  }
};

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Header />
      <Profiler id="ProductList" onRender={onRenderCallback}>
        <ProductList />
      </Profiler>
    </Profiler>
  );
}

// ✅ Performance monitoring hook
function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration > 100) {
        console.warn(\`\${componentName} took \${duration}ms to render\`);
      }

      // Send to monitoring service
      analytics.track('component_render_time', {
        component: componentName,
        duration
      });
    };
  });
}

// Usage
function ExpensiveComponent() {
  usePerformanceMonitor('ExpensiveComponent');
  // Component logic
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Web Vitals */}
      <FullscreenSection id="web-vitals" title="Web Vitals" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Web Vitals & Core Web Vitals
              </Heading>
              <Text className={styles.sectionDescription}>
                Measure and track Core Web Vitals (LCP, FID, CLS) to ensure optimal user experience.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  analytics.track('web_vital', {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    rating: metric.rating // 'good', 'needs-improvement', or 'poor'
  });
}

// Track all Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// ✅ Custom performance observer
function useWebVitals() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log or send to analytics
        console.log(entry.name, entry.duration);
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    return () => observer.disconnect();
  }, []);
}

// ✅ Measure custom operations
function measurePerformance(name: string, fn: () => void) {
  performance.mark(\`\${name}-start\`);
  fn();
  performance.mark(\`\${name}-end\`);
  performance.measure(name, \`\${name}-start\`, \`\${name}-end\`);
  
  const measure = performance.getEntriesByName(name)[0];
  console.log(\`\${name}: \${measure.duration}ms\`);
}

// Usage
measurePerformance('dataProcessing', () => {
  processLargeDataset(data);
});`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Bundle Analysis */}
      <FullscreenSection id="bundle-analysis" title="Bundle Analysis" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Bundle Analysis
              </Heading>
              <Text className={styles.sectionDescription}>
                Analyze your bundle size and identify optimization opportunities.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Bundle analysis with webpack-bundle-analyzer
// package.json scripts
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "build": "next build"
  }
}

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  // Your config
});

// ✅ Dynamic imports for code splitting
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});

// ✅ Tree shaking optimization
// Use named exports instead of default exports
export { ComponentA, ComponentB }; // ✅ Good
export default ComponentA; // ❌ Bad for tree shaking

// ✅ Analyze import costs
function useImportCost() {
  useEffect(() => {
    // Use tools like import-cost extension
    // Or analyze in build time
  }, []);
}

// ✅ Monitor bundle size in CI
// .github/workflows/bundle-size.yml
// name: Bundle Size
// on: [pull_request]
// jobs:
//   analyze:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v2
//       - run: npm ci
//       - run: npm run build
//       - uses: preactjs/compressed-size-action@v2`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>
    </BlogContentLayout>
  );
}

