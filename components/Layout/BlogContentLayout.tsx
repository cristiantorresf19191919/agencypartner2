"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import styles from "./BlogContentLayout.module.css";

// Dynamically import DocSidebar with error boundary
const DocSidebar = dynamic(
  () => import("@/components/Sidebar/DocSidebar").catch((err) => {
    console.error("Failed to load DocSidebar:", err);
    // Return a fallback component
    return { default: () => <div style={{ width: 320, minHeight: 400 }} /> };
  }),
  { 
    ssr: false,
    loading: () => <div style={{ width: 320, minHeight: 400, backgroundColor: 'transparent' }} />
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

export function BlogContentLayout({ children }: BlogContentLayoutProps) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <main>
        <DeveloperHeader />
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
