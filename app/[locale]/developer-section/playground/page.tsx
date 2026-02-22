"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as ts from "typescript";
import { motion } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  RestartAlt as ResetIcon,
  AutoAwesome as SparklesIcon,
  Terminal as TerminalIcon,
  Bolt as BoltIcon,
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  SelectAll as SelectAllIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./PlaygroundPage.module.css";
import type { OnMount } from "@monaco-editor/react";

function PlaygroundEditorLoading() {
  const { t } = useLanguage();
  return (
    <div className={styles.editorLoading}>
      <div className={styles.loadingSpinner} />
      <p>{t("loading-editor")}</p>
    </div>
  );
}

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <PlaygroundEditorLoading />,
});

type PlaygroundFile = { name: string; code: string; uri?: string };

const defaultFiles: Array<Pick<PlaygroundFile, "name" | "code">> = [
  {
    name: "index.ts",
    code: `// Welcome to your TypeScript playground!
// Hit ⌘/Ctrl + Enter to run and see the result below.
// Create more files with "New File" to keep code organized.

import { greet } from "./utils";

const stats = {
  year: new Date().getFullYear(),
  stack: ["TypeScript", "React", "Next.js", "Monaco"],
};

console.log("Available stack:", stats.stack.join(", "));

const message = greet("Monaco dev");
console.log(message);`,
  },
  {
    name: "utils.ts",
    code: `export function greet(name: string) {
  return \`Hello, \${name} 👋 from utils.ts\`;
}
`,
  },
];

