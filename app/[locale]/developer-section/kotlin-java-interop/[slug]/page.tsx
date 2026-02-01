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
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import {
  getKotlinInteropLessonById,
  type KotlinInteropLesson,
  type KotlinInteropPracticeChallenge,
} from "@/lib/kotlinJavaInteropData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";
import Link from "next/link";

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

function normalizeOutput(s: string): string {
  return (s || "").trim().replace(/\r\n/g, "\n");
}

function registerKotlinLanguage(monaco: any) {
  if (monaco.languages.getLanguages().some((l: { id: string }) => l.id === "kotlin")) return;
  monaco.languages.register({ id: "kotlin" });
  monaco.languages.setLanguageConfiguration("kotlin", {
    comments: { lineComment: "//", blockComment: ["/*", "*/"] },
    brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });
  monaco.languages.setMonarchTokensProvider("kotlin", {
    keywords: [
      "abstract", "actual", "annotation", "as", "break", "by", "catch", "class", "companion",
      "const", "constructor", "continue", "crossinline", "data", "do", "dynamic", "else", "enum",
      "expect", "external", "final", "finally", "for", "fun", "get", "if", "import", "in",
      "infix", "init", "inline", "inner", "interface", "internal", "is", "lateinit", "noinline",
      "null", "object", "open", "operator", "out", "override", "package", "private", "protected",
      "public", "reified", "return", "sealed", "set", "super", "suspend", "tailrec", "this",
      "throw", "try", "typealias", "typeof", "val", "var", "vararg", "when", "where", "while",
    ],
    typeKeywords: [
      "Boolean", "Byte", "Char", "Double", "Float", "Int", "Long", "Short", "String", "Unit", "Any", "Nothing",
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    tokenizer: {
      root: [
        [/[a-z_$][\w$]*/, { cases: { "@keywords": "keyword", "@typeKeywords": "type", "@default": "identifier" } }],
        [/[A-Z][\w$]*/, "type.identifier"],
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
        [/'/, { token: "string.quote", bracket: "@open", next: "@stringSingle" }],
        [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, "number.float"],
        [/0[xX][0-9a-fA-F]+[Ll]?/, "number.hex"],
        [/\d+[lL]?/, "number"],
        [/[;,.]/, "delimiter"],
        [/[{}()\[\]]/, "@brackets"],
        [/@symbols/, "operator"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
      ],
      comment: [
        [/[^/*]+/, "comment"],
        [/\/\*/, "comment", "@push"],
        ["\\*/", "comment", "@pop"],
        [/[/*]/, "comment"],
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],
      stringSingle: [
        [/[^\\']+/, "string"],
        [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],
    },
  });
}

export default function KotlinJavaInteropLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const lesson = getKotlinInteropLessonById(slug);
  const { createLocalizedPath } = useLocale();

  const [code, setCode] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ passed: number; total: number; success: boolean } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePractice, setActivePractice] = useState<KotlinInteropPracticeChallenge | null>(null);
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);

  const uri = `file:///kotlin-interop-lesson.kt`;

  useEffect(() => {
    if (lesson) {
      setCode(lesson.defaultCode);
      setError(null);
      setLogs([]);
      setSubmitResult(null);
      setShowSuccess(false);
      setActivePractice(null);
    }
  }, [lesson?.id]);

  const resetToDefault = useCallback(() => {
    if (lesson) {
      setCode(lesson.defaultCode);
      setError(null);
      setLogs([]);
      setSubmitResult(null);
      setShowSuccess(false);
      setActivePractice(null);
      const m = monacoRef.current?.monaco;
      if (m) {
        const model = m.editor.getModel(m.Uri.parse(uri));
        if (model) model.setValue(lesson.defaultCode);
      }
    }
  }, [lesson, uri]);

  const loadPractice = useCallback((p: KotlinInteropPracticeChallenge) => {
    setActivePractice(p);
    setCode(p.starterCode);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse(uri));
      if (model) model.setValue(p.starterCode);
    }
  }, [uri]);

  const getEditorCode = useCallback((): string => {
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse(uri));
      if (model) return model.getValue();
    }
    return code;
  }, [code, uri]);

  const runKotlin = useCallback(async (source: string, input: string): Promise<{ stdout: string; err?: string }> => {
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
  }, []);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    const src = getEditorCode();
    const { stdout, err } = await runKotlin(src, "");
    setLogs(stdout ? stdout.split("\n") : []);
    if (err) setError(err);
    setIsRunning(false);
  }, [getEditorCode, runKotlin]);

  const submitPractice = useCallback(async () => {
    if (!activePractice || !activePractice.testCases.length) return;
    setIsSubmitting(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    setShowSuccess(false);
    const src = getEditorCode();
    let passed = 0;
    const total = activePractice.testCases.length;
    for (const tc of activePractice.testCases) {
      const { stdout, err } = await runKotlin(src, tc.input);
      if (err) {
        setError(err);
        break;
      }
      if (normalizeOutput(stdout) === normalizeOutput(tc.output)) passed++;
    }
    setSubmitResult({ passed, total, success: passed === total });
    if (passed === total) {
      setShowSuccess(true);
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (_) {}
    }
    setIsSubmitting(false);
  }, [activePractice, getEditorCode, runKotlin]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [runCode]);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 14,
      fontLigatures: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      formatOnPaste: true,
      formatOnType: true,
    }),
    []
  );

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
    registerKotlinLanguage(monaco);
  };

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

      <section className={playStyles.playSection}>
        <div className={playStyles.layout}>
          <div className={playStyles.description}>
            <div className={playStyles.descHeader}>
              <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                Step {lesson.step}
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
                    <pre className={playStyles.sample} style={{ marginTop: "8px" }}>
                      <code style={{ fontSize: "13px", color: "#ddecff" }}>{ex.code}</code>
                    </pre>
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
                  <div
                    key={p.id}
                    style={{
                      marginBottom: "14px",
                      padding: "12px 14px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                    }}
                  >
                    <strong style={{ color: "#e6f0ff" }}>{p.title}</strong>
                    <p className={playStyles.descBody} style={{ margin: "8px 0 10px" }}>
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
                        <pre className={playStyles.sample} style={{ marginTop: "8px", fontSize: "12px" }}>
                          <code>{p.solution}</code>
                        </pre>
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

          <div className={playStyles.editorColumn}>
            <div className={playStyles.editorWrap}>
              <MonacoEditor
                height="100%"
                language="kotlin"
                path={uri}
                value={code}
                onChange={(v) => setCode(v ?? "")}
                options={editorOptions}
                onMount={handleEditorMount}
                theme="vs-dark"
              />
            </div>

            <div className={playStyles.toolbar}>
              <button type="button" className={playStyles.iconBtn} onClick={resetToDefault} aria-label="Reset">
                <ResetIcon fontSize="small" /> Reset
              </button>
              <button
                type="button"
                className={`${playStyles.runBtn} ${isRunning ? playStyles.disabled : ""}`}
                onClick={runCode}
                disabled={isRunning}
              >
                <PlayIcon fontSize="small" /> Run
              </button>
              {activePractice && activePractice.testCases.length > 0 && (
                <button
                  type="button"
                  className={`${playStyles.submitBtn} ${isSubmitting ? playStyles.disabled : ""}`}
                  onClick={submitPractice}
                  disabled={isSubmitting}
                >
                  <CheckIcon fontSize="small" /> Submit
                </button>
              )}
            </div>

            <div className={playStyles.outputPanel}>
              <div className={playStyles.outputHead}>
                <TerminalIcon fontSize="small" /> Output
                {submitResult != null && (
                  <span className={submitResult.success ? playStyles.passLabel : playStyles.failLabel}>
                    {submitResult.passed}/{submitResult.total} passed
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
                    <CheckIcon className={playStyles.successIcon} /> All tests passed!
                  </motion.div>
                )}
              </AnimatePresence>
              {error && <div className={playStyles.errorLine}>❌ {error}</div>}
              <div className={playStyles.logList}>
                {logs.length === 0 && !error && submitResult == null && (
                  <p className={playStyles.emptyLog}>Run the code to see output.</p>
                )}
                {logs.map((l, i) => (
                  <div key={i} className={playStyles.logLine}>
                    {l}
                  </div>
                ))}
              </div>
            </div>
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

      <Footer />
    </main>
  );
}
