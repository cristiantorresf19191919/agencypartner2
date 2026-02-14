"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function ReactInternalsPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>React Internals</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>React Internals & Advanced Concepts</Heading>
        <Text className={styles.subtitle}>
          Understand React's internals: Fiber architecture, reconciliation algorithm, render phases, commit phases, priority system, event system, hooks implementation, and scheduler.
        </Text>
      </div>

      <section id="fiber-architecture" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>{"🧬"} 1. Fiber Architecture</Heading>
              <Text className={styles.sectionDescription}>
                {"Ever wonder what's actually happening under React's hood? 🔧 Fiber is the genius reconciliation engine that makes concurrent rendering possible. It breaks rendering into tiny, interruptible chunks so your UI never freezes — even when processing heavy updates. It's basically React's secret superpower!"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxRed} mt-3 mb-4`}>
              <Text className={styles.infoText}>
                {"🔴"} <strong>Impact: CRITICAL</strong> — {"Understanding Fiber is what separates senior devs from everyone else — it's the foundation of ALL concurrent features! 🧠"}
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
              <Text className={styles.infoText}>
                {"📋"} <strong>In this section:</strong> Fiber Nodes • Interruptible Rendering • Priority-Based Updates • Time Slicing
              </Text>
            </div>
            <CodeEditor
              code={`// Fiber is React's internal data structure
// Each component has a Fiber node representing its work
// Fiber enables: Interruptible rendering, Priority-based updates, Time slicing, Concurrent features

function App() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Fiber architecture</h2>
      <ul>
        <li>Interruptible rendering</li>
        <li>Priority-based updates</li>
        <li>Time slicing</li>
        <li>Concurrent features</li>
      </ul>
    </div>
  );
}
export default App;`}
              language="tsx"
              readOnly={false}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

