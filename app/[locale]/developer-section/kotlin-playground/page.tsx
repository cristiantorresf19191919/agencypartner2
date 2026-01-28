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
import styles from "../playground/PlaygroundPage.module.css";
import type { OnMount } from "@monaco-editor/react";

const PISTON_EXECUTE_URL = "https://emkc.org/api/v2/piston/execute";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>
      <div className={styles.loadingSpinner} />
      <p>Spinning up the Kotlin editor…</p>
    </div>
  ),
});

type PlaygroundFile = { name: string; code: string; uri?: string };

const defaultFiles: Array<Pick<PlaygroundFile, "name" | "code">> = [
  {
    name: "Main.kt",
    code: `// Kotlin Playground – Run with ⌘/Ctrl + Enter
// Use "New File" for multi-file projects. println() goes to Output.

fun main() {
    println("Hello from Kotlin!")
    val doubled = listOf(1, 2, 3).map { it * 2 }
    println("Doubled: \$doubled")
    println(greet("Kotlin Playground"))
}

`,
  },
  {
    name: "Utils.kt",
    code: `fun greet(name: String): String {
    return "Hello, \$name 👋 from Utils.kt"
}
`,
  },
];

export default function KotlinPlaygroundPage() {
  const { createLocalizedPath } = useLocale();
  const [files, setFiles] = useState<PlaygroundFile[]>(() =>
    defaultFiles.map((f) => ({ ...f, uri: `file:///src/${f.name}` }))
  );
  const [activeFile, setActiveFile] = useState<string>(defaultFiles[0].name);
  const [output, setOutput] = useState<string>("Ready. Press Run to execute via Piston.");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 14,
      fontLigatures: true,
      smoothScrolling: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      renderLineHighlight: "all" as const,
      suggest: { preview: true, showWords: true },
      quickSuggestions: true,
      tabSize: 4,
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
    defaultFiles.forEach((file) => {
      const uri = monaco.Uri.parse(`file:///src/${file.name}`);
      if (!monaco.editor.getModel(uri)) {
        monaco.editor.createModel(file.code, "kotlin", uri);
      }
    });
  };

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setOutput("Running…");
    setLogs([]);

    try {
      const monaco = monacoRef.current;
      if (!monaco) {
        setError("Editor not ready. Please wait and try again.");
        setOutput("Execution stopped.");
        setIsRunning(false);
        return;
      }

      const ktFiles = files.filter((f) => f.name.endsWith(".kt"));
      if (ktFiles.length === 0) {
        setError("Add at least one .kt file with fun main().");
        setOutput("Execution stopped.");
        setIsRunning(false);
        return;
      }

      // Get current content from Monaco models, with fallback to state
      const fileContents = ktFiles.map((f) => {
        const uri = monaco.Uri.parse(f.uri || `file:///src/${f.name}`);
        let model = monaco.editor.getModel(uri);
        
        // If model doesn't exist, try to create it from state
        if (!model && f.code) {
          model = monaco.editor.createModel(f.code, "kotlin", uri);
        }
        
        // Prefer Monaco model content (most up-to-date), fallback to state
        const content = model ? model.getValue() : f.code;
        if (!content || content.trim().length === 0) {
          return null;
        }
        return { name: f.name, content };
      }).filter((f): f is { name: string; content: string } => f !== null);

      if (fileContents.length === 0) {
        setError("All Kotlin files are empty. Add some code to run.");
        setOutput("Execution stopped.");
        setIsRunning(false);
        return;
      }

      // Check if there's a main function
      const hasMain = fileContents.some(f => /fun\s+main\s*\(/.test(f.content));
      if (!hasMain) {
        setError("No 'fun main()' found. Add a main function to run your code.");
        setOutput("Execution stopped.");
        setIsRunning(false);
        return;
      }

      const payload = {
        language: "kotlin",
        version: "*",
        files: fileContents,
        stdin: "",
        args: [],
      };

      const res = await fetch(PISTON_EXECUTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorText = res.statusText;
        try {
          const t = await res.text();
          errorText = t || errorText;
        } catch {
          // Ignore parsing errors
        }
        throw new Error(`Execution service error (${res.status}): ${errorText}`);
      }

      const data = (await res.json()) as {
        compile?: { stdout?: string; stderr?: string; code?: number };
        run: { stdout?: string; stderr?: string; code?: number };
        message?: string;
      };

      if (data.message) {
        throw new Error(data.message);
      }

      const run = data.run ?? {};
      const compile = data.compile;

      if (compile && compile.code !== 0) {
        const err = compile.stderr || compile.stdout || "Compilation failed.";
        const errorLines = err.trim().split("\n").filter(Boolean);
        // Show full error (or first 5 lines if very long)
        const errorDisplay = errorLines.length > 5 
          ? errorLines.slice(0, 5).join("\n") + "\n..." 
          : errorLines.join("\n");
        setError(errorDisplay || "Compilation failed.");
        setOutput("Compilation failed.");
        setLogs(errorLines.map((l) => `❌ ${l}`));
        setIsRunning(false);
        return;
      }

      const out = (run.stdout || "").trim();
      const err = (run.stderr || "").trim();
      const entries: string[] = [];
      if (out) entries.push(...out.split("\n").map((l) => l || " "));
      if (err) entries.push(...err.split("\n").filter(Boolean).map((l) => `⚠️ ${l}`));
      setLogs(entries.slice(-50));
      setOutput(run.code === 0 ? "Done." : `Exit code: ${run.code ?? "—"}`);
      if (run.code !== 0 && err) setError(err);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setOutput("Execution stopped.");
      setLogs((p) => [...p.slice(-48), `❌ ${msg}`]);
    } finally {
      setIsRunning(false);
    }
  }, [files]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen, runCode]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  const resetEditor = () => {
    setFiles(defaultFiles.map((f) => ({ ...f, uri: `file:///src/${f.name}` })));
    setActiveFile(defaultFiles[0].name);
    setLogs([]);
    setError(null);
    setOutput("Reset. Press Run to execute again.");
    const monaco = monacoRef.current;
    if (monaco) {
      defaultFiles.forEach((file) => {
        const uri = monaco.Uri.parse(`file:///src/${file.name}`);
        const m = monaco.editor.getModel(uri);
        if (m) m.setValue(file.code);
        else monaco.editor.createModel(file.code, "kotlin", uri);
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
          <span>Kotlin Playground</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Run Kotlin in the browser with multi-file, syntax highlighting, and autocomplete.
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          Monaco-powered Kotlin editor. Add .kt files, use println() for output, and run via Piston.
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <BoltIcon fontSize="small" />
            Run Kotlin
          </span>
          <span className={styles.badge}>
            <TerminalIcon fontSize="small" />
            Output / console
          </span>
          <span className={styles.badge}>
            <FullscreenIcon fontSize="small" />
            Multi-file
          </span>
        </div>
      </section>

      <section className={styles.playgroundSection}>
        <div className={`${styles.editorShell} ${isFullscreen ? styles.fullscreen : ""}`}>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <div className={styles.statusDot} />
              <span className={styles.toolbarLabel}>Kotlin · Monaco with syntax highlighting &amp; autocomplete</span>
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
                onClick={() => setIsFullscreen((p) => !p)}
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
                    const n = files.length + 1;
                    const name = `File${n}.kt`;
                    const uri = `file:///src/${name}`;
                    setFiles((p) => [...p, { name, code: "// New file\n", uri }]);
                    setActiveFile(name);
                    const monaco = monacoRef.current;
                    if (monaco) {
                      const u = monaco.Uri.parse(uri);
                      if (!monaco.editor.getModel(u)) {
                        monaco.editor.createModel("// New file\n", "kotlin", u);
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
              language="kotlin"
              path={activeFileData?.uri}
              defaultValue={activeFileData?.code ?? ""}
              onChange={(value) => {
                const v = value ?? "";
                setFiles((p) =>
                  p.map((f) => (f.name === activeFileData?.name ? { ...f, code: v } : f))
                );
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
              <span className={styles.panelMeta}>Run status</span>
            </div>
            <pre className={styles.panelBody}>{output}</pre>
            {error != null && (
              <div className={styles.errorBox}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>⚠️ {error}</pre>
              </div>
            )}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <BoltIcon fontSize="small" />
                Output
              </div>
              <span className={styles.panelMeta}>{logs.length ? `${logs.length} lines` : "Clean"}</span>
            </div>
            <div className={styles.logList}>
              {logs.length === 0 ? (
                <p className={styles.emptyState}>println() output and errors appear here.</p>
              ) : (
                logs.map((line, i) => (
                  <div key={`${i}-${line}`} className={styles.logLine}>
                    {line}
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
            <span className={styles.hotkeyLabel}>Run</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
