"use client";

import React, { ReactNode, useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import SearchSection from "@/components/Search/SearchSection";
import { useLanguage } from "@/contexts/LanguageContext";
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

function BlogContentLayout({ children }: BlogContentLayoutProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Defer MUI (ThemeProvider + CssBaseline) until after client mount to avoid
  // hydration mismatch: Emotion/CssBaseline can produce different HTML on server vs client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
              />

              {/* Main Content */}
              <div className={styles.mainContent}>
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
