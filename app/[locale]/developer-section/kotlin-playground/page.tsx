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
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  SelectAll as SelectAllIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { consumePendingCode } from "@/lib/playgroundHandoff";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Skeleton } from "@/components/ui/Skeleton";
import styles from "../playground/PlaygroundPage.module.css";
import type { OnMount } from "@monaco-editor/react";

const PISTON_EXECUTE_URL = "/api/execute-code";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={styles.editorLoading}>
      <Skeleton height={300} borderRadius={8} />
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

const KT_TEMPLATES = [
  {
    nameKey: "tpl-kt-hello",
    files: [{ name: "Main.kt", code: `fun main() {\n    println("Hello, World!")\n    println("Kotlin is awesome!")\n}` }],
  },
  {
    nameKey: "tpl-kt-collections",
    files: [{ name: "Main.kt", code: `fun main() {\n    val fruits = listOf("Apple", "Banana", "Cherry", "Date")\n    \n    // Filter and map\n    val longFruits = fruits.filter { it.length > 5 }.map { it.uppercase() }\n    println("Long fruits: \$longFruits")\n    \n    // Grouping\n    val byLength = fruits.groupBy { it.length }\n    println("By length: \$byLength")\n    \n    // Folding\n    val total = fruits.fold(0) { acc, fruit -> acc + fruit.length }\n    println("Total chars: \$total")\n}` }],
  },
  {
    nameKey: "tpl-kt-coroutines",
    files: [{ name: "Main.kt", code: `import kotlinx.coroutines.*\n\nfun main() = runBlocking {\n    println("Start")\n    \n    val deferred = async {\n        delay(100)\n        "Hello from coroutine!"\n    }\n    \n    println("Waiting...")\n    println(deferred.await())\n    println("Done")\n}` }],
  },
  {
    nameKey: "tpl-kt-data-classes",
    files: [{ name: "Main.kt", code: `data class User(val name: String, val age: Int, val email: String)\n\nfun main() {\n    val alice = User("Alice", 30, "alice@example.com")\n    val bob = alice.copy(name = "Bob", age = 25)\n    \n    println(alice)\n    println(bob)\n    println("Same? \${alice == bob}")\n    \n    val (name, age, email) = alice\n    println("Destructured: \$name, \$age, \$email")\n}` }],
  },
  {
    nameKey: "tpl-kt-sealed",
    files: [{ name: "Main.kt", code: `sealed class Result<out T> {\n    data class Success<T>(val data: T) : Result<T>()\n    data class Error(val message: String) : Result<Nothing>()\n    object Loading : Result<Nothing>()\n}\n\nfun fetchUser(id: Int): Result<String> {\n    return if (id > 0) Result.Success("User #\$id")\n    else Result.Error("Invalid ID")\n}\n\nfun main() {\n    val results = listOf(fetchUser(1), fetchUser(-1), Result.Loading)\n    \n    for (result in results) {\n        when (result) {\n            is Result.Success -> println("Got: \${result.data}")\n            is Result.Error -> println("Error: \${result.message}")\n            is Result.Loading -> println("Loading...")\n        }\n    }\n}` }],
  },
];

