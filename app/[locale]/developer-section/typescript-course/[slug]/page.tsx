"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
// @ts-ignore
import * as Babel from "@babel/standalone";
import { Code as CodeIcon } from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import CourseSidebar from "@/components/Layout/CourseSidebar";
import { useLocale } from "@/lib/useLocale";
import { getTypeScriptLessonById, TYPESCRIPT_COURSE_LESSONS } from "@/lib/typescriptCourseData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import Link from "next/link";
import { CodeEditor } from "@/components/ui/CodeEditor";

function runTypeScriptInSandbox(code: string): { logs: string[]; error?: string } {
  const logs: string[] = [];
  const mockConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
    },
  };
  try {
    let jsCode = code
      .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "")
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, "")
      .replace(/\s+as\s+\w+(?:\s*\|\s*\w+)*/g, "")
      .replace(/\):\s*(?:string|number|boolean|void|any|\w+\s*\|\s*\w+)\s*{/g, ") {")
      .replace(/(let|const|var)\s+(\w+):\s*[^=;,\n\[\]]+(?:\[\])?/g, "$1 $2");
    try {
      jsCode =
        Babel.transform(jsCode, {
          presets: ["env", "typescript"],
          sourceType: "module",
          filename: "lesson.ts",
        }).code || jsCode;
    } catch (_) {}
    const fn = new Function("console", jsCode);
    fn(mockConsole);
    return { logs };
  } catch (e: unknown) {
    return { logs, error: e instanceof Error ? e.message : String(e) };
  }
}

export default function TypeScriptCourseLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const lesson = getTypeScriptLessonById(slug);
  const { createLocalizedPath } = useLocale();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const onRunCustom = useCallback((code: string) => runTypeScriptInSandbox(code), []);

  const onVerify = useCallback(
    (code: string) => {
      if (!lesson) return { success: false, message: "" };
      const { logs: out } = runTypeScriptInSandbox(code);
      const result = lesson.validationLogic(code, out);
      if (result.success) {
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch (_) {}
        return { success: true, message: result.message ?? "Correct!" };
      }
      return { success: false, message: result.message ?? "Not quite. Try again." };
    },
    [lesson]
  );

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>Lesson not found</p>
          <Link href={createLocalizedPath("/developer-section/typescript-course")}>Back to course</Link>
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
          lessons={TYPESCRIPT_COURSE_LESSONS}
          coursePath="/developer-section/typescript-course"
          courseTitle="TypeScript Course"
          courseIcon={<CodeIcon className={playStyles.courseSidebarIcon} />}
          accentClassName={playStyles.courseSidebarTypescript}
          currentSlug={slug}
          collapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
        />

        <div className={`${playStyles.courseMain} ${!sidebarCollapsed ? playStyles.courseSidebarOpen : ""}`}>
          <section className={`${playStyles.playSection} ${playStyles.playSectionFullWidth}`}>
            <div className={playStyles.layoutFill}>
              <div className={playStyles.description}>
                <div className={playStyles.descHeader}>
                  <span className={playStyles.stepPill}>
                    STEP {lesson.step}
                  </span>
                </div>
                <h1 className={playStyles.descTitle}>{lesson.title}</h1>
                {lesson.content.map((paragraph, i) => (
                  <p key={i} className={playStyles.descBody}>
                    {paragraph}
                  </p>
                ))}
                <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {lesson.prevStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/typescript-course/${lesson.prevStep}`)}
                      className={styles.secondaryLink}
                    >
                      ← Previous
                    </Link>
                  )}
                  {lesson.nextStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/typescript-course/${lesson.nextStep}`)}
                      className={styles.secondaryLink}
                    >
                      Next →
                    </Link>
                  )}
                </div>
              </div>

              <div className={playStyles.editorColumnWrap}>
                <CodeEditor
                  key={lesson.id}
                  code={lesson.defaultCode}
                  language="typescript"
                  onRunCustom={onRunCustom}
                  onVerify={onVerify}
                  verifyButtonLabel="Verify"
                  collapsePanelsByDefault={false}
                  compactToolbar
                  enableMultiFile
                />
              </div>
            </div>
          </section>

          <div className={styles.footerActions}>
            <div className={playStyles.footerRow}>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/typescript-course")}>
                Back to course
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
