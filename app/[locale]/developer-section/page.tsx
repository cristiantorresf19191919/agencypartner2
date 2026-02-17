"use client";

import { useCallback } from "react";
import { Stack, Heading, Text } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { motion } from "framer-motion";
import {
  AutoAwesome as Sparkles,
  Code as Code2,
  ArrowForward as ArrowRight,
  Support as SupportIcon,
  Terminal as TerminalIcon,
  IntegrationInstructions as KotlinIcon,
  EmojiEvents as ChallengesIcon,
  Psychology as ReactIcon,
  PhoneAndroid as AndroidIcon,
  School as SchoolIcon,
  CallMerge as InteropIcon,
  Palette as CssIcon,
  DataObject as TsIcon,
  RecordVoiceOver as SoftSkillsIcon,
  QuestionAnswer as InterviewIcon,
  Storage as BackendIcon,
  Bolt as ReactiveIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import HeroSearch from "@/components/Search/HeroSearch";
import Footer from "@/components/Footer/Footer";
import styles from "./DeveloperSection.module.css";

// Card data organized by content type
type ContentCategory = "blog" | "playground" | "course" | "challenge" | "interview";

interface ContentCard {
  id: string;
  category: ContentCategory;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
  ctaKey: string;
}

// Grouped content: Blog (articles) | Playgrounds | Courses | Challenges | Interview Prep
const contentGroups: Array<{
  id: ContentCategory;
  sectionKey: string;
  cards: ContentCard[];
}> = [
  {
    id: "blog",
    sectionKey: "hub-section-blog",
    cards: [
      {
        id: "blog",
        category: "blog",
        href: "/developer-section/blog",
        icon: Code2,
        titleKey: "nav-blog",
        descKey: "nav-blog-desc",
        ctaKey: "explore-blog",
      },
    ],
  },
  {
    id: "playground",
    sectionKey: "hub-section-playgrounds",
    cards: [
      {
        id: "playground",
        category: "playground",
        href: "/developer-section/playground",
        icon: TerminalIcon,
        titleKey: "live-code-lab-title",
        descKey: "live-code-lab-desc",
        ctaKey: "open-playground",
      },
      {
        id: "kotlin-playground",
        category: "playground",
        href: "/developer-section/kotlin-playground",
        icon: KotlinIcon,
        titleKey: "kotlin-playground-title",
        descKey: "kotlin-playground-desc",
        ctaKey: "open-kotlin",
      },
    ],
  },
  {
    id: "course",
    sectionKey: "hub-section-courses",
    cards: [
      {
        id: "kotlin-course",
        category: "course",
        href: "/developer-section/kotlin-course",
        icon: SchoolIcon,
        titleKey: "kotlin-course-card-title",
        descKey: "kotlin-course-card-desc",
        ctaKey: "start-course",
      },
      {
        id: "kotlin-java-interop",
        category: "course",
        href: "/developer-section/kotlin-java-interop",
        icon: InteropIcon,
        titleKey: "kotlin-java-interop-card-title",
        descKey: "kotlin-java-interop-card-desc",
        ctaKey: "start-course",
      },
      {
        id: "react-course",
        category: "course",
        href: "/developer-section/react-course",
        icon: ReactIcon,
        titleKey: "react-course-card-title",
        descKey: "react-course-card-desc",
        ctaKey: "start-course",
      },
      {
        id: "typescript-course",
        category: "course",
        href: "/developer-section/typescript-course",
        icon: TsIcon,
        titleKey: "typescript-course-card-title",
        descKey: "typescript-course-card-desc",
        ctaKey: "start-course",
      },
      {
        id: "css-course",
        category: "course",
        href: "/developer-section/css-course",
        icon: CssIcon,
        titleKey: "css-course-card-title",
        descKey: "css-course-card-desc",
        ctaKey: "start-course",
      },
      {
        id: "android-kotlin",
        category: "course",
        href: "/developer-section/android-kotlin",
        icon: AndroidIcon,
        titleKey: "android-playbook-card-title",
        descKey: "android-playbook-card-desc",
        ctaKey: "start-learning",
      },
      {
        id: "spring-reactive",
        category: "course",
        href: "/developer-section/blog/spring-reactive-programming",
        icon: ReactiveIcon,
        titleKey: "spring-reactive-card-title",
        descKey: "spring-reactive-card-desc",
        ctaKey: "start-course",
      },
      {
        id: "reactor-flux",
        category: "course",
        href: "/developer-section/reactor-flux",
        icon: ReactiveIcon,
        titleKey: "reactor-flux-card-title",
        descKey: "reactor-flux-card-desc",
        ctaKey: "start-course",
      },
    ],
  },
  {
    id: "challenge",
    sectionKey: "hub-section-challenges",
    cards: [
      {
        id: "challenges",
        category: "challenge",
        href: "/developer-section/challenges",
        icon: ChallengesIcon,
        titleKey: "coding-challenges-card-title",
        descKey: "coding-challenges-card-desc",
        ctaKey: "start-challenges",
      },
      {
        id: "react-challenges",
        category: "challenge",
        href: "/developer-section/react-challenges",
        icon: ReactIcon,
        titleKey: "react-challenges-card-title",
        descKey: "react-challenges-card-desc",
        ctaKey: "solve-react-challenges",
      },
    ],
  },
  {
    id: "interview",
    sectionKey: "hub-section-interviews",
    cards: [
      {
        id: "react-interview",
        category: "interview",
        href: "/developer-section/react-interview",
        icon: InterviewIcon,
        titleKey: "react-interview-card-title",
        descKey: "react-interview-card-desc",
        ctaKey: "practice-interviews",
      },
      {
        id: "soft-skills-interview",
        category: "interview",
        href: "/developer-section/soft-skills-interview",
        icon: SoftSkillsIcon,
        titleKey: "soft-skills-interview-card-title",
        descKey: "soft-skills-interview-card-desc",
        ctaKey: "practice-soft-skills",
      },
      {
        id: "backend-interview",
        category: "interview",
        href: "/developer-section/backend-interview",
        icon: BackendIcon,
        titleKey: "backend-interview-card-title",
        descKey: "backend-interview-card-desc",
        ctaKey: "practice-backend",
      },
    ],
  },
];

export default function DeveloperSectionPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  const handleCardMouseLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.removeProperty("--mouse-x");
    e.currentTarget.style.removeProperty("--mouse-y");
  }, []);

  return (
    <main>
      <DeveloperHeader />
      <div className={styles.developerSection}>
        {/* Background Effects */}
        <div className={styles.backgroundEffects}>
          <div className={styles.radialGradient} />
          <div className={styles.blurGradient} />
          <div className={styles.gridPattern} />
        </div>

        <div className={styles.content}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.headerSection}
          >
            <div className={styles.pill}>
              <Sparkles className={styles.pillIcon} />
              <span>{t("dev-hub-pill")}</span>
            </div>

            <Heading className={styles.title}>
              {t("developer-section-title")}
            </Heading>

            <Text className={styles.subtitle}>
              {t("developer-section-subtitle")}
            </Text>

            <div className={styles.heroSearchWrapper}>
              <HeroSearch />
            </div>
          </motion.div>

          {/* Content Sections: Blog | Playgrounds | Courses | Challenges | Interview Prep */}
          <div className={styles.contentSections}>
            {contentGroups.map((group, groupIndex) => (
              <motion.section
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + groupIndex * 0.08, duration: 0.5 }}
                className={styles.contentSection}
              >
                <h2 className={styles.sectionTitle}>{t(group.sectionKey)}</h2>
                <div className={styles.navGrid}>
                  {group.cards.map((card, cardIndex) => {
                    const Icon = card.icon;
                    return (
                      <motion.a
                        key={card.id}
                        href={createLocalizedPath(card.href)}
                        className={styles.blogCard}
                        data-category={card.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.15 + groupIndex * 0.08 + cardIndex * 0.03,
                          duration: 0.4,
                        }}
                        whileTap={{ scale: 0.98 }}
                        onMouseMove={handleCardMouseMove}
                        onMouseLeave={handleCardMouseLeave}
                      >
                        <div className={styles.glowEffect} />

                        <div className={styles.cardContent}>
                          <div className={styles.iconContainer}>
                            <Icon className={styles.icon} />
                          </div>

                          <Heading level={2} className={styles.cardTitle}>
                            {t(card.titleKey)}
                          </Heading>

                          <Text className={styles.cardDescription}>
                            {t(card.descKey)}
                          </Text>

                          <div className={styles.ctaLink}>
                            <span>{t(card.ctaKey)}</span>
                            <ArrowRight className={styles.ctaArrow} />
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={styles.helpSection}
          >
            <motion.a
              href={createLocalizedPath("/asesorias")}
              className={styles.helpCard}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.helpGlowEffect} />
              <div className={styles.helpContent}>
                <div className={styles.helpIconContainer}>
                  <SupportIcon className={styles.helpIcon} />
                </div>

                <Heading level={2} className={styles.helpTitle}>
                  {t("developer-section-need-help-title")}
                </Heading>

                <Text className={styles.helpDescription}>
                  {t("developer-section-need-help-desc")}
                </Text>

                <div className={styles.helpCtaLink}>
                  <span>{t("developer-section-need-help-cta")}</span>
                  <ArrowRight className={styles.helpCtaArrow} />
                </div>
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
