"use client";

import { useState } from "react";
import { Stack, Heading, Text, ButtonLink, Card, FullscreenIframeModal , FullscreenSection } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function HowLLMsWorkPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  
  const iframeSrc = "https://bbycroft.net/llm";

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("developer-section-title")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>{t("how-llms-work-title")}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          {t("how-llms-work-title")}
        </Heading>
        <Text className={styles.subtitle}>
          {t("how-llms-work-subtitle")}
        </Text>
        <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
          <Text className={styles.infoText}>
            {t("how-llms-work-info-note")}
          </Text>
        </div>
      </div>

      {/* Introduction Section */}
      <FullscreenSection id="introduction" title="Introduction" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {t("how-llms-work-intro-title")}
              </Heading>
              <Text className={styles.sectionDescription}>
                {t("how-llms-work-intro-description")}
              </Text>
            </div>
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Full-Screen Interactive Visualization */}
      <section 
        id="visualization" 
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100vh - 200px)",
          minHeight: "800px",
          margin: "3rem 0",
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          background: "linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "rgba(0, 0, 0, 0.3)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #a06af9 0%, #6366f1 100%)",
                  boxShadow: "0 0 10px rgba(160, 106, 249, 0.5)",
                }}
              />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                {t("how-llms-work-visualization-title")}
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button
                onClick={() => setIsFullscreenOpen(true)}
                style={{
                  color: "rgba(160, 106, 249, 0.9)",
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.375rem",
                  background: "rgba(160, 106, 249, 0.1)",
                  border: "1px solid rgba(160, 106, 249, 0.2)",
                  transition: "all 0.2s",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(160, 106, 249, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(160, 106, 249, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(160, 106, 249, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(160, 106, 249, 0.2)";
                }}
                aria-label="Open in fullscreen"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                Fullscreen
              </button>
              <a
                href={iframeSrc}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgba(160, 106, 249, 0.9)",
                  fontSize: "0.75rem",
                  textDecoration: "none",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.375rem",
                  background: "rgba(160, 106, 249, 0.1)",
                  border: "1px solid rgba(160, 106, 249, 0.2)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(160, 106, 249, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(160, 106, 249, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(160, 106, 249, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(160, 106, 249, 0.2)";
                }}
              >
                {t("how-llms-work-open-in-new-tab")} ↗
              </a>
            </div>
          </div>

          {/* Iframe Container */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              background: "#000",
            }}
          >
            <iframe
              src={iframeSrc}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                background: "#000",
              }}
              title={t("how-llms-work-visualization-title")}
              allow="fullscreen"
              loading="lazy"
            />
          </div>
        </div>

        {/* Decorative gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            background: "radial-gradient(ellipse at center, rgba(160, 106, 249, 0.05) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />
      </FullscreenSection>

      {/* Key Concepts Section */}
      <FullscreenSection id="key-concepts" title="Key Concepts" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {t("how-llms-work-key-concepts-title")}
              </Heading>
              <Text className={styles.sectionDescription}>
                {t("how-llms-work-key-concepts-description")}
              </Text>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Heading level={3} className={styles.sectionTitle} style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                {t("how-llms-work-transformer-title")}
              </Heading>
              <Text className={styles.sectionDescription}>
                {t("how-llms-work-transformer-description")}
              </Text>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Heading level={3} className={styles.sectionTitle} style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                {t("how-llms-work-attention-title")}
              </Heading>
              <Text className={styles.sectionDescription}>
                {t("how-llms-work-attention-description")}
              </Text>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Heading level={3} className={styles.sectionTitle} style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                {t("how-llms-work-training-title")}
              </Heading>
              <Text className={styles.sectionDescription}>
                {t("how-llms-work-training-description")}
              </Text>
            </div>
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Conclusion Section */}
      <FullscreenSection id="conclusion" title="Conclusion" sectionClassName={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                {t("how-llms-work-conclusion-title")}
              </Heading>
              <Text className={styles.sectionDescription}>
                {t("how-llms-work-conclusion-description")}
              </Text>
            </div>
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Fullscreen Modal */}
      <FullscreenIframeModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        src={iframeSrc}
        title={t("how-llms-work-visualization-title")}
        allow="fullscreen"
      />
    </BlogContentLayout>
  );
}
