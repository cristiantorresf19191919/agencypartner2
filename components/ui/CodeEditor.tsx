"use client";

/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState, useEffect, useRef, useCallback, useMemo, useId } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Maximize2, Minimize2, Minus, Plus, Monitor, Terminal, AlertCircle, FilePlus, X } from "lucide-react";
// @ts-ignore
import * as Babel from "@babel/standalone";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="w-full h-40 grid place-items-center text-sm text-slate-300">Loading editor…</div>,
});

interface CodeFile {
  name: string;
  content: string;
  language: string;
}

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
  /** Enable multi-file support for creating solution files */
  enableMultiFile?: boolean;
  /** Auto-inject React imports when React hooks/JSX are detected */
  autoInjectImports?: boolean;
}

const REACT_UMD = `
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
`;

// Helper function to detect React usage and generate imports
const detectAndInjectImports = (code: string, isReactLike: boolean): string => {
  if (!isReactLike) return code;
  
  // Check if imports already exist (look for any import statement, not just at start)
  const hasReactImport = /import\s+.*from\s+["']react["']/.test(code);
  if (hasReactImport) return code;
  
  // Detect React features used
  const usesJSX = /<[A-Z]/.test(code) || /<[a-z]+[^>]*>/.test(code);
  const usesHooks = /\b(useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useLayoutEffect|useImperativeHandle|useDebugValue|useId|useTransition|useDeferredValue|useSyncExternalStore|useInsertionEffect)\b/.test(code);
  const usesReact = /\bReact\./.test(code);
  
  if (!usesJSX && !usesHooks && !usesReact) return code;
  
  // Build import statement - only include hooks that are actually used
  const imports: string[] = [];
  if (usesHooks) {
    const hookMatches = code.matchAll(/\b(useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useLayoutEffect|useImperativeHandle|useDebugValue|useId|useTransition|useDeferredValue|useSyncExternalStore|useInsertionEffect)\b/g);
    const hooks = new Set<string>();
    for (const match of hookMatches) {
      hooks.add(match[1]);
    }
    if (hooks.size > 0) {
      imports.push(...Array.from(hooks).sort());
    }
  }
  // React is needed for JSX or React.* usage
  if ((usesJSX || usesReact) && !imports.includes("React")) {
    imports.unshift("React");
  }
  
  if (imports.length === 0) return code;
  
  const importStatement = `import { ${imports.join(", ")} } from "react";\n\n`;
  return importStatement + code;
};

export function CodeEditor({
  code: initialCode,
  language = "tsx",
  onChange,
  readOnly = false,
  height = 420,
  className = "",
  defaultFullscreen = false,
  disableLinting = true,
  enableMultiFile = false,
  autoInjectImports = true,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isFullscreen, setIsFullscreen] = useState(defaultFullscreen);
  const [isMounted, setIsMounted] = useState(false);
  const [outputHtml, setOutputHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(14);
  const [files, setFiles] = useState<CodeFile[]>([{ name: "App.tsx", content: initialCode, language }]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const uniqueId = useId();

  const normalizedLang = language.toLowerCase();
  const isKotlin = normalizedLang.includes("kotlin");
  const isReactLike = ["react", "tsx", "jsx"].includes(normalizedLang);
  const isRunnable =
    !readOnly && (["javascript", "typescript", "jsx", "tsx", "react"].includes(normalizedLang) || isKotlin);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    // Auto-inject imports if enabled and missing
    let processedCode = initialCode;
    if (autoInjectImports && isReactLike && !readOnly) {
      const codeWithImports = detectAndInjectImports(initialCode, isReactLike);
      if (codeWithImports !== initialCode) {
        processedCode = codeWithImports;
      }
    }
    
    setCode(processedCode);
    if (enableMultiFile) {
      setFiles([{ name: "App.tsx", content: processedCode, language }]);
      setActiveFileIndex(0);
    }
  }, [initialCode, enableMultiFile, language, autoInjectImports, isReactLike, readOnly]);
  
  // Get current file content
  const currentFile = enableMultiFile && files.length > 0 ? files[activeFileIndex] : null;
  const currentCode = enableMultiFile && currentFile ? currentFile.content : code;

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

  const addFile = useCallback(() => {
    if (!enableMultiFile) return;
    const newFileName = `solution-${files.length}.tsx`;
    const newFile: CodeFile = {
      name: newFileName,
      content: `// Solution file
export function solution() {
  // Your solution code here
}`,
      language: "tsx",
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
  }, [enableMultiFile, files]);
  
  const removeFile = useCallback((index: number) => {
    if (!enableMultiFile || files.length <= 1) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (activeFileIndex >= newFiles.length) {
      setActiveFileIndex(newFiles.length - 1);
    } else if (activeFileIndex > index) {
      setActiveFileIndex(activeFileIndex - 1);
    }
  }, [enableMultiFile, files, activeFileIndex]);
  
  const updateFileContent = useCallback((index: number, content: string) => {
    if (!enableMultiFile) {
      setCode(content);
      if (onChange) onChange(content);
      return;
    }
    const newFiles = [...files];
    newFiles[index] = { ...newFiles[index], content };
    setFiles(newFiles);
    if (onChange && index === activeFileIndex) {
      onChange(content);
    }
  }, [enableMultiFile, files, activeFileIndex, onChange]);
  
  // Build combined code from all files for execution
  const buildCombinedCode = useCallback((): string => {
    if (!enableMultiFile || files.length === 1) {
      return autoInjectImports ? detectAndInjectImports(currentCode, isReactLike) : currentCode;
    }
    
    // Combine all files, making non-main files available for import
    const mainFile = files[0];
    const otherFiles = files.slice(1);
    
    // Create a module system for imports
    let combined = autoInjectImports ? detectAndInjectImports(mainFile.content, isReactLike) : mainFile.content;
    
    // Add other files as exportable modules
    if (otherFiles.length > 0) {
      combined += "\n\n// Additional files available for import:\n";
      otherFiles.forEach((file, idx) => {
        const moduleName = file.name.replace(/\.(tsx?|jsx?)$/, "");
        combined += `\n// File: ${file.name}\n`;
        // Inject imports in solution files too
        const fileContent = autoInjectImports ? detectAndInjectImports(file.content, isReactLike) : file.content;
        combined += `(function() {\n  const ${moduleName}Module = {};\n  const exports = ${moduleName}Module;\n  ${fileContent}\n  window.__modules__ = window.__modules__ || {};\n  window.__modules__['${file.name}'] = ${moduleName}Module;\n})();\n`;
      });
    }
    
    return combined;
  }, [enableMultiFile, files, currentCode, autoInjectImports, isReactLike]);

  const runCode = useCallback(async () => {
    if (!isRunnable || isKotlin) return;
    setIsRunning(true);
    setError(null);
    setLogs([]);
    try {
      // Get combined code with auto-injected imports
      const codeToRun = buildCombinedCode();
      
      // For React/TSX code, automatically detect and wrap exported components
      let wrapped = codeToRun;
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
  }, [buildCombinedCode, isKotlin, isRunnable, isReactLike]);

  const handleReset = useCallback(() => {
    if (enableMultiFile) {
      setFiles([{ name: "App.tsx", content: initialCode, language }]);
      setActiveFileIndex(0);
    } else {
      setCode(initialCode);
    }
    setOutputHtml("");
    setLogs([]);
    setError(null);
    if (onChange) onChange(initialCode);
  }, [initialCode, onChange, enableMultiFile, language]);

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
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        types: ["react", "react-dom"],
      });
      
      // Add React type definitions for better autocomplete
      if (isReactLike) {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `declare module "react" {
            export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
            export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
            export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
            export function useMemo<T>(factory: () => T, deps: any[]): T;
            export function useRef<T>(initial: T): { current: T };
            export function useContext<T>(context: any): T;
            export function useReducer<R>(reducer: (state: R, action: any) => R, initial: R): [R, (action: any) => void];
            export function useId(): string;
            export function useTransition(): [boolean, (callback: () => void) => void];
            export function useDeferredValue<T>(value: T): T;
            export function useSyncExternalStore<T>(subscribe: (onStoreChange: () => void) => () => void, getSnapshot: () => T): T;
            export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
            export function useImperativeHandle<T>(ref: any, init: () => T, deps?: any[]): void;
            export function useDebugValue(value: any, formatter?: (value: any) => any): void;
            export function useInsertionEffect(effect: () => void | (() => void), deps?: any[]): void;
            export const createElement: any;
            export const Fragment: any;
            export default any;
          }`,
          "file:///node_modules/@types/react/index.d.ts"
        );
      }
    },
    [disableLinting, isRunnable, isReactLike, normalizedLang]
  );

  const editorSection = (
    <div className="flex flex-col border border-white/5 bg-[#0b1020] rounded-lg overflow-hidden" style={{ display: 'flex', flexDirection: 'column', minHeight: height === "auto" ? 400 : typeof height === 'number' ? height : 400 }}>
      <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {enableMultiFile && files.length > 1 ? (
            <div className="flex items-center gap-1 overflow-x-auto flex-1">
              {files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                    idx === activeFileIndex
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <span>{file.name}</span>
                  {files.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="ml-1 hover:text-red-400 transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </button>
              ))}
              <button
                onClick={addFile}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors shrink-0"
                aria-label="Add new file"
              >
                <FilePlus className="h-3.5 w-3.5" />
                <span>New File</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.2)]"></span>
              {enableMultiFile && currentFile ? currentFile.name : language}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Font size */}
          <div
            className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 overflow-hidden"
            role="group"
            aria-label="Font size"
          >
            <button
              onClick={() => setFontSize((s) => Math.max(10, s - 1))}
              aria-label="Decrease font size"
              className="flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-inset"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
            <span
              className="min-w-8 px-1.5 text-center text-xs font-medium tabular-nums text-slate-300"
              aria-hidden
            >
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize((s) => Math.min(24, s + 1))}
              aria-label="Increase font size"
              className="flex h-8 w-8 items-center justify-center text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-inset"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
          <span className="h-4 w-px bg-white/10" aria-hidden />
          {!readOnly && (
            <>
              <button
                onClick={handleReset}
                aria-label="Reset code"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-white/20 hover:bg-white/10 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1628]"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                Reset
              </button>
              {!isKotlin && (
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  aria-label={isRunning ? "Running" : "Run code"}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 px-4 text-xs font-semibold text-[#0a0f1a] shadow-[0_2px_12px_rgba(34,211,238,0.4)] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(34,211,238,0.5)] hover:from-cyan-300 hover:via-blue-300 hover:to-indigo-300 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1628] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-[0_2px_12px_rgba(34,211,238,0.4)] ${
                    isRunning ? "cursor-wait" : ""
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" strokeWidth={2} />
                  {isRunning ? "Running…" : "Run"}
                  <kbd className="ml-0.5 hidden rounded bg-black/20 px-1.5 py-0.5 font-sans text-[10px] sm:inline">⌘↵</kbd>
                </button>
              )}
            </>
          )}
          <button
            onClick={() => setIsFullscreen((v) => !v)}
            aria-label={isFullscreen ? "Exit fullscreen" : "Maximize"}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-transparent px-3 text-xs font-medium text-slate-300 transition-all duration-150 hover:border-white/20 hover:bg-white/10 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1628]"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" strokeWidth={2} /> : <Maximize2 className="h-3.5 w-3.5" strokeWidth={2} />}
            {isFullscreen ? "Exit" : "Maximize"}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="flex-1" style={{ minHeight: 300 }}>
          <MonacoEditor
            height={height === "auto" ? 400 : height}
            language={isReactLike ? "typescript" : (enableMultiFile && currentFile ? currentFile.language : normalizedLang)}
            path={isKotlin ? `kotlin-${uniqueId.replace(/:/g, "")}.kt` : (enableMultiFile && currentFile ? currentFile.name : "App.tsx")}
            value={currentCode}
            onChange={(value) => {
              const next = value || "";
              updateFileContent(activeFileIndex, next);
            }}
            options={editorOptions}
            onMount={handleEditorMount}
            theme="vs-dark"
          />
        </div>
      </div>
    </div>
  );

  const previewSection =
    isRunnable && !isKotlin ? (
      <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-[#0b1020]">
        <div className="grid min-h-0 md:grid-cols-2">
          {/* Preview */}
          <div className="flex flex-col border-b border-white/10 md:border-b-0 md:border-r md:border-r-white/10">
            <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
              <Monitor className="h-3.5 w-3.5 text-cyan-400/80" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Preview</span>
            </div>
            <div className="relative flex min-h-72 flex-1 flex-col p-3">
              {!outputHtml ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/5">
                  <div className="mb-2 rounded-full bg-white/5 p-3">
                    <Play className="h-5 w-5 text-slate-500" strokeWidth={2} />
                  </div>
                  <p className="text-sm text-slate-500">Run the code to see the preview</p>
                  <p className="mt-0.5 text-xs text-slate-600">Press Run or ⌘↵</p>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  title="playground-preview"
                  sandbox="allow-scripts allow-same-origin"
                  srcDoc={outputHtml}
                  className="min-h-60 w-full flex-1 rounded-lg border border-white/10 bg-[#0e1628]"
                />
              )}
              {error && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" strokeWidth={2} />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}
            </div>
          </div>
          {/* Console */}
          <div className="flex flex-col">
            <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
              <Terminal className="h-3.5 w-3.5 text-emerald-400/80" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Console</span>
              {logs.length > 0 && (
                <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium tabular-nums text-slate-400">
                  {logs.length}
                </span>
              )}
            </div>
            <div className="flex min-h-72 flex-1 flex-col overflow-hidden p-3">
              {logs.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/5">
                  <Terminal className="mb-2 h-8 w-8 text-slate-600" strokeWidth={1.5} />
                  <p className="text-sm text-slate-500">Logs will appear here</p>
                  <p className="mt-0.5 text-xs text-slate-600">console.log, warnings, errors</p>
                </div>
              ) : (
                <div className="flex-1 overflow-auto rounded-lg border border-white/10 bg-[#0a0f1a] px-3 py-2 font-mono text-xs leading-relaxed text-slate-200">
                  {logs.map((line, idx) => (
                    <div
                      key={`${line}-${idx}`}
                      className="whitespace-pre-wrap wrap-break-word border-b border-white/5 py-1.5 last:border-b-0"
                    >
                      <span className="select-none pr-2 text-slate-600">{idx + 1}</span>
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
