"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  CheckCircle as CheckIcon,
  Lightbulb as HintIcon,
  Visibility as SolutionIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getReactChallengeById } from "@/lib/reactChallengesData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={playStyles.editorLoading}>
      <div className={playStyles.loadingSpinner} />
      <p>Loading editor…</p>
    </div>
  ),
});

const MAX_ATTEMPTS = 10;
const STORAGE_KEY_PREFIX = "react-challenge-attempts-";

function getAttemptCount(challengeId: string): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${challengeId}`);
  return stored ? parseInt(stored, 10) : 0;
}

function incrementAttemptCount(challengeId: string): number {
  if (typeof window === "undefined") return 0;
  const current = getAttemptCount(challengeId);
  const newCount = current + 1;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${challengeId}`, newCount.toString());
  return newCount;
}

function resetAttemptCount(challengeId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${challengeId}`);
}

export default function ReactChallengePage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const challenge = getReactChallengeById(slug);
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [submitResult, setSubmitResult] = useState<{ passed: number; total: number; success: boolean } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);

  const uri = `file:///react-challenge.tsx`;

  useEffect(() => {
    if (challenge) {
      setCode(challenge.problemCode);
      setError(null);
      setSubmitResult(null);
      setShowSuccess(false);
      setShowSolution(false);
      setShowHints(false);
      const count = getAttemptCount(challenge.id);
      setAttemptCount(count);
      if (count >= MAX_ATTEMPTS) {
        setShowSolution(true);
      }
    }
  }, [challenge?.id]);

  const resetToProblem = useCallback(() => {
    if (challenge) {
      setCode(challenge.problemCode);
      setError(null);
      setSubmitResult(null);
      setShowSuccess(false);
      const m = monacoRef.current?.monaco;
      if (m) {
        const model = m.editor.getModel(m.Uri.parse(uri));
        if (model) model.setValue(challenge.problemCode);
      }
    }
  }, [challenge, uri]);

  const getEditorCode = useCallback((): string => {
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse(uri));
      if (model) return model.getValue();
    }
    return code;
  }, [code, uri]);

  const submitCode = useCallback(async () => {
    if (!challenge || !challenge.testCases.length) return;
    setIsSubmitting(true);
    setError(null);
    setSubmitResult(null);
    setShowSuccess(false);
    
    const src = getEditorCode();
    let passed = 0;
    const total = challenge.testCases.length;

    try {
      for (const tc of challenge.testCases) {
        if (tc.validate(src)) {
          passed++;
        }
      }

      const success = passed === total;
      setSubmitResult({ passed, total, success });

      if (success) {
        setShowSuccess(true);
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch (_) {}
        resetAttemptCount(challenge.id);
      } else {
        const newCount = incrementAttemptCount(challenge.id);
        setAttemptCount(newCount);
        if (newCount >= MAX_ATTEMPTS) {
          setShowSolution(true);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Validation failed");
    }

    setIsSubmitting(false);
  }, [challenge, getEditorCode]);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 14,
      fontLigatures: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      formatOnPaste: true,
      formatOnType: true,
    }),
    []
  );

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      jsx: monaco.languages.typescript.JsxEmit.React,
      noEmit: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  };

  if (!challenge) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>Challenge not found</p>
          <a href={createLocalizedPath("/developer-section/react-challenges")}>Back to challenges</a>
        </div>
        <Footer />
      </main>
    );
  }

  const remainingAttempts = MAX_ATTEMPTS - attemptCount;
  const showAttemptWarning = attemptCount > 0 && remainingAttempts > 0;

  return (
    <main className={styles.page}>
      <DeveloperHeader />
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={playStyles.playSection}>
        <div className={playStyles.layout}>
          {/* Left: description */}
          <div className={playStyles.description}>
            <div className={playStyles.descHeader}>
              <span className={`${styles.difficulty} ${styles[challenge.difficulty.toLowerCase()]}`}>
                {challenge.difficulty}
              </span>
            </div>
            <h1 className={playStyles.descTitle}>{challenge.title}</h1>
            <div className={playStyles.descBody}>
              <p style={{ whiteSpace: "pre-wrap", marginBottom: "16px" }}>{challenge.description}</p>
              
              {showAttemptWarning && (
                <div style={{ 
                  padding: "12px", 
                  marginBottom: "16px",
                  background: "rgba(255, 193, 7, 0.1)",
                  border: "1px solid rgba(255, 193, 7, 0.3)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <WarningIcon fontSize="small" style={{ color: "#ffc107" }} />
                  <span style={{ fontSize: "14px", color: "#ffc107" }}>
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining
                  </span>
                </div>
              )}

              {attemptCount >= MAX_ATTEMPTS && (
                <div style={{ 
                  padding: "12px", 
                  marginBottom: "16px",
                  background: "rgba(255, 152, 0, 0.1)",
                  border: "1px solid rgba(255, 152, 0, 0.3)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <SolutionIcon fontSize="small" style={{ color: "#ff9800" }} />
                  <span style={{ fontSize: "14px", color: "#ff9800" }}>
                    Solution unlocked after {MAX_ATTEMPTS} attempts
                  </span>
                </div>
              )}

              <h4 className={playStyles.descSub}>Problem Code</h4>
              <pre className={playStyles.sample}>{challenge.problemCode}</pre>

              {challenge.hints.length > 0 && (
                <>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    style={{
                      marginTop: "16px",
                      padding: "8px 16px",
                      background: "rgba(124, 244, 255, 0.1)",
                      border: "1px solid rgba(124, 244, 255, 0.3)",
                      borderRadius: "6px",
                      color: "#7cf4ff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <HintIcon fontSize="small" />
                    {showHints ? "Hide Hints" : "Show Hints"}
                  </button>
                  {showHints && (
                    <ul style={{ marginTop: "12px", paddingLeft: "20px", color: "#c6d5ff" }}>
                      {challenge.hints.map((hint, i) => (
                        <li key={i} style={{ marginBottom: "8px", fontSize: "14px" }}>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {showSolution && (
                <>
                  <h4 className={playStyles.descSub} style={{ marginTop: "24px", color: "#ff9800" }}>
                    Solution
                  </h4>
                  <pre className={playStyles.sample} style={{ borderColor: "rgba(255, 152, 0, 0.3)" }}>
                    {challenge.solution}
                  </pre>
                  <p style={{ marginTop: "12px", fontSize: "13px", color: "#c6d5ff", fontStyle: "italic" }}>
                    {challenge.explanation}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right: editor + output */}
          <div className={playStyles.editorColumn}>
            <div className={playStyles.editorWrap} style={{ height: "500px" }}>
              <MonacoEditor
                height="100%"
                language="typescript"
                path={uri}
                value={code}
                onChange={(v) => setCode(v ?? "")}
                options={editorOptions}
                onMount={handleEditorMount}
                theme="vs-dark"
              />
            </div>

            <div className={playStyles.toolbar}>
              <button className={playStyles.iconBtn} onClick={resetToProblem}>
                <ResetIcon fontSize="small" /> Reset
              </button>
              <button
                className={`${playStyles.submitBtn} ${isSubmitting ? playStyles.disabled : ""}`}
                onClick={submitCode}
                disabled={isSubmitting}
              >
                <CheckIcon fontSize="small" /> Submit Solution
              </button>
            </div>

            <div className={playStyles.outputPanel}>
              <div className={playStyles.outputHead}>
                Result
                {submitResult != null && (
                  <span className={submitResult.success ? playStyles.passLabel : playStyles.failLabel}>
                    {submitResult.passed}/{submitResult.total} Tests Passed
                  </span>
                )}
              </div>
              <AnimatePresence mode="wait">
                {showSuccess && (
                  <motion.div
                    key="success"
                    className={playStyles.successBanner}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckIcon className={playStyles.successIcon} /> Challenge Completed! 🎉
                  </motion.div>
                )}
              </AnimatePresence>
              {error && <div className={playStyles.errorLine}>❌ {error}</div>}
              {submitResult && !submitResult.success && (
                <div className={playStyles.logList}>
                  <p style={{ color: "#ff6b6b", fontSize: "14px", marginBottom: "8px" }}>
                    Some tests failed. Try again!
                  </p>
                  {challenge.testCases.map((tc, i) => {
                    const passed = tc.validate(getEditorCode());
                    return (
                      <div
                        key={i}
                        style={{
                          padding: "8px",
                          marginBottom: "4px",
                          background: passed ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                          border: `1px solid ${passed ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)"}`,
                          borderRadius: "4px",
                          fontSize: "13px",
                        }}
                      >
                        {passed ? "✓" : "✗"} {tc.description}
                      </div>
                    );
                  })}
                </div>
              )}
              {submitResult && submitResult.success && (
                <div style={{ padding: "16px", color: "#4caf50", fontSize: "14px" }}>
                  ✓ All tests passed! Great job!
                </div>
              )}
              {!submitResult && !error && (
                <p className={playStyles.emptyLog}>Submit your solution to see results</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div className={playStyles.footerRow}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-challenges")}>
            Back to React Challenges
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
