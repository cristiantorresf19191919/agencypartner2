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
import { blogPostDates, formatPostDate, groupPostsByMonth } from "@/lib/blogPostDates";
import styles from "./BlogPage.module.css";

function BlogPageContent() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"category" | "timeline">("category");

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

          {/* View Toggle */}
          <div className={styles.viewToggle}>
            <button
              type="button"
              className={`${styles.viewToggleBtn} ${viewMode === "category" ? styles.viewToggleBtnActive : ""}`}
              onClick={() => setViewMode("category")}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" /></svg>
              {language === "es" ? "Categorías" : "Categories"}
            </button>
            <button
              type="button"
              className={`${styles.viewToggleBtn} ${viewMode === "timeline" ? styles.viewToggleBtnActive : ""}`}
              onClick={() => setViewMode("timeline")}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M4 4h8M3 8h10M5 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              {language === "es" ? "Cronología" : "Timeline"}
            </button>
          </div>

          {/* Timeline View */}
          {viewMode === "timeline" && (() => {
            const allPosts = Object.entries(blogPostDates)
              .map(([slug, dateStr]) => {
                const date = new Date(dateStr);
                const postData = blogCategories
                  .flatMap((cat) => cat.posts.map((p) => ({ postSlug: p.slug, postTitle: p.title, postIcon: p.icon, categoryTitle: cat.title, categoryIcon: cat.icon })))
                  .find((p) => p.postSlug === slug);
                return postData ? { slug, date, title: postData.postTitle, icon: postData.postIcon, categoryTitle: postData.categoryTitle, categoryIcon: postData.categoryIcon } : null;
              })
              .filter(Boolean) as { slug: string; date: Date; title: string; icon: string; categoryTitle: string; categoryIcon: string }[];

            allPosts.sort((a, b) => b.date.getTime() - a.date.getTime());

            const groups = groupPostsByMonth(allPosts, language);
            const newest = allPosts[0];
            const oldest = allPosts[allPosts.length - 1];

            return (
              <div className={styles.timelineView}>
                {/* Stats */}
                <div className={styles.timelineStats}>
                  <div className={styles.timelineStat}>
                    <span className={styles.timelineStatValue}>{allPosts.length}</span>
                    <span className={styles.timelineStatLabel}>{language === "es" ? "Total posts" : "Total Posts"}</span>
                  </div>
                  {newest && (
                    <div className={styles.timelineStat}>
                      <span className={styles.timelineStatValue}>{formatPostDate(newest.date, language)}</span>
                      <span className={styles.timelineStatLabel}>{language === "es" ? "Más reciente" : "Most Recent"}</span>
                    </div>
                  )}
                  {oldest && (
                    <div className={styles.timelineStat}>
                      <span className={styles.timelineStatValue}>{formatPostDate(oldest.date, language)}</span>
                      <span className={styles.timelineStatLabel}>{language === "es" ? "Más antiguo" : "Oldest"}</span>
                    </div>
                  )}
                </div>

                {/* Grouped by month */}
                {groups.map((group) => (
                  <div key={group.label} className={styles.monthGroup}>
                    <div className={styles.monthLabel}>{group.label}</div>
                    <div className={styles.timelineList}>
                      {group.posts.map((gp) => {
                        const post = allPosts.find((p) => p.slug === gp.slug);
                        if (!post) return null;
                        const localizedTitle = getBlogPostContent(post.slug, language as "es" | "en")?.title ?? post.title;
                        return (
                          <a
                            key={post.slug}
                            href={createLocalizedPath(`/developer-section/blog/${post.slug}`)}
                            className={styles.timelineCard}
                          >
                            <div className={styles.timelineIcon}>{post.icon}</div>
                            <div className={styles.timelineInfo}>
                              <div className={styles.timelineTitle}>{localizedTitle}</div>
                              <div className={styles.timelineCategory}>{post.categoryTitle}</div>
                            </div>
                            <div className={styles.timelineDate}>{formatPostDate(post.date, language)}</div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Categories Grid */}
          {viewMode === "category" && <div className={styles.sectionsGrid}>
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
          </div>}

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
          <div className={styles.content} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1.5rem" }}>
            {/* Spinning code icon */}
            <svg viewBox="0 0 80 80" width="56" height="56">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="2" strokeDasharray="8 6">
                <animateTransform attributeName="transform" type="rotate" values="0 40 40;360 40 40" dur="6s" repeatCount="indefinite" />
              </circle>
              <text x="40" y="47" textAnchor="middle" fill="rgba(139,92,246,0.5)" fontSize="22" fontWeight="700" fontFamily="monospace">&lt;/&gt;</text>
            </svg>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Loading blog
            </div>
            {/* Slim progress */}
            <div style={{ width: 200, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, overflow: "hidden" }}>
              <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg, #8b5cf6, #06b6d4)", borderRadius: 1, animation: "loading-shimmer 1.5s infinite" }} />
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
