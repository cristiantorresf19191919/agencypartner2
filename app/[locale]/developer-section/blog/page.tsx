"use client";

import { Stack, Heading, Text, ButtonLink } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { useEffect, useRef } from "react";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import styles from "./BlogPage.module.css";

export default function DeveloperBlogPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize particles.js with error handling
    const initParticles = () => {
      try {
        if (typeof window === "undefined" || !particlesRef.current) {
          return;
        }

        // Check for particlesJS or particles (different versions use different names)
        const particlesJS = (window as any).particlesJS || (window as any).particles;
        
        if (!particlesJS) {
          // Retry after a short delay if script hasn't loaded yet
          const timeoutId = setTimeout(() => {
            initParticles();
          }, 100);
          return () => clearTimeout(timeoutId);
        }

        particlesJS("particles-blog", {
          particles: {
            number: { value: 60 },
            color: { value: "#a06af9" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#a06af9",
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.4,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "grab" },
              onclick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: { opacity: 0.4 },
              },
            },
          },
          retina_detect: true,
        });
      } catch (error) {
        console.warn("Failed to initialize particles.js:", error);
      }
    };

    // Try to initialize immediately, or wait for script to load
    if (typeof window !== "undefined") {
      if ((window as any).particlesJS || (window as any).particles) {
        initParticles();
      } else {
        // Wait for script to load
        const checkParticles = setInterval(() => {
          if ((window as any).particlesJS || (window as any).particles) {
            clearInterval(checkParticles);
            initParticles();
          }
        }, 100);

        // Cleanup after 5 seconds if still not loaded
        const timeout = setTimeout(() => {
          clearInterval(checkParticles);
        }, 5000);

        return () => {
          clearInterval(checkParticles);
          clearTimeout(timeout);
        };
      }
    }
  }, []);

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
  ];

  return (
    <main>
      <DeveloperHeader />
      <div className={styles.blogPage}>
        {/* Particles Background */}
        <div
          id="particles-blog"
          ref={particlesRef}
          className={styles.particles}
        ></div>

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
                <div className={styles.topicsList}>
                  {section.topics.map((topic, idx) => (
                    <span key={idx} className={styles.topicTag}>
                      {topic}
                    </span>
                  ))}
                </div>
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

