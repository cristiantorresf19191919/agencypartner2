"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  Terminal as TerminalIcon,
  CheckCircle as CheckIcon,
  IntegrationInstructions as KotlinIcon,
  Lightbulb as HintIcon,
  Visibility as SolutionIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Bolt as BoltIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getReactorChallengeById, REACTOR_CHALLENGES } from "@/lib/reactorChallengesData";
import confetti from "canvas-confetti";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import styles from "./ReactorPlay.module.css";
import type { OnMount } from "@monaco-editor/react";

const PISTON_EXECUTE_URL = "https://emkc.org/api/v2/piston/execute";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={playStyles.editorLoading}>
      <div className={playStyles.loadingSpinner} />
      <p>Loading editor…</p>
    </div>
  ),
});

// --- Attempt tracking ---
const STORAGE_PREFIX = "reactor-challenge-attempts-";
const COMPLETED_KEY = "reactor-challenges-completed";

function getAttemptCount(id: string): number {
  try { return parseInt(localStorage.getItem(`${STORAGE_PREFIX}${id}`) || "0", 10); } catch { return 0; }
}
function incrementAttemptCount(id: string): number {
  const n = getAttemptCount(id) + 1;
  try { localStorage.setItem(`${STORAGE_PREFIX}${id}`, String(n)); } catch { }
  return n;
}
function resetAttemptCount(id: string) {
  try { localStorage.removeItem(`${STORAGE_PREFIX}${id}`); } catch { }
}
function markCompleted(id: string) {
  try {
    const stored = localStorage.getItem(COMPLETED_KEY);
    const set: string[] = stored ? JSON.parse(stored) : [];
    if (!set.includes(id)) { set.push(id); localStorage.setItem(COMPLETED_KEY, JSON.stringify(set)); }
  } catch { }
}

