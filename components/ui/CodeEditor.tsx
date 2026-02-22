"use client";

/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState, useEffect, useRef, useCallback, useMemo, useId } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Maximize2, Minimize2, Minus, Plus, Monitor, Terminal, AlertCircle, FilePlus, X, Copy, ClipboardPaste, MousePointer2, ChevronDown, ChevronRight, ChevronUp, Code2, MoreVertical, Check, XCircle } from "lucide-react";
// @ts-ignore
import * as Babel from "@babel/standalone";
import { ensureEmmetJSX } from "@/lib/emmetMonaco";
import { Highlight, themes } from "prism-react-renderer";
import styles from "./CodeEditor.module.css";

/** Languages supported by prism-react-renderer's bundled Prism. */
const HIGHLIGHT_LANGUAGES = new Set([
  "markup", "html", "xml", "svg", "mathml", "ssml", "atom", "rss",
  "css", "clike", "javascript", "js", "jsx", "typescript", "ts", "tsx",
  "kotlin", "python", "json", "yaml", "markdown", "go", "rust", "swift",
  "objectivec", "graphql", "cpp", "reason",
]);

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading editor…</div>,
});

/** Mobile breakpoint: editor uses static block by default and contained layout. */
const MOBILE_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isMobile;
}

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
  /** When true, Preview and Console panels start collapsed (blog/comparison mode). */
  collapsePanelsByDefault?: boolean;
  /** Show a badge in the toolbar: "bad" = avoid, "good" = recommended. */
  exampleVariant?: "bad" | "good";
  /** Label for the badge when exampleVariant is set (e.g. "Ejemplo a evitar"). */
  exampleBadgeLabel?: string;
  /** Max height (px) for the code area; internal scroll. When unset, desktop uses content-based height (up to 920 for long code). */
  maxCodeHeight?: number;
  /** Use compact toolbar: primary Run, secondary Copy, tertiary (Reset, font, Maximize) in ⋯ menu. */
  compactToolbar?: boolean;
}

/** Default editor height when content has many lines (developer section). */
const LARGE_CODE_HEIGHT = 920;
const LINE_HEIGHT_PX = 22;
const EDITOR_VERTICAL_PADDING = 120; // toolbar + container padding

/** Height that fits the code so the editor doesn't show a large empty gap below short snippets. */
function getContentBasedHeight(code: string): number {
  const lines = Math.max(1, (code || "").trim().split("\n").length);
  const contentHeight = lines * LINE_HEIGHT_PX + EDITOR_VERTICAL_PADDING;
  return Math.min(LARGE_CODE_HEIGHT, Math.max(220, contentHeight));
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
  // React is needed for JSX or React.* usage (default export, not named)
  const needsDefaultReact = (usesJSX || usesReact) && !imports.includes("React");

  if (imports.length === 0 && !needsDefaultReact) return code;

  // Use default import for React so preview iframe (UMD) works: import React, { useState } from "react"
  const defaultPart = needsDefaultReact ? "React" : "";
  const namedPart =
    imports.length > 0
      ? (defaultPart ? ", " : "") + "{ " + imports.join(", ") + " }"
      : "";
  const importStatement = `import ${defaultPart}${namedPart} from "react";\n\n`;
  return importStatement + code;
};

