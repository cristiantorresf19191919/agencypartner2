"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  Terminal as TerminalIcon,
  CheckCircle as CheckIcon,
  Code as CodeIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import KotlinDocLessonLayout from "@/components/Layout/KotlinDocLessonLayout";
import { getCoroutinesBasicsDoc, getCoroutinesChannelsDoc, getKotlinLessonForLocale } from "@/lib/courseTranslations";
import { HighlightedCode } from "@/components/ui/HighlightedCode";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeveloperSectionFont } from "@/contexts/DeveloperSectionFontContext";
import { KOTLIN_COURSE_LESSONS, type KotlinLesson, type KotlinPracticeChallenge } from "@/lib/kotlinCourseData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";
import Link from "next/link";

const PISTON_EXECUTE_URL = "https://emkc.org/api/v2/piston/execute";

type LessonFile = { name: string; code: string; uri: string };

/** Wraps Kotlin keywords and terms in <code> for highlighting. */
function highlightKeywords(text: string, codeClass: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\b(fun|val|var)\b|main\s*\(\)|println\s*\(\)|print\s*\(\)|\{\}|[=]\s*|\$[a-zA-Z_]\w*|\$\{[^}]*\})/g;
  let lastIndex = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    parts.push(<code key={key++} className={codeClass}>{m[0]}</code>);
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : [text];
}

const KOTLIN_KEYWORDS = new Set([
  "abstract", "actual", "annotation", "as", "break", "by", "catch", "class", "companion",
  "const", "constructor", "continue", "crossinline", "data", "do", "dynamic", "else", "enum",
  "expect", "external", "final", "finally", "for", "fun", "get", "if", "import", "in",
  "infix", "init", "inline", "inner", "interface", "internal", "is", "lateinit", "noinline",
  "null", "object", "open", "operator", "out", "override", "package", "private", "protected",
  "public", "reified", "return", "sealed", "set", "super", "suspend", "tailrec", "this",
  "throw", "try", "typealias", "typeof", "val", "var", "vararg", "when", "where", "while",
]);
const KOTLIN_TYPES = new Set([
  "Boolean", "Byte", "Char", "Double", "Float", "Int", "Long", "Short", "String", "Unit", "Any", "Nothing",
]);

type KotlinToken = { type: "keyword" | "type" | "string" | "comment" | "number" | "ident"; value: string };

