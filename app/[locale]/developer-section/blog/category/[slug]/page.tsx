"use client";

import { Stack, Heading, Text, ButtonLink } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import { getCategoryBySlug } from "@/lib/blogCategories";
import { notFound } from "next/navigation";
import styles from "../../BlogPage.module.css";

interface CategoryPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const category = getCategoryBySlug(params.slug);

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
          <li className="text-white font-medium">{category.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
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
          {category.title}
        </Heading>
        <Text className={styles.subtitle}>
          {category.description}
        </Text>
      </div>

      {/* Posts Grid */}
      <div className={styles.sectionsGrid}>
        {category.posts.map((post) => (
          <a
            key={post.id}
            href={createLocalizedPath(`/developer-section/blog/${post.slug}`)}
            className={styles.sectionCard}
          >
            <div
              className={styles.iconContainer}
              style={{
                background: `linear-gradient(to bottom right, ${
                  post.color.includes('indigo') 
                    ? 'rgba(129, 140, 248, 0.25)' 
                    : post.color.includes('blue') 
                      ? 'rgba(147, 197, 253, 0.25)' 
                      : post.color.includes('purple') 
                        ? 'rgba(196, 181, 253, 0.25)' 
                        : post.color.includes('orange')
                          ? 'rgba(251, 146, 60, 0.25)'
                          : 'rgba(134, 239, 172, 0.25)'
                }, ${
                  post.color.includes('purple') 
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
                {post.title}
              </Heading>
              <Text className={styles.sectionDescription}>
                {post.description}
              </Text>
            </div>
            <div className="mt-auto">
              <Text className={styles.topicsLabel}>
                Topics Covered:
              </Text>
              <div className={styles.topicsList}>
                {post.topics.slice(0, 5).map((topic, idx) => (
                  <span key={idx} className={styles.topicTag}>
                    {topic}
                  </span>
                ))}
                {post.topics.length > 5 && (
                  <span className={styles.topicTag}>
                    +{post.topics.length - 5} more
                  </span>
                )}
              </div>
            </div>
            <div className={styles.sectionCta}>
              Read Article <i className="fas fa-arrow-right"></i>
            </div>
          </a>
        ))}
      </div>

      {/* Back to Categories */}
      <div className={styles.backButton}>
        <ButtonLink
          variant="secondary"
          href={createLocalizedPath("/developer-section/blog")}
          className="!bg-white !text-purple-600 !border-transparent hover:!bg-gray-100 shadow-lg px-8 py-3 rounded-full font-semibold"
        >
          ← Back to Categories
        </ButtonLink>
      </div>
    </BlogContentLayout>
  );
}

