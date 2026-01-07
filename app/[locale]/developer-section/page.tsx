"use client";

import { Stack, Heading, Text } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { motion } from "framer-motion";
import { AutoAwesome as Sparkles, Code as Code2, ArrowForward as ArrowRight } from "@mui/icons-material";
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

          {/* Centered Blog Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={styles.blogNavigation}
          >
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
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

