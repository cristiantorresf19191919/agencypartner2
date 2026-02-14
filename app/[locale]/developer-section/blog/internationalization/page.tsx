"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function InternationalizationPage() {
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
          <li className={styles.breadcrumbCurrent}>Internationalization</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>Internationalization (i18n) Patterns</Heading>
        <Text className={styles.subtitle}>
          Build multilingual React applications: react-i18next patterns, date/time formatting, RTL support, locale management, translation strategies, pluralization, and currency formatting.
        </Text>
      </div>

      <section id="react-i18next" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>{"🌍"} 1. react-i18next Patterns</Heading>
              <Text className={styles.sectionDescription}>
                {"Ready to make your app speak every language? 🗣️ Let's set up react-i18next and watch your translations come alive — it's easier than ordering coffee in a foreign country! ☕🌎"}
              </Text>
              <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-3 mb-4`}>
                <Text className={styles.infoText}>
                  {"🔵"} <strong>Impact: MEDIUM</strong> — {"Going multilingual opens your app to millions of new users worldwide! 🚀"}
                </Text>
              </div>
              <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-2 mb-4`}>
                <Text className={styles.infoText}>
                  {"📋"} <strong>In this section:</strong> i18next Setup {"•"} Translation Resources {"•"} useTranslation Hook {"•"} Language Switching
                </Text>
              </div>
            </div>
            <CodeEditor
              code={`// ✅ Setup
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { welcome: 'Welcome' } },
    es: { translation: { welcome: 'Bienvenido' } }
  },
  lng: 'en',
  fallbackLng: 'en'
});

// ✅ Usage
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
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

