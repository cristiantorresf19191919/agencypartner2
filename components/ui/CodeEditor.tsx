"use client";

/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import * as Babel from "@babel/standalone";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="w-full h-40 grid place-items-center text-sm text-slate-300">Loading editor…</div>,
});

interface CodeEditorProps {
  code: string;
  language?: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  height?: string | number;
  className?: string;
  defaultFullscreen?: boolean;
  /** When true, disables TS/JS semantic and syntax validation (e.g. for display-only snippets). Default true so blog and comparison editors don't show lint errors. Set false for runnable playgrounds. */
  disableLinting?: boolean;
}

const REACT_UMD = `
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
`;

const KOTLIN_PLAYGROUND_SCRIPT = "https://unpkg.com/kotlin-playground@1.9.0/dist/kotlin-playground.min.js";

export function CodeEditor({
  code: initialCode,
  language = "tsx",
  onChange,
  readOnly = false,
  height = 420,
  className = "",
  defaultFullscreen = false,
  disableLinting = true,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isFullscreen, setIsFullscreen] = useState(defaultFullscreen);
  const [isMounted, setIsMounted] = useState(false);
  const [outputHtml, setOutputHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(14);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const kotlinScriptInjected = useRef(false);

  const normalizedLang = language.toLowerCase();
  const isKotlin = normalizedLang.includes("kotlin");
  const isReactLike = ["react", "tsx", "jsx"].includes(normalizedLang);
  const isRunnable =
    !readOnly && (["javascript", "typescript", "jsx", "tsx", "react"].includes(normalizedLang) || isKotlin);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "playground-log") {
        setLogs((prev) => [...prev.slice(-50), event.data.message]);
      }
      if (event.data?.type === "playground-error") {
        setError(event.data.message);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isKotlin) return;
    if (kotlinScriptInjected.current) return;
    const script = document.createElement("script");
    script.src = KOTLIN_PLAYGROUND_SCRIPT;
    script.async = true;
    script.onload = () => {
      kotlinScriptInjected.current = true;
    };
    document.head.appendChild(script);
  }, [isKotlin]);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize,
      fontLigatures: true,
      smoothScrolling: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderLineHighlight: "all" as const,
      suggest: { preview: true, showWords: true },
      quickSuggestions: true,
      tabSize: 2,
      formatOnPaste: true,
      readOnly,
      formatOnType: true,
    }),
    [fontSize, readOnly]
  );

  const buildPreviewHTML = (jsCode: string) => {
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
  };

  const runCode = useCallback(async () => {
    if (!isRunnable || isKotlin) return;
    setIsRunning(true);
    setError(null);
    setLogs([]);
    try {
      // For React/TSX code, automatically detect and wrap exported components
      let wrapped = code;
      if (isReactLike) {
        // Check if code already defines App or has default export
        const hasApp = /\b(App|window\.__APP__)\s*[=:]/.test(code);
        const hasDefaultExport = /export\s+default\s+/.test(code);
        
        if (!hasApp && !hasDefaultExport) {
          // Try to find exported component names
          const exportMatches = [
            ...code.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g),
            ...code.matchAll(/export\s+{\s*(\w+)/g),
          ];
          
          if (exportMatches.length > 0) {
            // Get the first exported component name
            const componentName = exportMatches[0][1];
            
            // Wrap code to capture exports and create App
            wrapped = `${code}

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
      // Try any exported function
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
            // No exports found, create generic wrapper
            wrapped = `${code}

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
          // Has App or default export, use existing pattern
          wrapped = `${code}
;window.__APP__ = typeof App !== "undefined" ? App : (typeof exports !== "undefined" ? exports.default : null);`;
        }
      } else {
        // Non-React code
        wrapped = `${code}
;window.__APP__ = typeof App !== "undefined" ? App : (typeof exports !== "undefined" ? exports.default : null);`;
      }

      const result = Babel.transform(wrapped, {
        presets: ["env", "react", "typescript"],
        sourceType: "module",
        filename: "App.tsx",
      }).code;

      const html = buildPreviewHTML(result || "");
      setOutputHtml(html);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsRunning(false);
    }
  }, [code, isKotlin, isRunnable, isReactLike]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
    setOutputHtml("");
    setLogs([]);
    setError(null);
    if (onChange) onChange(initialCode);
  }, [initialCode, onChange]);

  useEffect(() => {
    if (!isRunnable || isKotlin) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isRunnable, isKotlin, runCode, isFullscreen]);

  const handleEditorMount = useCallback(
    (_editor: any, monaco: any) => {
      // Avoid editor.focus() on mount: it causes the page to scroll to the focused
      // editor. Blog posts have many CodeEditors; the last one to mount would
      // scroll the page to the bottom. Users can click into an editor to focus it.
      monaco.editor.setTheme("vs-dark");
      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
      const isTsOrJs =
        isReactLike ||
        normalizedLang === "typescript" ||
        normalizedLang === "javascript";
      if (isTsOrJs) {
        const noValidation = disableLinting || !isRunnable;
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: noValidation,
          noSyntaxValidation: noValidation,
          diagnosticCodesToIgnore: [1375],
        });
        if (monaco.languages.typescript.javascriptDefaults) {
          monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: noValidation,
            noSyntaxValidation: noValidation,
            diagnosticCodesToIgnore: [1375],
          });
        }
      }
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        allowJs: true,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        jsx: monaco.languages.typescript.JsxEmit.React,
      });
    },
    [disableLinting, isRunnable, isReactLike, normalizedLang]
  );

  const editorSection = (
    <div className="flex flex-col border border-white/5 bg-[#0b1020] rounded-lg overflow-hidden" style={{ display: 'flex', flexDirection: 'column', minHeight: height === "auto" ? 400 : typeof height === 'number' ? height : 400 }}>
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.2)]"></span>
          {language}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200">
            <button
              className="px-1 hover:text-white"
              onClick={() => setFontSize((s) => Math.max(10, s - 1))}
              aria-label="Decrease font size"
            >
              A-
            </button>
            <span className="px-1 tabular-nums">{fontSize}</span>
            <button
              className="px-1 hover:text-white"
              onClick={() => setFontSize((s) => Math.min(24, s + 1))}
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>
          {!readOnly && (
            <>
              <button
                onClick={handleReset}
                className="px-3 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10"
              >
                Reset
              </button>
              <button
                onClick={runCode}
                className={`px-3 py-1 text-xs rounded-md text-[#041021] bg-linear-to-r from-[#6c8bff] to-[#7cf4ff] border border-white/20 shadow-[0_8px_30px_rgba(124,244,255,0.25)] hover:brightness-110 ${
                  isRunning ? "opacity-70" : ""
                }`}
              >
                {isRunning ? "Running…" : "Run (⌘/Ctrl+Enter)"}
              </button>
            </>
          )}
          <button
            onClick={() => setIsFullscreen((v) => !v)}
            className="px-3 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10"
          >
            {isFullscreen ? "Exit" : "Maximize"}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ display: 'flex', flexDirection: 'column' }}>
        {isKotlin ? (
          <div className="p-3 bg-[#0b1020] text-slate-100 overflow-auto flex-1">
            <pre
              className="kotlin-playground"
              data-target-platform="js"
              data-auto-indent="true"
              data-theme="darcula"
              data-readonly={readOnly ? "true" : "false"}
            >
{code}
            </pre>
          </div>
        ) : (
          <div className="flex-1" style={{ minHeight: 300 }}>
            <MonacoEditor
              height={height === "auto" ? 400 : height}
              language={isReactLike ? "typescript" : language}
              path="App.tsx"
              value={code}
              onChange={(value) => {
                const next = value || "";
                setCode(next);
                if (onChange) onChange(next);
              }}
              options={editorOptions}
              onMount={handleEditorMount}
              theme="vs-dark"
            />
          </div>
        )}
      </div>
    </div>
  );

  const previewSection =
    isRunnable && !isKotlin ? (
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="border border-white/10 rounded-lg bg-[#0b1020] p-3">
          <div className="text-xs text-slate-300 mb-2">Preview</div>
          <iframe
            ref={iframeRef}
            title="playground-preview"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={outputHtml}
            className="w-full h-64 bg-white rounded-md border border-white/10"
          />
          {error && <div className="mt-2 text-xs text-red-300">⚠️ {error}</div>}
        </div>
        <div className="border border-white/10 rounded-lg bg-[#0b1020] p-3">
          <div className="text-xs text-slate-300 mb-2">Console</div>
          <div className="h-64 overflow-auto text-xs text-slate-100 space-y-1 font-mono">
            {logs.length === 0 ? <div className="text-slate-500">Logs will appear here.</div> : null}
            {logs.map((line, idx) => (
              <div key={`${line}-${idx}`} className="whitespace-pre-wrap wrap-break-word">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : null;

  const shell = (
    <div className={`rounded-xl shadow-lg border border-white/10 bg-[#0b1020] p-3 ${className}`}>
      {editorSection}
      {previewSection}
    </div>
  );

  return (
    <>
      {shell}
      <AnimatePresence>
        {isFullscreen && isMounted && (
          <motion.div
            className="fixed inset-0 z-2000 bg-[#0b0f1a]/80 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full h-full max-w-[1400px] max-h-[90vh] overflow-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {shell}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
