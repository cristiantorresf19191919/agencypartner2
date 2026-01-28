import type { TranslatedString } from './localize';

export interface BlogPost {
  id: string;
  title: TranslatedString;
  description: TranslatedString;
  icon: string;
  color: string;
  slug: string;
  topics: TranslatedString[];
}

export interface BlogCategory {
  id: string;
  title: TranslatedString;
  description: TranslatedString;
  icon: string;
  color: string;
  slug: string;
  posts: BlogPost[];
}

export const blogCategories: BlogCategory[] = [
  {
    id: "react-development",
    title: { en: "React Development", es: "Desarrollo con React" },
    description: {
      en: "Master React patterns, hooks, components, and advanced concepts. Learn production-ready React development from fundamentals to senior-level techniques.",
      es: "Domina patrones de React, hooks, componentes y conceptos avanzados. Aprende desarrollo React listo para producción desde fundamentos hasta técnicas de nivel senior.",
    },
    icon: "⚛️",
    color: "from-blue-500 to-cyan-500",
    slug: "react-development",
    posts: [
      {
        id: "react-patterns",
        title: { en: "React Patterns", es: "Patrones de React" },
        description: {
          en: "Learn fundamental React patterns: Compound Components, HOCs, Custom Hooks, Render Props, and more.",
          es: "Aprende patrones fundamentales de React: Componentes Compuestos, HOCs, Custom Hooks, Render Props y más.",
        },
        icon: "⚛️",
        color: "from-blue-500 to-cyan-500",
        slug: "react-patterns",
        topics: [
          { en: "Compound Components", es: "Componentes Compuestos" },
          { en: "Higher-Order Components (HOC)", es: "Componentes de Orden Superior (HOC)" },
          { en: "Custom Hooks", es: "Hooks Personalizados" },
          { en: "Render Props", es: "Render Props" },
          { en: "Containment Pattern", es: "Patrón de Contención" },
          { en: "Slot Pattern", es: "Patrón Slot" },
          { en: "Selective Hydration", es: "Hidratación Selectiva" },
        ],
      },
      {
        id: "composition-pattern",
        title: { en: "Composition Pattern", es: "Patrón de Composición" },
        description: {
          en: "Learn the composition pattern and how to build reusable, flexible React components.",
          es: "Aprende el patrón de composición y cómo construir componentes React reutilizables y flexibles.",
        },
        icon: "🧩",
        color: "from-purple-500 to-pink-500",
        slug: "composition-pattern",
        topics: [
          { en: "Composition", es: "Composición" },
          { en: "Component Reusability", es: "Reutilización de Componentes" },
          { en: "Flexible APIs", es: "APIs Flexibles" },
        ],
      },
      {
        id: "container-presentational-pattern",
        title: { en: "Container/Presentational Pattern", es: "Patrón Contenedor/Presentacional" },
        description: {
          en: "The 'Secret Sauce' for scalable React apps. Learn how to separate logic from UI.",
          es: "La 'receta secreta' para apps React escalables. Aprende a separar lógica de la UI.",
        },
        icon: "🏗️",
        color: "from-emerald-500 to-teal-500",
        slug: "container-presentational-pattern",
        topics: [
          { en: "Container/Presentational Pattern", es: "Patrón Contenedor/Presentacional" },
          { en: "Render Props", es: "Render Props" },
          { en: "DataSource Pattern", es: "Patrón DataSource" },
          { en: "Separation of Concerns", es: "Separación de Responsabilidades" },
        ],
      },
      {
        id: "advanced-react-hooks",
        title: { en: "Advanced React Hooks & Patterns", es: "Hooks y Patrones Avanzados de React" },
        description: {
          en: "Senior-level patterns that solve real production problems: Performance, Visual Stability, and Race Conditions.",
          es: "Patrones de nivel senior que resuelven problemas reales de producción: rendimiento, estabilidad visual y condiciones de carrera.",
        },
        icon: "🚀",
        color: "from-violet-500 to-purple-500",
        slug: "advanced-react-hooks",
        topics: [
          { en: "useTransition", es: "useTransition" },
          { en: "useLayoutEffect", es: "useLayoutEffect" },
          { en: "Callback Ref Pattern", es: "Patrón Callback Ref" },
          { en: "Router Loaders", es: "Router Loaders" },
        ],
      },
      {
        id: "advanced-react-concepts",
        title: { en: "Advanced React Concepts", es: "Conceptos Avanzados de React" },
        description: {
          en: "Senior-level documentation focusing on the why (architecture/trade-offs) rather than just the how.",
          es: "Documentación de nivel senior enfocada en el porqué (arquitectura/trade-offs) y no solo en el cómo.",
        },
        icon: "🎯",
        color: "from-cyan-500 to-blue-500",
        slug: "advanced-react-concepts",
        topics: [
          { en: "Element Prop Pattern", es: "Patrón Element Prop" },
          { en: "Split Context Pattern", es: "Patrón Split Context" },
          { en: "Derived State", es: "Estado Derivado" },
          { en: "useEffect Best Practices", es: "Mejores Prácticas de useEffect" },
        ],
      },
      {
        id: "react-design-patterns",
        title: { en: "React Design Patterns 2025", es: "Patrones de Diseño React 2025" },
        description: {
          en: "Comprehensive guide to React design patterns and best practices for 2025.",
          es: "Guía completa de patrones de diseño React y mejores prácticas para 2025.",
        },
        icon: "🎨",
        color: "from-indigo-500 to-purple-500",
        slug: "react-design-patterns",
        topics: [
          { en: "Modern Component Patterns", es: "Patrones de Componentes Modernos" },
          { en: "Custom Hooks", es: "Hooks Personalizados" },
          { en: "Context API & React 19", es: "Context API y React 19" },
          { en: "TypeScript Best Practices", es: "Mejores Prácticas TypeScript" },
        ],
      },
      {
        id: "concurrent-features",
        title: { en: "React Concurrent Features & Suspense", es: "Funciones Concurrentes de React y Suspense" },
        description: {
          en: "Deep dive into React 18+ concurrent features: Suspense, useDeferredValue, useTransition.",
          es: "Profundiza en las funciones concurrentes de React 18+: Suspense, useDeferredValue, useTransition.",
        },
        icon: "⚡",
        color: "from-yellow-500 to-orange-500",
        slug: "concurrent-features",
        topics: [
          { en: "Suspense & Error Boundaries", es: "Suspense y Error Boundaries" },
          { en: "useDeferredValue", es: "useDeferredValue" },
          { en: "useTransition", es: "useTransition" },
          { en: "Streaming SSR", es: "SSR con Streaming" },
        ],
      },
      {
        id: "server-components",
        title: { en: "Server Components & React Server Components", es: "Server Components y React Server Components" },
        description: {
          en: "Next.js 13+ Server Components: When to use Server vs Client components.",
          es: "Server Components en Next.js 13+: Cuándo usar componentes Server vs Client.",
        },
        icon: "🖥️",
        color: "from-gray-600 to-slate-500",
        slug: "server-components",
        topics: [
          { en: "Server vs Client Components", es: "Componentes Server vs Client" },
          { en: "Data Fetching Patterns", es: "Patrones de Obtención de Datos" },
          { en: "Streaming & Progressive Rendering", es: "Streaming y Renderizado Progresivo" },
        ],
      },
      {
        id: "react-internals",
        title: { en: "React Internals & Advanced Concepts", es: "Internals de React y Conceptos Avanzados" },
        description: {
          en: "Understand React's internals: Fiber architecture, reconciliation algorithm.",
          es: "Entiende los internals de React: arquitectura Fiber, algoritmo de reconciliación.",
        },
        icon: "🔬",
        color: "from-violet-600 to-purple-600",
        slug: "react-internals",
        topics: [
          { en: "Fiber Architecture", es: "Arquitectura Fiber" },
          { en: "Reconciliation Algorithm", es: "Algoritmo de Reconciliación" },
          { en: "Render & Commit Phases", es: "Fases Render y Commit" },
        ],
      },
      {
        id: "react-best-practices",
        title: { en: "Vercel React Best Practices", es: "Mejores Prácticas React de Vercel" },
        description: {
          en: "45+ performance rules from Vercel: waterfalls, bundle size, server-side, client data, re-renders, rendering, JavaScript, and advanced patterns. Editable code with live preview.",
          es: "Más de 45 reglas de rendimiento de Vercel: waterfalls, tamaño de bundle, servidor, datos cliente, re-renders, rendering, JavaScript y patrones avanzados. Código editable con vista previa en vivo.",
        },
        icon: "⚡",
        color: "from-amber-500 to-orange-500",
        slug: "react-best-practices",
        topics: [
          { en: "Eliminating Waterfalls", es: "Eliminación de Waterfalls" },
          { en: "Bundle Size", es: "Tamaño del Bundle" },
          { en: "Server-Side Performance", es: "Rendimiento en Servidor" },
          { en: "Client Data Fetching", es: "Obtención de Datos en Cliente" },
          { en: "Re-render Optimization", es: "Optimización de Re-renders" },
          { en: "Rendering", es: "Rendering" },
          { en: "JavaScript Performance", es: "Rendimiento JavaScript" },
          { en: "Advanced Patterns", es: "Patrones Avanzados" },
        ],
      },
    ],
  },
  {
    id: "performance-optimization",
    title: { en: "Performance & Optimization", es: "Rendimiento y Optimización" },
    description: {
      en: "Optimize React applications for speed and efficiency. Learn code splitting, lazy loading, performance monitoring, and Core Web Vitals optimization.",
      es: "Optimiza aplicaciones React en velocidad y eficiencia. Aprende code splitting, lazy loading, monitoreo de rendimiento y optimización de Core Web Vitals.",
    },
    icon: "⚡",
    color: "from-orange-500 to-red-500",
    slug: "performance-optimization",
    posts: [
      {
        id: "performance-optimization",
        title: { en: "Performance Optimization", es: "Optimización de Rendimiento" },
        description: {
          en: "Master React performance optimization techniques: Code-Splitting, useCallback, useMemo, and more.",
          es: "Domina técnicas de optimización de rendimiento en React: Code-Splitting, useCallback, useMemo y más.",
        },
        icon: "⚡",
        color: "from-orange-500 to-red-500",
        slug: "performance-optimization",
        topics: [
          { en: "Code-Splitting", es: "Code-Splitting" },
          { en: "useCallback", es: "useCallback" },
          { en: "useMemo", es: "useMemo" },
          { en: "State Collocation", es: "Colocación de Estado" },
          { en: "Throttling", es: "Throttling" },
          { en: "Debouncing", es: "Debouncing" },
        ],
      },
      {
        id: "code-splitting",
        title: { en: "Advanced Code Splitting & Bundling", es: "Code Splitting y Bundling Avanzado" },
        description: {
          en: "Master code splitting strategies: Route-based splitting, component-based splitting, dynamic imports.",
          es: "Domina estrategias de code splitting: por rutas, por componentes e importaciones dinámicas.",
        },
        icon: "📦",
        color: "from-indigo-600 to-purple-600",
        slug: "code-splitting",
        topics: [
          { en: "Route-based Code Splitting", es: "Code Splitting por Rutas" },
          { en: "Component-based Splitting", es: "Splitting por Componentes" },
          { en: "Dynamic Imports", es: "Imports Dinámicos" },
          { en: "Bundle Optimization", es: "Optimización de Bundle" },
        ],
      },
      {
        id: "performance-monitoring",
        title: { en: "Performance Monitoring & Optimization", es: "Monitoreo y Optimización de Rendimiento" },
        description: {
          en: "Measure and optimize React performance: React DevTools Profiler, Web Vitals, bundle analysis.",
          es: "Mide y optimiza el rendimiento de React: React DevTools Profiler, Web Vitals, análisis de bundle.",
        },
        icon: "📊",
        color: "from-teal-500 to-cyan-500",
        slug: "performance-monitoring",
        topics: [
          { en: "React DevTools Profiler", es: "React DevTools Profiler" },
          { en: "Web Vitals", es: "Web Vitals" },
          { en: "Bundle Analysis", es: "Análisis de Bundle" },
          { en: "Performance Budgets", es: "Presupuestos de Rendimiento" },
        ],
      },
      {
        id: "web-performance-core-web-vitals",
        title: { en: "Web Performance & Core Web Vitals", es: "Rendimiento Web y Core Web Vitals" },
        description: {
          en: "Master web performance optimization. Learn Critical Rendering Path optimization, resource hints.",
          es: "Domina la optimización del rendimiento web. Aprende Critical Rendering Path, resource hints.",
        },
        icon: "⚡",
        color: "from-yellow-500 to-orange-500",
        slug: "web-performance-core-web-vitals",
        topics: [
          { en: "Critical Rendering Path", es: "Critical Rendering Path" },
          { en: "Resource hints", es: "Resource hints" },
          { en: "Service Workers & PWA", es: "Service Workers y PWA" },
          { en: "Web Workers", es: "Web Workers" },
        ],
      },
    ],
  },
  {
    id: "nextjs-framework",
    title: { en: "Next.js Framework", es: "Framework Next.js" },
    description: {
      en: "Master Next.js framework patterns, App Router, Server Components, data fetching, performance optimization, and production-ready patterns.",
      es: "Domina patrones del framework Next.js: App Router, Server Components, data fetching, optimización y patrones listos para producción.",
    },
    icon: "▲",
    color: "from-gray-800 to-gray-600",
    slug: "nextjs-framework",
    posts: [
      {
        id: "nextjs-best-practices",
        title: { en: "Next.js Best Practices & Patterns", es: "Mejores Prácticas y Patrones de Next.js" },
        description: {
          en: "Complete Next.js guide: App Router, Server Components, data fetching, caching, optimization, and production-ready patterns used by senior engineers.",
          es: "Guía completa de Next.js: App Router, Server Components, data fetching, caché, optimización y patrones usados por ingenieros senior.",
        },
        icon: "▲",
        color: "from-gray-800 to-gray-600",
        slug: "nextjs-best-practices",
        topics: [
          { en: "App Router", es: "App Router" },
          { en: "Server Components", es: "Server Components" },
          { en: "Data Fetching", es: "Data Fetching" },
          { en: "Caching Strategies", es: "Estrategias de Caché" },
          { en: "Performance Optimization", es: "Optimización de Rendimiento" },
          { en: "Routing Patterns", es: "Patrones de Routing" },
          { en: "API Routes", es: "API Routes" },
          { en: "Middleware", es: "Middleware" },
        ],
      },
    ],
  },
  {
    id: "cloud-infrastructure",
    title: { en: "Cloud & Infrastructure", es: "Cloud e Infraestructura" },
    description: {
      en: "Build scalable cloud infrastructure with AWS, edge computing, and serverless architectures. Learn production-ready cloud patterns.",
      es: "Construye infraestructura cloud escalable con AWS, edge computing y arquitecturas serverless. Aprende patrones cloud listos para producción.",
    },
    icon: "☁️",
    color: "from-orange-500 to-yellow-500",
    slug: "cloud-infrastructure",
    posts: [
      {
        id: "aws-cloud",
        title: { en: "AWS Cloud: Zero to Hero", es: "AWS Cloud: de Cero a Héroe" },
        description: {
          en: "Complete AWS guide from fundamentals to advanced: Core services, architecture patterns, security & IAM.",
          es: "Guía completa de AWS desde fundamentos hasta avanzado: servicios principales, patrones de arquitectura, seguridad e IAM.",
        },
        icon: "☁️",
        color: "from-orange-500 to-yellow-500",
        slug: "aws-cloud",
        topics: [
          { en: "AWS Fundamentals", es: "Fundamentos de AWS" },
          { en: "EC2 & Compute", es: "EC2 y Compute" },
          { en: "S3 & Storage", es: "S3 y Storage" },
          { en: "Lambda & Serverless", es: "Lambda y Serverless" },
          { en: "RDS & Databases", es: "RDS y Bases de Datos" },
          { en: "VPC & Networking", es: "VPC y Redes" },
        ],
      },
      {
        id: "edge-computing",
        title: { en: "Edge Computing & Edge Functions", es: "Edge Computing y Edge Functions" },
        description: {
          en: "Master edge computing architecture: Vercel Edge Functions, Cloudflare Workers, edge caching strategies.",
          es: "Domina la arquitectura de edge computing: Vercel Edge Functions, Cloudflare Workers, estrategias de caché en el edge.",
        },
        icon: "⚡",
        color: "from-indigo-500 to-purple-500",
        slug: "edge-computing",
        topics: [
          { en: "Edge Computing Fundamentals", es: "Fundamentos de Edge Computing" },
          { en: "Vercel Edge Functions", es: "Vercel Edge Functions" },
          { en: "Cloudflare Workers", es: "Cloudflare Workers" },
          { en: "Edge Caching", es: "Caché en el Edge" },
        ],
      },
      {
        id: "terraform",
        title: { en: "Terraform: Infrastructure as Code Mastery", es: "Terraform: Dominio de Infraestructura como Código" },
        description: {
          en: "Complete Terraform guide from fundamentals to advanced: Infrastructure as Code, state management, modules, workspaces, and production patterns.",
          es: "Guía completa de Terraform desde fundamentos hasta avanzado: IaC, gestión de estado, módulos, workspaces y patrones de producción.",
        },
        icon: "🏗️",
        color: "from-green-500 to-emerald-500",
        slug: "terraform",
        topics: [
          { en: "Terraform Fundamentals", es: "Fundamentos de Terraform" },
          { en: "State Management", es: "Gestión de Estado" },
          { en: "Modules & Reusability", es: "Módulos y Reutilización" },
          { en: "Workspaces", es: "Workspaces" },
          { en: "Provisioners", es: "Provisioners" },
          { en: "Best Practices", es: "Mejores Prácticas" },
          { en: "AWS/Azure/GCP Examples", es: "Ejemplos AWS/Azure/GCP" },
        ],
      },
    ],
  },
  {
    id: "testing-quality",
    title: { en: "Testing & Quality", es: "Testing y Calidad" },
    description: {
      en: "Build robust applications with comprehensive testing strategies, code review best practices, and quality assurance techniques.",
      es: "Construye aplicaciones robustas con estrategias de testing, mejores prácticas de code review y técnicas de aseguramiento de calidad.",
    },
    icon: "🧪",
    color: "from-green-500 to-emerald-500",
    slug: "testing-quality",
    posts: [
      {
        id: "testing-strategies",
        title: { en: "Testing Strategies & Patterns", es: "Estrategias y Patrones de Testing" },
        description: {
          en: "Comprehensive testing guide: Unit, Integration, E2E testing with React Testing Library, Jest, Vitest, Playwright.",
          es: "Guía completa de testing: unitario, integración y E2E con React Testing Library, Jest, Vitest, Playwright.",
        },
        icon: "🧪",
        color: "from-green-500 to-emerald-500",
        slug: "testing-strategies",
        topics: [
          { en: "React Testing Library", es: "React Testing Library" },
          { en: "Testing Custom Hooks", es: "Testing de Custom Hooks" },
          { en: "Integration Testing", es: "Testing de Integración" },
          { en: "E2E Testing", es: "Testing E2E" },
          { en: "TDD", es: "TDD" },
        ],
      },
      {
        id: "code-review",
        title: { en: "Code Review Best Practices", es: "Mejores Prácticas de Revisión de Código" },
        description: {
          en: "Master the art of code review: Effective PR reviews, providing constructive feedback, reviewing architecture decisions.",
          es: "Domina el arte de la revisión de código: revisiones efectivas de PR, retroalimentación constructiva, revisión de decisiones de arquitectura.",
        },
        icon: "🔍",
        color: "from-purple-600 to-pink-600",
        slug: "code-review",
        topics: [
          { en: "Effective PR Reviews", es: "Revisiones de PR Efectivas" },
          { en: "Constructive Feedback", es: "Retroalimentación Constructiva" },
          { en: "Architecture Review", es: "Revisión de Arquitectura" },
          { en: "Security Review", es: "Revisión de Seguridad" },
        ],
      },
      {
        id: "error-handling",
        title: { en: "Error Boundaries & Error Handling Patterns", es: "Error Boundaries y Patrones de Manejo de Errores" },
        description: {
          en: "Master production-grade error handling: Error Boundaries, error recovery strategies, error reporting.",
          es: "Domina el manejo de errores de nivel producción: Error Boundaries, estrategias de recuperación y reporte de errores.",
        },
        icon: "🛡️",
        color: "from-red-500 to-orange-500",
        slug: "error-handling",
        topics: [
          { en: "Error Boundary Pattern", es: "Patrón Error Boundary" },
          { en: "Error Recovery", es: "Recuperación de Errores" },
          { en: "Error Reporting", es: "Reporte de Errores" },
          { en: "Graceful Degradation", es: "Degradación Elegante" },
        ],
      },
    ],
  },
  {
    id: "security-authentication",
    title: { en: "Security & Authentication", es: "Seguridad y Autenticación" },
    description: {
      en: "Secure your applications with best practices for authentication, authorization, and security patterns.",
      es: "Protege tus aplicaciones con mejores prácticas de autenticación, autorización y patrones de seguridad.",
    },
    icon: "🔒",
    color: "from-red-600 to-pink-600",
    slug: "security-authentication",
    posts: [
      {
        id: "security",
        title: { en: "React Security Best Practices", es: "Mejores Prácticas de Seguridad en React" },
        description: {
          en: "Secure React applications: XSS prevention, CSRF protection, authentication patterns, authorization.",
          es: "Asegura aplicaciones React: prevención XSS, protección CSRF, patrones de autenticación y autorización.",
        },
        icon: "🔒",
        color: "from-red-600 to-pink-600",
        slug: "security",
        topics: [
          { en: "XSS Prevention", es: "Prevención XSS" },
          { en: "CSRF Protection", es: "Protección CSRF" },
          { en: "Authentication Patterns", es: "Patrones de Autenticación" },
          { en: "Authorization Strategies", es: "Estrategias de Autorización" },
        ],
      },
      {
        id: "authentication-authorization",
        title: { en: "Authentication & Authorization Patterns", es: "Patrones de Autenticación y Autorización" },
        description: {
          en: "Master production-grade authentication and authorization. Learn JWT, OAuth 2.0, session management.",
          es: "Domina autenticación y autorización de nivel producción. Aprende JWT, OAuth 2.0, gestión de sesiones.",
        },
        icon: "🔐",
        color: "from-red-600 to-orange-600",
        slug: "authentication-authorization",
        topics: [
          { en: "JWT Deep Dive", es: "Análisis Profundo de JWT" },
          { en: "OAuth 2.0", es: "OAuth 2.0" },
          { en: "Session Management", es: "Gestión de Sesiones" },
          { en: "RBAC", es: "RBAC" },
          { en: "Permission-based Systems", es: "Sistemas basados en Permisos" },
        ],
      },
    ],
  },
  {
    id: "state-management",
    title: { en: "State Management", es: "Gestión de Estado" },
    description: {
      en: "Learn modern state management patterns with React Query, Zustand, Immer, and URL state management.",
      es: "Aprende patrones modernos de gestión de estado con React Query, Zustand, Immer y estado en URL.",
    },
    icon: "📦",
    color: "from-emerald-500 to-teal-500",
    slug: "state-management",
    posts: [
      {
        id: "state-management",
        title: { en: "State Management in 2025", es: "Gestión de Estado en 2025" },
        description: {
          en: "Learn modern React state management: Immer for immutable updates, Zustand for shared state.",
          es: "Aprende gestión de estado moderna en React: Immer para actualizaciones inmutables, Zustand para estado compartido.",
        },
        icon: "📦",
        color: "from-emerald-500 to-teal-500",
        slug: "state-management",
        topics: [
          { en: "useImmer & useImmerReducer", es: "useImmer y useImmerReducer" },
          { en: "Zustand", es: "Zustand" },
          { en: "TanStack Query", es: "TanStack Query" },
          { en: "URL State with nuqs", es: "Estado en URL con nuqs" },
        ],
      },
      {
        id: "react-query",
        title: { en: "React Query: Production Patterns", es: "React Query: Patrones de Producción" },
        description: {
          en: "Production-grade React Query patterns: Optimistic Updates, Race Condition handling, Data Transformation.",
          es: "Patrones de React Query para producción: Optimistic Updates, manejo de condiciones de carrera, transformación de datos.",
        },
        icon: "⚡",
        color: "from-pink-500 to-rose-500",
        slug: "react-query",
        topics: [
          { en: "Optimistic Updates", es: "Optimistic Updates" },
          { en: "Search Grid with Cancellation", es: "Grid de Búsqueda con Cancelación" },
          { en: "Infinite Feed", es: "Feed Infinito" },
          { en: "Race Condition Prevention", es: "Prevención de Condiciones de Carrera" },
        ],
      },
      {
        id: "api-layer",
        title: { en: "API Layer Architecture", es: "Arquitectura de Capa API" },
        description: {
          en: "Build production-ready API layers: Separation of concerns, custom hooks for API, TypeScript with API.",
          es: "Construye capas API listas para producción: separación de responsabilidades, custom hooks para API, TypeScript con API.",
        },
        icon: "🔌",
        color: "from-indigo-500 to-purple-500",
        slug: "api-layer",
        topics: [
          { en: "API Layer Architecture", es: "Arquitectura de Capa API" },
          { en: "Separation of Concerns", es: "Separación de Responsabilidades" },
          { en: "Custom Hooks for API", es: "Custom Hooks para API" },
          { en: "TypeScript with API", es: "TypeScript con API" },
        ],
      },
    ],
  },
  {
    id: "design-patterns-architecture",
    title: { en: "Design Patterns & Architecture", es: "Patrones de Diseño y Arquitectura" },
    description: {
      en: "Master design patterns, SOLID principles, and architectural patterns for building scalable applications.",
      es: "Domina patrones de diseño, principios SOLID y patrones arquitectónicos para construir aplicaciones escalables.",
    },
    icon: "🎨",
    color: "from-purple-500 to-pink-500",
    slug: "design-patterns-architecture",
    posts: [
      {
        id: "design-patterns",
        title: { en: "Design Patterns", es: "Patrones de Diseño" },
        description: {
          en: "Learn essential design patterns: Singleton, Factory, Observer, Strategy, Decorator, and more.",
          es: "Aprende patrones de diseño esenciales: Singleton, Factory, Observer, Strategy, Decorator y más.",
        },
        icon: "🎨",
        color: "from-purple-500 to-pink-500",
        slug: "design-patterns",
        topics: [
          { en: "Singleton", es: "Singleton" },
          { en: "Factory", es: "Factory" },
          { en: "Observer", es: "Observer" },
          { en: "Strategy", es: "Strategy" },
          { en: "Decorator", es: "Decorator" },
          { en: "Adapter", es: "Adapter" },
          { en: "Facade", es: "Facade" },
          { en: "Command", es: "Command" },
        ],
      },
      {
        id: "solid-principles",
        title: { en: "SOLID Principles", es: "Principios SOLID" },
        description: {
          en: "Master SOLID principles for clean, maintainable code: Single Responsibility, Open/Closed, Liskov Substitution.",
          es: "Domina los principios SOLID para código limpio y mantenible: Responsabilidad Única, Abierto/Cerrado, Sustitución de Liskov.",
        },
        icon: "🏗️",
        color: "from-green-500 to-emerald-500",
        slug: "solid-principles",
        topics: [
          { en: "Single Responsibility", es: "Responsabilidad Única" },
          { en: "Open/Closed", es: "Abierto/Cerrado" },
          { en: "Liskov Substitution", es: "Sustitución de Liskov" },
          { en: "Interface Segregation", es: "Segregación de Interfaces" },
          { en: "Dependency Inversion", es: "Inversión de Dependencias" },
        ],
      },
      {
        id: "advanced-patterns",
        title: { en: "Advanced Patterns: Design System Foundations", es: "Patrones Avanzados: Fundamentos de Design Systems" },
        description: {
          en: "Render Props, Wrapper Components, and Polymorphic Components are the building blocks of Design Systems.",
          es: "Render Props, Wrapper Components y Polymorphic Components son los pilares de los Design Systems.",
        },
        icon: "🧩",
        color: "from-purple-500 to-indigo-500",
        slug: "advanced-patterns",
        topics: [
          { en: "Render Props Pattern", es: "Patrón Render Props" },
          { en: "Wrapper Components", es: "Wrapper Components" },
          { en: "Polymorphic Components", es: "Componentes Polimórficos" },
          { en: "Design System Architecture", es: "Arquitectura de Design System" },
        ],
      },
      {
        id: "micro-frontends",
        title: { en: "Micro-Frontends Architecture", es: "Arquitectura Micro-Frontends" },
        description: {
          en: "Build scalable micro-frontend architectures: Module Federation, single-spa, independent deployments.",
          es: "Construye arquitecturas micro-frontend escalables: Module Federation, single-spa, despliegues independientes.",
        },
        icon: "🏗️",
        color: "from-slate-600 to-gray-600",
        slug: "micro-frontends",
        topics: [
          { en: "Module Federation", es: "Module Federation" },
          { en: "Single-SPA Architecture", es: "Arquitectura Single-SPA" },
          { en: "Independent Deployments", es: "Despliegues Independientes" },
          { en: "Team Autonomy", es: "Autonomía de Equipos" },
        ],
      },
      {
        id: "migration-patterns",
        title: { en: "Migration & Refactoring Patterns", es: "Patrones de Migración y Refactoring" },
        description: {
          en: "Strategies for migrating legacy React code: Class to Hooks migration, Redux to modern state management.",
          es: "Estrategias para migrar código React legacy: migración de Clases a Hooks, Redux a gestión de estado moderna.",
        },
        icon: "🔄",
        color: "from-amber-500 to-yellow-500",
        slug: "migration-patterns",
        topics: [
          { en: "Class to Hooks Migration", es: "Migración de Clases a Hooks" },
          { en: "Redux to Modern State", es: "Redux a Estado Moderno" },
          { en: "React Version Upgrades", es: "Actualizaciones de Versión React" },
          { en: "Incremental Refactoring", es: "Refactoring Incremental" },
        ],
      },
      {
        id: "refactoring-guru",
        title: { en: "Refactoring Guru: Code Smells", es: "Refactoring Guru: Code Smells" },
        description: {
          en: "Learn about code smells and refactoring techniques from Refactoring.Guru. Understand Refused Bequest and other object-orientation abusers.",
          es: "Aprende sobre code smells y técnicas de refactoring de Refactoring.Guru. Entiende Refused Bequest y otros anti-patrones OOP.",
        },
        icon: "🔧",
        color: "from-purple-500 to-pink-500",
        slug: "refactoring-guru",
        topics: [
          { en: "Refused Bequest", es: "Refused Bequest" },
          { en: "Code Smells", es: "Code Smells" },
          { en: "Refactoring Techniques", es: "Técnicas de Refactoring" },
          { en: "Object-Orientation Abusers", es: "Abusos de Orientación a Objetos" },
          { en: "Inheritance Patterns", es: "Patrones de Herencia" },
        ],
      },
    ],
  },
  {
    id: "ai-llms",
    title: { en: "AI & LLMs", es: "IA y LLMs" },
    description: {
      en: "Explore artificial intelligence and Large Language Models. Learn about Transformer architecture, attention mechanisms, training, and how these systems intelligently generate text.",
      es: "Explora inteligencia artificial y Large Language Models. Aprende sobre arquitectura Transformer, mecanismos de atención, entrenamiento y cómo estos sistemas generan texto.",
    },
    icon: "🤖",
    color: "from-indigo-500 to-purple-500",
    slug: "ai-llms",
    posts: [
      {
        id: "how-llms-work",
        title: { en: "How LLMs Work: Behind the Scenes", es: "Cómo Funcionan los LLMs: Tras Bambalinas" },
        description: {
          en: "Explore the inner workings of Large Language Models (LLMs). Learn about Transformer architecture, attention mechanisms, training, and how these systems intelligently generate text.",
          es: "Explora el funcionamiento interno de los Large Language Models (LLMs). Aprende sobre arquitectura Transformer, mecanismos de atención, entrenamiento y generación de texto.",
        },
        icon: "🤖",
        color: "from-indigo-500 to-purple-500",
        slug: "how-llms-work",
        topics: [
          { en: "Transformer Architecture", es: "Arquitectura Transformer" },
          { en: "Attention Mechanisms", es: "Mecanismos de Atención" },
          { en: "LLM Training", es: "Entrenamiento de LLMs" },
          { en: "Natural Language Processing", es: "Procesamiento de Lenguaje Natural" },
          { en: "Neural Networks", es: "Redes Neuronales" },
        ],
      },
    ],
  },
  {
    id: "typescript",
    title: { en: "TypeScript & Types", es: "TypeScript y Tipos" },
    description: {
      en: "Master TypeScript patterns for React. Learn generic components, utility types, and advanced type patterns.",
      es: "Domina patrones TypeScript para React. Aprende componentes genéricos, utility types y patrones de tipos avanzados.",
    },
    icon: "📘",
    color: "from-blue-600 to-cyan-500",
    slug: "typescript",
    posts: [
      {
        id: "typescript-advanced",
        title: { en: "Advanced TypeScript Patterns for React", es: "Patrones Avanzados de TypeScript para React" },
        description: {
          en: "Master TypeScript with React: Generic components, utility types, type inference, discriminated unions.",
          es: "Domina TypeScript con React: componentes genéricos, utility types, inferencia de tipos, discriminated unions.",
        },
        icon: "📘",
        color: "from-blue-600 to-cyan-500",
        slug: "typescript-advanced",
        topics: [
          { en: "Generic Components", es: "Componentes Genéricos" },
          { en: "Utility Types", es: "Utility Types" },
          { en: "Discriminated Unions", es: "Discriminated Unions" },
          { en: "Type Inference Patterns", es: "Patrones de Inferencia de Tipos" },
          { en: "Branded Types", es: "Branded Types" },
        ],
      },
    ],
  },
  {
    id: "career-soft-skills",
    title: { en: "Career & Soft Skills", es: "Carrera y Habilidades Blandas" },
    description: {
      en: "Develop the soft skills that define senior developers: communication, leadership, career growth, and interview preparation.",
      es: "Desarrolla las habilidades blandas que definen a los desarrolladores senior: comunicación, liderazgo, crecimiento profesional y preparación para entrevistas.",
    },
    icon: "💼",
    color: "from-blue-600 to-indigo-600",
    slug: "career-soft-skills",
    posts: [
      {
        id: "soft-skills",
        title: { en: "Senior Developer Soft Skills & Communication", es: "Habilidades Blandas y Comunicación para Desarrolladores Senior" },
        description: {
          en: "Master the soft skills that define senior developers: Communication strategies, asking effective questions.",
          es: "Domina las habilidades blandas que definen a los desarrolladores senior: estrategias de comunicación, hacer preguntas efectivas.",
        },
        icon: "💼",
        color: "from-blue-600 to-indigo-600",
        slug: "soft-skills",
        topics: [
          { en: "Asking Questions", es: "Hacer Preguntas" },
          { en: "Knowledge Sharing", es: "Compartir Conocimiento" },
          { en: "Communication Strategies", es: "Estrategias de Comunicación" },
          { en: "Proactivity", es: "Proactividad" },
          { en: "Accountability", es: "Responsabilidad" },
        ],
      },
      {
        id: "interview-preparation",
        title: { en: "Interview Preparation: Complete Developer Guide", es: "Preparación para Entrevistas: Guía Completa para Desarrolladores" },
        description: {
          en: "Master technical interviews, system design, coding patterns, and behavioral interviews.",
          es: "Domina entrevistas técnicas, diseño de sistemas, patrones de codificación y entrevistas conductuales.",
        },
        icon: "🎯",
        color: "from-amber-500 to-orange-500",
        slug: "interview-preparation",
        topics: [
          { en: "Technical Interviews", es: "Entrevistas Técnicas" },
          { en: "System Design", es: "Diseño de Sistemas" },
          { en: "Coding Patterns", es: "Patrones de Codificación" },
          { en: "Behavioral Interviews", es: "Entrevistas Conductuales" },
          { en: "STAR Method", es: "Método STAR" },
        ],
      },
    ],
  },
  {
    id: "mobile-development",
    title: { en: "Mobile Development", es: "Desarrollo Móvil" },
    description: {
      en: "Build cross-platform mobile applications with React Native, Flutter, and Kotlin Multiplatform.",
      es: "Construye aplicaciones móviles multiplataforma con React Native, Flutter y Kotlin Multiplatform.",
    },
    icon: "📱",
    color: "from-indigo-500 to-violet-500",
    slug: "mobile-development",
    posts: [
      {
        id: "kotlin-multiplatform",
        title: { en: "Kotlin Multiplatform UI Patterns", es: "Patrones de UI con Kotlin Multiplatform" },
        description: {
          en: "Practical Compose Multiplatform techniques to ship one shared UI codebase across Android, iOS, and Desktop.",
          es: "Técnicas prácticas de Compose Multiplatform para una base de código UI compartida en Android, iOS y Desktop.",
        },
        icon: "📱",
        color: "from-indigo-500 to-violet-500",
        slug: "kotlin-multiplatform",
        topics: [
          { en: "Shared UiState", es: "UiState Compartido" },
          { en: "Expect/Actual UI adapters", es: "Adaptadores Expect/Actual para UI" },
          { en: "Adaptive layouts", es: "Layouts adaptativos" },
          { en: "Shared navigation graphs", es: "Grafos de navegación compartidos" },
        ],
      },
      {
        id: "flutter-react-native-kotlin-multiplatform",
        title: { en: "Flutter vs React Native vs Kotlin Multiplatform", es: "Flutter vs React Native vs Kotlin Multiplatform" },
        description: {
          en: "Comprehensive architectural analysis comparing Flutter, React Native, and Kotlin Multiplatform in 2026.",
          es: "Análisis arquitectónico comparando Flutter, React Native y Kotlin Multiplatform en 2026.",
        },
        icon: "🏗️",
        color: "from-cyan-500 to-blue-600",
        slug: "flutter-react-native-kotlin-multiplatform",
        topics: [
          { en: "Architecture Comparison", es: "Comparación de Arquitecturas" },
          { en: "Performance Benchmarks", es: "Benchmarks de Rendimiento" },
          { en: "Code Sharing Strategies", es: "Estrategias de Compartición de Código" },
          { en: "Ecosystem & Tooling", es: "Ecosistema y Herramientas" },
        ],
      },
    ],
  },
  {
    id: "accessibility-ux",
    title: { en: "Accessibility & UX", es: "Accesibilidad y UX" },
    description: {
      en: "Build accessible and user-friendly applications. Learn accessibility patterns, internationalization, animations, and UX best practices.",
      es: "Construye aplicaciones accesibles y fáciles de usar. Aprende patrones de accesibilidad, internacionalización, animaciones y mejores prácticas UX.",
    },
    icon: "♿",
    color: "from-blue-500 to-indigo-500",
    slug: "accessibility-ux",
    posts: [
      {
        id: "accessibility",
        title: { en: "Accessibility Patterns & Best Practices", es: "Patrones y Mejores Prácticas de Accesibilidad" },
        description: {
          en: "Build accessible React applications following WCAG guidelines. Learn ARIA patterns, keyboard navigation.",
          es: "Construye aplicaciones React accesibles siguiendo WCAG. Aprende patrones ARIA, navegación por teclado.",
        },
        icon: "♿",
        color: "from-blue-500 to-indigo-500",
        slug: "accessibility",
        topics: [
          { en: "ARIA Patterns", es: "Patrones ARIA" },
          { en: "Keyboard Navigation", es: "Navegación por Teclado" },
          { en: "Focus Management", es: "Gestión del Foco" },
          { en: "Screen Reader Optimization", es: "Optimización para Lector de Pantalla" },
        ],
      },
      {
        id: "internationalization",
        title: { en: "Internationalization (i18n) Patterns", es: "Patrones de Internacionalización (i18n)" },
        description: {
          en: "Build multilingual React applications: react-i18next, date/time formatting, RTL support.",
          es: "Construye aplicaciones React multilingües: react-i18next, formato de fecha/hora, soporte RTL.",
        },
        icon: "🌍",
        color: "from-green-600 to-teal-600",
        slug: "internationalization",
        topics: [
          { en: "react-i18next Patterns", es: "Patrones react-i18next" },
          { en: "Date/Time Formatting", es: "Formato de Fecha y Hora" },
          { en: "RTL Support", es: "Soporte RTL" },
          { en: "Locale Management", es: "Gestión de Locales" },
        ],
      },
      {
        id: "animations",
        title: { en: "Animation & Transition Patterns", es: "Patrones de Animación y Transiciones" },
        description: {
          en: "Smooth animations in React: Framer Motion, React Spring, CSS transitions, layout animations.",
          es: "Animaciones fluidas en React: Framer Motion, React Spring, transiciones CSS, animaciones de layout.",
        },
        icon: "🎬",
        color: "from-pink-500 to-rose-500",
        slug: "animations",
        topics: [
          { en: "Framer Motion Patterns", es: "Patrones Framer Motion" },
          { en: "React Spring", es: "React Spring" },
          { en: "Layout Animations", es: "Animaciones de Layout" },
          { en: "Gesture Handling", es: "Manejo de Gestos" },
        ],
      },
    ],
  },
  {
    id: "forms-data",
    title: { en: "Forms & Data Handling", es: "Formularios y Manejo de Datos" },
    description: {
      en: "Build robust forms and handle data effectively. Learn form management, validation, and data layer patterns.",
      es: "Construye formularios robustos y maneja datos de forma efectiva. Aprende gestión de formularios, validación y patrones de capa de datos.",
    },
    icon: "📝",
    color: "from-purple-500 to-pink-500",
    slug: "forms-data",
    posts: [
      {
        id: "form-management",
        title: { en: "Form Management & Validation Patterns", es: "Patrones de Gestión y Validación de Formularios" },
        description: {
          en: "Production-ready form handling: React Hook Form, Formik, Zod validation, complex form patterns.",
          es: "Manejo de formularios para producción: React Hook Form, Formik, validación con Zod, patrones de formularios complejos.",
        },
        icon: "📝",
        color: "from-purple-500 to-pink-500",
        slug: "form-management",
        topics: [
          { en: "React Hook Form", es: "React Hook Form" },
          { en: "Zod Schema Validation", es: "Validación con Zod Schema" },
          { en: "Complex Forms", es: "Formularios Complejos" },
          { en: "Multi-step Forms", es: "Formularios Multi-paso" },
          { en: "Dynamic Forms", es: "Formularios Dinámicos" },
        ],
      },
    ],
  },
  {
    id: "design-systems",
    title: { en: "Design Systems", es: "Sistemas de Diseño" },
    description: {
      en: "Build production-grade design systems from scratch. Learn Storybook patterns, component documentation, and token systems.",
      es: "Construye sistemas de diseño listos para producción desde cero. Aprende patrones Storybook, documentación de componentes y sistemas de tokens.",
    },
    icon: "🎨",
    color: "from-purple-500 to-pink-500",
    slug: "design-systems",
    posts: [
      {
        id: "design-systems-component-libraries",
        title: { en: "Design Systems & Component Libraries", es: "Sistemas de Diseño y Bibliotecas de Componentes" },
        description: {
          en: "Build production-grade design systems from scratch. Learn Storybook patterns, component documentation.",
          es: "Construye sistemas de diseño de nivel producción desde cero. Aprende patrones Storybook y documentación de componentes.",
        },
        icon: "🎨",
        color: "from-purple-500 to-pink-500",
        slug: "design-systems-component-libraries",
        topics: [
          { en: "Building Design Systems", es: "Construcción de Design Systems" },
          { en: "Storybook Patterns", es: "Patrones Storybook" },
          { en: "Component Documentation", es: "Documentación de Componentes" },
          { en: "Token System", es: "Sistema de Tokens" },
        ],
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

