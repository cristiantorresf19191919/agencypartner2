"use client";

import { useState, Suspense } from "react";
import { Stack, Heading, Text, ButtonLink } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import SearchSection from "@/components/Search/SearchSection";
import { blogCategories } from "@/lib/blogCategories";
import { getBlogPostContent, getCategoryForLocale } from "@/lib/blogTranslations";
import styles from "./BlogPage.module.css";

function BlogPageContent() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const DESC_COLLAPSE_THRESHOLD = 110;

  const toggleDesc = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedDescriptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Use categories instead of individual sections
  const categories = blogCategories;

  return (
    <main>
      <DeveloperHeader />
      <div className={styles.blogPage}>
        <div className={styles.content}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <ol className={styles.breadcrumbList}>
              <li>
                <ButtonLink
                  href={createLocalizedPath("/")}
                  variant="secondary"
                  className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
                >
                  {t("blog-breadcrumb-home")}
                </ButtonLink>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white font-medium">{t("nav-blog")}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className={styles.headerSection}>
            <Heading className={styles.title}>
              {t("blog-title")}
            </Heading>
            <Text className={styles.subtitle}>
              {t("blog-subtitle")}
            </Text>
          </div>

          {/* Search Section */}
          <div className={styles.searchWrapper}>
            <SearchSection />
          </div>

          {/* Categories Grid */}
          <div className={styles.sectionsGrid}>
            {categories.map((category) => {
              const categoryDisplay = getCategoryForLocale(category.slug, language as 'es' | 'en', { title: category.title, description: category.description });
              return (
                <a
                  key={category.id}
                  href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)}
                  className={styles.sectionCard}
                >
                  <div
                    className={styles.iconContainer}
                    style={{
                      background: `linear-gradient(to bottom right, ${category.color.includes('indigo')
                        ? 'rgba(129, 140, 248, 0.25)'
                        : category.color.includes('blue')
                          ? 'rgba(147, 197, 253, 0.25)'
                          : category.color.includes('purple')
                            ? 'rgba(196, 181, 253, 0.25)'
                            : category.color.includes('orange')
                              ? 'rgba(251, 146, 60, 0.25)'
                              : 'rgba(134, 239, 172, 0.25)'
                        }, ${category.color.includes('purple')
                          ? 'rgba(196, 181, 253, 0.25)'
                          : category.color.includes('cyan')
                            ? 'rgba(165, 243, 252, 0.25)'
                            : category.color.includes('pink')
                              ? 'rgba(251, 146, 60, 0.25)'
                              : category.color.includes('red')
                                ? 'rgba(248, 113, 113, 0.25)'
                                : 'rgba(110, 231, 183, 0.25)'
                        })`
                    }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <Heading level={2} className={styles.sectionTitle}>
                      {categoryDisplay.title}
                    </Heading>
                    <div className={styles.descriptionWrapper}>
                      <Text
                        className={`${styles.sectionDescription} ${!expandedDescriptions.has(category.id) && categoryDisplay.description.length > DESC_COLLAPSE_THRESHOLD
                          ? styles.sectionDescriptionCollapsed
                          : ""
                          }`}
                      >
                        {categoryDisplay.description}
                      </Text>
                      {categoryDisplay.description.length > DESC_COLLAPSE_THRESHOLD && (
                        <button
                          type="button"
                          onClick={(e) => toggleDesc(category.id, e)}
                          className={styles.expandTextButton}
                          aria-expanded={expandedDescriptions.has(category.id)}
                          aria-label={expandedDescriptions.has(category.id) ? t("show-less") : t("show-more")}
                        >
                          {expandedDescriptions.has(category.id) ? t("show-less") : t("show-more")}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Text className={styles.topicsLabel}>
                      {category.posts.length} {category.posts.length === 1 ? t("blog-posts-in-category") : t("blog-posts-in-category-plural")}
                    </Text>
                    <div
                      className={`${styles.topicsList} ${expandedCards.has(category.id) ? styles.topicsListExpanded : ''}`}
                    >
                      {category.posts.slice(0, expandedCards.has(category.id) ? category.posts.length : 3).map((post) => {
                        const postContent = getBlogPostContent(post.id, language as 'es' | 'en');
                        const postTitle = postContent?.title ?? post.title;
                        return (
                          <span
                            key={post.id}
                            className={styles.topicTag}
                          >
                            {postTitle}
                          </span>
                        );
                      })}
                    </div>
                    {category.posts.length > 3 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleCard(category.id);
                        }}
                        className={styles.expandButton}
                        aria-label={expandedCards.has(category.id) ? t("show-less-posts") : t("more-posts").replace("{count}", String(category.posts.length - 3))}
                      >
                        <span className={styles.expandButtonText}>
                          {expandedCards.has(category.id) ? t("show-less") : t("more-posts").replace("{count}", String(category.posts.length - 3))}
                        </span>
                        <svg
                          className={`${styles.expandIcon} ${expandedCards.has(category.id) ? styles.expandIconRotated : ''}`}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className={styles.sectionCta}>
                    {t("explore-category")} <i className="fas fa-arrow-right"></i>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Features Section */}
          <div className={styles.featuresSection}>
            <Heading level={2} className={styles.featuresTitle}>
              {t("blog-features-title")}
            </Heading>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💻</div>
                <Heading level={3} className={styles.featureTitle}>
                  {t("blog-feature-editor-title")}
                </Heading>
                <Text className={styles.featureDescription}>
                  {t("blog-feature-editor-desc")}
                </Text>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📊</div>
                <Heading level={3} className={styles.featureTitle}>
                  {t("blog-feature-comparison-title")}
                </Heading>
                <Text className={styles.featureDescription}>
                  {t("blog-feature-comparison-desc")}
                </Text>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔍</div>
                <Heading level={3} className={styles.featureTitle}>
                  {t("blog-feature-oop-title")}
                </Heading>
                <Text className={styles.featureDescription}>
                  {t("blog-feature-oop-desc")}
                </Text>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className={styles.backButton}>
            <ButtonLink
              variant="secondary"
              href={createLocalizedPath("/developer-section")}
              className="!bg-white !text-purple-600 !border-transparent hover:!bg-gray-100 shadow-lg px-8 py-3 rounded-full font-semibold"
            >
              ← {t("developer-section-title")}
            </ButtonLink>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function DeveloperBlogPage() {
  return (
    <Suspense fallback={
      <main>
        <DeveloperHeader />
        <div className={styles.blogPage}>
          <div className={styles.content}>
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Loading...
            </div>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <BlogPageContent />
    </Suspense>
  );
}
