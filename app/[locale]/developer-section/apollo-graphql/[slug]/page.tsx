"use client";

import React, { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import {
  Hub as ApolloIcon,
  Code as CodeIcon,
  MenuBook as ReadIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLang } from "@/lib/i18n";
import { APOLLO_COURSE_LESSONS } from "@/lib/apolloCourseData";
import { TranslationPendingBadge } from "@/components/ui/TranslationPendingBadge";
import type { LessonSection, LessonSectionTag } from "@/lib/webCourseTypes";
import { useCelebration } from "@/components/Celebration/useCelebration";
import { CelebrationOverlay } from "@/components/Celebration/CelebrationOverlay";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import Link from "next/link";
import { HighlightedCode } from "@/components/ui/HighlightedCode";
import { CodeEditor } from "@/components/ui/CodeEditor";
import CourseSidebar from "@/components/Layout/CourseSidebar";

/** Parse body text: **bold** and `code` into React nodes */
function parseSectionBody(body: string, inlineCodeClass: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let key = 0;
  const remaining = body;
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{remaining.slice(lastIndex, match.index)}</span>);
    }
    const raw = match[1];
    if (raw.startsWith("**") && raw.endsWith("**")) {
      parts.push(<strong key={key++}>{raw.slice(2, -2)}</strong>);
    } else if (raw.startsWith("`") && raw.endsWith("`")) {
      parts.push(<code key={key++} className={inlineCodeClass}>{raw.slice(1, -1)}</code>);
    } else {
      parts.push(<span key={key++}>{raw}</span>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < remaining.length) {
    parts.push(<span key={key++}>{remaining.slice(lastIndex)}</span>);
  }
  return parts.length > 0 ? parts : [body];
}

function sectionTagClass(tag: LessonSectionTag): string {
  switch (tag) {
    case "concept": return playStyles.sectionTagConcept;
    case "exercise": return playStyles.sectionTagExercise;
    case "tip": return playStyles.sectionTagTip;
    case "key-point": return playStyles.sectionTagKeyPoint;
    default: return playStyles.sectionTagConcept;
  }
}

function sectionIconClass(tag: LessonSectionTag): string {
  switch (tag) {
    case "concept": return playStyles.sectionIconConcept;
    case "exercise": return playStyles.sectionIconExercise;
    case "tip": return playStyles.sectionIconTip;
    case "key-point": return playStyles.sectionIconKeyPoint;
    default: return playStyles.sectionIconConcept;
  }
}

function SectionShapeIcon({ tag }: { tag: LessonSectionTag }) {
  const iconClass = sectionIconClass(tag);
  if (tag === "concept") {
    return (
      <span className={`${playStyles.sectionIcon} ${iconClass}`} aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" stroke="currentColor" strokeWidth="1.2">
          <path d="M6 1 L11 6 L6 11 L1 6 Z" />
        </svg>
      </span>
    );
  }
  if (tag === "exercise") {
    return (
      <span className={`${playStyles.sectionIcon} ${iconClass}`} aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="4" />
          <path d="M4 6 L5.5 7.5 L8 5" />
        </svg>
      </span>
    );
  }
  if (tag === "tip") {
    return (
      <span className={`${playStyles.sectionIcon} ${iconClass}`} aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 1 L7.5 4.5 L11 5 L8 8 L8.5 12 L6 10 L3.5 12 L4 8 L1 5 L4.5 4.5 Z" />
        </svg>
      </span>
    );
  }
  return (
    <span className={`${playStyles.sectionIcon} ${iconClass}`} aria-hidden>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <circle cx="6" cy="6" r="3" />
      </svg>
    </span>
  );
}

/* ─── Animation variants ─── */
const editorPanelVariants = {
  visible: {
    width: "auto",
    opacity: 1,
    x: 0,
    transition: {
      width: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
      opacity: { duration: 0.35, delay: 0.1, ease: "easeOut" },
      x: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
    },
  },
  hidden: {
    width: 0,
    opacity: 0,
    x: 80,
    transition: {
      opacity: { duration: 0.2, ease: "easeIn" },
      width: { duration: 0.35, delay: 0.05, ease: [0.32, 0.72, 0, 1] },
      x: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
    },
  },
};

const sectionCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const toggleBtnVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.08, boxShadow: "0 0 20px rgba(167, 139, 250, 0.4)" },
  tap: { scale: 0.94 },
};

export default function ApolloGraphQLCourseLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { locale, createLocalizedPath } = useLocale();
  const { t, language } = useLanguage();
  const { celebration, celebrate, onComplete } = useCelebration();
  const lesson = APOLLO_COURSE_LESSONS.find((l) => l.id === slug);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [editorVisible, setEditorVisible] = useState(true);

  const handleVerify = useCallback(
    (code: string) => {
      if (!lesson) return { success: false, message: "" };
      const result = lesson.validationLogic(code, []);
      if (result.success) {
        celebrate("simple");
        return { success: true, message: result.message ?? "Correct!" };
      }
      return { success: false, message: result.message ?? t("not-quite-try-again") };
    },
    [lesson, t, celebrate]
  );

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>{t("course-lesson-not-found")}</p>
          <Link href={createLocalizedPath("/developer-section/apollo-graphql")}>{t("course-back-to-course")}</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <div className={playStyles.lessonLayoutWithSidebar}>
        <CourseSidebar
          lessons={APOLLO_COURSE_LESSONS}
          coursePath="/developer-section/apollo-graphql"
          courseTitle={t("apollo-course-card-title")}
          courseIcon={<ApolloIcon className={playStyles.courseSidebarIcon} />}
          accentClassName={playStyles.courseSidebarApollo}
          currentSlug={slug}
          collapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
          getLessonTitle={(l) => pickLang(language, l.titleEs, l.title)}
        />

        <div className={`${playStyles.courseMain} ${!sidebarCollapsed ? playStyles.courseSidebarOpen : ""}`}>
          <section className={`${playStyles.playSection} ${playStyles.playSectionFullWidth}`}>
            {/* ─── Panel toggle toolbar ─── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 10,
                marginBottom: 18,
              }}
            >
              <motion.button
                variants={toggleBtnVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setEditorVisible((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(167, 139, 250, 0.35)",
                  background: editorVisible
                    ? "rgba(167, 139, 250, 0.12)"
                    : "linear-gradient(135deg, rgba(167, 139, 250, 0.25), rgba(124, 58, 237, 0.2))",
                  color: "#a78bfa",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 0.3s, border-color 0.3s",
                }}
              >
                {editorVisible ? (
                  <>
                    <ReadIcon style={{ fontSize: 18 }} />
                    <span>Focus Mode</span>
                    <ChevronRight style={{ fontSize: 16, opacity: 0.7 }} />
                  </>
                ) : (
                  <>
                    <CodeIcon style={{ fontSize: 18 }} />
                    <span>Show Editor</span>
                    <ChevronLeft style={{ fontSize: 16, opacity: 0.7 }} />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* ─── Main 2-column layout ─── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: editorVisible ? "minmax(320px, 480px) 1fr" : "1fr",
                gap: 28,
                alignItems: "start",
                width: "100%",
                minWidth: 0,
                transition: "grid-template-columns 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
              }}
            >
              {/* ─── Left: Content panel ─── */}
              <motion.div
                layout
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className={playStyles.description}
                style={{ maxWidth: editorVisible ? undefined : 860, margin: editorVisible ? undefined : "0 auto" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={playStyles.descHeader}
                >
                  <span
                    className={playStyles.stepPill}
                    style={{
                      background: "rgba(167, 139, 250, 0.18)",
                      color: "#a78bfa",
                      borderColor: "rgba(167, 139, 250, 0.4)",
                    }}
                  >
                    {t("course-step").toUpperCase()} {lesson.step}
                  </span>
                </motion.div>

                <motion.h1
                  className={playStyles.descTitle}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.45 }}
                >
                  {pickLang(language, lesson.titleEs, lesson.title)}
                </motion.h1>

                <TranslationPendingBadge show={language === "es" && !lesson.contentEs} />

                {/* ─── Cascading section cards ─── */}
                {lesson.sections && lesson.sections.length > 0 ? (
                  <div className={playStyles.contentFontWrap}>
                    {lesson.sections.map((sec: LessonSection, idx: number) => (
                      <motion.div
                        key={`${lesson.id}-${idx}`}
                        custom={idx}
                        variants={sectionCardVariants}
                        initial="hidden"
                        animate="visible"
                        className={playStyles.conceptSectionCard}
                        data-tag={sec.tag}
                      >
                        <span className={`${playStyles.sectionTag} ${sectionTagClass(sec.tag)}`}>
                          <SectionShapeIcon tag={sec.tag} />
                          {sec.tag.replace("-", " ")}
                        </span>
                        {sec.title && <h3 className={playStyles.conceptTitle}>{sec.title}</h3>}
                        <p className={playStyles.conceptBody}>
                          {parseSectionBody(sec.body, playStyles.inlineCode)}
                        </p>
                        {sec.badges && sec.badges.length > 0 && (
                          <motion.div
                            className={playStyles.sectionBadges}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.06 + 0.3, duration: 0.3 }}
                          >
                            {sec.badges.map((b) => (
                              <span key={b} className={playStyles.sectionBadge}>{b}</span>
                            ))}
                          </motion.div>
                        )}
                        {sec.code && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06 + 0.2, duration: 0.35 }}
                          >
                            <HighlightedCode code={sec.code} language="typescript" className={playStyles.sectionCodeBlock} />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  lesson.content.map((paragraph, i) => (
                    <motion.p
                      key={i}
                      className={playStyles.descBody}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                    >
                      {paragraph}
                    </motion.p>
                  ))
                )}

                {/* ─── Prev / Next nav ─── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}
                >
                  {lesson.prevStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/apollo-graphql/${lesson.prevStep}`)}
                      className={styles.secondaryLink}
                    >
                      ← {t("course-previous")}
                    </Link>
                  )}
                  {lesson.nextStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/apollo-graphql/${lesson.nextStep}`)}
                      className={styles.secondaryLink}
                    >
                      {t("course-next")} →
                    </Link>
                  )}
                </motion.div>
              </motion.div>

              {/* ─── Right: Editor panel (animated) ─── */}
              <AnimatePresence mode="popLayout">
                {editorVisible && (
                  <motion.div
                    key="editor-panel"
                    variants={editorPanelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={playStyles.editorColumnWrap}
                    style={{ overflow: "hidden", minWidth: 0 }}
                  >
                    <CodeEditor
                      key={lesson.id}
                      code={lesson.defaultCode}
                      language="typescript"
                      onVerify={handleVerify}
                      verifyButtonLabel={t("verify-button")}
                      collapsePanelsByDefault={false}
                      compactToolbar
                      enableMultiFile
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          <div className={styles.footerActions}>
            <div className={playStyles.footerRow}>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/apollo-graphql")}>
                {t("course-back-to-course")}
              </Link>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
                Developer Hub
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <CelebrationOverlay celebration={celebration} onComplete={onComplete} />
    </main>
  );
}