export default function ReactorChallengePlayPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const challenge = getReactorChallengeById(slug);
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const [code, setCode] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ passed: number; total: number; success: boolean } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [kotlinPhase, setKotlinPhase] = useState<"idle" | "sending" | "compiling" | "running">("idle");
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);

  // Navigation
  const currentIndex = REACTOR_CHALLENGES.findIndex((c) => c.id === slug);
  const prevChallenge = currentIndex > 0 ? REACTOR_CHALLENGES[currentIndex - 1] : null;
  const nextChallenge = currentIndex < REACTOR_CHALLENGES.length - 1 ? REACTOR_CHALLENGES[currentIndex + 1] : null;

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode);
      setError(null);
      setLogs([]);
      setSubmitResult(null);
      setShowSuccess(false);
      setShowHints(false);
      setShowSolution(false);
      setAttemptCount(getAttemptCount(challenge.id));
    }
  }, [challenge?.id]);

  const resetToStarter = useCallback(() => {
    if (!challenge) return;
    setCode(challenge.starterCode);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    setShowSuccess(false);
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse("file:///reactor.kt"));
      if (model) model.setValue(challenge.starterCode);
    }
  }, [challenge]);

  const getEditorCode = useCallback((): string => {
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse("file:///reactor.kt"));
      if (model) return model.getValue();
    }
    return code;
  }, [code]);

  // --- Kotlin runner (Piston API) ---
  const runKotlin = useCallback(async (source: string, showPhases = true): Promise<{ stdout: string; err?: string }> => {
    const hasMainFn = /fun\s+main\s*\(/.test(source);
    const wrappedSource = hasMainFn ? source : `fun main() {\n${source}\n}`;

    if (showPhases) setKotlinPhase("sending");

    const res = await fetch(PISTON_EXECUTE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: "kotlin", version: "*", files: [{ name: "Main.kt", content: wrappedSource }], stdin: "", args: [] }),
    });

    if (!res.ok) {
      if (showPhases) setKotlinPhase("idle");
      return { stdout: "", err: `HTTP ${res.status}` };
    }

    if (showPhases) setKotlinPhase("compiling");
    await new Promise((r) => setTimeout(r, 300));

    const d = (await res.json()) as {
      compile?: { stderr?: string; code?: number };
      run?: { stdout?: string; stderr?: string; code?: number };
      message?: string;
    };

    if (d.message) { if (showPhases) setKotlinPhase("idle"); return { stdout: "", err: d.message }; }
    if (d.compile && d.compile.code !== 0) {
      if (showPhases) setKotlinPhase("idle");
      return { stdout: "", err: (d.compile.stderr || "Compilation failed").trim() };
    }

    if (showPhases) setKotlinPhase("running");
    await new Promise((r) => setTimeout(r, 200));

    const run = d.run ?? {};
    if (showPhases) setKotlinPhase("idle");

    if (run.code !== 0 && run.stderr) return { stdout: (run.stdout || "").trim(), err: run.stderr.trim() };
    return { stdout: (run.stdout || "").trim() };
  }, []);

  const runCode = useCallback(async () => {
    if (!challenge) return;
    setIsRunning(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    const src = getEditorCode();

    const { stdout, err } = await runKotlin(src, true);
    setLogs(stdout ? stdout.split("\n") : []);
    if (err) setError(err);
    setIsRunning(false);
  }, [challenge, getEditorCode, runKotlin]);

  const submitCode = useCallback(async () => {
    if (!challenge) return;
    setIsSubmitting(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    setShowSuccess(false);
    const src = getEditorCode();

    // Step 1: Run code validation (regex tests)
    let codePassed = 0;
    const codeTotal = challenge.testCases.length;
    for (const tc of challenge.testCases) {
      if (tc.validate(src)) codePassed++;
    }

    // Step 2: Run code and check output
    const { stdout, err } = await runKotlin(src, true);
    if (err) {
      setError(err);
      setLogs(stdout ? stdout.split("\n") : []);
      setSubmitResult({ passed: codePassed, total: codeTotal + 1, success: false });
      const newCount = incrementAttemptCount(challenge.id);
      setAttemptCount(newCount);
      if (newCount >= 10) setShowSolution(true);
      setIsSubmitting(false);
      return;
    }

    setLogs(stdout ? stdout.split("\n") : []);

    // Check if output matches expected
    const outputMatches = normalizeOutput(stdout) === normalizeOutput(challenge.expectedOutput);
    const totalTests = codeTotal + 1;
    const totalPassed = codePassed + (outputMatches ? 1 : 0);
    const success = totalPassed === totalTests;

    setSubmitResult({ passed: totalPassed, total: totalTests, success });

    if (success) {
      setShowSuccess(true);
      resetAttemptCount(challenge.id);
      markCompleted(challenge.id);
      // Multi-burst confetti celebration
      try {
        const duration = 2000;
        const end = Date.now() + duration;
        const colors = ["#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ff9800"];
        (function frame() {
          confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
          confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
        setTimeout(() => {
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors });
        }, 300);
      } catch (_) { }
    } else {
      const newCount = incrementAttemptCount(challenge.id);
      setAttemptCount(newCount);
      if (newCount >= 10) setShowSolution(true);
    }
    setIsSubmitting(false);
  }, [challenge, getEditorCode, runKotlin]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); runCode(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [runCode]);

  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    fontLigatures: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    formatOnPaste: true,
    formatOnType: true,
  }), []);

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
  };

  if (!challenge) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={styles.notFound}>
          <p>{t("challenge-not-found") || "Challenge not found"}</p>
          <a href={createLocalizedPath("/developer-section/reactor-challenges")}>{t("challenge-back") || "Back"}</a>
        </div>
        <Footer />
      </main>
    );
  }

  const remainingAttempts = Math.max(0, 10 - attemptCount);

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.playSection}>
        {/* Topic breadcrumb */}
        <div className={styles.breadcrumb}>
          <a href={createLocalizedPath("/developer-section/reactor-challenges")} className={styles.breadcrumbLink}>
            {t("reactor-challenges-title") || "Reactor Challenges"}
          </a>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbTopic}>{challenge.topic}</span>
        </div>

        <div className={styles.layout}>
          {/* Left: description */}
          <div className={styles.description}>
            <div className={styles.descHeader}>
              <span className={`${styles.difficulty} ${styles[challenge.difficulty.toLowerCase()]}`}>
                {challenge.difficulty}
              </span>
              <span className={styles.topicBadge}>
                <BoltIcon style={{ fontSize: 14 }} /> {challenge.topic}
              </span>
            </div>
            <h1 className={styles.descTitle}>{challenge.title}</h1>
            <div className={styles.descBody}>
              {challenge.description.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {challenge.expectedOutput && (
              <>
                <h4 className={styles.descSub}>{t("challenge-expected") || "Expected Output"}</h4>
                <pre className={styles.sample}>{challenge.expectedOutput}</pre>
              </>
            )}

            {/* Hints */}
            <button
              className={styles.hintsToggle}
              onClick={() => setShowHints((h) => !h)}
            >
              <HintIcon style={{ fontSize: 18 }} />
              {showHints ? (t("reactor-hide-hints") || "Hide Hints") : (t("reactor-show-hints") || "Show Hints")}
              {` (${challenge.hints.length})`}
            </button>
            <AnimatePresence>
              {showHints && (
                <motion.ul
                  className={styles.hintsList}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {challenge.hints.map((h, i) => (
                    <li key={i} className={styles.hintItem}>{h}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            {/* Attempts warning */}
            {attemptCount > 0 && remainingAttempts > 0 && (
              <div className={styles.attemptsWarning}>
                {remainingAttempts} {t("reactor-attempts-remaining") || "attempts remaining before solution is revealed"}
              </div>
            )}

            {/* Solution reveal */}
            {showSolution && (
              <div className={styles.solutionSection}>
                <button
                  className={styles.solutionToggle}
                  onClick={() => {
                    const m = monacoRef.current?.monaco;
                    if (m) {
                      const model = m.editor.getModel(m.Uri.parse("file:///reactor.kt"));
                      if (model) model.setValue(challenge.solution);
                    }
                    setCode(challenge.solution);
                  }}
                >
                  <SolutionIcon style={{ fontSize: 18 }} />
                  {t("reactor-load-solution") || "Load Solution"}
                </button>
                <div className={styles.explanationBox}>
                  <strong>{t("reactor-explanation") || "Explanation"}:</strong>
                  <p>{challenge.explanation}</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className={styles.navRow}>
              {prevChallenge ? (
                <a
                  href={createLocalizedPath(`/developer-section/reactor-challenges/${prevChallenge.id}`)}
                  className={styles.navBtn}
                >
                  <PrevIcon fontSize="small" /> {t("reactor-prev") || "Previous"}
                </a>
              ) : <span />}
              {nextChallenge && (
                <a
                  href={createLocalizedPath(`/developer-section/reactor-challenges/${nextChallenge.id}`)}
                  className={styles.navBtn}
                >
                  {t("reactor-next") || "Next"} <NextIcon fontSize="small" />
                </a>
              )}
            </div>
          </div>

          {/* Right: editor + output */}
          <div className={playStyles.editorColumn}>
            <div className={playStyles.langTabs}>
              <button className={`${playStyles.tab} ${playStyles.activeTab}`}>
                <KotlinIcon fontSize="small" /> Kotlin
              </button>
            </div>

            <div className={`${playStyles.editorWrap} code-editor-contained`}>
              <MonacoEditor
                height="100%"
                language="kotlin"
                path="file:///reactor.kt"
                value={code}
                onChange={(v) => setCode(v ?? "")}
                options={editorOptions}
                onMount={handleEditorMount}
                theme="vs-dark"
              />
            </div>

            <div className={playStyles.toolbar}>
              <button className={playStyles.iconBtn} onClick={resetToStarter}>
                <ResetIcon fontSize="small" /> {t("challenge-reset") || "Reset"}
              </button>
              <button className={`${playStyles.runBtn} ${isRunning ? playStyles.disabled : ""}`} onClick={runCode} disabled={isRunning}>
                <PlayIcon fontSize="small" /> {t("challenge-run") || "Run"}
              </button>
              <button className={`${playStyles.submitBtn} ${isSubmitting ? playStyles.disabled : ""}`} onClick={submitCode} disabled={isSubmitting}>
                <CheckIcon fontSize="small" /> {t("challenge-submit") || "Submit"}
              </button>
            </div>

            <div className={playStyles.outputPanel}>
              <div className={playStyles.outputHead}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <TerminalIcon fontSize="small" /> {t("challenge-output-label") || "Output"}
                </span>
                {submitResult != null && (
                  <span className={submitResult.success ? playStyles.passLabel : playStyles.failLabel}>
                    {submitResult.passed}/{submitResult.total} {t("challenge-passed") || "passed"}
                  </span>
                )}
              </div>

              {/* Success celebration */}
              <AnimatePresence mode="wait">
                {showSuccess && (
                  <motion.div
                    key="success"
                    className={styles.successBanner}
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={styles.successIconWrap}>
                      <CheckIcon className={styles.successIcon} />
                    </div>
                    <div className={styles.successText}>
                      <strong>{t("challenge-completed") || "Challenge Completed!"}</strong>
                      <span className={styles.successSub}>
                        {t("reactor-all-tests-passed") || "All tests passed. Great work!"}
                      </span>
                    </div>
                    {nextChallenge && (
                      <a
                        href={createLocalizedPath(`/developer-section/reactor-challenges/${nextChallenge.id}`)}
                        className={styles.nextChallengeBtn}
                      >
                        {t("reactor-next-challenge") || "Next Challenge"} <NextIcon fontSize="small" />
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Kotlin Loading Animation */}
              {kotlinPhase !== "idle" && (
                <motion.div
                  className={playStyles.kotlinLoading}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={playStyles.kotlinLoadingIcon}>
                    <KotlinIcon className={playStyles.kotlinSpinIcon} />
                  </div>
                  <div className={playStyles.kotlinLoadingSteps}>
                    <div className={`${playStyles.kotlinStep} ${kotlinPhase === "sending" ? playStyles.active : playStyles.done}`}>
                      <span className={playStyles.stepDot} />
                      <span className={playStyles.stepLabel}>{t("kotlin-sending") || "Sending to server"}</span>
                    </div>
                    <div className={`${playStyles.kotlinStep} ${kotlinPhase === "compiling" ? playStyles.active : kotlinPhase === "running" ? playStyles.done : ""}`}>
                      <span className={playStyles.stepDot} />
                      <span className={playStyles.stepLabel}>{t("kotlin-compiling") || "Compiling Kotlin"}</span>
                    </div>
                    <div className={`${playStyles.kotlinStep} ${kotlinPhase === "running" ? playStyles.active : ""}`}>
                      <span className={playStyles.stepDot} />
                      <span className={playStyles.stepLabel}>{t("kotlin-running") || "Running program"}</span>
                    </div>
                  </div>
                  <p className={playStyles.kotlinLoadingHint}>{t("kotlin-loading-hint") || "Kotlin runs on a remote server, this may take a moment..."}</p>
                </motion.div>
              )}

              {error && <div className={playStyles.errorLine}>❌ {error}</div>}

              <div className={playStyles.logList}>
                {logs.length === 0 && !error && !submitResult && kotlinPhase === "idle" && (
                  <p className={playStyles.emptyLog}>{t("challenge-empty-output") || "No output yet. Run your code to see results."}</p>
                )}
                {logs.map((l, i) => (
                  <div key={i} className={playStyles.logLine}>{l}</div>
                ))}
              </div>
            </div>

            {/* Test cases status */}
            {submitResult && !submitResult.success && (
              <motion.div
                className={styles.testResults}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h4 className={styles.testResultsTitle}>{t("reactor-test-results") || "Test Results"}</h4>
                {challenge.testCases.map((tc, i) => {
                  const passed = tc.validate(getEditorCode());
                  return (
                    <div key={i} className={`${styles.testRow} ${passed ? styles.testPass : styles.testFail}`}>
                      <span className={styles.testDot} />
                      <span>{tc.description}</span>
                    </div>
                  );
                })}
                <div className={`${styles.testRow} ${submitResult.passed > challenge.testCases.length ? styles.testPass : styles.testFail}`}>
                  <span className={styles.testDot} />
                  <span>{t("reactor-output-matches") || "Output matches expected"}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function normalizeOutput(s: string): string {
  return (s || "").trim().replace(/\r\n/g, "\n");
}