export default function KotlinPlaygroundPage() {
  const { createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const { theme: appTheme } = useTheme();
  const [showTemplates, setShowTemplates] = useState(false);
  const [files, setFiles] = useState<PlaygroundFile[]>(() =>
    defaultFiles.map((f) => ({ ...f, uri: `file:///src/${f.name}` }))
  );
  const [activeFile, setActiveFile] = useState<string>(defaultFiles[0].name);
  const [output, setOutput] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCooldown, setAiCooldown] = useState(false);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const editorRef = useRef<import("monaco-editor").editor.IStandaloneCodeEditor | null>(null);

  // Consume any kotlin code handed off from a course "Open in playground" click.
  useEffect(() => {
    const pending = consumePendingCode();
    if (!pending) return;
    const name = "Pasted.kt";
    setFiles([{ name, code: pending.code, uri: `file:///src/${name}` }]);
    setActiveFile(name);
  }, []);

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
    monaco.editor.setTheme(appTheme === "light" ? "vs" : "vs-dark");
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
    setOutput(t("kotlin-pg-running"));
    setLogs([]);

    try {
      const monaco = monacoRef.current;
      if (!monaco) {
        setError(t("kotlin-pg-editor-not-ready"));
        setOutput(t("kotlin-pg-exec-stopped"));
        setIsRunning(false);
        return;
      }

      const ktFiles = files.filter((f) => f.name.endsWith(".kt"));
      if (ktFiles.length === 0) {
        setError(t("kotlin-pg-add-kt-file"));
        setOutput(t("kotlin-pg-exec-stopped"));
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
        setError(t("kotlin-pg-empty-files"));
        setOutput(t("kotlin-pg-exec-stopped"));
        setIsRunning(false);
        return;
      }

      // Check if there's a main function
      const hasMain = fileContents.some(f => /fun\s+main\s*\(/.test(f.content));
      if (!hasMain) {
        setError(t("kotlin-pg-no-main"));
        setOutput(t("kotlin-pg-exec-stopped"));
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
        setError(errorDisplay || t("kotlin-pg-compilation-failed"));
        setOutput(t("kotlin-pg-compilation-failed"));
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
      setOutput(run.code === 0 ? t("kotlin-pg-done") : `Exit code: ${run.code ?? "—"}`);
      if (run.code !== 0 && err) setError(err);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setOutput(t("kotlin-pg-exec-stopped"));
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
    setOutput(t("kotlin-pg-reset-msg"));
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

  const requestAiReview = useCallback(async () => {
    if (aiCooldown || aiLoading) return;
    setAiLoading(true);
    setAiReview(null);
    try {
      const code = files.map((f) => `// ${f.name}\n${f.code}`).join("\n\n");
      const res = await fetch("/api/code-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "kotlin" }),
      });
      const data = await res.json();
      setAiReview(data.review || data.error || t("ai-review-error"));
    } catch {
      setAiReview(t("ai-review-error"));
    } finally {
      setAiLoading(false);
      setAiCooldown(true);
      setTimeout(() => setAiCooldown(false), 10000);
    }
  }, [files, aiCooldown, aiLoading, t]);

  const loadTemplate = useCallback((tpl: typeof KT_TEMPLATES[number]) => {
    const newFiles = tpl.files.map((f) => ({ ...f, uri: `file:///src/${f.name}` }));
    setFiles(newFiles);
    setActiveFile(newFiles[0].name);
    setShowTemplates(false);
    setLogs([]);
    setError(null);
    setOutput("");
    const monaco = monacoRef.current;
    if (monaco) {
      monaco.editor.getModels().forEach((m: { dispose: () => void }) => m.dispose());
      tpl.files.forEach((file) => {
        const uri = monaco.Uri.parse(`file:///src/${file.name}`);
        monaco.editor.createModel(file.code, "kotlin", uri);
      });
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
          <span>{t("kotlin-pg-pill")}</span>
        </div>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("kotlin-pg-title")}
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {t("kotlin-pg-subtitle")}
        </motion.p>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>
            <BoltIcon fontSize="small" />
            {t("kotlin-pg-badge-run")}
          </span>
          <span className={styles.badge}>
            <TerminalIcon fontSize="small" />
            {t("kotlin-pg-badge-output")}
          </span>
          <span className={styles.badge}>
            <FullscreenIcon fontSize="small" />
            {t("kotlin-pg-badge-multifile")}
          </span>
        </div>
      </section>

      <section className={`${styles.playgroundSection} ${isFullscreen ? styles.playgroundSectionFullscreen : ""}`}>
        <div className={`${styles.editorShell} ${isFullscreen ? styles.fullscreen : ""}`}>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <div className={styles.statusDot} />
              <span className={styles.toolbarLabel} title={t("kotlin-pg-toolbar-label")}>
                {t("kotlin-pg-toolbar-label")}
              </span>
            </div>
            <div className={styles.toolbarActions}>
              <button className={styles.iconButton} onClick={resetEditor} aria-label={t("kotlin-pg-reset")}>
                <ResetIcon fontSize="small" />
                <span>{t("kotlin-pg-reset")}</span>
              </button>
              <button
                className={`${styles.iconButton} ${aiCooldown ? styles.iconButtonDisabled : ""}`}
                onClick={requestAiReview}
                disabled={aiCooldown || aiLoading}
                aria-label={t("ai-review-btn")}
              >
                <SparklesIcon fontSize="small" />
                <span>{aiLoading ? "…" : t("ai-review-btn")}</span>
              </button>
              <button
                className={`${styles.primaryButton} ${isRunning ? styles.isRunning : ""}`}
                onClick={runCode}
                aria-label="Run code"
              >
                <PlayIcon fontSize="small" />
                <span className={styles.runLabel}>{isRunning ? t("kotlin-pg-running") : t("kotlin-pg-run")}</span>
                <span className={styles.shortcutOnly}> (⌘/Ctrl + Enter)</span>
              </button>
              <button
                className={styles.iconButton}
                onClick={() => setIsFullscreen((p) => !p)}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
                <span>{isFullscreen ? t("kotlin-pg-exit") : t("kotlin-pg-maximize")}</span>
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
                  {t("kotlin-pg-new-file")}
                </button>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <button
                    className={styles.newFileButton}
                    style={{ background: "rgba(160, 106, 249, 0.1)", borderColor: "rgba(160, 106, 249, 0.3)" }}
                    onClick={() => setShowTemplates(!showTemplates)}
                  >
                    {t("tpl-label")} &#9662;
                  </button>
                  {showTemplates && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, zIndex: 20, marginTop: 4,
                      minWidth: 180, background: "#1e1e2e", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8, padding: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
                    }}>
                      {KT_TEMPLATES.map((tpl) => (
                        <button
                          key={tpl.nameKey}
                          style={{
                            display: "block", width: "100%", textAlign: "left", padding: "8px 12px",
                            border: "none", background: "none", color: "rgba(255,255,255,0.8)",
                            fontSize: "0.8rem", borderRadius: 6, cursor: "pointer"
                          }}
                          onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "rgba(160,106,249,0.15)"; }}
                          onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "none"; }}
                          onClick={() => loadTemplate(tpl)}
                        >
                          {t(tpl.nameKey)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
              theme={appTheme === "light" ? "vs" : "vs-dark"}
            />
          </div>

          {isFullscreen && (
            <>
              <div className={styles.outputGridFullscreen}>
                <div className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div className={styles.panelTitle}>
                      <TerminalIcon fontSize="small" />
                      {t("kotlin-pg-result")}
                    </div>
                  </div>
                  <pre className={styles.panelBody}>{output || t("kotlin-pg-ready")}</pre>
                  {error != null && <div className={styles.errorBox}><pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>⚠️ {error}</pre></div>}
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div className={styles.panelTitle}>
                      <BoltIcon fontSize="small" />
                      {t("kotlin-pg-output")}
                    </div>
                    <span className={styles.panelMeta}>{logs.length ? `${logs.length}` : ""}</span>
                  </div>
                  <div className={styles.logList}>
                    {logs.length === 0 ? (
                      <p className={styles.emptyState}>{t("kotlin-pg-empty-output")}</p>
                    ) : (
                      logs.map((line, i) => (
                        <div key={`fs-${i}-${line}`} className={styles.logLine}>{line}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.floatingBar}>
                <button type="button" onClick={runCode} disabled={isRunning} className={styles.floatingBtn}>
                  <PlayIcon fontSize="small" />
                  <span>{isRunning ? t("kotlin-pg-running") : t("kotlin-pg-run")}</span>
                </button>
                <button type="button" onClick={handleCopy} className={`${styles.floatingBtn} ${copyDone ? styles.floatingBtnActive : ""}`}>
                  {copyDone ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                  <span>{copyDone ? t("kotlin-pg-copied") : t("kotlin-pg-copy-all")}</span>
                </button>
                <button type="button" onClick={handlePaste} className={styles.floatingBtn}>
                  <PasteIcon fontSize="small" />
                  <span>{t("kotlin-pg-paste")}</span>
                </button>
                <button type="button" onClick={handleSelectAll} className={styles.floatingBtn}>
                  <SelectAllIcon fontSize="small" />
                  <span>{t("kotlin-pg-select-all")}</span>
                </button>
                <button type="button" onClick={() => setIsFullscreen(false)} className={`${styles.floatingBtn} ${styles.floatingBtnExit}`}>
                  <FullscreenExitIcon fontSize="small" />
                  <span>{t("kotlin-pg-exit")}</span>
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
                {t("kotlin-pg-result")}
              </div>
              <span className={styles.panelMeta}>{t("kotlin-pg-run-status")}</span>
            </div>
            <pre className={styles.panelBody}>{output || t("kotlin-pg-ready")}</pre>
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
                {t("kotlin-pg-output")}
              </div>
              <span className={styles.panelMeta}>{logs.length ? `${logs.length} ${t("kotlin-pg-lines")}` : t("kotlin-pg-clean")}</span>
            </div>
            <div className={styles.logList}>
              {logs.length === 0 ? (
                <p className={styles.emptyState}>{t("kotlin-pg-empty-output-long")}</p>
              ) : (
                logs.map((line, i) => (
                  <div key={`${i}-${line}`} className={styles.logLine}>
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>}

        {aiReview && (
          <div className={styles.aiPanel}>
            <div className={styles.aiPanelHeader}>
              <SparklesIcon style={{ fontSize: 16 }} />
              <span>{t("ai-review-title")}</span>
              <button className={styles.aiPanelClose} onClick={() => setAiReview(null)}>×</button>
            </div>
            <div className={styles.aiPanelBody}>{aiReview}</div>
          </div>
        )}

        <div className={styles.footerActions}>
          <a className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            {t("kotlin-pg-back")}
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
