"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { REACT19_LESSONS } from "@/lib/react19InterviewData";
import { getReact19LessonForLocale } from "@/lib/reactInterviewTranslations";
import { getStore } from "@/lib/devHubStore";
import { getDueIds } from "@/lib/spacedRepetition";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import { Code as CodeIcon, ArrowForward as ArrowRight, School as SchoolIcon } from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

function React19FeaturesShowcase({ t }: { t: (key: string) => string }) {
  return (
    <div className={styles.react19Showcase}>
      <h2 className={styles.showcaseTitle}>
        {t("react-interview-showcase-title-pre")} <span className={styles.gradient}>{t("react-interview-showcase-title-gradient")}</span>
      </h2>
      <p className={styles.showcaseSubtitle}>
        {t("react-interview-showcase-subtitle")}
      </p>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={`${styles.featureIcon} ${styles.lightning}`}>&#9889;</span>
            <h3 className={styles.featureTitle}>{t("react-interview-feature-1-title")}</h3>
          </div>
          <p className={styles.featureDesc}>
            {t("react-interview-feature-1-desc")}
          </p>
          <div className={styles.codeBlock}>
            <span className={styles.keyword}>function</span>{" "}
            <span className={styles.function}>UserProfile</span>{"({ "}
            <span className={styles.variable}>dataPromise</span>{" }) {\n"}
            {"  "}<span className={styles.keyword}>const</span>{" "}
            <span className={styles.variable}>user</span> = <span className={styles.function}>use</span>(
            <span className={styles.variable}>dataPromise</span>);{"\n"}
            {"  "}<span className={styles.keyword}>return</span> {"<"}<span className={styles.tag}>h1</span>{">"}{"{"}
            <span className={styles.variable}>user</span>.<span className={styles.property}>name</span>{"}</"}<span className={styles.tag}>h1</span>{">;"}
            {"\n}"}
          </div>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={`${styles.featureIcon} ${styles.check}`}>&#10003;</span>
            <h3 className={styles.featureTitle}>{t("react-interview-feature-2-title")}</h3>
          </div>
          <p className={styles.featureDesc}>
            {t("react-interview-feature-2-desc")}
          </p>
          <div className={styles.codeBlock}>
            <span className={styles.keyword}>const</span> [<span className={styles.variable}>state</span>,{" "}
            <span className={styles.variable}>action</span>, <span className={styles.variable}>isPending</span>] ={"\n"}
            {"  "}<span className={styles.function}>useActionState</span>(<span className={styles.variable}>submitFn</span>,{" "}
            <span className={styles.keyword}>null</span>);{"\n\n"}
            {"<"}<span className={styles.tag}>form</span> <span className={styles.attr}>action</span>={"{"}<span className={styles.variable}>action</span>{"}>"}{"\n"}
            {"  <"}<span className={styles.tag}>button</span> <span className={styles.attr}>disabled</span>={"{"}<span className={styles.variable}>isPending</span>{"}>"}Save{"</"}<span className={styles.tag}>button</span>{">"}
            {"\n</"}<span className={styles.tag}>form</span>{">"}
          </div>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={`${styles.featureIcon} ${styles.eye}`}>&#9737;</span>
            <h3 className={styles.featureTitle}>{t("react-interview-feature-3-title")}</h3>
          </div>
          <p className={styles.featureDesc}>
            {t("react-interview-feature-3-desc")}
          </p>
          <div className={styles.codeBlock}>
            {"<"}<span className={styles.component}>Activity</span>{" "}
            <span className={styles.attr}>mode</span>={"{"}<span className={styles.variable}>isSelected</span> ?{" "}
            <span className={styles.string}>&apos;visible&apos;</span> :{" "}
            <span className={styles.string}>&apos;hidden&apos;</span>{"}>"}{"\n"}
            {"  <"}<span className={styles.component}>HeavyComponent</span> {"/>"}{"\n"}
            {"</"}<span className={styles.component}>Activity</span>{">"}
          </div>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={`${styles.featureIcon} ${styles.bolt}`}>&#8635;</span>
            <h3 className={styles.featureTitle}>{t("react-interview-feature-4-title")}</h3>
          </div>
          <p className={styles.featureDesc}>
            {t("react-interview-feature-4-desc")}
          </p>
          <div className={styles.codeBlock}>
            <span className={styles.keyword}>const</span> <span className={styles.variable}>onVisit</span> ={" "}
            <span className={styles.function}>useEffectEvent</span>(<span className={styles.variable}>d</span> ={">"}{" "}
            <span className={styles.function}>log</span>(<span className={styles.variable}>url</span>,{" "}
            <span className={styles.variable}>d</span>));{"\n\n"}
            <span className={styles.function}>useEffect</span>(() ={">"} {"{\n"}
            {"  "}<span className={styles.function}>onVisit</span>(<span className={styles.variable}>analyticsData</span>);{"\n"}
            {"}"}, [<span className={styles.variable}>url</span>]);{" "}
            <span className={styles.comment}>{"// Only fires on URL change"}</span>
          </div>
        </div>
      </div>

      <div className={styles.stepsRow}>
        <div className={styles.stepCard}>
          <span className={styles.stepLabel}>Step 1</span>
          <p className={styles.stepText}>{t("react-interview-step-1")}</p>
        </div>
        <div className={styles.stepCard}>
          <span className={styles.stepLabel}>Step 2</span>
          <p className={styles.stepText}>{t("react-interview-step-2")}</p>
        </div>
        <div className={styles.stepCard}>
          <span className={styles.stepLabel}>Step 3</span>
          <p className={styles.stepText}>{t("react-interview-step-3")}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReactInterviewLandingPage() {
  const { locale, createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const localizedLessons = REACT19_LESSONS.map((lesson) => {
    const translated = getReact19LessonForLocale(locale, lesson.id);
    return translated ?? lesson;
  });

  const store = getStore();
  const dueIds = getDueIds(store.interviewSR)
    .filter((id) => id.startsWith("react-interview-"))
    .map((id) => id.replace("react-interview-", ""));
  const dueLessons = localizedLessons.filter((l) => dueIds.includes(l.id));

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>{t("react-interview-pill")}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("react-interview-title")}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("react-interview-subtitle")}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            React 19
          </span>
          <span className={styles.badge}>{t("react-interview-badge-lessons")}</span>
          <span className={styles.badge}>{REACT19_LESSONS.length} {t("react-interview-lessons-count")}</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <React19FeaturesShowcase t={t} />
        </motion.div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>{t("react-interview-all-lessons")}</span>
          <span className={styles.count}>{REACT19_LESSONS.length} {t("react-interview-lessons-count").toLowerCase()}</span>
        </div>

        {dueLessons.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#fbbf24", marginBottom: "12px" }}>
              🔄 {t("sr-due-title")} ({dueLessons.length})
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
              {dueLessons.map((l) => (
                <Link
                  key={l.id}
                  href={createLocalizedPath(`/developer-section/react-interview/${l.id}`)}
                  style={{ padding: "12px 16px", background: "rgba(251, 191, 36, 0.08)", border: "1px solid rgba(251, 191, 36, 0.2)", borderRadius: "8px", color: "white", fontSize: "0.85rem", textDecoration: "none" }}
                >
                  {l.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        <ul className={styles.grid}>
          {localizedLessons.map((lesson, i) => (
            <motion.li
              key={lesson.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.35 }}
            >
              <Link
                href={createLocalizedPath(`/developer-section/react-interview/${lesson.id}`)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                    {t("react-interview-lesson-label")} {lesson.lessonNumber}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{lesson.title}</h3>
                <p className={styles.cardCategory} style={{ fontSize: "13px", color: "#9fc4ff" }}>
                  {lesson.concept}
                </p>
                <p className={styles.cardCategory} style={{ fontSize: "12px", color: "#7cf4ff", marginTop: "8px" }}>
                  {lesson.description.substring(0, 120)}...
                </p>
                <div className={styles.cardCta}>
                  <span>{t("react-interview-start-lesson")}</span>
                  <ArrowRight className={styles.ctaArrow} />
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      <div className={styles.footerActions}>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/challenges")}>
            {t("algorithm-challenges-link")}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-challenges")}>
            {t("react-challenges-link")}
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            {t("back-to-dev-hub")}
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
