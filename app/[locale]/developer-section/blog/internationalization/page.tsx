"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor , FullscreenSection } from "@/components/ui";
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

      <FullscreenSection id="react-i18next" title="React I18next" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>1. react-i18next Patterns</Heading>
              <Text className={styles.sectionDescription}>
                Set up and use react-i18next for translations.
              </Text>
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
      </FullscreenSection>
    </BlogContentLayout>
  );
}