export function CodeEditor({
  code: initialCode,
  language = "tsx",
  onChange,
  readOnly = false,
  height,
  className = "",
  defaultFullscreen = false,
  disableLinting = true,
  enableMultiFile = false,
  autoInjectImports = true,
  collapsePanelsByDefault,
  exampleVariant,
  exampleBadgeLabel,
  maxCodeHeight,
  compactToolbar = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isFullscreen, setIsFullscreen] = useState(defaultFullscreen);
  const [showFullscreenPortal, setShowFullscreenPortal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [outputHtml, setOutputHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(17);
  const [files, setFiles] = useState<CodeFile[]>([{ name: "App.tsx", content: initialCode, language }]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tertiaryMenuOpen, setTertiaryMenuOpen] = useState(false);
  const [tertiaryMenuRect, setTertiaryMenuRect] = useState<DOMRect | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  type EditorInstance = {
    layout: () => void;
    getModel: () => { getFullModelRange: () => unknown } | null;
    setSelection: (range: unknown) => void;
    focus: () => void;
    trigger: (source: string, handlerId: string, payload?: object) => void;
  };
  const editorInstanceRef = useRef<EditorInstance | null>(null);
  const tertiaryMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [fullscreenEditorHeight, setFullscreenEditorHeight] = useState(400);
  const uniqueId = useId();
  const isMobile = useIsMobile();

  const contentBasedHeight = useMemo(() => getContentBasedHeight(initialCode), [initialCode]);
  const effectiveHeight =
    height !== undefined && height !== "auto"
      ? typeof height === "number"
        ? height
        : Number(height) || contentBasedHeight
      : contentBasedHeight;

  // Resizable layout: editor gets more space by default (70%), Preview/Console split 50/50
  const [editorPanelRatio, setEditorPanelRatio] = useState(0.7);
  const [previewConsoleRatio, setPreviewConsoleRatio] = useState(0.5);
  const effectiveCollapseByDefault = collapsePanelsByDefault ?? true;
  const [previewCollapsed, setPreviewCollapsed] = useState(effectiveCollapseByDefault);
  const [consoleCollapsed, setConsoleCollapsed] = useState(effectiveCollapseByDefault);
  const [resizingVertical, setResizingVertical] = useState(false);
  const [resizingHorizontal, setResizingHorizontal] = useState(false);
  const resizableContainerRef = useRef<HTMLDivElement | null>(null);
  const lastInitialCodeRef = useRef<string | null>(null);
  const [editorAreaHeight, setEditorAreaHeight] = useState<number | null>(null);

  // Measure code area height so Monaco can fill the container (no gap above Preview/Console)
  useEffect(() => {
    const el = editorContainerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.contentRect.height;
        if (h > 0) setEditorAreaHeight(h);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleVerticalResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startRatio = editorPanelRatio;
    const onMove = (moveEvent: MouseEvent) => {
      const el = resizableContainerRef.current;
      if (!el) return;
      const h = el.getBoundingClientRect().height;
      const delta = moveEvent.clientY - startY;
      const ratioDelta = delta / h;
      const next = Math.max(0.25, Math.min(0.85, startRatio + ratioDelta));
      setEditorPanelRatio(next);
    };
    const onUp = () => {
      setResizingVertical(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    setResizingVertical(true);
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [editorPanelRatio]);

  const handleHorizontalResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startRatio = previewConsoleRatio;
    const onMove = (moveEvent: MouseEvent) => {
      const el = resizableContainerRef.current;
      if (!el) return;
      const w = el.getBoundingClientRect().width;
      const delta = moveEvent.clientX - startX;
      const ratioDelta = delta / w;
      const next = Math.max(0.2, Math.min(0.8, startRatio + ratioDelta));
      setPreviewConsoleRatio(next);
    };
    const onUp = () => {
      setResizingHorizontal(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    setResizingHorizontal(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [previewConsoleRatio]);

  const normalizedLang = language.toLowerCase();
  const isKotlin = normalizedLang.includes("kotlin");
  const isReactLike = ["react", "tsx", "jsx"].includes(normalizedLang);
  const isRunnable =
    !readOnly && (["javascript", "typescript", "jsx", "tsx", "react"].includes(normalizedLang) || isKotlin);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (isFullscreen) {
      setShowFullscreenPortal(true);
      // On mobile fullscreen, auto-collapse Preview/Console so the code area gets maximum space
      if (isMobile) {
        setPreviewCollapsed(true);
        setConsoleCollapsed(true);
      }
    }
  }, [isFullscreen, isMobile]);

  useEffect(() => {
    if (!isFullscreen || !editorContainerRef.current) return;
    const el = editorContainerRef.current;
    const updateHeight = () => setFullscreenEditorHeight(el.clientHeight);
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isFullscreen, showFullscreenPortal]);

  // Prevent scroll-chaining: when Monaco reaches its scroll boundary, stop the wheel event from scrolling the parent page.
  useEffect(() => {
    const el = editorContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const scrollable = el.querySelector(".monaco-scrollable-element") as HTMLElement | null;
      if (!scrollable) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollable;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) {
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // When editor container scrolls into view, re-layout Monaco so code is visible (fixes blank editor when below fold)
  useEffect(() => {
    const el = editorContainerRef.current;
    const useStaticBlock = isMobile && !mobileEditorOpen;
    if (!el || useStaticBlock) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            editorInstanceRef.current?.layout();
            break;
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isMobile, mobileEditorOpen]);

  // Only sync initialCode to code when the prop value actually changes (not when other deps change).
  // This prevents the editor from being wiped when parent re-renders or when user collapses/expands panels.
  useEffect(() => {
    if (lastInitialCodeRef.current !== null && initialCode === lastInitialCodeRef.current) return;
    lastInitialCodeRef.current = initialCode;

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
        setConsoleCollapsed(false);
      }
      if (event.data?.type === "playground-error") {
        setError(event.data.message);
        setPreviewCollapsed(false);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-code-editor-fullscreen", "true");
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-code-editor-fullscreen");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-code-editor-fullscreen");
    };
  }, [isFullscreen]);

  // Position tertiary menu dropdown: measure button when open so portal can render above everything
  useEffect(() => {
    if (!tertiaryMenuOpen) {
      setTertiaryMenuRect(null);
      return;
    }
    const el = tertiaryMenuButtonRef.current;
    if (!el) return;
    const update = () => setTertiaryMenuRect(el.getBoundingClientRect());
    const raf = requestAnimationFrame(update);
    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", update);
    };
  }, [tertiaryMenuOpen]);

  // Re-layout Monaco when panel collapse/expand, fullscreen, or resize ratios change so the editor re-paints and doesn't appear blank.
  useEffect(() => {
    if (isMobile && !mobileEditorOpen) return;
    const id = requestAnimationFrame(() => {
      editorInstanceRef.current?.layout();
    });
    return () => cancelAnimationFrame(id);
  }, [previewCollapsed, consoleCollapsed, isFullscreen, editorPanelRatio, previewConsoleRatio, isMobile, mobileEditorOpen]);

  // When entering fullscreen (portal), Monaco may mount in a container that isn't sized yet; layout again after a short delay.
  useEffect(() => {
    if (!isFullscreen || (isMobile && !mobileEditorOpen)) return;
    const t = setTimeout(() => {
      editorInstanceRef.current?.layout();
    }, 100);
    return () => clearTimeout(t);
  }, [isFullscreen, isMobile, mobileEditorOpen]);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: isMobile ? 14 : fontSize,
      fontLigatures: true,
      smoothScrolling: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderLineHighlight: "all" as const,
      suggest: { preview: true, showWords: true },
      quickSuggestions: !isMobile,
      tabSize: 2,
      formatOnPaste: true,
      readOnly,
      formatOnType: true,
      // Richer syntax/semantic colors so code is easier to read (keywords, strings, etc.)
      semanticHighlighting: { enabled: true },
      // Mobile: no error gutter (avoids clipped red markers), no line numbers to reduce noise
      glyphMargin: !isMobile,
      lineNumbers: (isMobile ? "off" : "on") as "on" | "off",
      folding: !isMobile,
      // Enhanced editor experience
      lineHeight: isMobile ? 22 : 26,
      padding: { top: 16, bottom: 16 },
      cursorBlinking: "smooth" as const,
      cursorSmoothCaretAnimation: "on" as const,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
      bracketPairColorization: { enabled: true },
    }),
    [fontSize, readOnly, isMobile]
  );

  const buildPreviewHTML = (jsCode: string, moduleFileNames: string[] = []) => {
    const moduleNamesJson = JSON.stringify(moduleFileNames);
    const requireBody =
      moduleFileNames.length === 0
        ? `if (name === "react") return window.React;
        if (name === "react-dom") return window.ReactDOM;
        throw new Error("Module not found: " + name);`
        : `if (name === "react") return window.React;
        if (name === "react-dom") return window.ReactDOM;
        var mods = window.__modules__ || {};
        var key = name.replace(/^\\.\\//, "").replace(/\\.(tsx?|jsx?)$/, "");
        for (var i = 0; i < moduleFileNames.length; i++) {
          var f = moduleFileNames[i];
          var base = f.replace(/\\.(tsx?|jsx?)$/, "");
          if (base === key || f === name || f === name.replace(/^\\.\\//, "")) {
            if (mods[f]) return mods[f];
            return mods[base + ".tsx"] || mods[base + ".jsx"] || mods[base + ".ts"] || mods[base + ".js"] || mods[f];
          }
        }
        throw new Error("Module not found: " + name);`;
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body { margin: 0; padding: 16px; background:#0b1020; color:#e5edff; font-family: Inter, system-ui, -apple-system, sans-serif;}
      #root { min-height: 100px; }
      pre { white-space: pre-wrap; word-break: break-word; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    ${REACT_UMD}
    <script>
      const parentWindow = window.parent;
      const moduleFileNames = ${moduleNamesJson};
      const safeConsole = {
        log: (...args) => parentWindow.postMessage({ type: "playground-log", message: args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ") }, "*"),
        warn: (...args) => parentWindow.postMessage({ type: "playground-log", message: "⚠️ " + args.join(" ") }, "*"),
        error: (...args) => parentWindow.postMessage({ type: "playground-log", message: "❌ " + args.join(" ") }, "*"),
      };
      var module = { exports: {} };
      var exports = module.exports;
      function require(name) {
        ${requireBody}
      }
      function runPreview() {
        var rootEl = document.getElementById("root");
        var React = window.React;
        var ReactDOM = window.ReactDOM;
        if (typeof React === "undefined" || !React.createElement) {
          rootEl.innerHTML = "<pre style='color:#f87171;white-space:pre-wrap'>React did not load. Check network or try again.</pre>";
          return;
        }
        if (!ReactDOM || !ReactDOM.createRoot) {
          rootEl.innerHTML = "<pre style='color:#f87171;white-space:pre-wrap'>ReactDOM did not load. Check network or try again.</pre>";
          return;
        }
        try {
          ${jsCode}
          var ComponentToRender = window.__APP__ != null ? window.__APP__ : (module.exports && (module.exports.default !== undefined ? module.exports.default : module.exports));
          if (ComponentToRender && typeof ComponentToRender === "function") {
            function PreviewErrorBoundary(props) {
              React.Component.call(this, props);
              this.state = { hasError: false, error: null };
            }
            PreviewErrorBoundary.prototype = Object.create(React.Component.prototype);
            PreviewErrorBoundary.prototype.constructor = PreviewErrorBoundary;
            PreviewErrorBoundary.getDerivedStateFromError = function(err) { return { hasError: true, error: err }; };
            PreviewErrorBoundary.prototype.componentDidCatch = function(err) {
              parentWindow.postMessage({ type: "playground-error", message: err?.message || String(err) }, "*");
            };
            PreviewErrorBoundary.prototype.render = function() {
              if (this.state && this.state.hasError && this.state.error) {
                return React.createElement("pre", { style: { color: "#f87171", whiteSpace: "pre-wrap", padding: "16px", margin: 0 } }, this.state.error?.message || String(this.state.error));
              }
              return this.props.children;
            };
            var RootWithBoundary = React.createElement(PreviewErrorBoundary, null, React.createElement(ComponentToRender));
            var root = ReactDOM.createRoot(rootEl);
            root.render(RootWithBoundary);
          } else {
            rootEl.innerHTML = "<pre style='color:#e5edff;white-space:pre-wrap'>No default export (App) was found. Export a component: export default App;</pre>";
          }
        } catch (err) {
          parentWindow.postMessage({ type: "playground-error", message: err?.message || String(err) }, "*");
          rootEl.innerHTML = "<pre style='color:#f87171;white-space:pre-wrap'>" + (err?.message || String(err)) + "</pre>";
        }
      }
      window.addEventListener("load", runPreview);
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

  // Build combined code from all files for execution. Other files run first so window.__modules__ is populated for require().
  const buildCombinedCode = useCallback((): { code: string; moduleFileNames: string[] } => {
    const mainContent = autoInjectImports ? detectAndInjectImports(currentCode, isReactLike) : currentCode;
    if (!enableMultiFile || files.length === 1) {
      return { code: mainContent, moduleFileNames: [] };
    }

    const mainFile = files[0];
    const otherFiles = files.slice(1);
    const moduleFileNames = otherFiles.map((f) => f.name);

    // Run other files first so window.__modules__ is available when main file does require('./solution-1')
    let combined = "window.__modules__ = window.__modules__ || {};\n";
    otherFiles.forEach((file) => {
      const moduleName = file.name.replace(/\.(tsx?|jsx?)$/, "");
      const fileContent = autoInjectImports ? detectAndInjectImports(file.content, isReactLike) : file.content;
      combined += `(function() {\n  var __exports = {};\n  var exports = __exports;\n  var module = { exports: __exports };\n  ${fileContent}\n  window.__modules__["${file.name}"] = __exports;\n  window.__modules__["${moduleName}"] = __exports;\n})();\n`;
    });
    combined += "\n// Main file (App.tsx)\n";
    combined += autoInjectImports ? detectAndInjectImports(mainFile.content, isReactLike) : mainFile.content;

    return { code: combined, moduleFileNames };
  }, [enableMultiFile, files, currentCode, autoInjectImports, isReactLike]);

  const runCode = useCallback(async () => {
    if (!isRunnable || isKotlin) return;
    setIsRunning(true);
    setError(null);
    setLogs([]);
    try {
      // Get combined code with auto-injected imports (and module file names for cross-file require)
      const { code: codeToRun, moduleFileNames } = buildCombinedCode();

      // For React/TSX code, automatically detect and wrap exported components
      let wrapped = codeToRun;
      if (isReactLike) {
        // Check if code already defines App or has default export (use codeToRun so we see same content as will run)
        const hasApp = /\b(App|window\.__APP__)\s*[=:]/.test(codeToRun);
        const hasDefaultExport = /export\s+default\s+/.test(codeToRun);

        if (!hasApp && !hasDefaultExport) {
          // Try to find exported component names
          const exportMatches = [
            ...codeToRun.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g),
            ...codeToRun.matchAll(/export\s+{\s*(\w+)/g),
          ];

          if (exportMatches.length > 0) {
            // Get the first exported component name
            const componentName = exportMatches[0][1];

            // Wrap code to capture exports and create App (use codeToRun so injected imports are included)
            wrapped = `${codeToRun}

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
            wrapped = `${codeToRun}

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
          wrapped = `${codeToRun}
;window.__APP__ = typeof App !== "undefined" ? App : (typeof exports !== "undefined" ? exports.default : null);`;
        }
      } else {
        // Non-React code
        wrapped = `${codeToRun}
;window.__APP__ = typeof App !== "undefined" ? App : (typeof exports !== "undefined" ? exports.default : null);`;
      }

      let transpiled: string;
      try {
        const transformed = Babel.transform(wrapped, {
          presets: [
            ["env", { modules: "commonjs" }],
            "react",
            "typescript",
          ],
          sourceType: "module",
          filename: "App.tsx",
        });
        transpiled = transformed?.code ?? "";
      } catch (transformErr) {
        const msg = (transformErr as Error).message ?? String(transformErr);
        setError(`Transpile failed: ${msg}`);
        setPreviewCollapsed(false);
        setOutputHtml(
          `<!DOCTYPE html><html><body style="margin:0;padding:16px;background:#1e1e1e;color:#f87171;font-family:monospace;white-space:pre-wrap">${msg.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</body></html>`
        );
        return;
      }

      const html = buildPreviewHTML(transpiled, moduleFileNames);
      setOutputHtml(html);
      setPreviewCollapsed(false);
    } catch (err) {
      setError((err as Error).message);
      setPreviewCollapsed(false);
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

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      /* ignore */
    }
  }, [currentCode]);

  const handleSelectAll = useCallback(() => {
    const editor = editorInstanceRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (model) {
      editor.setSelection(model.getFullModelRange());
      editor.focus();
    }
  }, []);

  const handlePaste = useCallback(() => {
    const editor = editorInstanceRef.current;
    if (!editor || readOnly) return;
    editor.focus();
    editor.trigger("keyboard", "editor.action.clipboardPasteAction", {});
  }, [readOnly]);

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

  const handleBeforeMount = useCallback((monaco: any) => {
    ensureEmmetJSX(monaco);
  }, []);

  const handleEditorMount = useCallback(
    (editor: any, monaco: any) => {
      editorInstanceRef.current = editor;
      // Layout once after mount so code is visible when editor is in view (fixes blank editor when below fold)
      requestAnimationFrame(() => {
        editor?.layout();
      });
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
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
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

  // Mobile: default to static read-only block; "Open editor" expands inline (contained, no fixed/sticky/portal)
  const showStaticBlock = isMobile && !mobileEditorOpen;
  const editorHeightNum = effectiveHeight;
  const mobileEditorHeight = 320;

  const effectiveMaxCodeHeight = maxCodeHeight ?? (isMobile ? 280 : Math.max(400, contentBasedHeight));

  const mobileStaticBlock = showStaticBlock && (
    <div className={isFullscreen ? styles.staticBlockFullscreen : styles.staticBlock}>
      <div className={styles.staticToolbar}>
        <div className={styles.staticToolbarLeft}>
          <span className={styles.staticToolbarIcon} aria-hidden>
            <Code2 className={`${styles.iconMd} ${styles.iconCyan}`} strokeWidth={2} />
          </span>
          <span className={styles.staticToolbarLang}>{language}</span>
        </div>
        <div className={styles.staticToolbarRight}>
          <button type="button" onClick={handleCopy} className={styles.btnCopyStatic} aria-label="Copy code">
            <Copy className={`${styles.iconMd} ${styles.iconCopyOpacity}`} strokeWidth={2} />
            <span className={styles.staticToolbarBtnLabel}>{copyDone ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileEditorOpen(true);
              setIsFullscreen(true);
            }}
            className={styles.btnOpenEditor}
            aria-label="Open editor fullscreen"
          >
            <Code2 className={styles.iconMd} strokeWidth={2} />
            <span className={styles.staticToolbarBtnLabel}>Open editor</span>
          </button>
        </div>
      </div>
      <div className={styles.staticCodeWrap} style={{ minHeight: 140, maxHeight: 320 }}>
        {HIGHLIGHT_LANGUAGES.has(normalizedLang === "react" ? "tsx" : normalizedLang) ? (
          <Highlight theme={themes.vsDark} code={currentCode} language={normalizedLang === "react" ? "tsx" : normalizedLang}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${styles.staticPre} ${className}`} style={{ ...style, margin: 0, minHeight: "100%", boxSizing: "border-box" }}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        ) : (
          <pre className={styles.staticPre}>
            <code>{currentCode}</code>
          </pre>
        )}
      </div>
    </div>
  );

  const isResizableDesktop = isRunnable && !isKotlin && !showStaticBlock && !isMobile;
  const editorSection = !showStaticBlock && (
    <div
      className={isFullscreen ? styles.editorSectionFullscreen : styles.editorSection}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: isFullscreen ? undefined : isResizableDesktop ? 0 : (isMobile ? 200 : editorHeightNum),
        flex: isResizableDesktop ? 1 : undefined,
        maxHeight: isMobile && !isFullscreen ? "none" : undefined,
      }}
    >
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {enableMultiFile ? (
            <div className={styles.toolbarFiles}>
              {files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFileIndex(idx)}
                  className={idx === activeFileIndex ? styles.toolbarFileActive : styles.toolbarFile}
                >
                  <span>{file.name}</span>
                  {files.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className={styles.toolbarFileRemove}
                      aria-label="Remove file"
                    >
                      <X className={styles.iconSm} />
                    </button>
                  )}
                </button>
              ))}
              <button onClick={addFile} className={styles.toolbarFileAdd} aria-label="Add new file">
                <FilePlus className={styles.iconSm} />
                <span>New File</span>
              </button>
            </div>
          ) : (
            <>
              <div className={styles.toolbarLangBadge}>
                <span className={styles.toolbarLangDot} aria-hidden />
                <span className={styles.toolbarLangLabel}>{enableMultiFile && currentFile ? currentFile.name : language}</span>
              </div>
              {exampleVariant && (
                <span
                  className={exampleVariant === "bad" ? styles.toolbarExampleBadgeBad : styles.toolbarExampleBadgeGood}
                  aria-label={exampleBadgeLabel ?? (exampleVariant === "bad" ? "Example to avoid" : "Recommended example")}
                >
                  {exampleVariant === "bad" ? <XCircle className={styles.toolbarExampleBadgeIcon} strokeWidth={2} /> : <Check className={styles.toolbarExampleBadgeIcon} strokeWidth={2.5} />}
                  <span className={styles.toolbarExampleBadgeLabel}>{exampleBadgeLabel ?? (exampleVariant === "bad" ? "Evitar" : "Recomendado")}</span>
                </span>
              )}
            </>
          )}
        </div>
        <div className={styles.toolbarRight}>
          {isMobile && (
            <button
              type="button"
              onClick={() => {
                setMobileEditorOpen(false);
                if (isFullscreen) setIsFullscreen(false);
              }}
              className={styles.btnClose}
              aria-label="Close editor"
            >
              <X className={styles.iconMd} strokeWidth={2} />
              <span className={styles.toolbarBtnLabel}>Close</span>
            </button>
          )}
          {!isMobile && !compactToolbar && (
            <>
              <div className={styles.fontSizeGroup} role="group" aria-label="Font size">
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.max(10, s - 1))}
                  aria-label="Decrease font size"
                  className={styles.fontSizeBtn}
                >
                  <Minus className={styles.iconSm} strokeWidth={2.5} />
                </button>
                <span className={styles.fontSizeValue} aria-hidden>
                  {fontSize}
                </span>
                <button
                  type="button"
                  onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                  aria-label="Increase font size"
                  className={styles.fontSizeBtn}
                >
                  <Plus className={styles.iconSm} strokeWidth={2.5} />
                </button>
              </div>
              <span className={styles.toolbarDivider} aria-hidden />
            </>
          )}
          <button
            onClick={handleCopy}
            aria-label="Copy code"
            className={`${styles.btnCopy} ${isMobile ? styles.btnCopyMinWidth : ""}`}
          >
            <Copy className={`${styles.iconSm} ${styles.iconCopyOpacity}`} strokeWidth={2} />
            <span className={styles.toolbarBtnLabel}>{copyDone ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            onClick={handleSelectAll}
            aria-label="Select all"
            className={styles.btn}
            title="Select all"
          >
            <MousePointer2 className={styles.iconSm} strokeWidth={2} />
            {!isMobile && <span className={styles.toolbarBtnLabel}>Select all</span>}
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={handlePaste}
              aria-label="Paste"
              className={styles.btn}
              title="Paste"
            >
              <ClipboardPaste className={styles.iconSm} strokeWidth={2} />
              {!isMobile && <span className={styles.toolbarBtnLabel}>Paste</span>}
            </button>
          )}
          {/* Reset — desktop non-compact, always visible */}
          {!isMobile && !compactToolbar && (
            <button type="button" onClick={handleReset} aria-label="Reset code" className={styles.btnReset}>
              <RotateCcw className={styles.iconSm} strokeWidth={2} />
              Reset
            </button>
          )}
          {/* Maximize — desktop compact, always visible */}
          {!isMobile && compactToolbar && (
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className={styles.btnMaximize}
            >
              {isFullscreen ? <Minimize2 className={styles.iconSm} strokeWidth={2} /> : <Maximize2 className={styles.iconSm} strokeWidth={2} />}
              {isFullscreen ? "Exit" : "Maximize"}
            </button>
          )}
          {/* Tertiary menu — desktop compact, always visible */}
          {!isMobile && compactToolbar && (
            <div className={styles.mobileMenuWrap}>
              <button
                ref={tertiaryMenuButtonRef}
                type="button"
                onClick={() => setTertiaryMenuOpen((v) => !v)}
                className={styles.btnTertiary}
                aria-label="More options"
                aria-expanded={tertiaryMenuOpen}
              >
                <MoreVertical className={styles.iconSm} strokeWidth={2} />
              </button>
              {tertiaryMenuOpen && tertiaryMenuRect && !isFullscreen && typeof document !== "undefined" &&
                createPortal(
                  <>
                    <div className={styles.tertiaryMenuBackdropPortal} aria-hidden onClick={() => setTertiaryMenuOpen(false)} />
                    <div
                      className={styles.tertiaryMenuDropdownPortal}
                      style={{
                        position: "fixed",
                        top: tertiaryMenuRect.bottom + 4,
                        right: window.innerWidth - tertiaryMenuRect.right,
                      }}
                    >
                      <div className={styles.mobileMenuDropdown}>
                        <button type="button" onClick={() => { handleSelectAll(); setTertiaryMenuOpen(false); }} className={styles.mobileMenuItem}>
                          <MousePointer2 className={styles.iconMd} /> Select all
                        </button>
                        {!readOnly && (
                          <button type="button" onClick={() => { handlePaste(); setTertiaryMenuOpen(false); }} className={styles.mobileMenuItem}>
                            <ClipboardPaste className={styles.iconMd} /> Paste
                          </button>
                        )}
                        <button type="button" onClick={() => { handleReset(); setTertiaryMenuOpen(false); }} className={styles.mobileMenuItem}>
                          <RotateCcw className={styles.iconMd} /> Reset
                        </button>
                        <div className={styles.mobileMenuItemFontSize}>
                          <span className={styles.mobileMenuItemLabel}>Font size</span>
                          <div className={styles.fontSizeGroup}>
                            <button type="button" onClick={() => setFontSize((s) => Math.max(10, s - 1))} aria-label="Decrease font size" className={styles.fontSizeBtn}>
                              <Minus className={styles.iconSm} strokeWidth={2.5} />
                            </button>
                            <span className={styles.fontSizeValue}>{fontSize}</span>
                            <button type="button" onClick={() => setFontSize((s) => Math.min(24, s + 1))} aria-label="Increase font size" className={styles.fontSizeBtn}>
                              <Plus className={styles.iconSm} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>,
                  document.body
                )}
            </div>
          )}
          {/* Mobile dropdown — always visible */}
          {isMobile && (
            <div className={styles.mobileMenuWrap}>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className={styles.mobileMenuBtn}
                aria-label="More options"
                aria-expanded={mobileMenuOpen}
              >
                <ChevronDown className={styles.iconMd} strokeWidth={2} />
              </button>
              {mobileMenuOpen && (
                <>
                  <div className={styles.mobileMenuBackdrop} aria-hidden onClick={() => setMobileMenuOpen(false)} />
                  <div className={styles.mobileMenuDropdown}>
                    <button
                      type="button"
                      onClick={() => { handleSelectAll(); setMobileMenuOpen(false); }}
                      className={styles.mobileMenuItem}
                    >
                      <MousePointer2 className={styles.iconMd} /> Select all
                    </button>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => { handlePaste(); setMobileMenuOpen(false); }}
                        className={styles.mobileMenuItem}
                      >
                        <ClipboardPaste className={styles.iconMd} /> Paste
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { handleReset(); setMobileMenuOpen(false); }}
                      className={styles.mobileMenuItem}
                    >
                      <RotateCcw className={styles.iconMd} /> Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsFullscreen(true); setMobileMenuOpen(false); }}
                      className={styles.mobileMenuItem}
                    >
                      <Maximize2 className={styles.iconMd} /> Fullscreen
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {/* Run buttons — editable only */}
          {!readOnly && (
            <>
              {!isMobile && !compactToolbar && !isKotlin && (
                <button
                  type="button"
                  onClick={runCode}
                  disabled={isRunning}
                  aria-label={isRunning ? "Running" : "Run code"}
                  className={`${styles.btnRun} ${isRunning ? styles.btnRunRunning : ""}`}
                >
                  <Play className={styles.iconSm} fill="currentColor" strokeWidth={2} />
                  <span className={styles.toolbarBtnLabel}>{isRunning ? "Running…" : "Run"}</span>
                  <kbd className={styles.btnRunKbd}>⌘↵</kbd>
                </button>
              )}
              {isMobile && !isKotlin && (
                <button
                  type="button"
                  onClick={runCode}
                  disabled={isRunning}
                  aria-label={isRunning ? "Running" : "Run code"}
                  className={styles.btnRunMobile}
                >
                  <Play className={styles.iconMd} fill="currentColor" strokeWidth={2} />
                  <span>{isRunning ? "…" : "Run"}</span>
                </button>
              )}
            </>
          )}
          {!isMobile && !compactToolbar && (
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className={styles.btnMaximize}
            >
              {isFullscreen ? <Minimize2 className={styles.iconSm} strokeWidth={2} /> : <Maximize2 className={styles.iconSm} strokeWidth={2} />}
              {isFullscreen ? "Exit" : "Maximize"}
            </button>
          )}
        </div>
      </div>

      <div
        className={styles.editorArea}
        style={{
          minHeight: isFullscreen ? "40vh" : undefined,
          maxHeight: isFullscreen ? undefined : isResizableDesktop ? "none" : (isMobile ? 320 : effectiveMaxCodeHeight),
        }}
      >
        <div
          ref={editorContainerRef}
          className={styles.editorContainer}
          style={{
            width: "100%",
            maxWidth: "100%",
            ...(isFullscreen ? { minHeight: 300, height: "100%" } : {}),
          }}
        >
          <MonacoEditor
            height={
              isFullscreen
                ? fullscreenEditorHeight
                : isMobile
                  ? mobileEditorHeight
                  : isResizableDesktop && editorAreaHeight != null
                    ? editorAreaHeight
                    : Math.min(editorHeightNum, effectiveMaxCodeHeight)
            }
            language={isReactLike ? "typescript" : (enableMultiFile && currentFile ? currentFile.language : normalizedLang)}
            path={isKotlin ? `kotlin-${uniqueId.replace(/:/g, "")}.kt` : (enableMultiFile && currentFile ? currentFile.name : `App-${uniqueId.replace(/:/g, "")}.tsx`)}
            value={currentCode}
            onChange={(value) => {
              const next = value || "";
              updateFileContent(activeFileIndex, next);
            }}
            options={editorOptions}
            beforeMount={handleBeforeMount}
            onMount={handleEditorMount}
            theme="vs-dark"
          />
        </div>
      </div>
    </div>
  );

  const previewColContent = (
    <>
      <div className={styles.previewBody}>
        {!outputHtml ? (
          <div className={styles.previewEmpty}>
            <div className={styles.previewEmptyIconWrap}>
              <Play className={`${styles.previewEmptyIcon} ${styles.previewEmptyIconSm}`} strokeWidth={2} />
            </div>
            <p className={styles.previewEmptyText}>Run the code to see the preview</p>
            <p className={styles.previewEmptyHint}>Press Run or ⌘↵</p>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="playground-preview"
            sandbox="allow-scripts allow-same-origin"
            srcDoc={outputHtml}
            className={styles.previewIframe}
          />
        )}
        {error && (
          <div className={styles.previewError}>
            <AlertCircle className={styles.previewErrorIcon} strokeWidth={2} />
            <p className={styles.previewErrorText}>{error}</p>
          </div>
        )}
      </div>
    </>
  );

  const consoleColContent = (
    <div className={styles.previewBody}>
      {logs.length === 0 ? (
        <div className={styles.previewEmpty}>
          <Terminal className={`${styles.consoleEmptyIcon} ${styles.consoleEmptyIconLg}`} strokeWidth={1.5} />
          <p className={styles.previewEmptyText}>Logs will appear here</p>
          <p className={styles.previewEmptyHint}>console.log, warnings, errors</p>
        </div>
      ) : (
        <div className={styles.consoleLogs}>
          {logs.map((line, idx) => (
            <div key={`${line}-${idx}`} className={styles.consoleLine}>
              <span className={styles.consoleLineNum}>{idx + 1}</span>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const mobileBothCollapsed = previewCollapsed && consoleCollapsed;
  const previewSection =
    isRunnable && !isKotlin ? (
      <div
        className={isFullscreen ? styles.previewSectionFullscreen : styles.previewSection}
        style={isFullscreen && mobileBothCollapsed ? { flex: "0 0 auto" } : undefined}
      >
        <div
          className={isFullscreen ? styles.previewGridFullscreen : styles.previewGrid}
          style={isFullscreen && mobileBothCollapsed ? { flex: "0 0 auto" } : undefined}
        >
          <div className={styles.previewCol} style={previewCollapsed ? { minHeight: 0 } : undefined}>
            <div
              className={styles.previewHeader}
              style={{ cursor: "pointer" }}
              onClick={() => setPreviewCollapsed((c) => !c)}
              title={previewCollapsed ? "Expand Preview" : "Collapse Preview"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPreviewCollapsed((c) => !c); } }}
              aria-expanded={!previewCollapsed}
            >
              <Monitor className={`${styles.iconSm} ${styles.iconCyanMuted}`} strokeWidth={2} />
              <span className={styles.previewHeaderLabel}>Preview</span>
              {previewCollapsed ? (
                <ChevronDown className={styles.iconSm} style={{ marginLeft: "auto" }} aria-hidden />
              ) : (
                <ChevronUp className={styles.iconSm} style={{ marginLeft: "auto" }} aria-hidden />
              )}
            </div>
            {!previewCollapsed && previewColContent}
          </div>
          <div className={styles.previewColConsole} style={consoleCollapsed ? { minHeight: 0 } : undefined}>
            <div
              className={styles.previewHeader}
              style={{ cursor: "pointer" }}
              onClick={() => setConsoleCollapsed((c) => !c)}
              title={consoleCollapsed ? "Expand Console" : "Collapse Console"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setConsoleCollapsed((c) => !c); } }}
              aria-expanded={!consoleCollapsed}
            >
              <Terminal className={`${styles.iconSm} ${styles.iconEmerald}`} strokeWidth={2} />
              <span className={styles.previewHeaderLabel}>Console</span>
              {logs.length > 0 && (
                <span className={styles.previewHeaderBadge}>{logs.length}</span>
              )}
              {consoleCollapsed ? (
                <ChevronDown className={styles.iconSm} style={{ marginLeft: "auto" }} aria-hidden />
              ) : (
                <ChevronUp className={styles.iconSm} style={{ marginLeft: "auto" }} aria-hidden />
              )}
            </div>
            {!consoleCollapsed && consoleColContent}
          </div>
        </div>
      </div>
    ) : null;

  const useResizableLayout = isRunnable && !isKotlin && !showStaticBlock && !isMobile;
  const bothPanelsCollapsed = previewCollapsed && consoleCollapsed;

  const bottomPanelWithResize = useResizableLayout && (
    <div
      className={`${styles.resizableBottomPanel} ${bothPanelsCollapsed ? styles.resizableBottomPanelCollapsed : ""}`}
      style={{
        flex: bothPanelsCollapsed ? "0 0 auto" : `0 0 ${(1 - editorPanelRatio) * 100}%`,
        minHeight: bothPanelsCollapsed ? 36 : 120,
        height: bothPanelsCollapsed ? 36 : undefined,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <div
        className={`${previewCollapsed ? styles.previewColCollapsed : styles.previewColResizable} ${bothPanelsCollapsed ? styles.previewColCollapsedBar : ""}`}
        style={{
          width: previewCollapsed ? (bothPanelsCollapsed ? undefined : 40) : `${previewConsoleRatio * 100}%`,
          flex: previewCollapsed && bothPanelsCollapsed ? 1 : undefined,
          minWidth: previewCollapsed ? (bothPanelsCollapsed ? 0 : 40) : 120,
        }}
      >
        <div
          className={styles.previewHeader}
          style={{ cursor: "pointer" }}
          onClick={() => setPreviewCollapsed((c) => !c)}
          title={previewCollapsed ? "Expand Preview" : "Collapse Preview"}
        >
          <Monitor className={`${styles.iconSm} ${styles.iconCyanMuted}`} strokeWidth={2} />
          <span className={styles.previewHeaderLabel}>Preview</span>
          {previewCollapsed ? (
            <ChevronDown className={styles.iconSm} style={{ marginLeft: "auto" }} aria-hidden />
          ) : (
            <ChevronUp className={styles.iconSm} style={{ marginLeft: "auto" }} aria-hidden />
          )}
        </div>
        {!previewCollapsed && previewColContent}
      </div>
      {!previewCollapsed && !consoleCollapsed && (
        <div
          className={styles.resizerHorizontal}
          onMouseDown={handleHorizontalResize}
          title="Drag to resize"
          aria-label="Resize Preview and Console"
        />
      )}
      <div
        className={`${consoleCollapsed ? styles.previewColCollapsed : styles.previewColResizable} ${bothPanelsCollapsed ? styles.previewColCollapsedBar : ""}`}
        style={{
          flex: consoleCollapsed ? (bothPanelsCollapsed ? 1 : "none") : 1,
          width: consoleCollapsed ? (bothPanelsCollapsed ? undefined : 40) : undefined,
          minWidth: consoleCollapsed ? (bothPanelsCollapsed ? 0 : 40) : 120,
        }}
      >
        <div
          className={styles.previewHeader}
          style={{ cursor: "pointer" }}
          onClick={() => setConsoleCollapsed((c) => !c)}
          title={consoleCollapsed ? "Expand Console" : "Collapse Console"}
        >
          <Terminal className={`${styles.iconSm} ${styles.iconEmerald}`} strokeWidth={2} />
          <span className={styles.previewHeaderLabel}>Console</span>
          {logs.length > 0 && (
            <span className={styles.previewHeaderBadge}>{logs.length}</span>
          )}
          {consoleCollapsed ? (
            <ChevronDown className={styles.iconSm} style={{ marginLeft: "auto" }} aria-hidden />
          ) : (
            <ChevronUp className={styles.iconSm} style={{ marginLeft: "auto" }} aria-hidden />
          )}
        </div>
        {!consoleCollapsed && consoleColContent}
      </div>
    </div>
  );

  const shellHeight =
    collapsePanelsByDefault && previewCollapsed && consoleCollapsed
      ? Math.max(920, editorHeightNum + 120)
      : Math.max(640, editorHeightNum + 140);
  const rootClassName = [
    isFullscreen ? styles.rootFullscreen : styles.root,
    isMobile && compactToolbar ? styles.rootFullBleedMobile : "",
    className,
  ].filter(Boolean).join(" ");

  const shell = useResizableLayout ? (
    <div
      ref={resizableContainerRef}
      className={rootClassName}
      style={{
        ...(isFullscreen ? { height: "100%", minHeight: 0 } : { height: shellHeight, minHeight: Math.max(collapsePanelsByDefault ? 700 : 480, editorHeightNum + 100) }),
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {mobileStaticBlock}
      <div
        style={{
          flex: bothPanelsCollapsed ? "1 1 auto" : `0 0 ${editorPanelRatio * 100}%`,
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {editorSection}
      </div>
      <div
        className={styles.resizerVertical}
        onMouseDown={handleVerticalResize}
        title="Drag to resize"
        aria-label="Resize editor and output"
      />
      {bottomPanelWithResize}
    </div>
  ) : (
    <div
      className={rootClassName}
      style={isFullscreen ? { height: "100%", minHeight: 0 } : undefined}
    >
      {mobileStaticBlock}
      {editorSection}
      {previewSection}
    </div>
  );

  const mobileFloatingActionBar = isMobile && isFullscreen && mobileEditorOpen && (
    <div className={styles.floatingActionBar}>
      <button
        type="button"
        onClick={handleCopy}
        className={`${styles.floatingActionBtn} ${copyDone ? styles.floatingActionBtnActive : ""}`}
      >
        {copyDone ? <Check className={styles.iconLg} strokeWidth={2} /> : <Copy className={styles.iconLg} strokeWidth={2} />}
        <span>{copyDone ? "Copied!" : "Copy All"}</span>
      </button>
      {!readOnly && (
        <button type="button" onClick={handlePaste} className={styles.floatingActionBtn}>
          <ClipboardPaste className={styles.iconLg} strokeWidth={2} />
          <span>Paste</span>
        </button>
      )}
      <button type="button" onClick={handleSelectAll} className={styles.floatingActionBtn}>
        <MousePointer2 className={styles.iconLg} strokeWidth={2} />
        <span>Select All</span>
      </button>
      <button type="button" onClick={handleReset} className={styles.floatingActionBtn}>
        <RotateCcw className={styles.iconLg} strokeWidth={2} />
        <span>Reset</span>
      </button>
      <button
        type="button"
        onClick={() => {
          setIsFullscreen(false);
          setMobileEditorOpen(false);
        }}
        className={`${styles.floatingActionBtn} ${styles.floatingActionBtnMinimize}`}
      >
        <Minimize2 className={styles.iconLg} strokeWidth={2} />
        <span>Exit</span>
      </button>
    </div>
  );

  const fullscreenOverlay =
    showFullscreenPortal &&
    isMounted &&
    typeof document !== "undefined" &&
    createPortal(
      <motion.div
        className={styles.fullscreenPortal}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100dvh",
          minHeight: "100vh",
          maxWidth: "100vw",
          maxHeight: "100dvh",
          zIndex: 2147483647,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0b0f1a",
          isolation: "isolate",
          overflow: "hidden",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isFullscreen ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        onAnimationComplete={() => {
          if (!isFullscreen) setShowFullscreenPortal(false);
        }}
      >
        {/* Full-screen editor: fills viewport; inner has explicit height so flex children get space */}
        <motion.div
          className={styles.fullscreenInner}
          style={{
            height: "100%",
            minHeight: 0,
            padding: isMobile
              ? "env(safe-area-inset-top) 0 0 0"
              : "env(safe-area-inset-top) max(env(safe-area-inset-right), 12px) env(safe-area-inset-bottom) max(env(safe-area-inset-left), 12px)",
            position: "relative",
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          {shell}
          {/* When fullscreen, render tertiary menu here so it appears above the editor (portal to body would be behind overlay z-index) */}
          {isFullscreen && tertiaryMenuOpen && tertiaryMenuRect && (
            <>
              <div className={styles.tertiaryMenuBackdropPortal} aria-hidden onClick={() => setTertiaryMenuOpen(false)} />
              <div
                className={styles.tertiaryMenuDropdownPortal}
                style={{
                  position: "fixed",
                  top: tertiaryMenuRect.bottom + 4,
                  right: window.innerWidth - tertiaryMenuRect.right,
                  zIndex: 9999,
                }}
              >
                <div className={styles.mobileMenuDropdown}>
                  <button type="button" onClick={() => { handleSelectAll(); setTertiaryMenuOpen(false); }} className={styles.mobileMenuItem}>
                    <MousePointer2 className={styles.iconMd} /> Select all
                  </button>
                  {!readOnly && (
                    <button type="button" onClick={() => { handlePaste(); setTertiaryMenuOpen(false); }} className={styles.mobileMenuItem}>
                      <ClipboardPaste className={styles.iconMd} /> Paste
                    </button>
                  )}
                  <button type="button" onClick={() => { handleReset(); setTertiaryMenuOpen(false); }} className={styles.mobileMenuItem}>
                    <RotateCcw className={styles.iconMd} /> Reset
                  </button>
                  <div className={styles.mobileMenuItemFontSize}>
                    <span className={styles.mobileMenuItemLabel}>Font size</span>
                    <div className={styles.fontSizeGroup}>
                      <button type="button" onClick={() => setFontSize((s) => Math.max(10, s - 1))} aria-label="Decrease font size" className={styles.fontSizeBtn}>
                        <Minus className={styles.iconSm} strokeWidth={2.5} />
                      </button>
                      <span className={styles.fontSizeValue}>{fontSize}</span>
                      <button type="button" onClick={() => setFontSize((s) => Math.min(24, s + 1))} aria-label="Increase font size" className={styles.fontSizeBtn}>
                        <Plus className={styles.iconSm} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
        {mobileFloatingActionBar}
      </motion.div>,
      document.body
    );

  return (
    <>
      {showFullscreenPortal ? (
        <div className={styles.fullscreenPlaceholder} style={{ minHeight: 48 }} aria-hidden>
          Editor open in fullscreen. Use Exit or Close to return.
        </div>
      ) : (
        shell
      )}
      {fullscreenOverlay}
    </>
  );
}
