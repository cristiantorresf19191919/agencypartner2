import { blogCategories } from "./blogCategories";
import { localize } from "./localize";
import type { Locale } from "./localize";

export interface SearchItem {
  id: string;
  title: string;
  titleKey: string;
  href: string;
  section: string;
  sectionKey: string;
  icon?: string;
  color?: string;
  keywords?: string[];
}

// Navigation structure matching DocSidebar
const navigationData: Array<{
  titleKey: string;
  items: Array<{
    id: string;
    titleKey: string;
    href: string;
    color?: string;
  }>;
}> = [
  {
    titleKey: "react-patterns-title",
    items: [
      {
        id: "composition-pattern",
        titleKey: "composition-pattern-title",
        href: "/developer-section/blog/composition-pattern",
        color: "#4FC3F7",
      },
      {
        id: "compound-components",
        titleKey: "react-patterns-compound-title",
        href: "/developer-section/blog/react-patterns#compound-components",
        color: "#AB47BC",
      },
      {
        id: "custom-hooks",
        titleKey: "react-patterns-hooks-title",
        href: "/developer-section/blog/react-patterns#custom-hooks",
        color: "#26A69A",
      },
      {
        id: "hoc",
        titleKey: "react-patterns-hoc-title",
        href: "/developer-section/blog/react-patterns#hoc",
        color: "#FF7043",
      },
      {
        id: "render-props",
        titleKey: "react-patterns-render-props-title",
        href: "/developer-section/blog/react-patterns#render-props",
        color: "#42A5F5",
      },
      {
        id: "selective-hydration",
        titleKey: "react-patterns-hydration-title",
        href: "/developer-section/blog/react-patterns#selective-hydration",
        color: "#66BB6A",
      },
    ],
  },
  {
    titleKey: "design-patterns-creational-title",
    items: [
      { id: "factory-method", titleKey: "design-patterns-factory-method-title", href: "/developer-section/blog/design-patterns#factory-method", color: "#E91E63" },
      { id: "abstract-factory", titleKey: "design-patterns-abstract-factory-title", href: "/developer-section/blog/design-patterns#abstract-factory", color: "#9C27B0" },
      { id: "builder", titleKey: "design-patterns-builder-title", href: "/developer-section/blog/design-patterns#builder", color: "#FF9800" },
      { id: "prototype", titleKey: "design-patterns-prototype-title", href: "/developer-section/blog/design-patterns#prototype", color: "#00BCD4" },
      { id: "singleton", titleKey: "design-patterns-singleton-title", href: "/developer-section/blog/design-patterns#singleton", color: "#4CAF50" },
    ],
  },
  {
    titleKey: "design-patterns-structural-title",
    items: [
      { id: "adapter", titleKey: "design-patterns-adapter-title", href: "/developer-section/blog/design-patterns#adapter", color: "#2196F3" },
      { id: "bridge", titleKey: "design-patterns-bridge-title", href: "/developer-section/blog/design-patterns#bridge", color: "#03A9F4" },
      { id: "composite", titleKey: "design-patterns-composite-title", href: "/developer-section/blog/design-patterns#composite", color: "#00BCD4" },
      { id: "decorator", titleKey: "design-patterns-decorator-title", href: "/developer-section/blog/design-patterns#decorator", color: "#009688" },
      { id: "facade", titleKey: "design-patterns-facade-title", href: "/developer-section/blog/design-patterns#facade", color: "#4CAF50" },
      { id: "flyweight", titleKey: "design-patterns-flyweight-title", href: "/developer-section/blog/design-patterns#flyweight", color: "#8BC34A" },
      { id: "proxy", titleKey: "design-patterns-proxy-title", href: "/developer-section/blog/design-patterns#proxy", color: "#FF9800" },
    ],
  },
  {
    titleKey: "design-patterns-behavioral-title",
    items: [
      { id: "chain-of-responsibility", titleKey: "design-patterns-chain-title", href: "/developer-section/blog/design-patterns#chain-of-responsibility", color: "#673AB7" },
      { id: "command", titleKey: "design-patterns-command-title", href: "/developer-section/blog/design-patterns#command", color: "#7C4DFF" },
      { id: "iterator", titleKey: "design-patterns-iterator-title", href: "/developer-section/blog/design-patterns#iterator", color: "#9C27B0" },
      { id: "mediator", titleKey: "design-patterns-mediator-title", href: "/developer-section/blog/design-patterns#mediator", color: "#E91E63" },
      { id: "memento", titleKey: "design-patterns-memento-title", href: "/developer-section/blog/design-patterns#memento", color: "#00BCD4" },
      { id: "observer", titleKey: "design-patterns-observer-title", href: "/developer-section/blog/design-patterns#observer", color: "#009688" },
      { id: "state", titleKey: "design-patterns-state-title", href: "/developer-section/blog/design-patterns#state", color: "#4CAF50" },
      { id: "strategy", titleKey: "design-patterns-strategy-title", href: "/developer-section/blog/design-patterns#strategy", color: "#8BC34A" },
      { id: "template-method", titleKey: "design-patterns-template-method-title", href: "/developer-section/blog/design-patterns#template-method", color: "#FF9800" },
      { id: "visitor", titleKey: "design-patterns-visitor-title", href: "/developer-section/blog/design-patterns#visitor", color: "#F44336" },
    ],
  },
  {
    titleKey: "solid-title",
    items: [
      {
        id: "srp",
        titleKey: "solid-srp-title",
        href: "/developer-section/blog/solid-principles#srp",
        color: "#F44336",
      },
      {
        id: "ocp",
        titleKey: "Open/Closed Principle",
        href: "/developer-section/blog/solid-principles#ocp",
        color: "#4CAF50",
      },
      {
        id: "lsp",
        titleKey: "Liskov Substitution Principle",
        href: "/developer-section/blog/solid-principles#lsp",
        color: "#FFC107",
      },
    ],
  },
  {
    titleKey: "Advanced React Hooks",
    items: [
      {
        id: "use-transition",
        titleKey: "useTransition",
        href: "/developer-section/blog/advanced-react-hooks#use-transition",
        color: "#00BCD4",
      },
      {
        id: "use-layout-effect",
        titleKey: "useLayoutEffect",
        href: "/developer-section/blog/advanced-react-hooks#use-layout-effect",
        color: "#4CAF50",
      },
      {
        id: "callback-ref",
        titleKey: "useCallback As Ref",
        href: "/developer-section/blog/advanced-react-hooks#callback-ref",
        color: "#FF9800",
      },
      {
        id: "modern-architecture",
        titleKey: "Async React Router",
        href: "/developer-section/blog/advanced-react-hooks#modern-architecture",
        color: "#9C27B0",
      },
      {
        id: "react-portals",
        titleKey: "React Portals",
        href: "/developer-section/blog/advanced-react-hooks#react-portals",
        color: "#2196F3",
      },
      {
        id: "error-boundaries",
        titleKey: "Error Boundaries",
        href: "/developer-section/blog/advanced-react-hooks#error-boundaries",
        color: "#F44336",
      },
      {
        id: "keys-explained",
        titleKey: "Keys Explained",
        href: "/developer-section/blog/advanced-react-hooks#keys-explained",
        color: "#E91E63",
      },
      {
        id: "event-listeners",
        titleKey: "Event Listeners",
        href: "/developer-section/blog/advanced-react-hooks#event-listeners",
        color: "#FF5722",
      },
      {
        id: "use-id",
        titleKey: "useId",
        href: "/developer-section/blog/advanced-react-hooks#use-id",
        color: "#00ACC1",
      },
      {
        id: "use-deferred-value",
        titleKey: "useDeferredValue",
        href: "/developer-section/blog/advanced-react-hooks#use-deferred-value",
        color: "#8BC34A",
      },
    ],
  },
  {
    titleKey: "React Query",
    items: [
      {
        id: "optimistic-updates",
        titleKey: "Optimistic Updates",
        href: "/developer-section/blog/react-query#optimistic-updates",
        color: "#FF6B6B",
      },
      {
        id: "search-grid",
        titleKey: "Search Grid (Cancellation)",
        href: "/developer-section/blog/react-query#search-grid",
        color: "#4ECDC4",
      },
      {
        id: "infinite-feed",
        titleKey: "Infinite Feed (Data Transform)",
        href: "/developer-section/blog/react-query#infinite-feed",
        color: "#95E1D3",
      },
    ],
  },
  {
    titleKey: "Advanced Patterns",
    items: [
      {
        id: "render-props",
        titleKey: "Render Props (Headless)",
        href: "/developer-section/blog/advanced-patterns#render-props",
        color: "#9B59B6",
      },
      {
        id: "wrapper-components",
        titleKey: "Wrapper Components (Guard)",
        href: "/developer-section/blog/advanced-patterns#wrapper-components",
        color: "#3498DB",
      },
      {
        id: "polymorphic-components",
        titleKey: "Polymorphic Components",
        href: "/developer-section/blog/advanced-patterns#polymorphic-components",
        color: "#E74C3C",
      },
    ],
  },
  {
    titleKey: "State Management",
    items: [
      {
        id: "use-immer",
        titleKey: "useImmer (Immutable Updates)",
        href: "/developer-section/blog/state-management#use-immer",
        color: "#10B981",
      },
      {
        id: "use-immer-reducer",
        titleKey: "useImmerReducer",
        href: "/developer-section/blog/state-management#use-immer-reducer",
        color: "#3B82F6",
      },
      {
        id: "remote-state",
        titleKey: "Remote State (TanStack Query)",
        href: "/developer-section/blog/state-management#remote-state",
        color: "#8B5CF6",
      },
      {
        id: "shared-state-zustand",
        titleKey: "Shared State (Zustand)",
        href: "/developer-section/blog/state-management#shared-state-zustand",
        color: "#F59E0B",
      },
      {
        id: "url-state",
        titleKey: "URL State (nuqs)",
        href: "/developer-section/blog/state-management#url-state",
        color: "#EF4444",
      },
    ],
  },
  {
    titleKey: "React Design Patterns 2025",
    items: [
      {
        id: "modern-component-patterns",
        titleKey: "Modern Component Patterns",
        href: "/developer-section/blog/react-design-patterns#modern-component-patterns",
        color: "#6366F1",
      },
      {
        id: "custom-hooks",
        titleKey: "Custom Hooks",
        href: "/developer-section/blog/react-design-patterns#custom-hooks",
        color: "#8B5CF6",
      },
      {
        id: "context-api",
        titleKey: "Context API",
        href: "/developer-section/blog/react-design-patterns#context-api",
        color: "#EC4899",
      },
      {
        id: "typescript-patterns",
        titleKey: "TypeScript Patterns",
        href: "/developer-section/blog/react-design-patterns#typescript-patterns",
        color: "#3B82F6",
      },
      {
        id: "react-19-features",
        titleKey: "React 19 Features",
        href: "/developer-section/blog/react-design-patterns#react-19-features",
        color: "#10B981",
      },
      {
        id: "modern-frameworks",
        titleKey: "Modern Frameworks",
        href: "/developer-section/blog/react-design-patterns#modern-frameworks",
        color: "#F59E0B",
      },
      {
        id: "component-libraries",
        titleKey: "Component Libraries",
        href: "/developer-section/blog/react-design-patterns#component-libraries",
        color: "#EF4444",
      },
    ],
  },
];

