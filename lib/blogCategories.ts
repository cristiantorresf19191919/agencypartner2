export interface BlogPost {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
  topics: string[];
}

export interface BlogCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  slug: string;
  posts: BlogPost[];
}

export const blogCategories: BlogCategory[] = [
  {
    id: "react-development",
    title: "React Development",
    description: "Master React patterns, hooks, components, and advanced concepts. Learn production-ready React development from fundamentals to senior-level techniques.",
    icon: "⚛️",
    color: "from-blue-500 to-cyan-500",
    slug: "react-development",
    posts: [
      {
        id: "react-patterns",
        title: "React Patterns",
        description: "Learn fundamental React patterns: Compound Components, HOCs, Custom Hooks, Render Props, and more.",
        icon: "⚛️",
        color: "from-blue-500 to-cyan-500",
        slug: "react-patterns",
        topics: ["Compound Components", "Higher-Order Components (HOC)", "Custom Hooks", "Render Props", "Containment Pattern", "Slot Pattern", "Selective Hydration"],
      },
      {
        id: "composition-pattern",
        title: "Composition Pattern",
        description: "Learn the composition pattern and how to build reusable, flexible React components.",
        icon: "🧩",
        color: "from-purple-500 to-pink-500",
        slug: "composition-pattern",
        topics: ["Composition", "Component Reusability", "Flexible APIs"],
      },
      {
        id: "container-presentational-pattern",
        title: "Container/Presentational Pattern",
        description: "The 'Secret Sauce' for scalable React apps. Learn how to separate logic from UI.",
        icon: "🏗️",
        color: "from-emerald-500 to-teal-500",
        slug: "container-presentational-pattern",
        topics: ["Container/Presentational Pattern", "Render Props", "DataSource Pattern", "Separation of Concerns"],
      },
      {
        id: "advanced-react-hooks",
        title: "Advanced React Hooks & Patterns",
        description: "Senior-level patterns that solve real production problems: Performance, Visual Stability, and Race Conditions.",
        icon: "🚀",
        color: "from-violet-500 to-purple-500",
        slug: "advanced-react-hooks",
        topics: ["useTransition", "useLayoutEffect", "Callback Ref Pattern", "Router Loaders"],
      },
      {
        id: "advanced-react-concepts",
        title: "Advanced React Concepts",
        description: "Senior-level documentation focusing on the why (architecture/trade-offs) rather than just the how.",
        icon: "🎯",
        color: "from-cyan-500 to-blue-500",
        slug: "advanced-react-concepts",
        topics: ["Element Prop Pattern", "Split Context Pattern", "Derived State", "useEffect Best Practices"],
      },
      {
        id: "react-design-patterns",
        title: "React Design Patterns 2025",
        description: "Comprehensive guide to React design patterns and best practices for 2025.",
        icon: "🎨",
        color: "from-indigo-500 to-purple-500",
        slug: "react-design-patterns",
        topics: ["Modern Component Patterns", "Custom Hooks", "Context API & React 19", "TypeScript Best Practices"],
      },
      {
        id: "concurrent-features",
        title: "React Concurrent Features & Suspense",
        description: "Deep dive into React 18+ concurrent features: Suspense, useDeferredValue, useTransition.",
        icon: "⚡",
        color: "from-yellow-500 to-orange-500",
        slug: "concurrent-features",
        topics: ["Suspense & Error Boundaries", "useDeferredValue", "useTransition", "Streaming SSR"],
      },
      {
        id: "server-components",
        title: "Server Components & React Server Components",
        description: "Next.js 13+ Server Components: When to use Server vs Client components.",
        icon: "🖥️",
        color: "from-gray-600 to-slate-500",
        slug: "server-components",
        topics: ["Server vs Client Components", "Data Fetching Patterns", "Streaming & Progressive Rendering"],
      },
      {
        id: "react-internals",
        title: "React Internals & Advanced Concepts",
        description: "Understand React's internals: Fiber architecture, reconciliation algorithm.",
        icon: "🔬",
        color: "from-violet-600 to-purple-600",
        slug: "react-internals",
        topics: ["Fiber Architecture", "Reconciliation Algorithm", "Render & Commit Phases"],
      },
      {
        id: "react-best-practices",
        title: "Vercel React Best Practices",
        description: "45+ performance rules from Vercel: waterfalls, bundle size, server-side, client data, re-renders, rendering, JavaScript, and advanced patterns. Editable code with live preview.",
        icon: "⚡",
        color: "from-amber-500 to-orange-500",
        slug: "react-best-practices",
        topics: ["Eliminating Waterfalls", "Bundle Size", "Server-Side Performance", "Client Data Fetching", "Re-render Optimization", "Rendering", "JavaScript Performance", "Advanced Patterns"],
      },
    ],
  },
  {
    id: "performance-optimization",
    title: "Performance & Optimization",
    description: "Optimize React applications for speed and efficiency. Learn code splitting, lazy loading, performance monitoring, and Core Web Vitals optimization.",
    icon: "⚡",
    color: "from-orange-500 to-red-500",
    slug: "performance-optimization",
    posts: [
      {
        id: "performance-optimization",
        title: "Performance Optimization",
        description: "Master React performance optimization techniques: Code-Splitting, useCallback, useMemo, and more.",
        icon: "⚡",
        color: "from-orange-500 to-red-500",
        slug: "performance-optimization",
        topics: ["Code-Splitting", "useCallback", "useMemo", "State Collocation", "Throttling", "Debouncing"],
      },
      {
        id: "code-splitting",
        title: "Advanced Code Splitting & Bundling",
        description: "Master code splitting strategies: Route-based splitting, component-based splitting, dynamic imports.",
        icon: "📦",
        color: "from-indigo-600 to-purple-600",
        slug: "code-splitting",
        topics: ["Route-based Code Splitting", "Component-based Splitting", "Dynamic Imports", "Bundle Optimization"],
      },
      {
        id: "performance-monitoring",
        title: "Performance Monitoring & Optimization",
        description: "Measure and optimize React performance: React DevTools Profiler, Web Vitals, bundle analysis.",
        icon: "📊",
        color: "from-teal-500 to-cyan-500",
        slug: "performance-monitoring",
        topics: ["React DevTools Profiler", "Web Vitals", "Bundle Analysis", "Performance Budgets"],
      },
      {
        id: "web-performance-core-web-vitals",
        title: "Web Performance & Core Web Vitals",
        description: "Master web performance optimization. Learn Critical Rendering Path optimization, resource hints.",
        icon: "⚡",
        color: "from-yellow-500 to-orange-500",
        slug: "web-performance-core-web-vitals",
        topics: ["Critical Rendering Path", "Resource hints", "Service Workers & PWA", "Web Workers"],
      },
    ],
  },
  {
    id: "nextjs-framework",
    title: "Next.js Framework",
    description: "Master Next.js framework patterns, App Router, Server Components, data fetching, performance optimization, and production-ready patterns.",
    icon: "▲",
    color: "from-gray-800 to-gray-600",
    slug: "nextjs-framework",
    posts: [
      {
        id: "nextjs-best-practices",
        title: "Next.js Best Practices & Patterns",
        description: "Complete Next.js guide: App Router, Server Components, data fetching, caching, optimization, and production-ready patterns used by senior engineers.",
        icon: "▲",
        color: "from-gray-800 to-gray-600",
        slug: "nextjs-best-practices",
        topics: ["App Router", "Server Components", "Data Fetching", "Caching Strategies", "Performance Optimization", "Routing Patterns", "API Routes", "Middleware"],
      },
    ],
  },
  {
    id: "cloud-infrastructure",
    title: "Cloud & Infrastructure",
    description: "Build scalable cloud infrastructure with AWS, edge computing, and serverless architectures. Learn production-ready cloud patterns.",
    icon: "☁️",
    color: "from-orange-500 to-yellow-500",
    slug: "cloud-infrastructure",
    posts: [
      {
        id: "aws-cloud",
        title: "AWS Cloud: Zero to Hero",
        description: "Complete AWS guide from fundamentals to advanced: Core services, architecture patterns, security & IAM.",
        icon: "☁️",
        color: "from-orange-500 to-yellow-500",
        slug: "aws-cloud",
        topics: ["AWS Fundamentals", "EC2 & Compute", "S3 & Storage", "Lambda & Serverless", "RDS & Databases", "VPC & Networking"],
      },
      {
        id: "edge-computing",
        title: "Edge Computing & Edge Functions",
        description: "Master edge computing architecture: Vercel Edge Functions, Cloudflare Workers, edge caching strategies.",
        icon: "⚡",
        color: "from-indigo-500 to-purple-500",
        slug: "edge-computing",
        topics: ["Edge Computing Fundamentals", "Vercel Edge Functions", "Cloudflare Workers", "Edge Caching"],
      },
      {
        id: "terraform",
        title: "Terraform: Infrastructure as Code Mastery",
        description: "Complete Terraform guide from fundamentals to advanced: Infrastructure as Code, state management, modules, workspaces, and production patterns.",
        icon: "🏗️",
        color: "from-green-500 to-emerald-500",
        slug: "terraform",
        topics: ["Terraform Fundamentals", "State Management", "Modules & Reusability", "Workspaces", "Provisioners", "Best Practices", "AWS/Azure/GCP Examples"],
      },
    ],
  },
  {
    id: "testing-quality",
    title: "Testing & Quality",
    description: "Build robust applications with comprehensive testing strategies, code review best practices, and quality assurance techniques.",
    icon: "🧪",
    color: "from-green-500 to-emerald-500",
    slug: "testing-quality",
    posts: [
      {
        id: "testing-strategies",
        title: "Testing Strategies & Patterns",
        description: "Comprehensive testing guide: Unit, Integration, E2E testing with React Testing Library, Jest, Vitest, Playwright.",
        icon: "🧪",
        color: "from-green-500 to-emerald-500",
        slug: "testing-strategies",
        topics: ["React Testing Library", "Testing Custom Hooks", "Integration Testing", "E2E Testing", "TDD"],
      },
      {
        id: "code-review",
        title: "Code Review Best Practices",
        description: "Master the art of code review: Effective PR reviews, providing constructive feedback, reviewing architecture decisions.",
        icon: "🔍",
        color: "from-purple-600 to-pink-600",
        slug: "code-review",
        topics: ["Effective PR Reviews", "Constructive Feedback", "Architecture Review", "Security Review"],
      },
      {
        id: "error-handling",
        title: "Error Boundaries & Error Handling Patterns",
        description: "Master production-grade error handling: Error Boundaries, error recovery strategies, error reporting.",
        icon: "🛡️",
        color: "from-red-500 to-orange-500",
        slug: "error-handling",
        topics: ["Error Boundary Pattern", "Error Recovery", "Error Reporting", "Graceful Degradation"],
      },
    ],
  },
  {
    id: "security-authentication",
    title: "Security & Authentication",
    description: "Secure your applications with best practices for authentication, authorization, and security patterns.",
    icon: "🔒",
    color: "from-red-600 to-pink-600",
    slug: "security-authentication",
    posts: [
      {
        id: "security",
        title: "React Security Best Practices",
        description: "Secure React applications: XSS prevention, CSRF protection, authentication patterns, authorization.",
        icon: "🔒",
        color: "from-red-600 to-pink-600",
        slug: "security",
        topics: ["XSS Prevention", "CSRF Protection", "Authentication Patterns", "Authorization Strategies"],
      },
      {
        id: "authentication-authorization",
        title: "Authentication & Authorization Patterns",
        description: "Master production-grade authentication and authorization. Learn JWT, OAuth 2.0, session management.",
        icon: "🔐",
        color: "from-red-600 to-orange-600",
        slug: "authentication-authorization",
        topics: ["JWT Deep Dive", "OAuth 2.0", "Session Management", "RBAC", "Permission-based Systems"],
      },
    ],
  },
  {
    id: "state-management",
    title: "State Management",
    description: "Learn modern state management patterns with React Query, Zustand, Immer, and URL state management.",
    icon: "📦",
    color: "from-emerald-500 to-teal-500",
    slug: "state-management",
    posts: [
      {
        id: "state-management",
        title: "State Management in 2025",
        description: "Learn modern React state management: Immer for immutable updates, Zustand for shared state.",
        icon: "📦",
        color: "from-emerald-500 to-teal-500",
        slug: "state-management",
        topics: ["useImmer & useImmerReducer", "Zustand", "TanStack Query", "URL State with nuqs"],
      },
      {
        id: "react-query",
        title: "React Query: Production Patterns",
        description: "Production-grade React Query patterns: Optimistic Updates, Race Condition handling, Data Transformation.",
        icon: "⚡",
        color: "from-pink-500 to-rose-500",
        slug: "react-query",
        topics: ["Optimistic Updates", "Search Grid with Cancellation", "Infinite Feed", "Race Condition Prevention"],
      },
      {
        id: "api-layer",
        title: "API Layer Architecture",
        description: "Build production-ready API layers: Separation of concerns, custom hooks for API, TypeScript with API.",
        icon: "🔌",
        color: "from-indigo-500 to-purple-500",
        slug: "api-layer",
        topics: ["API Layer Architecture", "Separation of Concerns", "Custom Hooks for API", "TypeScript with API"],
      },
    ],
  },
  {
    id: "design-patterns-architecture",
    title: "Design Patterns & Architecture",
    description: "Master design patterns, SOLID principles, and architectural patterns for building scalable applications.",
    icon: "🎨",
    color: "from-purple-500 to-pink-500",
    slug: "design-patterns-architecture",
    posts: [
      {
        id: "design-patterns",
        title: "Design Patterns",
        description: "Learn essential design patterns: Singleton, Factory, Observer, Strategy, Decorator, and more.",
        icon: "🎨",
        color: "from-purple-500 to-pink-500",
        slug: "design-patterns",
        topics: ["Singleton", "Factory", "Observer", "Strategy", "Decorator", "Adapter", "Facade", "Command"],
      },
      {
        id: "solid-principles",
        title: "SOLID Principles",
        description: "Master SOLID principles for clean, maintainable code: Single Responsibility, Open/Closed, Liskov Substitution.",
        icon: "🏗️",
        color: "from-green-500 to-emerald-500",
        slug: "solid-principles",
        topics: ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"],
      },
      {
        id: "advanced-patterns",
        title: "Advanced Patterns: Design System Foundations",
        description: "Render Props, Wrapper Components, and Polymorphic Components are the building blocks of Design Systems.",
        icon: "🧩",
        color: "from-purple-500 to-indigo-500",
        slug: "advanced-patterns",
        topics: ["Render Props Pattern", "Wrapper Components", "Polymorphic Components", "Design System Architecture"],
      },
      {
        id: "micro-frontends",
        title: "Micro-Frontends Architecture",
        description: "Build scalable micro-frontend architectures: Module Federation, single-spa, independent deployments.",
        icon: "🏗️",
        color: "from-slate-600 to-gray-600",
        slug: "micro-frontends",
        topics: ["Module Federation", "Single-SPA Architecture", "Independent Deployments", "Team Autonomy"],
      },
      {
        id: "migration-patterns",
        title: "Migration & Refactoring Patterns",
        description: "Strategies for migrating legacy React code: Class to Hooks migration, Redux to modern state management.",
        icon: "🔄",
        color: "from-amber-500 to-yellow-500",
        slug: "migration-patterns",
        topics: ["Class to Hooks Migration", "Redux to Modern State", "React Version Upgrades", "Incremental Refactoring"],
      },
      {
        id: "refactoring-guru",
        title: "Refactoring Guru: Code Smells",
        description: "Learn about code smells and refactoring techniques from Refactoring.Guru. Understand Refused Bequest and other object-orientation abusers.",
        icon: "🔧",
        color: "from-purple-500 to-pink-500",
        slug: "refactoring-guru",
        topics: ["Refused Bequest", "Code Smells", "Refactoring Techniques", "Object-Orientation Abusers", "Inheritance Patterns"],
      },
    ],
  },
  {
    id: "ai-llms",
    title: "AI & LLMs",
    description: "Explore artificial intelligence and Large Language Models. Learn about Transformer architecture, attention mechanisms, training, and how these systems intelligently generate text.",
    icon: "🤖",
    color: "from-indigo-500 to-purple-500",
    slug: "ai-llms",
    posts: [
      {
        id: "how-llms-work",
        title: "How LLMs Work: Behind the Scenes",
        description: "Explore the inner workings of Large Language Models (LLMs). Learn about Transformer architecture, attention mechanisms, training, and how these systems intelligently generate text.",
        icon: "🤖",
        color: "from-indigo-500 to-purple-500",
        slug: "how-llms-work",
        topics: ["Transformer Architecture", "Attention Mechanisms", "LLM Training", "Natural Language Processing", "Neural Networks"],
      },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript & Types",
    description: "Master TypeScript patterns for React. Learn generic components, utility types, and advanced type patterns.",
    icon: "📘",
    color: "from-blue-600 to-cyan-500",
    slug: "typescript",
    posts: [
      {
        id: "typescript-advanced",
        title: "Advanced TypeScript Patterns for React",
        description: "Master TypeScript with React: Generic components, utility types, type inference, discriminated unions.",
        icon: "📘",
        color: "from-blue-600 to-cyan-500",
        slug: "typescript-advanced",
        topics: ["Generic Components", "Utility Types", "Discriminated Unions", "Type Inference Patterns", "Branded Types"],
      },
    ],
  },
  {
    id: "career-soft-skills",
    title: "Career & Soft Skills",
    description: "Develop the soft skills that define senior developers: communication, leadership, career growth, and interview preparation.",
    icon: "💼",
    color: "from-blue-600 to-indigo-600",
    slug: "career-soft-skills",
    posts: [
      {
        id: "soft-skills",
        title: "Senior Developer Soft Skills & Communication",
        description: "Master the soft skills that define senior developers: Communication strategies, asking effective questions.",
        icon: "💼",
        color: "from-blue-600 to-indigo-600",
        slug: "soft-skills",
        topics: ["Asking Questions", "Knowledge Sharing", "Communication Strategies", "Proactivity", "Accountability"],
      },
      {
        id: "interview-preparation",
        title: "Interview Preparation: Complete Developer Guide",
        description: "Master technical interviews, system design, coding patterns, and behavioral interviews.",
        icon: "🎯",
        color: "from-amber-500 to-orange-500",
        slug: "interview-preparation",
        topics: ["Technical Interviews", "System Design", "Coding Patterns", "Behavioral Interviews", "STAR Method"],
      },
    ],
  },
  {
    id: "mobile-development",
    title: "Mobile Development",
    description: "Build cross-platform mobile applications with React Native, Flutter, and Kotlin Multiplatform.",
    icon: "📱",
    color: "from-indigo-500 to-violet-500",
    slug: "mobile-development",
    posts: [
      {
        id: "kotlin-multiplatform",
        title: "Kotlin Multiplatform UI Patterns",
        description: "Practical Compose Multiplatform techniques to ship one shared UI codebase across Android, iOS, and Desktop.",
        icon: "📱",
        color: "from-indigo-500 to-violet-500",
        slug: "kotlin-multiplatform",
        topics: ["Shared UiState", "Expect/Actual UI adapters", "Adaptive layouts", "Shared navigation graphs"],
      },
      {
        id: "flutter-react-native-kotlin-multiplatform",
        title: "Flutter vs React Native vs Kotlin Multiplatform",
        description: "Comprehensive architectural analysis comparing Flutter, React Native, and Kotlin Multiplatform in 2026.",
        icon: "🏗️",
        color: "from-cyan-500 to-blue-600",
        slug: "flutter-react-native-kotlin-multiplatform",
        topics: ["Architecture Comparison", "Performance Benchmarks", "Code Sharing Strategies", "Ecosystem & Tooling"],
      },
    ],
  },
  {
    id: "accessibility-ux",
    title: "Accessibility & UX",
    description: "Build accessible and user-friendly applications. Learn accessibility patterns, internationalization, animations, and UX best practices.",
    icon: "♿",
    color: "from-blue-500 to-indigo-500",
    slug: "accessibility-ux",
    posts: [
      {
        id: "accessibility",
        title: "Accessibility Patterns & Best Practices",
        description: "Build accessible React applications following WCAG guidelines. Learn ARIA patterns, keyboard navigation.",
        icon: "♿",
        color: "from-blue-500 to-indigo-500",
        slug: "accessibility",
        topics: ["ARIA Patterns", "Keyboard Navigation", "Focus Management", "Screen Reader Optimization"],
      },
      {
        id: "internationalization",
        title: "Internationalization (i18n) Patterns",
        description: "Build multilingual React applications: react-i18next, date/time formatting, RTL support.",
        icon: "🌍",
        color: "from-green-600 to-teal-600",
        slug: "internationalization",
        topics: ["react-i18next Patterns", "Date/Time Formatting", "RTL Support", "Locale Management"],
      },
      {
        id: "animations",
        title: "Animation & Transition Patterns",
        description: "Smooth animations in React: Framer Motion, React Spring, CSS transitions, layout animations.",
        icon: "🎬",
        color: "from-pink-500 to-rose-500",
        slug: "animations",
        topics: ["Framer Motion Patterns", "React Spring", "Layout Animations", "Gesture Handling"],
      },
    ],
  },
  {
    id: "forms-data",
    title: "Forms & Data Handling",
    description: "Build robust forms and handle data effectively. Learn form management, validation, and data layer patterns.",
    icon: "📝",
    color: "from-purple-500 to-pink-500",
    slug: "forms-data",
    posts: [
      {
        id: "form-management",
        title: "Form Management & Validation Patterns",
        description: "Production-ready form handling: React Hook Form, Formik, Zod validation, complex form patterns.",
        icon: "📝",
        color: "from-purple-500 to-pink-500",
        slug: "form-management",
        topics: ["React Hook Form", "Zod Schema Validation", "Complex Forms", "Multi-step Forms", "Dynamic Forms"],
      },
    ],
  },
  {
    id: "design-systems",
    title: "Design Systems",
    description: "Build production-grade design systems from scratch. Learn Storybook patterns, component documentation, and token systems.",
    icon: "🎨",
    color: "from-purple-500 to-pink-500",
    slug: "design-systems",
    posts: [
      {
        id: "design-systems-component-libraries",
        title: "Design Systems & Component Libraries",
        description: "Build production-grade design systems from scratch. Learn Storybook patterns, component documentation.",
        icon: "🎨",
        color: "from-purple-500 to-pink-500",
        slug: "design-systems-component-libraries",
        topics: ["Building Design Systems", "Storybook Patterns", "Component Documentation", "Token System"],
      },
    ],
  },
];

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return blogCategories.find((cat) => cat.slug === slug);
}

// Helper function to get post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  for (const category of blogCategories) {
    const post = category.posts.find((p) => p.slug === slug);
    if (post) return post;
  }
  return undefined;
}

// Helper function to get category for a post
export function getCategoryForPost(postSlug: string): BlogCategory | undefined {
  return blogCategories.find((cat) => 
    cat.posts.some((post) => post.slug === postSlug)
  );
}

