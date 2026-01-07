"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function AnimationsPage() {
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
          <li className={styles.breadcrumbCurrent}>Animations</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>Animation & Transition Patterns</Heading>
        <Text className={styles.subtitle}>
          Smooth animations in React: Framer Motion patterns, React Spring, layout animations, gesture handling, and performance-optimized animations for production applications.
        </Text>
      </div>

      <section id="framer-motion" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>1. Framer Motion Patterns</Heading>
              <Text className={styles.sectionDescription}>
                Use Framer Motion for declarative animations with excellent performance.
              </Text>
            </div>
            <CodeEditor
              code={`// ✅ Basic animations
import { motion } from 'framer-motion';

function AnimatedBox() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  );
}

// ✅ Layout animations
function LayoutAnimation() {
  return (
    <motion.div layout>
      <motion.h2 layout>Title</motion.h2>
      <motion.p layout>Content</motion.p>
    </motion.div>
  );
}

// ✅ Gesture handling
function DraggableCard() {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ scale: 1.1 }}
      onDragEnd={(event, info) => {
        console.log('Drag ended', info.point);
      }}
    >
      Drag me
    </motion.div>
  );
}`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