const formatValue = (value: unknown): string => {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "function") return value.toString();
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export default function PlaygroundPage() {
  const { createLocalizedPath } = useLocale();
  const [files, setFiles] = useState<PlaygroundFile[]>(() =>
    defaultFiles.map((f) => ({ ...f, uri: `file:///src/${f.name}` }))
  );
  const [activeFile, setActiveFile] = useState<string>(defaultFiles[0].name);
  const [output, setOutput] = useState<string>("Ready when you are. Press Run to execute.");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const monacoRef = useRef<any>(null);
  const editorRef = useRef<any>(null);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 14,
      fontLigatures: true,
      smoothScrolling: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderLineHighlight: "all" as const,
      suggest: {
        preview: true,
        showWords: true,
      },
      quickSuggestions: true,
      tabSize: 2,
      formatOnPaste: true,
      formatOnType: true,
    }),
    []
  );

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = editor;
    editor.focus();
    monaco.editor.setTheme("vs-dark");
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [1375], // allow top-level await
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      allowJs: true,
      module: monaco.languages.typescript.ModuleKind.CommonJS, // Changed to CommonJS
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    });

    // create models for default files if missing
    defaultFiles.forEach((file) => {
      const uri = monaco.Uri.parse(`file:///src/${file.name}`);
      if (!monaco.editor.getModel(uri)) {
        monaco.editor.createModel(file.code, "typescript", uri);
      }
    });
  };

  const appendLog = useCallback((entry: string) => {
    setLogs((prev) => [...prev.slice(-18), entry]);
  }, []);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setOutput("Running…");
    setLogs([]);

    try {
      const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor as typeof Function;

      let modulesRegistration = "";

      // We will perform a "bundle" step:
      // 1. Compile all files to CommonJS
      // 2. Wrap them in a registration function
      if (!monacoRef.current) {
        setError("Monaco editor not initialized. Please wait a moment and try again.");
        setOutput("Execution stopped.");
        setIsRunning(false);
        return;
      }

      const monaco = monacoRef.current;

      // Process all files: compile from the live model content (model.getValue()) so we
      // always use exactly what you see and get accurate TypeScript error messages.
      for (const file of files) {
        const uri = monaco.Uri.parse(file.uri || `file:///src/${file.name}`);
        let model = monaco.editor.getModel(uri);

        if (!model) {
          model = monaco.editor.createModel(file.code, "typescript", uri);
        }

        if (!model) {
          appendLog(`⚠️ Warning: Could not create model for ${file.name}`);
          continue;
        }

        const source = model.getValue();
        let jsCode: string;
        try {
          const result = ts.transpileModule(source, {
            compilerOptions: {
              module: ts.ModuleKind.CommonJS,
              target: ts.ScriptTarget.ES2020,
              esModuleInterop: true,
              moduleResolution: ts.ModuleResolutionKind.NodeJs,
            },
            reportDiagnostics: true,
            fileName: file.name,
          });
          const errs = (result.diagnostics ?? []).filter(
            (d) => d.category === ts.DiagnosticCategory.Error
          );
          if (errs.length > 0) {
            const msg = ts.flattenDiagnosticMessageText(errs[0].messageText, "\n");
            throw new Error(`Error in ${file.name}: ${msg}`);
          }
          jsCode = result.outputText;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          throw new Error(`Failed to compile ${file.name}: ${errorMsg}`);
        }

        const moduleName = "./" + file.name.replace(/\.tsx?$/, "");
        // Use JSON.stringify to safely escape the entire code string
        // This handles all special characters including template literals, quotes, backslashes, etc.
        const codeJson = JSON.stringify(jsCode);

        // Build module registration: store code as JSON string, then eval it safely
        // This avoids all escaping issues with template literals, quotes, etc.
        modulesRegistration +=
          "            __modules[" + JSON.stringify(moduleName) + "] = function(exports, require, module) {\n" +
          "              var __code = " + codeJson + ";\n" +
          "              eval(__code);\n" +
          "            };\n          ";
      }

      // 3. Create the loader shim using string concatenation to avoid template literal nesting issues
      const loaderCode =
        "        const __modules = {};\n" +
        "        const __cache = {};\n\n" +
        "        function require(path) {\n" +
        "          // simple path resolution\n" +
        "          if (!path.startsWith(\"./\")) {\n" +
        "            throw new Error(\"External modules not supported: \" + path);\n" +
        "          }\n" +
        "          \n" +
        "          // normalized key: support extensionless lookups and remove leading ./\n" +
        "          // \"./utils\" -> \"utils\", \"./utils.ts\" -> \"utils\", \"./index\" -> \"index\"\n" +
        "          let key = path.replace(/^\\.\\//, \"\").replace(/\\.js$/, \"\").replace(/\\.ts$/, \"\").replace(/\\.tsx$/, \"\");\n" +
        "          \n" +
        "          // Try with \"./\" prefix for module registry (how we register modules)\n" +
        "          const moduleKey = \"./\" + key;\n" +
        "          \n" +
        "          if (__cache[moduleKey]) return __cache[moduleKey].exports;\n" +
        "          \n" +
        "          // Try to find the factory function - check the primary key first\n" +
        "          let factory = __modules[moduleKey];\n" +
        "          \n" +
        "          // If not found, try alternative keys\n" +
        "          if (!factory) {\n" +
        "            const altKeys = [key, \"./\" + key, path];\n" +
        "            for (const altKey of altKeys) {\n" +
        "              if (__modules[altKey]) {\n" +
        "                factory = __modules[altKey];\n" +
        "                break;\n" +
        "              }\n" +
        "            }\n" +
        "          }\n" +
        "          \n" +
        "          if (!factory) {\n" +
        "            throw new Error(\"Module not found: \" + path + \" (available: \" + Object.keys(__modules).join(\", \") + \")\");\n" +
        "          }\n" +
        "          \n" +
        "          const module = { exports: {} };\n" +
        "          __cache[moduleKey] = module;\n" +
        "          \n" +
        "          // Execute factory\n" +
        "          factory(module.exports, require, module);\n" +
        "          return module.exports;\n" +
        "        }\n\n" +
        "        // Register ALL modules\n" +
        modulesRegistration + "\n" +
        "        // Boot Main - try \"./index\" first, then fallback to first file\n" +
        "        try {\n" +
        "          return require(\"./index\");\n" +
        "        } catch (err) {\n" +
        "          if (err.message.includes(\"Module not found\")) {\n" +
        "            throw new Error(\"Entry point './index' not found. Make sure you have an 'index.ts' file.\");\n" +
        "          }\n" +
        "          throw err;\n" +
        "        }\n      ";

      // Construct the function body using string concatenation to avoid template literal issues
      const functionBody = '"use strict";\n' + loaderCode;

      const runner = new AsyncFunction(
        "console",
        "setTimeout",
        "setInterval",
        "clearTimeout",
        "clearInterval",
        "fetch",
        "performance",
        "Date",
        "Math",
        functionBody
      );

      const sandboxConsole = {
        log: (...args: unknown[]) => appendLog(formatValue(args.length === 1 ? args[0] : args)),
        warn: (...args: unknown[]) => appendLog("⚠️ " + formatValue(args.length === 1 ? args[0] : args)),
        error: (...args: unknown[]) => appendLog("❌ " + formatValue(args.length === 1 ? args[0] : args)),
      };

      const result = await runner(
        sandboxConsole,
        setTimeout,
        setInterval,
        clearTimeout,
        clearInterval,
        fetch,
        performance,
        Date,
        Math
      );

      // setOutput(formatValue(result)); // Usually main doesn't return value in this setup, or it returns exports.
      // Let's just say "Execution complete" if no error.
      setOutput("Done.");

    } catch (err) {
      let errorMsg = err instanceof Error ? err.message : String(err);
      if (/invalid or unexpected token/i.test(errorMsg)) {
        errorMsg += " Often this is a syntax error (e.g. missing \")\" or \"}\"). Check for red squiggles in the editor.";
      }
      setError(errorMsg);
      setOutput("Execution stopped.");
      appendLog(`❌ Error: ${errorMsg}`);
    } finally {
      setIsRunning(false);
    }
  }, [appendLog, files]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        runCode();
      }
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, runCode]);

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

  const resetEditor = () => {
    setFiles(defaultFiles.map((f) => ({ ...f, uri: `file:///src/${f.name}` })));
    setActiveFile(defaultFiles[0].name);
    setLogs([]);
    setError(null);
    setOutput("Reset complete. Press Run to execute again.");

    if (monacoRef.current) {
      const monaco = monacoRef.current;
      defaultFiles.forEach((file) => {
        const uri = monaco.Uri.parse(`file:///src/${file.name}`);
        const model = monaco.editor.getModel(uri);
        if (model) {
          model.setValue(file.code);
        } else {
          monaco.editor.createModel(file.code, "typescript", uri);
        }
      });
    }
  };

  const handleCopy = useCallback(async () => {
    try {
      const code = files.find((f) => f.name === activeFile)?.code || "";
      await navigator.clipboard.writeText(code);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch { /* ignore */ }
  }, [files, activeFile]);

  const handlePaste = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    editor.trigger("keyboard", "editor.action.clipboardPasteAction", {});
  }, []);

  const handleSelectAll = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (model) {
      editor.setSelection(model.getFullModelRange());
      editor.focus();
    }
  }, []);

  const activeFileData = files.find((f) => f.name === activeFile) || files[0];

  return (
    <main className={styles.page}>
      <DeveloperHeader />

      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGrid} />

      <section className={styles.heroSection}>
        <div className={styles.pill}>
          <SparklesIcon fontSize="small" />
          <span>Interactive Code Lab</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Write, autocomplete, and run JavaScript like in VS Code.
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          A focused playground with Monaco-powered IntelliSense, instant execution, and fullscreen editing when you
          want zero distractions.
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <BoltIcon fontSize="small" />
            Live execution
          </span>
          <span className={styles.badge}>
            <TerminalIcon fontSize="small" />
            Console capture
          </span>
          <span className={styles.badge} data-mobile-hide>
            <FullscreenIcon fontSize="small" />
            Maximize editor
          </span>
        </div>
      </section>

      <section className={`${styles.playgroundSection} ${isFullscreen ? styles.playgroundSectionFullscreen : ""}`}>
        <div className={`${styles.editorShell} ${isFullscreen ? styles.fullscreen : ""}`}>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <div className={styles.statusDot} />
              <span className={styles.toolbarLabel} title="TypeScript · Monaco with VS Code autocompletion">
                TypeScript · Monaco with VS Code autocompletion
              </span>
            </div>
            <div className={styles.toolbarActions}>
              <button className={styles.iconButton} onClick={resetEditor} aria-label="Reset editor">
                <ResetIcon fontSize="small" />
                <span>Reset</span>
              </button>
              <button
                className={`${styles.primaryButton} ${isRunning ? styles.isRunning : ""}`}
                onClick={runCode}
                aria-label="Run code"
              >
                <PlayIcon fontSize="small" />
                <span className={styles.runLabel}>{isRunning ? "Running…" : "Run"}</span>
                <span className={styles.shortcutOnly}> (⌘/Ctrl + Enter)</span>
              </button>
              <button
                className={styles.iconButton}
                onClick={() => setIsFullscreen((prev) => !prev)}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                <span>{isFullscreen ? "Exit" : "Maximize"}</span>
              </button>
            </div>
          </div>

          <div className={styles.editorArea}>
            <div className={styles.fileTabs}>
              <div className={styles.tabList}>
                {files.map((file) => (
                  <button
                    key={file.name}
                    className={`${styles.tab} ${file.name === activeFile ? styles.activeTab : ""}`}
                    onClick={() => setActiveFile(file.name)}
                  >
                    {file.name}
                  </button>
                ))}
                <button
                  className={styles.newFileButton}
                  onClick={() => {
                    const suffix = files.length + 1;
                    const newName = `file${suffix}.ts`;
                    const uri = `file:///src/${newName}`;
                    setFiles((prev) => [...prev, { name: newName, code: "// New file\n", uri }]);
                    setActiveFile(newName);
                    if (monacoRef.current) {
                      const monaco = monacoRef.current;
                      const modelUri = monaco.Uri.parse(uri);
                      if (!monaco.editor.getModel(modelUri)) {
                        monaco.editor.createModel("// New file\n", "typescript", modelUri);
                      }
                    }
                  }}
                >
                  + New File
                </button>
              </div>
            </div>
            <MonacoEditor
              height="100%"
              language="typescript"
              path={activeFileData?.uri}
              defaultValue={activeFileData?.code || ""}
              onChange={(value) => {
                const next = value ?? "";
                setFiles((prev) =>
                  prev.map((f) => (f.name === activeFileData.name ? { ...f, code: next } : f))
                );
              }}
              options={editorOptions}
              onMount={handleEditorMount}
              theme="vs-dark"
            />
          </div>

          {isFullscreen && (
            <>
              <div className={styles.outputGridFullscreen}>
                <div className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div className={styles.panelTitle}>
                      <TerminalIcon fontSize="small" />
                      Result
                    </div>
                  </div>
                  <pre className={styles.panelBody}>{output}</pre>
                  {error && <div className={styles.errorBox}>⚠️ {error}</div>}
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div className={styles.panelTitle}>
                      <BoltIcon fontSize="small" />
                      Console
                    </div>
                    <span className={styles.panelMeta}>{logs.length ? `${logs.length}` : ""}</span>
                  </div>
                  <div className={styles.logList}>
                    {logs.length === 0 ? (
                      <p className={styles.emptyState}>Logs will show here.</p>
                    ) : (
                      logs.map((entry, idx) => (
                        <div key={`fs-${entry}-${idx}`} className={styles.logLine}>{entry}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.floatingBar}>
                <button type="button" onClick={runCode} disabled={isRunning} className={styles.floatingBtn}>
                  <PlayIcon fontSize="small" />
                  <span>{isRunning ? "Running" : "Run"}</span>
                </button>
                <button type="button" onClick={handleCopy} className={`${styles.floatingBtn} ${copyDone ? styles.floatingBtnActive : ""}`}>
                  {copyDone ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                  <span>{copyDone ? "Copied!" : "Copy All"}</span>
                </button>
                <button type="button" onClick={handlePaste} className={styles.floatingBtn}>
                  <PasteIcon fontSize="small" />
                  <span>Paste</span>
                </button>
                <button type="button" onClick={handleSelectAll} className={styles.floatingBtn}>
                  <SelectAllIcon fontSize="small" />
                  <span>Select All</span>
                </button>
                <button type="button" onClick={() => setIsFullscreen(false)} className={`${styles.floatingBtn} ${styles.floatingBtnExit}`}>
                  <FullscreenExitIcon fontSize="small" />
                  <span>Exit</span>
                </button>
              </div>
            </>
          )}
        </div>

        {!isFullscreen && <div className={styles.outputGrid}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <TerminalIcon fontSize="small" />
                Result
              </div>
              <span className={styles.panelMeta}>Awaited return value</span>
            </div>
            <pre className={styles.panelBody}>{output}</pre>
            {error && <div className={styles.errorBox}>⚠️ {error}</div>}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <BoltIcon fontSize="small" />
                Console log
              </div>
              <span className={styles.panelMeta}>{logs.length ? `${logs.length} entries` : "Clean"}</span>
            </div>
            <div className={styles.logList}>
              {logs.length === 0 ? (
                <p className={styles.emptyState}>Logs will show here. Use console.log inside your code.</p>
              ) : (
                logs.map((entry, idx) => (
                  <div key={`${entry}-${idx}`} className={styles.logLine}>
                    {entry}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>}

        <div className={styles.footerActions}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            ← Back to Developer Hub
          </a>
          <div className={styles.hotkeys}>
            <span className={styles.hotkey}>⌘/Ctrl + Enter</span>
            <span className={styles.hotkeyLabel}>Run code</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

