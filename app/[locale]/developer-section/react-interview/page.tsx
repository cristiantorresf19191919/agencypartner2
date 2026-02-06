"use client";

import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { REACT19_LESSONS } from "@/lib/react19InterviewData";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { motion } from "framer-motion";
import { Code as CodeIcon, ArrowForward as ArrowRight, School as SchoolIcon } from "@mui/icons-material";
import Link from "next/link";
import styles from "../challenges/ChallengesPage.module.css";

function React19FeaturesShowcase() {
  return (
    <div className={styles.react19Showcase}>
      <h2 className={styles.showcaseTitle}>
        React 19: The <span className={styles.gradient}>Async Revolution</span>
      </h2>
      <p className={styles.showcaseSubtitle}>
        A crash course on the new primitives designed for speed, concurrency, and effortless state management.
      </p>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={`${styles.featureIcon} ${styles.lightning}`}>&#9889;</span>
            <h3 className={styles.featureTitle}>1. The use() Hook</h3>
          </div>
          <p className={styles.featureDesc}>
            Unwrap promises directly in render. React automatically suspends the component until data is ready.
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
            <h3 className={styles.featureTitle}>2. Action Hooks</h3>
          </div>
          <p className={styles.featureDesc}>
            Automate form lifecycles. <code>useActionState</code> tracks pending status &amp; errors automatically.
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
            <h3 className={styles.featureTitle}>3. &lt;Activity&gt;</h3>
          </div>
          <p className={styles.featureDesc}>
            Mark trees as hidden to preserve scroll position and state without active resource consumption.
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
            <h3 className={styles.featureTitle}>4. useEffectEvent</h3>
          </div>
          <p className={styles.featureDesc}>
            Extract non-reactive logic. Ensure your effect only re-runs when specific dependencies change.
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
          <p className={styles.stepText}>Refactor complex forms first.</p>
        </div>
        <div className={styles.stepCard}>
          <span className={styles.stepLabel}>Step 2</span>
          <p className={styles.stepText}>Embrace Suspense boundaries.</p>
        </div>
        <div className={styles.stepCard}>
          <span className={styles.stepLabel}>Step 3</span>
          <p className={styles.stepText}>Keep existing code; use for new features.</p>
        </div>
      </div>
    </div>
  );
}

export default function ReactInterviewLandingPage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SchoolIcon fontSize="small" />
          <span>React 19 Interview Prep</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Master React 19 Features
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          Learn React 19's revolutionary features through interactive lessons with live code editors,
          previews, and real-world examples. Perfect for interview preparation.
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <CodeIcon fontSize="small" />
            React 19
          </span>
          <span className={styles.badge}>Interactive Lessons</span>
          <span className={styles.badge}>{REACT19_LESSONS.length} Lessons</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <React19FeaturesShowcase />
        </motion.div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>All Lessons</span>
          <span className={styles.count}>{REACT19_LESSONS.length} lessons</span>
        </div>
        <ul className={styles.grid}>
          {REACT19_LESSONS.map((lesson, i) => (
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
                    Lesson {lesson.lessonNumber}
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
                  <span>Start Lesson</span>
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
            Algorithm Challenges
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-challenges")}>
            React Challenges
          </a>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Back to Developer Hub
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
