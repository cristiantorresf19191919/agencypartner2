// Blog post content translations
// This file contains translations for blog post content

type BlogPostId = 
  | 'soft-skills'
  | 'aws-cloud'
  | 'code-review'
  | 'authentication-authorization'
  | 'design-systems-component-libraries'
  | 'web-performance-core-web-vitals'
  | 'interview-preparation'
  | 'flutter-react-native-kotlin-multiplatform'
  | 'edge-computing'
  | string; // Allow any string for flexibility

type BlogPostContent = {
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  /** Optional intro paragraph after subtitle */
  introParagraph?: string;
  /** Optional description for categories / how to use the page */
  categoriesDescription?: string;
};

type BlogTranslations = {
  [key in BlogPostId]?: {
    es: BlogPostContent;
    en: BlogPostContent;
  };
};

const blogTranslations: BlogTranslations = {
  'soft-skills': {
    es: {
      title: 'Habilidades Blandas y Comunicación para Desarrolladores Senior',
      subtitle: 'Domina las habilidades blandas que definen a los desarrolladores senior. Aprende estrategias de comunicación efectiva, el arte de hacer preguntas, compartir conocimiento, proactividad, responsabilidad y la mentalidad que separa a los ingenieros senior del resto. Estas habilidades son a menudo más importantes que la experiencia técnica.',
      breadcrumbLabel: 'Habilidades Blandas',
    },
    en: {
      title: 'Senior Developer Soft Skills & Communication',
      subtitle: 'Master the soft skills that define senior developers. Learn effective communication strategies, the art of asking questions, knowledge sharing, proactivity, accountability, and the mindset that separates senior engineers from the rest. These skills are often more important than technical expertise.',
      breadcrumbLabel: 'Soft Skills',
    },
  },
  'aws-cloud': {
    es: {
      title: 'AWS Cloud: De Cero a Héroe',
      subtitle: 'Guía completa de AWS desde fundamentos hasta arquitectura avanzada. Aprende servicios principales, mejores prácticas de seguridad, infraestructura como código, patrones serverless, optimización de costos y arquitecturas listas para producción utilizadas por ingenieros senior.',
      breadcrumbLabel: 'AWS Cloud',
    },
    en: {
      title: 'AWS Cloud: Zero to Hero',
      subtitle: 'Complete AWS guide from fundamentals to advanced architecture. Learn core services, security best practices, infrastructure as code, serverless patterns, cost optimization, and production-ready architectures used by senior engineers.',
      breadcrumbLabel: 'AWS Cloud',
    },
  },
  'code-review': {
    es: {
      title: 'Mejores Prácticas de Revisión de Código',
      subtitle: 'Domina el arte de la revisión de código: revisiones efectivas de PR, proporcionar retroalimentación constructiva, revisar decisiones de arquitectura y listas de verificación de seguridad completas. Aprende cómo los ingenieros senior realizan revisiones que mejoran la calidad del código, comparten conocimiento y construyen equipos más fuertes.',
      breadcrumbLabel: 'Revisión de Código',
    },
    en: {
      title: 'Code Review Best Practices',
      subtitle: 'Master the art of code review: Effective PR reviews, providing constructive feedback, reviewing architecture decisions, and comprehensive security checklists. Learn how senior engineers conduct reviews that improve code quality, share knowledge, and build stronger teams.',
      breadcrumbLabel: 'Code Review',
    },
  },
  'authentication-authorization': {
    es: {
      title: 'Patrones de Autenticación y Autorización',
      subtitle: 'Domina la autenticación y autorización de nivel de producción. Aprende análisis profundo de JWT, OAuth 2.0/OpenID Connect, gestión de sesiones, estrategias de refresh token, Control de Acceso Basado en Roles (RBAC) y sistemas basados en permisos utilizados por ingenieros senior.',
      breadcrumbLabel: 'Autenticación y Autorización',
    },
    en: {
      title: 'Authentication & Authorization Patterns',
      subtitle: 'Master production-grade authentication and authorization. Learn JWT deep dive, OAuth 2.0/OpenID Connect, session management, refresh token strategies, Role-Based Access Control (RBAC), and permission-based systems used by senior engineers.',
      breadcrumbLabel: 'Authentication & Authorization',
    },
  },
  'design-systems-component-libraries': {
    es: {
      title: 'Sistemas de Diseño y Bibliotecas de Componentes',
      subtitle: 'Construye sistemas de diseño de nivel de producción desde cero. Aprende patrones de Storybook, documentación de componentes, arquitectura de sistema de tokens, accesibilidad en sistemas de diseño y versionado de bibliotecas de componentes utilizados por ingenieros senior.',
      breadcrumbLabel: 'Sistemas de Diseño',
    },
    en: {
      title: 'Design Systems & Component Libraries',
      subtitle: 'Build production-grade design systems from scratch. Learn Storybook patterns, component documentation, token system architecture, accessibility in design systems, and versioning component libraries used by senior engineers.',
      breadcrumbLabel: 'Design Systems',
    },
  },
  'web-performance-core-web-vitals': {
    es: {
      title: 'Rendimiento Web y Core Web Vitals',
      subtitle: 'Domina la optimización del rendimiento web. Aprende optimización de Critical Rendering Path, resource hints (prefetch, preload), Service Workers y PWA, Web Workers para computación pesada, estrategias de optimización de imágenes y optimización de carga de fuentes utilizadas por ingenieros senior.',
      breadcrumbLabel: 'Rendimiento Web',
    },
    en: {
      title: 'Web Performance & Core Web Vitals',
      subtitle: 'Master web performance optimization. Learn Critical Rendering Path optimization, resource hints (prefetch, preload), Service Workers & PWA, Web Workers for heavy computation, image optimization strategies, and font loading optimization used by senior engineers.',
      breadcrumbLabel: 'Web Performance',
    },
  },
  'interview-preparation': {
    es: {
      title: 'Preparación para Entrevistas: Guía Completa para Desarrolladores',
      subtitle: 'Domina las entrevistas técnicas, diseño de sistemas, patrones de codificación y entrevistas conductuales. Guía completa que cubre estrategias, frameworks, patrones y técnicas utilizadas por ingenieros senior en las principales empresas tecnológicas. Aprende cómo abordar las entrevistas con confianza y demostrar tus habilidades de resolución de problemas de manera efectiva.',
      breadcrumbLabel: 'Preparación para Entrevistas',
    },
    en: {
      title: 'Interview Preparation: Complete Developer Guide',
      subtitle: 'Master technical interviews, system design, coding patterns, and behavioral interviews. Comprehensive guide covering strategies, frameworks, patterns, and techniques used by senior engineers at top tech companies. Learn how to approach interviews with confidence and demonstrate your problem-solving abilities effectively.',
      breadcrumbLabel: 'Interview Preparation',
    },
  },
  'flutter-react-native-kotlin-multiplatform': {
    es: {
      title: 'Flutter vs React Native vs Kotlin Multiplatform: La Guía del Arquitecto 2026',
      subtitle: 'Análisis arquitectónico completo comparando Flutter, React Native y Kotlin Multiplatform en 2026. Análisis profundo de rendimiento, estrategias de compartición de código, madurez del ecosistema, viabilidad a largo plazo y patrones de producción del mundo real desde la perspectiva de un arquitecto especialista.',
      breadcrumbLabel: 'Flutter vs React Native vs KMP',
    },
    en: {
      title: 'Flutter vs React Native vs Kotlin Multiplatform: The 2026 Architect\'s Guide',
      subtitle: 'Comprehensive architectural analysis comparing Flutter, React Native, and Kotlin Multiplatform in 2026. Deep dive into performance, code sharing strategies, ecosystem maturity, long-term viability, and real-world production patterns from a specialist architect perspective.',
      breadcrumbLabel: 'Flutter vs RN vs KMP',
    },
  },
  'edge-computing': {
    es: {
      title: 'Edge Computing y Edge Functions: El Futuro de las Aplicaciones de Baja Latencia',
      subtitle: 'Domina la arquitectura de edge computing: Vercel Edge Functions, Cloudflare Workers, estrategias de caché en el edge, y comprende las compensaciones críticas entre edge computing y serverless tradicional. Aprende cómo construir aplicaciones ultra-rápidas y distribuidas globalmente que responden en milisegundos.',
      breadcrumbLabel: 'Edge Computing',
    },
    en: {
      title: 'Edge Computing & Edge Functions: The Future of Low-Latency Applications',
      subtitle: 'Master edge computing architecture: Vercel Edge Functions, Cloudflare Workers, edge caching strategies, and understand the critical trade-offs between edge computing and traditional serverless. Learn how to build ultra-fast, globally distributed applications that respond in milliseconds.',
      breadcrumbLabel: 'Edge Computing',
    },
  },
  'react-best-practices': {
    es: {
      title: 'Vercel React Best Practices',
      subtitle: 'Guía de optimización de rendimiento para React y Next.js basada en la ingeniería de Vercel. Más de 45 reglas en 8 categorías: eliminación de cascadas de datos, tamaño de bundle, rendimiento en servidor, obtención de datos en cliente, re-renders, rendering, micro-optimizaciones en JavaScript y patrones avanzados. Cada regla incluye ejemplos de código editables con vista previa en vivo.',
      breadcrumbLabel: 'React Best Practices',
      introParagraph: 'Estas prácticas están ordenadas por impacto: las críticas (waterfalls y bundle) afectan directamente el tiempo de carga y la experiencia del usuario; las de nivel medio (re-renders, rendering) mejoran la fluidez; las avanzadas pulen casos concretos. Usa los ejemplos en el editor: edita, ejecuta (Run) y compara el comportamiento.',
      categoriesDescription: 'Categorías por prioridad: 1. Eliminar cascadas (CRÍTICO) • 2. Tamaño de bundle (CRÍTICO) • 3. Servidor (ALTO) • 4. Datos en cliente (MEDIO-ALTO) • 5. Re-renders (MEDIO) • 6. Rendering (MEDIO) • 7. JavaScript (BAJO-MEDIO) • 8. Avanzado (BAJO). Todos los bloques son editables; pulsa Run (⌘/Ctrl+Enter) para ver la vista previa.',
    },
    en: {
      title: 'Vercel React Best Practices',
      subtitle: 'Comprehensive performance optimization guide for React and Next.js from Vercel Engineering. 45+ rules across 8 categories: eliminating waterfalls, bundle size, server-side performance, client data fetching, re-renders, rendering, JavaScript micro-optimizations, and advanced patterns. Each rule includes editable code examples with live preview.',
      breadcrumbLabel: 'React Best Practices',
      introParagraph: 'These practices are ordered by impact: critical ones (waterfalls and bundle size) directly affect load time and user experience; medium-priority rules (re-renders, rendering) improve responsiveness; advanced ones polish edge cases. Use the examples in the editor: edit, run, and compare behavior.',
      categoriesDescription: 'Categories by priority: 1. Eliminating Waterfalls (CRITICAL) • 2. Bundle Size (CRITICAL) • 3. Server-Side (HIGH) • 4. Client Data Fetching (MEDIUM-HIGH) • 5. Re-render (MEDIUM) • 6. Rendering (MEDIUM) • 7. JavaScript (LOW-MEDIUM) • 8. Advanced (LOW). All code blocks are editable—try Run (⌘/Ctrl+Enter) to see the preview.',
    },
  },
  'nextjs-best-practices': {
    es: {
      title: 'Mejores Prácticas y Patrones de Next.js',
      subtitle: 'Guía completa de Next.js desde fundamentos hasta avanzado. Aprende App Router, Server Components, patrones de obtención de datos, estrategias de caché, optimización de rendimiento, enrutamiento, rutas API, middleware y patrones listos para producción utilizados por ingenieros senior. Domina Next.js paso a paso con extensos ejemplos del mundo real.',
      breadcrumbLabel: 'Mejores Prácticas Next.js',
    },
    en: {
      title: 'Next.js Best Practices & Patterns',
      subtitle: 'Complete Next.js guide from fundamentals to advanced. Learn App Router, Server Components, data fetching patterns, caching strategies, performance optimization, routing, API routes, middleware, and production-ready patterns used by senior engineers. Master Next.js step-by-step with extensive real-world examples.',
      breadcrumbLabel: 'Next.js Best Practices',
    },
  },
  'terraform': {
    es: {
      title: 'Terraform: Maestría en Infraestructura como Código',
      subtitle: 'Guía completa de Terraform desde fundamentos hasta avanzado. Aprende principios de Infraestructura como Código, gestión de estado, módulos, espacios de trabajo, provisionadores y patrones listos para producción utilizados por ingenieros DevOps senior. Domina Terraform paso a paso con extensos ejemplos del mundo real.',
      breadcrumbLabel: 'Terraform',
    },
    en: {
      title: 'Terraform: Infrastructure as Code Mastery',
      subtitle: 'Complete Terraform guide from fundamentals to advanced. Learn Infrastructure as Code principles, state management, modules, workspaces, provisioners, and production-ready patterns used by senior DevOps engineers. Master Terraform step-by-step with extensive real-world examples.',
      breadcrumbLabel: 'Terraform',
    },
  },
  'kubernetes-zero-to-hero': {
    es: {
      title: 'Kubernetes: De Cero a Héroe',
      subtitle: 'Guía completa de Kubernetes desde fundamentos hasta producción. Aprende arquitectura, kubectl, k9s, pods, deployments, services, ConfigMaps, Secrets, Helm, RBAC, monitoreo y más. Con ejemplos prácticos y comandos reales para dominar la orquestación de contenedores.',
      breadcrumbLabel: 'Kubernetes',
      introParagraph: 'Esta guía cubre todo lo que necesitas saber para trabajar con Kubernetes profesionalmente. Desde conceptos básicos hasta despliegues de producción, cada sección incluye ejemplos de código listos para usar.',
      categoriesDescription: 'Contenido: 1. Introducción • 2. Arquitectura • 3. Instalación • 4. kubectl • 5. Pods • 6. Deployments • 7. Services • 8. ConfigMaps & Secrets • 9. Volúmenes • 10. Networking • 11. K9s • 12. Helm • 13. RBAC • 14. Monitoreo • 15. Mejores Prácticas • 16. Ejemplos Reales',
    },
    en: {
      title: 'Kubernetes: Zero to Hero',
      subtitle: 'Complete Kubernetes guide from fundamentals to production. Learn architecture, kubectl, k9s, pods, deployments, services, ConfigMaps, Secrets, Helm, RBAC, monitoring and more. With practical examples and real commands to master container orchestration.',
      breadcrumbLabel: 'Kubernetes',
      introParagraph: 'This guide covers everything you need to know to work with Kubernetes professionally. From basic concepts to production deployments, each section includes ready-to-use code examples.',
      categoriesDescription: 'Contents: 1. Introduction • 2. Architecture • 3. Installation • 4. kubectl • 5. Pods • 6. Deployments • 7. Services • 8. ConfigMaps & Secrets • 9. Volumes • 10. Networking • 11. K9s • 12. Helm • 13. RBAC • 14. Monitoring • 15. Best Practices • 16. Real-World Examples',
    },
  },
  'dsa-complete-guide': {
    es: {
      title: 'Estructuras de Datos y Algoritmos: Guía Completa',
      subtitle: 'Domina estructuras de datos y algoritmos fundamentales con ejemplos de código ejecutables en TypeScript y Kotlin. Desde complejidad Big O hasta programación dinámica, cada concepto incluye visualizaciones, implementaciones prácticas y desafíos interactivos. El editor soporta maximización y ajuste de tamaño de fuente.',
      breadcrumbLabel: 'DSA',
      introParagraph: 'Esta guía cubre las estructuras de datos y algoritmos más importantes para entrevistas técnicas y desarrollo profesional. Cada sección incluye teoría, visualizaciones, código ejecutable en ambos lenguajes y desafíos prácticos. Usa el editor para experimentar con el código.',
      categoriesDescription: 'Contenido: 1. Complejidad y Big O • 2. Arrays y Strings • 3. Listas Enlazadas • 4. Pilas y Colas • 5. Tablas Hash • 6. Árboles y BST • 7. Heaps • 8. Grafos • 9. Ordenamiento • 10. Búsqueda • 11. Programación Dinámica • 12. Algoritmos Greedy',
    },
    en: {
      title: 'Data Structures & Algorithms: Complete Guide',
      subtitle: 'Master fundamental data structures and algorithms with executable code examples in TypeScript and Kotlin. From Big O complexity to dynamic programming, each concept includes visualizations, practical implementations, and interactive challenges. The editor supports maximize and font size adjustment.',
      breadcrumbLabel: 'DSA',
      introParagraph: 'This guide covers the most important data structures and algorithms for technical interviews and professional development. Each section includes theory, visualizations, executable code in both languages, and practical challenges. Use the editor to experiment with the code.',
      categoriesDescription: 'Contents: 1. Complexity & Big O • 2. Arrays & Strings • 3. Linked Lists • 4. Stacks & Queues • 5. Hash Tables • 6. Trees & BST • 7. Heaps • 8. Graphs • 9. Sorting • 10. Searching • 11. Dynamic Programming • 12. Greedy Algorithms',
    },
  },
};