// Additional keywords for better search
const keywordMap: Record<string, string[]> = {
  "composition-pattern": ["composition", "component composition", "react composition"],
  "compound-components": ["compound", "compound components", "component groups"],
  "hoc": ["higher order component", "hoc", "wrapper", "enhancer"],
  "selective-hydration": ["hydration", "ssr", "server side rendering", "selective"],
  "strategy": ["strategy pattern", "algorithm", "behavioral pattern"],
  "observer": ["observer pattern", "pub sub", "publish subscribe", "event"],
  "factory": ["factory pattern", "creational", "object creation"],
  "srp": ["single responsibility", "srp", "principle", "solid"],
  "ocp": ["open closed", "ocp", "extension", "modification"],
  "lsp": ["liskov substitution", "lsp", "substitution", "inheritance"],
  "use-transition": ["transition", "concurrent", "priority"],
  "use-layout-effect": ["layout", "synchronous", "dom"],
  "callback-ref": ["ref", "callback", "reference"],
  "modern-architecture": ["architecture", "async", "router", "routing"],
  "react-portals": ["portal", "render outside", "modal"],
  "error-boundaries": ["error", "boundary", "catch", "fallback"],
  "keys-explained": ["key", "list", "reconciliation"],
  "event-listeners": ["event", "listener", "addEventListener"],
  "use-id": ["id", "unique", "identifier"],
  "use-deferred-value": ["deferred", "value", "debounce"],
  "optimistic-updates": ["optimistic", "mutation", "update", "rollback", "onMutate", "react query"],
  "search-grid": ["search", "pagination", "cancellation", "abort signal", "race condition", "placeholder data"],
  "infinite-feed": ["infinite", "scroll", "feed", "data transformation", "select", "flatMap"],
  "render-props": ["render props", "render function", "children function", "headless", "inversion of control", "composition"],
  "wrapper-components": ["wrapper", "guard", "hoc", "higher order component", "feature flag", "auth guard"],
  "polymorphic-components": ["polymorphic", "as prop", "design system", "component props", "element type"],
  "use-immer": ["immer", "useImmer", "immutable", "mutation", "draft", "nested state"],
  "use-immer-reducer": ["immer", "useImmerReducer", "reducer", "state machine", "complex state"],
  "remote-state": ["tanstack query", "react query", "swr", "data fetching", "caching", "remote data"],
  "shared-state-zustand": ["zustand", "shared state", "global state", "store", "provider"],
  "url-state": ["nuqs", "query params", "url state", "routing", "search params"],
  "modern-component-patterns": ["function components", "component patterns", "modern react", "hooks"],
  "custom-hooks": ["hooks", "custom hooks", "react hooks", "use hook", "reusable logic", "hook patterns", "useFormInput", "useLocalStorage"],
  "context-api": ["context", "context api", "react 19", "use hook", "application state"],
  "typescript-patterns": ["typescript", "type safety", "generics", "type-safe components", "tsx"],
  "react-19-features": ["react 19", "useOptimistic", "server components", "use hook", "new features"],
  "modern-frameworks": ["next.js", "remix", "vite", "frameworks", "react ecosystem"],
  "component-libraries": ["tailwind", "kendo react", "component library", "design system", "styling"],
};

