"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  alpha,
} from "@mui/material";
import {
  AccountTree as AccountTreeIcon,
  Category as CategoryIcon,
  ChevronRight as ChevronRightIcon,
  Extension as ExtensionIcon,
  Layers as LayersIcon,
  Settings as HookIcon, // Using Settings as alternative for Hook icon
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  WaterDrop as WaterDropIcon,
  SportsEsports as SportsEsportsIcon,
  Visibility as VisibilityIcon,
  Factory as FactoryIcon,
  GpsFixed as GpsFixedIcon,
  LockOpen as LockOpenIcon,
  SwapHoriz as SwapHorizIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

interface SidebarItem {
  id: string;
  titleKey: string;
  href: string;
  icon?: React.ReactNode;
  color?: string;
}

interface SidebarSection {
  titleKey: string;
  items: SidebarItem[];
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  color?: string;
}

export interface DocSidebarProps {
  /** When provided, mobile drawer is controlled by parent (e.g. header hamburger). */
  mobileOpen?: boolean;
  /** Called when mobile drawer should close. */
  onMobileClose?: () => void;
  /** When true, do not render the floating mobile trigger; parent opens the drawer. */
  hideMobileTrigger?: boolean;
  /** Called when desktop sidebar is collapsed or expanded so layout can adjust main content. */
  onSidebarOpenChange?: (open: boolean) => void;
}

function DocSidebar({ mobileOpen: controlledMobileOpen, onMobileClose, hideMobileTrigger = false, onSidebarOpenChange }: DocSidebarProps = {}) {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const isControlled = controlledMobileOpen !== undefined && onMobileClose != null;
  const mobileOpen = isControlled ? controlledMobileOpen : internalMobileOpen;
  const setMobileOpen = isControlled ? (open: boolean) => { if (!open) onMobileClose?.(); } : setInternalMobileOpen;
  const prevPathnameRef = useRef(pathname);

  // Notify parent of sidebar open state (for layout margin) when it changes or on mount
  useEffect(() => {
    onSidebarOpenChange?.(sidebarOpen);
  }, [sidebarOpen, onSidebarOpenChange]);

  // Close controlled mobile drawer when route changes (e.g. user clicked a link)
  useEffect(() => {
    if (isControlled && mobileOpen && prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onMobileClose?.();
    } else {
      prevPathnameRef.current = pathname;
    }
  }, [pathname, isControlled, mobileOpen, onMobileClose]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let currentId = "";

      // Find the last section whose top has scrolled past the threshold.
      // This keeps the active item highlighted as you scroll through a section.
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= 150) {
          currentId = section.getAttribute("id") || "";
        }
      });

      if (currentId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveId(hash);
        // Don't auto-scroll on page load - let the browser handle it naturally
        // Only set the activeId for highlighting purposes
      }
    }
  }, []);

  const navigation: SidebarSection[] = useMemo(() => [
    {
      titleKey: "react-patterns-title",
      icon: (
        <Box
          component="svg"
          sx={{
            width: 24,
            height: 24,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 1.5,
          }}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="2" fill="#61DAFB" />
          <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" />
          <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="11" ry="4.2" stroke="#61DAFB" transform="rotate(120 12 12)" />
        </Box>
      ),
      color: "#61DAFB",
      defaultOpen: true,
      items: [
        {
          id: "composition-pattern",
          titleKey: "composition-pattern-title",
          href: "/developer-section/blog/composition-pattern",
          icon: <ExtensionIcon sx={{ fontSize: 20 }} />,
          color: "#4FC3F7"
        },
        {
          id: "compound-components",
          titleKey: "react-patterns-compound-title",
          href: "/developer-section/blog/react-patterns#compound-components",
          icon: <LayersIcon sx={{ fontSize: 20 }} />,
          color: "#AB47BC"
        },
        {
          id: "custom-hooks",
          titleKey: "react-patterns-hooks-title",
          href: "/developer-section/blog/react-patterns#custom-hooks",
          icon: <HookIcon sx={{ fontSize: 20 }} />,
          color: "#26A69A"
        },
        {
          id: "hoc",
          titleKey: "react-patterns-hoc-title",
          href: "/developer-section/blog/react-patterns#hoc",
          icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
          color: "#FF7043"
        },
        {
          id: "render-props",
          titleKey: "react-patterns-render-props-title",
          href: "/developer-section/blog/react-patterns#render-props",
          icon: <CodeIcon sx={{ fontSize: 20 }} />,
          color: "#42A5F5"
        },
        {
          id: "selective-hydration",
          titleKey: "react-patterns-hydration-title",
          href: "/developer-section/blog/react-patterns#selective-hydration",
          icon: <WaterDropIcon sx={{ fontSize: 20 }} />,
          color: "#66BB6A"
        },
      ],
    },
    {
      titleKey: "React Best Practices",
      icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
      color: "#10B981",
      defaultOpen: true,
      items: [
        { id: "eliminating-waterfalls", titleKey: "1. Eliminating Waterfalls", href: "/developer-section/blog/react-best-practices#eliminating-waterfalls", icon: <WaterDropIcon sx={{ fontSize: 20 }} />, color: "#EF4444" },
        { id: "bundle-size", titleKey: "2. Bundle Size", href: "/developer-section/blog/react-best-practices#bundle-size", icon: <CategoryIcon sx={{ fontSize: 20 }} />, color: "#F59E0B" },
        { id: "server-side", titleKey: "3. Server-Side Perf", href: "/developer-section/blog/react-best-practices#server-side", icon: <FactoryIcon sx={{ fontSize: 20 }} />, color: "#3B82F6" },
        { id: "client-data", titleKey: "4. Client-Side Data", href: "/developer-section/blog/react-best-practices#client-data", icon: <SwapHorizIcon sx={{ fontSize: 20 }} />, color: "#8B5CF6" },
        { id: "rerender", titleKey: "5. Re-Renders", href: "/developer-section/blog/react-best-practices#rerender", icon: <GpsFixedIcon sx={{ fontSize: 20 }} />, color: "#EC4899" },
        { id: "rendering", titleKey: "6. Rendering", href: "/developer-section/blog/react-best-practices#rendering", icon: <VisibilityIcon sx={{ fontSize: 20 }} />, color: "#06B6D4" },
        { id: "javascript", titleKey: "7. JS Micro-opts", href: "/developer-section/blog/react-best-practices#javascript", icon: <CodeIcon sx={{ fontSize: 20 }} />, color: "#84CC16" },
        { id: "advanced", titleKey: "8. Advanced Patterns", href: "/developer-section/blog/react-best-practices#advanced", icon: <LayersIcon sx={{ fontSize: 20 }} />, color: "#F97316" },
      ],
    },
    {
      titleKey: "design-patterns-creational-title",
      icon: <FactoryIcon sx={{ fontSize: 24 }} />,
      color: "#9C27B0",
      defaultOpen: true,
      items: [
        { id: "factory-method", titleKey: "design-patterns-factory-method-title", href: "/developer-section/blog/design-patterns#factory-method", icon: <FactoryIcon sx={{ fontSize: 20 }} />, color: "#E91E63" },
        { id: "abstract-factory", titleKey: "design-patterns-abstract-factory-title", href: "/developer-section/blog/design-patterns#abstract-factory", icon: <LayersIcon sx={{ fontSize: 20 }} />, color: "#9C27B0" },
        { id: "builder", titleKey: "design-patterns-builder-title", href: "/developer-section/blog/design-patterns#builder", icon: <AccountTreeIcon sx={{ fontSize: 20 }} />, color: "#FF9800" },
        { id: "prototype", titleKey: "design-patterns-prototype-title", href: "/developer-section/blog/design-patterns#prototype", icon: <ExtensionIcon sx={{ fontSize: 20 }} />, color: "#00BCD4" },
        { id: "singleton", titleKey: "design-patterns-singleton-title", href: "/developer-section/blog/design-patterns#singleton", icon: <GpsFixedIcon sx={{ fontSize: 20 }} />, color: "#4CAF50" },
      ],
    },
    {
      titleKey: "design-patterns-structural-title",
      icon: <LayersIcon sx={{ fontSize: 24 }} />,
      color: "#2196F3",
      defaultOpen: true,
      items: [
        { id: "adapter", titleKey: "design-patterns-adapter-title", href: "/developer-section/blog/design-patterns#adapter", icon: <ExtensionIcon sx={{ fontSize: 20 }} />, color: "#2196F3" },
        { id: "bridge", titleKey: "design-patterns-bridge-title", href: "/developer-section/blog/design-patterns#bridge", icon: <SwapHorizIcon sx={{ fontSize: 20 }} />, color: "#03A9F4" },
        { id: "composite", titleKey: "design-patterns-composite-title", href: "/developer-section/blog/design-patterns#composite", icon: <AccountTreeIcon sx={{ fontSize: 20 }} />, color: "#00BCD4" },
        { id: "decorator", titleKey: "design-patterns-decorator-title", href: "/developer-section/blog/design-patterns#decorator", icon: <LayersIcon sx={{ fontSize: 20 }} />, color: "#009688" },
        { id: "facade", titleKey: "design-patterns-facade-title", href: "/developer-section/blog/design-patterns#facade", icon: <VisibilityIcon sx={{ fontSize: 20 }} />, color: "#4CAF50" },
        { id: "flyweight", titleKey: "design-patterns-flyweight-title", href: "/developer-section/blog/design-patterns#flyweight", icon: <WaterDropIcon sx={{ fontSize: 20 }} />, color: "#8BC34A" },
        { id: "proxy", titleKey: "design-patterns-proxy-title", href: "/developer-section/blog/design-patterns#proxy", icon: <LockOpenIcon sx={{ fontSize: 20 }} />, color: "#FF9800" },
      ],
    },
    {
      titleKey: "design-patterns-behavioral-title",
      icon: <AccountTreeIcon sx={{ fontSize: 24 }} />,
      color: "#673AB7",
      defaultOpen: true,
      items: [
        { id: "chain-of-responsibility", titleKey: "design-patterns-chain-title", href: "/developer-section/blog/design-patterns#chain-of-responsibility", icon: <TrendingUpIcon sx={{ fontSize: 20 }} />, color: "#673AB7" },
        { id: "command", titleKey: "design-patterns-command-title", href: "/developer-section/blog/design-patterns#command", icon: <CodeIcon sx={{ fontSize: 20 }} />, color: "#7C4DFF" },
        { id: "iterator", titleKey: "design-patterns-iterator-title", href: "/developer-section/blog/design-patterns#iterator", icon: <SwapHorizIcon sx={{ fontSize: 20 }} />, color: "#9C27B0" },
        { id: "mediator", titleKey: "design-patterns-mediator-title", href: "/developer-section/blog/design-patterns#mediator", icon: <GpsFixedIcon sx={{ fontSize: 20 }} />, color: "#E91E63" },
        { id: "memento", titleKey: "design-patterns-memento-title", href: "/developer-section/blog/design-patterns#memento", icon: <LockOpenIcon sx={{ fontSize: 20 }} />, color: "#00BCD4" },
        { id: "observer", titleKey: "design-patterns-observer-title", href: "/developer-section/blog/design-patterns#observer", icon: <VisibilityIcon sx={{ fontSize: 20 }} />, color: "#009688" },
        { id: "state", titleKey: "design-patterns-state-title", href: "/developer-section/blog/design-patterns#state", icon: <SportsEsportsIcon sx={{ fontSize: 20 }} />, color: "#4CAF50" },
        { id: "strategy", titleKey: "design-patterns-strategy-title", href: "/developer-section/blog/design-patterns#strategy", icon: <SportsEsportsIcon sx={{ fontSize: 20 }} />, color: "#8BC34A" },
        { id: "template-method", titleKey: "design-patterns-template-method-title", href: "/developer-section/blog/design-patterns#template-method", icon: <CodeIcon sx={{ fontSize: 20 }} />, color: "#FF9800" },
        { id: "visitor", titleKey: "design-patterns-visitor-title", href: "/developer-section/blog/design-patterns#visitor", icon: <ExtensionIcon sx={{ fontSize: 20 }} />, color: "#F44336" },
      ],
    },
    {
      titleKey: "solid-title",
      icon: <CategoryIcon sx={{ fontSize: 24 }} />,
      color: "#3F51B5",
      defaultOpen: true,
      items: [
        {
          id: "srp",
          titleKey: "solid-srp-title",
          href: "/developer-section/blog/solid-principles#srp",
          icon: <GpsFixedIcon sx={{ fontSize: 20 }} />,
          color: "#F44336"
        },
        {
          id: "ocp",
          titleKey: "Open/Closed Principle",
          href: "/developer-section/blog/solid-principles#ocp",
          icon: <LockOpenIcon sx={{ fontSize: 20 }} />,
          color: "#4CAF50"
        },
        {
          id: "lsp",
          titleKey: "Liskov Substitution Principle",
          href: "/developer-section/blog/solid-principles#lsp",
          icon: <SwapHorizIcon sx={{ fontSize: 20 }} />,
          color: "#FFC107"
        },
      ],
    },
    {
      titleKey: "Advanced React Hooks",
      icon: <HookIcon sx={{ fontSize: 24 }} />,
      color: "#00BCD4",
      defaultOpen: true,
      items: [
        {
          id: "use-transition",
          titleKey: "useTransition",
          href: "/developer-section/blog/advanced-react-hooks#use-transition",
          icon: <SwapHorizIcon sx={{ fontSize: 20 }} />,
          color: "#00BCD4"
        },
        {
          id: "use-layout-effect",
          titleKey: "useLayoutEffect",
          href: "/developer-section/blog/advanced-react-hooks#use-layout-effect",
          icon: <VisibilityIcon sx={{ fontSize: 20 }} />,
          color: "#4CAF50"
        },
        {
          id: "callback-ref",
          titleKey: "useCallback As Ref",
          href: "/developer-section/blog/advanced-react-hooks#callback-ref",
          icon: <CodeIcon sx={{ fontSize: 20 }} />,
          color: "#FF9800"
        },
        {
          id: "modern-architecture",
          titleKey: "Async React Router",
          href: "/developer-section/blog/advanced-react-hooks#modern-architecture",
          icon: <AccountTreeIcon sx={{ fontSize: 20 }} />,
          color: "#9C27B0"
        },
        {
          id: "react-portals",
          titleKey: "React Portals",
          href: "/developer-section/blog/advanced-react-hooks#react-portals",
          icon: <WaterDropIcon sx={{ fontSize: 20 }} />,
          color: "#2196F3"
        },
        {
          id: "error-boundaries",
          titleKey: "Error Boundaries",
          href: "/developer-section/blog/advanced-react-hooks#error-boundaries",
          icon: <FactoryIcon sx={{ fontSize: 20 }} />,
          color: "#F44336"
        },
        {
          id: "keys-explained",
          titleKey: "Keys Explained",
          href: "/developer-section/blog/advanced-react-hooks#keys-explained",
          icon: <GpsFixedIcon sx={{ fontSize: 20 }} />,
          color: "#E91E63"
        },
        {
          id: "event-listeners",
          titleKey: "Event Listeners",
          href: "/developer-section/blog/advanced-react-hooks#event-listeners",
          icon: <SportsEsportsIcon sx={{ fontSize: 20 }} />,
          color: "#FF5722"
        },
        {
          id: "use-id",
          titleKey: "useId",
          href: "/developer-section/blog/advanced-react-hooks#use-id",
          icon: <LockOpenIcon sx={{ fontSize: 20 }} />,
          color: "#00ACC1"
        },
        {
          id: "use-deferred-value",
          titleKey: "useDeferredValue",
          href: "/developer-section/blog/advanced-react-hooks#use-deferred-value",
          icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
          color: "#8BC34A"
        },
      ],
    },
    {
      titleKey: "React Query",
      icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
      color: "#FF6B6B",
      defaultOpen: true,
      items: [
        {
          id: "optimistic-updates",
          titleKey: "Optimistic Updates",
          href: "/developer-section/blog/react-query#optimistic-updates",
          icon: <SwapHorizIcon sx={{ fontSize: 20 }} />,
          color: "#FF6B6B"
        },
        {
          id: "search-grid",
          titleKey: "Search Grid (Cancellation)",
          href: "/developer-section/blog/react-query#search-grid",
          icon: <CodeIcon sx={{ fontSize: 20 }} />,
          color: "#4ECDC4"
        },
        {
          id: "infinite-feed",
          titleKey: "Infinite Feed (Data Transform)",
          href: "/developer-section/blog/react-query#infinite-feed",
          icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
          color: "#95E1D3"
        },
      ],
    },
    {
      titleKey: "Advanced Patterns",
      icon: <LayersIcon sx={{ fontSize: 24 }} />,
      color: "#9B59B6",
      defaultOpen: true,
      items: [
        {
          id: "render-props",
          titleKey: "Render Props (Headless)",
          href: "/developer-section/blog/advanced-patterns#render-props",
          icon: <CodeIcon sx={{ fontSize: 20 }} />,
          color: "#9B59B6"
        },
        {
          id: "wrapper-components",
          titleKey: "Wrapper Components (Guard)",
          href: "/developer-section/blog/advanced-patterns#wrapper-components",
          icon: <AccountTreeIcon sx={{ fontSize: 20 }} />,
          color: "#3498DB"
        },
        {
          id: "polymorphic-components",
          titleKey: "Polymorphic Components",
          href: "/developer-section/blog/advanced-patterns#polymorphic-components",
          icon: <ExtensionIcon sx={{ fontSize: 20 }} />,
          color: "#E74C3C"
        },
      ],
    },
    {
      titleKey: "State Management",
      icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
      color: "#10B981",
      defaultOpen: true,
      items: [
        {
          id: "use-immer",
          titleKey: "useImmer (Immutable Updates)",
          href: "/developer-section/blog/state-management#use-immer",
          icon: <SwapHorizIcon sx={{ fontSize: 20 }} />,
          color: "#10B981"
        },
        {
          id: "use-immer-reducer",
          titleKey: "useImmerReducer",
          href: "/developer-section/blog/state-management#use-immer-reducer",
          icon: <CodeIcon sx={{ fontSize: 20 }} />,
          color: "#3B82F6"
        },
        {
          id: "remote-state",
          titleKey: "Remote State (TanStack Query)",
          href: "/developer-section/blog/state-management#remote-state",
          icon: <ExtensionIcon sx={{ fontSize: 20 }} />,
          color: "#8B5CF6"
        },
        {
          id: "shared-state-zustand",
          titleKey: "Shared State (Zustand)",
          href: "/developer-section/blog/state-management#shared-state-zustand",
          icon: <AccountTreeIcon sx={{ fontSize: 20 }} />,
          color: "#F59E0B"
        },
        {
          id: "url-state",
          titleKey: "URL State (nuqs)",
          href: "/developer-section/blog/state-management#url-state",
          icon: <GpsFixedIcon sx={{ fontSize: 20 }} />,
          color: "#EF4444"
        },
      ],
    },
    {
      titleKey: "React Design Patterns 2025",
      icon: <CategoryIcon sx={{ fontSize: 24 }} />,
      color: "#6366F1",
      defaultOpen: true,
      items: [
        {
          id: "modern-component-patterns",
          titleKey: "Modern Component Patterns",
          href: "/developer-section/blog/react-design-patterns#modern-component-patterns",
          icon: <CodeIcon sx={{ fontSize: 20 }} />,
          color: "#6366F1"
        },
        {
          id: "custom-hooks",
          titleKey: "Custom Hooks",
          href: "/developer-section/blog/react-design-patterns#custom-hooks",
          icon: <HookIcon sx={{ fontSize: 20 }} />,
          color: "#8B5CF6"
        },
        {
          id: "context-api",
          titleKey: "Context API",
          href: "/developer-section/blog/react-design-patterns#context-api",
          icon: <AccountTreeIcon sx={{ fontSize: 20 }} />,
          color: "#EC4899"
        },
        {
          id: "typescript-patterns",
          titleKey: "TypeScript Patterns",
          href: "/developer-section/blog/react-design-patterns#typescript-patterns",
          icon: <ExtensionIcon sx={{ fontSize: 20 }} />,
          color: "#3B82F6"
        },
        {
          id: "react-19-features",
          titleKey: "React 19 Features",
          href: "/developer-section/blog/react-design-patterns#react-19-features",
          icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
          color: "#10B981"
        },
        {
          id: "modern-frameworks",
          titleKey: "Modern Frameworks",
          href: "/developer-section/blog/react-design-patterns#modern-frameworks",
          icon: <LayersIcon sx={{ fontSize: 20 }} />,
          color: "#F59E0B"
        },
        {
          id: "component-libraries",
          titleKey: "Component Libraries",
          href: "/developer-section/blog/react-design-patterns#component-libraries",
          icon: <VisibilityIcon sx={{ fontSize: 20 }} />,
          color: "#EF4444"
        },
      ],
    },
    {
      titleKey: "Kotlin Multiplatform",
      icon: <CodeIcon sx={{ fontSize: 24 }} />,
      color: "#7C3AED",
      defaultOpen: true,
      items: [
        {
          id: "unidirectional-state",
          titleKey: "Unidirectional State",
          href: "/developer-section/blog/kotlin-multiplatform#unidirectional-state",
          icon: <LayersIcon sx={{ fontSize: 20 }} />,
          color: "#7C3AED"
        },
        {
          id: "platform-adapter",
          titleKey: "Expect/Actual UI Adapter",
          href: "/developer-section/blog/kotlin-multiplatform#platform-adapter",
          icon: <ExtensionIcon sx={{ fontSize: 20 }} />,
          color: "#06B6D4"
        },
        {
          id: "adaptive-layouts",
          titleKey: "Adaptive Layouts",
          href: "/developer-section/blog/kotlin-multiplatform#adaptive-layouts",
          icon: <CategoryIcon sx={{ fontSize: 20 }} />,
          color: "#22C55E"
        },
        {
          id: "shared-navigation",
          titleKey: "Type-safe Navigation",
          href: "/developer-section/blog/kotlin-multiplatform#shared-navigation",
          icon: <AccountTreeIcon sx={{ fontSize: 20 }} />,
          color: "#6366F1"
        },
        {
          id: "design-system",
          titleKey: "Design System Bridge",
          href: "/developer-section/blog/kotlin-multiplatform#design-system",
          icon: <VisibilityIcon sx={{ fontSize: 20 }} />,
          color: "#F59E0B"
        },
        {
          id: "compose-resources",
          titleKey: "Compose Resources",
          href: "/developer-section/blog/kotlin-multiplatform#compose-resources",
          icon: <WaterDropIcon sx={{ fontSize: 20 }} />,
          color: "#0EA5E9"
        },
        {
          id: "native-interactions",
          titleKey: "Native Back & Gestures",
          href: "/developer-section/blog/kotlin-multiplatform#native-interactions",
          icon: <SwapHorizIcon sx={{ fontSize: 20 }} />,
          color: "#F97316"
        },
      ],
    },
    {
      titleKey: "Kotlin Coroutines",
      icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
      color: "#8B5CF6",
      defaultOpen: false,
      items: [
        { id: "module-1-foundations", titleKey: "Module 1: Foundations", href: "/developer-section/blog/kotlin-coroutines#module-1-foundations", icon: <CodeIcon sx={{ fontSize: 20 }} />, color: "#8B5CF6" },
        { id: "module-2-async", titleKey: "Module 2: Async & Parallelism", href: "/developer-section/blog/kotlin-coroutines#module-2-async", icon: <SwapHorizIcon sx={{ fontSize: 20 }} />, color: "#7C3AED" },
        { id: "module-3-context-cancellation", titleKey: "Module 3: Context & Cancellation", href: "/developer-section/blog/kotlin-coroutines#module-3-context-cancellation", icon: <LockOpenIcon sx={{ fontSize: 20 }} />, color: "#6D28D9" },
        { id: "module-4-channels", titleKey: "Module 4: Channels", href: "/developer-section/blog/kotlin-coroutines#module-4-channels", icon: <WaterDropIcon sx={{ fontSize: 20 }} />, color: "#5B21B6" },
        { id: "module-5-fan-out-in", titleKey: "Module 5: Fan-Out & Fan-In", href: "/developer-section/blog/kotlin-coroutines#module-5-fan-out-in", icon: <AccountTreeIcon sx={{ fontSize: 20 }} />, color: "#4C1D95" },
        { id: "module-6-select", titleKey: "Module 6: Select Expression", href: "/developer-section/blog/kotlin-coroutines#module-6-select", icon: <GpsFixedIcon sx={{ fontSize: 20 }} />, color: "#3B0764" },
        { id: "example-a-non-blocking", titleKey: "Example A: Non-Blocking", href: "/developer-section/blog/kotlin-coroutines#example-a-non-blocking", icon: <VisibilityIcon sx={{ fontSize: 20 }} />, color: "#8B5CF6" },
        { id: "example-b-async-trap", titleKey: "Example B: Async Trap", href: "/developer-section/blog/kotlin-coroutines#example-b-async-trap", icon: <VisibilityIcon sx={{ fontSize: 20 }} />, color: "#7C3AED" },
        { id: "example-c-scope-hierarchy", titleKey: "Example C: Scope & Hierarchy", href: "/developer-section/blog/kotlin-coroutines#example-c-scope-hierarchy", icon: <VisibilityIcon sx={{ fontSize: 20 }} />, color: "#6D28D9" },
        { id: "challenge-retry", titleKey: "Challenge 1.5: Retry", href: "/developer-section/blog/kotlin-coroutines#challenge-retry", icon: <SportsEsportsIcon sx={{ fontSize: 20 }} />, color: "#F59E0B" },
        { id: "capstone-stock-monitor", titleKey: "Capstone: Stock Monitor", href: "/developer-section/blog/kotlin-coroutines#capstone-stock-monitor", icon: <FactoryIcon sx={{ fontSize: 20 }} />, color: "#A78BFA" },
        { id: "additional-references", titleKey: "Additional references", href: "/developer-section/blog/kotlin-coroutines#additional-references", icon: <CodeIcon sx={{ fontSize: 20 }} />, color: "#6D28D9" },
      ],
    },
    {
      titleKey: "Courses",
      icon: <SchoolIcon sx={{ fontSize: 24 }} />,
      color: "#61DAFB",
      defaultOpen: true,
      items: [
        { id: "react-course", titleKey: "React Course", href: "/developer-section/react-course", icon: <ExtensionIcon sx={{ fontSize: 20 }} />, color: "#61DAFB" },
        { id: "typescript-course", titleKey: "TypeScript Course", href: "/developer-section/typescript-course", icon: <CodeIcon sx={{ fontSize: 20 }} />, color: "#3178c6" },
        { id: "css-course", titleKey: "CSS Course", href: "/developer-section/css-course", icon: <WaterDropIcon sx={{ fontSize: 20 }} />, color: "#F5549B" },
      ],
    },
  ], []);

  useEffect(() => {
    const newExpanded = new Set<string>();
    navigation.forEach((section, idx) => {
      const hasActiveItem = section.items.some((item) => {
        // Get the base path without hash
        const itemBasePath = item.href.split("#")[0];
        // Normalize paths for comparison (remove leading/trailing slashes)
        const normalizedItemPath = itemBasePath.replace(/^\/+|\/+$/g, '');
        const normalizedPathname = pathname.replace(/^\/+|\/+$/g, '');
        // Check if pathname exactly matches or starts with the item path
        // This prevents false matches (e.g., /blog/composition matching /blog/nextjs-best-practices)
        return normalizedPathname === normalizedItemPath ||
          normalizedPathname.startsWith(normalizedItemPath + '/');
      });
      if (hasActiveItem || section.defaultOpen) {
        newExpanded.add(`section-${idx}`);
      }
    });
    setExpandedSections(newExpanded);
  }, [pathname, navigation]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  /** When collapsed: expand sidebar and open this section. When open: just toggle section. */
  const handleSectionHeaderClick = (sectionKey: string) => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
      onSidebarOpenChange?.(true);
      setExpandedSections((prev) => new Set(prev).add(sectionKey));
    } else {
      toggleSection(sectionKey);
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        width: sidebarOpen ? 320 : 80,
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: alpha("#1a1a2e", 0.95),
        backdropFilter: "blur(20px)",
        borderRight: `1px solid ${alpha("#ffffff", 0.1)}`,
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      {/* Toggle Button — visible header row so expand/collapse is easy to find */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarOpen ? "space-between" : "center",
          p: 1.5,
          minHeight: 56,
          flexShrink: 0,
          borderBottom: `1px solid ${alpha("#ffffff", 0.1)}`,
          bgcolor: alpha("#000000", 0.2),
        }}
      >
        {sidebarOpen && (
          <Typography
            variant="h6"
            sx={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.5px",
            }}
          >
            {t("nav-blog") || "Documentation"}
          </Typography>
        )}
        <IconButton
          onClick={() => {
            const next = !sidebarOpen;
            setSidebarOpen(next);
            onSidebarOpenChange?.(next);
          }}
          aria-label={sidebarOpen ? (t("sidebar-collapse") || "Collapse sidebar") : (t("sidebar-expand") || "Expand sidebar")}
          title={sidebarOpen ? (t("sidebar-collapse") || "Collapse sidebar") : (t("sidebar-expand") || "Expand sidebar")}
          sx={{
            color: "#ffffff",
            bgcolor: alpha("#ffffff", 0.08),
            border: `1px solid ${alpha("#ffffff", 0.15)}`,
            "&:hover": {
              bgcolor: alpha("#ffffff", 0.15),
              borderColor: alpha("#ffffff", 0.25),
            },
          }}
        >
          {sidebarOpen ? <ChevronRightIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Navigation Content */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0, // Important for flex children to allow scrolling
          overflowY: "auto",
          overflowX: "hidden",
          px: sidebarOpen ? 2 : 1,
          py: 3,
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha("#ffffff", 0.2),
            borderRadius: "4px",
            "&:hover": {
              background: alpha("#ffffff", 0.3),
            },
          },
        }}
      >
        <List sx={{ p: 0, gap: 3, display: "flex", flexDirection: "column" }}>
          {navigation.map((section, idx) => {
            const sectionKey = `section-${idx}`;
            const isExpanded = expandedSections.has(sectionKey);
            const sectionTitle = t(section.titleKey) !== section.titleKey ? t(section.titleKey) : section.titleKey;
            const hasActiveItem = section.items.some((item) => {
              const itemBasePath = item.href.split("#")[0];
              const normalizedItemPath = itemBasePath.replace(/^\/+|\/+$/g, '');
              const normalizedPathname = pathname.replace(/^\/+|\/+$/g, '');
              const isCurrentPage = normalizedPathname === normalizedItemPath ||
                normalizedPathname.startsWith(normalizedItemPath + '/');
              const isActive = activeId === item.id;
              return isCurrentPage && isActive;
            });

            return (
              <Box
                key={sectionKey}
                sx={{
                  mb: 4,
                  borderRadius: 2.5,
                  bgcolor: hasActiveItem
                    ? alpha(section.color || "#61DAFB", 0.15)
                    : alpha("#ffffff", 0.03),
                  border: `1px solid ${hasActiveItem
                    ? alpha(section.color || "#61DAFB", 0.3)
                    : alpha("#ffffff", 0.08)
                    }`,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Section Header */}
                <ListItemButton
                  onClick={() => handleSectionHeaderClick(sectionKey)}
                  title={!sidebarOpen ? `${sectionTitle} — ${t("sidebar-expand") || "Click to expand"}` : undefined}
                  sx={{
                    py: 2.5,
                    px: sidebarOpen ? 2.5 : 1.5,
                    minHeight: 64,
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    "&:hover": {
                      bgcolor: alpha(section.color || "#61DAFB", 0.1),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: sidebarOpen ? 40 : "auto",
                      color: hasActiveItem
                        ? section.color || "#61DAFB"
                        : alpha("#ffffff", 0.7),
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    {section.icon}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: hasActiveItem
                                ? section.color || "#61DAFB"
                                : "#ffffff",
                              fontSize: "0.9rem",
                            }}
                          >
                            {sectionTitle}
                          </Typography>
                        }
                      />
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRightIcon
                          sx={{
                            color: hasActiveItem
                              ? section.color || "#61DAFB"
                              : alpha("#ffffff", 0.5),
                            fontSize: 20,
                          }}
                        />
                      </motion.div>
                    </>
                  )}
                </ListItemButton>

                {/* Section Items */}
                <Collapse in={isExpanded && sidebarOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pb: 1 }}>
                    {section.items.map((item, itemIdx) => {
                      const isActive = activeId === item.id;
                      const itemBasePath = item.href.split("#")[0];
                      const normalizedItemPath = itemBasePath.replace(/^\/+|\/+$/g, '');
                      const normalizedPathname = pathname.replace(/^\/+|\/+$/g, '');
                      const isCurrentPage = normalizedPathname === normalizedItemPath ||
                        normalizedPathname.startsWith(normalizedItemPath + '/');
                      const isItemActive = isCurrentPage && isActive;

                      return (
                        <Link
                          key={item.id}
                          href={createLocalizedPath(item.href)}
                          style={{ textDecoration: "none" }}
                          onClick={() => setActiveId(item.id)}
                        >
                          <ListItemButton
                            sx={{
                              py: 2,
                              px: sidebarOpen ? 3.5 : 1.5,
                              ml: sidebarOpen ? 1.5 : 0,
                              mr: sidebarOpen ? 1.5 : 0,
                              mb: 1,
                              justifyContent: sidebarOpen ? "flex-start" : "center",
                              borderRadius: 1.5,
                              bgcolor: isItemActive
                                ? alpha(item.color || "#4FC3F7", 0.2)
                                : "transparent",
                              borderLeft: isItemActive
                                ? `3px solid ${item.color || "#4FC3F7"}`
                                : "3px solid transparent",
                              "&:hover": {
                                bgcolor: isItemActive
                                  ? alpha(item.color || "#4FC3F7", 0.25)
                                  : alpha("#ffffff", 0.08),
                                borderLeft: `3px solid ${isItemActive
                                  ? item.color || "#4FC3F7"
                                  : alpha("#ffffff", 0.3)
                                  }`,
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: sidebarOpen ? 36 : "auto",
                                color: isItemActive
                                  ? item.color || "#4FC3F7"
                                  : alpha("#ffffff", 0.6),
                                justifyContent: "center",
                                display: "flex",
                              }}
                            >
                              {item.icon}
                            </ListItemIcon>
                            {sidebarOpen && (
                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: isItemActive ? 600 : 400,
                                      color: isItemActive
                                        ? item.color || "#4FC3F7"
                                        : alpha("#ffffff", 0.8),
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {t(item.titleKey) !== item.titleKey
                                      ? t(item.titleKey)
                                      : item.titleKey}
                                  </Typography>
                                }
                              />
                            )}
                            {sidebarOpen && isItemActive && (
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  bgcolor: item.color || "#4FC3F7",
                                  ml: 1,
                                }}
                              />
                            )}
                          </ListItemButton>
                        </Link>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar — starts below header so toggle is visible */}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "fixed",
          left: 0,
          top: 64,
          height: "calc(100vh - 64px)",
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer — trigger hidden when hideMobileTrigger (header hamburger opens it) */}
      <Box sx={{ display: { xs: "block", lg: "none" } }}>
        {!hideMobileTrigger && (
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              position: "fixed",
              top: 100,
              left: 16,
              zIndex: 1300,
              bgcolor: alpha("#1a1a2e", 0.95),
              color: "#ffffff",
              "&:hover": {
                bgcolor: alpha("#1a1a2e", 1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => {
            if (isControlled) onMobileClose?.();
            else setInternalMobileOpen(false);
          }}
          PaperProps={{
            sx: {
              width: 320,
              bgcolor: alpha("#1a1a2e", 0.95),
              backdropFilter: "blur(20px)",
            },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => {
                if (isControlled) onMobileClose?.();
                else setInternalMobileOpen(false);
              }}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 1,
                color: "#ffffff",
              }}
            >
              <CloseIcon />
            </IconButton>
            {sidebarContent}
          </Box>
        </Drawer>
      </Box>
    </>
  );
}

export default DocSidebar;
export { DocSidebar };