/**
 * Get blog post content for a specific post and locale
 */
export function getBlogPostContent(
  postId: BlogPostId,
  locale: 'es' | 'en'
): BlogPostContent | null {
  const post = blogTranslations[postId];
  if (!post) {
    return null;
  }
  return post[locale] || post.en; // Fallback to English if locale not available
}

/**
 * Hook-like function to get blog post content
 * Use this in blog post components
 */
export function useBlogPostContent(postId: BlogPostId, locale: 'es' | 'en') {
  return getBlogPostContent(postId, locale);
}

/** Spanish translations for blog category title and description (slug -> { title, description }) */
const CATEGORY_ES: Record<string, { title: string; description: string }> = {
  'react-development': {
    title: 'Desarrollo React',
    description: 'Domina patrones React, hooks, componentes y conceptos avanzados. Aprende desarrollo React listo para producción desde fundamentos hasta nivel senior.',
  },
  'performance-optimization': {
    title: 'Rendimiento y optimización',
    description: 'Optimiza aplicaciones React en velocidad y eficiencia. Code splitting, lazy loading, monitoreo de rendimiento y Core Web Vitals.',
  },
  'nextjs-framework': {
    title: 'Framework Next.js',
    description: 'Domina Next.js: App Router, Server Components, obtención de datos, optimización y patrones listos para producción.',
  },
  'cloud-infrastructure': {
    title: 'Nube e infraestructura',
    description: 'Construye infraestructura en la nube con AWS, edge computing y arquitecturas serverless.',
  },
  'build-tools': {
    title: 'Herramientas de build',
    description: 'Domina la automatización con Gradle. Wrapper, tareas, plugins, dependencias, multi-módulo y version catalogs.',
  },
  'testing-quality': {
    title: 'Testing y calidad',
    description: 'Estrategias de testing, buenas prácticas de code review y aseguramiento de calidad.',
  },
  'security-authentication': {
    title: 'Seguridad y autenticación',
    description: 'Seguridad en aplicaciones: autenticación, autorización y patrones de seguridad.',
  },
  'state-management': {
    title: 'Gestión de estado',
    description: 'Patrones modernos de estado con React Query, Zustand, Immer y estado en la URL.',
  },
  'design-patterns-architecture': {
    title: 'Patrones de diseño y arquitectura',
    description: 'Patrones de diseño, principios SOLID y arquitectura para aplicaciones escalables.',
  },
  'ai-llms': {
    title: 'IA y LLMs',
    description: 'Explora inteligencia artificial y modelos de lenguaje. Arquitectura Transformer, atención, entrenamiento y generación de texto.',
  },
  'typescript': {
    title: 'TypeScript y tipos',
    description: 'Domina TypeScript con React. Componentes genéricos, utility types y patrones avanzados de tipos.',
  },
  'career-soft-skills': {
    title: 'Carrera y habilidades blandas',
    description: 'Habilidades blandas que definen a los desarrolladores senior: comunicación, liderazgo, crecimiento y preparación para entrevistas.',
  },
  'mobile-development': {
    title: 'Desarrollo móvil',
    description: 'Apps multiplataforma con React Native, Flutter y Kotlin Multiplatform.',
  },
  'accessibility-ux': {
    title: 'Accesibilidad y UX',
    description: 'Aplicaciones accesibles y usables. Patrones de accesibilidad, internacionalización, animaciones y UX.',
  },
  'forms-data': {
    title: 'Formularios y datos',
    description: 'Formularios robustos y manejo de datos. Gestión de formularios, validación y patrones de capa de datos.',
  },
  'design-systems': {
    title: 'Sistemas de diseño',
    description: 'Sistemas de diseño listos para producción. Storybook, documentación de componentes y sistemas de tokens.',
  },
  'data-structures-algorithms': {
    title: 'Estructuras de datos y algoritmos',
    description: 'Domina estructuras de datos y algoritmos fundamentales con ejemplos ejecutables. Arrays, listas enlazadas, árboles, grafos, ordenamiento, búsqueda y programación dinámica en TypeScript y Kotlin.',
  },
};

/**
 * Get category title and description for locale. For 'en' use original from blogCategories; for 'es' use CATEGORY_ES when available.
 */
export function getCategoryForLocale(
  slug: string,
  locale: 'es' | 'en',
  fallback: { title: string; description: string }
): { title: string; description: string } {
  if (locale === 'en') return fallback;
  const es = CATEGORY_ES[slug];
  return es ? { title: es.title, description: es.description } : fallback;
}
