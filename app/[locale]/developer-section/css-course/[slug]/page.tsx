"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RestartAlt as ResetIcon,
  CheckCircle as CheckIcon,
  Visibility as PreviewIcon,
} from "@mui/icons-material";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { getCssLessonById } from "@/lib/cssCourseData";
import confetti from "canvas-confetti";
import styles from "../../challenges/ChallengesPage.module.css";
import playStyles from "../../challenges/[slug]/ChallengePlay.module.css";
import type { OnMount } from "@monaco-editor/react";
import Link from "next/link";
import { HighlightedCode } from "@/components/ui/HighlightedCode";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className={playStyles.editorLoading}>
      <div className={playStyles.loadingSpinner} />
      <p>Loading editor…</p>
    </div>
  ),
});

export default function CssCourseLessonPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const lesson = getCssLessonById(slug);
  const { createLocalizedPath } = useLocale();

  const [code, setCode] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [verifyMessage, setVerifyMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const monacoRef = useRef<{ editor: any; monaco: any } | null>(null);
  const uri = "file:///css-lesson.css";

  useEffect(() => {
    if (lesson) {
      setCode(lesson.defaultCode);
      setPreviewHtml("");
      setVerifyMessage(null);
      setShowSuccess(false);
    }
  }, [lesson?.id]);

  const resetToDefault = useCallback(() => {
    if (lesson) {
      setCode(lesson.defaultCode);
      setPreviewHtml("");
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
    if (!lesson?.initialHTML) return;
    const userCss = getEditorCode();
    const baseCss = lesson.initialCSS || "";
    const finalCss = `${baseCss}\n${userCss}`;
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>${finalCss}</style>
</head>
<body>
  ${lesson.initialHTML}
</body>
</html>
    `.trim();
    setPreviewHtml(fullHtml);
  }, [lesson, getEditorCode]);

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
      } catch (_) {}
    } else {
      setVerifyMessage({ type: "info", text: result.message || "Not quite. Try again." });
    }
  }, [lesson, getEditorCode]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    monacoRef.current = { editor, monaco };
    monaco.editor.setTheme("vs-dark");
  };

  if (!lesson) {
    return (
      <main className={styles.page}>
        <DeveloperHeader />
        <div className={playStyles.notFound}>
          <p>Lesson not found</p>
          <Link href={createLocalizedPath("/developer-section/css-course")}>Back to course</Link>
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
          <div className={playStyles.description}>
            <div className={playStyles.descHeader}>
              <span className={styles.difficulty} style={{ background: "rgba(245, 84, 155, 0.2)", color: "#f5549b" }}>
                Step {lesson.step}
              </span>
            </div>
            <h1 className={playStyles.descTitle}>{lesson.title}</h1>
            {lesson.content.map((paragraph, i) => (
              <p key={i} className={playStyles.descBody}>
                {paragraph}
              </p>
            ))}
            {lesson.initialHTML && (
              <>
                <h4 className={playStyles.descSub}>HTML structure (read-only)</h4>
                <HighlightedCode code={lesson.initialHTML} language="css" className={playStyles.sample} style={{ fontSize: "12px", overflow: "auto" }} />
              </>
            )}
            <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {lesson.prevStep && (
                <Link
                  href={createLocalizedPath(`/developer-section/css-course/${lesson.prevStep}`)}
                  className={styles.secondaryLink}
                >
                  ← Previous
                </Link>
              )}
              {lesson.nextStep && (
                <Link
                  href={createLocalizedPath(`/developer-section/css-course/${lesson.nextStep}`)}
                  className={styles.secondaryLink}
                >
                  Next →
                </Link>
              )}
            </div>
          </div>

          <div className={playStyles.editorColumn}>
            <div className={`${playStyles.editorWrap} code-editor-contained`}>
              <MonacoEditor
                height="100%"
                language="css"
                path={uri}
                value={code}
                onChange={(v) => setCode(v ?? "")}
                options={useMemo(
                  () => ({
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontLigatures: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                  }),
                  []
                )}
                onMount={handleEditorMount}
                theme="vs-dark"
              />
            </div>
            <div className={playStyles.toolbar}>
              <button type="button" className={playStyles.iconBtn} onClick={resetToDefault} aria-label="Reset">
                <ResetIcon fontSize="small" /> Reset
              </button>
              <button type="button" className={playStyles.runBtn} onClick={runPreview} style={{ marginRight: "8px" }}>
                <PreviewIcon fontSize="small" /> Preview
              </button>
              <button type="button" className={playStyles.submitBtn} onClick={verify}>
                <CheckIcon fontSize="small" /> Verify
              </button>
            </div>

            {previewHtml && (
              <div className={playStyles.outputPanel} style={{ marginBottom: "16px" }}>
                <div className={playStyles.outputHead}>Preview</div>
                <div style={{ padding: "12px", background: "#fff", borderRadius: "4px", minHeight: "200px", border: "1px solid rgba(0,0,0,0.1)" }}>
                  <iframe
                    title="css-preview"
                    srcDoc={previewHtml}
                    style={{ width: "100%", minHeight: "200px", border: "none", borderRadius: "4px" }}
                  />
                </div>
              </div>
            )}

            <div className={playStyles.outputPanel}>
              <div className={playStyles.outputHead}>Verify</div>
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
                <div style={{ padding: "12px", color: "#9fc4ff", fontSize: "14px" }}>{verifyMessage.text}</div>
              )}
              {!verifyMessage && <p className={playStyles.emptyLog}>Click Verify to check your solution</p>}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.footerActions}>
        <div className={playStyles.footerRow}>
          <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section/css-course")}>
            Back to course
          </Link>
          <Link className={styles.secondaryLink} href={createLocalizedPath("/developer-section")}>
            Developer Hub
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
