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
  // Add more fields as needed for specific posts
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
      subtitle: 'Guía de optimización de rendimiento para React y Next.js: 45+ reglas en 8 categorías (waterfalls, bundle, servidor, cliente, re-renders, rendering, JavaScript, patrones avanzados). Ejemplos de código editables con vista previa en vivo.',
      breadcrumbLabel: 'React Best Practices',
    },
    en: {
      title: 'Vercel React Best Practices',
      subtitle: 'Comprehensive performance optimization guide for React and Next.js from Vercel Engineering. 45+ rules across 8 categories: eliminating waterfalls, bundle size, server-side, client data fetching, re-renders, rendering, JavaScript micro-optimizations, and advanced patterns. Editable code examples with live preview.',
      breadcrumbLabel: 'React Best Practices',
    },
  },
  'concurrent-features': {
    es: {
      title: 'Funciones Concurrentes de React y Suspense',
      subtitle: 'Profundiza en las funciones concurrentes de React 18+: Suspense, useDeferredValue, useTransition, streaming SSR y cómo construir UIs responsivas que nunca bloquean la experiencia del usuario.',
      breadcrumbLabel: 'Funciones Concurrentes',
    },
    en: {
      title: 'React Concurrent Features & Suspense',
      subtitle: 'Deep dive into React 18+ concurrent features: Suspense, useDeferredValue, useTransition, streaming SSR, and how to build responsive UIs that never block the user experience.',
      breadcrumbLabel: 'Concurrent Features',
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

