"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayArrow as PlayIcon,
  RestartAlt as ResetIcon,
  CheckCircle as CheckIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Extension as ExtensionIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from "@mui/icons-material";
// @ts-ignore
import * as Babel from "@babel/standalone";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { useLanguage } from "@/contexts/LanguageContext";
import { getReactLessonForLocale } from "@/lib/courseTranslations";
import { REACT_COURSE_LESSONS } from "@/lib/reactCourseData";
import type { LessonSection, LessonSectionTag } from "@/lib/webCourseTypes";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";
import Link from "next/link";
import { ensureEmmetJSX } from "@/lib/emmetMonaco";

/** Parse body text: **bold** and `code` into React nodes */
function parseSectionBody(body: string, inlineCodeClass: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let key = 0;
  let remaining = body;
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{remaining.slice(lastIndex, match.index)}</span>);
    }
    const raw = match[1];
    if (raw.startsWith("**") && raw.endsWith("**")) {
      parts.push(<strong key={key++}>{raw.slice(2, -2)}</strong>);
    } else if (raw.startsWith("`") && raw.endsWith("`")) {
      parts.push(<code key={key++} className={inlineCodeClass}>{raw.slice(1, -1)}</code>);
    } else {
      parts.push(<span key={key++}>{raw}</span>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < remaining.length) {
    parts.push(<span key={key++}>{remaining.slice(lastIndex)}</span>);
  }
  return parts.length > 0 ? parts : [body];
}

function sectionTagClass(tag: LessonSectionTag): string {
  switch (tag) {
    case "concept": return playStyles.sectionTagConcept;
    case "exercise": return playStyles.sectionTagExercise;
    case "tip": return playStyles.sectionTagTip;
    case "key-point": return playStyles.sectionTagKeyPoint;
    default: return playStyles.sectionTagConcept;
  }
}

function sectionIconClass(tag: LessonSectionTag): string {
  switch (tag) {
    case "concept": return playStyles.sectionIconConcept;
    case "exercise": return playStyles.sectionIconExercise;
    case "tip": return playStyles.sectionIconTip;
    case "key-point": return playStyles.sectionIconKeyPoint;
    default: return playStyles.sectionIconConcept;
  }
}

