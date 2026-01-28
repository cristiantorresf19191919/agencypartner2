"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor , FullscreenSection } from "@/components/ui";
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

      <FullscreenSection id="fiber-architecture" title="Fiber Architecture" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>1. Fiber Architecture</Heading>
              <Text className={styles.sectionDescription}>
                React Fiber is the reconciliation engine that enables concurrent rendering.
              </Text>
            </div>
            <CodeEditor
              code={`// Fiber is React's internal data structure
// Each component has a Fiber node representing its work
// Fiber enables:
// - Interruptible rendering
// - Priority-based updates
// - Time slicing
// - Concurrent features`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </FullscreenSection>
    </BlogContentLayout>
  );
}

