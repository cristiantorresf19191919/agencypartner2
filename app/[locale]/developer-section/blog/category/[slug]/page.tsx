"use client";

import { useState, use } from "react";
import { Stack, Heading, Text, ButtonLink } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import { getCategoryBySlug } from "@/lib/blogCategories";
import { getCategoryForLocale, getBlogPostContent } from "@/lib/blogTranslations";
import { notFound } from "next/navigation";
import styles from "../../BlogPage.module.css";

const DESCRIPTION_COLLAPSE_THRESHOLD = 110;
const TOPICS_COLLAPSE_THRESHOLD = 4;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const [expandedDesc, setExpandedDesc] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const category = getCategoryBySlug(slug);
  const categoryDisplay = category ? getCategoryForLocale(slug, language as 'es' | 'en', { title: category.title, description: category.description }) : null;

  const toggleDesc = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedDesc((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleTopics = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!category) {
    notFound();
  }

  return (
    <BlogContentLayout>
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
          <li>
            <ButtonLink
              href={createLocalizedPath("/developer-section/blog")}
              variant="secondary"
              className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
            >
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className="text-white/40">/</li>
          <li className="text-white font-medium">{categoryDisplay?.title ?? category.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
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
              })`,
            width: "5rem",
            height: "5rem",
            fontSize: "2.5rem",
            margin: "0 auto 1.5rem",
          }}
        >
          {category.icon}
        </div>
        <Heading className={styles.title}>
          {categoryDisplay?.title ?? category.title}
        </Heading>
        <Text className={styles.subtitle}>
          {categoryDisplay?.description ?? category.description}
        </Text>
      </div>

      {/* Posts Grid */}
      <div className={styles.sectionsGrid}>
        {category.posts.map((post) => {
          const postContent = getBlogPostContent(post.id, language as 'es' | 'en');
          const postTitle = postContent?.title ?? post.title;
          const postDesc = postContent?.subtitle ?? post.description;
          return (
            <a
              key={post.id}
              href={createLocalizedPath(`/developer-section/blog/${post.slug}`)}
              className={styles.sectionCard}
            >
              <div
                className={styles.iconContainer}
                style={{
                  background: `linear-gradient(to bottom right, ${post.color.includes('indigo')
                    ? 'rgba(129, 140, 248, 0.25)'
                    : post.color.includes('blue')
                      ? 'rgba(147, 197, 253, 0.25)'
                      : post.color.includes('purple')
                        ? 'rgba(196, 181, 253, 0.25)'
                        : post.color.includes('orange')
                          ? 'rgba(251, 146, 60, 0.25)'
                          : 'rgba(134, 239, 172, 0.25)'
                    }, ${post.color.includes('purple')
                      ? 'rgba(196, 181, 253, 0.25)'
                      : post.color.includes('cyan')
                        ? 'rgba(165, 243, 252, 0.25)'
                        : post.color.includes('pink')
                          ? 'rgba(251, 146, 60, 0.25)'
                          : post.color.includes('red')
                            ? 'rgba(248, 113, 113, 0.25)'
                            : 'rgba(110, 231, 183, 0.25)'
                    })`
                }}
              >
                {post.icon}
              </div>
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {postTitle}
                </Heading>
                <div className={styles.descriptionWrapper}>
                  <Text
                    className={`${styles.sectionDescription} ${!expandedDesc.has(post.id) && postDesc.length > DESCRIPTION_COLLAPSE_THRESHOLD
                      ? styles.sectionDescriptionCollapsed
                      : ""
                      }`}
                  >
                    {postDesc}
                  </Text>
                  {postDesc.length > DESCRIPTION_COLLAPSE_THRESHOLD && (
                    <button
                      type="button"
                      onClick={(e) => toggleDesc(post.id, e)}
                      className={styles.expandTextButton}
                      aria-expanded={expandedDesc.has(post.id)}
                      aria-label={expandedDesc.has(post.id) ? t("show-less") : t("show-more")}
                    >
                      {expandedDesc.has(post.id) ? t("show-less") : t("show-more")}
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.topicsSection}>
                <Text className={styles.topicsLabel}>
                  Topics Covered:
                </Text>
                <div className={styles.topicsList}>
                  {(expandedTopics.has(post.id) ? post.topics : post.topics.slice(0, TOPICS_COLLAPSE_THRESHOLD)).map(
                    (topic, idx) => (
                      <span key={idx} className={styles.topicTag}>
                        {topic}
                      </span>
                    )
                  )}
                </div>
                {post.topics.length > TOPICS_COLLAPSE_THRESHOLD && (
                  <button
                    type="button"
                    onClick={(e) => toggleTopics(post.id, e)}
                    className={styles.expandButton}
                    aria-label={expandedTopics.has(post.id) ? "Show fewer topics" : "Show all topics"}
                  >
                    <span className={styles.expandButtonText}>
                      {expandedTopics.has(post.id)
                        ? "Show less"
                        : `+${post.topics.length - TOPICS_COLLAPSE_THRESHOLD} more`}
                    </span>
                    <svg
                      className={`${styles.expandIcon} ${expandedTopics.has(post.id) ? styles.expandIconRotated : ""}`}
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
                {t("read-more")} <i className="fas fa-arrow-right"></i>
              </div>
            </a>
          );
        })}
      </div>

      {/* Back to Categories */}
      <div className={styles.backButton}>
        <ButtonLink
          variant="secondary"
          href={createLocalizedPath("/developer-section/blog")}
          className="!bg-white !text-purple-600 !border-transparent hover:!bg-gray-100 shadow-lg px-8 py-3 rounded-full font-semibold"
        >
          ← {t("back-to-categories")}
        </ButtonLink>
      </div>
    </BlogContentLayout>
  );
}