function SectionShapeIcon({ tag }: { tag: LessonSectionTag }) {
  const iconClass = sectionIconClass(tag);
  if (tag === "concept") {
    return (
      <span className={`${playStyles.sectionIcon} ${iconClass}`} aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" stroke="currentColor" strokeWidth="1.2">
          <path d="M6 1 L11 6 L6 11 L1 6 Z" />
        </svg>
      </span>
    );
  }
  if (tag === "exercise") {
    return (
      <span className={`${playStyles.sectionIcon} ${iconClass}`} aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="4" />
          <path d="M4 6 L5.5 7.5 L8 5" />
        </svg>
      </span>
    );
  }
  if (tag === "tip") {
    return (
      <span className={`${playStyles.sectionIcon} ${iconClass}`} aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 1 L7.5 4.5 L11 5 L8 8 L8.5 12 L6 10 L3.5 12 L4 8 L1 5 L4.5 4.5 Z" />
        </svg>
      </span>
    );
  }
  return (
    <span className={`${playStyles.sectionIcon} ${iconClass}`} aria-hidden>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
        <circle cx="6" cy="6" r="3" />
      </svg>
    </span>
  );
}

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={playStyles.editorLoading}>
      <div className={playStyles.loadingSpinner} />
      <p>Loading editor...</p>
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
        var exports = {}, module = { exports: exports };
        ${jsCode}
        var RootComponent = window.__APP__ || (typeof exports.default !== 'undefined' ? exports.default : null);
        if (RootComponent && window.React && window.ReactDOM) {
          var root = document.getElementById("root");
          ReactDOM.createRoot(root).render(React.createElement(RootComponent));
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
  const { locale, createLocalizedPath } = useLocale();
  const { t } = useLanguage();
  // Ensure slug is valid and get lesson - if mismatch, fallback to slug-based lookup
  let lesson = getReactLessonForLocale(locale as "en" | "es", slug);
  // #region agent log
  if (typeof window !== "undefined") {
    const urlPath = window.location.pathname;
    const urlSlug = urlPath.split("/react-course/")[1]?.split("?")[0] || "";
    console.log("[DEBUG] ReactCourseLessonPage render:", { slug, paramSlug: params?.slug, urlSlug, lessonId: lesson?.id, lessonStep: lesson?.step, url: urlPath });
    if (lesson && lesson.id !== slug) {
      console.warn("[DEBUG] Mismatch: lesson.id !== slug", { slug, lessonId: lesson.id, lessonStep: lesson.step });
    }
    if (typeof fetch !== "undefined") {
      fetch("http://127.0.0.1:7244/ingest/df3e12ed-23e9-4e47-b8f7-5cf1f84b911a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "react-course/[slug]/page.tsx:render",
          message: "slug and lesson resolution",
          data: { slug, paramSlug: params?.slug, urlSlug, lessonId: lesson?.id, lessonStep: lesson?.step, lessonTitle: lesson?.title?.slice(0, 40), url: urlPath, mismatch: lesson ? lesson.id !== slug : false },
          timestamp: Date.now(),
          sessionId: "debug-session",
          hypothesisId: "A",
        }),
      }).catch(() => { });
    }
  }
  // #endregion
  // Safeguard: if lesson doesn't match slug, try to get correct lesson from URL
  if (lesson && lesson.id !== slug && typeof window !== "undefined") {
    const urlPath = window.location.pathname;
    const urlSlug = urlPath.split("/react-course/")[1]?.split("?")[0]?.split("#")[0] || "";
    if (urlSlug && urlSlug !== slug) {
      console.warn("[DEBUG] URL slug differs from params slug, trying urlSlug:", urlSlug);
      const correctedLesson = getReactLessonForLocale(locale as "en" | "es", urlSlug);
      if (correctedLesson && correctedLesson.id === urlSlug) {
        lesson = correctedLesson;
      }
    }
  }

  const [code, setCode] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isRunningPreview, setIsRunningPreview] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editorMaximized, setEditorMaximized] = useState(false);
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

  useEffect(() => {
    if (editorMaximized) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [editorMaximized]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editorMaximized) setEditorMaximized(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editorMaximized]);

  // #region agent log
  if (typeof fetch !== "undefined" && lesson && lesson.id !== slug) {
    fetch("http://127.0.0.1:7244/ingest/df3e12ed-23e9-4e47-b8f7-5cf1f84b911a", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "react-course/[slug]/page.tsx:lessonMismatch",
        message: "lesson.id !== slug",
        data: { slug, lessonId: lesson.id, lessonStep: lesson.step },
        timestamp: Date.now(),
        sessionId: "debug-session",
        hypothesisId: "B",
      }),
    }).catch(() => { });
  }
  // #endregion

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
      } catch (_) { }
    } else {
      setVerifyMessage({ type: "info", text: result.message || t("not-quite-try-again") });
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
      fontSize: 18,
      fontLigatures: true,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      formatOnPaste: true,
      formatOnType: true,
      lineHeight: 26,
      padding: { top: 16, bottom: 16 },
      renderLineHighlight: "all" as const,
      cursorBlinking: "smooth" as const,
      cursorSmoothCaretAnimation: "on" as const,
      smoothScrolling: true,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
    }),
    []
  );

  const handleBeforeMount = (monaco: any) => {
    ensureEmmetJSX(monaco);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
    // Match CodeEditor (blog/react-patterns) so we don't get "Cannot find module 'react/jsx-runtime'"
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      noEmit: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      allowJs: true,
      allowNonTsExtensions: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      types: ["react", "react-dom"],
    });
    // Resolve react/jsx-runtime so JSX doesn't report "Cannot find module"
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module "react/jsx-runtime" {
        export function jsx(type: any, props: any, key?: string): any;
        export function jsxs(type: any, props: any, key?: string): any;
      }`,
      "file:///node_modules/react/jsx-runtime.d.ts"
    );
  };

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>{t("course-lesson-not-found")}</p>
          <Link href={createLocalizedPath("/developer-section/react-course")}>{t("course-back-to-course")}</Link>
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
          className={`${playStyles.courseSidebar} ${playStyles.courseSidebarReact} ${sidebarCollapsed ? playStyles.courseSidebarCollapsed : ""}`}
          aria-label="React course navigation"
        >
          <div className={playStyles.courseSidebarHeader}>
            <button
              type="button"
              className={playStyles.courseSidebarToggle}
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label={sidebarCollapsed ? t("sidebar-expand") : t("sidebar-collapse")}
              title={sidebarCollapsed ? t("sidebar-expand") : t("sidebar-collapse")}
            >
              {sidebarCollapsed ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
            </button>
            {!sidebarCollapsed && (
              <div className={playStyles.courseSidebarTitle}>
                <ExtensionIcon className={playStyles.courseSidebarIcon} />
                <span>{t("react-course-card-title")}</span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <nav className={playStyles.courseNav}>
              <ul className={playStyles.courseNavList}>
                {REACT_COURSE_LESSONS.map((l) => {
                  const isActive = slug === l.id;
                  // #region agent log
                  if (typeof window !== "undefined") {
                    if (isActive) {
                      console.log("[DEBUG] Sidebar active item:", { slug, listItemId: l.id, listItemStep: l.step, isActive, comparison: `${slug} === ${l.id}` });
                    }
                    if (isActive && typeof fetch !== "undefined") {
                      fetch("http://127.0.0.1:7244/ingest/df3e12ed-23e9-4e47-b8f7-5cf1f84b911a", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          location: "react-course/[slug]/page.tsx:sidebar",
                          message: "sidebar active item",
                          data: { slug, listItemId: l.id, listItemStep: l.step, isActive, url: window.location.pathname },
                          timestamp: Date.now(),
                          sessionId: "debug-session",
                          hypothesisId: "C",
                        }),
                      }).catch(() => { });
                    }
                  }
                  // #endregion
                  const translated = getReactLessonForLocale(locale as "en" | "es", l.id);
                  return (
                    <li key={l.id} className={playStyles.courseNavItemWrap}>
                      <Link
                        href={createLocalizedPath(`/developer-section/react-course/${l.id}`)}
                        className={`${playStyles.courseNavItem} ${isActive ? playStyles.courseNavItemActive : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className={playStyles.courseNavStep}>{t("course-step")} {l.step}</span>
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
          <section className={`${playStyles.playSection} ${playStyles.playSectionFullWidth}`}>
            <div className={playStyles.layoutFill}>
              <div className={playStyles.description}>
                {/* #region agent log */}
                {lesson && lesson.id !== slug && typeof window !== "undefined" && (
                  <div style={{ background: "rgba(255, 0, 0, 0.1)", padding: "8px", marginBottom: "12px", borderRadius: "4px", border: "1px solid rgba(255, 0, 0, 0.3)" }}>
                    <strong style={{ color: "#ff6b6b" }}>⚠️ Mismatch detected:</strong> URL slug "{slug}" but lesson.id is "{lesson.id}". Step {lesson.step}.
                  </div>
                )}
                {/* #endregion */}
                <div className={playStyles.descHeader}>
                  <span className={playStyles.stepPill}>
                    {t("course-step").toUpperCase()} {lesson.step}
                  </span>
                </div>
                <h1 className={playStyles.descTitle}>{lesson.title}</h1>

                {lesson.sections && lesson.sections.length > 0 ? (
                  <div className={playStyles.contentFontWrap}>
                    {lesson.sections.map((sec: LessonSection, idx: number) => (
                      <div key={idx} className={playStyles.conceptSectionCard} data-tag={sec.tag}>
                        <span className={`${playStyles.sectionTag} ${sectionTagClass(sec.tag)}`}>
                          <SectionShapeIcon tag={sec.tag} />
                          {sec.tag.replace("-", " ")}
                        </span>
                        {sec.title && <h3 className={playStyles.conceptTitle}>{sec.title}</h3>}
                        <p className={playStyles.conceptBody}>
                          {parseSectionBody(sec.body, playStyles.inlineCode)}
                        </p>
                        {sec.badges && sec.badges.length > 0 && (
                          <div className={playStyles.sectionBadges}>
                            {sec.badges.map((b) => (
                              <span key={b} className={playStyles.sectionBadge}>{b}</span>
                            ))}
                          </div>
                        )}
                        {sec.code && (
                          <pre className={playStyles.sectionCodeBlock}>
                            <code>{sec.code}</code>
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  lesson.content.map((paragraph, i) => (
                    <p key={i} className={playStyles.descBody}>
                      {paragraph}
                    </p>
                  ))
                )}

                <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {lesson.prevStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/react-course/${lesson.prevStep}`)}
                      className={styles.secondaryLink}
                    >
                      ← {t("course-previous")}
                    </Link>
                  )}
                  {lesson.nextStep && (
                    <Link
                      href={createLocalizedPath(`/developer-section/react-course/${lesson.nextStep}`)}
                      className={styles.secondaryLink}
                    >
                      {t("course-next")} →
                    </Link>
                  )}
                </div>
              </div>

              {editorMaximized && typeof document !== "undefined" &&
                createPortal(
                  <div className={`${playStyles.editorColumnWrap} ${playStyles.fullscreen}`}>
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
                          <PlayIcon fontSize="small" /> {isRunningPreview ? "..." : t("preview-label")}
                        </button>
                        <button type="button" className={playStyles.submitBtn} onClick={verify}>
                          <CheckIcon fontSize="small" /> {t("verify-button")}
                        </button>
                        <button
                          type="button"
                          className={playStyles.iconBtn}
                          onClick={() => setEditorMaximized(false)}
                          aria-label={t("exit-fullscreen")}
                          title={t("exit-fullscreen")}
                        >
                          <FullscreenExitIcon fontSize="small" /> Exit
                        </button>
                      </div>
                      {previewHtml && (
                        <div className={playStyles.outputPanel} style={{ marginBottom: "16px" }}>
                          <div className={playStyles.outputHead}>{t("preview-label")}</div>
                          <div style={{ padding: "16px", background: "linear-gradient(180deg, #0a1424, #080d1c)", borderRadius: "14px", minHeight: "300px", border: "1px solid rgba(97,218,251,0.15)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
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
                        <div className={playStyles.outputHead}>{t("verify-button")}</div>
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
                        {!verifyMessage && <p className={playStyles.emptyLog}>{t("verify-placeholder")}</p>}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              {!editorMaximized && (
                <div className={playStyles.editorColumnWrap}>
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
                        <PlayIcon fontSize="small" /> {isRunningPreview ? "..." : t("preview-label")}
                      </button>
                      <button type="button" className={playStyles.submitBtn} onClick={verify}>
                        <CheckIcon fontSize="small" /> {t("verify-button")}
                      </button>
                      <button
                        type="button"
                        className={playStyles.iconBtn}
                        onClick={() => setEditorMaximized(true)}
                        aria-label={t("maximize-editor")}
                        title={t("maximize-editor")}
                      >
                        <FullscreenIcon fontSize="small" /> Maximize
                      </button>
                    </div>
                    {previewHtml && (
                      <div className={playStyles.outputPanel} style={{ marginBottom: "16px" }}>
                        <div className={playStyles.outputHead}>{t("preview-label")}</div>
                        <div style={{ padding: "16px", background: "linear-gradient(180deg, #0a1424, #080d1c)", borderRadius: "14px", minHeight: "300px", border: "1px solid rgba(97,218,251,0.15)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                          <iframe
                            title="react-preview"
                            sandbox="allow-scripts allow-same-origin"
                            srcDoc={previewHtml}
                            style={{ width: "100%", minHeight: "280px", border: "none", borderRadius: "12px", background: "#0a1424", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)" }}
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
                      <div className={playStyles.outputHead}>{t("verify-button")}</div>
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
                      {!verifyMessage && <p className={playStyles.emptyLog}>{t("verify-placeholder")}</p>}
                    </div>
                  </div>
                </div>
              )}
              {editorMaximized && (
                <div className={playStyles.editorColumnWrap} aria-hidden style={{ minHeight: 320 }}>
                  <p style={{ padding: "12px", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
                    Editor in fullscreen. Click Exit to return.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className={styles.footerActions}>
            <div className={playStyles.footerRow}>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/react-course")}>
                {t("course-back-to-course")}
              </Link>
              <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
                Developer Hub
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