function tokenizeKotlinCode(code: string): KotlinToken[] {
  const tokens: KotlinToken[] = [];
  let i = 0;
  const n = code.length;
  while (i < n) {
    // Double-quoted string
    if (code[i] === '"') {
      let j = i + 1;
      while (j < n && code[j] !== '"') {
        if (code[j] === "\\") j += 2;
        else j++;
      }
      if (j < n) j++;
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Single-quoted char/string
    if (code[i] === "'") {
      let j = i + 1;
      while (j < n && code[j] !== "'") {
        if (code[j] === "\\") j += 2;
        else j++;
      }
      if (j < n) j++;
      tokens.push({ type: "string", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Line comment
    if (code[i] === "/" && code[i + 1] === "/") {
      let j = i + 2;
      while (j < n && code[j] !== "\n") j++;
      tokens.push({ type: "comment", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Block comment
    if (code[i] === "/" && code[i + 1] === "*") {
      let j = i + 2;
      while (j < n - 1 && (code[j] !== "*" || code[j + 1] !== "/")) j++;
      if (j < n - 1) j += 2;
      tokens.push({ type: "comment", value: code.slice(i, j) });
      i = j;
      continue;
    }
    // Number (integer, float, hex)
    const numMatch = code.slice(i).match(/^(0[xX][0-9a-fA-F]+[Ll]?|\d+\.\d+([eE][-+]?\d+)?[fFdD]?|\d+[lL]?|\d+)/);
    if (numMatch) {
      tokens.push({ type: "number", value: numMatch[0] });
      i += numMatch[0].length;
      continue;
    }
    // Identifier or keyword or type
    const idMatch = code.slice(i).match(/^([a-zA-Z_$][\w$]*)/);
    if (idMatch) {
      const word = idMatch[1];
      const type = KOTLIN_KEYWORDS.has(word)
        ? "keyword"
        : KOTLIN_TYPES.has(word)
          ? "type"
          : "ident";
      tokens.push({ type, value: word });
      i += word.length;
      continue;
    }
    // Single character (delimiter, operator, etc.)
    tokens.push({ type: "ident", value: code[i] });
    i++;
  }
  return tokens;
}

/** Returns React nodes for Kotlin code block with syntax highlighting. */
function highlightKotlinCode(code: string, classes: { kw: string; str: string; com: string; num: string; type: string; ident: string }): React.ReactNode[] {
  const tokens = tokenizeKotlinCode(code);
  const keyByType: Record<KotlinToken["type"], string> = {
    keyword: classes.kw,
    type: classes.type,
    string: classes.str,
    comment: classes.com,
    number: classes.num,
    ident: classes.ident,
  };
  return tokens.map((t, i) => (
    <span key={i} className={keyByType[t.type]}>
      {t.value}
    </span>
  ));
}

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={playStyles.editorLoading}>
      <div className={playStyles.loadingSpinner} />
      <p>Loading editor…</p>
    </div>
  ),
});

function normalizeOutput(s: string): string {
  return (s || "").trim().replace(/\r\n/g, "\n");
}

function registerKotlinLanguage(monaco: any) {
  if (monaco.languages.getLanguages().some((l: { id: string }) => l.id === "kotlin")) return;
  monaco.languages.register({ id: "kotlin" });
  monaco.languages.setLanguageConfiguration("kotlin", {
    comments: { lineComment: "//", blockComment: ["/*", "*/"] },
    brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });
  monaco.languages.setMonarchTokensProvider("kotlin", {
    keywords: [
      "abstract", "actual", "annotation", "as", "break", "by", "catch", "class", "companion",
      "const", "constructor", "continue", "crossinline", "data", "do", "dynamic", "else", "enum",
      "expect", "external", "final", "finally", "for", "fun", "get", "if", "import", "in",
      "infix", "init", "inline", "inner", "interface", "internal", "is", "lateinit", "noinline",
      "null", "object", "open", "operator", "out", "override", "package", "private", "protected",
      "public", "reified", "return", "sealed", "set", "super", "suspend", "tailrec", "this",
      "throw", "try", "typealias", "typeof", "val", "var", "vararg", "when", "where", "while",
    ],
    typeKeywords: [
      "Boolean", "Byte", "Char", "Double", "Float", "Int", "Long", "Short", "String", "Unit", "Any", "Nothing",
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    tokenizer: {
      root: [
        [/[a-z_$][\w$]*/, { cases: { "@keywords": "keyword", "@typeKeywords": "type", "@default": "identifier" } }],
        [/[A-Z][\w$]*/, "type.identifier"],
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
        [/'/, { token: "string.quote", bracket: "@open", next: "@stringSingle" }],
        [/\d*\.\d+([eE][\-+]?\d+)?[fFdD]?/, "number.float"],
        [/0[xX][0-9a-fA-F]+[Ll]?/, "number.hex"],
        [/\d+[lL]?/, "number"],
        [/[;,.]/, "delimiter"],
        [/[{}()\[\]]/, "@brackets"],
        [/@symbols/, "operator"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
      ],
      comment: [
        [/[^/*]+/, "comment"],
        [/\/\*/, "comment", "@push"],
        ["\\*/", "comment", "@pop"],
        [/[/*]/, "comment"],
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],
      stringSingle: [
        [/[^\\']+/, "string"],
        [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],
    },
  });
}

export default function KotlinCourseLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { locale, createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  const lesson = getKotlinLessonForLocale(locale as "en" | "es", slug);

  const [files, setFiles] = useState<LessonFile[]>([]);
  const [activeFile, setActiveFile] = useState("Main.kt");
  const [fontSize, setFontSize] = useState(14);
  const { contentFontSize } = useDeveloperSectionFont();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ passed: number; total: number; success: boolean } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePractice, setActivePractice] = useState<KotlinPracticeChallenge | null>(null);
  const [snippetOutputs, setSnippetOutputs] = useState<Record<number, { output?: string; error?: string; running?: boolean }>>({});
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);

  useEffect(() => {
    if (lesson) {
      setFiles([{ name: "Main.kt", code: lesson.defaultCode, uri: "file:///Main.kt" }]);
      setActiveFile("Main.kt");
      setError(null);
      setLogs([]);
      setSubmitResult(null);
      setShowSuccess(false);
      setActivePractice(null);
      setSnippetOutputs({});
    }
  }, [lesson?.id]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  /* Hide global FABs when course drawer is open so they don’t cover nav items */
  useEffect(() => {
    if (!sidebarCollapsed) {
      document.body.setAttribute("data-course-drawer-open", "true");
    } else {
      document.body.removeAttribute("data-course-drawer-open");
    }
    return () => document.body.removeAttribute("data-course-drawer-open");
  }, [sidebarCollapsed]);

  /* Reading mode: hide FABs when scrolling down, show when scrolling up */
  useEffect(() => {
    const threshold = 36;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop;
        const delta = y - lastScrollY;
        if (delta > threshold) {
          document.body.setAttribute("data-doc-reading-scroll", "down");
        } else if (delta < -threshold) {
          document.body.setAttribute("data-doc-reading-scroll", "up");
        }
        lastScrollY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.removeAttribute("data-doc-reading-scroll");
    };
  }, []);

  const resetToDefault = useCallback(() => {
    if (lesson) {
      const mainUri = "file:///Main.kt";
      setFiles([{ name: "Main.kt", code: lesson.defaultCode, uri: mainUri }]);
      setActiveFile("Main.kt");
      setError(null);
      setLogs([]);
      setSubmitResult(null);
      setShowSuccess(false);
      setActivePractice(null);
      const m = monacoRef.current?.monaco;
      if (m) {
        const model = m.editor.getModel(m.Uri.parse(mainUri));
        if (model) model.setValue(lesson.defaultCode);
      }
    }
  }, [lesson]);

  const loadPractice = useCallback((p: KotlinPracticeChallenge) => {
    setActivePractice(p);
    const mainUri = "file:///Main.kt";
    setFiles([{ name: "Main.kt", code: p.starterCode, uri: mainUri }]);
    setActiveFile("Main.kt");
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    const m = monacoRef.current?.monaco;
    if (m) {
      const model = m.editor.getModel(m.Uri.parse(mainUri));
      if (model) model.setValue(p.starterCode);
    }
  }, []);

  const getAllFilesContent = useCallback((): { name: string; content: string }[] => {
    const m = monacoRef.current?.monaco;
    if (m) {
      return files
        .filter((f) => f.name.endsWith(".kt"))
        .map((f) => {
          const model = m.editor.getModel(m.Uri.parse(f.uri));
          const content = model ? model.getValue() : f.code;
          return { name: f.name, content };
        })
        .filter((f) => f.content.trim().length > 0);
    }
    return files
      .filter((f) => f.name.endsWith(".kt"))
      .map((f) => ({ name: f.name, content: f.code }))
      .filter((f) => f.content.trim().length > 0);
  }, [files]);

  const runKotlin = useCallback(
    async (fileContents: { name: string; content: string }[], input: string): Promise<{ stdout: string; err?: string }> => {
      if (fileContents.length === 0) return { stdout: "", err: "No Kotlin files to run." };
      const res = await fetch(PISTON_EXECUTE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "kotlin",
          version: "*",
          files: fileContents,
          stdin: input,
          args: [],
        }),
      });
    if (!res.ok) return { stdout: "", err: `HTTP ${res.status}` };
    const d = (await res.json()) as {
      compile?: { stderr?: string; code?: number };
      run?: { stdout?: string; stderr?: string; code?: number };
      message?: string;
    };
    if (d.message) return { stdout: "", err: d.message };
    if (d.compile && d.compile.code !== 0)
      return { stdout: "", err: (d.compile.stderr || "Compilation failed").trim() };
    const run = d.run ?? {};
    if (run.code !== 0 && run.stderr)
      return { stdout: (run.stdout || "").trim(), err: run.stderr.trim() };
    return { stdout: (run.stdout || "").trim() };
  },
    []
  );

  const runSnippet = useCallback(
    async (index: number, code: string) => {
      setSnippetOutputs((prev) => ({ ...prev, [index]: { running: true } }));
      const hasMain = /fun\s+main\s*\(/.test(code);
      const content = hasMain ? code : `fun main() {\n${code}\n}`;
      const { stdout, err } = await runKotlin([{ name: "Main", content }], "");
      const needsCoroutines =
        err &&
        (/unresolved reference: kotlinx|unresolved reference: delay|unresolved reference: withContext|unresolved reference: Dispatchers/i.test(err) ||
          /suspension functions can be called only within coroutine/i.test(err));
      const friendlyError = needsCoroutines
        ? (err || "") + "\n\nThis example uses kotlinx.coroutines, which isn’t available in the inline runner. Use \"Open in Playground →\" to run it in the Kotlin Playground."
        : err;
      setSnippetOutputs((prev) => ({
        ...prev,
        [index]: { output: stdout || undefined, error: friendlyError ?? undefined, running: false },
      }));
    },
    [runKotlin]
  );

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    const fileContents = getAllFilesContent();
    if (fileContents.length === 0) {
      setError("No Kotlin files to run. Add code to Main.kt or add a file.");
      setIsRunning(false);
      return;
    }
    const hasMain = fileContents.some((f) => /fun\s+main\s*\(/.test(f.content));
    if (!hasMain) {
      setError("No 'fun main()' found. Add a main function to run.");
      setIsRunning(false);
      return;
    }
    const { stdout, err } = await runKotlin(fileContents, "");
    setLogs(stdout ? stdout.split("\n") : []);
    if (err) setError(err);
    setIsRunning(false);
  }, [getAllFilesContent, runKotlin]);

  const submitPractice = useCallback(async () => {
    if (!activePractice || !activePractice.testCases.length) return;
    setIsSubmitting(true);
    setError(null);
    setLogs([]);
    setSubmitResult(null);
    setShowSuccess(false);
    const fileContents = getAllFilesContent();
    if (fileContents.length === 0) {
      setError("No code to submit.");
      setIsSubmitting(false);
      return;
    }
    let passed = 0;
    const total = activePractice.testCases.length;
    for (const tc of activePractice.testCases) {
      const { stdout, err } = await runKotlin(fileContents, tc.input);
      if (err) {
        setError(err);
        break;
      }
      if (normalizeOutput(stdout) === normalizeOutput(tc.output)) passed++;
    }
    setSubmitResult({ passed, total, success: passed === total });
    if (passed === total) {
      setShowSuccess(true);
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (_) {}
    }
    setIsSubmitting(false);
  }, [activePractice, getAllFilesContent, runKotlin]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [runCode, isFullscreen]);

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize,
      fontLigatures: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      formatOnPaste: true,
      formatOnType: true,
    }),
    [fontSize]
  );

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
    registerKotlinLanguage(monaco);
    files.forEach((file) => {
      const uri = monaco.Uri.parse(file.uri);
      if (!monaco.editor.getModel(uri)) {
        monaco.editor.createModel(file.code, "kotlin", uri);
      }
    });
  };

  const activeFileData = files.find((f) => f.name === activeFile) || files[0];

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>{t("course-lesson-not-found")}</p>
          <Link href={createLocalizedPath("/developer-section/kotlin-course")}>{t("course-back-to-course")}</Link>
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

      <div className={playStyles.lessonLayoutWithSidebar}>
        <aside
          className={`${playStyles.courseSidebar} ${sidebarCollapsed ? playStyles.courseSidebarCollapsed : ""}`}
          aria-label="Kotlin course navigation"
        >
          <div className={playStyles.courseSidebarHeader}>
            {sidebarCollapsed ? (
              <button
                type="button"
                className={playStyles.courseSidebarToggle}
                onClick={() => setSidebarCollapsed(false)}
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <ChevronRightIcon fontSize="small" />
              </button>
            ) : (
              <>
                <div className={playStyles.courseSidebarTitle}>
                  <SchoolIcon className={playStyles.courseSidebarIcon} />
                  <span>Kotlin Course</span>
                </div>
                <button
                  type="button"
                  className={playStyles.courseSidebarClose}
                  onClick={() => setSidebarCollapsed(true)}
                  aria-label={t("course-close-menu") ?? "Close menu"}
                  title={t("course-close-menu") ?? "Close menu"}
                >
                  <CloseIcon fontSize="small" />
                </button>
              </>
            )}
          </div>
          {!sidebarCollapsed && (
            <nav className={playStyles.courseNav}>
              <ul className={playStyles.courseNavList}>
                {KOTLIN_COURSE_LESSONS.map((l, i) => {
                  const isActive = slug === l.id;
                  const translated = getKotlinLessonForLocale(locale as "en" | "es", l.id);
                  return (
                    <li key={l.id} className={playStyles.courseNavItemWrap}>
                      <Link
                        href={createLocalizedPath(`/developer-section/kotlin-course/${l.id}`)}
                        className={`${playStyles.courseNavItem} ${isActive ? playStyles.courseNavItemActive : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className={playStyles.courseNavStep}>{t("course-step")} {i + 1}</span>
                        <span className={playStyles.courseNavLabel}>{translated?.title ?? l.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </aside>

        <div className={`${playStyles.courseMain} ${!sidebarCollapsed ? playStyles.courseSidebarOpen : ""}`}>
          {!sidebarCollapsed && (
            <div
              className={playStyles.courseMainBackdrop}
              aria-hidden
              onClick={() => setSidebarCollapsed(true)}
              onKeyDown={(e) => e.key === "Escape" && setSidebarCollapsed(true)}
            />
          )}
          {/* Mobile: sticky "Chapters" bar so TOC isn’t a stranded left-edge toggle */}
          <div className={playStyles.courseChaptersBar} aria-hidden>
            <button
              type="button"
              className={playStyles.courseChaptersBarBtn}
              onClick={() => setSidebarCollapsed(false)}
              aria-label={t("course-chapters") ?? "Chapters"}
            >
              <SchoolIcon fontSize="small" />
              {t("course-chapters") ?? "Chapters"}
            </button>
          </div>
      <section className={`${playStyles.playSection} ${playStyles.playSectionStacked}`}>
        <div className={playStyles.layoutStacked}>
          {/* Full-width lesson content on top */}
          <div className={playStyles.description}>
            {lesson.id === "coroutines-basics" ? (
              <>
                <div className={playStyles.descHeader}>
                  <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                    {t("course-step")} {lesson.step}
                  </span>
                </div>
                <KotlinDocLessonLayout
                  toc={getCoroutinesBasicsDoc(locale as "en" | "es").toc}
                  blocks={getCoroutinesBasicsDoc(locale as "en" | "es").blocks}
                  runSnippet={runSnippet}
                  snippetOutputs={snippetOutputs}
                  createLocalizedPath={createLocalizedPath}
                  contentFontSize={contentFontSize}
                />
                <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {lesson.prevStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/kotlin-course/${lesson.prevStep}`)}
                      className={styles.secondaryLink}
                    >
                      ← {t("course-previous")}
                    </Link>
                  )}
                  {lesson.nextStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/kotlin-course/${lesson.nextStep}`)}
                      className={styles.secondaryLink}
                    >
                      {t("course-next")} →
                    </Link>
                  )}
                </div>
              </>
            ) : lesson.id === "coroutines-and-channels" ? (
              <>
                <div className={playStyles.descHeader}>
                  <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                    {t("course-step")} {lesson.step}
                  </span>
                </div>
                <KotlinDocLessonLayout
                  toc={getCoroutinesChannelsDoc(locale as "en" | "es").toc}
                  blocks={getCoroutinesChannelsDoc(locale as "en" | "es").blocks}
                  runSnippet={runSnippet}
                  snippetOutputs={snippetOutputs}
                  createLocalizedPath={createLocalizedPath}
                  contentFontSize={contentFontSize}
                />
                <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {lesson.prevStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/kotlin-course/${lesson.prevStep}`)}
                      className={styles.secondaryLink}
                    >
                      ← {t("course-previous")}
                    </Link>
                  )}
                  {lesson.nextStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/kotlin-course/${lesson.nextStep}`)}
                      className={styles.secondaryLink}
                    >
                      {t("course-next")} →
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
            <div className={playStyles.descHeader}>
              <span className={styles.difficulty} style={{ background: "rgba(124, 244, 255, 0.2)", color: "#7cf4ff" }}>
                {t("course-step")} {lesson.step}
              </span>
            </div>
            <div className={playStyles.contentFontWrap} style={{ fontSize: contentFontSize }}>
            <h1 className={playStyles.descTitle}>{lesson.title}</h1>

            {lesson.content.map((item, i) => {
              if (typeof item !== "string") {
                if (item.type === "image") {
                  return (
                    <figure key={i} style={{ margin: "16px 0" }}>
                      <img
                        src={item.src}
                        alt={item.alt}
                        style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                      />
                      {item.alt ? (
                        <figcaption className={playStyles.descBody} style={{ marginTop: "8px", fontSize: "13px", color: "#9fc4ff" }}>
                          {item.alt}
                        </figcaption>
                      ) : null}
                    </figure>
                  );
                }
                return null;
              }
              const s = item.trim();
              const sectionMatch = s.match(/^(In Kotlin:|Variables —|String templates —|[\s\S]+? —)\s*([\s\S]*)/);
              if (sectionMatch) {
                const [, title, body] = sectionMatch;
                return (
                  <div key={i} className={playStyles.conceptSection}>
                    <h3 className={playStyles.conceptTitle}>{title.replace(" —", "")}</h3>
                    <p className={playStyles.conceptBody}>
                      {highlightKeywords(body.trim(), playStyles.inlineCode)}
                    </p>
                  </div>
                );
              }
              if (/^We recommend\./i.test(s) || (s.length < 180 && (s.includes("by default") || s.includes("can't change")))) {
                return (
                  <div key={i} className={playStyles.callout}>
                    <span className={playStyles.calloutIcon} aria-hidden>i</span>
                    <p className={playStyles.calloutText}>
                      {highlightKeywords(s, playStyles.inlineCode)}
                    </p>
                  </div>
                );
              }
              return (
                <p key={i} className={playStyles.conceptBody}>
                  {highlightKeywords(s, playStyles.inlineCode)}
                </p>
              );
            })}

            {lesson.codeExamples.length > 0 && (
              <>
                <h4 className={playStyles.descSub} style={{ marginTop: "28px" }}>Try it — run each example</h4>
                {lesson.codeExamples.map((ex, i) => {
                  const out = snippetOutputs[i];
                  return (
                    <div key={i} className={playStyles.runnableSnippet}>
                      <div className={playStyles.runnableSnippetHead}>
                        <span className={playStyles.runnableSnippetTitle}>Example {i + 1}</span>
                        <button
                          type="button"
                          className={playStyles.snippetRunBtn}
                          disabled={out?.running}
                          onClick={() => runSnippet(i, ex.code)}
                        >
                          <PlayIcon fontSize="small" /> {out?.running ? "Running…" : "Run"}
                        </button>
                      </div>
                      <pre className={playStyles.sample} style={{ margin: 0, borderRadius: 0, border: "none" }}>
                        <code className={playStyles.codeBlock}>
                          {highlightKotlinCode(ex.code, {
                            kw: playStyles.ktKw,
                            str: playStyles.ktStr,
                            com: playStyles.ktCom,
                            num: playStyles.ktNum,
                            type: playStyles.ktType,
                            ident: playStyles.ktIdent,
                          })}
                        </code>
                      </pre>
                      {(out?.output != null || out?.error != null) && (
                        <div className={`${playStyles.snippetOutput} ${out?.error ? playStyles.snippetOutputError : ""}`}>
                          {out?.error ?? out?.output ?? ""}
                        </div>
                      )}
                      {ex.comment && (
                        <p className={playStyles.conceptBody} style={{ padding: "10px 14px", margin: 0, fontSize: "13px", color: "#9fc4ff" }}>
                          {ex.comment}
                        </p>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {lesson.practice && lesson.practice.length > 0 && (
              <>
                <h4 className={playStyles.descSub} style={{ marginTop: "28px" }}>
                  {t("course-practice")}
                </h4>
                {lesson.practice.map((p) => (
                  <div key={p.id} className={playStyles.practiceCard}>
                    <div className={playStyles.practiceCardTitle}>
                      <CheckIcon fontSize="small" /> {p.title}
                    </div>
                    <p className={playStyles.practiceCardDesc}>{p.description}</p>
                    <button
                      type="button"
                      className={playStyles.iconBtn}
                      onClick={() => loadPractice(p)}
                      style={{ marginRight: "8px" }}
                    >
                      {t("course-load-in-editor")}
                    </button>
                    {p.solution && (
                      <details style={{ marginTop: "12px" }}>
                        <summary style={{ cursor: "pointer", color: "#7cf4ff", fontSize: "13px" }}>Example solution</summary>
                        <HighlightedCode code={p.solution} language="kotlin" className={playStyles.sample} style={{ marginTop: "8px", fontSize: "12px" }} />
                      </details>
                    )}
                  </div>
                ))}
              </>
            )}

            <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {lesson.prevStep && (
                <Link
                  href={createLocalizedPath(`/developer-section/kotlin-course/${lesson.prevStep}`)}
                  className={styles.secondaryLink}
                >
                  ← {t("course-previous")}
                </Link>
              )}
              {lesson.nextStep && (
                <Link
                  href={createLocalizedPath(`/developer-section/kotlin-course/${lesson.nextStep}`)}
                  className={styles.secondaryLink}
                >
                  {t("course-next")} →
                </Link>
              )}
            </div>
            </div>
            </>
            )}
          </div>

          {/* Editor section: full width below content, extends to bottom */}
          <div className={playStyles.editorSectionBottom}>
          {(() => {
            const editorColumnContent = (
              <>
                <div className={playStyles.editorWrap}>
                  {files.length > 0 && (
                    <div className={playStyles.fileTabsRow}>
                      {files.map((file) => (
                        <button
                          key={file.name}
                          type="button"
                          className={`${playStyles.fileTab} ${file.name === activeFile ? playStyles.active : ""}`}
                          onClick={() => setActiveFile(file.name)}
                        >
                          {file.name}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={playStyles.newFileBtn}
                        onClick={() => {
                          const n = files.length + 1;
                          const name = `File${n}.kt`;
                          const fileUri = `file:///File${n}.kt`;
                          setFiles((p) => [...p, { name, code: "// New file\n", uri: fileUri }]);
                          setActiveFile(name);
                          const m = monacoRef.current?.monaco;
                          if (m) {
                            const u = m.Uri.parse(fileUri);
                            if (!m.editor.getModel(u)) {
                              m.editor.createModel("// New file\n", "kotlin", u);
                            }
                          }
                        }}
                      >
                        + New file
                      </button>
                    </div>
                  )}
                  <div className={playStyles.monacoContainer}>
                    <MonacoEditor
                      key={activeFile}
                      height="100%"
                    language="kotlin"
                    path={activeFileData?.uri ?? "file:///Main.kt"}
                    value={activeFileData?.code ?? ""}
                    onChange={(v) => {
                      const value = v ?? "";
                      if (activeFileData) {
                        setFiles((p) =>
                          p.map((f) => (f.name === activeFileData.name ? { ...f, code: value } : f))
                        );
                      }
                    }}
                    options={editorOptions}
                    onMount={handleEditorMount}
                    theme="vs-dark"
                  />
                  </div>
                </div>

                <div className={playStyles.toolbar}>
                  <span className={playStyles.contentFontSizeLabel}>Code</span>
                  <button
                    type="button"
                    className={playStyles.fontSizeBtn}
                    onClick={() => setFontSize((s) => Math.max(10, s - 2))}
                    aria-label="Decrease code font size"
                    title="Decrease code font size"
                  >
                    A−
                  </button>
                  <button
                    type="button"
                    className={playStyles.fontSizeBtn}
                    onClick={() => setFontSize((s) => Math.min(24, s + 2))}
                    aria-label="Increase code font size"
                    title="Increase code font size"
                  >
                    A+
                  </button>
                  <button type="button" className={playStyles.iconBtn} onClick={resetToDefault} aria-label="Reset">
                    <ResetIcon fontSize="small" /> Reset
                  </button>
                  <button
                    type="button"
                    className={`${playStyles.runBtn} ${isRunning ? playStyles.disabled : ""}`}
                    onClick={runCode}
                    disabled={isRunning}
                  >
                    <PlayIcon fontSize="small" /> Run
                  </button>
                  {activePractice && activePractice.testCases.length > 0 && (
                    <button
                      type="button"
                      className={`${playStyles.submitBtn} ${isSubmitting ? playStyles.disabled : ""}`}
                      onClick={submitPractice}
                      disabled={isSubmitting}
                    >
                      <CheckIcon fontSize="small" /> Submit
                    </button>
                  )}
                  <button
                    type="button"
                    className={playStyles.iconBtn}
                    onClick={() => setIsFullscreen((p) => !p)}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Maximize editor"}
                    title={isFullscreen ? "Exit fullscreen" : "Maximize editor"}
                  >
                    {isFullscreen ? (
                      <FullscreenExitIcon fontSize="small" />
                    ) : (
                      <FullscreenIcon fontSize="small" />
                    )}{" "}
                    {isFullscreen ? "Exit" : "Maximize"}
                  </button>
                </div>

                <Link
                  href={createLocalizedPath("/developer-section/kotlin-playground")}
                  className={playStyles.openInPlayground}
                >
                  Open in Playground →
                </Link>

                <div className={playStyles.outputPanel}>
                  <div className={playStyles.outputHead}>
                    <TerminalIcon fontSize="small" /> Output
                    {submitResult != null && (
                      <span className={submitResult.success ? playStyles.passLabel : playStyles.failLabel}>
                        {submitResult.passed}/{submitResult.total} passed
                      </span>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    {showSuccess && (
                      <motion.div
                        key="success"
                        className={playStyles.successBanner}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CheckIcon className={playStyles.successIcon} /> All tests passed!
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {error && <div className={playStyles.errorLine}>❌ {error}</div>}
                  <div className={playStyles.logList}>
                    {logs.length === 0 && !error && submitResult == null && (
                      <p className={playStyles.emptyLog}>Run the code to see output.</p>
                    )}
                    {logs.map((l, i) => (
                      <div key={i} className={playStyles.logLine}>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );

            const fullscreenWrapper = (
              <div className={`${playStyles.editorColumnWrap} ${playStyles.fullscreen}`}>
                {editorColumnContent}
              </div>
            );

            if (isFullscreen && typeof document !== "undefined") {
              return (
                <>
                  {createPortal(fullscreenWrapper, document.body)}
                  <div className={playStyles.editorColumnWrap} aria-hidden style={{ minHeight: 320 }} />
                </>
              );
            }

            return (
              <div className={playStyles.editorColumnWrap}>
                {editorColumnContent}
              </div>
            );
          })()}
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div className={playStyles.footerRow}>
          <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/kotlin-course")}>
            {t("course-back-to-course")}
          </Link>
          <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Developer Hub
          </Link>
        </div>
      </div>

      <Footer />
        </div>
      </div>
    </main>
  );
}
