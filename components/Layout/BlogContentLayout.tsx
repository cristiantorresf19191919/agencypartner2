"use client";

import React, { ReactNode, useState, useMemo, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import SearchSection from "@/components/Search/SearchSection";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TableOfContentsEntry } from "@/components/Sidebar/DocSidebar";
import { getRelatedBlogPosts } from "@/lib/blogCategories";
import styles from "./BlogContentLayout.module.css";

// Dynamically import DocSidebar with error boundary
const DocSidebar = dynamic(
  () => import("@/components/Sidebar/DocSidebar"),
  {
    ssr: false,
    loading: () => null
  }
);

interface BlogContentLayoutProps {
  children: ReactNode;
  /** When provided, the sidebar shows a table of contents for the current page and highlights the section in view. */
  tableOfContents?: TableOfContentsEntry[];
}

// Create Material-UI theme for dark mode
const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a06af9",
    },
    background: {
      default: "#0a0a0f",
      paper: "#1a1a2e",
    },
  },
});

function buildTocFromDom(container: HTMLElement | null): TableOfContentsEntry[] {
  if (!container) return [];
  const entries: TableOfContentsEntry[] = [];
  const nodes = container.querySelectorAll("section[id], h2[id], h3[id]");
  nodes.forEach((el) => {
    const id = el.getAttribute("id");
    if (!id) return;
    let label: string;
    let level: number;
    if (el.tagName === "SECTION") {
      const heading = el.querySelector("h2, h3, [class*='sectionTitle']");
      label = (heading?.textContent?.trim()) || id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      level = 1;
    } else {
      label = el.textContent?.trim() ?? id;
      level = el.tagName === "H2" ? 1 : 2;
    }
    entries.push({ id, label, level });
  });
  return entries;
}

function getBlogSlugFromPath(pathname: string | null): string | null {
  if (!pathname) return null;
  const match = pathname.match(/\/developer-section\/blog\/([^/]+)/);
  return match ? match[1] : null;
}

function BlogContentLayout({ children, tableOfContents }: BlogContentLayoutProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [autoTableOfContents, setAutoTableOfContents] = useState<TableOfContentsEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Auto-extract TOC from main content (section[id], h2[id], h3[id]) when pathname changes
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      const toc = buildTocFromDom(mainContentRef.current);
      setAutoTableOfContents(toc);
    }, 150);
    return () => clearTimeout(timer);
  }, [pathname, mounted]);

  const effectiveToc = tableOfContents && tableOfContents.length > 0 ? tableOfContents : autoTableOfContents;
  const blogSlug = getBlogSlugFromPath(pathname);
  const relatedPosts = useMemo(
    () => (blogSlug ? getRelatedBlogPosts(blogSlug, 5) : []),
    [blogSlug]
  );

  const pageTitle = useMemo(() => {
    const normalized = pathname?.replace(/^\/[a-z]{2}\//, "/") ?? "";
    if (normalized.includes("/developer-section/blog") || normalized === "/developer-section/blog") return t("nav-blog");
    if (normalized.includes("/developer-section/challenges") || normalized === "/developer-section/challenges") return t("nav-challenges");
    if (normalized.includes("/developer-section")) return t("nav-developer-section");
    return t("nav-blog");
  }, [pathname, t]);

  // Before mount: render same structure without MUI so server and first client render match.
  // Avoids hydration error from Emotion/CssBaseline producing different HTML on server vs client.
  if (!mounted) {
    return (
      <main>
        <DeveloperHeader
          pageTitle={pageTitle}
          onOpenDrawer={() => setMobileDrawerOpen(true)}
          drawerOpen={mobileDrawerOpen}
        />
        <SearchSection />
        <div className={styles.blogLayout}>
          <div className={styles.backgroundEffects}>
            <div className={styles.radialGradient} />
          </div>
          <div className={styles.container}>
            <div className={styles.contentWrapper}>
              <div className={styles.mainContent}>
                {children}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <main>
        <DeveloperHeader
          pageTitle={pageTitle}
          onOpenDrawer={() => setMobileDrawerOpen(true)}
          drawerOpen={mobileDrawerOpen}
        />
        <SearchSection />
        <div className={styles.blogLayout}>
          <div className={styles.backgroundEffects}>
            <div className={styles.radialGradient} />
          </div>
          <div className={styles.container}>
            <div className={`${styles.contentWrapper} ${!sidebarOpen ? styles.sidebarCollapsed : ""}`}>
              <DocSidebar
                mobileOpen={mobileDrawerOpen}
                onMobileClose={() => setMobileDrawerOpen(false)}
                hideMobileTrigger
                onSidebarOpenChange={setSidebarOpen}
                tableOfContents={effectiveToc}
                relatedPosts={relatedPosts}
              />

              {/* Main Content — ref for auto TOC extraction */}
              <div ref={mainContentRef} className={styles.mainContent}>
                {children}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default BlogContentLayout;