export function getSearchIndex(
  t: (key: string) => string,
  locale: Locale = "en"
): SearchItem[] {
  // Get items from navigation data (existing search items)
  const navigationItems = navigationData.flatMap((section) =>
    section.items.map((item) => ({
      id: item.id,
      title: t(item.titleKey) !== item.titleKey ? t(item.titleKey) : item.titleKey,
      titleKey: item.titleKey,
      href: item.href,
      section: t(section.titleKey) !== section.titleKey ? t(section.titleKey) : section.titleKey,
      sectionKey: section.titleKey,
      color: item.color,
      keywords: keywordMap[item.id] || [],
    }))
  );

  // Add all blog categories and posts (localized)
  const blogItems = blogCategories.flatMap((category) => {
    const categoryItem: SearchItem = {
      id: `category-${category.id}`,
      title: localize(category.title, locale),
      titleKey: category.id,
      href: `/developer-section/blog/category/${category.slug}`,
      section: "Blog Categories",
      sectionKey: "blog-categories",
      icon: category.icon,
      color: category.color,
      keywords: [
        localize(category.description, locale),
        ...category.posts.map((p) => localize(p.title, locale)),
      ],
    };

    const postItems: SearchItem[] = category.posts.map((post) => ({
      id: `post-${post.id}`,
      title: localize(post.title, locale),
      titleKey: post.id,
      href: `/developer-section/blog/${post.slug}`,
      section: localize(category.title, locale),
      sectionKey: category.id,
      icon: post.icon,
      color: post.color,
      keywords: [
        localize(post.description, locale),
        ...(post.topics || []).map((topic) => localize(topic, locale)),
      ],
    }));

    return [categoryItem, ...postItems];
  });

  return [...navigationItems, ...blogItems];
}

