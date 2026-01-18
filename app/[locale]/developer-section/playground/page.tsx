"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  RestartAlt as ResetIcon,
  AutoAwesome as SparklesIcon,
  Terminal as TerminalIcon,
  Bolt as BoltIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import styles from "./PlaygroundPage.module.css";
import type { OnMount } from "@monaco-editor/react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>
      <div className={styles.loadingSpinner} />
      <p>Spinning up the editor…</p>
    </div>
  ),
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
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as typeof Function;

      let modulesRegistration = "";
      
      // We will perform a "bundle" step:
      // 1. Compile all files to CommonJS
      // 2. Wrap them in a registration function
      if (monacoRef.current) {
        const monaco = monacoRef.current;
        const workerGetter = await monaco.languages.typescript.getTypeScriptWorker();
        
        // Process all files
        for (const file of files) {
          const uri = monaco.Uri.parse(file.uri as string);
          // If the model doesn't exist in editor (e.g. freshly mounted), ensure it's synced or skip
          // Ideally we rely on monaco models being present.
          const model = monaco.editor.getModel(uri);
          
          let jsCode = "";
          if (model) {
             const client = await workerGetter(uri);
             const emit = await client.getEmitOutput(uri.toString());
             jsCode = emit.outputFiles?.[0]?.text ?? "";
          } else {
             // If for some reason model is missing but we have content (edge case), try direct transpile or skip
             // For simplicity, skip.
             continue;
          }

          // Normalize path for registry: remove file:// and src prefix for simpler requiring?
          // Let's stick to standard internal paths: "./index" etc.
          // file.name is "index.ts" -> registry key "./index"
          const moduleName = "./" + file.name.replace(/\.tsx?$/, "");
          
          // Escape backticks in code to avoid breaking the template literal
          const safeCode = jsCode.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\${/g, "\\${");

          modulesRegistration += `
            __modules["${moduleName}"] = function(exports, require, module) {
              ${safeCode}
            };
          `;
        }
      }

      // 3. Create the loader shim
      const loaderCode = `
        const __modules = {};
        const __cache = {};

        function require(path) {
          // simple path resolution
          if (!path.startsWith("./")) return; // fallback or error for external libs (not supported yet)
          
          // normalized key: support extensionless lookups
          let key = path.replace(/\\.js$/, "").replace(/\\.ts$/, "").replace(/\\.tsx$/, "");
          
          if (__cache[key]) return __cache[key].exports;
          
          const factory = __modules[key];
          if (!factory) throw new Error("Module not found: " + path);
          
          const module = { exports: {} };
          __cache[key] = module;
          
          // Execute factory
          factory(module.exports, require, module);
          return module.exports;
        }

        // Register ALL modules
        ${modulesRegistration}

        // Boot Main
        return require("./index"); 
      `;

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
        `"use strict";\n${loaderCode}`
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
      setError((err as Error).message);
      setOutput("Execution stopped.");
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
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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
          <span className={styles.badge}>
            <FullscreenIcon fontSize="small" />
            Maximize editor
          </span>
        </div>
      </section>

      <section className={styles.playgroundSection}>
        <div className={`${styles.editorShell} ${isFullscreen ? styles.fullscreen : ""}`}>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <div className={styles.statusDot} />
              <span className={styles.toolbarLabel}>TypeScript · Monaco with VS Code autocompletion</span>
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
                {isRunning ? "Running…" : "Run (⌘/Ctrl + Enter)"}
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
              value={activeFileData?.code || ""}
              onChange={(value) => {
                const next = value || "";
                setFiles((prev) =>
                  prev.map((f) => (f.name === activeFileData.name ? { ...f, code: next } : f))
                );
                if (monacoRef.current) {
                  const monaco = monacoRef.current;
                  const model = monaco.editor.getModel(monaco.Uri.parse(activeFileData.uri));
                  if (model) model.setValue(next);
                }
              }}
              options={editorOptions}
              onMount={handleEditorMount}
              theme="vs-dark"
            />
          </div>
        </div>

        <div className={styles.outputGrid}>
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
        </div>

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

