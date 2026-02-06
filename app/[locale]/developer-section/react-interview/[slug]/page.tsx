"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  CheckCircle as CheckIcon,
  Code as CodeIcon,
  Visibility as PreviewIcon,
} from "@mui/icons-material";
// @ts-ignore
import * as Babel from "@babel/standalone";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getReact19LessonById } from "@/lib/react19InterviewData";
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

export default function React19LessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const lesson = getReact19LessonById(slug);
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();

  const [code, setCode] = useState("");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isRunningPreview, setIsRunningPreview] = useState(false);
  const [showOldWay, setShowOldWay] = useState(false);
  const [showNewWay, setShowNewWay] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);

  const uri = `file:///react-lesson.tsx`;

  useEffect(() => {
    if (lesson) {
      setCode(lesson.starterCode);
      setPreviewHtml("");
      setPreviewError(null);
      setShowOldWay(false);
      setShowNewWay(false);
    }
  }, [lesson?.id]);

  const resetToStarter = useCallback(() => {
    if (lesson) {
      setCode(lesson.starterCode);
      setPreviewError(null);
      setPreviewHtml("");
      const m = monacoRef.current?.monaco;
      if (m) {
        const model = m.editor.getModel(m.Uri.parse(uri));
        if (model) model.setValue(lesson.starterCode);
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

  const REACT_UMD = `
<script crossorigin src="https://unpkg.com/react@19/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.development.js"></script>
`;

  const buildPreviewHTML = useCallback((jsCode: string) => {
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    ${REACT_UMD}
    <style>
      body { margin: 0; padding: 16px; background:#0b1020; color:#e5edff; font-family: Inter, system-ui, -apple-system, sans-serif;}
      #root { min-height: 100px; }
      pre { white-space: pre-wrap; word-break: break-word; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const parentWindow = window.parent;
      const safeConsole = {
        log: (...args) => parentWindow.postMessage({ type: "playground-log", message: args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ") }, "*"),
        warn: (...args) => parentWindow.postMessage({ type: "playground-log", message: "⚠️ " + args.join(" ") }, "*"),
        error: (...args) => parentWindow.postMessage({ type: "playground-log", message: "❌ " + args.join(" ") }, "*"),
      };
      try {
        ${jsCode}
        const App = window.__APP__;
        if (App && window.React && window.ReactDOM) {
          const root = document.getElementById("root");
          const React = window.React;
          const ReactDOM = window.ReactDOM;
          ReactDOM.createRoot(root).render(React.createElement(App));
        } else if (window.ReactDOM) {
          const root = document.getElementById("root");
          root.innerHTML = "<pre style='color:#e5edff;white-space:pre-wrap'>No default export named App was found. Console output is still captured.</pre>";
        }
      } catch (err) {
        parentWindow.postMessage({ type: "playground-error", message: err?.message || String(err) }, "*");
      }
    </script>
  </body>
</html>
`;
  }, []);

  const runPreview = useCallback(async () => {
    setIsRunningPreview(true);
    setPreviewError(null);
    setPreviewHtml("");

    try {
      const src = getEditorCode();
      
      const hasApp = /\b(App|window\.__APP__)\s*[=:]/.test(src);
      const hasDefaultExport = /export\s+default\s+/.test(src);
      
      let wrapped = src;
      if (!hasApp && !hasDefaultExport) {
        const exportMatches = [
          ...src.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g),
          ...src.matchAll(/export\s+{\s*(\w+)/g),
        ];
        
        const componentMatches = [
          ...src.matchAll(/(?:const|function|class)\s+(\w+)\s*[=:]\s*(?:\([^)]*\)\s*=>|\([^)]*\)\s*\{)/g),
        ];
        
        let componentName: string | null = null;
        if (exportMatches.length > 0) {
          componentName = exportMatches[0][1];
        } else if (componentMatches.length > 0) {
          for (const match of componentMatches) {
            const name = match[1];
            const componentCode = src.substring(match.index || 0);
            if (componentCode.includes('return') && (componentCode.includes('<') || componentCode.includes('React.createElement'))) {
              componentName = name;
              break;
            }
          }
        }
        
        if (componentName) {
          wrapped = `${src}

// Auto-generated preview wrapper
(function() {
  var _exports = typeof exports !== 'undefined' ? exports : {};
  var Component = _exports.${componentName} || (typeof ${componentName} !== 'undefined' ? ${componentName} : null);
  
  var App = function App() {
    try {
      if (Component && typeof Component === 'function') {
        return React.createElement(Component, {});
      }
      if (_exports.default) {
        return React.createElement(_exports.default, {});
      }
      var keys = Object.keys(_exports);
      for (var i = 0; i < keys.length; i++) {
        var exp = _exports[keys[i]];
        if (typeof exp === 'function') {
          return React.createElement(exp, {});
        }
      }
      return React.createElement('div', { style: { padding: '16px', color: '#e5edff' } }, 
        'Component "${componentName}" code executed. Check console for output.'
      );
    } catch (err) {
      return React.createElement('div', { 
        style: { color: '#ef4444', padding: '16px' } 
      }, String(err?.message || err));
    }
  };
  
  window.__APP__ = App;
})();`;
        } else {
          wrapped = `${src}

// Auto-generated preview wrapper
(function() {
  var _exports = typeof exports !== 'undefined' ? exports : {};
  var App = function App() {
    try {
      if (_exports.default) {
        return React.createElement(_exports.default, {});
      }
      var keys = Object.keys(_exports);
      for (var i = 0; i < keys.length; i++) {
        var exp = _exports[keys[i]];
        if (typeof exp === 'function') {
          return React.createElement(exp, {});
        }
      }
      return React.createElement('div', { style: { padding: '16px', color: '#e5edff' } }, 
        'Code executed. Check console for output.'
      );
    } catch (err) {
      return React.createElement('div', { style: { color: '#ef4444', padding: '16px' } }, 
        String(err?.message || err)
      );
    }
  };
  window.__APP__ = App;
})();`;
        }
      } else {
        wrapped = `${src}
;window.__APP__ = typeof App !== "undefined" ? App : (typeof exports !== "undefined" ? exports.default : null);`;
      }

      const result = Babel.transform(wrapped, {
        presets: ["env", "react", "typescript"],
        sourceType: "module",
        filename: "App.tsx",
      }).code;

      const html = buildPreviewHTML(result || "");
      setPreviewHtml(html);
    } catch (err) {
      setPreviewError((err as Error).message);
    } finally {
      setIsRunningPreview(false);
    }
  }, [getEditorCode, buildPreviewHTML]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "playground-error") {
        setPreviewError(event.data.message);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runPreview();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
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

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
    
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      noEmit: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      allowJs: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
    });
    
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [1375],
    });

    // Add React 19 types
    const reactTypes = `
      declare global {
        function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
        function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        function useMemo<T>(factory: () => T, deps: any[]): T;
        function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        function useRef<T>(initialValue: T): { current: T };
        function useContext<T>(context: any): T;
        function use<S>(promise: Promise<S> | PromiseLike<S>): S;
        function useActionState<State>(
          action: (prevState: State, formData: FormData) => Promise<State> | State,
          initialState: State
        ): [State, (formData: FormData) => void, boolean];
        function useOptimistic<State, Action>(
          currentState: State,
          updateFn: (state: State, action: Action) => State
        ): [State, (action: Action) => void];
        function useDeferredValue<T>(value: T, initialValue?: T): T;
        function useFormStatus(): { pending: boolean; data: FormData | null; method: string | null; action: string | ((formData: FormData) => void | Promise<void>) | null };
        function Suspense(props: { children: any; fallback: any }): any;
        var React: any;
        var ReactDOM: any;
        var console: any;
      }
      
      declare namespace JSX {
        interface IntrinsicElements {
          [elemName: string]: any;
        }
      }
    `;

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactTypes,
      'file:///node_modules/@types/react/index.d.ts'
    );
  };

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>Lesson not found</p>
          <a href={createLocalizedPath("/developer-section/react-interview")}>Back to lessons</a>
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
          {/* Left: description */}
          <div className={playStyles.description}>
            <div className={playStyles.descHeader}>
              <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                Lesson {lesson.lessonNumber}
              </span>
            </div>
            <h1 className={playStyles.descTitle}>{lesson.title}</h1>
            <div className={playStyles.descBody}>
              <p style={{ marginBottom: "12px", color: "#7cf4ff", fontWeight: 600 }}>
                {lesson.concept}
              </p>
              <p style={{ whiteSpace: "pre-wrap", marginBottom: "16px" }}>{lesson.description}</p>

              <div style={{ marginBottom: "16px" }}>
                <button
                  onClick={() => setShowOldWay(!showOldWay)}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "6px",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginRight: "8px",
                  }}
                >
                  {showOldWay ? "Hide" : "Show"} Old Way (React 18)
                </button>
                <button
                  onClick={() => setShowNewWay(!showNewWay)}
                  style={{
                    padding: "8px 16px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "6px",
                    color: "#10b981",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {showNewWay ? "Hide" : "Show"} New Way (React 19)
                </button>
              </div>

              {showOldWay && (
                <div style={{ marginBottom: "16px" }}>
                  <h4 className={playStyles.descSub} style={{ color: "#ef4444" }}>
                    ❌ Old Way (React 18)
                  </h4>
                  <pre className={playStyles.sample} style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}>
                    {lesson.oldWayCode}
                  </pre>
                </div>
              )}

              {showNewWay && (
                <div style={{ marginBottom: "16px" }}>
                  <h4 className={playStyles.descSub} style={{ color: "#10b981" }}>
                    ✅ New Way (React 19)
                  </h4>
                  <pre className={playStyles.sample} style={{ borderColor: "rgba(16, 185, 129, 0.3)" }}>
                    {lesson.newWayCode}
                  </pre>
                </div>
              )}

              <h4 className={playStyles.descSub} style={{ marginTop: "24px" }}>
                👀 Preview
              </h4>
              <p style={{ fontSize: "13px", color: "#c6d5ff", fontStyle: "italic", marginBottom: "12px" }}>
                {lesson.previewDescription}
              </p>

              <h4 className={playStyles.descSub} style={{ marginTop: "24px" }}>
                📚 Explanation
              </h4>
              <p style={{ fontSize: "14px", color: "#c6d5ff", lineHeight: "1.6" }}>
                {lesson.explanation}
              </p>
            </div>
          </div>

          {/* Right: editor + preview */}
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
              <button className={playStyles.iconBtn} onClick={resetToStarter}>
                <ResetIcon fontSize="small" /> Reset
              </button>
              <button
                className={playStyles.runBtn}
                onClick={runPreview}
                disabled={isRunningPreview}
              >
                <PlayIcon fontSize="small" /> {isRunningPreview ? "Running..." : "Run Preview"}
              </button>
            </div>

            {/* Preview Section */}
            {previewHtml && (
              <div className={playStyles.outputPanel} style={{ marginBottom: "16px" }}>
                <div className={playStyles.outputHead}>
                  <PreviewIcon fontSize="small" /> Live Preview
                </div>
                <div style={{ 
                  padding: "12px", 
                  background: "#0b1020", 
                  borderRadius: "4px",
                  minHeight: "300px",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                  <iframe
                    ref={previewIframeRef}
                    title="react-lesson-preview"
                    sandbox="allow-scripts allow-same-origin"
                    srcDoc={previewHtml}
                    style={{
                      width: "100%",
                      minHeight: "300px",
                      border: "none",
                      borderRadius: "4px",
                      background: "#0e1628"
                    }}
                  />
                  {previewError && (
                    <div style={{ 
                      marginTop: "12px", 
                      padding: "12px", 
                      background: "rgba(244, 67, 54, 0.1)", 
                      border: "1px solid rgba(244, 67, 54, 0.3)",
                      borderRadius: "4px",
                      color: "#ff6b6b",
                      fontSize: "13px"
                    }}>
                      ❌ {previewError}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!previewHtml && (
              <div className={playStyles.outputPanel}>
                <div className={playStyles.outputHead}>
                  <CodeIcon fontSize="small" /> Code Editor
                </div>
                <p className={playStyles.emptyLog}>
                  Edit the code above and click "Run Preview" to see the result.
                  <br />
                  <span style={{ fontSize: "12px", color: "#7cf4ff" }}>
                    Press Cmd/Ctrl + Enter to run
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div className={playStyles.footerRow}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-interview")}>
            Back to React 19 Lessons
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
