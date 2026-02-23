"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle as CheckIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import KotlinDocLessonLayout from "@/components/Layout/KotlinDocLessonLayout";
import CourseSidebar from "@/components/Layout/CourseSidebar";
import { getCoroutinesBasicsDoc, getCoroutinesChannelsDoc, getKotlinLessonForLocale } from "@/lib/courseTranslations";
import { HighlightedCode } from "@/components/ui/HighlightedCode";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperSectionFont } from "@/contexts/DeveloperSectionFontContext";
import { KOTLIN_COURSE_LESSONS, type KotlinPracticeChallenge } from "@/lib/kotlinCourseData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import Link from "next/link";

const PISTON_EXECUTE_URL = "/api/execute-code";


/** Wraps Kotlin keywords and terms in <code> for highlighting. */
function highlightKeywords(text: string, codeClass: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\b(fun|val|var)\b|main\s*\(\)|println\s*\(\)|print\s*\(\)|\{\}|[=]\s*|\$[a-zA-Z_]\w*|\$\{[^}]*\})/g;
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    parts.push(<code key={key++} className={codeClass}>{m[0]}</code>);
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : [text];
}

function normalizeOutput(s: string): string {
  return (s || "").trim().replace(/\r\n/g, "\n");
}

export default function KotlinCourseLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { locale, createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const lesson = getKotlinLessonForLocale(locale as "en" | "es", slug);

  const { contentFontSize } = useDeveloperSectionFont();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activePractice, setActivePractice] = useState<KotlinPracticeChallenge | null>(null);
  const [activeExampleIdx, setActiveExampleIdx] = useState<number | null>(null);
  const [snippetOutputs, setSnippetOutputs] = useState<Record<number, { output?: string; error?: string; running?: boolean }>>({});

  const isCoroutinesLesson = lesson?.id === "coroutines-basics" || lesson?.id === "coroutines-and-channels";

  useEffect(() => {
    if (lesson) {
      setActivePractice(null);
      setActiveExampleIdx(null);
      setSnippetOutputs({});
    }
  }, [lesson?.id]);

  /* Reading mode: hide FABs when scrolling down, show when scrolling up */
  useEffect(() => {
    const threshold = 36;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop;
        const delta = y - lastScrollY;
        if (delta > threshold) {
          document.body.setAttribute("data-doc-reading-scroll", "down");
        } else if (delta < -threshold) {
          document.body.setAttribute("data-doc-reading-scroll", "up");
        }
        lastScrollY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.removeAttribute("data-doc-reading-scroll");
    };
  }, []);

  const loadPractice = useCallback((p: KotlinPracticeChallenge) => {
    setActivePractice(p);
    setActiveExampleIdx(null);
  }, []);

  const loadExample = useCallback((idx: number) => {
    setActiveExampleIdx(idx);
    setActivePractice(null);
  }, []);

  const runKotlin = useCallback(
    async (fileContents: { name: string; content: string }[], input: string): Promise<{ stdout: string; err?: string }> => {
      if (fileContents.length === 0) return { stdout: "", err: "No Kotlin files to run." };
      const res = await fetch(PISTON_EXECUTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "kotlin",
          version: "*",
          files: fileContents,
          stdin: input,
          args: [],
        }),
      });
      if (!res.ok) return { stdout: "", err: `HTTP ${res.status}` };
      const d = (await res.json()) as {
        compile?: { stderr?: string; code?: number };
        run?: { stdout?: string; stderr?: string; code?: number };
        message?: string;
      };
      if (d.message) return { stdout: "", err: d.message };
      if (d.compile && d.compile.code !== 0)
        return { stdout: "", err: (d.compile.stderr || "Compilation failed").trim() };
      const run = d.run ?? {};
      if (run.code !== 0 && run.stderr)
        return { stdout: (run.stdout || "").trim(), err: run.stderr.trim() };
      return { stdout: (run.stdout || "").trim() };
    },
    []
  );

  const runSnippet = useCallback(
    async (index: number, code: string) => {
      setSnippetOutputs((prev) => ({ ...prev, [index]: { running: true } }));
      const hasMain = /fun\s+main\s*\(/.test(code);
      const content = hasMain ? code : `fun main() {\n${code}\n}`;
      const { stdout, err } = await runKotlin([{ name: "Main", content }], "");
      const needsCoroutines =
        err &&
        (/unresolved reference: kotlinx|unresolved reference: delay|unresolved reference: withContext|unresolved reference: Dispatchers/i.test(err) ||
          /suspension functions can be called only within coroutine/i.test(err));
      const friendlyError = needsCoroutines
        ? (err || "") + "\n\nThis example uses kotlinx.coroutines, which isn't available in the inline runner. Use \"Open in Playground →\" to run it in the Kotlin Playground."
        : err;
      setSnippetOutputs((prev) => ({
        ...prev,
        [index]: { output: stdout || undefined, error: friendlyError ?? undefined, running: false },
      }));
    },
    [runKotlin]
  );

  const onRunCustom = useCallback(
    async (code: string): Promise<{ logs: string[]; error?: string }> => {
      const hasMain = /fun\s+main\s*\(/.test(code);
      if (!hasMain) {
        return { logs: [], error: "No 'fun main()' found. Add a main function to run." };
      }
      const { stdout, err } = await runKotlin([{ name: "Main", content: code }], "");
      const logs = stdout ? stdout.split("\n") : [];
      return { logs, error: err || undefined };
    },
    [runKotlin]
  );

  const onVerify = useCallback(
    async (code: string): Promise<{ success: boolean; message: string }> => {
      if (!activePractice || !activePractice.testCases.length) {
        return { success: false, message: "No test cases to verify." };
      }
      let passed = 0;
      const total = activePractice.testCases.length;
      for (const tc of activePractice.testCases) {
        const { stdout, err } = await runKotlin([{ name: "Main", content: code }], tc.input);
        if (err) {
          return { success: false, message: err };
        }
        if (normalizeOutput(stdout) === normalizeOutput(tc.output)) passed++;
      }
      const success = passed === total;
      if (success) {
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch (_) {}
      }
      return {
        success,
        message: success ? "All tests passed!" : `${passed}/${total} tests passed.`,
      };
    },
    [activePractice, runKotlin]
  );

  /* Compute which code to show in the CodeEditor */
  const editorCode = activePractice
    ? activePractice.starterCode
    : activeExampleIdx !== null && lesson?.codeExamples[activeExampleIdx]
      ? lesson.codeExamples[activeExampleIdx].code
      : lesson?.defaultCode ?? "";

  const editorKey = activePractice?.id
    ?? (activeExampleIdx !== null ? `example-${activeExampleIdx}` : lesson?.id ?? "");

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>{t("course-lesson-not-found")}</p>
          <Link href={createLocalizedPath("/developer-section/kotlin-course")}>{t("course-back-to-course")}</Link>
        </div>
        <Footer />
      </main>
    );
  }

  /* Shared prev/next navigation links */
  const navLinks = (
    <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {lesson.prevStep && (
        <Link
          href={createLocalizedPath(`/developer-section/kotlin-course/${lesson.prevStep}`)}
          className={styles.secondaryLink}
        >
          ← {t("course-previous")}
        </Link>
      )}
      {lesson.nextStep && (
        <Link
          href={createLocalizedPath(`/developer-section/kotlin-course/${lesson.nextStep}`)}
          className={styles.secondaryLink}
        >
          {t("course-next")} →
        </Link>
      )}
    </div>
  );

  /* Shared CodeEditor block */
  const editorBlock = (
    <div className={playStyles.editorColumnWrap}>
      <CodeEditor
        key={editorKey}
        code={editorCode}
        language="kotlin"
        onRunCustom={onRunCustom}
        onVerify={activePractice && activePractice.testCases.length > 0 ? onVerify : undefined}
        verifyButtonLabel="Submit"
        collapsePanelsByDefault={false}
        compactToolbar
      />
      <Link
        href={createLocalizedPath("/developer-section/kotlin-playground")}
        className={playStyles.openInPlayground}
      >
        Open in Playground &rarr;
      </Link>
    </div>
  );

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <div className={playStyles.lessonLayoutWithSidebar}>
        <CourseSidebar
          lessons={KOTLIN_COURSE_LESSONS}
          coursePath="/developer-section/kotlin-course"
          courseTitle="Kotlin Course"
          courseIcon={<SchoolIcon className={playStyles.courseSidebarIcon} />}
          currentSlug={slug}
          collapsed={sidebarCollapsed}
          onToggle={setSidebarCollapsed}
          getLessonTitle={(l) => getKotlinLessonForLocale(locale as "en" | "es", l.id)?.title ?? l.title}
        />

        <div className={`${playStyles.courseMain} ${!sidebarCollapsed ? playStyles.courseSidebarOpen : ""}`}>
          {isCoroutinesLesson ? (
            /* ─── Coroutines lessons: stacked doc layout ─── */
            <section className={`${playStyles.playSection} ${playStyles.playSectionStacked}`}>
              <div className={playStyles.layoutStacked}>
                <div className={playStyles.description}>
                  <div className={playStyles.descHeader}>
                    <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                      {t("course-step")} {lesson.step}
                    </span>
                  </div>
                  <KotlinDocLessonLayout
                    toc={lesson.id === "coroutines-basics"
                      ? getCoroutinesBasicsDoc(locale as "en" | "es").toc
                      : getCoroutinesChannelsDoc(locale as "en" | "es").toc}
                    blocks={lesson.id === "coroutines-basics"
                      ? getCoroutinesBasicsDoc(locale as "en" | "es").blocks
                      : getCoroutinesChannelsDoc(locale as "en" | "es").blocks}
                    runSnippet={runSnippet}
                    snippetOutputs={snippetOutputs}
                    createLocalizedPath={createLocalizedPath}
                    contentFontSize={contentFontSize}
                  />
                  {navLinks}
                </div>

                <div className={playStyles.editorSectionBottom}>
                  {editorBlock}
                </div>
              </div>
            </section>
          ) : (
            /* ─── Regular lessons: side-by-side layout (same as React/TS/CSS) ─── */
            <section className={`${playStyles.playSection} ${playStyles.playSectionFullWidth}`}>
              <div className={playStyles.layoutFill}>
                <div className={playStyles.description}>
                  <div className={playStyles.descHeader}>
                    <span className={playStyles.stepPill}>
                      {t("course-step").toUpperCase()} {lesson.step}
                    </span>
                  </div>
                  <div className={playStyles.contentFontWrap} style={{ fontSize: contentFontSize }}>
                    <h1 className={playStyles.descTitle}>{lesson.title}</h1>

                    {lesson.content.map((item, i) => {
                      if (typeof item !== "string") {
                        if (item.type === "image") {
                          return (
                            <figure key={i} style={{ margin: "16px 0" }}>
                              <img
                                src={item.src}
                                alt={item.alt}
                                style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                              />
                              {item.alt ? (
                                <figcaption className={playStyles.descBody} style={{ marginTop: "8px", fontSize: "13px", color: "#9fc4ff" }}>
                                  {item.alt}
                                </figcaption>
                              ) : null}
                            </figure>
                          );
                        }
                        return null;
                      }
                      const s = item.trim();
                      const sectionMatch = s.match(/^(In Kotlin:|Variables —|String templates —|[\s\S]+? —)\s*([\s\S]*)/);
                      if (sectionMatch) {
                        const [, title, body] = sectionMatch;
                        return (
                          <div key={i} className={playStyles.conceptSection}>
                            <h3 className={playStyles.conceptTitle}>{title.replace(" —", "")}</h3>
                            <p className={playStyles.conceptBody}>
                              {highlightKeywords(body.trim(), playStyles.inlineCode)}
                            </p>
                          </div>
                        );
                      }
                      if (/^We recommend\./i.test(s) || (s.length < 180 && (s.includes("by default") || s.includes("can't change")))) {
                        return (
                          <div key={i} className={playStyles.callout}>
                            <span className={playStyles.calloutIcon} aria-hidden>i</span>
                            <p className={playStyles.calloutText}>
                              {highlightKeywords(s, playStyles.inlineCode)}
                            </p>
                          </div>
                        );
                      }
                      return (
                        <p key={i} className={playStyles.conceptBody}>
                          {highlightKeywords(s, playStyles.inlineCode)}
                        </p>
                      );
                    })}

                    {lesson.codeExamples.length > 0 && (
                      <>
                        <h4 className={playStyles.descSub} style={{ marginTop: "28px" }}>Code examples</h4>
                        {lesson.codeExamples.map((ex, i) => (
                          <div key={i} style={{ marginBottom: "16px" }}>
                            <HighlightedCode code={ex.code} language="kotlin" className={playStyles.sample} style={{ marginTop: "8px" }} />
                            {ex.comment && (
                              <p className={playStyles.conceptBody} style={{ padding: "10px 14px", margin: 0, fontSize: "13px", color: "#9fc4ff" }}>
                                {ex.comment}
                              </p>
                            )}
                            <button
                              type="button"
                              className={playStyles.iconBtn}
                              onClick={() => loadExample(i)}
                              style={{ marginTop: "6px" }}
                            >
                              {t("course-load-in-editor")}
                            </button>
                          </div>
                        ))}
                      </>
                    )}

                    {lesson.practice && lesson.practice.length > 0 && (
                      <>
                        <h4 className={playStyles.descSub} style={{ marginTop: "28px" }}>
                          {t("course-practice")}
                        </h4>
                        {lesson.practice.map((p) => (
                          <div key={p.id} className={playStyles.practiceCard}>
                            <div className={playStyles.practiceCardTitle}>
                              <CheckIcon fontSize="small" /> {p.title}
                            </div>
                            <p className={playStyles.practiceCardDesc}>{p.description}</p>
                            <button
                              type="button"
                              className={playStyles.iconBtn}
                              onClick={() => loadPractice(p)}
                              style={{ marginRight: "8px" }}
                            >
                              {t("course-load-in-editor")}
                            </button>
                            {p.solution && (
                              <details style={{ marginTop: "12px" }}>
                                <summary style={{ cursor: "pointer", color: "#7cf4ff", fontSize: "13px" }}>Example solution</summary>
                                <HighlightedCode code={p.solution} language="kotlin" className={playStyles.sample} style={{ marginTop: "8px", fontSize: "12px" }} />
                              </details>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {navLinks}
                  </div>
                </div>

                {editorBlock}
              </div>
            </section>
          )}

          <div className={styles.footerActions}>
            <div className={playStyles.footerRow}>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/kotlin-course")}>
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
