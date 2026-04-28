"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { Palette as PaletteIcon } from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import CourseSidebar from "@/components/Layout/CourseSidebar";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { pickLang } from "@/lib/i18n";
import { getCssLessonById, CSS_COURSE_LESSONS } from "@/lib/cssCourseData";
import { TranslationPendingBadge } from "@/components/ui/TranslationPendingBadge";
import { useCelebration } from "@/components/Celebration/useCelebration";
import { CelebrationOverlay } from "@/components/Celebration/CelebrationOverlay";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import Link from "next/link";
import { HighlightedCode } from "@/components/ui/HighlightedCode";
import { CodeEditor } from "@/components/ui/CodeEditor";

export default function CssCourseLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const lesson = getCssLessonById(slug);
  const { createLocalizedPath } = useLocale();
  const { t, language } = useLanguage();
  const { celebration, celebrate, onComplete } = useCelebration();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [previewHtml, setPreviewHtml] = useState("");

  const onRunCustom = useCallback(
    (code: string): { logs: string[]; error?: string } => {
      if (!lesson?.initialHTML) {
        return { logs: [], error: "No HTML structure for this lesson." };
      }
      const baseCss = lesson.initialCSS || "";
      const finalCss = `${baseCss}\n${code}`;
      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <style>${finalCss}</style>
</head>
<body>
  ${lesson.initialHTML}
</body>
</html>`;
      setPreviewHtml(fullHtml);
      return { logs: ["Preview rendered below."] };
    },
    [lesson]
  );

  const onVerify = useCallback(
    (code: string): { success: boolean; message: string } => {
      if (!lesson) return { success: false, message: "" };
      const result = lesson.validationLogic(code, []);
      if (result.success) {
        celebrate("simple");
        return { success: true, message: result.message || t("course-correct") };
      }
      return { success: false, message: result.message || t("not-quite-try-again") };
    },
    [lesson]
  );

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>{t("course-lesson-not-found")}</p>
          <Link href={createLocalizedPath("/developer-section/css-course")}>{t("course-back-to-course")}</Link>
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
          lessons={CSS_COURSE_LESSONS}
          coursePath="/developer-section/css-course"
          courseTitle="CSS Course"
          courseIcon={<PaletteIcon className={playStyles.courseSidebarIcon} />}
          accentClassName={playStyles.courseSidebarCss}
          currentSlug={slug}
          collapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
          getLessonTitle={(l) => pickLang(language, l.titleEs, l.title)}
        />

        <div className={`${playStyles.courseMain} ${!sidebarCollapsed ? playStyles.courseSidebarOpen : ""}`}>
          <section className={`${playStyles.playSection} ${playStyles.playSectionFullWidth}`}>
            <div className={playStyles.layoutFill}>
              <div className={playStyles.description}>
                <div className={playStyles.descHeader}>
                  <span className={playStyles.stepPill}>
                    {t("course-step").toUpperCase()} {lesson.step}
                  </span>
                </div>
                <h1 className={playStyles.descTitle}>{pickLang(language, lesson.titleEs, lesson.title)}</h1>
                <TranslationPendingBadge show={language === "es" && !lesson.contentEs} />
                {lesson.content.map((paragraph, i) => (
                  <p key={i} className={playStyles.descBody}>
                    {paragraph}
                  </p>
                ))}
                {lesson.initialHTML && (
                  <>
                    <h4 className={playStyles.descSub}>{t("course-html-structure")}</h4>
                    <HighlightedCode code={lesson.initialHTML} language="html" className={playStyles.sample} style={{ fontSize: "12px", overflow: "auto" }} />
                  </>
                )}
                <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {lesson.prevStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/css-course/${lesson.prevStep}`)}
                      className={styles.secondaryLink}
                    >
                      ← {t("course-previous")}
                    </Link>
                  )}
                  {lesson.nextStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/css-course/${lesson.nextStep}`)}
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
                  language="css"
                  onRunCustom={onRunCustom}
                  onVerify={onVerify}
                  verifyButtonLabel={t("verify-button")}
                  collapsePanelsByDefault={false}
                  compactToolbar
                />

                {previewHtml && (
                  <div className={playStyles.outputPanel} style={{ marginTop: "16px" }}>
                    <div className={playStyles.outputHead}>{t("course-preview")}</div>
                    <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", minHeight: "200px", border: "1px solid rgba(0,0,0,0.1)" }}>
                      <iframe
                        title="css-preview"
                        srcDoc={previewHtml}
                        style={{ width: "100%", minHeight: "200px", border: "none", borderRadius: "4px" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className={styles.footerActions}>
            <div className={playStyles.footerRow}>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/css-course")}>
                {t("course-back-to-course")}
              </Link>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
                {t("course-developer-hub")}
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
