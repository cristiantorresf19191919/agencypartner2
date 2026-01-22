"use client";

import { Stack, Heading, Text } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { motion } from "framer-motion";
import { AutoAwesome as Sparkles, Code as Code2, ArrowForward as ArrowRight, Support as SupportIcon, Terminal as TerminalIcon, IntegrationInstructions as KotlinIcon, EmojiEvents as ChallengesIcon, Psychology as ReactIcon } from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import styles from "./DeveloperSection.module.css";

export default function DeveloperSectionPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();


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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={styles.headerSection}
          >
            <div className={styles.pill}>
              <Sparkles className={styles.pillIcon} />
              <span>Developer Hub</span>
            </div>
            
            <Heading className={styles.title}>
              {t("developer-section-title")}
            </Heading>
            
            <Text className={styles.subtitle}>
              {t("developer-section-subtitle")}
            </Text>
          </motion.div>

          {/* Centered Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={styles.blogNavigation}
          >
            <div className={styles.navGrid}>
              <motion.a
                href={createLocalizedPath("/developer-section/blog")}
                className={styles.blogCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={styles.glowEffect} />
                <div className={styles.gradientBlob1} />
                <div className={styles.gradientBlob2} />
                
                <div className={styles.cardContent}>
                  <div className={styles.iconContainer}>
                    <Code2 className={styles.icon} />
                  </div>
                  
                  <Heading level={2} className={styles.cardTitle}>
                    {t("nav-blog")}
                  </Heading>
                  
                  <Text className={styles.cardDescription}>
                    {t("nav-blog-desc")}
                  </Text>
                  
                  <div className={styles.ctaLink}>
                    <span>Explore Blog</span>
                    <ArrowRight className={styles.ctaArrow} />
                  </div>
                </div>
              </motion.a>

              <motion.a
                href={createLocalizedPath("/developer-section/playground")}
                className={styles.blogCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={styles.glowEffect} />
                <div className={styles.gradientBlob1} />
                <div className={styles.gradientBlob2} />
                
                <div className={styles.cardContent}>
                  <div className={styles.iconContainer}>
                    <TerminalIcon className={styles.icon} />
                  </div>
                  
                  <Heading level={2} className={styles.cardTitle}>
                    Live Code Lab
                  </Heading>
                  
                  <Text className={styles.cardDescription}>
                    Monaco-powered editor with VS Code autocompletion. Write, run, and maximize for distraction-free coding.
                  </Text>
                  
                  <div className={styles.ctaLink}>
                    <span>Open Playground</span>
                    <ArrowRight className={styles.ctaArrow} />
                  </div>
                </div>
              </motion.a>

              <motion.a
                href={createLocalizedPath("/developer-section/kotlin-playground")}
                className={styles.blogCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={styles.glowEffect} />
                <div className={styles.gradientBlob1} />
                <div className={styles.gradientBlob2} />
                
                <div className={styles.cardContent}>
                  <div className={styles.iconContainer}>
                    <KotlinIcon className={styles.icon} />
                  </div>
                  
                  <Heading level={2} className={styles.cardTitle}>
                    Kotlin Playground
                  </Heading>
                  
                  <Text className={styles.cardDescription}>
                    Run Kotlin in the browser. Multi-file, syntax highlighting, autocomplete, and console output via Piston.
                  </Text>
                  
                  <div className={styles.ctaLink}>
                    <span>Open Kotlin</span>
                    <ArrowRight className={styles.ctaArrow} />
                  </div>
                </div>
              </motion.a>

              <motion.a
                href={createLocalizedPath("/developer-section/challenges")}
                className={styles.blogCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={styles.glowEffect} />
                <div className={styles.gradientBlob1} />
                <div className={styles.gradientBlob2} />
                
                <div className={styles.cardContent}>
                  <div className={styles.iconContainer}>
                    <ChallengesIcon className={styles.icon} />
                  </div>
                  
                  <Heading level={2} className={styles.cardTitle}>
                    Coding Challenges
                  </Heading>
                  
                  <Text className={styles.cardDescription}>
                    HackerRank-style problems. Solve in TypeScript or Kotlin, run in-browser, and get a confetti celebration when you pass all tests.
                  </Text>
                  
                  <div className={styles.ctaLink}>
                    <span>Start Challenges</span>
                    <ArrowRight className={styles.ctaArrow} />
                  </div>
                </div>
              </motion.a>

              <motion.a
                href={createLocalizedPath("/developer-section/react-challenges")}
                className={styles.blogCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={styles.glowEffect} />
                <div className={styles.gradientBlob1} />
                <div className={styles.gradientBlob2} />
                
                <div className={styles.cardContent}>
                  <div className={styles.iconContainer}>
                    <ReactIcon className={styles.icon} />
                  </div>
                  
                  <Heading level={2} className={styles.cardTitle}>
                    React Challenges
                  </Heading>
                  
                  <Text className={styles.cardDescription}>
                    Master React hooks, rendering behavior, TypeScript patterns, and performance. Solutions unlock after 10 attempts.
                  </Text>
                  
                  <div className={styles.ctaLink}>
                    <span>Solve React Challenges</span>
                    <ArrowRight className={styles.ctaArrow} />
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Need Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={styles.helpSection}
          >
            <motion.a
              href={createLocalizedPath("/asesorias")}
              className={styles.helpCard}
              whileHover={{ scale: 1.02 }}
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

