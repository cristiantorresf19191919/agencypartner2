"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function MicroFrontendsPage() {
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
          <li className={styles.breadcrumbCurrent}>Micro-Frontends</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>Micro-Frontends Architecture</Heading>
        <Text className={styles.subtitle}>
          Build scalable micro-frontend architectures: Module Federation, single-spa, independent deployments, shared dependencies, and team autonomy patterns.
        </Text>
      </div>

      <section id="module-federation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>{"📦"} 1. Module Federation</Heading>
              <Text className={styles.sectionDescription}>
                {"Think of Module Federation as a teleporter for your code! 🌀 Share components, utilities, and even entire features across independently deployed apps — no monorepo required. It's the ultimate team autonomy superpower! 💪"}
              </Text>
              <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🟠"} <strong>Impact: HIGH</strong> — {"Module Federation is the backbone of scalable micro-frontend architectures — master it and unlock true team independence! 🔓"}
                </Text>
              </div>
              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> Webpack Module Federation {"•"} Shared Dependencies {"•"} Remote Containers {"•"} Independent Deployments
                </Text>
              </div>
            </div>
            <CodeEditor
              code={`// Module Federation enables sharing code
// between independently deployed applications
// See code-splitting page for detailed examples`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

