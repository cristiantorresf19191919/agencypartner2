"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  CheckCircle as CheckIcon,
  Terminal as TerminalIcon,
} from "@mui/icons-material";
// @ts-ignore
import * as Babel from "@babel/standalone";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { getTypeScriptLessonById } from "@/lib/typescriptCourseData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";
import Link from "next/link";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={playStyles.editorLoading}>
      <div className={playStyles.loadingSpinner} />
      <p>Loading editor…</p>
    </div>
  ),
});

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

  const [code, setCode] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [runError, setRunError] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);
  const uri = "file:///ts-lesson.ts";

  useEffect(() => {
    if (lesson) {
      setCode(lesson.defaultCode);
      setLogs([]);
      setRunError(null);
      setVerifyMessage(null);
      setShowSuccess(false);
    }
  }, [lesson?.id]);

  const resetToDefault = useCallback(() => {
    if (lesson) {
      setCode(lesson.defaultCode);
      setLogs([]);
      setRunError(null);
      setVerifyMessage(null);
      setShowSuccess(false);
      const m = monacoRef.current?.monaco;
      if (m) {
        const model = m.editor.getModel(m.Uri.parse(uri));
        if (model) model.setValue(lesson.defaultCode);
      }
    }
  }, [lesson, uri]);

  const getEditorCode = useCallback((): string => {
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse(uri));
      if (model) return model.getValue();
    }
    return code;
  }, [code, uri]);

  const runCode = useCallback(() => {
    setRunError(null);
    setLogs([]);
    const src = getEditorCode();
    const { logs: out, error } = runTypeScriptInSandbox(src);
    setLogs(out);
    if (error) setRunError(error);
  }, [getEditorCode]);

  const verify = useCallback(() => {
    if (!lesson) return;
    setVerifyMessage(null);
    setShowSuccess(false);
    const src = getEditorCode();
    const { logs: out } = runTypeScriptInSandbox(src);
    const result = lesson.validationLogic(src, out);
    if (result.success) {
      setVerifyMessage({ type: "success", text: result.message || "Correct!" });
      setShowSuccess(true);
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (_) {}
    } else {
      setVerifyMessage({ type: "info", text: result.message || "Not quite. Try again." });
    }
  }, [lesson, getEditorCode]);

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
      noEmit: true,
    });
  };

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

      <section className={playStyles.playSection}>
        <div className={playStyles.layout}>
          <div className={playStyles.description}>
            <div className={playStyles.descHeader}>
              <span className={styles.difficulty} style={{ background: "rgba(49, 120, 198, 0.2)", color: "#3178c6" }}>
                Step {lesson.step}
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

          <div className={playStyles.editorColumn}>
            <div className={`${playStyles.editorWrap} code-editor-contained`}>
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
              <button type="button" className={playStyles.iconBtn} onClick={resetToDefault} aria-label="Reset">
                <ResetIcon fontSize="small" /> Reset
              </button>
              <button type="button" className={playStyles.runBtn} onClick={runCode} style={{ marginRight: "8px" }}>
                <PlayIcon fontSize="small" /> Run
              </button>
              <button type="button" className={playStyles.submitBtn} onClick={verify}>
                <CheckIcon fontSize="small" /> Verify
              </button>
            </div>

            <div className={playStyles.outputPanel}>
              <div className={playStyles.outputHead}>
                <TerminalIcon fontSize="small" /> Output
              </div>
              {runError && <div className={playStyles.errorLine}>❌ {runError}</div>}
              <div className={playStyles.logList}>
                {logs.length === 0 && !runError && (
                  <p className={playStyles.emptyLog}>Run the code to see output.</p>
                )}
                {logs.map((l, i) => (
                  <div key={i} className={playStyles.logLine}>
                    {l}
                  </div>
                ))}
              </div>
            </div>

            <div className={playStyles.outputPanel} style={{ marginTop: "16px" }}>
              <div className={playStyles.outputHead}>Verify</div>
              <AnimatePresence mode="wait">
                {showSuccess && (
                  <motion.div
                    key="success"
                    className={playStyles.successBanner}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckIcon className={playStyles.successIcon} /> {verifyMessage?.text}
                  </motion.div>
                )}
              </AnimatePresence>
              {verifyMessage && !showSuccess && (
                <div style={{ padding: "12px", color: "#9fc4ff", fontSize: "14px" }}>{verifyMessage.text}</div>
              )}
              {!verifyMessage && <p className={playStyles.emptyLog}>Click Verify to check your solution</p>}
            </div>
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

      <Footer />
    </main>
  );
}
