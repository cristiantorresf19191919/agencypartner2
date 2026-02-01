"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
// @ts-ignore
import * as Babel from "@babel/standalone";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { getReactLessonById } from "@/lib/reactCourseData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";
import Link from "next/link";
import { ensureEmmetJSX } from "@/lib/emmetMonaco";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={playStyles.editorLoading}>
      <div className={playStyles.loadingSpinner} />
      <p>Loading editor…</p>
    </div>
  ),
});

const REACT_UMD = `
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
`;

function buildPreviewHTML(jsCode: string): string {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    ${REACT_UMD}
    <style>
      body { margin: 0; padding: 16px; background:#0b1020; color:#e5edff; font-family: Inter, system-ui, -apple-system, sans-serif;}
      #root { min-height: 100px; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      try {
        ${jsCode}
        const App = window.__APP__;
        if (App && window.React && window.ReactDOM) {
          const root = document.getElementById("root");
          ReactDOM.createRoot(root).render(React.createElement(App));
        } else if (window.ReactDOM) {
          document.getElementById("root").innerHTML = "<pre style='color:#e5edff'>No default export App found.</pre>";
        }
      } catch (err) {
        document.getElementById("root").innerHTML = "<pre style='color:#ef4444'>" + (err?.message || err) + "</pre>";
      }
    </script>
  </body>
</html>
`;
}

export default function ReactCourseLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const lesson = getReactLessonById(slug);
  const { createLocalizedPath } = useLocale();

  const [code, setCode] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isRunningPreview, setIsRunningPreview] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);
  const uri = "file:///react-lesson.tsx";

  useEffect(() => {
    if (lesson) {
      setCode(lesson.defaultCode);
      setPreviewHtml("");
      setPreviewError(null);
      setVerifyMessage(null);
      setShowSuccess(false);
    }
  }, [lesson?.id]);

  const resetToDefault = useCallback(() => {
    if (lesson) {
      setCode(lesson.defaultCode);
      setPreviewError(null);
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

  const runPreview = useCallback(() => {
    setIsRunningPreview(true);
    setPreviewError(null);
    setPreviewHtml("");
    try {
      const src = getEditorCode();
      const hasApp = /\b(App|window\.__APP__)\s*[=:]/.test(src);
      const hasDefaultExport = /export\s+default\s+/.test(src);
      let wrapped = src;
      if (!hasApp && !hasDefaultExport) {
        const exportMatches = [...src.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g)];
        const componentMatches = [...src.matchAll(/(?:const|function|class)\s+(\w+)\s*[=:]\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*\{)/g)];
        let componentName: string | null = null;
        if (exportMatches.length > 0) componentName = exportMatches[0][1];
        else if (componentMatches.length > 0) {
          for (const match of componentMatches) {
            const name = match[1];
            const componentCode = src.substring(match.index ?? 0);
            if (componentCode.includes("return") && (componentCode.includes("<") || componentCode.includes("React.createElement"))) {
              componentName = name;
              break;
            }
          }
        }
        if (componentName) {
          wrapped = `${src}
;window.__APP__ = typeof ${componentName} !== "undefined" ? ${componentName} : (typeof exports !== "undefined" ? exports.default : null);`;
        } else {
          wrapped = `${src};window.__APP__ = typeof App !== "undefined" ? App : (typeof exports !== "undefined" ? exports.default : null);`;
        }
      } else {
        wrapped = `${src};window.__APP__ = typeof App !== "undefined" ? App : (typeof exports !== "undefined" ? exports.default : null);`;
      }
      const result = Babel.transform(wrapped, {
        presets: ["env", "react", "typescript"],
        sourceType: "module",
        filename: "App.tsx",
      }).code;
      setPreviewHtml(buildPreviewHTML(result || ""));
    } catch (err) {
      setPreviewError((err as Error).message);
    } finally {
      setIsRunningPreview(false);
    }
  }, [getEditorCode]);

  const verify = useCallback(() => {
    if (!lesson) return;
    setVerifyMessage(null);
    setShowSuccess(false);
    const src = getEditorCode();
    const result = lesson.validationLogic(src, []);
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
        runPreview();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [runPreview]);

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

  const handleBeforeMount = (monaco: any) => {
    ensureEmmetJSX(monaco);
  };

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
      allowJs: true,
    });
  };

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>Lesson not found</p>
          <Link href={createLocalizedPath("/developer-section/react-course")}>Back to course</Link>
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
              <span className={styles.difficulty} style={{ background: "rgba(97, 218, 251, 0.2)", color: "#61DAFB" }}>
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
                  href={createLocalizedPath(`/developer-section/react-course/${lesson.prevStep}`)}
                  className={styles.secondaryLink}
                >
                  ← Previous
                </Link>
              )}
              {lesson.nextStep && (
                <Link
                  href={createLocalizedPath(`/developer-section/react-course/${lesson.nextStep}`)}
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
                beforeMount={handleBeforeMount}
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
                className={playStyles.runBtn}
                onClick={runPreview}
                disabled={isRunningPreview}
                style={{ marginRight: "8px" }}
              >
                <PlayIcon fontSize="small" /> {isRunningPreview ? "Running..." : "Preview"}
              </button>
              <button type="button" className={playStyles.submitBtn} onClick={verify}>
                <CheckIcon fontSize="small" /> Verify
              </button>
            </div>

            {previewHtml && (
              <div className={playStyles.outputPanel} style={{ marginBottom: "16px" }}>
                <div className={playStyles.outputHead}>Preview</div>
                <div style={{ padding: "12px", background: "#0b1020", borderRadius: "4px", minHeight: "200px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <iframe
                    title="react-preview"
                    sandbox="allow-scripts allow-same-origin"
                    srcDoc={previewHtml}
                    style={{ width: "100%", minHeight: "200px", border: "none", borderRadius: "4px", background: "#0e1628" }}
                  />
                  {previewError && (
                    <div style={{ marginTop: "12px", padding: "12px", background: "rgba(244,67,54,0.1)", border: "1px solid rgba(244,67,54,0.3)", borderRadius: "4px", color: "#ff6b6b", fontSize: "13px" }}>
                      ❌ {previewError}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={playStyles.outputPanel}>
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
                <div
                  className={verifyMessage.type === "success" ? playStyles.passLabel : verifyMessage.type === "error" ? playStyles.errorLine : undefined}
                  style={
                    verifyMessage.type === "info"
                      ? { padding: "12px", color: "#9fc4ff", fontSize: "14px" }
                      : undefined
                  }
                >
                  {verifyMessage.text}
                </div>
              )}
              {!verifyMessage && <p className={playStyles.emptyLog}>Click Verify to check your solution</p>}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div className={playStyles.footerRow}>
          <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-course")}>
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
