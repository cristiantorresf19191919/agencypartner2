"use client";

import { useState } from "react";
import { Stack, Heading, Text, ButtonLink } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { blogCategories } from "@/lib/blogCategories";
import styles from "./BlogPage.module.css";

export default function DeveloperBlogPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

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

        {/* Categories Grid */}
        <div className={styles.sectionsGrid}>
          {categories.map((category) => (
            <a
              key={category.id}
              href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)}
              className={styles.sectionCard}
            >
              <div
                className={styles.iconContainer}
                style={{
                  background: `linear-gradient(to bottom right, ${
                    category.color.includes('indigo') 
                      ? 'rgba(129, 140, 248, 0.25)' 
                      : category.color.includes('blue') 
                        ? 'rgba(147, 197, 253, 0.25)' 
                        : category.color.includes('purple') 
                          ? 'rgba(196, 181, 253, 0.25)' 
                          : category.color.includes('orange')
                            ? 'rgba(251, 146, 60, 0.25)'
                            : 'rgba(134, 239, 172, 0.25)'
                  }, ${
                    category.color.includes('purple') 
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
                  {category.title}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {category.description}
                </Text>
              </div>
              <div className="mt-auto">
                <Text className={styles.topicsLabel}>
                  {category.posts.length} {category.posts.length === 1 ? 'Post' : 'Posts'} in this category
                </Text>
                <div 
                  className={`${styles.topicsList} ${expandedCards.has(category.id) ? styles.topicsListExpanded : ''}`}
                >
                  {category.posts.slice(0, expandedCards.has(category.id) ? category.posts.length : 3).map((post) => {
                    return (
                      <span 
                        key={post.id} 
                        className={styles.topicTag}
                      >
                        {post.title}
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
                    aria-label={expandedCards.has(category.id) ? "Show less posts" : "Show more posts"}
                  >
                    <span className={styles.expandButtonText}>
                      {expandedCards.has(category.id) ? "Show Less" : `+${category.posts.length - 3} More Posts`}
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
                Explore Category <i className="fas fa-arrow-right"></i>
              </div>
            </a>
          ))}
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