export function searchItems(
  items: SearchItem[],
  query: string
): SearchItem[] {
  if (!query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  const queryWords = lowerQuery.split(/\s+/);

  const scoredItems = items.map((item) => {
    let score = 0;
    const lowerTitle = item.title.toLowerCase();
    const lowerSection = item.section.toLowerCase();
    const lowerKeywords = item.keywords?.join(" ").toLowerCase() || "";

    // Exact title match (highest priority)
    if (lowerTitle === lowerQuery) {
      score += 100;
    } else if (lowerTitle.startsWith(lowerQuery)) {
      score += 50;
    } else if (lowerTitle.includes(lowerQuery)) {
      score += 30;
    }

    // Word matches in title
    queryWords.forEach((word) => {
      if (lowerTitle.includes(word)) {
        score += 20;
      }
    });

    // Section match
    if (lowerSection.includes(lowerQuery)) {
      score += 15;
    }

    // Keywords match
    if (lowerKeywords.includes(lowerQuery)) {
      score += 25;
    }
    queryWords.forEach((word) => {
      if (lowerKeywords.includes(word)) {
        score += 10;
      }
    });

    // ID match (for exact searches)
    if (item.id.toLowerCase().includes(lowerQuery)) {
      score += 5;
    }

    return { item, score };
  });

  // Filter and sort by score
  return scoredItems
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

