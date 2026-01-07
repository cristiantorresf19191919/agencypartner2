"use client";

import { useState } from "react";
import { Stack, Heading, Text, ButtonLink } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import styles from "./BlogPage.module.css";

export default function DeveloperBlogPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const sections = [
    {
      id: "react-patterns",
      title: t("blog-react-patterns"),
      description: t("blog-react-patterns-desc"),
      icon: "⚛️",
      color: "from-blue-500 to-cyan-500",
      topics: [
        "Compound Components",
        "Higher-Order Components (HOC)",
        "Custom Hooks",
        "Render Props",
        "Containment Pattern",
        "Slot Pattern",
        "Selective Hydration",
      ],
    },
    {
      id: "container-presentational-pattern",
      title: "Container/Presentational Pattern with Render Props",
      description: "The 'Secret Sauce' for scalable React apps. Learn how to separate logic from UI, build reusable data sources, and create maintainable components that scale with your application.",
      icon: "🏗️",
      color: "from-emerald-500 to-teal-500",
      topics: [
        "Container/Presentational Pattern",
        "Render Props",
        "DataSource Pattern",
        "Separation of Concerns",
        "LocalStorage Integration",
        "Reusable Logic Components",
      ],
    },
    {
      id: "advanced-react-hooks",
      title: "Advanced React Hooks & Patterns",
      description: "Senior-level patterns that solve real production problems: Performance, Visual Stability, and Race Conditions. Learn useTransition, useLayoutEffect, callback refs, and modern router architecture.",
      icon: "🚀",
      color: "from-violet-500 to-purple-500",
      topics: [
        "useTransition (Non-Blocking UI)",
        "useLayoutEffect (Preventing Flicker)",
        "Callback Ref Pattern",
        "Router Loaders (Modern Architecture)",
      ],
    },
    {
      id: "advanced-react-concepts",
      title: "Advanced React Concepts",
      description: "Senior-level documentation focusing on the why (architecture/trade-offs) rather than just the how (syntax). Learn the Element Prop Pattern, Context API optimization, and when to avoid useEffect.",
      icon: "🎯",
      color: "from-cyan-500 to-blue-500",
      topics: [
        "Element Prop Pattern (Inversion of Control)",
        "Split Context Pattern (Performance)",
        "Derived State (Less useEffect)",
        "When to Use useEffect",
      ],
    },
    {
      id: "design-patterns",
      title: t("blog-design-patterns"),
      description: t("blog-design-patterns-desc"),
      icon: "🎨",
      color: "from-purple-500 to-pink-500",
      topics: [
        "Singleton",
        "Factory",
        "Observer",
        "Strategy",
        "Decorator",
        "Adapter",
        "Facade",
        "Command",
      ],
    },
    {
      id: "solid-principles",
      title: t("blog-solid-principles"),
      description: t("blog-solid-principles-desc"),
      icon: "🏗️",
      color: "from-green-500 to-emerald-500",
      topics: [
        "Single Responsibility",
        "Open/Closed",
        "Liskov Substitution",
        "Interface Segregation",
        "Dependency Inversion",
      ],
    },
    {
      id: "performance-optimization",
      title: t("blog-performance-optimization"),
      description: t("blog-performance-optimization-desc"),
      icon: "⚡",
      color: "from-orange-500 to-red-500",
      topics: [
        "Code-Splitting and Lazy-Loading",
        "useCallback Hook",
        "useMemo Hook",
        "State Collocation",
        "Lifting Components Up",
        "Throttling",
        "Debouncing",
      ],
    },
    {
      id: "api-layer",
      title: t("blog-api-layer"),
      description: t("blog-api-layer-desc"),
      icon: "🔌",
      color: "from-indigo-500 to-purple-500",
      topics: [
        "API Layer Architecture",
        "Separation of Concerns",
        "Custom Hooks for API",
        "TypeScript with API",
        "Async Operations",
        "Error Handling",
        "Request Management",
      ],
    },
    {
      id: "react-query",
      title: "React Query: Production Patterns",
      description: "Production-grade React Query patterns: Optimistic Updates, Race Condition handling, Data Transformation, and Cancellation. Learn how senior engineers implement these concepts in real-world applications.",
      icon: "⚡",
      color: "from-pink-500 to-rose-500",
      topics: [
        "Optimistic Updates",
        "Search Grid with Cancellation",
        "Infinite Feed with Data Transform",
        "Race Condition Prevention",
        "Placeholder Data",
        "Query Selectors",
      ],
    },
    {
      id: "advanced-patterns",
      title: "Advanced Patterns: Design System Foundations",
      description: "Render Props, Wrapper Components, and Polymorphic Components are the building blocks of Design Systems and Headless UI libraries. Essential skills for building reusable component libraries.",
      icon: "🧩",
      color: "from-purple-500 to-indigo-500",
      topics: [
        "Render Props Pattern",
        "Wrapper Components (Guards)",
        "Polymorphic Components",
        "Design System Architecture",
        "Headless UI Patterns",
        "TypeScript Generics",
      ],
    },
    {
      id: "state-management",
      title: "State Management in 2025",
      description: "Learn modern React state management: Immer for immutable updates, Zustand for shared state, TanStack Query for remote data, and nuqs for URL state. Understand when you actually need a state management library.",
      icon: "📦",
      color: "from-emerald-500 to-teal-500",
      topics: [
        "useImmer & useImmerReducer",
        "Zustand for Shared State",
        "TanStack Query for Remote Data",
        "URL State with nuqs",
        "State Concerns Breakdown",
        "When to Use What",
      ],
    },
    {
      id: "react-design-patterns",
      title: "React Design Patterns 2025",
      description: "Comprehensive guide to React design patterns and best practices for 2025. Covering function components, custom hooks, TypeScript integration, React 19 features, modern frameworks, and component libraries.",
      icon: "🎨",
      color: "from-indigo-500 to-purple-500",
      topics: [
        "Modern Component Patterns",
        "Custom Hooks",
        "Context API & React 19",
        "TypeScript Best Practices",
        "React 19 Features",
        "Next.js, Remix, Vite",
        "Tailwind & Component Libraries",
      ],
    },
    {
      id: "kotlin-multiplatform",
      title: "Kotlin Multiplatform UI Patterns",
      description:
        "Practical Compose Multiplatform techniques to ship one shared UI codebase across Android, iOS, and Desktop without losing platform polish.",
      icon: "📱",
      color: "from-indigo-500 to-violet-500",
      topics: [
        "Shared UiState + Events",
        "Expect/Actual UI adapters",
        "Adaptive layouts by size",
        "Shared navigation graphs",
        "Design tokens per platform",
        "Compose resources pipeline",
        "Back/predictive gestures",
      ],
    },
    {
      id: "testing-strategies",
      title: "Testing Strategies & Patterns",
      description: "Comprehensive testing guide: Unit, Integration, E2E testing with React Testing Library, Jest, Vitest, Playwright. Learn testing patterns, mocking strategies, and how to test hooks, context, and async operations.",
      icon: "🧪",
      color: "from-green-500 to-emerald-500",
      topics: [
        "React Testing Library Best Practices",
        "Testing Custom Hooks",
        "Testing Context & Providers",
        "Mocking Strategies",
        "Integration Testing Patterns",
        "E2E Testing with Playwright",
        "Test-Driven Development (TDD)",
        "Snapshot Testing",
        "Accessibility Testing",
      ],
    },
    {
      id: "error-handling",
      title: "Error Boundaries & Error Handling Patterns",
      description: "Master production-grade error handling: Error Boundaries, error recovery strategies, error reporting, and graceful degradation patterns. Learn how to build resilient React applications.",
      icon: "🛡️",
      color: "from-red-500 to-orange-500",
      topics: [
        "Error Boundary Pattern",
        "Error Recovery Strategies",
        "Error Reporting (Sentry, LogRocket)",
        "Graceful Degradation",
        "Async Error Handling",
        "Error State Management",
        "User-Friendly Error Messages",
      ],
    },
    {
      id: "accessibility",
      title: "Accessibility Patterns & Best Practices",
      description: "Build accessible React applications following WCAG guidelines. Learn ARIA patterns, keyboard navigation, screen reader optimization, and inclusive design practices.",
      icon: "♿",
      color: "from-blue-500 to-indigo-500",
      topics: [
        "ARIA Patterns",
        "Keyboard Navigation",
        "Focus Management",
        "Screen Reader Optimization",
        "Semantic HTML",
        "Color Contrast & Visual Accessibility",
        "Form Accessibility",
        "Accessible Components Library",
      ],
    },
    {
      id: "typescript-advanced",
      title: "Advanced TypeScript Patterns for React",
      description: "Master TypeScript with React: Generic components, utility types, type inference, discriminated unions, and advanced patterns that make your code type-safe and maintainable.",
      icon: "📘",
      color: "from-blue-600 to-cyan-500",
      topics: [
        "Generic Components",
        "Utility Types & Mapped Types",
        "Discriminated Unions",
        "Type Inference Patterns",
        "Branded Types",
        "Type Guards & Assertions",
        "Advanced Hooks Typing",
        "Template Literal Types",
      ],
    },
    {
      id: "concurrent-features",
      title: "React Concurrent Features & Suspense",
      description: "Deep dive into React 18+ concurrent features: Suspense, useDeferredValue, useTransition, streaming SSR, and how to build responsive UIs that never block.",
      icon: "⚡",
      color: "from-yellow-500 to-orange-500",
      topics: [
        "Suspense & Error Boundaries",
        "useDeferredValue Pattern",
        "useTransition for Non-Blocking UI",
        "Streaming SSR",
        "Concurrent Rendering",
        "Time Slicing",
        "Priority-based Updates",
      ],
    },
    {
      id: "server-components",
      title: "Server Components & React Server Components",
      description: "Next.js 13+ Server Components: When to use Server vs Client components, data fetching patterns, streaming, and building hybrid applications.",
      icon: "🖥️",
      color: "from-gray-600 to-slate-500",
      topics: [
        "Server vs Client Components",
        "Data Fetching Patterns",
        "Streaming & Progressive Rendering",
        "Server Actions",
        "Hybrid Architecture",
        "Performance Benefits",
        "Migration Strategies",
      ],
    },
    {
      id: "form-management",
      title: "Form Management & Validation Patterns",
      description: "Production-ready form handling: React Hook Form, Formik, Zod validation, complex form patterns, multi-step forms, and form state management.",
      icon: "📝",
      color: "from-purple-500 to-pink-500",
      topics: [
        "React Hook Form Patterns",
        "Zod Schema Validation",
        "Complex Form Patterns",
        "Multi-step Forms",
        "Dynamic Forms",
        "Form State Management",
        "File Upload Patterns",
        "Form Performance Optimization",
      ],
    },
    {
      id: "security",
      title: "React Security Best Practices",
      description: "Secure React applications: XSS prevention, CSRF protection, authentication patterns, authorization, secure data handling, and security auditing.",
      icon: "🔒",
      color: "from-red-600 to-pink-600",
      topics: [
        "XSS Prevention",
        "CSRF Protection",
        "Authentication Patterns",
        "Authorization Strategies",
        "Secure Data Handling",
        "Content Security Policy",
        "Dependency Security",
        "Security Auditing",
      ],
    },
    {
      id: "performance-monitoring",
      title: "Performance Monitoring & Optimization",
      description: "Measure and optimize React performance: React DevTools Profiler, Web Vitals, bundle analysis, Core Web Vitals, performance budgets, and real user monitoring.",
      icon: "📊",
      color: "from-teal-500 to-cyan-500",
      topics: [
        "React DevTools Profiler",
        "Web Vitals & Core Web Vitals",
        "Bundle Analysis",
        "Performance Budgets",
        "Real User Monitoring (RUM)",
        "Lighthouse CI",
        "Performance Metrics",
        "Optimization Strategies",
      ],
    },
    {
      id: "code-splitting",
      title: "Advanced Code Splitting & Bundling",
      description: "Master code splitting strategies: Route-based splitting, component-based splitting, dynamic imports, bundle optimization, and modern bundler configurations.",
      icon: "📦",
      color: "from-indigo-600 to-purple-600",
      topics: [
        "Route-based Code Splitting",
        "Component-based Splitting",
        "Dynamic Imports",
        "Bundle Optimization",
        "Tree Shaking",
        "Module Federation",
        "Bundle Analysis Tools",
      ],
    },
    {
      id: "animations",
      title: "Animation & Transition Patterns",
      description: "Smooth animations in React: Framer Motion, React Spring, CSS transitions, layout animations, gesture handling, and performance-optimized animations.",
      icon: "🎬",
      color: "from-pink-500 to-rose-500",
      topics: [
        "Framer Motion Patterns",
        "React Spring",
        "Layout Animations",
        "Gesture Handling",
        "Performance Optimization",
        "CSS-in-JS Animations",
        "Animation Best Practices",
      ],
    },
    {
      id: "internationalization",
      title: "Internationalization (i18n) Patterns",
      description: "Build multilingual React applications: react-i18next, date/time formatting, RTL support, locale management, and translation strategies.",
      icon: "🌍",
      color: "from-green-600 to-teal-600",
      topics: [
        "react-i18next Patterns",
        "Date/Time Formatting",
        "RTL Support",
        "Locale Management",
        "Translation Strategies",
        "Pluralization",
        "Currency Formatting",
      ],
    },
    {
      id: "react-internals",
      title: "React Internals & Advanced Concepts",
      description: "Understand React's internals: Fiber architecture, reconciliation algorithm, render phases, commit phases, and how React works under the hood.",
      icon: "🔬",
      color: "from-violet-600 to-purple-600",
      topics: [
        "Fiber Architecture",
        "Reconciliation Algorithm",
        "Render & Commit Phases",
        "Priority System",
        "Event System",
        "Hooks Implementation",
        "Scheduler",
      ],
    },
    {
      id: "migration-patterns",
      title: "Migration & Refactoring Patterns",
      description: "Strategies for migrating legacy React code: Class to Hooks migration, Redux to modern state management, upgrading React versions, and incremental refactoring.",
      icon: "🔄",
      color: "from-amber-500 to-yellow-500",
      topics: [
        "Class to Hooks Migration",
        "Redux to Modern State",
        "React Version Upgrades",
        "Incremental Refactoring",
        "Legacy Code Patterns",
        "Breaking Changes Handling",
      ],
    },
    {
      id: "micro-frontends",
      title: "Micro-Frontends Architecture",
      description: "Build scalable micro-frontend architectures: Module Federation, single-spa, independent deployments, shared dependencies, and team autonomy patterns.",
      icon: "🏗️",
      color: "from-slate-600 to-gray-600",
      topics: [
        "Module Federation",
        "Single-SPA Architecture",
        "Independent Deployments",
        "Shared Dependencies",
        "Team Autonomy",
        "Communication Patterns",
        "Routing Strategies",
      ],
    },
  ];

  return (
    <main>
      <DeveloperHeader />
      <div className={styles.blogPage}>
        <div className={styles.content}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <ol className={styles.breadcrumbList}>
            <li>
              <ButtonLink
                href={createLocalizedPath("/")}
                variant="secondary"
                className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
              >
                {t("blog-breadcrumb-home")}
              </ButtonLink>
            </li>
            <li className="text-white/40">/</li>
            <li className="text-white font-medium">{t("nav-blog")}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className={styles.headerSection}>
          <Heading className={styles.title}>
            {t("blog-title")}
          </Heading>
          <Text className={styles.subtitle}>
            {t("blog-subtitle")}
          </Text>
        </div>

        {/* Sections Grid */}
        <div className={styles.sectionsGrid}>
          {sections.map((section) => (
            <a
              key={section.id}
              href={createLocalizedPath(`/developer-section/blog/${section.id}`)}
              className={styles.sectionCard}
            >
              <div
                className={styles.iconContainer}
                style={{
                  background: `linear-gradient(to bottom right, ${
                    section.color.includes('indigo') 
                      ? 'rgba(129, 140, 248, 0.25)' 
                      : section.color.includes('blue') 
                        ? 'rgba(147, 197, 253, 0.25)' 
                        : section.color.includes('purple') 
                          ? 'rgba(196, 181, 253, 0.25)' 
                          : section.color.includes('orange')
                            ? 'rgba(251, 146, 60, 0.25)'
                            : 'rgba(134, 239, 172, 0.25)'
                  }, ${
                    section.color.includes('purple') 
                      ? 'rgba(196, 181, 253, 0.25)' 
                      : section.color.includes('cyan') 
                        ? 'rgba(165, 243, 252, 0.25)' 
                        : section.color.includes('pink') 
                          ? 'rgba(251, 146, 60, 0.25)' 
                          : section.color.includes('red')
                            ? 'rgba(248, 113, 113, 0.25)'
                            : 'rgba(110, 231, 183, 0.25)'
                  })`
                }}
              >
                {section.icon}
              </div>
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {section.title}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {section.description}
                </Text>
              </div>
              <div className="mt-auto">
                <Text className={styles.topicsLabel}>
                  Topics Covered:
                </Text>
                <div 
                  className={`${styles.topicsList} ${expandedCards.has(section.id) ? styles.topicsListExpanded : ''}`}
                >
                  {section.topics.map((topic, idx) => {
                    const isVisible = expandedCards.has(section.id) || idx < 3;
                    return (
                      <span 
                        key={idx} 
                        className={`${styles.topicTag} ${isVisible ? styles.topicTagVisible : styles.topicTagHidden}`}
                      >
                        {topic}
                      </span>
                    );
                  })}
                </div>
                {section.topics.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleCard(section.id);
                    }}
                    className={styles.expandButton}
                    aria-label={expandedCards.has(section.id) ? "Show less topics" : "Show more topics"}
                  >
                    <span className={styles.expandButtonText}>
                      {expandedCards.has(section.id) ? "Show Less" : `+${section.topics.length - 3} More`}
                    </span>
                    <svg 
                      className={`${styles.expandIcon} ${expandedCards.has(section.id) ? styles.expandIconRotated : ''}`}
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none"
                    >
                      <path 
                        d="M4 6L8 10L12 6" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div className={styles.sectionCta}>
                Explore Section <i className="fas fa-arrow-right"></i>
              </div>
            </a>
          ))}
        </div>

        {/* Features Section */}
        <div className={styles.featuresSection}>
          <Heading level={2} className={styles.featuresTitle}>
            {t("blog-features-title")}
          </Heading>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💻</div>
              <Heading level={3} className={styles.featureTitle}>
                {t("blog-feature-editor-title")}
              </Heading>
              <Text className={styles.featureDescription}>
                {t("blog-feature-editor-desc")}
              </Text>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <Heading level={3} className={styles.featureTitle}>
                {t("blog-feature-comparison-title")}
              </Heading>
              <Text className={styles.featureDescription}>
                {t("blog-feature-comparison-desc")}
              </Text>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <Heading level={3} className={styles.featureTitle}>
                {t("blog-feature-oop-title")}
              </Heading>
              <Text className={styles.featureDescription}>
                {t("blog-feature-oop-desc")}
              </Text>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className={styles.backButton}>
          <ButtonLink
            variant="secondary"
            href={createLocalizedPath("/developer-section")}
            className="!bg-white !text-purple-600 !border-transparent hover:!bg-gray-100 shadow-lg px-8 py-3 rounded-full font-semibold"
          >
            ← {t("developer-section-title")}
          </ButtonLink>
        </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

