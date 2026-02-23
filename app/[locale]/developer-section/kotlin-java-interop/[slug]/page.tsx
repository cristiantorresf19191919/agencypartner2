"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CompareArrows as InteropIcon } from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import CourseSidebar from "@/components/Layout/CourseSidebar";
import { useLocale } from "@/lib/useLocale";
import {
  getKotlinInteropLessonById,
  KOTLIN_JAVA_INTEROP_LESSONS,
  type KotlinInteropPracticeChallenge,
} from "@/lib/kotlinJavaInteropData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import Link from "next/link";
import { HighlightedCode } from "@/components/ui/HighlightedCode";
import { CodeEditor } from "@/components/ui/CodeEditor";

const PISTON_EXECUTE_URL = "/api/execute-code";

function normalizeOutput(s: string): string {
  return (s || "").trim().replace(/\r\n/g, "\n");
}

export default function KotlinJavaInteropLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const lesson = getKotlinInteropLessonById(slug);
  const { createLocalizedPath } = useLocale();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activePractice, setActivePractice] = useState<KotlinInteropPracticeChallenge | null>(null);

  useEffect(() => {
    if (lesson) {
      setActivePractice(null);
    }
  }, [lesson?.id]);

  const loadPractice = useCallback((p: KotlinInteropPracticeChallenge) => {
    setActivePractice(p);
  }, []);

  const runKotlin = useCallback(
    async (source: string, input: string): Promise<{ stdout: string; err?: string }> => {
      const res = await fetch(PISTON_EXECUTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "kotlin",
          version: "*",
          files: [{ name: "Main.kt", content: source }],
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

  const onRunCustom = useCallback(
    async (code: string): Promise<{ logs: string[]; error?: string }> => {
      const hasMain = /fun\s+main\s*\(/.test(code);
      if (!hasMain) {
        return { logs: [], error: "No 'fun main()' found. Add a main function to run." };
      }
      const { stdout, err } = await runKotlin(code, "");
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
        const { stdout, err } = await runKotlin(code, tc.input);
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

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>Lesson not found</p>
          <Link href={createLocalizedPath("/developer-section/kotlin-java-interop")}>Back to course</Link>
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
          lessons={KOTLIN_JAVA_INTEROP_LESSONS}
          coursePath="/developer-section/kotlin-java-interop"
          courseTitle="Kotlin-Java Interop"
          courseIcon={<InteropIcon className={playStyles.courseSidebarIcon} />}
          accentClassName={playStyles.courseSidebarKotlinInterop}
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

                {lesson.codeExamples.length > 0 && (
                  <>
                    <h4 className={playStyles.descSub}>Code examples</h4>
                    {lesson.codeExamples.map((ex, i) => (
                      <div key={i} style={{ marginBottom: "16px" }}>
                        <HighlightedCode code={ex.code} language="kotlin" className={playStyles.sample} style={{ marginTop: "8px" }} />
                        {ex.comment && (
                          <p className={playStyles.descBody} style={{ fontSize: "13px", marginTop: "6px", color: "#9fc4ff" }}>
                            {ex.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {lesson.practice && lesson.practice.length > 0 && (
                  <>
                    <h4 className={playStyles.descSub} style={{ marginTop: "24px" }}>
                      Practice
                    </h4>
                    {lesson.practice.map((p) => (
                      <div key={p.id} className={playStyles.practiceCard}>
                        <div className={playStyles.practiceCardTitle}>
                          {p.title}
                        </div>
                        <p className={playStyles.practiceCardDesc}>
                          {p.description}
                        </p>
                        <button
                          type="button"
                          className={playStyles.iconBtn}
                          onClick={() => loadPractice(p)}
                          style={{ marginRight: "8px" }}
                        >
                          Load in editor
                        </button>
                        {p.solution && (
                          <details style={{ marginTop: "10px" }}>
                            <summary style={{ cursor: "pointer", color: "#7cf4ff", fontSize: "13px" }}>Show solution</summary>
                            <HighlightedCode code={p.solution} language="kotlin" className={playStyles.sample} style={{ marginTop: "8px", fontSize: "12px" }} />
                          </details>
                        )}
                      </div>
                    ))}
                  </>
                )}

                <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {lesson.prevStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/kotlin-java-interop/${lesson.prevStep}`)}
                      className={styles.secondaryLink}
                    >
                      ← Previous
                    </Link>
                  )}
                  {lesson.nextStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/kotlin-java-interop/${lesson.nextStep}`)}
                      className={styles.secondaryLink}
                    >
                      Next →
                    </Link>
                  )}
                </div>
              </div>

              <div className={playStyles.editorColumnWrap}>
                <CodeEditor
                  key={activePractice?.id ?? lesson.id}
                  code={activePractice ? activePractice.starterCode : lesson.defaultCode}
                  language="kotlin"
                  onRunCustom={onRunCustom}
                  onVerify={activePractice && activePractice.testCases.length > 0 ? onVerify : undefined}
                  verifyButtonLabel="Submit"
                  collapsePanelsByDefault={false}
                  compactToolbar
                />
              </div>
            </div>
          </section>

          <div className={styles.footerActions}>
            <div className={playStyles.footerRow}>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/kotlin-java-interop")}>
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
