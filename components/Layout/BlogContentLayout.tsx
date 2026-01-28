"use client";

import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import SearchSection from "@/components/Search/SearchSection";
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
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <main>
        <DeveloperHeader />
        <SearchSection />
        <div className={styles.blogLayout}>
          <div className={styles.backgroundEffects}>
            <div className={styles.radialGradient} />
          </div>
          <div className={styles.container}>
            <div className={styles.contentWrapper}>
              {/* Sidebar - dynamically loaded client-side only */}
              <DocSidebar />

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
