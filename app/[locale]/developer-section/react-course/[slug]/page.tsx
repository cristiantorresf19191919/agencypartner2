"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Extension as ExtensionIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getReactLessonForLocale } from "@/lib/courseTranslations";
import { REACT_COURSE_LESSONS } from "@/lib/reactCourseData";
import type { LessonSection, LessonSectionTag } from "@/lib/webCourseTypes";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import Link from "next/link";
import { HighlightedCode } from "@/components/ui/HighlightedCode";
import { CodeEditor } from "@/components/ui/CodeEditor";

/** Parse body text: **bold** and `code` into React nodes */
function parseSectionBody(body: string, inlineCodeClass: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let key = 0;
  let remaining = body;
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

export default function ReactCourseLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { locale, createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  // Ensure slug is valid and get lesson - if mismatch, fallback to slug-based lookup
  let lesson = getReactLessonForLocale(locale as "en" | "es", slug);
  // #region agent log
  if (typeof window !== "undefined") {
    const urlPath = window.location.pathname;
    const urlSlug = urlPath.split("/react-course/")[1]?.split("?")[0] || "";
    console.log("[DEBUG] ReactCourseLessonPage render:", { slug, paramSlug: params?.slug, urlSlug, lessonId: lesson?.id, lessonStep: lesson?.step, url: urlPath });
    if (lesson && lesson.id !== slug) {
      console.warn("[DEBUG] Mismatch: lesson.id !== slug", { slug, lessonId: lesson.id, lessonStep: lesson.step });
    }
    if (typeof fetch !== "undefined") {
      fetch("http://127.0.0.1:7244/ingest/df3e12ed-23e9-4e47-b8f7-5cf1f84b911a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "react-course/[slug]/page.tsx:render",
          message: "slug and lesson resolution",
          data: { slug, paramSlug: params?.slug, urlSlug, lessonId: lesson?.id, lessonStep: lesson?.step, lessonTitle: lesson?.title?.slice(0, 40), url: urlPath, mismatch: lesson ? lesson.id !== slug : false },
          timestamp: Date.now(),
          sessionId: "debug-session",
          hypothesisId: "A",
        }),
      }).catch(() => { });
    }
  }
  // #endregion
  // Safeguard: if lesson doesn't match slug, try to get correct lesson from URL
  if (lesson && lesson.id !== slug && typeof window !== "undefined") {
    const urlPath = window.location.pathname;
    const urlSlug = urlPath.split("/react-course/")[1]?.split("?")[0]?.split("#")[0] || "";
    if (urlSlug && urlSlug !== slug) {
      console.warn("[DEBUG] URL slug differs from params slug, trying urlSlug:", urlSlug);
      const correctedLesson = getReactLessonForLocale(locale as "en" | "es", urlSlug);
      if (correctedLesson && correctedLesson.id === urlSlug) {
        lesson = correctedLesson;
      }
    }
  }

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleVerify = useCallback(
    (code: string) => {
      if (!lesson) return { success: false, message: "" };
      const result = lesson.validationLogic(code, []);
      if (result.success) {
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch (_) {}
        return { success: true, message: result.message ?? "Correct!" };
      }
      return { success: false, message: result.message ?? t("not-quite-try-again") };
    },
    [lesson, t]
  );

  // #region agent log
  if (typeof fetch !== "undefined" && lesson && lesson.id !== slug) {
    fetch("http://127.0.0.1:7244/ingest/df3e12ed-23e9-4e47-b8f7-5cf1f84b911a", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "react-course/[slug]/page.tsx:lessonMismatch",
        message: "lesson.id !== slug",
        data: { slug, lessonId: lesson.id, lessonStep: lesson.step },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "B",
      }),
    }).catch(() => {});
  }
  // #endregion

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>{t("course-lesson-not-found")}</p>
          <Link href={createLocalizedPath("/developer-section/react-course")}>{t("course-back-to-course")}</Link>
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
        <aside
          className={`${playStyles.courseSidebar} ${playStyles.courseSidebarReact} ${sidebarCollapsed ? playStyles.courseSidebarCollapsed : ""}`}
          aria-label="React course navigation"
        >
          <div className={playStyles.courseSidebarHeader}>
            <button
              type="button"
              className={playStyles.courseSidebarToggle}
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label={sidebarCollapsed ? t("sidebar-expand") : t("sidebar-collapse")}
              title={sidebarCollapsed ? t("sidebar-expand") : t("sidebar-collapse")}
            >
              {sidebarCollapsed ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
            </button>
            {!sidebarCollapsed && (
              <div className={playStyles.courseSidebarTitle}>
                <ExtensionIcon className={playStyles.courseSidebarIcon} />
                <span>{t("react-course-card-title")}</span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <nav className={playStyles.courseNav}>
              <ul className={playStyles.courseNavList}>
                {REACT_COURSE_LESSONS.map((l) => {
                  const isActive = slug === l.id;
                  // #region agent log
                  if (typeof window !== "undefined") {
                    if (isActive) {
                      console.log("[DEBUG] Sidebar active item:", { slug, listItemId: l.id, listItemStep: l.step, isActive, comparison: `${slug} === ${l.id}` });
                    }
                    if (isActive && typeof fetch !== "undefined") {
                      fetch("http://127.0.0.1:7244/ingest/df3e12ed-23e9-4e47-b8f7-5cf1f84b911a", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          location: "react-course/[slug]/page.tsx:sidebar",
                          message: "sidebar active item",
                          data: { slug, listItemId: l.id, listItemStep: l.step, isActive, url: window.location.pathname },
                          timestamp: Date.now(),
                          sessionId: "debug-session",
                          hypothesisId: "C",
                        }),
                      }).catch(() => { });
                    }
                  }
                  // #endregion
                  const translated = getReactLessonForLocale(locale as "en" | "es", l.id);
                  return (
                    <li key={l.id} className={playStyles.courseNavItemWrap}>
                      <Link
                        href={createLocalizedPath(`/developer-section/react-course/${l.id}`)}
                        className={`${playStyles.courseNavItem} ${isActive ? playStyles.courseNavItemActive : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className={playStyles.courseNavStep}>{t("course-step")} {l.step}</span>
                        <span className={playStyles.courseNavLabel}>{translated?.title ?? l.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </aside>

        <div className={`${playStyles.courseMain} ${!sidebarCollapsed ? playStyles.courseSidebarOpen : ""}`}>
          {!sidebarCollapsed && (
            <div
              className={playStyles.courseMainBackdrop}
              aria-hidden
              onClick={() => setSidebarCollapsed(true)}
              onKeyDown={(e) => e.key === "Escape" && setSidebarCollapsed(true)}
            />
          )}
          <section className={`${playStyles.playSection} ${playStyles.playSectionFullWidth}`}>
            <div className={playStyles.layoutFill}>
              <div className={playStyles.description}>
                {/* #region agent log */}
                {lesson && lesson.id !== slug && typeof window !== "undefined" && (
                  <div style={{ background: "rgba(255, 0, 0, 0.1)", padding: "8px", marginBottom: "12px", borderRadius: "4px", border: "1px solid rgba(255, 0, 0, 0.3)" }}>
                    <strong style={{ color: "#ff6b6b" }}>⚠️ Mismatch detected:</strong> URL slug "{slug}" but lesson.id is "{lesson.id}". Step {lesson.step}.
                  </div>
                )}
                {/* #endregion */}
                <div className={playStyles.descHeader}>
                  <span className={playStyles.stepPill}>
                    {t("course-step").toUpperCase()} {lesson.step}
                  </span>
                </div>
                <h1 className={playStyles.descTitle}>{lesson.title}</h1>

                {lesson.sections && lesson.sections.length > 0 ? (
                  <div className={playStyles.contentFontWrap}>
                    {lesson.sections.map((sec: LessonSection, idx: number) => (
                      <div key={idx} className={playStyles.conceptSectionCard} data-tag={sec.tag}>
                        <span className={`${playStyles.sectionTag} ${sectionTagClass(sec.tag)}`}>
                          <SectionShapeIcon tag={sec.tag} />
                          {sec.tag.replace("-", " ")}
                        </span>
                        {sec.title && <h3 className={playStyles.conceptTitle}>{sec.title}</h3>}
                        <p className={playStyles.conceptBody}>
                          {parseSectionBody(sec.body, playStyles.inlineCode)}
                        </p>
                        {sec.badges && sec.badges.length > 0 && (
                          <div className={playStyles.sectionBadges}>
                            {sec.badges.map((b) => (
                              <span key={b} className={playStyles.sectionBadge}>{b}</span>
                            ))}
                          </div>
                        )}
                        {sec.code && (
                          <HighlightedCode code={sec.code} language="tsx" className={playStyles.sectionCodeBlock} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  lesson.content.map((paragraph, i) => (
                    <p key={i} className={playStyles.descBody}>
                      {paragraph}
                    </p>
                  ))
                )}

                <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {lesson.prevStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/react-course/${lesson.prevStep}`)}
                      className={styles.secondaryLink}
                    >
                      ← {t("course-previous")}
                    </Link>
                  )}
                  {lesson.nextStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/react-course/${lesson.nextStep}`)}
                      className={styles.secondaryLink}
                    >
                      {t("course-next")} →
                    </Link>
                  )}
                </div>
              </div>

              <div className={playStyles.editorColumnWrap}>
                <CodeEditor
                  key={lesson.id}
                  code={lesson.defaultCode}
                  language="tsx"
                  onVerify={handleVerify}
                  verifyButtonLabel={t("verify-button")}
                  collapsePanelsByDefault={false}
                />
              </div>
            </div>
          </section>

          <div className={styles.footerActions}>
            <div className={playStyles.footerRow}>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-course")}>
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
    </main>
  );
}
